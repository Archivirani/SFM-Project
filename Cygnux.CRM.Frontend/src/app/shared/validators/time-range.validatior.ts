import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;
  const today = new Date();
  const startDateTime = new Date(`1970-01-01T${startTime}`);
  const endDateTime = new Date(`1970-01-01T${endTime}`);



  if (startTime && endTime) {
    if (endDateTime <= startDateTime) {
      return { timeRangeValidator: true }; // Custom error key
    }
  }else {
    const currentTime = new Date(`1970-01-01T${today.toTimeString().slice(0, 5)}`); // Current time as Date
    if (startDateTime <= currentTime) {
      return { startTimeAfterCurrentTime: true }; // Custom error key
    }
  }
  return null;
}
