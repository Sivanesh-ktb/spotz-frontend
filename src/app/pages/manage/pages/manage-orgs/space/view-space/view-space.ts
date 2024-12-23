

import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpaceService } from 'src/app/services/space.service';
import { AppConst } from 'src/app/app.const';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../space-settings/confirmation-popup/confirmation-popup';

@Component({
  selector: 'app-view-space',
  templateUrl: './view-space.html',
  styleUrls: ['./view-space.css']
})

export class ViewSpaceComponent implements OnInit{
  orgId  ='';
  facilityId  = '';
  spaceId  = '';
  spaceDetails : any = {};
  spaceImages : any = [];
  addOns : any = [];
  facName  = '';
  spaceType = this.appConst.SPACES_ENUM;
  selectedSpaceTypeEvent!:{name:string,value:number};
  constructor(
    private route : ActivatedRoute,
    private spaceService : SpaceService,
    private toastr : ToastrService,
    private router : Router,
    private viewPortScroller : ViewportScroller,
    private appConst: AppConst,
    private dialog: MatDialog
  ){
    this.route.paramMap.subscribe(params => {
      this.orgId = params.get('orgId')??'';
      this.facilityId = params.get('facilityId')??'';
      this.spaceId = params.get('spaceId')??'';
      if(this.spaceId){
        this.getSpace();
      }
  })
  }
  ngOnInit(): void {
    this.getSpace();
  }

  getSpace(){
    this.spaceService.getSpaceDetails(this.spaceId).subscribe(
      (response :any) => {
        if(response.status === 200){
        this.spaceDetails = response.body;
        const facUrl = this.spaceDetails?.fac?.gdUrl;
        this.facName =  facUrl.substring(facUrl.lastIndexOf('/') + 1);
        this.spaceImages = this.spaceDetails?.assets;
        this.addOns = this.spaceDetails?.addons;
        this.displaySpaceType(this.spaceDetails?.typ)
        }
        else{
          this.toastr.error(response.body.message)
        }
      }
    )
  }
  editSpaceDetails(){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/edit/${this.spaceId}`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewSpacePhotos(){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${this.spaceId}/photos`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  viewSpaceSettings(){
    this.router.navigate([`admin/manage/org/${this.orgId}/facility/${this.facilityId}/space/${this.spaceId}/settings`]);
    return this.viewPortScroller.scrollToPosition([0,0]);
  }
  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || '#747474';
  }
  viewSpaceName(type: number): string | undefined {
    const foundSpace = this.appConst.SPACES_ENUM.find((space) => space.value === type);
    return foundSpace ? foundSpace.name : undefined;
  }
  displaySpaceType(type: number[]): void {
    if (type.length > 1) {
      this.selectedSpaceTypeEvent = { name: this.appConst.multiSelect, value: 0 };
    } else if (type.length === 1) {
      const selectedSpace = this.getSpaceTypeName(type[0]);
      if (selectedSpace) {
        this.selectedSpaceTypeEvent = { name: selectedSpace.name, value: selectedSpace.value };
      }
    }
  }
  getSpaceTypeName(typeId: number): { name: string, value: number } | null {
    const space = this.appConst.SPACES_ENUM.find(space => space.value === typeId);
    return space ? { name: space.name, value: space.value } : null;
  }
  toggleRentableSpace(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '400px',
      data: {
        type: this.appConst.RENTABLESPACECONFIRMATION,
        name: checkbox.checked
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.status === this.appConst.RENTABLESPACECONFIRMATION) {
          this.spaceDetails.nonRental = checkbox.checked;

          const updatedDetails = {
            ...this.spaceDetails,
            nonRental: this.spaceDetails.nonRental,
          };

          this.spaceService.updateSpaceDetails(this.spaceId, updatedDetails).subscribe(
            (response: any) => {
              if (response.status === 200) {
                this.toastr.success('Space updated successfully.');
                this.getSpace();
              } else {
                this.toastr.error('Failed to update the space.');
              }
            },
            (error) => {
              this.toastr.error('An error occurred while updating the space.');
              console.error(error);
            }
          );
        } else {
          checkbox.checked = !checkbox.checked;
        }


    });
  }



}

