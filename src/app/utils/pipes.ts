import { Pipe, PipeTransform } from '@angular/core';
import { SharedUtils } from './shared';
import { AppConst } from '../app.const';
import moment from 'moment';

@Pipe({
    name: 'timeslotPipe',
    pure: true  
})
export class TimeslotPipe implements PipeTransform {

    constructor(private utilsService: SharedUtils) { }

    transform(num: number, divisor = 2, shorter = false, noSpace = false, noMeridiem = false): string {
        const div = divisor || 2;
        const index = Math.trunc(num) * (12 / div);
        const time = this.utilsService.times[index];

        let val = time;
        if (shorter) {
            const ix = time.indexOf(':00');
            val = (ix >= 0) ? time.substr(0, ix) + time.substr(-2) : time;
        }
        if (noSpace) {
            val = val.replace(' ', '');
        }
        if (noMeridiem) {
            val = val.replace('m', '');
        }

        if (val && val.startsWith('0')) { // Remove leading zeros
            val = val.substring(1);
        }
        return val;
    }
}

@Pipe({
    name: 'timespanPipe',
    pure: false  
})
export class TimespanPipe implements PipeTransform {

    constructor(private utilsService: SharedUtils) { }

    transform(
        array: number[],
        divisor = 2,
        linebreak = false,
        abbr = false,
        removespace = false,
        multiple = false
    ): string | null {

        if (!array || array.length === 0) {
            return null;
        }

        const div = divisor;
        const bumps: number[][] = [];
        let prev = array[0];

        bumps.push([prev]);

        for (let data = 1; data < array.length; data++) {
            const block = array[data];
            if (block !== prev + 1) {
                bumps.push([block]);
            } else {
                bumps[bumps.length - 1].push(block);
            }
            prev = block;
        }

        let result = '';
        bumps.forEach((group) => {
            result += this.buildRow(group, div, abbr, linebreak, removespace);
            if (multiple) {
                result += '<br/>';
            }
        });

        return result;
    }

    private buildRow(group: number[], divisor: number, abbr: boolean, linebreak: boolean, removespace: boolean): string {
        let str = '';
        const start = group[0];
        const end = group[group.length - 1];

        str += this.utilsService.times[start * 12 / divisor];

        if (abbr) {
            str += '-';
        } else {
            str += ' to ';
        }

        if (linebreak) {
            str += '<br/>';
        }

        str += this.utilsService.times[(end + 1) * 12 / divisor];

        if (abbr) {
            str = str.replace(/:00/ig, '').replace(/[a|p]m/ig, '');
        }

        if (removespace) {
            str = str.replace(/(:\d\d)\s/g, '$1');
        }

        return str;
    }
}

@Pipe({
    name: 'duration',
    pure: false  
})
export class DurationPipe implements PipeTransform {

    constructor(private durationStringPipe: DurationStringPipe) { }

    transform(input: any, divisor = 2, short = false): string {
        if (!input || input.startTime === null || input.endTime === null) {
            return '';
        }

        let obj: { startTime: number; endTime: number } = { startTime: 0, endTime: 0 };

        if (Array.isArray(input)) {
            obj.startTime = input[0];
            obj.endTime = input[input.length - 1] + 1;
        } else {
            obj = input;
            if (obj.startTime === 0 && obj.endTime === 287) {
                return 'All Day';
            }
        }

        return this.durationStringPipe.transform(obj.startTime, obj.endTime, divisor, short);
    }
}

@Pipe({
  name: 'durationString',
  pure: true,
})
export class DurationStringPipe implements PipeTransform {
  constructor(private pluralizePipe: PluralizePipe) {}

  transform(
    startTime: number | null | undefined,
    endTime: number | null | undefined,
    divisor = 2,
    short = false
  ): string {
    if (startTime == null && endTime == null) {
      return '';
    }

    const div = divisor || 2;
    const num = endTime ? (endTime - (startTime || 0)) / div : startTime || 0;

    let min = num % 1;
    const hrs = num - min;
    let str = '';

    min = Math.round(60 * min);

    if (hrs > 0) {
      str += short
        ? `${hrs}h `
        : `${this.pluralizePipe.transform(hrs, 'hr', 'hrs', false)} `;
    }

    if (min > 0) {
      str += short
        ? `${min}m`
        : this.pluralizePipe.transform(min, 'min', 'mins', false);
    }
    return str;
  }
}


@Pipe({
    name: 'pluralize',
    pure: true  
})
export class PluralizePipe implements PipeTransform {
    transform(basis: number, singular: string, plural: string, hideBasis = false): string {
        if (basis == null) {
            return '';
        }

        basis = parseFloat(basis.toString());

        if (basis === 1) {
            return hideBasis ? singular : `${basis} ${singular}`;
        } else {
            return hideBasis ? plural : `${basis} ${plural}`;
        }
    }
}

@Pipe({
    name: "level",
    pure: false
})
export class LevelPipe implements PipeTransform{
    constructor(private appConst: AppConst) { }

    transform(value: number, number = false): any {
        const levels = this.appConst.LEVELS_ENUM;

        if (value >= 0) {
            const num = (levels.length - 1) - value;
            return number ? num + 1 : levels[num];
        }
        
        return '';
    }
}

@Pipe({
    name:"age"
})
export class AgePipe implements PipeTransform{
    transform(value: string | Date): string {
        if (!value) {
          return '';
        }
    
        const inputDate = moment(value);
        const now = moment();
        const duration = moment.duration(now.diff(inputDate));
    
        const years = duration.years();
        const months = duration.months();
    
        return `${years} y ${months} m old`;
      }
}

@Pipe({
    name: "phone"
})
export class PhonePipe implements PipeTransform {
    transform(input: string): string {
        if (!input || input && input.length < 10) {
            return input;
        }

        let phone = `(${input.substr(0, 3)}) ${input.substr(3, 3)}-${input.substr(6, 4)}`;

        if (input.length > 10) {
            phone += ` ext. ${input.substr(10)}`;
        }
        return phone;
    }
}