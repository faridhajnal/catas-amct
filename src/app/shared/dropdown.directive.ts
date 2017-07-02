import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[cataDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen : boolean = false;

  @HostListener('click') toggleOpen(){
    this.isOpen = !this.isOpen;
  }
  constructor() { }

}
