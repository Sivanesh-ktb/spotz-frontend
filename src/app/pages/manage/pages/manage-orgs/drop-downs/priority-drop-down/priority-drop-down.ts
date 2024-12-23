import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-priority-drop-down',
  templateUrl: './priority-drop-down.html',
  styleUrls: ['./priority-drop-down.css']
})
export class PriorityDropDownComponent implements OnInit {
  priorityDropdown: { display: string, value: number }[] = this.appConst.LEVELS_ENUM;
  @Input() accessLevel: number;
  selectedLevel: string = this.priorityDropdown[this.priorityDropdown.length - 1].display;
  @Output() prioritySelected = new EventEmitter<{ display: string, value: number }>();

  ngOnInit(): void {
    if (this.accessLevel || this.accessLevel === 0) {
      this.isChecked(this.accessLevel);
      const selectedItem = this.priorityDropdown.find(item => item.value === this.accessLevel);
      if (selectedItem) {
          this.selectedLevel = selectedItem.display;
      } else {
          this.selectedLevel = 'Unknown';
      }
      this.selectPriority();
  }
  }
  constructor(private appConst: AppConst) {
    this.accessLevel = this.priorityDropdown[this.priorityDropdown.length - 1].value;
  }
  setLevel(level: { display: string, value: number }, _index: number): void {
    this.accessLevel = level.value;
    this.selectedLevel = level.display;
    this.selectPriority();
  }

  isChecked(index: number): boolean {
    return this.accessLevel === this.priorityDropdown[index].value;
  }

  getStarClass(optionIndex: number, starIndex: number): string {
    const starsRequired = 4 - optionIndex;
    return starIndex < starsRequired ? 'fa-star' : 'fa-star-o';
  }

  selectPriority(): void {
    this.prioritySelected.emit({ display: this.selectedLevel, value: this.accessLevel });
  }
}
