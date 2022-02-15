import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsListMetricProps',
})
export class ListMetricPropsPipe implements PipeTransform {
  transform(remark: any, property: string, isListElement: boolean): string {
    if (isListElement) {
      return remark[`list-${property}`] ? remark[`list-${property}`] : null;
    } else {
      return remark[property] ? remark[property] : null;
    }
  }
}
