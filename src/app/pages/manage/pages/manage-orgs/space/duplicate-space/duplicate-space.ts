

import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SpaceService } from "src/app/services/space.service";

@Component({
  selector: 'app-duplicate-space',
  templateUrl:'./duplicate-space.html',
  styleUrls:['./duplicate-space.css']
})

export class DuplicateSpaceComponent{


  displayName = '';
  spaceId  = '';
  facId  = '';
  orgId  = '';
  facName  = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spaceService : SpaceService,
    private toastr : ToastrService,
    private router : Router,
    private dialogRef :MatDialogRef<DuplicateSpaceComponent>
  )
  {
    this.displayName = data.displayName;
    this.spaceId = data.spaceId;
    this.facId = data.facId;
    this.orgId = data.orgId;
    this.facName = data.facName +'-COPY';
  }

  dismissDuplicatePopup(){
    this.dialogRef.close();
  }
  duplicateSpaceConfirm(){
    this.spaceService.duplicateSpace(this.spaceId).subscribe(
      (response : any) => {
        if(response.status === 200){
          this.toastr.success(response.body.name+' '+'Space duplicated successfully');
          console.log(response.body);
          this.dialogRef.close();
          this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facId}/space/${response.body._id}`]);
        }
        else{
          this.toastr.error(response.body.message);
        }
      }
    )
  }
}



