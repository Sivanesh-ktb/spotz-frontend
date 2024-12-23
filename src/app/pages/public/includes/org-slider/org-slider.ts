import { Component, Input, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppConst } from 'src/app/app.const';
import { imageUrl } from 'src/app/models/org';

@Component({
  selector: 'app-org-slider',
  templateUrl: './org-slider.html',
  styleUrls: ['./org-slider.css']
})
export class OrgSliderComponent implements OnInit {
  @Input() organizationData: any;
  @Input() organizationFacilities: any;
  @Input() organizationSliderImages:any;
  @Input() page!: number;
  orgData: any;
  bannerImage: any;
  groupedImages: (string | imageUrl)[][] = [];
  images : any[] = [];
  constructor(private appConst: AppConst, private config: NgbCarouselConfig) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  ngOnInit() {
    if (this.organizationData) {
      this.checkAndUpdateData();
    }
  }

  checkAndUpdateData() {
    if (this.page == this.appConst.VIEW_ORGANIZATION_PAGE) {
      this.orgData = this.organizationData;
      this.pushImagesIntoSingleArray(this.organizationData?.banner,this.organizationFacilities);
      this.bannerImage = this.organizationData?.banner;
    } else if (this.page == this.appConst.VIEW_FACILITY_PAGE) {
      this.orgData = this.organizationData?.org;
      this.bannerImage = this.organizationData?.org?.banner;
      this.orgAndFacImages();
    } else if (this.page == this.appConst.VIEW_SPACE_PAGE) {
      this.orgData = this.organizationData;
      this.bannerImage = this.organizationData?.assets;
      this.spaceImages();
    }
    // Group images into pairs
    this.groupedImages = this.groupImages(this.bannerImage);
  }
  pushImagesIntoSingleArray(orgBannerImg: string, orgFacilities: any) {
    if (orgBannerImg) {
      this.images.push(orgBannerImg);
    }
    if (orgFacilities) {
        orgFacilities.forEach((element: any) => {
        if(element?.banner != undefined){
        this.images.push(element?.banner);
        }
      });
    }
    this.orgAndFacImages();
  }
  spaceImages() {
      if(this.bannerImage && this.bannerImage?.length > 0){
        this.bannerImage.forEach((element: any) => {
          this.images.push(element?.url);
        });
        this.images = this.groupImages(this.images);
      }
      else{
        this.staticImages();
      }
  }
  orgAndFacImages() {
    if (this.organizationSliderImages) {
      this.organizationSliderImages.forEach((element: any) => {
        if(element?.assets && element?.assets.length > 0)
        {
          element?.assets.forEach((asset: any) => {
            this.images.push(asset?.url);
          });
        }
      });
    }
    if(this.images && this.images.length > 0){
       this.images = this.groupImages(this.images);
    }
    else{
      this.staticImages();
    }
  }
  groupImages(images: (string | imageUrl)[]): (string | imageUrl)[][] {
    const pairs: (string | imageUrl)[][] = [];
    if (images && images.length > 0) {
      for (let image = 0; image < images.length; image += 2) {
        const slice = images.slice(image, image + 2);
        if (slice && slice.length === 1) {
          slice.push('assets/img/spaces/default/4.jpg');
        }
        pairs.push(slice);
      }
    }
    return pairs;
  }
  staticImages(){
    this.images = this.groupImages(
      ['assets/img/spaces/default/4.jpg',
      'assets/img/spaces/default/2_logo.jpg']
    );
  }
}
