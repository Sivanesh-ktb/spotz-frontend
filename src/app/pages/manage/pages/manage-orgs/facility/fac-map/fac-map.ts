import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ComponentRef, ComponentFactoryResolver, Injector, ApplicationRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FacilityService } from 'src/app/services/facility.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDialog } from '@angular/material/dialog';
import { FacMapConfirmationPopupComponent } from './fac-map-confirmation-popup/fac-map-confirmation-popup';
import { MarkerInfoComponent } from './marker-info/marker-info';
import { iconData, markerData } from 'src/app/models/facility';
@Component({
  selector: 'app-fac-map',
  templateUrl: './fac-map.html',
  styleUrls: ['./fac-map.css'],
})
export class FacMapComponent implements OnInit, AfterViewInit {
  orgId = '';
  facId = '';
  orgDetailsForFac: any;
  facilityDetails: any;
  facName = '';
  status=0;
  map: google.maps.Map | null = null;
  markers: any[] = [];
  spaceMarkers: any[] = [];
  display: any;
  activeInfoWindow: MapInfoWindow | null = null;

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  componentRef: ComponentRef<MarkerInfoComponent> | null = null;

  center: google.maps.LatLngLiteral = {
    lat: 41.69519275907555,
    lng: -88.5511038596706,
  };
  zoom = 18;
  mapTypeId = google.maps.MapTypeId.SATELLITE;
  spaceDetails : any;
  constructor(
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef

  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.facId = paramMap.get('facilityId') ?? '';
      if (this.facId) {
        this.getFacilityDetails();
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  initializeMap() {
    if (this.mapContainer && this.mapContainer.nativeElement) {
      const mapOptions: google.maps.MapOptions = {
        center: this.center,
        zoom: this.zoom,
        mapTypeId: this.mapTypeId,
      };
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    }
  }

  getFacilityDetails() {
    this.facilityService.getOneFacilityDetails(this.facId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.orgDetailsForFac = response.body.org;
          this.facilityDetails = response.body;
          this.facName = this.facilityDetails?.name;
          this.spaceDetails = this.facilityDetails.spaces;
           this.updateMapLocations(this.facilityDetails.extras);
           this.updateSpaceMarkers(this.spaceDetails);
        } else {
          this.toastr.error(response.body.message);
        }
      }
    );
  }
  updateSpaceMarkers(spaces : any){
    if (spaces) {
      spaces.forEach((space: any) => {
        if(space.coordinates.length > 0){
        const iconUrl = '/assets/img/amenities/map_marker.png';
        const markerOptions = {
          id: space.id,
          spaceId: space.id,
          title: space.name,
          page: 1,
          position: { lat: space.coordinates[0], lng: space.coordinates[1] },
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(34, 34),
          },
          draggable: true,
          spaceDetails: this.spaceDetails
        };
        this.spaceMarkers.push(markerOptions);
      }
      });
    }
  }
  updateMapLocations(extras : any){
    if (extras) {
      extras.forEach((extra: any) => {
        const iconBasePath = '/assets/img/amenities/';
        const iconUrl = `${iconBasePath}${extra.type.toLowerCase()}.png`;
        const markerOptions = {
          id: extra.id,
          position: { lat: extra.coordinates[0], lng: extra.coordinates[1] },
          name: extra.name,
          type: extra.type,
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(34, 34),
          },
          draggable: true
        };
        this.markers.push(markerOptions);
      });
    }
  }
  addAmenity(type: string) {
    const iconBasePath = '/assets/img/amenities/';
    const iconUrl = `${iconBasePath}${type}.png`;
    const markerOptions = {
      id: this.markers.length + 1,
      position: this.center,
      name:'',
      type: type.charAt(0).toUpperCase() + type.slice(1),
      icon: {
        url: iconUrl,
        scaledSize: new google.maps.Size(34, 34),
      },
      draggable: true
    };
    this.facilityDetails?.extras.push(this.formatData(markerOptions));
    this.markers.push(markerOptions);
  }

  addMapAmenity(event: any) {
    const mapEvent = event as google.maps.MapMouseEvent;
    if (mapEvent.latLng != null) {
      this.center = mapEvent.latLng.toJSON();
      this.addAmenity('toilet');
    }
  }
//space markers start
  moveMap(event: any) {
    if(this.spaceDetails.length  > this.spaceMarkers.length){
    const iconUrl = '/assets/img/amenities/map_marker_space.png';
    const markerOptions = {
      id: this.spaceMarkers.length + 1,
      spaceId :'',
      icon: {
        title:'',
        url: iconUrl,
        scaledSize: new google.maps.Size(34, 34),
      },
      title:'',
      position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      draggable: true,
      page:1,
      spaceDetails:this.spaceDetails
    };
    this.spaceMarkers.push(markerOptions);
  }
  else{
    this.infoWindow.close();
    this.toastr.error('All spaces have been placed.');
  }
  }
  onSpaceMarkerClick(spaceMarker: MapMarker) {
    if(this.activeInfoWindow){
      this.activeInfoWindow.close();
    }
    const space = this.componentFactoryResolver.resolveComponentFactory(MarkerInfoComponent);
    this.componentRef = space.create(this.injector);
    this.componentRef.instance.marker = spaceMarker;
    this.componentRef.instance.selectedSpace.subscribe(({ id, selectedValue, selectedText }) => {
      this.spaceMarkers = this.spaceMarkers.map((spaceMarker: any) => {
        if (spaceMarker.id === id) {
          spaceMarker.spaceDetails = this.spaceDetails.filter((space: any) => space.id === selectedValue);
          spaceMarker.icon.url = '/assets/img/amenities/map_marker.png';
          spaceMarker.title = selectedText;
          spaceMarker.spaceId= selectedValue;
          this.facilityDetails.spaces = this.facilityDetails.spaces.map((space: any) => {
            if(space.id === selectedValue){
              space.coordinates = [spaceMarker.position.lat, spaceMarker.position.lng];
            }
            return space;
          });
          this.infoWindow.close();
        }
        return spaceMarker;
      });
    });

    this.componentRef.instance.deleteSpace.subscribe((markerToDelete: any) => {
     this.deleteSpaceLocation(markerToDelete);
      this.activeInfoWindow?.close();
    });
    this.componentRef.instance.save.subscribe((markerToSave:any)=>{
      this.changeMapIconsDataFormat(markerToSave);
    })
    this.appRef.attachView(this.componentRef.hostView);
    const contentElement = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.infoWindow.options = {
      content: contentElement,
      position: spaceMarker.position,
    };
    this.infoWindow.open();

  }
  deleteSpaceLocation(marker:markerData){
    const index = this.spaceMarkers.indexOf(marker);
    if (index > -1) {
      this.spaceMarkers.splice(index, 1);
    }
    this.facilityDetails.spaces = this.facilityDetails.spaces.filter((space: any) => space.id !== marker.id);
    this.spaceDetails = this.facilityDetails.spaces;
    this.facilityDetails.spaces = this.facilityDetails.spaces.map((space: any) => {
      if(space.id === marker.id){
        space.coordinates = [];
      }
      return space;
    });
    this.infoWindow?.close();
  }
  onDragendSpace(spaceMarker: any, event: any) {
    const mapEvent = event as google.maps.MapMouseEvent;
    if (mapEvent.latLng) {
      const newPosition = mapEvent.latLng.toJSON();
      spaceMarker.position = newPosition;
      this.facilityDetails.spaces = this.facilityDetails.spaces.map((space: any) => {
        if(space.id === spaceMarker.id){
          space.coordinates = [newPosition.lat, newPosition.lng];
        }
        return space;
      }
    );
    }
  }
  move(event: any) {
    const mapEvent = event as google.maps.MapMouseEvent;
    if (mapEvent.latLng != null) {
      this.display = mapEvent.latLng.toJSON();
    }
  }
  onMarkerClick(marker: MapMarker) {
    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
    }
    const factory = this.componentFactoryResolver.resolveComponentFactory(MarkerInfoComponent);
    this.componentRef = factory.create(this.injector);
    this.componentRef.instance.marker = marker;
    this.componentRef.instance.delete.subscribe((markerToDelete: any) => {
      this.deleteAmenity(markerToDelete);
      this.activeInfoWindow?.close();
    });
    this.componentRef.instance.save.subscribe((markerToSave:any)=>{
      this.changeMapIconsDataFormat(markerToSave);
    })
    this.appRef.attachView(this.componentRef.hostView);
    const contentElement = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;

    this.infoWindow.options = {
      content: contentElement,
      position: marker.position,
    };
    this.infoWindow.open();
    this.activeInfoWindow = this.infoWindow;
  }
  deleteAmenity(marker:markerData) {
    const index = this.markers.indexOf(marker);
    if (index > -1) {
      this.markers.splice(index, 1);
    }
    this.facilityDetails.extras = this.facilityDetails.extras.filter((extra: any) => extra.id !== marker.id);
    this.activeInfoWindow?.close();
  }
  onDragend(marker: any, event: any) {
    const mapEvent = event as google.maps.MapMouseEvent;
    if (mapEvent.latLng) {
      const newPosition = mapEvent.latLng.toJSON();
      marker.position = newPosition;
      this.display = newPosition;
      this.updateFacilityExtras(this.formatData(marker));
    }
  }
  saveMap(){
    this.status = 1;
    this.activeInfoWindow?.close();
    this.infoWindow.close();
    this.confirmationPopup();
  }
  clearMap(){
    this.status = 2;
    this.activeInfoWindow?.close();
    this.infoWindow.close();
    this.confirmationPopup();
  }
  confirmationPopup(){
    const dialogRef = this.dialog.open(FacMapConfirmationPopupComponent, {
      width: '300px',
      position: { top: '10px' },
      data: {
        orgId: this.orgId,
        facId: this.facId,
        status :this.status
      }
    });
    dialogRef.afterClosed().subscribe(result => {
         if (result?.status === 1) {
          this.updateFacilityExtrasData();
      }
      else if(result?.status === 2){
        this.facilityDetails.extras = [];
        this.facilityDetails.spaces = this.facilityDetails.spaces.map((space: any) => {
          space.coordinates = [];
          this.spaceMarkers = [];
          return space;
        });
        this.markers = [];
        this.updateFacilityExtrasData();
      }
    });
  }
formatData(marker: markerData) : iconData{
  return {
    id: marker.id,
    coordinates: [marker.position.lat, marker.position.lng],
    type: marker.type,
    name: marker.name
  };
}
  changeMapIconsDataFormat(marker : markerData){
   this.formatData(marker);
   return this.updateFacilityExtras(this.formatData(marker));
  }
  updateFacilityExtras(iconData: iconData){
    this.facilityDetails.extras = this.facilityDetails.extras.map((extra: any) => {
      if(extra.id === iconData.id){
        extra.coordinates = iconData.coordinates;
        extra.type = iconData.type;
        extra.name = iconData.name;
      }
      return extra;
    });
  }

  updateFacilityExtrasData(){
      this.facilityService.updateFacilityMap(this.facId, this.facilityDetails).subscribe(
    (response: any) => {
      if (response.status === 200) {
        this.getFacilityDetails();
        if(this.status === 2){
        this.toastr.success('Map cleared successfully');
        }
        else{
          this.toastr.success('Saved Map');
        }
      } else {
        this.toastr.error(response.body.message);
      }
    }
  );
  }
}



