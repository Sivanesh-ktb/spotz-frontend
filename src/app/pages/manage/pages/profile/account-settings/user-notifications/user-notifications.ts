import { Component, Input } from '@angular/core';
import { AccountSettingsComponent } from '../account-settings';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.html',
  styleUrls: ['./user-notifications.css',
    '../account-settings.css'
  ]
})
export class UserNotificationsComponent {
  @Input() updateEmail!: boolean;
  @Input () reminderEmail!:boolean;

  constructor(
    private accountSettingsComponent : AccountSettingsComponent
  ){

  }
  updateReminderEmail(){
    console.log('clicked');
    this.accountSettingsComponent.updateUserNotification(this.reminderEmail, this.updateEmail);
  }
}
