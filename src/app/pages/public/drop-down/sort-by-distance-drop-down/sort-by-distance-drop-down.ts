import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-sort-by-distance-drop-down',
  templateUrl: './sort-by-distance-drop-down.html',
  styleUrls: ['./sort-by-distance-drop-down.css'],
})
export class SortByDistanceDropDownComponent {
  @Output() sortChange = new EventEmitter<string>();
  @Input() page!: number;

  dropdownOpen = false;
  currentSort = '';
  sortOrder = true;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onSortOptionSelect(sortType: string) {
    if (this.currentSort === sortType) {
      this.sortOrder = !this.sortOrder;
    } else {
      this.currentSort = sortType;
      this.sortOrder = true;
    }

    const sortValue = this.getSortValue();
    this.sortChange.emit(sortValue);

    this.dropdownOpen = false;
  }

  getSortValue(): string {
    if (this.currentSort === 'near') {
      return this.sortOrder ? 'near' : 'far';
    } else if (this.currentSort === 'name') {
      return this.sortOrder ? 'name-asc' : 'name-desc';
    } else if (this.currentSort === 'price') {
      return this.sortOrder ? 'price-low' : 'price-high';
    }
    return '';
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    const isInsideDropdown = target.closest('.dropdown-selectbox');
    
    if (!isInsideDropdown) {
      this.dropdownOpen = false;
    }
  }
}
