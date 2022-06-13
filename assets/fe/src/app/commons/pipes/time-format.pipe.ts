// import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';


// @Pipe({
//   name: 'timeFormat'
// })
// export class TimeFormatPipe implements PipeTransform {

//   transform(value: any, format: string = "h:mma"): unknown {
//     return moment(value,"HH:mm:ss").format(format);
//   }

// }


// export function shortTimeAgo(input: any, locale = 'short-en'){
//   const localMoment = moment(input);
//   localMoment.locale(locale)

//   return localMoment.fromNow()
// }

// @Pipe({
//   name: 'shortTimeAgo'
// })
// export class ShortTimeAgoPipe implements PipeTransform {
//   constructor() {

//   }
//   transform(value: any): unknown {
//     return shortTimeAgo(value)
//   }
// }