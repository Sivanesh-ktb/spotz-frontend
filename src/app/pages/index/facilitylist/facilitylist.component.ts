import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppConst } from 'src/app/app.const';
import { OrgFeaturedSpaceDetailsDto } from 'src/app/models/search';
import { address } from 'src/app/models/space';
import { ManageOrgService } from 'src/app/services/manage-org.service';
import { searchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-facilitylist',
  templateUrl: './facilitylist.component.html',
  styleUrls: ['./facilitylist.component.css'],
})
export class FacilitylistComponent implements OnInit {
  addresses: any[] = [];
  params: any;
  @Output() anchorClicked = new EventEmitter<void>();

  limit: number= this.appConst.SPACES_PER_PAGE;
  offset = 0;
  totalPages = 0;
  totalRecords = 0;

  constructor(
    private searchService: searchService,
    private manageOrgService: ManageOrgService,
    public appConst: AppConst,
    private config: NgbCarouselConfig,
    private router: Router
  ) {
    config.interval = 0;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + 2);
    const formattedDate = futureDate.toISOString().split('T')[0];

    this.params = {
      endTime: this.appConst.TIMES_OF_DAY[0].endTime,
      loc: '',
      proximity: 15,
      searchDate: formattedDate,
      startTime: this.appConst.TIMES_OF_DAY[0].startTime,
    };

    this.orgAndFacDetails();
  }

  onTimeSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTitle = selectElement.value;

    const selectedOption = this.appConst.TIMES_OF_DAY.find(
      (time) => time.title === selectedTitle
    );

    if (selectedOption) {
      this.params.startTime = selectedOption.startTime;
      this.params.endTime = selectedOption.endTime;

      this.orgAndFacDetails();
    }
  }

  orgAndFacDetails(): void {
    const queryParams : OrgFeaturedSpaceDetailsDto= {
      limit: this.limit, 
      offset: this.offset 
    };

    this.manageOrgService.orgFeaturedSpaceDetails(queryParams).subscribe(
      (response: any) => {
       this.addresses =  response.body.spaces;
       this.totalRecords = response.body.totalRecords;
       this.totalPages = Math.ceil(this.totalRecords / this.limit); 
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


  viewSpacePage(address:address,orgName:string,facName:string,spaceId:string){

    if(address && orgName && facName && spaceId){
      const orgName= localStorage.getItem('orgName');
       const url = `/${address.state}/${address.city}/orgs/${orgName}/facilities/${facName}/${spaceId}`;
       const newTab = window.open(url, '_blank');
       if (newTab) {
           newTab.onload = function() {
           newTab.scrollTo(0, 0);
         };
       }
     }
  }
    onSearchMoreSpaces(): void {
    this.router.navigate(['/search']);
  }
 onFacilityAnchorClick(event: Event) {
    event.preventDefault();
    this.anchorClicked.emit();
  }

  nextCarousel() {
    if (this.offset < this.totalPages - 1) {
      this.offset++;
      this.orgAndFacDetails();
    }
  }
  
  prevCarousel() {
    if (this.offset > 0) {
      this.offset--;
      this.orgAndFacDetails();
    }
  }
  
}
