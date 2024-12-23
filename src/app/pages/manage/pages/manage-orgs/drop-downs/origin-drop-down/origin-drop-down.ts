import { Component, EventEmitter, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-origin-drop-down',
  templateUrl: './origin-drop-down.html',
  styleUrls: ['./origin-drop-down.css']
})
export class OriginDropDownComponent {
  originName = 'Select Origin';
  accessLevel = 2;
  @Output() originSelected = new EventEmitter<{ title: string, value: number }>();
  origins : {title :string,value : number}[] = this.appConst.ORIGIN_ENUM;
  constructor(
    private appConst:AppConst
  ){

  }
  selectOrigin(title: string, value: number): void {
    this.originName = title;
    this.accessLevel = value;
    this.originSelected.emit({ title, value });
  }
  isChecked(index: number): boolean {
    return this.accessLevel === index + 1;
  }
  clearAllOrigins(): void {
    this.originName = 'Select Origin';
    this.accessLevel = 2;
    this.originSelected.emit({ title: '', value: 0 });
  }
}
