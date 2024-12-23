import { Component, OnInit } from '@angular/core';
import { IncidentsService } from 'src/app/services/incidents.service';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.html',
  styleUrls: ['./incidents.css']
})
export class IncidentsComponent implements OnInit {

constructor(
  private incidentsService: IncidentsService
){

}
  ngOnInit() {
    this.retrieveIncidentsData();
  }
  refreshIncidentsData(){
    this.retrieveIncidentsData();
  }
  retrieveIncidentsData() {
    this.incidentsService.getIncidentsData().subscribe(
      (response: any) => {
        if (response && response.status === 200) {
          console.log(response);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      },
      (error) => {
        console.error('Error retrieving incidents data:', error);
      }
    );
  }


}
