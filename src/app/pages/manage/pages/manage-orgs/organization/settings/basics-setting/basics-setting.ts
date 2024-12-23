import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { legal } from 'src/app/models/org';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { DepositsService } from 'src/app/services/deposits.service';
import { retrievingOrgDetailsService } from 'src/app/services/retrieving-org.service';

@Component({
  selector: 'app-basics-setting',
  templateUrl: './basics-setting.html',
  styleUrls: ['./basics-setting.css'],
})
export class BasicsSettingComponent implements OnChanges {
  @Input() orgDetails: any;
  @Input() orgId!: string;
  @Output() callOrgAPI = new EventEmitter<any>();
  constructor(
    private createOrgService: CreateOrgComponentService,
    private toastr: ToastrService,
    private depositsService: DepositsService,
    private retrievingOrgDetailsService: retrievingOrgDetailsService
  ) {}
  legal!: legal;
  ngOnChanges() {
    this.orgDetails = this.orgDetails;
    this.legal = this.orgDetails?.legal;
  }
  OnLegalChanges(event: any) {
    this.legal = event;
    this.orgDetails.legal = this.legal;
    this.updateOrgDetails();
  }
  OnSalesTaxValue(event: number) {
    this.orgDetails.salesTax = event;
    this.updateOrgDetails();
  }
  OnTagsChanges(event: string[]) {
    this.orgDetails.tags = event;
    this.updateOrgDetails();
  }
  onAcctsChanges(event: any) {
    this.orgDetails.accts = event;
    this.updateOrgDetails();
  }
  onInsChanges(event: any) {
    this.orgDetails.insurance = event;
    this.updateOrgDetails();
  }
  onInsuranceRemoved(insurance: any) {
    console.log(this.orgDetails.insurance, 'this.orgDetails.insurance');
     console.log(this.orgDetails.insurance.length, 'this.orgDetails.insurance');
    if (
      this.orgDetails.insurance &&
      this.orgDetails.insurance._id === insurance._id
    ) {
       this.orgDetails.insurance = false;
      console.log('Insurance has been removed from orgDetails.');
    } else {
      console.error('No matching insurance found to remove.');
    }
    this.updateOrgDetails();
  }
  updateOrgDetails() {
    this.createOrgService
      .modifyOrgDetails(this.orgId, this.orgDetails)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Save Success ' + response.body.name);
        }
      });
  }
  onUpdateDepositsDetails(event: any) {
    this.orgDetails.deposits = event;
    this.createNewDeposit();
  }
  onNewDepositSave(event: any) {
    this.orgDetails.deposits.find((deposit: any) => {
      if (deposit._id === event._id) {
        deposit = event;
      }
    });
    this.updateOrgDeposits(event._id);
  }
  onDeleteDeposits(event: any) {
    this.deleteOrgDeposits(event._id);
  }
  createNewDeposit() {
    this.depositsService
      .createOrganizationDeposit(this.orgId, this.orgDetails)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Deposit Created');
          this.callOrgAPI.emit();
        }
      });
  }
  updateOrgDeposits(depositId: string) {
    this.depositsService
      .updateOrganizationDeposit(this.orgId, depositId, this.orgDetails)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Deposit Updated');
          this.callOrgAPI.emit();
        }
      });
  }
  deleteOrgDeposits(depositId: string) {
    this.depositsService
      .deleteOrganizationDeposit(this.orgId, depositId, this.orgDetails)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Deposit Deleted');
          this.callOrgAPI.emit();
        }
      });
  }
  onUserFeesValue(event: boolean) {
    this.orgDetails.userFees = event;
    this.updateOrgDetails();
  }
  onSendMailValue(event: boolean) {
    this.orgDetails.sendMail = event;
    this.updateOrgDetails();
  }
  onSpotzFeesValue(event: any) {
    this.orgDetails.spotzFees = event;
    this.updateOrgDetails();
  }
}
