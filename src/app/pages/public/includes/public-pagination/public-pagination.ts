import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-public-pagination',
  templateUrl: './public-pagination.html',
  styleUrls: ['./public-pagination.css']
})
export class PublicPaginationComponent implements OnInit {
  @Input() totalItems!: number;
  @Input() multipleData: any[] = [];
  @Output() pagedOrgDetails = new EventEmitter<any[]>();
  page = this.appConst.startPage;
  pageSize = this.appConst.pageSize;
 constructor(
  private appConst: AppConst
 ){

 }
  ngOnInit(): void {
    this.updatePagedOrgDetails();
  }
  updatePagedOrgDetails(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const paginatedData = this.multipleData.slice(start, end);
    this.pagedOrgDetails.emit(paginatedData);
  }
  onPageChange(event: any): void {
    this.page = event.page + 1;
    this.updatePagedOrgDetails();
  }
}

