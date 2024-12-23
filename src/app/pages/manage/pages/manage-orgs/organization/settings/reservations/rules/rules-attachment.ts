import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';
import { ToastrService } from 'ngx-toastr';
import { FileUpload } from 'primeng/fileupload';
import { Helpers } from 'src/app/helpers/helper';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../../space/space-settings/confirmation-popup/confirmation-popup';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-rules-attachment',
  templateUrl: './rules-attachment.html',
  styleUrls: ['./rules-attachment.css'],
})
export class RulesAttachmentComponent implements OnInit {
  files: any[] = [];
  editRow: number | null = null;
  file: any;
  @Input() orgId!: string;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() viewFiles: any[] = [];
  @Input() orgDetails:any;
  uploadUrl: string = this.helper.uploadImageUrl;
  @Output() getUploadedFiles = new EventEmitter<any>();
  constructor(
    private appConst : AppConst,
    private helper: Helpers,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('Initial viewFiles:', this.viewFiles);
  }

  viewFile(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }

  triggerFacFileUpload() {
    this.fileUpload.choose();
  }
  uploadFacMapPdfFile(files: FileList) {
    if (files.length === 0) {
      return; // No files to upload
    }

    const formData: FormData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    this.retrievingOrgDetailsService
      .uploadRulesAttachments(this.orgId, formData)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success(`Successfully uploaded rules and attchment.`);
          this.getUploadedFiles.emit();
        } else {
          this.toastr.error('Facility map upload failed');
        }
      });
  }

  uploadFacMapPdf(event: any) {
    const files: FileList = event.files;
    this.uploadFacMapPdfFile(files);
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleFacMapPdf(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
     const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFacMapPdfFile(files);
    }
  }


  deleteFile(name: string, id: string): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '350px',
      position :{top:'10px'},
      data: {
        type: this.appConst.RULESANDATTACHMENTPDFCONFIRMATION,
        name:name
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.viewFiles = this.viewFiles.filter(file => file._id !== id);

        this.retrievingOrgDetailsService.deleteRulesAttachments(this.orgId, id).subscribe({
          next: () => {
            this.viewFiles = this.viewFiles.filter(file => file._id !== id);
            this.toastr.success(`File "${name}" deleted successfully!`);
          },
          error: () => {
            this.toastr.error('Error occurred while deleting the file.');
          }
        });
      }
    });
  }
}
