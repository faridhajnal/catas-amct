import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { default as swal } from 'sweetalert2'

@Component({
  selector: 'cata-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService : AuthService, private router : Router, private cookieService : CookieService) { }

  adminVisible : Boolean = true;

  ngOnInit() {
    let usr : any = this.cookieService.get('user');
    if(usr){
      this.adminVisible = JSON.parse(usr).isAdmin;
    }
  }

  onLogout(){
    swal({
      title : 'Salir del sistema',
      text : '¿Seguro que desea cerrar sesión?',
      showCancelButton : true,
      cancelButtonText : 'Cancelar'
    }).then(()=>{
      this.authService.logout();
      this.router.navigateByUrl('/login');
    }, ()=>{
      console.log('cerrado');
    })
    
  }

}
