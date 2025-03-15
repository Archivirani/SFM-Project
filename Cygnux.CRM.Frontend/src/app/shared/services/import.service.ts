import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { LeadService } from './lead.service';
import { ToastrService } from 'ngx-toastr';
import { CallService } from './call.service';
import { ComplaintService } from './complaint.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  selectedFile: File | null = null;
  constructor(private commonService: CommonService,private leadService: LeadService,private toasterService: ToastrService, private callService: CallService,private complaintService:ComplaintService) { }
  typeSubject=new Subject<boolean>()
triggerFileInput(event: Event): void {
  event.preventDefault();
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
}

onFileChange(event: any, type: string): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];

    if (file) {
      const validExcelTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        'application/vnd.ms-excel.sheet.macroEnabled.12',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        'application/vnd.ms-excel.template.macroEnabled.12',
      ];

      if (validExcelTypes.includes(file.type)) {
        if (file.size > 10485760) {
          this.toasterService.error('File size exceeds the 10MB limit.');
          return;
        }

        this.selectedFile = file;
        const formData = new FormData();
        formData.append('file', file);

        if (type === 'lead') {
          this.importData(formData, this.leadService.importLead.bind(this.leadService), type);
        } else if (type === 'call') {
          this.importData(formData, this.callService.importCall.bind(this.callService), type);
        } else if (type === 'complaints') {
          this.importData(formData, this.complaintService.importComplaint.bind(this.complaintService), type);
        } else {
          this.toasterService.error('Invalid type specified for file import.');
        }

        // **Important: Reset the file input value after a short delay**
        setTimeout(() => {
          fileInput.value = '';
        }, 100);
      } else {
        this.toasterService.error('Please upload a valid excel file (XLSX, XLS, or CSV).');
        this.selectedFile = null;
      }
    }
  }
}


private importData(dataToSubmit: any, importFunction: (data: any) => any,type:string): void {
  this.commonService.updateLoader(true);

  importFunction(dataToSubmit).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.toasterService.success(response.data.message);
        if(type === 'lead'){
          this.typeSubject.next(true);
        }else if(type === 'call'){
          this.typeSubject.next(true);
        }else if(type === 'complaints'){
          this.typeSubject.next(true);
        }
      } else {
        this.toasterService.error(response.error.message);
      }
      this.commonService.updateLoader(false);
    },
    error: (response: any) => {
      this.toasterService.error('An error occurred while importing.');
      this.commonService.updateLoader(false);
    }
  });
}
}
