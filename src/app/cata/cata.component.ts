import { slideOut } from '../animations/animations';
import { DataService } from './../services/data.service';
import { User } from './../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from "../services/socket.service";
import { CookieService } from "angular2-cookie/services/cookies.service";
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cata-cata',
  templateUrl: './cata.component.html',
  styleUrls: ['./cata.component.css'],
  animations: [
    slideOut
  ]
})
export class CataComponent implements OnInit, OnDestroy {

  constructor(private socket : SocketService,
              private cookieService : CookieService,
              private dataService : DataService,
              private route : ActivatedRoute,
              private router : Router) { }
  @HostBinding('@slideOut') routeAnimation = true;
  user : User;
  scoreTotal : number = 0;
  CATEGORIAS = [];
  tequilaNo : number;
  totalTequilas : number = 5;
  subscription : Subscription;
  break : boolean = false;
  ngOnInit() {
    this.socket.initSocket();
    let user = JSON.parse(this.cookieService.get('user'));
    this.user = new User(user.name, user.email, user.group, user.id, user.isAdmin);
    this.CATEGORIAS = this.dataService.getCriteria(1);
    this.subscription = this.route.params.subscribe((params)=>{
      this.tequilaNo = +params['tequila'];
    })

  }

  getIconForCategory(name:string) {
    switch(name){
      case 'Vista':
        return ["fa-eye"];
      case 'Olfato':
        return ["fa-leaf"];
      case 'Gusto':
        return ["fa-free-code-camp"];
      case 'Tacto': 
        return ["fa-hand-o-right"];
    }
  }

  goBack(){
    this.socket.sendMessage({type: 2, user : this.user.name})
    this.router.navigateByUrl('/main');
  }

  onRatingChanged(event, firstindex, secondindex){
    let min = this.CATEGORIAS[firstindex].min;
    if(event.rating >= min){
      this.CATEGORIAS[firstindex].subs[secondindex].rating = event.rating;
    }
    else{
      this.CATEGORIAS[firstindex].subs[secondindex].rating = min;
    }
  }

  isOneNull(){
    for(let categoria of this.CATEGORIAS){
      for(let sub of categoria.subs){
        if(sub.rating === null) return true;
      }
    }
    return false;
  }

  resetRatings(){
      for(let categoria of this.CATEGORIAS){
        for(let sub of categoria.subs){
           sub.rating = categoria.min;
        }
      }
      return false;
  }

  onSendRatings(){
    let scores = this.extractRatings();
    // http call for inserting scores for tequila
    this.resetRatings();
    console.log(this.totalTequilas);
    if(this.tequilaNo < this.totalTequilas) this.tequilaNo += 1;
    else alert('ya no hay');
  }

  extractRatings(){
    let scores = [];
    for(let categoria of this.CATEGORIAS){
      let temp = 0;
      for(let sub of categoria.subs){
        temp+=sub.rating;
      }
      scores.push({type:categoria.type, total:temp});
    }

    //let grand = scores.reduce((a,b)=>{return a['total'] + b['total']},0)
    let grand = 0;
    for(let score of scores){
      grand+=score.total;
    }
    return {

     scores: scores,
     total:grand 
      
    };
  }

  onScoresReady(scores){
    //http call...
    console.log(scores);
    this.tequilaNo +=1;
    window.scrollTo(0, 0);
    if(this.tequilaNo > 10 || scores === null){
      this.break = true;
    } 
    else this.router.navigate(['../', +this.tequilaNo], {relativeTo : this.route});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }


}
