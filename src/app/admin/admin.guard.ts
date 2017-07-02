import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this.auth.isAdmin()) {
            // all ok, proceed navigation to routed component
            return true;
          }
        else {
            // start a new navigation to redirect to login page
            this.router.navigate(['/menu']);
            // abort current navigation
            return false;
        }
    }
}