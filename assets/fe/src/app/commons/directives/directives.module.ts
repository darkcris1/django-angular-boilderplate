import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnceInViewDirective } from './once-in-view.directive';
import { HorizontalScrollDirective } from './scroll.directive';
import { DropFileDirective } from './drag-file.directive';



@NgModule({
  declarations: [
    OnceInViewDirective,
    HorizontalScrollDirective,
    DropFileDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OnceInViewDirective,
    HorizontalScrollDirective,
    DropFileDirective
  ]
})
export class DirectivesModule { }
