import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[horizontalScroll]'
})
export class HorizontalScrollDirective implements OnInit {
  @Input() horizontalScrollSpeed: any = 5;
  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {

    const el = this._elementRef.nativeElement;
    el.addEventListener("wheel",(event)=>{
      // @ts-ignore
      el.scrollLeft += (event.wheelData || event.deltaY) * this.horizontalScrollSpeed;
      event.preventDefault();
    })   
  }

}
