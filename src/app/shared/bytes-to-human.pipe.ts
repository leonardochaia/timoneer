import { Pipe, PipeTransform } from '@angular/core';
import * as filesize from 'filesize';

@Pipe({
  name: 'bytesToHuman'
})
export class BytesToHumanPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return filesize(value, { base: 1 });
  }
}
