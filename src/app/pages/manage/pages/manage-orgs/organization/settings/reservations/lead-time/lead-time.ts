// lead-time.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lead-time',
  templateUrl: './lead-time.html',
  styleUrls: ['./lead-time.css']

})
export class LeadTimeComponent implements OnInit {
  showLeadTime = false;
  noLeadTime = false;
  tempLeadTime = '0';

  @Input() leadTime = '0';
  @Output() leadTimeChanged: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(){
    this.tempLeadTime = this.leadTime;
  }

  editLeadTime(isEditing: boolean, save?: boolean) {
    if (save) {
      this.leadTime = this.tempLeadTime;
      this.leadTimeChanged.emit(this.leadTime);
    } else {
      this.tempLeadTime = this.leadTime;
    }
    this.showLeadTime = isEditing;
  }

  getRange(max: number, min: number): string[] {
    return Array.from({ length: max - min + 1 }, (_, i) => (i + min).toString());
  }
}
