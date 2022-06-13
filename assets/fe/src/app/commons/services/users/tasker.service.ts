import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { urlsafe } from 'src/app/commons/utils/http.util';
import { Profile, ProfilePhoto, Location, Schedule, Shift, PosterSummary, TaskerSummary } from 'src/app/commons/models/users.model';
import { API_TASKER, API_TASKER_GETSTARTED } from 'src/app/commons/constants/api.constant';
import { Tasker } from '../../models/tasks.model';
import { httpHandler, httpWaiter, objIsEmpty } from '../../utils/helper.util';


@Injectable({
  providedIn: 'root'
})
export class TaskerService {

  constructor(
    private http: HttpClient
  ) { }

  #info = {} as Tasker
  waiter = httpWaiter()

  async fetch() {
    if(!this.waiter.touched) {
      const [resp,err] = await this.waiter.handle(this.http.get<Tasker>(urlsafe(API_TASKER,"info")).toPromise()) 
      if (!err) {
        this.#info = resp;
        this.runAllFunctions(this.#info)
      }
    }
  }

  get info() {
    if(objIsEmpty(this.#info)) {
      this.fetch();
    }
    return this.#info;
  }

  set info(data: Tasker) {
    this.#info = data;
  }
  GETSTARTED_URL: any = {
    '1': 'getstarted-profile',
    '2': 'getstarted-photo',
    '3': 'getstarted-disclaimer',
    '4': 'getstarted-categories',
    '5': 'getstarted-location',
    '6': 'getstarted-finish',
  }

  async progress() {
    const resp = this.http.get(urlsafe(API_TASKER_GETSTARTED, 'progress'))
      .toPromise();
    return resp;
  }

  async profile(data: Profile) {
    data.tutorial_step = 1;

    const resp = await this.http.post(
      urlsafe(API_TASKER_GETSTARTED, 'profile'),
      data
    ).toPromise();

    return resp;
  }

  async photo(data: ProfilePhoto) {

    const resp = await this.http.post(
      urlsafe(API_TASKER_GETSTARTED, 'photo'),
      data
    ).toPromise();

    return resp;
  }

  async disclaimer(data: any) {
    data.tutorial_step = 3;

    const resp = await this.http.post(
      urlsafe(API_TASKER_GETSTARTED, 'disclaimer'),
      data
    ).toPromise();

    return resp;
  }

  async categories(data: any) {
    data.tutorial_step = 4;

    const resp = await this.http.post(
      urlsafe(API_TASKER_GETSTARTED, 'categories'),
      data
    ).toPromise();
    
    return resp;
  }

  async location(data: Location) {
    data.tutorial_step = 5;

    const resp = await this.http.post(
      urlsafe(API_TASKER_GETSTARTED, 'location'),
      data
    ).toPromise();
    
    return resp;
  }

  changeAvailability(data: {is_available: boolean }) {
    return this.http.patch<{is_available:  boolean}>(urlsafe(API_TASKER,"availability"),data).toPromise()
  }

  getSchedules(){
    return this.http.get<Schedule[]>(urlsafe(API_TASKER,"schedules")).toPromise()
  }

  getShifts(){
    return this.http.get<Shift[]>(urlsafe(API_TASKER,"shifts")).toPromise()
  }

  updateSchedule(data: any){
    return this.http.put(urlsafe(API_TASKER,"schedules"),data).toPromise()
  }

  updateInfo(data: any){
    return this.http.put<Tasker>(urlsafe(API_TASKER,"info"),data).toPromise()
  }

  async getSummary(){
    return await this.http.get<TaskerSummary>(urlsafe(API_TASKER, 'summary')).toPromise()
  }


  // Query Helper
  getSummaryQ = httpHandler<TaskerSummary>({
    initialData: {} as TaskerSummary,
    handler: (state)=>{
      return async ()=>{
        const [res,err] = await state.handle(this.getSummary())
        if (!err) {
          state.data = res;
        }
      }
    }
  })

  updateInfoQ = httpHandler<Tasker>({
    initialData: {} as Tasker,
    handler: (state)=>{
      return async (data: any)=>{
        const [res,err] = await state.handle(this.updateInfo(data))
        if (!err) {
          state.data = res;
          this.#info = res
        }
      }
    }
  })


  //  search histories
  historyKey = "$taskerSearch1"
  searchHistories: string[] = JSON.parse(localStorage.getItem(this.historyKey) ||"[]") 

  updateSearchHistory(){
    this.searchHistories = this.searchHistories.slice(0,5)
    localStorage.setItem(this.historyKey,JSON.stringify(this.searchHistories))
  }

  deleteHistory(index: number){
    this.searchHistories = this.searchHistories.filter((_,i)=> i !== index)
    this.updateSearchHistory()
  }
  
  addHistory(text: string){
    this.searchHistories = this.searchHistories.filter((v)=> v !== text) // Delte duplicate first
    this.searchHistories.unshift(text)
    this.updateSearchHistory()
  }

  // Helper
  #runFunctions: any[] = []

  private runAllFunctions(user: Tasker): void {
    this.#runFunctions.forEach((fn: any)=> fn(user));
  }

  runAfterInfoExists(...arr: [(u: Tasker)=>void]){
    this.info
    arr.forEach((fn)=> {
      if (!objIsEmpty(this.info))return fn(this.info)

      this.#runFunctions.push(fn)
    })
  }

  // Service Fee
  SERVICE_FEE = 0.08
  minusServiceFee(num: number){
    num = +num
    return num - this.serviceFeeDeduction(num)
  }
  serviceFeeDeduction(num: number){
    num = +num
    return num * this.SERVICE_FEE;
  }
}
