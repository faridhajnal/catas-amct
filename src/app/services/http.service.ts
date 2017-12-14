  import { Observable } from 'rxjs';
import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {

  constructor(private http : Http) { }

  //cata related api endpoints

  getAvailableEvents(user_id){
    return this.http.get('/cata/available/1/' + user_id).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  getEnrolledEvents(user_id){
    return this.http.get('/cata/registered/' + user_id).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  addCatadorToCata(cataId, catadorId, catadorName){
    return this.http.post('/cata/' + cataId + '/catador', {catadorId, catadorName})
      .map((response:Response)=> response.json())
      .catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  getCatas(userId){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.get('/cata/', {headers}).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }


  getCata(cataId, userId){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.get('/cata/' + cataId, {headers}).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  registerCata(cata,userId){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.post('/cata/', {cata}, {headers}).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  sendScore(cataId: string, total:number, index:number, userId:string){
    let score = {
      total,
      userId,
      index
    }
    return this.http.post('/cata/' + cataId + '/score', {score}).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  verifyCataParticipation(cataId: string, userId:string){
    return this.http.get('/cata/verify/' + cataId + '/' + userId).map((response:Response)=>response.json()
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }

  updateCataInfo(id:string, data:any, userId:string){
    console.log(id,data,userId);
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.patch('/cata/' + id, {data}, {headers}).map((response:Response)=>{
        return response.json();
    }).catch((error: Response) => {
                return Observable.throw(error); //still need to throw it
    });
  }

  updateCataStatus(cataId:string, status : number, userId:string){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.patch('/cata/' + cataId + '/' + status, {}, {headers}).map((response:Response)=>{
        return response.json();
    }).catch((error: Response) => {
                return Observable.throw(error); //still need to throw it
    });
  }

  getCataResults(cataId:string, userId:string, mode: number){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.get(`/cata/${cataId}/score?mode=${mode}`, {headers}).map((response:Response)=>{
        return response.json();
    }).catch((error: Response) => {
                return Observable.throw(error); //still need to throw it
    });
  }

  exportResultsToExcel(results: any, userId:string){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.post(`/cata/export/excel`, results, {headers}).map((response:Response)=>{
        return response.json();
    }).catch((error: Response) => {
                return Observable.throw(error); //still need to throw it
    });
  }

  getTequilas(kind:number,userId:string){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.get('/tequila?kind='+kind, {headers}).map((response:Response)=>{
      return response.json();
    }).catch((error: Response) => {
                return Observable.throw(error); //still need to throw it
    });
  }

  addTequilasToCata(cataId:string, tequilas:string[], userId:string){
    let headers = new Headers();
    headers.append('Authorization', userId);
    return this.http.post('/cata/' + cataId + '/tequilas/', 
                         {tequilas}, {headers}).map((response:Response)=>{
                           return "Satisfactorio";}
                           //console.log(response);
                           //response.json();}
    ).catch((error: Response) => {
      return Observable.throw(error); //still need to throw it
    });
  }


}
