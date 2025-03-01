import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
  constructor() {}

  // Listen for keydown events
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Allow specific keys: Backspace, Tab, End, Home, Arrow keys
    const allowedKeys = [
      'Backspace',
      'Tab',
      'End',
      'Home',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Enter',
    ];

    if (allowedKeys.includes(event.key)) {
      return; // Allow these keys
    }

    // Prevent non-numeric keys
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Ensure pasted values are numeric on input
  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  }
}
