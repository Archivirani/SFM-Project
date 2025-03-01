import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: false
})
export class CountUpDirective {
  @Input() appCountUp!: number;
  constructor(private el: ElementRef) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appCountUp']) {
      this.animateCount();
    }
  }
  private animateCount(): void {
    let start = 0;
    const end = this.appCountUp || 0;
    const duration = 2000; // 2 seconds animation
    const interval = 30;
    const increment = (end - start) / (duration / interval);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      this.el.nativeElement.innerText = Math.round(start).toLocaleString('en-IN');
    }, interval);
  }

}
