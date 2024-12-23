import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-additional-time',
  templateUrl: './additional-time.html',
  styleUrls: ['./additional-time.css']
})
export class AdditionalTimeComponent implements OnInit {
  @Input() index!: number;
  @Input() buffers!: { startTime: number, endTime: number }[];
  @Input() additional!:boolean;
  @Output() additionalTime = new EventEmitter<{ buffers: { startTime: number, endTime: number }[], index: number,additional:boolean }>();

  constructor(private commonService: CommonService){
  }
ngOnInit(){
    console.log('buffers:', this.buffers);
    if (
      this.buffers.length > 0 &&
      this.buffers[0].startTime !== this.buffers[0].endTime
    ) {
      this.additional = true;
    }
  }
  toggleAdditionalTime(): void {
    this.additional = !this.additional;
  }
  addBuffer() {
    this.buffers.push({
      startTime: 0,
      endTime: 0
    });
  }
  onSelectedBufferTime(event: { startTime: string, endTime: string }, bufferIndex: number) {
    this.buffers[bufferIndex].startTime = this.commonService.convertTo24HourFormat(event.startTime);
    this.buffers[bufferIndex].endTime = this.commonService.convertTo24HourFormat(event.endTime);
    this.additionalTime.emit({ buffers: this.buffers, index: this.index, additional: this.additional });
  }
  convertTime(time: number): string {
    return this.commonService.convertToNormalHourFormat(time);
  }
  removeBuffer(bufferIndex: number) {
    this.buffers.splice(bufferIndex, 1);
    if(!this.additional){
      this.buffers= [{startTime:0,endTime:0}];
    }
    this.additionalTime.emit({ buffers: this.buffers, index: this.index, additional: this.additional });
  }
}
