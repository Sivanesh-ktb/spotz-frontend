import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { AppConst } from 'src/app/app.const';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.html',
  styleUrls: ['./google-map.css']
})
export class GoogleMapComponent implements AfterViewInit{
   @Input() page!:number;
   @Input() orgMapDetails:any;
   markers: google.maps.Marker[] = [];
   @ViewChild(GoogleMap) googleMap!: GoogleMap;
   @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
   activeInfoWindow: google.maps.InfoWindow | null = null;
   mapZoom = 2;
   mapIcon='';
   mapHeight = this.appConst.mapDefaultHeight;
   mapCenter: google.maps.LatLngLiteral = { lat: 37.0902, lng: -95.7129 };
   spaceEnum = this.appConst.SPACES_ENUM;
   constructor(
    private appConst: AppConst
   )
   {

   }
   ngAfterViewInit(){
    if (this.orgMapDetails) {
       if(this.page == this.appConst.VIEW_ORGANIZATION_PAGE){
        this.mapIcon = environment.googleMapLocationIcon;
         this.loadMap(this.orgMapDetails);
      }
      else if(this.page == this.appConst.VIEW_FACILITY_PAGE ||
        this.page == this.appConst.BOOKING_INFO_PAGE
      ){
        this.mapIcon = './assets/img/amenities/map_marker_0.png';
         this.loadMap([this.orgMapDetails]);
      }
      else if(this.page == this.appConst.VIEW_SPACE_PAGE){
        this.mapIcon = './assets/img/amenities/map_marker_0.png';
         this.loadMap([this.orgMapDetails]);
      }
     }
     if(this.page == this.appConst.BOOKING_INFO_PAGE){
        this.mapHeight = this.appConst.bookingMapHeight;
     }

   }
  loadMap(addresses: any[]): void {
    const seenCoordinates = new Set<string>();
    const center = addresses.length > 0 && addresses[0].address.geocode.coordinates.length === 2
      ? { lat: addresses[0].address.geocode.coordinates[1], lng: addresses[0].address.geocode.coordinates[0] }
      : { lat: 37.0902, lng: -95.7129 };
    this.mapCenter = center;
    setTimeout(() => {
      if(this.page == this.appConst.BOOKING_INFO_PAGE){
         this.mapZoom = this.appConst.MAP_ZOOM;
       }
       else{
          this.mapZoom = this.appConst.ZOOM_DEFAULT;
        }
    });
    this.clearMarkers();
    addresses.forEach((data: any) => {
      const spaceType = this.getSpaceTypes(data.spaces);
     if (data.address && data.address.geocode && Array.isArray(data.address.geocode.coordinates) && data.address.geocode.coordinates.length === 2) {
        const position = { lat: data.address.geocode.coordinates[1], lng: data.address.geocode.coordinates[0] };
        const positionKey = `${position.lat},${position.lng}`;

        if (!seenCoordinates.has(positionKey)) {
          seenCoordinates.add(positionKey);
           const marker = new google.maps.Marker({
            position: position,
            title: data.name,
            map: this.googleMap.googleMap,
            icon: this.mapIcon
          });
          if(this.page == this.appConst.VIEW_ORGANIZATION_PAGE){
          const url = `/${data.address.state}/${data.address.city}/orgs/${data.org.name}/facilities/${data._id}`;
          marker.addListener('click', () => this.onMarkerClick(marker));
          marker.set('url', url);
          marker.set('address', data.address);
          marker.set('spaces', spaceType);
          }
          else if(this.page == this.appConst.VIEW_FACILITY_PAGE || this.page == this.appConst.VIEW_SPACE_PAGE
            || this.page == this.appConst.BOOKING_INFO_PAGE
          ){
            marker.addListener('click', () => this.onFacMarkerClick(marker));
          }
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
  onMarkerClick(marker: google.maps.Marker): void {
    if (this.activeInfoWindow) {
      this.activeInfoWindow.close();
    }
    const url = marker.get('url') as string;
    const title = marker.getTitle() ?? '';
    const getAddress = marker.get('address');
    const space = marker.get('spaces');
    const spaceListHTML = space.count.map((count:number, index:number) => {
      const spaceName = this.viewSpaceName(space.type[index]);
      const spaceColor = this.getSpaceColor(space.type[index]);
      return `<div class="sports_activities" style="background-color: ${spaceColor}"><span class="space-count">(${count})<span> ${spaceName}</div>`;
    }
    ).join('');
    const googleMapsUrl = `${this.appConst.google_map_url}${getAddress.street1}+${getAddress.city}+${getAddress.state}+${getAddress.zip}`;
    const contentString = `
      <div>
        <h5>${title}</h5>
        <a class="color-black hover-effect" href="${url}" target="_blank">view facility »</a>
        <div class='map-address py-2'>
             ${getAddress.street1},<br>
              ${getAddress.city},
              ${getAddress.state},
              ${getAddress.zip}
        </div>
        <div>
        ${spaceListHTML}
        </div>
         <a class="color-black hover-effect" href="${googleMapsUrl}" target="_blank">
         <i class="fa fa-map-marker"></i> view in Google Maps</a>
      </div>
    `;
    const infoWindow = new google.maps.InfoWindow({
      content: contentString,
      position: marker.getPosition()
    });
    infoWindow.open(marker.getMap(), marker);
    this.activeInfoWindow = infoWindow;
  }
  getSpaceTypes(space:any){
    const arrays= space.map((item:any) => item.typ);
    const combinedArray: number[] = arrays.flat();
    const countMap: { [key: number]: number } = {};
    combinedArray.forEach(num => {
      countMap[num] = (countMap[num] || 0) + 1;
    });
    const type: number[] = [];
    const count: number[] = [];
    Object.keys(countMap).forEach(key => {
      type.push(Number(key));
      count.push(countMap[Number(key)]);
    });
    return {count, type};
  }
  viewSpaceName(type: number): string | undefined {
    const foundSpace = this.spaceEnum.find((space) => space.value === type);
    return foundSpace ? foundSpace.name : undefined;
  }
  getSpaceColor(type: number): string {
    return this.appConst.SPACE_COLORS[type] || '#747474';
  }

// facility marker click event

onFacMarkerClick(marker: google.maps.Marker): void {
  if (this.activeInfoWindow) {
    this.activeInfoWindow.close();
  }
  const contentString = marker.getTitle() ?? '';
  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
    position: marker.getPosition()
  });
  infoWindow.open(marker.getMap(), marker);
  this.activeInfoWindow = infoWindow;
}

}
