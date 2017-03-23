import {
  Pipe,
  PipeTransform
} from '@angular/core';

@Pipe({
  name: 'pointSeparator'
})
export class PointSeparatorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let values = value.split('.');
    let result = "";
    for (let v of values) {
      result += v.charAt(0).toUpperCase() + v.substring(1, value.length) + " ";
    }
    return result;
  }

}
