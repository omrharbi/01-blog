import { Directive, ElementRef, EventEmitter, HostListener, Output, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {

  constructor(private element: ElementRef) { }
  @Output() clickedInside = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event'])
  OnPopUp(event: MouseEvent) {
    const clickedInside = this.element.nativeElement.contains(event.target)
    // console.log(clickedInside, "is click ");
    if (!clickedInside) {
      this.clickedInside.emit();
    }
  }

}
