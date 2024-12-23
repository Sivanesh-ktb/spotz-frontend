import * as moment from 'moment';
import { ElementRef } from '@angular/core';

export function convertToTimeSlot(time: number): string {
    if (isNaN(time) || time < 0 ) {
        return 'Invalid Time';
    }
    let hours = time % 24;
    const minutes = '00';
    let ampm = 'AM';
    if (hours >= 12) {
        if (hours > 12) {
            hours -= 12;
        }
        ampm = 'PM';
    } else if (hours === 0) {
        hours = 12;
    }
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
export function isUpcoming(date: string | Date): boolean {
  const bookingDate = moment(date).utc().startOf('day');
  const today = moment().utc().startOf('day');

  return bookingDate.isSameOrAfter(today);
}
export function getLeadTime(block:any,minDate:Date,timeSlot:number,oneDay:number,seconds:number){
  if (!block) {
     return null;
  }
  if (block.lead) {
      return block.lead;
  }
  let start, min, diff;
  const ONEDAY = oneDay;
  min = moment(minDate);
  start = min.utcOffset() * seconds;
  diff = moment(block.date).diff(min);
  const beforeLeadDate = (diff <= start);
  const onLeadDate = (diff < (ONEDAY + start));
  const beforeLeadBlock=   (block.time <= timeSlot);
  return (
          beforeLeadDate ||
          (onLeadDate && beforeLeadBlock)
  );
}

export function checkToday(listingDate: Date): number {
    let currentTime = 0;
    const list = moment(toDate(listingDate));
    const diff = moment.duration(moment().diff(list)); 

    if (diff.hours() < 24) {
        currentTime = toTimeSlot(diff, 1);
    }
    return currentTime;
}

export function toDate(dateObj: Date): Date {
    const m = moment(new Date(dateObj)).utc();
    return moment({
        year: m.year(),
        month: m.month(),
        day: m.date()
    }).toDate();
}

export function toTimeSlot(momentObject: moment.Duration, divisor: number, end?: boolean): number {
    let timeslot: number;
    timeslot = momentObject.hours() * divisor;
    timeslot += (momentObject.minutes() >= 30) ? 1 : 0;

    if (end && timeslot === 0) {
        timeslot = 288 / (12 / divisor);
    }

    return timeslot;
}

export const dateOptions = {
    showWeeks: false,
    datepickerMode: 'day',
    shortcutPropagation: true,
    minDate: new Date(),
    startingDay: 1
  };
  
export function officeSpace(val:number) {
    return Math.round(val * 100) / 100;
}

export function getSelectableElements(element: ElementRef): HTMLElement[] {

    const children = element.nativeElement.children[0]?.children || [];
    const selectableElements: HTMLElement[] = [];
    
    for (let element = 0; element < children.length; element++) {
        const child = children[element] as HTMLElement;
        selectableElements.push(child);
    }

    return selectableElements;
}

export function offset(element: HTMLElement | null): { top: number; left: number } {
    if (!element || !element.ownerDocument) {
      return { top: 0, left: 0 };
    }
  
    const documentElem = element.ownerDocument.documentElement;
    const box = element.getBoundingClientRect();
  
    return {
      top: box.top + (window.pageYOffset || documentElem.scrollTop || 0) - (documentElem.clientTop || 0),
      left: box.left + (window.pageXOffset || documentElem.scrollLeft || 0) - (documentElem.clientLeft || 0),
    };
  }
  

export function setDisabled(list: any[]): void {
  const selected :any[] = [];

  console.log(33);

  // Collect all selected items
  list.forEach(function(p: any) {
      if (p.isSelected) {
          selected.push(p);
      }
  });

  // Default all items to not disabled
  list.forEach(function(p: any) {
      p.isDisabled = false; // Reset to default (enabled)

      // Check if the item should be disabled based on selected items
      selected.forEach(function(b: any) {
          console.log(34);

          // Only consider items that are not the same and are available
          if (p.name !== b.name && p.available) {

              // Check for overlap between time ranges (exclude if they are not overlapping)
              const isNotOverlapping = p.endTime <= b.startTime || p.startTime >= b.endTime;

              // If there is an overlap, disable the item
              if (!isNotOverlapping) {
                  p.isDisabled = true;
              }
          }
      });
  });
}

export function isAuthorized(authorizedRoles: string[]): boolean {
    const user = JSON.parse(localStorage.getItem('userData') || '{}');

    if (!user) {
        return false;
    }

    let check = authorizedRoles.indexOf('*') !== -1;
    if (!check) {
        check = authorizedRoles.some((role: string) => {
            return user.roles && user.roles.indexOf(role) !== -1;
        });
    }

    return isAuthenticated() && check;
}

export function isAuthenticated(): boolean {
    try {
        const auth = localStorage.getItem('id');
        return !!auth;
    } catch (e) {
        return false;
    }
}
export function getFormattedDate(date: Date): string {
  const options: { weekday: 'short' | 'long' | 'narrow' } = { weekday: 'short' };
  return date.toLocaleDateString('en-US', options);
}
