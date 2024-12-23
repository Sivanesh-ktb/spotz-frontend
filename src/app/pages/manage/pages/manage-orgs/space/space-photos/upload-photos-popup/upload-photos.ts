import { Component, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FileUpload } from "primeng/fileupload";
import { SpaceService } from "src/app/services/space.service";

@Component({
  selector: 'app-upload-photos',
  templateUrl: './upload-photos.html',
  styleUrls: ['./upload-photos.css']
})
export class UploadPhotosComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  spaceId = '';
  orgId = '';
  facId = '';
  spaceImages: any[] = [];
  uploadUrl = '';
  spaceDetails: any = {};

  constructor(
    public dialogRef: MatDialogRef<UploadPhotosComponent>,
    private spaceService: SpaceService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orgId = data.orgId;
    this.facId = data.facId;
    this.spaceId = data.spaceId;
    this.uploadUrl = data.uploadUrl;
  }

  dismiss() {
    this.dialogRef.close();
  }

  uploadSpaceImage(event: any) {
    const files: FileList = event.files;
    this.storeSpaceImages(files);
  }

  handleSpaceDropImg(event: any) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.storeSpaceImages(files);
    }
  }

  handleSpaceDragImg(event: any) {
    event.preventDefault();
  }

  triggerSpaceFileUpload() {
    this.fileUpload.choose();
  }

  storeSpaceImages(files: FileList) {
    const formData: FormData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    formData.append('facId', this.facId);
    formData.append('orgId', this.orgId);
    this.spaceService.uploadSpaceImages(this.spaceId, formData).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.dialogRef.close('success');
          this.toastr.success(`${response.body} Images uploaded successfully`);
        } else {
          this.toastr.error('Images upload failed');
        }
      },
      (error) => {
        this.toastr.error('Images upload failed',error.message);
      }
    );
  }
}
