import { Component, Input, OnInit } from '@angular/core';
import { AppConst } from 'src/app/app.const';
import { SpaceDTO } from 'src/app/models/space';

@Component({
    selector: 'app-space-details',
    templateUrl: './space-details.html',
    styleUrls: ['./space-details.css']
})
export class SpaceDetailsComponent implements OnInit {

    @Input() spaceDetails!: SpaceDTO;
    amenities!: string[];
    price = this.spaceDetails?.price || 0;
    constructor(
        private appConst: AppConst
    ){
        
    }

    ngOnInit() {
        const amenitySet = new Set<string>();
        console.log(this.spaceDetails, 'spaceDetails.........');
        this.spaceDetails.fac?.amenity.forEach((amenity: string) => {
            amenitySet.add(amenity);
        });
        this.amenities = Array.from(amenitySet);
        console.log(this.amenities, 'ementoes');
    }

    chunkArray(arr: string[], chunkSize: number): string[][] {
        const result = [];
        for (let amenities = 0; amenities < arr.length; amenities += chunkSize) {
            result.push(arr.slice(amenities, amenities + chunkSize));
        }
        return result;
    }

    totalHours(startTime: number, endTime: number): number {
        const start = startTime;
        const end = endTime;
        return end - start;
    }

    getShortDayNames(fullDays: string[]): string {
        return fullDays
            .map(day => this.appConst.DAY_ABBREVIATIONS[day as keyof typeof this.appConst.DAY_ABBREVIATIONS] || day)
            .join('-');
    }

}
