import { Component, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FileUpload } from 'primeng/fileupload';
import { Helpers } from 'src/app/helpers/helper';
import { FacilityService } from 'src/app/services/facility.service';

@Component({
  selector: 'app-facility-upload-map',
  templateUrl: './facility-upload-map.html',
  styleUrls: ['./facility-upload-map.css',
    '../../../../../../../../assets/css/manage-org-common.css'
  ]
})
export class FacilityUploadMapComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() facilityId!: string;
  @Input() viewMapUrl!: string;
  uploadUrl : string = this.helper.uploadImageUrl;
  constructor(
    private helper : Helpers,
    private toastr : ToastrService,
    private facilityService : FacilityService
  )
  {

  }
  uploadFacMapPdf(event: any) {
    const files: FileList = event.files;
    this.uploadFacMapPdfFile(files);
  }
  handleFacMapPdf(event: any) {
    event.preventDefault();
  }
  triggerFacFileUpload() {
    this.fileUpload.choose();
  }
  uploadFacMapPdfFile(files: FileList){

const formData : FormData = new FormData();
Array.from(files).forEach(file => formData.append('files', file));
this.facilityService.uploadFacilityMapPdf(this.facilityId, formData).subscribe(
  (response: any) => {
    if(response.status === 200){
      this.toastr.success(`Successfully uploaded facility map.`);
      this.viewMapUrl = response.body.url;
    } else {
      this.toastr.error('Facility map upload failed');
    }
  }
);
  }

}
