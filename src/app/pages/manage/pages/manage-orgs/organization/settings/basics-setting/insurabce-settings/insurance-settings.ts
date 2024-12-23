import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { ConfirmationPopupComponent } from '../../../../space/space-settings/confirmation-popup/confirmation-popup';
import { AppConst } from 'src/app/app.const';
import { Helpers } from 'src/app/helpers/helper';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-insurance-settings',
  templateUrl: './insurabce-settings.html',
  styleUrls: ['./insurabce-settings.css'],
})
export class InsuranceSettingsComponent implements OnChanges {
  @Input() ins!: any;
  @Output() insChanges = new EventEmitter<any>();
  @Output() insuranceRemoved = new EventEmitter<any>();
  showInsurance = false;
  insurance: any;
  gl!: boolean;
  userGl!: boolean;
  prohibited!: boolean;
  battingValue!: boolean;
  batting!: boolean;
  validate!:boolean;

  constructor(
    private appConst: AppConst,
    private helper: Helpers,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnChanges() {
    this.gl = this.ins?.gl;
    this.userGl = this.ins?.userGl;
    this.prohibited = this.ins?.prohibited;
    this.battingValue = this.ins?.battingValue;
    this.batting = this.ins?.batting;
    this.validateForm();
  }

  insuranceInfo() {
    this.showInsurance = true;
  }

  cancelInsurance() {
    this.showInsurance = false;
  }

  isInsInvalid(): boolean {
    return (
      !this.ins?.gl ||
      this.ins.prohibited ||
      (this.ins.battingValue && !this.ins.batting)
    );
  }

  removeInsurance() {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '350px',
      position: { top: '10px' },
      data: {
        type: this.appConst.INSURANCECONFIRMATION,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.insuranceRemoved.emit(this.ins);
      } else {
        this.toastr.error('Operation cancelled.');
      }
    });
  }

  validateForm() {
    if (this.battingValue !== undefined && this.prohibited === false) {
      if (this.batting !== undefined) {
        this.validate = false;
      } else {
        this.validate = true;
      }
    } else {
      this.validate = true;
    }
  }

  saveInsuranceSettings() {
    this.ins = {
      battingValue: this.battingValue,
      gl: this.gl,
      userGl: this.userGl,
      prohibited: this.prohibited,
      batting: this.batting,
    };

    this.insChanges.emit(this.ins);

    this.showInsurance = false;
  }
}
