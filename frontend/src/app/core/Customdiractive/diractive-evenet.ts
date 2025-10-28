import { Directive, ElementRef, EventEmitter, HostListener, Output, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDiractiveEvenet]'
})
export class DiractiveEvenet {

  constructor(private element: ElementRef, private randrer: Renderer2) { }
  @Output() clickedInside = new EventEmitter<boolean>();
  @HostListener('click', ['$event'])
  handleButtonClick(event: MouseEvent) {
    event.stopPropagation(); // Prevent event from bubbling to document
    this.clickedInside.emit(true);
  }
  @HostListener('document:click', ['$event']) OnPopUp(event: MouseEvent) {
    const isClicked = this.element.nativeElement.contains(event.target)
    // console.log("is clicked ", isClicked);
    
     if (!isClicked) {
      this.clickedInside.emit(false);
    }
  }

}
