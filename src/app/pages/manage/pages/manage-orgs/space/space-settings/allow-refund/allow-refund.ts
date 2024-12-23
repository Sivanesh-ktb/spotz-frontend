

import { Component, Input } from "@angular/core";
import { SpaceData } from "src/app/models/space";
import { SpaceSettingsComponent } from "../space-settings";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector:'app-allow-refund',
  templateUrl:'./allow-refund.html',
  styleUrls:['./allow-refund.css',
    '../space-settings.css'
  ]
})

export class AllowRefundComponent {
  @Input() spaceDetails!:SpaceData;
  @Input() isRefundable!:boolean;
  @Input() checkIsRefundable!:boolean;
  constructor(
    private settingsComponent: SpaceSettingsComponent,
    private dialog : MatDialog,
  ) {
  }

  spaceRefund(event : Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked === this.isRefundable){
      this.checkIsRefundable = this.isRefundable;
    }
    else{
      this.checkIsRefundable = isChecked;
    }
  }
  saveRefundable(){
    this.isRefundable = this.checkIsRefundable;
    this.checkIsRefundable = this.isRefundable;
  return this.settingsComponent?.updateSpaceRefundable(this.isRefundable);
  }
  cancelRefundable(){
    this.checkIsRefundable = this.isRefundable;

  }
}


