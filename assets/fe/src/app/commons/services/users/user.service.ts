import { Injectable, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { httpHandler, httpWaiter, objIsEmpty } from 'src/app/commons/utils/helper.util';
import { encodeURL, urlsafe } from 'src/app/commons/utils/http.util';

import { Category, CategoryAverage, SubCategory, User, UserBadge } from 'src/app/commons/models/users.model';
import { API_USERS, API_USERS_ACCOUNT, API_USERS_AUTH, API_USERS_CATEGORIES, API_USERS_LOCATIONS, API_USERS_SUBCATEGORIES } from 'src/app/commons/constants/api.constant';
import { StateService } from '@uirouter/core';
import { AuthService } from "./auth.service"
import { Pagination } from '../../models/utils.model';
import { FilterSidebarComponent } from 'src/app/components/users/posters/task/_modals/filter-sidebar/filter-sidebar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private state: StateService,
    private auth: AuthService,
    private modals: NgbModal,
  ) { 
    this.runAfterUserExists(u=>{
      if (!u.photo) {
        this.user.photo = "/static/images/logo/lineLogo.png"
      }
    })
  }

  locations = [
    "Dakar",
    "Louga",
    "Saint Louis",
    "Touba"
  ]

  CATEGORY = {
    RIDE: 'ride',
    TASK: 'task',
    ALL: 'all', // all is for fetch filter purposes
  }

  TASKER = 'tasker';
  POSTER = 'poster';
  PARTNER = 'merchant';

  #user = {} as User;
  waiter = httpWaiter()

  async fetch() {
    if(this.auth.authenticated && !this.waiter.loading) {
      const [resp,err] = await this.waiter.handle(this.http.get(API_USERS_AUTH).toPromise()) 
      if (!err) {
        this.#user = resp as User;
        this.runAllFunctions(this.#user)
      }
    }
  }

  get user() {
    if(objIsEmpty(this.#user)) {
      this.fetch();
    }
    return this.#user;
  }

  set user(data: User) {
    this.#user = data;
  }

  async getCategories(params: any = {}) {
    const resp = await this.http.get<Pagination<Category>>(encodeURL(API_USERS_CATEGORIES, params))
      .toPromise();
    return resp;
  }

  async getSubcategories(params: any = {}) {
    const resp = await this.http.get<Pagination<Category>>(encodeURL(API_USERS_SUBCATEGORIES, params))
      .toPromise();
    return resp;
  }

  async getCategoriesAverage(params: any = {}) {
    const resp = await this.http.get<Pagination<CategoryAverage>>(
      encodeURL(
        urlsafe(API_USERS_CATEGORIES,'average')
        , params)
      ).toPromise();
    return resp;
  }

  getCategoriesQ = httpHandler<Category[]>({
    handler: (state)=>{
      return async (search = "", isNext = false)=>{
        if (!state.context.page) return;
        const [res,err] = await  state.handle(this.getCategories({
          page_size: 100,
          ...state.context,
          search
        }))
        if (!err) {
          if (isNext) {
            state.data.push(...res.results)
          } else {
            state.data = res.results
          }
          state.context = res;     
        }
      }
    },
    initialData: [],
    context: { page: 1 }
  })
  
  getSubcategoriesQ = httpHandler<SubCategory[]>({
    handler: (state)=>{
      return async (qs?: any, isNext = false)=>{
        if (!state.context.page) return;
        const [res,err] = await  state.handle(this.getSubcategories({
          ...state.context,
          ...qs
        }))
        if (!err) {
          if (isNext) {
            state.data.push(...res.results)
          } else {
            state.data = res.results
          }
          state.context.page = res.next;     
        }
      }
    },
    initialData: [],
    context: { page: 1, page_size: 999 }
  })

  get rideCategories(){
    if (!this.getCategoriesQ.data.length && !this.getCategoriesQ.error) { this.getCategoriesQ.run() }
    return this.getCategoriesQ.data.filter(cat=> cat.type === this.CATEGORY.RIDE)
  }

  get taskCategories(){
    if (!this.getCategoriesQ.data.length && !this.getCategoriesQ.error) { this.getCategoriesQ.run() }
    return this.getCategoriesQ.data.filter(cat=> cat.type === this.CATEGORY.TASK)
  }

  getCategoriesAverageQ = httpHandler<CategoryAverage[]>({
    handler: (state)=>{
      return async (search = "", isNext = false)=>{
        if (!state.context.page) return;
        const [res,err] = await  state.handle(this.getCategoriesAverage({
          page_size: 8,
          ...state.context
        }))
        if (!err) {
          if (isNext) {
            state.data.push(...res.results)
          } else {
            state.data = res.results
          }
          state.context = res;     
        }
      }
    },
    initialData: [],
    context: { page: 1 }
  })

  async getSubCategories(catId: number, params: any = {}) {
    const resp = await this.http.get(encodeURL(
      urlsafe(API_USERS_CATEGORIES, catId, 'subcategories'),
      params
    )).toPromise();

    return resp;
  }

  async getLocations() {
    const resp = await this.http.get(API_USERS_LOCATIONS)
      .toPromise();

    return resp;
  }

  async updateAccount(data: any){
    return await this.http.put<User>(API_USERS_ACCOUNT, data).toPromise();
  }


  userPhoto(user?: User ) {
    return user?.photo || '/static/images/logo/lineLogo.png'
  }

  vehicles(vehicle?: string ) {
    return vehicle || 'None'
  }

  defaultDescription(description?: string) {
    return description || `This tasker did not set up his/her portfolio.`
  }

  getRatingText(rate = 0): string {
    if (rate === 0) return "No reviews yet"
    else if (rate <= 2) return "Not bad" 
    else if (rate <= 3) return "Good" 
    else if (rate >= 4) return "Excellent" 
    return ""
  }


  // Forgot password
  forgotPassword(data: any) {
    return this.http.post(
      urlsafe(API_USERS,'forgot-password'),data
    ).toPromise()
  }
  resetPassword(data: any) {
    return this.http.put(
      urlsafe(API_USERS,'reset-password'),data
    ).toPromise()
  }
  forgotPasswordQ = httpHandler<null>({
    initialData: null,
    handler: (state)=>{
      return async (data: any)=>{
        const [res,err] = await state.handle(this.forgotPassword(data))
      }
    }
  })
  resetPasswordQ = httpHandler<null>({
    initialData: null,
    handler: (state)=>{
      return async (data: any)=>{
        const [res,err] = await state.handle(this.resetPassword(data))
      }
    }
  })

  // Helper
  #runFunctions: any[] = []

  private runAllFunctions(user: User): void {
    this.#runFunctions.forEach((fn: any)=> fn(user));
  }

  runAfterUserExists(...arr: [(u: User)=>void]){
    this.user
    arr.forEach((fn)=> {
      if (!objIsEmpty(this.#user))return fn(this.#user)

      this.#runFunctions.push(fn)
    })
  }

  redirectIfAccountComplete(){
    this.runAfterUserExists(u=>{
      if (!u.account_complete) return;
      this.state.go(`${u.type}-dashboard`,{},{location: 'replace'})
    })
  }
  redirectIfAccountIncomplete(){
    this.runAfterUserExists(u=>{
      if (u.account_complete) return;
      this.state.go(`${u.type === "tasker" ? "" : (u.type + "-") }getstarted`,{},{location: 'replace'})
    })
  }

  get isTasker(){
    return this.user.type === this.TASKER
  }
  get isPoster(){
    return this.user.type === this.POSTER
  }
  get isMerchant(){
    return this.user.type === this.PARTNER
  }


  // Global modals
  openFilter(temp: TemplateRef<any>){
    const ref = this.modals.open(FilterSidebarComponent,{ centered: true, animation: false })
    ref.componentInstance.filterTemplate = temp
  }
}
