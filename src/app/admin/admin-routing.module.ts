import { EditCataComponent } from './edit-cata/edit-cata.component';
import { AdminComponent } from './admin.component';
import { AdminCataComponent } from './cata/admin-cata.component';
import { CanDeactivateGuard } from './../services/can-deactivate-guard.service';
import { AdminNewCataComponent } from './new-cata/admin-new-cata.component';
import { AdminMainComponent } from './main/admin-main.component';

import { AdminGuard } from './admin.guard';
import { AuthGuard } from './../auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '',
      component : AdminComponent,
      canActivate : [AuthGuard, AdminGuard],
      //canActivateChild : [AuthGuard, AdminGuard],
      children : [
        { path: '', component : AdminMainComponent},
        { path: 'event', component : AdminNewCataComponent, canDeactivate : [CanDeactivateGuard]},
        { path: 'event/:id', component : AdminCataComponent},
        { path: 'event/:id/edit', component : EditCataComponent, canDeactivate : [CanDeactivateGuard]}
      ]
      
    }

    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule { }
