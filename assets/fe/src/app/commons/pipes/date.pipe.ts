import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';


@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: any, ...args: boolean[]): unknown {
    return dayjs(value).fromNow(...args);
  }
}


@Pipe({
  name: 'shortTimeAgo',
})
export class ShortTimeAgoPipe implements PipeTransform {

  transform(value: any, ...args: boolean[]): unknown {

    // Navigate to dayjs.constant.ts for configuration
    return dayjs(value).locale('en-short').fromNow(...args);
  }
}
