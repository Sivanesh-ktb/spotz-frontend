import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { ManageOrgGroupService } from 'src/app/services/groups-org.service';

@Component({
  selector: 'app-import-groups',
  templateUrl: './import-groups.html',
  styleUrls: ['./import-groups.css']
})
export class ImportGroupsComponent implements OnInit {
  csvRecords: any[] = [];
  file: File | null = null;

  importGroupTab = false;
  importMembersTab = false;
  groupDetails: any;
  orgId = '';
  groupId = '';
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private manageOrgGroupService: ManageOrgGroupService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      this.orgId = paramMap.get('orgId') ?? '';
      this.groupId = paramMap.get('groupId') ?? '';
    }
    )
  }
  importGroup() {
    this.importGroupTab = true;
    this.importMembersTab = false;
  }

  importMembers() {
    this.importGroupTab = false;
    this.importMembersTab = true;
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  import() {
    if (this.file) {
      this.ngxCsvParser.parse(this.file, { header: true, delimiter: ',' })
        .pipe().subscribe((result: any) => {
          this.csvRecords = result;
          console.log(this.csvRecords);
          this.manageOrgGroupService.importOrganizationGroup(this.orgId,this.csvRecords).subscribe(
            (response : any) => {
              if(response.status === 200){
                console.log("response.body");
                console.log(response.body.system);
                this.groupDetails = response.body;
            }
          }
        );
        }, (error: NgxCSVParserError) => {
          console.error('Error parsing CSV file', error);
        });
    } else {
      console.error('No file selected');
    }
  }

  // sendDataToBackend(data: any) {
  //   // Implement the logic to send data to backend
  //   // Example:
  //   // this.http.post('/api/upload', data).subscribe(response => {
  //   //   console.log('Data sent successfully', response);
  //   // }, error => {
  //   //   console.error('Error sending data', error);
  //   // });
  // }
}
