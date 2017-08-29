import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cata-admin',
  template:  `
    <router-outlet></router-outlet>
  `
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
