import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../../space/space-settings/confirmation-popup/confirmation-popup';
import { AppConst } from 'src/app/app.const';

type RepliesType = {
  accepted: string;
  denied: string;
  cancelled: string;
  edit: string;
};

@Component({
  selector: 'app-replies',
  templateUrl: './replies.html',
  styleUrls: ['./replies.css']
})
export class RepliesComponent implements OnInit {
  orgId = '';
  orgDetails: any = {};
  replies: RepliesType = {
    accepted: '',
    denied: '',
    cancelled: '',
    edit: ''
  };
  showReplies: { [key: string]: boolean } = {
    accepted: false,
    denied: false,
    cancelled: false
  };

  activeTab: 'accepted' | 'denied' | 'cancelled' = 'accepted';
  selectedTabToRemove = '';
  validateTab = false;
  constructor(
    private appConst: AppConst,
    private dialog: MatDialog,
    private retrievingOrgDetailsService: retrievingOrgDetailsService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      if (this.orgId) {
        this.retrievingOrgDetails(this.orgId);
      }
    });
  }

  retrievingOrgDetails(orgId: string) {
    this.retrievingOrgDetailsService.getOrgSpaceTemplates(orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.orgDetails = response.body;
          this.replies = this.orgDetails.replies || this.replies;
          this.replies.edit = this.replies[this.activeTab] || '';
        }
      }
    );
  }

  switchTab(type: 'accepted' | 'denied' | 'cancelled') {
    this.activeTab = type;
    this.showReplies = {
      accepted: false,
      denied: false,
      cancelled: false
    };
  }

  openRemoveModal(tabName: string) {
    this.selectedTabToRemove = tabName;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      position :{top:'10px'},
      data: {
        type: this.appConst.REPLYCONFIRMATION,
        name:tabName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result?.status === this.appConst.REPLYCONFIRMATION) {
       this.confirmRemoveReply();
      }
    });
  }

  confirmRemoveReply() {
    if (this.selectedTabToRemove) {
      this.replies[this.selectedTabToRemove as keyof RepliesType] = '';
      this.showReplies[this.selectedTabToRemove as keyof typeof this.showReplies] = false;
    }

    const dataToSave = {
      ...this.orgDetails,
      replies: {
        ...this.orgDetails.replies,
        [this.selectedTabToRemove]: ''
      }
    };

    this.retrievingOrgDetailsService.updateOrgSpaceTemplates(this.orgId, dataToSave).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.toastr.success('Reply removed successfully');
        } else {
          this.toastr.error('Failed to remove reply');
        }
      },
      (error) => {
        this.toastr.error('Error removing reply');
        console.error('Error saving reply:', error);
      }
    );

    this.selectedTabToRemove = '';
  }

  editReply(type: 'accepted' | 'denied' | 'cancelled') {
    this.activeTab = type;
    this.showReplies = {
      accepted: false,
      denied: false,
      cancelled: false
    };
    this.showReplies[type] = true;
    this.validateTab = true;
    // Set edit field to the current reply content for the active tab
    this.replies.edit = this.replies[type];
  }

  saveReply() {
    if (!this.orgId) {
      this.toastr.error('Organization ID is missing');
      return;
    }
    this.validateTab = false;
    const dataToSave = {
      ...this.orgDetails,
      replies: {
        ...this.orgDetails.replies,
        [this.activeTab]: this.replies.edit
      }
    };

    this.retrievingOrgDetailsService.updateOrgSpaceTemplates(this.orgId, dataToSave).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.toastr.success(`Save successfully with ${this.orgDetails.name} `);
          // Update the replies object with the edited content
          this.replies[this.activeTab] = this.replies.edit;
          this.showReplies[this.activeTab] = false;
        } else {
          this.toastr.error('Failed to save reply');
        }
      },
      error => {
        this.toastr.error('Error saving reply');
        console.error('Error saving reply:', error);
      }
    );
  }

  cancelReply() {
    this.showReplies = {
      accepted: false,
      denied: false,
      cancelled: false
    };
    this.validateTab = false;
  }
}
