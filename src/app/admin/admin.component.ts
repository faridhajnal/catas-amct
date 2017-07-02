import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cata-admin',
  template:  `
    <h2 class="text-center">Administrador</h2>
    <router-outlet></router-outlet>
  `
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
