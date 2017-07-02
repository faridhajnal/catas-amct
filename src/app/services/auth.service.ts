import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/Rx';
import { User } from "../models/user.model";
import { CookieService } from "angular2-cookie/services/cookies.service";
@Injectable()
export class AuthService {


  constructor(private http : Http, private cookieService : CookieService) {

  }

  login(user){
    const headers = new Headers({'Content-Type': 'application/json'});
    return this.http.post('/catador/login', user, {headers}).map((response:Response)=>{
       let user = response.json();
       this.cookieService.putObject('user', user);
       return response.json();;
    }).catch((error: Response) => {
                return Observable.throw(error.json()); //still need to throw it
    });
  }

  logout(){
    this.cookieService.remove('user');
  }

  getUser(): any  {
    return this.cookieService.get('user') ?  JSON.parse(this.cookieService.get('user')): false;
  }

  isAdmin() : Boolean {
    return JSON.parse(this.cookieService.get('user')).isAdmin;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

}
