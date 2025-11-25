import { Directive, ElementRef, EventEmitter, HostListener, Output, output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDiractiveEvenet]'
})
export class DiractiveEvenet {

  constructor(private element: ElementRef) { }
  @Output() clickedInside = new EventEmitter<boolean>();
  @HostListener('click', ['$event'])
  handleButtonClick(event: MouseEvent) {
    // console.log(event,"*******");
    
    event.stopPropagation();
    this.clickedInside.emit(true);
  }
  @HostListener('document:click', ['$event']) OnPopUp(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const id = target.id;
    const notificationElement = document.getElementById('element-notification');

    const isClicked = this.element.nativeElement.contains(event.target)
    console.log( id,"**");
    
    if (!isClicked && (id !== "report" &&  id !== "delete"   )) {
      this.clickedInside.emit(false);
    }
  }

}
