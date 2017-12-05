import { NotFoundComponent } from './not-found.component';
import { SortNamePipe } from './order-name.pipe';
import { DropdownDirective } from './dropdown.directive';
import { NgModule } from '@angular/core';
import { TequilaTypePipe } from './tequila-type.pipe';
import { SortStatusPipe } from './order-status.pipe';

@NgModule({
  declarations: [
    TequilaTypePipe,
    DropdownDirective,
    SortNamePipe,
    SortStatusPipe,
    NotFoundComponent
  ],
  exports : [TequilaTypePipe, DropdownDirective, SortNamePipe, SortStatusPipe, NotFoundComponent],
  imports: []
})
export class SharedModule { }
