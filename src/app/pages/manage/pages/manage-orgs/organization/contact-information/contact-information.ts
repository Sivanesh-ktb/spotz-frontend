import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { addContact } from 'src/app/models/org';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { DeleteContactInformationComponent } from './delete-contact-information/delete-contact-information';

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.html',
  styleUrls: ['./contact-information.css']
})
export class ContactInformationComponent implements OnInit {
  orgDetails: any;
  orgId = '';
  orgContactInfo: any[] = [];
  addContact: addContact[] = [];
  isEditing = false;
  addMoreContact = true;
  action = '';
  pagedOrgDetails: any[] = [];
  totalItems = 0;
  pageSize = 10;
  page = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private manageOrgService: ManageOrgService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.viewOrgDetails();
    });
  }

  viewOrgDetails() {
    this.manageOrgService.getViewOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.orgDetails = response.body;
          this.orgContactInfo = this.orgDetails?.contacts || [];
          this.totalItems = this.orgContactInfo.length;
        } else {
          this.router.navigate([`admin/manage/org/${this.orgId}`]);
          this.toastr.error(response.body.message);
        }
      }
    );
  }

  addContacts() {
    const newContact: addContact = {
      firstName: '',
      lastName: '',
      email: '',
      title: '',
      typ: '',
      phones: [{ num: '', typ: '' }],
      isEditing: true,
    };
    this.orgContactInfo.push(newContact);
    this.addMoreContact = false;
  }

  deleteOrgContact(index: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.position = {
      top: '10',
    };
    dialogConfig.data = {
      name: this.orgContactInfo[index].firstName + ' ' + this.orgContactInfo[index].lastName
    };

    const dialogRef = this.dialog.open(DeleteContactInformationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.orgContactInfo.splice(index, 1);
        this.addMoreContact = true;
        this.action = "Deleted";
        this.updateContact(this.orgContactInfo[index]);
      }
    });

  }

  editOrgContact(index: number) {
   this.orgContactInfo[index].isEditing = true;
   this.addMoreContact = false;
  }

  cancelContactEdit(index: number) {
    if(this.orgContactInfo[index].firstName === ''
      && this.orgContactInfo[index].lastName === '' &&
      this.orgContactInfo[index].email === '' && this.orgContactInfo[index].title === ''
      && this.orgContactInfo[index].typ === '' && this.orgContactInfo[index].phones[0].num === ''
      && this.orgContactInfo[index].phones[0].typ === ''){
    this.orgContactInfo.splice(index, 1);
    this.addMoreContact = true;
    }
    else{
      this.orgContactInfo[index].isEditing = false;
    this.addMoreContact = true;
    }
  }

  addPhone(contact: any) {
    if (contact?.phones?.length < 2) {
      contact?.phones?.push({ num: '', typ: '' });
    }
  }

  removePhone(contact: any, phone: any) {
    if(contact?.phones?.length > 1){
    contact.phones = contact?.phones.filter((p: any) => p !== phone);
    }
  }
  saveContact(contact: any) {
    this.action = "Saved";
    if(contact.firstName === '' || contact.lastName === '' || contact.email === '' || contact.title === '' || contact.typ === '' || contact.phones[0].num === '' || contact.phones[0].typ === ''){
      this.toastr.error('Please fill all the fields');
      return;
    }
    this.updateContact(contact);
  }
  updateContact(contact: any) {
    this.action = this.action ?this.action :"Saved";
    this.orgContactInfo = this.orgContactInfo.map((c: any) => {
      if (c === contact) {
        return { ...contact, isEditing: false };
      }
      return c;
    }
  );
    this.orgDetails.contacts = this.orgContactInfo;
    if(this.orgId){
    this.manageOrgService.updateOrgContactDetails(this.orgId,this?.orgDetails?.contacts).subscribe(
      (response : any) => {
        if(response.status === 200){
          this.toastr.success(`Contact ${this.action}`);
          this.addMoreContact = true;
        }
        else{
          this.toastr.error(response.body.message);
        }
      },
        (error : any) => {
          console.error('Error sending organization name', error);
        }
      )
      }
  }

  onSelectedPagination(pagedData: any[]): void {
    this.pagedOrgDetails = pagedData;
  }
  
}
