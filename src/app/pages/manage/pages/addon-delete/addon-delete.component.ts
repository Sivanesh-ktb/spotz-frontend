import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addon-delete',
  templateUrl: './addon-delete.component.html',
  styleUrls: ['./addon-delete.component.css']
})
export class AddonDeleteComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddonDeleteComponent>,
    private toastr: ToastrService
  ) {}

  dismissPopup() {
    this.dialogRef.close();
  }

  remove() {
    this.dialogRef.close({ message: 'removeAddon', id: this.data.id });
  }
}
