import {
  Component,
  OnInit
} from "@angular/core";
import {Dashboard} from "../shared/entity/dashboard";
import {DashboardService} from "../shared/services/dashboard.service";
import {ErrorDetail} from "../shared/entity/error-detail";
import {NotificationsService} from "angular2-notifications";
import {PurchaseService} from "../shared/services/purchase.service";
import {TopProductRequest} from "../shared/dto/top-product";
import {TopProductResponse} from "../shared/dto/top-product-response";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public dashboard: Dashboard = new Dashboard();

  public options: Object;
  public chart: any;

  constructor(private dashboardService: DashboardService,
              private purchaseService: PurchaseService,
              private notificationService: NotificationsService) {
    this.options = {
      chart: {
        type: 'column',
        height: '600px'
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '1rem',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Amount',
          style: {
            fontSize: '1rem',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;'
          }
        },
        labels: {
          style: {
            fontSize: '1rem',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;'
          }
        }
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y}',
            style: {
              fontSize: '12px',
              fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;'
            }
          }
        }
      },
      tooltip: {
        enabled: false
      },
      title: {
        text: 'Top products',
        style: {
          fontSize: '1.5rem',
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;'
        }
      },
      series: [{
        name: 'Products',
        colorByPoint: true,
        events: {
          legendItemClick: function (event: Event) {
            event.preventDefault();
          }
        },
        data: []
      }]
    };
  }

  saveInstance(chartInstance) {
    this.chart = chartInstance;
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
    let due = new Date();
    let start = new Date();
    start.setDate(due.getDate() - 30);
    let topProduct = new TopProductRequest(10, start.toISOString(), due.toISOString());

    this.purchaseService.findTopProduct(topProduct).subscribe(
      (result: TopProductResponse[]) => {
        let data = [];
        for (let topProduct of result) {
          data.push({name: topProduct.product, y: topProduct.quantity});
        }
        this.chart.series[0].remove();
        this.chart.addSeries({
          name: 'Products',
          colorByPoint: true,
          events: {
            legendItemClick: function (event: Event) {
              event.preventDefault();
            }
          },
          data: data
        });
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
