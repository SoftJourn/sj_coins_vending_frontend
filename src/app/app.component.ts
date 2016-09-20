import { Component, OnInit } from "@angular/core";
import { AppProperties } from "./shared/app.properties";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public options = AppProperties.NOTIFICATION_OPTIONS;

  constructor() {}

  ngOnInit(): any {
  }
}
