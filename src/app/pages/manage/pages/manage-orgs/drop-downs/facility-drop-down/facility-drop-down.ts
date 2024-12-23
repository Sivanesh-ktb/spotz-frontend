import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { loginRoutes } from 'src/app/models/enums';
import { AuthService } from 'src/app/services/auth.service';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';

@Component({
  selector: 'app-facility-drop-down',
  templateUrl: './facility-drop-down.html',
  styleUrls: ['./facility-drop-down.css']
})
export class FacilityDropDownComponent implements OnChanges, OnInit {
  facilities: any;
  accessLevel = 0;
  @Input() cancelPage !: number;
  @Input() clearValue !: boolean;
  facName = 'Select Facility';
  orgId  = '';
  @Output() facilitySelected = new EventEmitter<string>();
  @Output() selectedFacIdName = new EventEmitter<{id:string,name:string}>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createOrgService: CreateOrgComponentService,
    private toastr: ToastrService,
    private authService: AuthService
  ){

  }
  ngOnInit() : void{
    this.route.paramMap.subscribe(params =>{
    this.orgId = params.get('orgId')??'';
    if(this.orgId){
        this.getFacilityDetails();
    }
    })
    if(this.clearValue){
      this.facName = 'Select Facility';
    }
  }
  ngOnChanges(): void {
    if (this.clearValue) {
      this.facName = 'Select Facility';
      this.selectedFacIdName.emit({id:'',name:''});
    }
  }
  getFacilityDetails(){
    this.createOrgService.retrieveOrgDetails(this.orgId).subscribe(
      (response: any) => {
        if(response.status === 200){
        this.facilities = response.body.facilities;
      }
      else{
        this.toastr.error(response.body.message);
      }
      },
      error => {
        if(error.status === 401){
          this.router.navigate([loginRoutes.LOGIN]);
          this.authService.authLogout();
        }
        console.log(error);
      }
    );
}
  selectFacility(id: string, index: number,facName:string): void {
    this.accessLevel = index + 1;
    this.facName = facName;
    if(this.cancelPage === 1){
      this.selectedFacIdName.emit({id:id,name:facName});
    }
    else{
    this.selectedFacIdName.emit({id:id,name:facName});
    this.facilitySelected.emit(id);
    }

  }
  isChecked(index: number): boolean {
    return this.accessLevel === index + 1;
  }
  clearAllFacilities() : void{
    this.accessLevel = 0;
    this.facName = 'Select Facility';
    this.selectedFacIdName.emit({id:'',name:''});
    this.facilitySelected.emit('');
  }
}
