import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { STREAM_GLOBAL } from '../../constants/api.constant';
import { encodeURL, urlsafe } from '../../utils/http.util';
import { UserStatus } from 'src/app/commons/models/users.model';
import { AuthService } from './auth.service';

export interface SocketOn  {
  dispose: ()=> any,
  disposeEvent: ()=> any,
} 

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private auth: AuthService
  ) { 
    this.connect()
  }

  globalStream!: WebSocketSubject<any>;
  listeners: {[key: string]: any[]} = {

  }

  connect(){
    if (this.globalStream) return;
    
    this.globalStream =  webSocket(encodeURL(STREAM_GLOBAL,{token: this.auth.token.token}));
    this.globalStream.pipe(retry(10)).subscribe((msg)=>{
      if (msg.type === "emit") {
        this.listeners[msg.name] && this.listeners[msg.name].forEach(fn=>fn(msg.data))
      } 
    })
  }

  on(event: any, handler: (...a: any[])=> any): SocketOn {
    if (!this.globalStream) this.connect();
    if (!(event in this.listeners)) {
      this.globalStream.next({
        type: "on",
        name: event
      })
      const getEvent = this.listeners[event] || [];
      
      this.listeners[event] = [...getEvent,handler]
    }else {
      this.listeners[event].push(handler)
    }

    return {
      dispose: ()=> {
        if (event in this.listeners) {
          delete this.listeners[event];
          this.globalStream.next({type: 'dispose',name: event})
        } 
      },
      disposeEvent: ()=> {
        const listeners = this.listeners[event] 
        if (listeners) {
          const index=  listeners.indexOf(handler);
          (index > -1 ) && this.listeners[event].splice(index,1)
        }
      }
    }
  }

  emit(event: any, message: any){
    if (!this.globalStream) this.connect();
    
    this.globalStream.next({type: "emit", name: event, data: message })
  }


  // Observe user status
  getUserStatusById(id: any,cb: (msg: UserStatus)=> any){
    return this.on(`user-${id}-status`,cb)
  }
  
}