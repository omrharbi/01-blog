import { Directive, ElementRef, EventEmitter, HostListener, Output, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDiractiveEvenet]'
})
export class DiractiveEvenet {

  constructor(private element: ElementRef) { }
  @Output() clickedInside = new EventEmitter<boolean>();
  @HostListener('click', ['$event'])
  handleButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.clickedInside.emit(true);
  }
  @HostListener('document:click', ['$event']) OnPopUp(event: MouseEvent) {
    console.log(event.target);  
      const target = event.target as HTMLElement;
      const id = target.id;
    const isClicked = this.element.nativeElement.contains(event.target)
     if (!isClicked && id!=="report" ) {
      this.clickedInside.emit(false);
    }
  }

}
