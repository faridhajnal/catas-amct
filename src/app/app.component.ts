import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cata-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  private _noNav = ['/login', '/signup', '/fof'];
  title = 'cata works!';
  navVisible : boolean = true;
  constructor(private router : Router){

  }


  ngOnInit(){
    this.router.events
      .filter(evt => evt instanceof NavigationEnd)
      .map(val => (<NavigationEnd>val).urlAfterRedirects)
      .subscribe(url => this.navVisible = this._noNav.indexOf(url) === -1);
  }

}
