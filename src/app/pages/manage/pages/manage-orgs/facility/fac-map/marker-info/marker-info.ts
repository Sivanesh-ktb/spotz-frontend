import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-marker-info',
  templateUrl: './marker-info.html',
  styleUrls: ['./marker-info.css']
})
export class MarkerInfoComponent implements OnInit {
  @Input() marker: any;
  @Output() delete = new EventEmitter<any>();
  @Output() deleteSpace = new EventEmitter<any>();
  @Output() save = new EventEmitter<any>();
  @Output() selectedSpace = new EventEmitter<any>();
  fileName = '';
  spaceMarkers: any[] = [];
  spacePage = 0;
  spaceId ='';
  selectedSpaceDetails: any[] = [];
 ngOnInit(){
  this.fileName = this.marker.name;
  if(this.marker.page === 1){
    this.spacePage = this.marker.page;
    this.spaceMarkers = this.marker.spaceDetails;
    this.spaceId = this.marker.spaceId;
  }
 }
 spaceChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value;
  const selectedText = (event.target as HTMLSelectElement).options[(event.target as HTMLSelectElement).selectedIndex].text;
 this.spaceId = selectedValue;
  const id = this.marker.id;
  this.selectedSpace.emit({ id, selectedValue, selectedText });
}

 onSpaceDelete(){
  this.deleteSpace.emit(this.marker);
 }
  saveLocationName(event: Event) {
    this.marker.name = (event.target as HTMLInputElement).value;
    this.save.emit(this.marker);
  }

  onDelete() {
    this.delete.emit(this.marker);
  }
}
