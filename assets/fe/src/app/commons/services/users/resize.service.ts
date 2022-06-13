import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  SCREEN_SIZE = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  }
  screenWidth$ = new BehaviorSubject(window.screen.width)

  get isXl(){
    return this.screenWidth$.getValue() >= this.SCREEN_SIZE.XL
  } 

  get isLG(){
    return this.screenWidth$.getValue() >= this.SCREEN_SIZE.LG
  } 
  get isMD(){
    return this.screenWidth$.getValue() >= this.SCREEN_SIZE.MD
  } 
  constructor() {   
  }
  
  updateScreenWidth(width: number) {
    this.screenWidth$.next(width)
  }
}
