import {Component, OnInit} from '@angular/core';
import {Dashboard} from "../shared/entity/dashboard";
import {DashboardService} from "../shared/services/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public dashboard:Dashboard = new Dashboard();

  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.dashboardService.getDashboard().subscribe(
      data => {
        this.dashboard = data;
      },
      error => {}
    );
  }
}
