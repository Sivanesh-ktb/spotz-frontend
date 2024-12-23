import { Component, Input, Inject, HostListener } from '@angular/core';
import { AddOn, SpaceData } from "src/app/models/space";
import { SpaceSettingsComponent } from "../space-settings";

@Component({
  selector: 'app-add-ons',
  templateUrl:'./add-ons.html',
  styleUrls:['./add-ons.css',
    '../space-settings.css'
  ]
})

export class AddOnComponent {
  @Input() spaceDetails!: SpaceData;
  @Input() spaceId!: string;
  @Input() showAddOns!: boolean;
  @Input() saveAddOns!: boolean;
  @Input() addOns!: AddOn[];
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if ( target.closest('.cancel-rental')
      || target.closest('.cancel-buffer')
     || target.closest('.cancel-time-block')) {
      this.showAddOns = false;
    }
  }
  constructor(
    @Inject(SpaceSettingsComponent) private spaceSettingsComponent: SpaceSettingsComponent
  ) {

  }
  cancelAddOns() {
    this.showAddOns = false;

  }

  changeAddOns() {
    this.showAddOns = true;
  }

  addAddOn() {
    this.addOns.push({
      showEdit: true,
      name: '',
      include: false,
      perItem: false,
      enabled: true,
      inactive: 0,
      price: 0,
      quantity: 0,
      basis: 'per use',
      description: '',
      category: 'Custom',
      typ: []
    });
    this.saveAddOns = false;
  }

  removeAddOn(addOn: any) {
    const index = this.addOns.indexOf(addOn);
    if (index > -1) {
      this.addOns.splice(index, 1);
    }
  }

  customAddOn(addOn: any) {
    addOn.enabled = !addOn.enabled;
    addOn.showEdit = !addOn.showEdit;
  }

  validateRow(addOn: AddOn) {
    if(!addOn.name){
      this.saveAddOns = false;
      return false;
    }
    this.saveAddOns = true;
    return true;
  }

  updateAddOns() {
    this.showAddOns = false;
    this.spaceSettingsComponent?.updateAddonsDetails(3,this.addOns);
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
