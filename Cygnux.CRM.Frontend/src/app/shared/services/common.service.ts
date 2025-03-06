import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loading = new BehaviorSubject(false);
  isLoading = this.loading.asObservable();
  public userChart = new Subject<boolean>()
  public complaintViewModal = new Subject<any>()
  updateLoader(isLoading: boolean) {
    this.loading.next(isLoading);
  }

  isDateDisabled = (date: { year: number; month: number; day: number }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
  
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    selectedDate.setHours(0, 0, 0, 0); // Normalize selected date
  
    return selectedDate < today; // Disable only past dates, allow today
  };
  ranges: IRange[] = [
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()],
      label: 'Last 7 Days',
    },
    {
      value: [new Date(), new Date()],
      label: 'Today',
    },
    {
      value: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      label: 'Yesterday',
    },
    {
      value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()],
      label: 'Last 30 Days',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        new Date(),
      ],
      label: 'This Month',
    },
    {
      value: [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
      label: 'Last Month',
    },
  ];
}

interface IRange {
  value: Date[];
  label: string;
}
