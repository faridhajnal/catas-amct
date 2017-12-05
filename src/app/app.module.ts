//Modules
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';


//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { CataComponent } from './cata/cata.component';
import { RatingComponent } from './cata/rating/rating.component';
import { RateTequilaComponent } from './cata/rate-tequila/rate-tequila.component';

//Services
import { DataService } from './services/data.service';
import { SocketService } from './services/socket.service';
import { AuthGuard } from './auth.guard';
import { CanDeactivateGuard } from "./services/can-deactivate-guard.service";
import { HttpService } from './services/http.service';
import { AuthService } from './services/auth.service';
import { CookieService } from "angular2-cookie/services/cookies.service";

//Other

import { NgModule, LOCALE_ID } from '@angular/core';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    MainComponent,
    CataComponent,
    RatingComponent,
    RateTequilaComponent
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [AuthService, HttpService, AuthGuard, CanDeactivateGuard, CookieService, SocketService, DataService,
              { provide : LOCALE_ID, useValue : "es-MX"}],
  bootstrap: [AppComponent]
})
export class AppModule { }
