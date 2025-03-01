import { CommonModule, DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddCallComponent } from './add-call/add-call.component';
import { CallListComponent } from './call/call-list.component';
import { CallRoutes } from './calls.routes';
import { ExportService } from '../../shared/services/export.service';
import { CallDetailComponent } from './call-detail/call-detail.component';
import { LayoutModule } from '../layouts/layout.module';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';

@NgModule({
  declarations: [CallListComponent, AddCallComponent, CallDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CallRoutes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgbPaginationModule,
    LayoutModule,
  ],
  exports: [AddCallComponent],
  providers: [DatePipe, DateFormatPipe, ExportService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CallModule {}
