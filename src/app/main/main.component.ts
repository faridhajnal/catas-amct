import { CookieService } from 'angular2-cookie/services/cookies.service';
//import { SocketService } from './../services/socket.service';
import { HttpService } from './../services/http.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { CataUser } from "../models/cata_user.model";
import { default as swal } from 'sweetalert2'
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
@Component({
  selector: 'cata-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  user_id : string;
  user_name : string;
  name : string;
  date : number;
  progress : string = "Progress";
  progress2 : number = 0;
  connection : any;
  messages : any[] = [];
  availableCatas : CataUser[];
  registeredCatas : CataUser[];
  enrolledSub : Subscription;
  availableSub : Subscription;
  constructor(
              private router : Router,
              private route : ActivatedRoute,
              private authService : AuthService,
              private httpService : HttpService,
              //private socket : SocketService,
              private cookieService : CookieService) {

  }

  ngOnInit() {
    let privilege = JSON.parse(this.cookieService.get('user')).isAdmin;
    //if(privilege) {this.router.navigateByUrl('/admin')};
    this.name = this.authService.getUser().name;
    this.date = Date.now();
    this.user_id = JSON.parse(this.cookieService.get('user')).id;
    this.user_name = JSON.parse(this.cookieService.get('user')).name;


    this.availableSub = Observable.interval(3000).flatMap(()=>{
      return this.httpService.getAvailableEvents(this.user_id);
    }).subscribe(catas=>{
        this.progress2 = 1;
        this.availableCatas = catas;
    });

    
    this.enrolledSub = Observable.interval(3000).flatMap(()=>{
      return this.httpService.getEnrolledEvents(this.user_id); 
    }).subscribe((catas)=>{
      this.progress = "Finished";
      this.registeredCatas = catas;
    });
    // this.socket.initSocket();
    // this.connection = this.socket.getMessages().subscribe(message => {
    //    console.log(message);
    // });
  }

  sendValue(msg){
    // this.socket.sendMessage({msg, userId : this.user_id});
  }

  showDetails(event){
    if(event.target.localName === "button") return;
  }
  enrollToCata(cataId, index){

    swal({
      title: 'Atención',
      type : 'warning',
      text: "¿Seguro que desea unirse?",
      showCancelButton : true,
      cancelButtonText : 'No',
      confirmButtonText: 'Sí'
    }).then(()=> {
        this.httpService.addCatadorToCata(cataId, this.user_id, this.user_name).subscribe((response)=>{
           this.availableCatas.splice(index,1);

        // this.socket.sendMessage({ type : 0, user : this.user_name});
        
      });
    },()=>{});

  }

  joinCata(id, kind){

    this.httpService.verifyCataParticipation(id,this.user_id).subscribe(data=>{
        //this.socket.sendMessage({ type : 1 , user : this.user_name});
        localStorage.setItem('kind', kind);
        this.router.navigate(['event', id, 1], {relativeTo:this.route}); 
      

    }, err => {
        swal('Atención', 'Ya Has Enviado tus resultados para esta cata!').then(()=>{
          console.log('clickedok');
        }, ()=>{});
        return;
    });


    
  }

  ngOnDestroy() {
    //this.connection.unsubscribe();
    this.enrolledSub.unsubscribe();
    this.availableSub.unsubscribe();
  }

}
