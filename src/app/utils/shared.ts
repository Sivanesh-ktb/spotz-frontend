import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})

export class SharedUtils {
    times: string[] = [];

    constructor() {
        const today = moment().startOf('day');
        this.times.push(today.format('hh:mm A'));
        for (let index = 0; index < 288; index++) {
            this.times.push(today.add(5, 'minutes').format('hh:mm A'));
        }

    }
}