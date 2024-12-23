import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Helpers {

  public readonly twitter: string;
  public readonly facebook: string;
  public readonly instagram: string;
  public readonly country : string;
  public readonly orgFromTitleCreate: string;
  public readonly orgFromTitleEdit: string;
  public readonly uploadImageUrl : string;
  public readonly facFromTitleCreate: string;
  public readonly facFromTitleEdit: string;
  public readonly spaceFormTitleCreate: string;
  public readonly spaceFormTitleEdit: string;
  public readonly rentalSettingPopupTitle: string;
  public readonly rentalSettingPopupMessage: string;
  public readonly rentalSettingSummary: string;
  public readonly rentalTimeOne: string;
  public readonly rentalTimeTwo: string;
  public readonly rentalTimeThree: string;
  constructor() {
    this.twitter = "https://twitter.com";
    this.facebook = "https://facebook.com";
    this.instagram = "https://instagram.com";
    this.country = "USA";
    this.orgFromTitleCreate = "Create Organization";
    this.orgFromTitleEdit = "Edit Organization";
    this.facFromTitleCreate = "Create Facility";
    this.facFromTitleEdit = "Edit Facility";
    this.spaceFormTitleCreate = "New Space";
    this.spaceFormTitleEdit = "Edit Space";
    this.rentalSettingPopupTitle = "CHANGE RENTAL SETTINGS";
    this.rentalTimeOne = "60 minutes";
    this.rentalTimeTwo = "30 minutes";
    this.rentalTimeThree = "15 minutes";
    this.rentalSettingPopupMessage = "Are you sure you would like to update rental settings for";
    this.rentalSettingSummary = "Changing the size of the rental blocks may leave unrentable time blocks.";
    this.uploadImageUrl = "https://www.primefaces.org/cdn/api/upload.php";

  }
}

