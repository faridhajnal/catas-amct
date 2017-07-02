import { CanActivate, Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router){

    }

    canActivate(): boolean {
        if (this.auth.isLoggedIn()) {
            // all ok, proceed navigation to routed component
            return true;
          }
        else {
            // start a new navigation to redirect to login page
            this.router.navigate(['/login']);
            // abort current navigation
            return false;
        }
    }
}