import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAmount]',
})
export class AmountDirective {
  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Allow specific keys: Backspace, Tab, End, Home, Arrow keys, and decimal point
    const allowedKeys = [
      'Backspace',
      'Tab',
      'End',
      'Home',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Enter',
      '.',
    ];

    if (allowedKeys.includes(event.key)) {
      return; // Allow these keys
    }

    // Prevent non-numeric keys
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInput(event: InputEvent) {
    const inputElement = event.target as HTMLInputElement;

    // Regular expression to allow only numbers with up to 2 decimal places
    const value = inputElement.value;
    const regex = /^\d*\.?\d{0,4}$/;

    if (!regex.test(value)) {
      // Remove the last character if it doesn't match the pattern
      inputElement.value = value.slice(0, -1);
    }
  }
}
