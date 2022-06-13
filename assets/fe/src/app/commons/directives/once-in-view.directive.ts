import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[onceInView]'
})
export class OnceInViewDirective implements OnInit,OnDestroy {

  observer!: IntersectionObserver;

  constructor(private _elementRef: ElementRef) {}

  @Input() delayToAct = 0;

  @Output() onceInView: EventEmitter<IntersectionObserverEntry> =
    new EventEmitter<IntersectionObserverEntry>();

  ngOnDestroy() {
    this.observer && this.observer.disconnect();
  }

  ngOnInit() {
    let timeout: any;
    let isEmmited = false;
    this.observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {

        if (entry.isIntersecting) {
          timeout = setTimeout(() => {

            this.onceInView.emit(entry);
            isEmmited = true;

          }, this.delayToAct);
        } else {
          clearTimeout(timeout);
          // If the event is already emitted then disconnect the observer 
        }
      });
    });

    this.observer.observe(this._elementRef.nativeElement);
  }

}