import { slideOut } from '../../animations/animations';
import { User } from './../../models/user.model';
//import { SocketService } from './../../services/socket.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HttpService } from './../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { default as swal } from 'sweetalert2'


@Component({
  selector: 'cata-admin-cata',
  templateUrl: './admin-cata.component.html',
  styleUrls: ['./admin-cata.component.css'],
  animations: [
    slideOut
  ]
})
export class AdminCataComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute : ActivatedRoute,
              private router : Router,
              private httpService: HttpService,
              private cookies : CookieService,
              /*private socket : SocketService*/) { }
  @HostBinding('@slideOut') routeAnimation = true;
  catadores : Object[] = [];
  connection;
  user : User = JSON.parse(this.cookies.get('user'));
  title : string;
  cataId : string;
  status : number = -1;
  ngOnInit() {
      this.cataId = this.activatedRoute.snapshot.params['id'];
      //this.socket.initSocket();
      this.httpService.getCata(this.cataId, this.user.id).subscribe(cata => {
        this.title = cata.name;
        this.status = cata.status;
        for(let p of cata.participants) {
          this.catadores.push({name:p.name});
        }
      })
      // this.connection = this.socket.getMessages().subscribe(message => {
      //   let type = message['type'];
      //   let name = message['user'];
      //   let i = this.catadores.indexOf(name);
      //   if(type === 0) this.catadores.push({name});
      // });
  }

  setCataAsStarted(){
    swal({
          title: 'Marcar como iniciada?',
          text: "Los catadores podrán visualizar la cata como iniciada",
          showCancelButton : true,
          confirmButtonText: 'Sí',
          cancelButtonText : 'Cancelar'
        }).then(()=> {
          this.httpService.updateCataStatus(this.cataId, 2, this.user.id).subscribe(data=>this.status = 2)
        }, ()=>{
          console.log('cerrado');
        });
  }

  ngOnDestroy(){
    //this.connection.unsubscribe();
    //this.socket.disconnectSocket();
  }

  goBack(){
    this.router.navigateByUrl('/admin');
  }

}
