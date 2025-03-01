import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { LayoutModule } from './components/layouts/layout.module';
import {
  CustomAdapter,
  CustomDateParserFormatter,
} from './components/shared/date-picker/date-picker-adapter';
import { CommonService } from './shared/services/common.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LayoutModule, RouterOutlet,NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AppComponent {
  public loading: string = 'disable';

  title = 'Cygnux.CRM.Frontend';

  constructor(public commonService: CommonService,public spinner: NgxSpinnerService) {
    this.commonService.isLoading.subscribe({
      next: (response) => {
        setTimeout(()=>{
          if (response != null) {
            this.loading = response ? 'enable' : 'disable';
          }
        },500)
      },
      error: (response: any) => {},
    });
  }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }
  
}
