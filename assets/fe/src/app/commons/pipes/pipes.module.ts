import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe, SafeUrlPipe } from './safe.pipe';
import { ShortTimeAgoPipe, TimeAgoPipe } from './date.pipe';



@NgModule({
  declarations: [
    SafeHtmlPipe,
    SafeUrlPipe,
    TimeAgoPipe,
    ShortTimeAgoPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimeAgoPipe,
    ShortTimeAgoPipe,
    SafeHtmlPipe,
    SafeUrlPipe
  ]
})
export class PipesModule { }
