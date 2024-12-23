import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-send-email-notifications',
  templateUrl: './send-email-notifications.html',
  styleUrls: ['./send-email-notifications.css']
})
export class SendEmailNotificationsComponent {
  @Input() sendMail!: boolean;
  @Output() sendMailValue = new EventEmitter<boolean>();
  isEmail = false;
  saveSendEmailNotification() {
    this.sendMailValue.emit(this.sendMail);
    this.isEmail = false;
  }
  cancelEmailNotification() {
    this.sendMail = false;
  }
  orgEmail() {
    if (this.isEmail) {
      this.isEmail = false;
    }
    else {
      this.isEmail = true;
    }
  }
}
