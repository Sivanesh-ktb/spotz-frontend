import { Component, Input } from '@angular/core';
import { AccountSettingsComponent } from '../account-settings';

@Component({
  selector: 'app-user-email',
  templateUrl: './user-email.html',
  styleUrls: ['./user-email.css',
    '../account-settings.css'
  ]
})
export class UserEmailComponent {

  @Input() userEmail! : string;
  hideEditEmail = true;
  constructor(
    private accountSettingsComponent : AccountSettingsComponent
  ){

  }
  updateEmail(){
    this.hideEditEmail = false;
  }
  confirmEmail(){
    this.accountSettingsComponent.updateUserEmail(this.userEmail);
    this.hideEditEmail = true;
  }
  cancelEmail(){
    this.hideEditEmail = true;
  }
}
