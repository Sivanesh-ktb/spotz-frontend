import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.html',
  styleUrls: ['./account-settings.css']
})
export class AccountSettingsComponent implements OnInit {

  userEmail  = '';
  userPhon  = '';
  userDetails : any = {};
  tempEmail  = false;
  reminderEmail  = false;
  updateEmail  = false;
  changeEmail  = '';
  constructor(
    private userService : UserService,
    private toastr : ToastrService
  ){
  }
  ngOnInit(){
      this.getUserDetails();
  }
  getUserDetails() {
    this.userService.getUserProfile().subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.userDetails = response.body;
          if (this.userDetails) {
            this.userEmail = this.userDetails?.email;
            this.userPhon = this.userDetails?.phon;
            this.reminderEmail = this.userDetails?.notifications?.reminder?.email;
            this.updateEmail = this.userDetails?.notifications?.updates?.email;
          }
        }
      }
    );
  }
  // update User Email
  updateUserEmail(email : string){
    this.userDetails.email = email;
    this.changeEmail = email;
    this.updateUserDetails();
  }
  // update User Phone Number
  updateUserPhoneNumber(phone : string){
    this.userDetails.phon = phone;
    this.userPhon = phone;
    this.updateUserDetails();
  }
  // update User Notification
  updateUserNotification(remEmail : boolean, updEmail : boolean){
       this.userDetails.notifications={
      updates: {
        email: updEmail?? false
      },
      reminder: {
        email:  remEmail?? false
      }
  }
    this.updateUserDetails();
  }
  updateUserDetails(){ {
    if (this.userDetails) {
      this.userService.updateUserProfile(this.userDetails).subscribe(
        (response: any) => {
          if (response.status === 200) {
            if(this.userEmail !== this.changeEmail){
              this.tempEmail = true;
            }
            this.toastr.success('Save Success User Profile.');
          } else {
            this.toastr.error(response.body.message);
          }
        },
        (error) => {
            this.getUserDetails();
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.toastr.error('User details not found.');
    }
  }
}
closeAlert(){
  this.tempEmail = false;
}

}

