import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConst } from 'src/app/app.const';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';

@Component({
  selector: 'app-public-events',
  templateUrl: './public-events.html',
  styleUrls: ['./public-events.css']
})
export class PublicEventsComponent implements OnInit {
  isEditMode = false;
  org: { showBookingDetails: boolean } = {
    showBookingDetails: false
  };
  orgId = '';
  orgDetails: any;

  constructor(
    private appConst: AppConst,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
    });
    if (this.orgId) {
      this.retrievingOrgDetails(this.orgId);
    }
  }

  retrievingOrgDetails(orgId: string) {
    this.retrievingOrgDetailsService.getOrgSpaceTemplates(orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.orgDetails = response.body;
          console.log(this.orgDetails, 'orgDetails');
          this.org.showBookingDetails = this.orgDetails?.showBookingDetails ?? true;
        }
      });
  }

  save(): void {
    const dataToSave = {
      ...this.orgDetails,
      showBookingDetails: this.org.showBookingDetails
    };
    this.retrievingOrgDetailsService.updateOrgSpaceTemplates(this.orgId, dataToSave).subscribe(
      (response: any) => {
        if (response.status === 200) {
          console.log(response);
          this.toastr.success('Reply saved successfully');
        } else {
          this.toastr.error('Failed to save reply');
        }
      },
      (error) => {
        this.toastr.error('Error saving reply');
        console.error('Error saving reply:', error);
      }
    );
    this.isEditMode = false;
  }

  bookingDetailsSetting(value: boolean): string {
    return value ? 'Yes - Display event names publicly' : 'No - Do not display event names';
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  cancelEdit() {
    this.isEditMode = false;
  }
}
