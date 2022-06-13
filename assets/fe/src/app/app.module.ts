import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UIRouterModule, UIView } from '@uirouter/angular';
import { APP_ROUTES } from './app.route';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    UIRouterModule.forRoot(APP_ROUTES),
    HttpClientModule,
    TranslocoRootModule
  ],
  providers: [],
  bootstrap: [UIView]
})
export class AppModule { }
