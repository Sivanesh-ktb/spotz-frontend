import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-contact-information',
  templateUrl: './delete-contact-information.html',
  styleUrls: ['./delete-contact-information.css']
})
export class DeleteContactInformationComponent {
name  = '';
  constructor(
    public dialogRef: MatDialogRef<DeleteContactInformationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )
  {

    this.name = data.name;
  }

  dismiss(){
    this.dialogRef.close();
  }
  deleteContact(){
    this.dialogRef.close('success');
  }
}
