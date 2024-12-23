import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationDTO } from 'src/app/models/org';
import { SpaceService } from 'src/app/services/space.service';
import { convertToTimeSlot } from 'src/app/utils/utils';

@Component({
  selector: 'app-reservations-print',
  templateUrl: './reservations-print.html',
  styleUrls: ['./reservations-print.css']
})
export class ReservationsPrintComponent implements OnInit {
  resId ="";
  constructor(
    private spaceService: SpaceService,
    private route: ActivatedRoute
  ) { }
  reservationDetails !: ReservationDTO;
  ngOnInit() {

    this.route.paramMap.subscribe(params =>{
      this.resId = params.get('resId')??'';
      console.log(this.resId);

      if(this.resId){
      this.getReservations();
      }
    });
  }

  getReservations(){
   this.spaceService.getReservationPrintDetails(this.resId).subscribe((res)=>{
      if (res.body) {
        this.reservationDetails = res.body as ReservationDTO;
        console.log('---------- this.reservationDetails ---------');
        console.log(this.reservationDetails);
      }

   });
  }
  changeTimeFormat(time: number): string {
    return convertToTimeSlot(time);
}
totalHours(startTime: number, endTime: number): number {
  const start = startTime;
  const end = endTime;
  return end - start;
}
}
