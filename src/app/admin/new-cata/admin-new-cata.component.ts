import { User } from './../../models/user.model';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from './../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Form } from "@angular/forms";
import { CanComponentDeactivate } from "../../services/can-deactivate-guard.service";
import { Observable } from "rxjs/Observable";
import { default as swal } from 'sweetalert2'
@Component({
  selector: 'cata-admin-new-cata',
  templateUrl: './admin-new-cata.component.html',
  styleUrls: ['./admin-new-cata.component.css']
})
export class AdminNewCataComponent implements OnInit, CanComponentDeactivate {

  hasSaved : boolean = false;
  cataName : string = "";
  cataLocation : string = "";
  user : User = new User(null,null,null,null,null);
  constructor(private router : Router,
              private httpService : HttpService,
              private cookies : CookieService) { }

  ngOnInit() {
    this.user = JSON.parse(this.cookies.get('user'));
  }

  goBack(){
    this.router.navigateByUrl('/admin');
  }

  register(form:Form){
    this.hasSaved = true;
    this.httpService.registerCata(form,this.user.id).subscribe((response:any)=>{
          swal({
            title : 'Cambios guardados',
            text : 'La cata ha sido dada de alta',
            timer : 3000,
            showConfirmButton : false
          }).then((success)=>{}, (dismiss)=>{
            if (dismiss === 'timer') {
              this.router.navigateByUrl('/admin')
            }
          });
    });
    
  }

  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean{
    //provide the actual logic...
    if ((!!this.cataName || !!this.cataLocation) && !this.hasSaved) {
      return swal({
        title: '¿Desea salir?',
        text: "Sus cambios no se han guardado...",
        showCancelButton : true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText : 'Cancelar'
      }).then(()=> {
        return true;
      }, ()=>{
        console.log('cerrado');
      });
    }

    return true;
  }

}
