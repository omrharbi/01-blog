import { Directive, ElementRef, EventEmitter, HostListener, Output, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDiractiveEvenet]'
})
export class DiractiveEvenet {

  constructor(private element: ElementRef, private randrer: Renderer2) { }
  @Output() clickedInside = new EventEmitter<boolean>();
  @HostListener('click', ['$event'])
  handleButtonClick(event: MouseEvent) {
    // console.log("click", this.clickedInside);
    event.stopPropagation();
    this.clickedInside.emit(true);
  }
  @HostListener('document:click', ['$event']) OnPopUp(event: MouseEvent) {
    const isClicked = this.element.nativeElement.contains(event.target)
     if (!isClicked) {
      this.clickedInside.emit(false);
    }
  }

}
