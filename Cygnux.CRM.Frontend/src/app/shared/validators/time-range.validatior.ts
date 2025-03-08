import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeRangeValidator(control: AbstractControl): ValidationErrors | null {
  const date = control.get('callDate')?.value;
  const startTime = control.get('startTime')?.value;
  const endTime = control.get('endTime')?.value;
  const today = new Date();
  const dateParts = date?.split('/');
  const formattedDate = `${dateParts?.[2]}-${dateParts?.[1]}-${dateParts?.[0]}`;
  const startDateTime = new Date(`${formattedDate}T${startTime}`);
  const endDateTime = new Date(`${formattedDate}T${endTime}`);
  if(startDateTime <= today){
    return { startTimeAfterCurrentTime: true }; // Custom error key
  }else if(endDateTime <= startDateTime){
    return { timeRangeValidator: true }; // Custom error key
  }
return null
}
