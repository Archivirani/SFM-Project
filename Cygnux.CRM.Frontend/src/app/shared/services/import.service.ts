import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { LeadService } from './lead.service';
import { ToastrService } from 'ngx-toastr';
import { CallService } from './call.service';
import { ComplaintService } from './complaint.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  selectedFile: File | null = null;
  constructor(private commonService: CommonService,private leadService: LeadService,private toasterService: ToastrService, private callService: CallService,private complaintService:ComplaintService) { }

triggerFileInput(event: Event): void {
  event.preventDefault();
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput.click();
}

onFileChange(event: any, type: string): void {
  const file = event.target.files[0];

  if (file) {
    const validExcelTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'application/vnd.ms-excel', // XLS
      'text/csv', // CSV
      'application/vnd.ms-excel.sheet.binary.macroEnabled.12', // XLSB
      'application/vnd.ms-excel.sheet.macroEnabled.12', // XLSM
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template', // XLTX
      'application/vnd.ms-excel.template.macroEnabled.12', // XLTM
    ];
    if (validExcelTypes.includes(file.type)) {
      if (file.size > 10485760) { // Limit file size to 10MB (example)
        this.toasterService.error('File size exceeds the 10MB limit.');
        return;
      }

      this.selectedFile = file;
      const formData = new FormData();
      formData.append('file', file);

      if (type === 'lead') {
        this.importData(formData, this.leadService.importLead.bind(this.leadService));
      } else if (type === 'call') {
        this.importData(formData, this.callService.importCall.bind(this.callService));
      }else if (type === 'complaints') {
        this.importData(formData, this.complaintService.importComplaint.bind(this.complaintService));
      } else {
        this.toasterService.error('Invalid type specified for file import.');
      }
    
    } else {
      this.toasterService.error('Please upload a valid excel file (XLSX, XLS, or CSV).');
      this.selectedFile = null;
    }
  }
}

private importData(dataToSubmit: any, importFunction: (data: any) => any): void {
  this.commonService.updateLoader(true);

  importFunction(dataToSubmit).subscribe({
    next: (response: any) => {
      if (response.success) {
        this.toasterService.success(response.data.message);
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
