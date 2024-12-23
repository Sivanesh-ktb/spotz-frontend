import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpaceService } from 'src/app/services/space.service';

@Component({
  selector: 'app-delete-availability',
  templateUrl: './delete-availability.html',
  styleUrls: ['./delete-availability.css']
})
export class DeleteAvailabilityComponent {
  id='';
  orgId ='';
  constructor(
    public dialogRef: MatDialogRef<DeleteAvailabilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
     id:string
     orgId:string
    },
    private spaceService: SpaceService
   ){
    this.id = data.id;
    this.orgId = data.orgId;
   }
   deleteRule(){

    this.spaceService.deleteSpaceAvailability(this.orgId,this.id).subscribe(
      (response:any)=>{
        if(response.status === 200){
          this.dialogRef.close({status:1});
        }
      }
    );
   }
   dismiss(){
    this.dialogRef.close();
   }

}
