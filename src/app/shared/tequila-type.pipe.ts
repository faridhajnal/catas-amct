import { Pipe, PipeTransform } from '@angular/core';
import { KIND } from './../models/cata_user.model';
@Pipe({
  name: 'tequilaType'
})
export class TequilaTypePipe implements PipeTransform {

  transform(value: any, plural:boolean): string {
    if(plural){
      if(value === 2) return "AÑEJOS";
      if(value === 3) return "EXTRA AÑEJOS"
      else return KIND[value] + 'S';
    }

    else{
      if(value === 2) return "AÑEJO";
      if(value === 3) return "EXTRA AÑEJO"
      else return KIND[value];
    }

  }

}
