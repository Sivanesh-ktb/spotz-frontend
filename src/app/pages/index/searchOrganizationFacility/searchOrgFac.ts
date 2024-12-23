import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { environment } from 'src/environments/environment';
import { searchService } from 'src/app/services/search.service';
import { AppConst } from 'src/app/app.const';
import { AddressDTO, searchDTO } from 'src/app/models/search';
import { ViewportScroller } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-search-org-fac',
  templateUrl: './searchOrgFac.html',
  styleUrls: ['./searchOrgFac.css'],
})
export class SearchOrgFacComponent implements OnInit {
  loader = false;
  fac = '';
  searchType = '';
  searchValue = '';
  orgId = '';
  numberOfGuests !:number;
  data = '';
  formattedDate = '';
  org="";
  loc="";
  facType="";
  addresses: searchDTO[] = [];
  filteredfacility: searchDTO[] = [];
  displayedFacilities: searchDTO[] = [];
  mapCenter: google.maps.LatLngLiteral = { lat: 37.0902, lng: -95.7129 };
  mapZoom = 2;
  proximity: number = this.appConst.searchProximity;
  mapHeight = '';
  spaceType = '';
  markers: google.maps.Marker[] = [];
  activeInfoWindow: google.maps.InfoWindow | null = null;
  page = this.appConst.SEARCH_PAGE;
  currentPage = 1;
  pageSize: number = this.appConst.pageSize;
  totalItems = 0;
  sortOption = '';
  apiCall = false;
  centerLocation:[number,number] = [37.0902, -95.7129];
  @ViewChild(GoogleMap) googleMap!: GoogleMap;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  filteredParams: any;
  searchParams: { proximity: number; spaceType: string } = {
    proximity: this.proximity,
    spaceType: this.spaceType,
  };
  selectedGuestRange = 0;
  checkFacSpaces=false;
  gridView = true;
  constructor(
    private route: ActivatedRoute,
    private searchService: searchService,
    private appConst: AppConst,
    private router: Router,
    private commonService: CommonService,
    private viewPortScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    const currentDate = new Date() ;
    currentDate.setDate(currentDate.getDate() + 2);
    this.formattedDate = currentDate.toISOString().split('T')[0];
    this.route.queryParams.subscribe((params) => {
      if (params['fac']) {
        this.searchType = this.appConst.facSearch;
        this.searchValue = params['fac'];
        this.facType = params['fac'];
      } else if (params['org']) {
        this.searchType = this.appConst.orgSearch;
        this.searchValue = params['org'];
      } else if (params['loc']) {
        this.searchType = this.appConst.locSearch;
        this.searchValue = params['loc'];
        this.loc = params['loc'];
      }
      if (params['oid']) {
        this.org = params['oid'];
        this.orgId = params['oid'];
      }
      if (params['date']) {
        this.formattedDate = params['date'];
      }
      if (params['proximity']) {
        this.proximity = params['proximity'];
      }
      if (params['guest']) {
        this.numberOfGuests = params['guest'] ?? '0';
      }
      if (params['data']) {
        this.data = params['data'] ?? '';
      }

      if(params['spaceType']){
        this.spaceType = params['spaceType']?? '';
      }
      if (params['org'] || params['fac']) {
        this.filteredParams = {
          data: this.data,
          [this.searchType]:this.searchValue.replace(/_/g, ' '),
          oid: this.orgId,
          endTime: this.appConst.searchEndTime,
          proximity: this.proximity??this.appConst.searchProximity,
          searchDate:this.formattedDate,
          startTime: this.appConst.searchStartTime,
        };
      }
      else if( params['loc']){
        this.filteredParams = {
          data:this.data,
          [this.searchType]:this.searchValue.replace(/_/g, ' '),
          proximity: this.proximity??this.appConst.searchProximity,
        };
        if(this.formattedDate){
          this.filteredParams.startDate = this.formattedDate;
        }
      }
      else{
        this.filteredParams = {
          endTime: this.appConst.searchEndTime,
          loc: '',
          proximity: this.proximity ?? this.appConst.searchProximity,
          searchDate: this.formattedDate,
          startTime: this.appConst.searchStartTime,
        };
      }
      if(this.spaceType && this.spaceType != undefined){
        this.filteredParams.spaceType = this.spaceType
      }
      this.apiCall = true;
      this.commonService.setEventDate(new Date(this.formattedDate));
      this.searchSampleData(this.filteredParams);
    });
    this.calculateMapHeight();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateMapHeight();
  }

  calculateMapHeight(): void {
    const viewportHeight = window.innerHeight;
    const calculatedHeight = viewportHeight - 150;
    this.mapHeight = `${calculatedHeight}px`;
  }
refreshAPI(){
  this.filteredParams = {
    data:this.data,
    [this.searchType]:this.searchValue.replace(/_/g, ' '),
    proximity: this.proximity??this.appConst.searchProximity,
    spaceType: this.spaceType
  }
  this.searchSampleData(this.filteredParams);
}
  searchSampleData(params: any): void {
    if (!this.fac) {
      this.mapCenter = { lat: 37.0902, lng: -95.7129 };
      this.mapZoom = 4;
    }
    this.loader = true;
    this.searchService.allOrgAndFacDetails(params).subscribe(
      (response: any) => {
        if (response && response.body) {
          this.addresses = response.body.data??[];
          this.centerLocation = response.body.center;
          this.loader = false;
          if(((this.addresses && this.addresses.length === 0 )|| this.addresses === null) && this.apiCall){
             this.refreshAPI();
             this.apiCall = false;
             this.loader = true;
          }
          else if((this.addresses && this.addresses.length === 0 )|| this.addresses === null){
            this.loadMap([]);
            this.loader = false;
          }

          this.filterByCapacity();

        } else {
          this.mapCenter = { lat: 37.0902, lng: -95.7129 };
          this.mapZoom = 4;
          this.addresses = [];
          this.loadMap([]);
          this.loader = false;
        }
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  filterByCapacity(): void {
    this.filteredfacility = this.numberOfGuests
    ? this.addresses.filter(facility => {
        const isValid = this.isWithinCapacityRange(facility.capacity);
        console.log(`Facility: ${facility.name}, Capacity: ${facility.capacity}, Is Valid: ${isValid}`);
        return isValid;
      })
    : this.addresses;

    this.loadMap(this.filteredfacility);
    this.totalItems = this.filteredfacility.length;
    this.updateDisplayedFacilities();
  }

  private isWithinCapacityRange(capacity?: number): boolean {
    if (capacity === undefined) {
      return false;
    }

    const value  = Number(this.numberOfGuests);
    switch (value) {

        case 1:
            return capacity >= 0 && capacity <= 10;
        case 2:
            return capacity > 10 && capacity <= 50;
        case 3:
            return capacity > 50 && capacity <= 100;
        case 4:
            return capacity > 100 && capacity <= 500;
        case 5:
            return capacity > 500 && capacity <= 1000;
        case 6:
            return capacity > 1000;
        default:
            return true;
    }
  }

  onProximityChange(newProximity: number): void {
    this.searchParams.proximity = newProximity;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { proximity: this.proximity },
      queryParamsHandling: 'merge',
    });
  }

  handleSpaceTypeValue(selectedValue: string): void {
    this.spaceType = selectedValue;
    this.searchParams.spaceType = selectedValue;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { spaceType: this.spaceType },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(sortOption: string) {
    this.sortOption = sortOption;
    this.sortFacilities();
  }

  sortFacilities() {
    if (this.sortOption === 'near') {
      this.filteredfacility = [...this.addresses];
    } else if (this.sortOption === 'far') {
      this.filteredfacility = [...this.filteredfacility].reverse();
    } else if (this.sortOption === 'name-asc') {
      this.filteredfacility.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      this.filteredfacility.sort((a, b) => b.name.localeCompare(a.name));
    } else if (this.sortOption === 'price-low') {
      this.filteredfacility.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (this.sortOption === 'price-high') {
      this.filteredfacility.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    this.onPagedOrgDetails(this.filteredfacility.slice(0, this.pageSize));
  }

  updateDisplayedFacilities(pagedData?: any[]): void {
    if (pagedData) {
      this.displayedFacilities = pagedData;
    } else {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.displayedFacilities = this.filteredfacility.slice(
        startIndex,
        endIndex
      );
    }
    this.validateFacSpaces();
  }
  validateFacSpaces(){
    const validFacilities = this.displayedFacilities.filter((facility: searchDTO) => {
      const hasValidRowName = facility?.facilityData?.name || facility?.name;
      const hasValidBanner = facility?.facilityData?.org?.banner || facility?.org?.banner;
      const hasValidOrgName = facility?.facilityData?.org?.name || facility?.org?.name;
      if (hasValidRowName && hasValidBanner && hasValidOrgName) {
        return !(this.loc || (!this.org && !this.facType && !this.loc));
      }
      return false;
    });
    this.checkFacSpaces = validFacilities.length > 0;
  }


  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updateDisplayedFacilities();
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.updateDisplayedFacilities();
  }

  onPagedOrgDetails(pagedData: any[]): void {
    this.updateDisplayedFacilities(pagedData);
  }

loadMap(addresses: searchDTO[]): void {
    const seenCoordinates = new Set<string>();

    const center =
        addresses.length > 0 && (
            (addresses[0].facilityData?.address.geocode.coordinates.length === 2) ||
            (addresses[0].address.geocode.coordinates.length === 2)
        )
            ? {
                lat: addresses[0].facilityData?.address.geocode.coordinates[1] || addresses[0].address.geocode.coordinates[1],
                lng: addresses[0].facilityData?.address.geocode.coordinates[0] || addresses[0].address.geocode.coordinates[0],
            }
            : { lat: this.centerLocation[1], lng: this.centerLocation[0] };

    this.mapCenter = center;
    this.mapZoom = this.appConst.mapZoom;
    this.clearMarkers();

    addresses.forEach((address: searchDTO) => {
        const geocode = address.facilityData?.address.geocode || address.address.geocode;
        if (
            geocode &&
            Array.isArray(geocode.coordinates) &&
            geocode.coordinates.length === 2
        ) {
            const position = {
                lat: geocode.coordinates[1],
                lng: geocode.coordinates[0],
            };

            const positionKey = `${position.lat},${position.lng}`;

            if (!seenCoordinates.has(positionKey)) {
                seenCoordinates.add(positionKey);

                const marker = new google.maps.Marker({
                    position: position,
                    title: address.facilityData?.name || address.name,
                    map: this.googleMap.googleMap,
                    icon: environment.googleMapLocationIcon,
                });

                const orgName = address.facilityData?.org?.name ?? address.info?.o?.name ?? "Unknown Organization";
                const facId = address.facilityData?._id ?? address.info?.f?.id;

                marker.addListener('click', () => this.onMarkerClick(marker, address.facilityData?.address || address.address, orgName, facId));
                this.markers.push(marker);
            }
        }
    });
}

  clearMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
  }

  onMarkerClick(marker: google.maps.Marker, address: AddressDTO, orgName: string, facId: string): void {
    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
    }
    const contentString = `<div class="info-window-title" style="font-weight: bold; cursor: pointer;">${marker.getTitle() ?? ''}</div>`;
    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
      position: marker.getPosition(),
    });
    infoWindow.open(marker.getMap(), marker);
    this.activeInfoWindow = infoWindow;
    google.maps.event.addListener(infoWindow, 'domready', () => {
      const titleElement = document.querySelector('.info-window-title');
      if (titleElement) {
        titleElement.addEventListener('click', () => {
          this.viewFacilityPage(address, orgName, facId);
        });
      } else{
        infoWindow.close();
        this.activeInfoWindow = null;
      }
    });
  }

  viewFacilityPage(address: AddressDTO, orgName: string, facId: string) {
    if (address && orgName && facId) {
      const url = `/${address.state}/${address.city}/orgs/${orgName}/facilities/${facId}`;
      const newTab = window.open(url, '_blank');
      if (newTab) {
        newTab.onload = function () {
          newTab.scrollTo(0, 0);
        };
      }
    }
  }

  changeViewTemplate(status: boolean) {
    this.gridView = status;
  }
}
