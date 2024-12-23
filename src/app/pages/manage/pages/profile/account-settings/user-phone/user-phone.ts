import { Component, Input } from '@angular/core';
import { AccountSettingsComponent } from '../account-settings';

@Component({
  selector: 'app-user-phone',
  templateUrl: './user-phone.html',
  styleUrls: ['./user-phone.css',
     '../account-settings.css'
  ]
})
export class UserPhoneComponent {
  @Input() userPhon!: string;
  hideEditPhoneNumber  = true;
  constructor(
    private accountSettingsComponent : AccountSettingsComponent
  ){


  }
  confirmPhoneNumber(){
   this.accountSettingsComponent.updateUserPhoneNumber(this.userPhon);
   this.hideEditPhoneNumber = true;
  }
  updatePhoneNumber(){
   this.hideEditPhoneNumber = false;
  }
  cancelPhoneNumber(){
 this.hideEditPhoneNumber = true;
  }
}
