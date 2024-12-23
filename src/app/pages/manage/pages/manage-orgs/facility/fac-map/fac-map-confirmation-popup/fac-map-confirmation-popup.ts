import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-fac-map-confirmation-popup',
  templateUrl: './fac-map-confirmation-popup.html',
  styleUrls: ['./fac-map-confirmation-popup.css']
})
export class FacMapConfirmationPopupComponent implements OnInit {
  orgId='';
  facId='';
  status=0;
  confirmationMessage='';
  constructor(
    public dialogRef: MatDialogRef<FacMapConfirmationPopupComponent>,
    private toastr: ToastrService,
    private appConst: AppConst,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orgId = data.orgId;
    this.facId = data.facId;
    this.status = data.status;
  }
ngOnInit(): void{
  if(this.status === 1){
    this.confirmationMessage = this.appConst.updateMapLocation;
  }
  else if(this.status === 2){
    this.confirmationMessage = this.appConst.clearMapLocation;
  }
}
no(){
    this.dialogRef.close();
  }
  yes(){
    if(this.status ===1){
      this.dialogRef.close({status:1});
    }
    else if(this.status ===2){
      this.dialogRef.close({status:2});
    }
  }
}
