
import { Component, Input, OnInit } from '@angular/core';
import { Deposit, SpaceData } from "src/app/models/space";
import { SpaceSettingsComponent } from "../space-settings";
import { SpaceService } from 'src/app/services/space.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector:'app-deposits',
  templateUrl:'./deposits.html',
  styleUrls:['./deposits.css',
    '../space-settings.css'
  ]
})

export class DepositsComponent implements OnInit {
 @Input() spaceDetails!: SpaceData;
 @Input() deposits!: Deposit[];
  showNewDeposit = false;
  depositName  = '';
  depositText  = '';
  depositAmount = 0;
  spaceId = '';
  newDeposit : Deposit []= [];
  position = 'center';
  constructor(
    private spaceService: SpaceService,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private spaceSettingsComponent: SpaceSettingsComponent,
  ){

  }
ngOnInit(): void{
  this.router.paramMap.subscribe(paramMap=>{
    this.spaceId = paramMap.get('spaceId') ?? '';
  })
}

onUpdateDepositsDetails(event:any){
  return this.updateSpaceDeposits(event);
 }
 onNewDepositSave(event:any){
  this.updateSpaceDepositsDetails(event, event._id);
 }
 onDeleteDeposits(event:any){
  this.deleteSpaceDeposit(this.spaceId, event._id);
 }
   updateSpaceDeposits(newDeposit : Deposit[]){ {
    this.spaceService.createSpaceDeposit(this.spaceId, newDeposit).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.showNewDeposit = false;
          this.toastr.success('Space Saved' + ' ' + this.spaceDetails?.name);
          return this.spaceSettingsComponent?.getSettingsSpaceDetails();
        } else {
          return this.toastr.error(response.body.message);
        }
      }
    );
  }
}
updateSpaceDepositsDetails(newDeposit :any, depositId: string){
  return this.spaceService.spaceDetailsUpdateDeposit(this.spaceId, newDeposit, depositId).subscribe(
    (response : any) => {
      if(response.status === 200){
        this.toastr.success('Space Saved' + ' ' + this.spaceDetails?.name);
        return this.spaceSettingsComponent?.getSettingsSpaceDetails();
      } else {
        return this.toastr.error(response.body.message);
      }
    }
  )
}
deleteSpaceDeposit(spaceId: string,depositId:string)
  {
  return this.spaceService.spaceDepositDetailsDelete(spaceId,depositId).subscribe(
    (response : any) =>{
      if(response.status === 200){
        this.toastr.success('Removed deposit' + ' ' + this.spaceDetails?.name);
        return this.spaceSettingsComponent?.getSettingsSpaceDetails();
      } else {
        return this.toastr.error(response.body.message);
      }
    })
  }
}



