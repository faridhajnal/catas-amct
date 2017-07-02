import { default as swal } from 'sweetalert2'
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
@Component({
  selector: 'cata-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService : AuthService, private router : Router) { }

  ngOnInit() {

  }

  onSubmit(form : NgForm){
    let user = {
      email : form.value.email,
      password : form.value.password
    }

    this.authService.login(user).subscribe(
      (data) => {
         let isAdmin = data.isAdmin;
         swal({
          title: 'Bienvenido ',
          text: "Presiona OK para continuar",
          showCancelButton : false,
          confirmButtonText: 'OK'
        }).then(()=> {
          if(isAdmin) this.router.navigateByUrl('/admin');
          else this.router.navigateByUrl('/main');
        });

      },
      (error) =>{
         this.showMessage(error);
         console.log(error);
      }
    )
  }

  showMessage(message:any){
    swal({
      title : message.title,
      text : message.error.message,
      showConfirmButton : true
    });
  }

}
