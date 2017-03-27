import { Component, OnInit } from "@angular/core";
import { Dashboard } from "../shared/entity/dashboard";
import { DashboardService } from "../shared/services/dashboard.service";
import { ErrorDetail } from "../shared/entity/error-detail";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public dashboard: Dashboard = new Dashboard();

  constructor(private dashboardService: DashboardService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe(
      data => {
        this.dashboard = data;
      },
      error => {
        try {
          let errorDetail = <ErrorDetail> error.json();
          if (!errorDetail.detail)
          //noinspection ExceptionCaughtLocallyJS
            throw errorDetail;
          this.notificationService.error('Error', errorDetail.detail);
        } catch (err) {
          console.log(err);
          this.notificationService.error('Error', 'Error appeared, watch logs!');
        }
      }
    );
  }
}
