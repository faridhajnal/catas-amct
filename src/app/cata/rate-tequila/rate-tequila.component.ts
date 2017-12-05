import { HttpService } from './../../services/http.service';
import { DataService } from './../../services/data.service';
import { User } from './../../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SocketService } from "../../services/socket.service";
import { CookieService } from "angular2-cookie/services/cookies.service";
import { Observable } from "rxjs/Observable";
import { fadeUp } from "../../animations/animations";

@Component({
  selector: 'cata-rate-tequila',
  templateUrl: './rate-tequila.component.html',
  styleUrls: ['./rate-tequila.component.css'],
  animations : [fadeUp]
})
export class RateTequilaComponent implements OnInit {

  constructor(
              private httpService : HttpService,
              private cookieService : CookieService,
              private dataService : DataService,
              private route : ActivatedRoute,
              private router : Router) { }

  user : User;
  cataId : string;
  scoreTotal : number = 0;
  CATEGORIAS = [];
  @Input () tequilaNo : number;
  @Output() scoresReady = new EventEmitter<any>();
  resetStars : number = 0;
  ngOnInit() {
    let user = JSON.parse(this.cookieService.get('user'));
    this.user = new User(user.name, user.email, user.group, user.id, user.isAdmin);
    this.cataId = this.route.snapshot.params['id'];
    let kind = parseInt(localStorage.getItem('kind'));
    this.CATEGORIAS = this.dataService.getCriteria(kind);
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
      this.resetStars++;
      for(let categoria of this.CATEGORIAS){
        for(let sub of categoria.subs){
           sub.rating = categoria.min;
        }
      }
  }

  onSendRatings(){
    let scores = this.extractRatings();

    this.httpService.sendScore(this.cataId, scores.total, this.tequilaNo, this.user.id)
    .subscribe((response)=>{
      console.log(response);
      if(response.error != null || response.error != undefined){
        this.scoresReady.emit(null);
      }
      else{
        this.resetRatings();
        this.scoresReady.emit(scores);
      }
    });

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
  

}
