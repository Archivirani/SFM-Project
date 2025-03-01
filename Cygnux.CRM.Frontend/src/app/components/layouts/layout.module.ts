import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full/full.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { CardListComponent } from './card-list/card-list.component';
import { UserChartComponent } from './user-chart/user-chart.component';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { CountUpDirective } from '../../shared/directives/count-up.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgApexchartsModule } from "ng-apexcharts";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    FullComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    CardListComponent,
    UserChartComponent,
    CountUpDirective
  ],
  exports: [FullComponent,CardListComponent,UserChartComponent],
  imports: [CommonModule, RouterModule,ChartsModule,CanvasJSAngularChartsModule, BsDatepickerModule.forRoot(),FormsModule,NgSelectModule,NgApexchartsModule],
})
export class LayoutModule {}
