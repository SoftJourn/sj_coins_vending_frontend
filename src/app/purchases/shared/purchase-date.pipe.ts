import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'purchaseDate'
})
export class PurchaseDatePipe implements PipeTransform {
  private monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  transform(dateString: string, args?: any): string {
    let date = new Date(dateString);
    return `${this.monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
}
