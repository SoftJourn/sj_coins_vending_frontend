import {Component, OnInit} from '@angular/core';
import {Purchase} from "../shared/entity/purchase";
import {PurchaseService} from "../shared/services/purchase.service";
import {Machine} from "../machines/shared/machine";
import {MachineService} from "../shared/services/machine.service";

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class PurchasesComponent implements OnInit {
  public purchases: Purchase[];
  public machines: Machine[];

  constructor(private purchaseService: PurchaseService,
              private machineService: MachineService) {
  }

  ngOnInit() {
    this.machineService.findAll().subscribe(machines => {
      this.machines = machines;
      this.purchaseService.findAll(machines[0].id).subscribe(purchases => {
        this.purchases = purchases;
      });
    });
  }

}
