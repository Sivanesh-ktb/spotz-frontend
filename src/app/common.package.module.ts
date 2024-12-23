import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Helpers } from 'src/app/helpers/helper';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdminRoutingModule } from './pages/manage/admin-routing.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { AvatarModule } from 'primeng/avatar';
import { HttpClientModule } from '@angular/common/http';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserDropDownComponent } from './pages/manage/includes/user-drop-down/user-drop-down';
@NgModule({
  declarations: [
    UserDropDownComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    ConfirmDialogModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    MultiSelectModule,
    AvatarModule,
    HttpClientModule,
    NgxCsvParserModule,
    MatPaginatorModule,
    NgbPaginationModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    FileUploadModule,
    DragDropModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,
    ButtonModule,
    MultiSelectModule,
    AvatarModule,
    MatPaginatorModule,
    NgbPaginationModule,
    UserDropDownComponent
  ],
  providers: [
    Helpers,
    ConfirmationService,
    MessageService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CommonPackageModule { }
