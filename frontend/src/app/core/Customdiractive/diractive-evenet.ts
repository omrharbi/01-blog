import { Directive, ElementRef, EventEmitter, HostListener, Output, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDiractiveEvenet]'
})
export class DiractiveEvenet {

  constructor(private element: ElementRef, private randrer: Renderer2) { }
  @Output() clickedInside = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event']) OnPopUp(event: MouseEvent) {
    const isClicked = this.element.nativeElement.contains(event.target)
    console.log(isClicked, "is click ");

    this.clickedInside.emit(isClicked)
  }

}
