import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { SpaceDTO } from 'src/app/models/space';
import { CommonService } from 'src/app/services/common.service';
import { PublicService } from 'src/app/services/public.service';
import { StatusCode } from 'src/app/status-code';

interface spaceTypes{
  name: string;
  value: number;
}

@Component({
  selector: 'app-list-spaces',
  templateUrl: './list-spaces.html',
  styleUrls: ['./list-spaces.css']
})
export class ListSpacesComponent implements OnChanges, OnInit {
  @Input() spaces: SpaceDTO[] = [];
  @Input() facDetails! : any[];
  @Output() spaceSelected = new EventEmitter<SpaceDTO>()
  selectedSpace: SpaceDTO={};
  spaceType : number[] =[];
  spaceTypes: spaceTypes[] = [];
  infoBtn!: boolean;
  constructor(
    private appConst : AppConst,
    private commonService : CommonService,
    private cdr: ChangeDetectorRef,
    private publicService: PublicService
   ){
  }

  ngOnInit(){
    if (this.facDetails && this.facDetails.length > 0 && !this.selectedSpace || Object.keys(this.selectedSpace).length === 0) {
      this.selectedSpace = this.facDetails[0];
      this.getSpaceTypes();
      this.spaceSelected.emit(this.selectedSpace);
    }
  }
  ngOnChanges(){
    this.commonService.selectedSpace$.subscribe(space => {
      this.selectedSpace = space;
    });
    this.commonService.infoButtonStatus$.subscribe((data)=>{
      this.infoBtn = data;
      this.cdr.detectChanges();
      this.ngOnInit();
    });
  }

  getSpaceTypes(){
    this.spaceType = this.selectedSpace.typ || [];
    if (this.spaceType.length) {
      this.spaceTypes = this.spaceType.map(typeId => {
        const space = this.appConst.SPACES_ENUM.find(data=> data.value === typeId);
        return space ? { name: space.name, value: space.value } : { name: 'Unknown', value: typeId };
      });
    } else {
      this.spaceTypes = [];
    }
  }

  getSpaceTypeName(typeId: number): string {
    const space = this.appConst.SPACES_ENUM.find(space => space.value === typeId);
    return space ? space.name : 'Unknown';
  }

  selectSpace(space: SpaceDTO) {
    this.selectedSpace = space;
    this.commonService.setSelectedSpace(space);
    this.spaceSelected.emit(this.selectedSpace);
    this.getSpaceTypes();
    if (this.selectedSpace?._id) {
      this.getSpaceDetails(this.selectedSpace._id);
    }
  }
  getSpaceDetails(spaceId: string) {
    this.publicService.getSpaceDetails(spaceId).subscribe(
      (response: HttpResponse<object>) => {
        if (response.status == StatusCode.SUCCESS && response.body) {
          this.commonService.setSpaceDetails(response.body as SpaceDTO);
        }
        else {
          console.log('error in getting space details');
        }
      }
    )
  }
}
