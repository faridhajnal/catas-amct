import { NotFoundComponent } from './shared/not-found.component';
import { AuthGuard } from './auth.guard';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CataComponent } from "./cata/cata.component";

const routes: Routes = [
  { path: '', redirectTo : 'main', pathMatch : 'full' },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule'
  },
  { path: 'main', component : MainComponent, canActivate : [AuthGuard]},
  { path: 'main/event/:id/:tequila', component : CataComponent, canActivate : [AuthGuard]},
  { path : 'login', component: LoginComponent},
  { path : '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
