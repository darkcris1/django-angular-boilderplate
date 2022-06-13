import { FormArray } from "@angular/forms";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

/* Check if object is empty.
 */
export const objIsEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
}
  
export const usePromise = async <T>(promise: Promise<T>): Promise<[T, any]> => {
  try {
    const result = await promise;
    return [result, null]
  }
  catch (error) {
    return [null as any, error]
  }
}



// Handle loading spinner easily and error

export interface WaiterState {
  unexpected: boolean,
  notFound: boolean,
  loading: boolean,
  error: boolean,
  touched: boolean
  handle: <T>(pm: Promise<T>) => Promise<[T, any]>
  clearState: ()=> void
  onSuccess?: (data: any)=> any
  onError?: (data: any)=> any
} 



export const httpWaiter = () => {
  const defaultState  = {
    unexpected: false,
    notFound: false,
    loading: false,
    error: false,
    touched: false
  }
  const state: WaiterState = {
    ...defaultState,
    handle: async (pm)=>{
      !state.touched && (state.touched = true)

      state.clearState()
      
      state.loading = true;
      const [res,err] = await usePromise(pm);
      if (!err) state.onSuccess && state.onSuccess(res)

      if (err && err.status) { 
        if (err.status >= 500) { 
          state.unexpected = true
        } else if (err.status === 404) { 
          state.notFound = true
        } 
        state.error = true;
        state.onError && state.onError(err)
      }
      
      

      state.loading = false;
      return [res,err]
    },
    clearState: function (){
      const temp = this.touched 
      Object.assign(this,defaultState)
      this.touched = temp
    }
  };

  return state;
}

export interface HandlerState<data> extends WaiterState {
  data: data
  handler: Handler<data>
  clone: (opts?: Partial<HandlerOption<data>>)=> HandlerState<data>
  run: (...args: any[]) => void

  /**
   * Back to initial context and data
   */
  reset: () => void

  /**
   * This is useful when you need to do an initial run and 
   */
  resetAndRun: (...args: any[])=> void
  /**
   * Similar to reset and run but with debounce time  
   */
  resetAndDebounceRun: (...args: any[])=> void
  context: {[key: string]: any}
  debounceRun: (...args: any[])=> void
  debounceTime: number
}

interface HandlerOption<T> {
  handler: Handler<T>,
  context?: HandlerState<T>["context"]
  initialData: T
  debounceTime?: number
}
interface Handler<Data> {
  (w: HandlerState<Data>): (...args: any[]) => Promise<any>
}

export const httpHandler = <T>(option: HandlerOption<T>): HandlerState<T> =>{

  // clone object then set handler to its original
  const cloneOption = cloneObj({ context: {},debounceTime: 500,...option  })
  cloneOption.handler = option.handler

  const waiter = httpWaiter() as HandlerState<T>
  waiter.handler = cloneOption.handler
  waiter.data = cloneOption.initialData
  waiter.debounceTime = cloneOption.debounceTime
  waiter.context = { ...cloneOption.context }
  
  waiter.reset = ()=>{
    const initialOption = cloneObj(option)
    waiter.data = initialOption.initialData;
    waiter.context = initialOption.context as any;
  }

  waiter.resetAndRun = (...args)=>{ waiter.reset(); waiter.run(...args)}
  waiter.resetAndDebounceRun = (...args)=>{ waiter.reset(); waiter.debounceRun(...args)}

  let isDebounceLoad = false;
  let timeout: any;
  waiter.run = function(...args){ 
    if (isDebounceLoad || !waiter.loading){
      this.handler(waiter)(...args);
    } 
  }; 
  
  waiter.debounceRun = (...args)=>{
    isDebounceLoad = true
    clearTimeout(timeout)
    timeout = setTimeout(()=>{
      waiter.run(...args)
      isDebounceLoad = false;
    },waiter.debounceTime)
  }
  waiter.clone = (opts: Partial<HandlerOption<T>> = {} )=> httpHandler(Object.assign(option,opts));
  
  return waiter
}

export const toDataURL = (file: File) =>{
  return new Promise<string>((resolve,rej)=>{
    const reader = new FileReader();
    reader.onload = (res)=>{
      resolve(res.target?.result as string)
    }
    reader.onerror = ()=> rej("err")
    reader.readAsDataURL(file)
  })
}

export const isMediaUrl = (path?: string) => {
  return /\/media\//.test(path as string) &&  /(\.\w+)$/.test(path as string)
}
export const isStaticUrl = (path?: string) => {
  return /\/static\//.test(path as string) &&  /(\.\w+)$/.test(path as string)
}

export function removeExtension(text: string){
    return text.replace(/(\.\w+)$/,"")
}

export function getExt(fileName: string){
  return fileName.split(".").pop() as string
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export const toDateStr = (date: NgbDate,format = "YYYY-MM-DD")=>{
  return `${date.year}-${date.month}-${date.day}`;
} 


export const strToNgbDate = (str: any)=> {
  const d = new Date(str);
  return new NgbDate(d.getFullYear(),d.getMonth() + 1,d.getDate()) 
}  


export const cloneObj = <T>(obj: T):T => JSON.parse(JSON.stringify(obj));



export const  getPropValue = (obj = {}, path: string): any => {
  let arr = path.split(".");
  // @ts-ignore
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
}



// trimDuplicate([],"p")
// [{p: 1}, {p: 1}] ---> [{p: 1}]
type Unarray<T> = T extends Array<infer U> ? U : T;
export const trimDuplicate = <T extends Array<any>>(arr:T, key: keyof Unarray<T>)=> {
  var values: any = {};
  return arr.filter((item)=>{
      var val = item[key];
      var exists = values[val];
      values[val] = true;
      return !exists;
  });
}




//  Object to form data

// takes a {} object and returns a FormData object
export const objectToFormData = function(obj: any, form?: any, namespace?: any) {
    
  let fd = form || new FormData();
  let formKey;
  
  for(let property in obj) {
    if(obj.hasOwnProperty(property)) {
      
      if(namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }
     
      // if the property is an object, but not a File,
      // use recursivity.
      if(typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        
        objectToFormData(obj[property], fd, property);
        
      } else {
        
        // if it's a string or a File object
        fd.append(formKey, obj[property]);
      }
      
    }
  }
  
  return fd;
    
};

export const isImage = (url: string)=> {
  return /[\/.](webp|jpg|jpeg|png|svg|gif)$/i.test(url)
}


export const rangeArray = (n: number)=>{
  return [...Array(Math.round(n)).keys()];
}

export const queryChanger = (obj?: any)=> {
  const href = new URL(location.href);
  obj && Object.keys(obj).forEach(key=>{
    if (obj[key]) href.searchParams.set(key,encodeURI(obj[key]))
  })
  history.replaceState(null,"",href.toString())
}

export interface CustomCalendar {
  days: string;
  schedule: [{days: number, is_available: boolean, shifts: string[]}];
  time: string;
  date: string;
}

export interface Schedule {
  days: {date:string, is_available: boolean, shifts: string[]}[];
  schedule: string;
  specific_date: string;
}