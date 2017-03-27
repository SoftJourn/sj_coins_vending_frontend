import { Component, OnInit } from "@angular/core";
import { Machine } from "./shared/machine";
import { MachineService } from "../shared/services/machine.service";
import { ErrorDetail } from "../shared/entity/error-detail";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: 'machines-list',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {
  machines: Machine[];

  constructor(private machineService: MachineService,
              private notificationService: NotificationsService) {
  }

  ngOnInit() {
    this.getMachines();
  }

  private getMachines(): void {
    this.machineService.findAll().subscribe(
      machines =>
        this.machines = machines,
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
    )
  }

  onDelete(id: number) {
    this.machineService.delete(id)
      .subscribe(
        () => null,
        error => {
          try {
            let errorDetail = <ErrorDetail> error.json();
            if (errorDetail.code == 1451) {
              this.notificationService.error('Error', 'Can not delete, this machine is being used!');
            } else {
              if (errorDetail) {
                this.notificationService.error('Error', errorDetail.detail);
              } else {
                this.notificationService.error('Error', 'Error appeared during deletion');
              }
            }
          } catch (err) {
            console.log(err);
            this.notificationService.error('Error', 'Error appeared, watch logs!');
          }
        },
        () => {
          this.notificationService.success('Success', 'Machine has been deleted successfully');
          this.getMachines()
        }
      );
  }
}
