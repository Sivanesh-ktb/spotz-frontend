import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { createRegion } from '../../../../services/regions.service';
import { ToastrService } from 'ngx-toastr';
import { regionsData } from '../../../../models/regions';
import { AppConst } from 'src/app/app.const';
import { HttpResponse } from '@angular/common/http';
import { StatusCode } from 'src/app/status-code';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})
export class RegionComponent implements OnInit {
  region = '';
  state= '';
  search= '';
  regionData: regionsData = {
      city: '',
      state: '',
      location: { coordinates: [0, 0] }
  };
  regionDetails: regionsData[] = [];
  filteredRegionDetails: regionsData[] = [];
  addingRegions = false;
  editingRegion: regionsData | null = null;
  regionFirstText ='';
  regionSecondText ='';
  pagedOrgDetails: any[] = [];
  page = 1;
  pageSize = 10;
  totalItems = 0;
valid = false;
  constructor(
    private createRegionService: createRegion,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private appConst : AppConst
  ) {}

  ngOnInit() {
    this.getAllRegions();
    this.regionFirstText = this.appConst.region_first_text;
    this.regionSecondText = this.appConst.region_second_text;
    this.validateForm();
  }
  validateForm(){
    if(this.region === '' || this.state === ''){
      this.valid= true;
    }
    else{
      this.valid = false;
    }
  }
  saveRegion() {
    if (this.editingRegion) {
      if (!this.editingRegion._id) {
        this.toastr.error('Region ID is missing');
        return;
      }

      this.regionData = {
        ...this.editingRegion,
        city: this.region || '',
        state: this.state || '',
        location: this.editingRegion.location || { coordinates: [0, 0] }
      };

      this.createRegionService.updateRegion(this.editingRegion._id, this.regionData).subscribe(
        (response: HttpResponse<Object>) => {
          if(response.status === StatusCode.SUCCESS){
            this.toastr.success('Region updated successfully');
            this.resetForm();
            this.getAllRegions();
            this.addingRegions = false;
          }
        },
        (error) => {
          this.toastr.error('Error updating region',error.message);
        }
      );
    } else {
      this.regionData = {
        city: this.region || '',
        state: this.state || '',
        location: { coordinates: [0, 0] }
      };

      this.createRegionService.createRegions(this.regionData).subscribe(
        (response:any) => {
          if(response.status === 200){
          this.toastr.success('Region saved successfully');
          this.resetForm();
          this.getAllRegions();
          this.addingRegions = false;
          }
          else{
            this.toastr.error(response.body.message);
          }
        },
        error => {
          console.error('Error saving region:', error);
           this.toastr.error(error.error.message || 'Error saving region');
        }
      );
    }
  }

  getAllRegions() {
    this.createRegionService.getAllRegion().subscribe(
      (response:any) => {
        if(response.status === 200){
        this.regionDetails = response.body || [];
        this.filteredRegionDetails = this.regionDetails;
        this.totalItems = this.regionDetails.length
        }
        else{
          this.toastr.error(response.body.message);
        }
      },
      error => {
        this.toastr.error('Error fetching regions', error.message);
      }
    );
  }

  addRegions() {
    this.addingRegions = true;
    this.resetForm();
    this.cdr.detectChanges();
  }

  editRegion(region: regionsData) {
    this.region = region.city || '';
    this.state = region.state || '';
    this.editingRegion = region;
    this.addingRegions = true;
  }

  private resetForm() {
    this.region = '';
    this.state = '';
    this.editingRegion = null;
  }

  filterRegions() {
    this.filteredRegionDetails = this.regionDetails.filter(region =>
      (region.city && region.city.toLowerCase().includes(this.search.toLowerCase())) ||
      (region.state && region.state.toLowerCase().includes(this.search.toLowerCase())) ||
      (region.urlName && region.urlName.toLowerCase().includes(this.search.toLowerCase()))
    );
  }

  onSelectedPagination(pagedData: any[]): void {
    this.pagedOrgDetails = pagedData;
  }

}
