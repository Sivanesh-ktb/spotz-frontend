import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { CookieModule } from 'ngx-cookie';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';


//component
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/index/search/search.component';
import { SignupComponent } from './pages/index/signup/signup.component';
import { SpaceComponent } from './pages/index/space/space.component';
import { TestimonialComponent } from './pages/index/testimonial/testimonial.component';
import { Helpers } from './helpers/helper';
import { SearchMapComponent } from './pages/index/searchMap/searchMap.component';
import { SearchOrgFacComponent } from './pages/index/searchOrganizationFacility/searchOrgFac';
import { GoogleMapsModule } from '@angular/google-maps';
import { PrivacyComponent } from './pages/index/privacy/privacy.component';
import { HourslyRentalComponent } from './pages/index/hoursly-rental/hoursly-rental.component';
import { TermsConditionsComponent } from './pages/index/terms-conditions/terms-conditions.component';
import { WaiverComponent } from './pages/index/waiver/waiver.component';
import { AdminModule } from './pages/manage/admin.module';
import { PublicModule } from './pages/public/public.module';
import { AdminLayoutComponent } from './pages/manage/admin-layout/admin-layout';
import { AppHeaderComponent } from './pages/manage/includes/admin-header/admin-header';
import { UserModule } from './pages/user/user.module';
import { SharedUtils } from './utils/shared';
import { DurationStringPipe, PluralizePipe } from './utils/pipes';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    SignupComponent,
    SpaceComponent,
    TestimonialComponent,
    SearchMapComponent,
    SearchOrgFacComponent,
    SearchComponent,
    TermsConditionsComponent,
    PrivacyComponent,
    HourslyRentalComponent,
    WaiverComponent,
    AdminLayoutComponent,
    AppHeaderComponent

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    GoogleSigninButtonModule,
    SocialLoginModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatDatepickerModule,
    FullCalendarModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    UserModule,

    NoopAnimationsModule,
    MatInputModule,
    GoogleMapsModule,
    MatButtonModule,
    CalendarModule,
    AdminModule,
    PublicModule,
    CookieModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  exports: [
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    PublicModule,
    AdminLayoutComponent,
    AppHeaderComponent,
  ],
  providers: [
    {
      provide: environment.googleAuthText,
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
              scopes:
                'email profile',
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    Helpers,
    SharedUtils,
    DurationStringPipe,
    PluralizePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
