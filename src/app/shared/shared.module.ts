import { NotFoundComponent } from './not-found.component';
import { SortNamePipe } from './order-name.pipe';
import { DropdownDirective } from './dropdown.directive';
import { NgModule } from '@angular/core';
import { TequilaTypePipe } from './tequila-type.pipe';

@NgModule({
  declarations: [
    TequilaTypePipe,
    DropdownDirective,
    SortNamePipe,
    NotFoundComponent
  ],
  exports : [TequilaTypePipe, DropdownDirective, SortNamePipe, NotFoundComponent],
  imports: []
})
export class SharedModule { }
