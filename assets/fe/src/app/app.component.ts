import { Component } from '@angular/core';
import { StateService } from '@uirouter/angular';
import "src/app/commons/constants/dayjs.constant";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fe';
  constructor(state: StateService) {
  }
}
