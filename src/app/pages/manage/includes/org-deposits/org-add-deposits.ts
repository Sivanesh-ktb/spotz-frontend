import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Deposit } from 'src/app/models/space';
import { ConfirmationPopupComponent } from '../../pages/manage-orgs/space/space-settings/confirmation-popup/confirmation-popup';
import { MatDialog } from '@angular/material/dialog';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-org-add-deposits',
  templateUrl: './org-add-deposits.html',
  styleUrls: ['./org-add-deposits.css']
})
export class OrgAddDepositsComponent {
  @Input() deposits!: Deposit[];
  @Output() newDepositSave = new EventEmitter<any>();
  @Output() updateDepositsDetails = new EventEmitter<any>();
  @Output() deleteDeposits = new EventEmitter<any>();
  position = 'center';
  showNewDeposit = false;
  depositName = '';
  depositText = '';
  depositAmount = 0;
  valid = true;
  constructor(
    private dialog: MatDialog,
    private appConst: AppConst
  ) {

  }
  toggleEdit(deposit: any) {
     this.deposits.forEach((d) => (d.active = true));
    deposit.active = false;
  }

  saveDeposit(deposit: any) {
    const index = this.deposits.findIndex((d: any) => d._id === deposit._id);
    if (index !== -1) {
      this.deposits[index] = {
        ...this.deposits[index],
        name: deposit.name,
        text: deposit.text,
        amount: deposit.amount,
        active: true
      };
      this.newDepositSave.emit(this.deposits[index]);
      this.showNewDeposit = false;
    } else {
      console.error('Deposit not found');
    }
  }
  cancelEdit(deposit: any) {
    deposit.active = true;
  }
  deleteDeposit(deposit: any) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      position: { top: '10px' },
      panelClass: 'top-slide-animation',
      data: {
        type: this.appConst.ORGDEPOSITCONFIRAMTION,
        name: deposit.name
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === this.appConst.ORGDEPOSITCONFIRAMTION) {
        this.deleteDeposits.emit(deposit);
      }
    });
  }
  addNewDeposit() {
    this.depositName = '';
    this.depositText = '';
    this.depositAmount = 0;
    this.showNewDeposit = true;
  }
  newDepositCancel() {
    this.showNewDeposit = false;
  }
  saveNewDeposit() {
    if(this.depositName && this.depositText && this.depositAmount){
    this.deposits = [{
      _id: '',
      name: this.depositName,
      text: this.depositText,
      amount: this.depositAmount,
      active: true,
    }]
    this.updateDepositsDetails.emit(this.deposits);
    this.showNewDeposit = false;
  }
  else{
    this.valid = false;
  }

  }
  validateForm(){
    if(!this.depositName || !this.depositText || !this.depositAmount){
      this.valid = true;
    }
    else{
    this.valid = false;
    }
  }
}
