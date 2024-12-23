import { Component, OnInit } from '@angular/core';
import { createAddons } from '../../../../services/addons.services';
import { ToastrService } from 'ngx-toastr';
import { AddonDeleteComponent } from '../addon-delete/addon-delete.component';
import { MatDialog } from '@angular/material/dialog';
import { StatusCode } from 'src/app/status-code';

@Component({
  selector: 'app-addon',
  templateUrl: './addon.component.html',
  styleUrls: ['./addon.component.css']
})
export class AddonComponent implements OnInit {

  addonsData: any[] = [];
  editForm: { [key: string]: any } = {};
  editingIds: string[] = [];
  spaceTypes: number[] = [];
  selectedTyp: number[]=[];
  newComponent = true;
  editStates: { [key: string]: boolean } = {};

  constructor(
    private addonService: createAddons,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getAllAddOnDetails();
  }

  addData() {
    const newAddonId = this.randomId();
    this.editForm[newAddonId] = {
      name: '',
      category: 'Setup',
      indoor: 0,
      basis: 'per use',
      description: '',
      typ: []
    };
    this.editingIds.unshift(newAddonId);
    this.editStates[newAddonId] = true;
  }

  saveAddons(id: string) {
    const item = this.editForm[id];
    if (id.startsWith('new-')) {
      this.createAddon(item);
    } else {
      this.updateAddon(id);
    }
  }

  createAddon(item: any) {
    this.addonService.createAddons(item).subscribe(
      (response: any) => {
        if (response.status === StatusCode.SUCCESS) {
          this.toastr.success('Addon created successfully');
          this.getAllAddOnDetails();
          this.resetForm();
        }
      },
      (error) => {
        this.toastr.error('Error creating addon',error.message);
      }
    );
  }

  updateAddon(id: string) {
    const addonToUpdate = this.addonsData.find(addon => addon._id === id);
    if (addonToUpdate) {
      this.addonService.updateAddons(id, addonToUpdate).subscribe(
        (response: any) => {
          if (response.status === StatusCode.SUCCESS) {
            this.toastr.success('Addon updated successfully');
            this.getAllAddOnDetails();
            this.resetForm();
          }
        },
        (error) => {
          this.toastr.error('Error updating addon',error.message);
        }
      );
    } else {
      this.toastr.error('Addon not found');
    }
  }

  getAllAddOnDetails() {
    this.addonService.getAllAddons().subscribe(
      (response: any) => {
        if (response.body && Array.isArray(response.body)) {
          this.addonsData = response.body;
        } else {
          console.error('Invalid response format:', response);
        }
      },
      (error) => {
        this.toastr.error('Error fetching addons',error.message);
      }
    );
  }

  deleteAddon(id: string) {
    const dialogRef = this.dialog.open(AddonDeleteComponent, {
      data: { id: id },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.message === 'removeAddon') {
        if (id.startsWith('new-')) {
          this.editingIds = this.editingIds.filter(editId => editId !== id);
          delete this.editForm[id];
          this.toastr.success('New addon removed from the list');
        } else {
          this.addonService.deleteAddons(id).subscribe(
            () => {
              this.toastr.success('Addon deleted successfully');
              this.getAllAddOnDetails();
            },
            (error) => {
              this.toastr.error('Error deleting addon',error.message);
            }
          );
        }
      }
    });
  }


  toggleEdit(id: string) {

   if (this.editingIds.includes(id)) {
      this.editingIds = this.editingIds.filter(item => item !== id);
    }
    else {
      this.editingIds.push(id);
    }
  }

  toggleNew(id: string) {
    if (id.startsWith('new-')) {
      this.editStates[id] = !this.editStates[id];
    }
  }

  resetForm() {
    this.editForm = {};
    this.editingIds = [];
  }

  getIndoorOutdoor(value: any): string {
    const numValue = Number(value);
    switch (numValue) {
      case 0: return 'Indoor';
      case 1: return 'Outdoor';
      case 2: return 'Both';
      default: return 'Unknown';
    }
  }

  onSpaceTypeSelected(event:{spaceId:number[],name:string[]}) {
    this.spaceTypes = event.spaceId;
    this.editingIds.forEach(id => {
      if (id.startsWith('new-')) {
        this.editForm[id].typ = [...this.spaceTypes];
      } else {
        const addonToUpdate = this.addonsData.find(addon => addon._id === id);
        if (addonToUpdate) {
          addonToUpdate.typ = [...this.spaceTypes];
          if (this.editForm[id]) {
            this.editForm[id].typ = [...this.spaceTypes];
          }
        }
      }
    });
  }
  randomId(){
    return `new-${Math.floor(Math.random() * 1000000)}`;
  }
}
