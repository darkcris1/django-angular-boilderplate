import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/commons/pipes/pipes.module';
import { DirectivesModule } from 'src/app/commons/directives/directives.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule,
    TranslocoModule
  ],
  exports: [
    ReactiveFormsModule,
    PipesModule,
    DirectivesModule,
    TranslocoModule
  ]
})
export class GlobalModule { }
