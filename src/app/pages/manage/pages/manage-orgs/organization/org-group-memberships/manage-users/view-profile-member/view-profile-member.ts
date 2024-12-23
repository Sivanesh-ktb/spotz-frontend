import { HttpResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { orgUserDetails } from 'src/app/models/org';
import { ManageOrgService } from 'src/app/services/manage-org.service';

@Component({
  selector: 'app-view-profile-member',
  templateUrl: './view-profile-member.html',
  styleUrls: ['./view-profile-member.css'],
})
export class ViewProfileMemberComponent {
  visible = true;
  id: string;
  userDetails: orgUserDetails = {} as orgUserDetails;
  constructor(
    public manageOrgService:ManageOrgService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ViewProfileMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.manageOrgService.getIndividualUserDetails(this.id).subscribe(
      (response: HttpResponse<any>) => {
        if(response.status === 200) {
          this.userDetails = response.body;
        } else {
          toastr.error(response.body.message);
        }
      },
      (error) => {
        toastr.error(error.error.message);
        console.error('Error fetching user details:', error);
      }
    );
  }
  formatPhoneNumber(phone: string): string {
    if (phone.length === 10) {
      return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
    }
    return phone;
  }

  closeDialog() {
    this.dialogRef.close();
   }
}
