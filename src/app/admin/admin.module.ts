import { SharedModule } from './../shared/shared.module';
import { AppModule } from './../app.module';
import { AuthGuard } from './../auth.guard';
import { FormsModule } from '@angular/forms';
import { AdminGuard } from './admin.guard';
import { AdminNewCataComponent } from './new-cata/admin-new-cata.component';
import { AdminMainComponent } from './main/admin-main.component';
import { AdminCataComponent } from './cata/admin-cata.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { EditCataComponent } from './edit-cata/edit-cata.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [
    AdminComponent,
    AdminCataComponent,
    AdminMainComponent,
    AdminNewCataComponent,
    EditCataComponent
  ],
  providers : [AdminGuard]
})
export class AdminModule { }
