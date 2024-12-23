import { Component, Input, Inject, HostListener } from '@angular/core';
import { SpaceData } from "src/app/models/space";
import { SpaceSettingsComponent } from "../space-settings";

@Component({
  selector: 'app-buffer-time',
  templateUrl:'./buffer-time.html',
  styleUrls:['./buffer-time.css',
    '../space-settings.css'
  ]
})

export class BufferTimeComponent {
  @Input() spaceDetails!: SpaceData;
  @Input() spaceId!: string;
  @Input() showBuffer!: boolean;
  @Input() bufferBeforeValue!: number;
  @Input() bufferAfterValue!: number;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if ((target.closest('.cancel-rental')
      || target.closest('.cancel-addons')
     || target.closest('.cancel-time-block'))) {
      this.showBuffer = false;
    }
  }
  constructor(
    @Inject(SpaceSettingsComponent) private spaceSettingsComponent: SpaceSettingsComponent
  ) {

  }
  changeBuffer() {
    this.showBuffer = true;
  }

  cancelBuffer() {
    this.showBuffer = false;
  }
  getOptions() {
    switch (this.spaceDetails?.rental?.block) {
      case 1:
        return [
          { value: 0, label: 'None' },
          { value: 1, label: '1 hr' },
          { value: 2, label: '2 hr' },
          { value: 3, label: '3 hr' },
          { value: 4, label: '4 hr' },
        ];
      case 2:
        return [
          { value: 0, label: 'None' },
          { value: 1, label: '30 mins' },
          { value: 2, label: '1 hr' },
          { value: 3, label: '1 hr 30 mins' },
          { value: 4, label: '2 hr' },
        ];
      case 4:
        return [
          { value: 0, label: 'None' },
          { value: 1, label: '15 min' },
          { value: 2, label: '30 min' },
          { value: 3, label: '45 min' },
          { value: 4, label: '1 hr' },
        ];
      default:
        return [];
    }
  }
  updateBufferTimeDetails() {
    this.spaceDetails.rental.buffer[0].before = this.bufferBeforeValue;
    this.spaceDetails.rental.buffer[0].after = this.bufferAfterValue;
    this.showBuffer = false;
     this.spaceSettingsComponent?.updateSpaceRentalSetting(2);
  }
}


