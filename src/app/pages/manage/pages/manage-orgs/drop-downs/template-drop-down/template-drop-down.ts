import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-template-drop-down',
  templateUrl: './template-drop-down.html',
  styleUrls: ['./template-drop-down.css']
})
export class TemplateDropDownComponent implements OnInit {
  @Input() templateName !:string;
  accessLevel=1;
  templateId=0;
  @Input() templates:any[]=[];
  @Input() page !:number;
  @Output() selectedTemplateId = new EventEmitter<number>();
    constructor(
      private appConst:AppConst
    ){

    }
  ngOnInit(): void{
    console.log(this.templates);
  }
  isChecked(index: number): boolean {
    return this.accessLevel === index + 1;
  }
  addRule(){
    this.templateId = 1;
    this.templateName = this.appConst.New_Template_Name;
    this.selectedTemplateId.emit(this.templateId);
  }
  changeTemplate(templateId: number,templateName:string){
    this.templateId = templateId;
    this.templateName = templateName;
    this.selectedTemplateId.emit(this.templateId);
  }

}
