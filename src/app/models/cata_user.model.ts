/**
 * Created by Farid on 15/6/2017.
 */
export class CataUser{
  constructor(public id : string, public name : string, public place : string,
              public kind : number, public status : number, public participants? : any[],
              public tequilas? : any[]){

              }
}

export enum KIND {
  BLANCO, REPOSADO, ANEJO, EXTRA_ANEJO
}
