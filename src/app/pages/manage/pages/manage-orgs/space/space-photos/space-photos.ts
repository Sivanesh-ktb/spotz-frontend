import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SpaceService } from "src/app/services/space.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { UploadPhotosComponent } from "./upload-photos-popup/upload-photos";
import { Helpers } from "src/app/helpers/helper";



@Component({
  selector:'app-space-photos',
  templateUrl:'./space-photos.html',
  styleUrls:['./space-photos.css']

})

export class SpacePhotosComponent implements OnInit {
  orgId = '';
  facId = '';
  spaceId = '';
  spaceDetails : any = {};
  uploadUrl  = '';
  uploadImagePopup = false;
  spaceImages : any[] = [];
  selectedImages: boolean[] = [];
  checkImage = false;
  facName  = '';
  constructor(
    private route: ActivatedRoute,
    private spaceService: SpaceService,
    private toastr : ToastrService,
    private dialog: MatDialog,
    private helper: Helpers
  ){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId') ?? '';
      this.spaceId = paramMap.get('spaceId') ?? '';
      if (this.spaceId) {
        this.getSettingsSpaceDetails();
      }
    });
    this.uploadUrl = this.helper.uploadImageUrl;
  }
  getSettingsSpaceDetails() {
    this.spaceService.getSpaceDetails(this.spaceId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.spaceDetails = response.body;
          this.spaceImages = this.spaceDetails?.assets;
          const facUrl = this.spaceDetails?.fac?.gdUrl;
          this.facName =  facUrl.substring(facUrl.lastIndexOf('/') + 1);
        } else {
          this.toastr.error(response.body.message);
        }
      }
    );
  }
  addPhotos() {
    const dialogRef = this.dialog.open(UploadPhotosComponent, {
      width: '1290px',
      data: {orgId: this.orgId, facId: this.facId, spaceId: this.spaceId, uploadUrl: this.uploadUrl}
    });
    dialogRef.afterClosed().subscribe(result => {
         if (result === 'success') {
        this.getSettingsSpaceDetails();
      }
    });
  }
  toggleImageSelection(index: number) {
    this.selectedImages[index] = !this.selectedImages[index];
    this.areAnyImagesSelected();
  }
  areAnyImagesSelected() {
    const imagesToDelete = this.spaceImages.filter((_, index) => this.selectedImages[index]);
    if (imagesToDelete.length === 0) {
      this.checkImage = false;
    }
    else{
      this.checkImage = true;
    }
  }
  deleteSelectedImages() {
    const imagesToDelete = this.spaceImages.filter((_, index) => this.selectedImages[index]);
    if (imagesToDelete.length === 0) {
      this.toastr.error('No images selected for deletion');
      return;
    }
    const imageIds = imagesToDelete.map(image => image._id);
    this.spaceService.deleteSpaceImages(this.spaceId, imageIds).subscribe(
      (response: any) => {
        if(response.status === 200){
          this.toastr.success('Images deleted successfully');
          this.getSettingsSpaceDetails();
          this.selectedImages = [];
        }
        else{
          this.toastr.error(response.body.message);
        }
      }
    )
}


}
