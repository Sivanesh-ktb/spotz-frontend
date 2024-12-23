import { Component, Input, Output, HostListener, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() checkPage !:number;
  @Input() multipleData: any[] = [];
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() pagedOrgDetails = new EventEmitter<any[]>();

  page = 1;
  currentStart = 1;
  currentEnd = this.pageSize;
  maxPageSize = this.appConst.MAX_PAGE_SIZE;
  constructor(
    private appConst : AppConst
  ) { }
  ngOnInit(): void {
    this.updatePagedOrgDetails();
    this.emitPageChange();
  }
  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onPageSizeSelect(size: number): void {
    this.pageSize = size;
    this.onPageSizeChange(size);
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown-container');
    if (dropdown && !dropdown.contains(target)) {
      this.isDropdownOpen = false;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['multipleData'] || changes['totalItems']) {
      this.updatePagedOrgDetails();
    }
    if (changes['pageSize']) {
      this.onPageSizeChange(this.pageSize);
    }
  }

  private emitPageChange(): void {
    this.pageChange.emit(this.page);
    this.pageSizeChange.emit(this.pageSize);
  }

  updatePagedOrgDetails(): void {
    if (this.page < 1) this.page = 1;

    if (this.totalItems === 0 || this.multipleData.length === 0) {
      this.currentStart = 0;
      this.currentEnd = 0;
    } else {
      const start = (this.page - 1) * this.pageSize;
      const end = Math.min(start + this.pageSize, this.totalItems);

      this.currentStart = start + 1;
      this.currentEnd = end;
    }

    const pagedData = this.multipleData?.slice(this.currentStart - 1, this.currentEnd);
    this.pagedOrgDetails.emit(pagedData);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > Math.ceil(this.totalItems / this.pageSize)) {
      return;
    }
    this.page = page;
    this.updatePagedOrgDetails();
    this.emitPageChange();
  }

  onPageSizeChange(size: number): void {
  if (size <= 0) return;
    this.pageSize = Number(size);
    if (this.page > Math.ceil(this.totalItems / this.pageSize)) {
      this.page = Math.ceil(this.totalItems / this.pageSize);
    }
    this.updatePagedOrgDetails();
    this.emitPageChange();
  }
}
