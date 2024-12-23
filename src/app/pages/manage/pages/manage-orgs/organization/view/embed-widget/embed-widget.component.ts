import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { SpaceDetailsDTO, SpaceType, ViewModel } from 'src/app/models/org';
import { FormControl } from '@angular/forms';
import { AppConst } from 'src/app/app.const';
import { address } from 'src/app/models/space';
import { CreateOrgComponentService } from 'src/app/services/create-org.service';
import { adminRoutes, loginRoutes } from 'src/app/models/enums';

@Component({
  selector: 'app-embed-widget',
  templateUrl: './embed-widget.component.html',
  styleUrls: ['./embed-widget.component.css']
})
export class EmbedWidgetComponent implements OnInit {
  @Input() buttonBgColor: string = this.appConst.defaultButtonColor;
  @Input() displayType = 'button';
  @Input() buttonTextColor: string = this.appConst.defaultTextColor;
  @Input() orgDetails: any;
  @Input() spaceDetails!: SpaceDetailsDTO;

  vm: ViewModel = {
    embed: {
      color: false,
      bgcolor: '',
      button: false,
      btncolor: '',
      display: 'button',
      code: '',
      url: '',
      height: 50
    }
  };
  orgId = '';
  scheduleCalendarDate: string | Date = new Date();
  calendarInputStyle = { display: 'none' };
  selectedSpaceType = '';
  spaceTypes: SpaceType[] = [];
  selected = new FormControl<Date | null>(null);
  minDate = new Date();
  maxDate = new Date(new Date().setDate(new Date().getDate() + 30));
  dateControl = new FormControl();

  constructor(
    private OrgService: CreateOrgComponentService,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private appConst: AppConst
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.orgId = params.get('orgId') ?? '';
    });
    this.viewspaceDetails(this.orgId);
  }
  viewspaceDetails(orgId: string): void {
    this.OrgService
      .spaceDropdownDetails(orgId)
      .subscribe(
        (response) => {
          const orgData: SpaceDetailsDTO | null = response?.body ?? null;
          if (orgData) {
            this.spaceTypes = orgData.spaceTypes;
            console.log('Space Types:', this.spaceTypes);
          } else {
            console.error('No data found in response body.');
          }
        },
        (error: { status: number }) => {
          if (error.status === 401) {
            this.authService.authLogout();
            this.router.navigate([loginRoutes.LOGIN]);
          } else {
            this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
          }
        }
      );
  }  

  viewOrganization(address: address, orgName: string) {
    if (address && orgName) {
      const url = `/${address.state}/${address.city}/orgs/${orgName}`;
      this.router.navigateByUrl(url);
    } else {
      this.toastr.error('Invalid organization details', 'Error');
    }
  }

  findTime() {
    if (!this.orgDetails) {
        console.error('Organization details are not available.');
        return;
    }

    const date =
        this.scheduleCalendarDate instanceof Date
            ? this.scheduleCalendarDate.toISOString().split('T')[0]
            : this.scheduleCalendarDate;

    const geocode = this.orgDetails.address?.geocode?.coordinates.join(',');

    if (!this.selectedSpaceType) {
        this.toastr.error('Please select a space type.', 'Validation Error');
        return;
    }


    const queryParams = {
        date,
        org: this.orgDetails.name,
        spaceType: this.selectedSpaceType,
        data: geocode,
    };
    this.router.navigate(['/search'], { queryParams });
}

  updateEmbed() {
    let url = window.location.origin;
    url += `/admin/widget/org/${this.orgId}`;

    if (this.vm.embed.color && this.vm.embed.bgcolor) {
      url += `&bgcolor=${this.vm.embed.bgcolor}`;
    }
    if (this.vm.embed.button && this.vm.embed.btncolor) {
      url += `&btncolor=${this.vm.embed.btncolor}`;
    }

    const height = this.vm.embed.display === 'calendar' ? 115 : 50;
    url += this.vm.embed.display === 'calendar' ? '&mode=calendar' : '&mode=button';

    this.vm.embed.code = `<iframe id="spotz-widget" frameborder="0" width="240" height="${height}" src="${url}"></iframe>`;
    this.vm.embed.url = url;
    this.vm.embed.height = height;
  }

  dateChange(event: string) {
    if (event) {
      this.scheduleCalendarDate = event;
      this.updateIframeWithDate(event);
    }
  }

  updateIframeWithDate(date: string) {
    const iframeUrl = `${this.vm.embed.url}&date=${date}`;
    this.vm.embed.code = `<iframe id="spotz-widget" frameborder="0" width="240" height="${this.vm.embed.height}" src="${iframeUrl}"></iframe>`;
  }

  toggleCalendar() {
    this.calendarInputStyle = { display: this.calendarInputStyle.display === 'none' ? 'inline-block' : 'none' };
  }
}

