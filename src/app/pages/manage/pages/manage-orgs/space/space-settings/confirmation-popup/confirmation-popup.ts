import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.html',
  styleUrls: ['./confirmation-popup.css']
})
export class ConfirmationPopupComponent implements OnInit {
  spaceDetails: any;
  rental: number;
  type: number;
  name = '';
  heading='';
  parent_content = '';
  child_content = '';
  status=0;
  constructor(
    private appConst : AppConst,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef : MatDialogRef<ConfirmationPopupComponent>,
  )
  {
    this.spaceDetails = data.spaceDetails;
    this.rental = data.rental;
    this.type = data.type;
    this.name = data.name;
  }
  ngOnInit() {
    this.heading = ' Are you sure?';
    if(this.type === this.appConst.RENTALSETTINGCONFIRMATION){
      this.status = this.appConst.RENTALSETTINGCONFIRMATION;
      this.spaceDetails.rental.block = this.rental;
      this.heading = 'CHANGE RENTAL SETTINGS';
      this.parent_content=`Are you sure you would like to update rental settings for "${this.spaceDetails.name}" ?
      <br/></br>
      Changing the size of the rental blocks may leave unrentable time blocks.`;
    }
    else if(this.type === this.appConst.REMOVEPRICINGCONFIRMATION){
      this.status = this.appConst.REMOVEPRICINGCONFIRMATION; // 2 for remove pricing
      this.parent_content=`Remove pricing '${this.name}' from space?`;
    }
    else if (this.type === this.appConst.REMOVEALLPRICINGCONFIRMATION){
      this.status =this.appConst.REMOVEALLPRICINGCONFIRMATION;
      this.parent_content = 'Remove all custom pricing from space and save?';
    }
    else if(this.type === this.appConst.PRICINGTOOLCONFIRAMTION){
      this.status = this.appConst.PRICINGTOOLCONFIRAMTION;
      this.parent_content = 'Remove template from pricing?';
    }
    else if(this.type === this.appConst.TIMEBLOCKCONFIRMATION){
      this.status = this.appConst.TIMEBLOCKCONFIRMATION;
      this.parent_content = `Overwrite existing space pricing with template"${this.name } "?`;
    }
    else if(this.type === this.appConst.ORGDEPOSITCONFIRAMTION){
      this.status = this.appConst.ORGDEPOSITCONFIRAMTION;
      this.parent_content = `Remove deposit '${this.name}' from organization?`;
    }
    else if(this.type === this.appConst.REPLYCONFIRMATION){
      this.status = this.appConst.REPLYCONFIRMATION;
      this.parent_content = `Remove "${this.name }" default reply?`;
    }
    else if (this.type === this.appConst.RULESANDATTACHMENTPDFCONFIRMATION) {
      this.status = this.appConst.RULESANDATTACHMENTPDFCONFIRMATION;
      this.parent_content = `Are you sure? Delete file "${this.name}" from attachments?`;
    } else if(this.type === this.appConst.INSURANCECONFIRMATION){
      this.status = this.appConst.INSURANCECONFIRMATION;
      this.parent_content = `Are you sure? Remove insurance settings from the organization? Rentals will no longer be covered by insurance.'`;
    } else if(this.type === this.appConst.SWITCHSPACE){
      this.status = this.appConst.SWITCHSPACE;
      this.parent_content = `Our apologies, but we are not quite ready to process requests for multiple spaces at a time.<br/><br/>
      Should we clear your cart and proceed with your search at ${this.name}?<br/><br/>
      <i>Selecting 'no' will keep the items in your cart.</i>`
    } else if(this.type === this.appConst.REMOVE_OPERATING_HOUR_CONFIRMATION){
      this.status = this.appConst.REMOVE_OPERATING_HOUR_CONFIRMATION;
      this.heading = 'REMOVE HOURS';
      this.parent_content=`${this.name}`;
    } else if(this.type === this.appConst.RENTABLESPACECONFIRMATION){
      this.status = this.appConst.RENTABLESPACECONFIRMATION;
      const msg = this.name ? 'Remove this space from rentable spaces?' : 'Add this space to rentable spaces?';
      this.parent_content = msg;
    }
  }
  dismissPopup(){
    this.dialogRef.close();
  }
  update(status:number){
    this.dialogRef.close({status:status,
    });
  }
}
