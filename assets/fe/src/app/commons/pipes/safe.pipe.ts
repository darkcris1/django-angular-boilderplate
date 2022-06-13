import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(
    private sanitizer: DomSanitizer
  ){}

  transform(value: string, ...args: unknown[]) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {
  constructor(
    private sanitizer: DomSanitizer
  ){}


  transform(value: any, ...args: unknown[]) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
