// login.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import {
  SocialAuthService,
  GoogleLoginProvider,
  SocialUser,
} from '@abacritt/angularx-social-login';
import { adminRoutes, loginRoutes } from 'src/app/models/enums';
import { ToastrService } from 'ngx-toastr';
import { UserSignup } from 'src/app/models/user';
import { AuthGuardService } from 'src/app/services/auth-guard.service';
import { AppConst } from 'src/app/app.const';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  token = '';
  showLogin = true;
  showSigup = false;
  showForgot = false;
  showReset = false;
  showResetTab = false;
  loginTab = this.appConst.LOGIN_TAB;
  signupTab = this.appConst.SIGNUP_TAB;
  resetTab = this.appConst.RESET_TAB;
  forgetPasswordTab = this.appConst.FORGET_PASSWORD_TAB;
  email = '';
  password = '';
  confirmPassword = '';
  isPasswordVisible = false;
  isConfirmPasswordVisible = false;
  firstName = '';
  lastName = '';
  phone = '';
  dob = '';
  errorMessage = '';
  successMessage = '';
  accessToken = '';
  returnUrl = '';
  maxDob = '';
  user: SocialUser | null = null;
  loggedIn: boolean | null = null;
  private isSignInProcess = false;
  private isGettingToken = false;
  private provider!: boolean;

  isSigningIn!: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserSignup,
    private authService: AuthService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private cookieService: CookieService,
    private googleAuthService: SocialAuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private authGuardService:AuthGuardService,
    private appConst : AppConst
  ) {
    this.showLogin = data.showSignup;
    const today = new Date();
    today.setFullYear(today.getFullYear() - 10);
    this.maxDob = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const reset = params['reset'];
      if (reset === 'true') {
        this.showLogin = false;
        this.showSigup = false;
        this.showReset = true;
        this.showResetTab = true;
      }
      if (params['dest']) {
        this.returnUrl = decodeURIComponent(params['dest']);
      } else if (this.showLogin) {
        this.returnUrl = encodeURIComponent('');
      }
      console.log(this.returnUrl, 'returnUrl');
      this.token = this.route.snapshot.queryParamMap.get('token')??'';
    });

    this.googleAuthService.authState.subscribe((user) => {
      this.isSignInProcess = true;
      this.user = user;
      this.loggedIn = user != null;
      if (this.loggedIn && this.user) {
        this.provider = true;

        console.log('Google Sign-In user details:', this.user);

        this.googleSignIn();
      }
    });
  }
  toggleSwitch(tab: number) {
    if (tab == this.appConst.LOGIN_TAB) {
      this.showLogin = true;
      this.showSigup = false;
      this.showForgot = false;
      this.showReset = false;
    } else if (tab == this.appConst.SIGNUP_TAB) {
      this.showLogin = false;
      this.showSigup = true;
      this.showForgot = false;
      this.showReset = false;
    } else if (tab == this.appConst.FORGET_PASSWORD_TAB ) {
      this.showForgot = true;
      this.showLogin = false;
      this.showSigup = false;
      this.showReset = false;
    } else if (tab == this.appConst.RESET_TAB) {
      this.showReset = true;
      this.showForgot = false;
      this.showLogin = false;
      this.showSigup = false;
    }
  }
  googleSignIn(): void {
    if (this.isSigningIn) {
      return;
    }

    if (this.user) {
      this.isSigningIn = true;
      this.toastr.clear();

      this.authService
        .authGoogleLogin(this.user.idToken, this.accessToken)
        .subscribe(
          (response: any) => {

            const authDetails = this.authService.decodeToken(response.jwtToken);
            this.successMessage = response.Message;
            this.toastr.success(this.successMessage);
            if (response.status === 200) {
           if (authDetails.user.role === environment.superAdminRole) {
              this.authService.setLoginStatus(
                true,
                authDetails.user.role,
                this.provider
              );
              this.dialogRef.close();
              localStorage.setItem('authToken', response.jwtToken);
              localStorage.setItem('id', authDetails.user.id);
              localStorage.setItem('name', authDetails.user.UserName);
              localStorage.setItem('role', authDetails.user.role);
              localStorage.setItem('email', authDetails.user.email);
              localStorage.setItem('groups', JSON.stringify(authDetails.user.groups));
              localStorage.setItem('userImage', authDetails.user.img);
              localStorage.setItem('userData', JSON.stringify(authDetails.user.data));
              this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
              this.authGuardService.loginUserRole();
            } else {
              this.authService.setLoginStatus(
                true,
                authDetails.user.role,
                this.provider
              );
              this.dialogRef.close();
              localStorage.setItem('authToken', response.jwtToken);
              localStorage.setItem('id', authDetails.user.id);
              localStorage.setItem('name', authDetails.user.UserName);
              localStorage.setItem('role', authDetails.user.role);
              localStorage.setItem('email', authDetails.user.email);
              localStorage.setItem('groups', JSON.stringify(authDetails.user.groups));
              localStorage.setItem('userData', JSON.stringify(authDetails.user.data));
              setTimeout(() => {
                this.successMessage = '';
                this.dialogRef.close();
              }, 5000);
              this.router.navigate([adminRoutes.USER_DASHBOARD]);
            }
            }
          },
          (error) => {
            this.toastr.error('Google sign-in failed');
            console.error('Error during Google sign-in:', error);
          }
        );
    } else {
      this.toastr.error('User not found. Please try signing in again.');
    }
  }

  signInWithGoogle(): void {
    this.googleAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((user) => {
        this.user = user;
        this.loggedIn = user != null;
        if (this.loggedIn && this.user) {
          console.log('Google Sign-In user details:', this.user);
          this.getAccessToken(); // Get access token after successful sign-in
        }
      })
      .catch((error) => {
        this.toastr.error('Google sign-in failed');
        console.error('Error during Google sign-in:', error);
      });
  }

  signOut(): void {
    this.googleAuthService
      .signOut()
      .then(() => {
        this.toastr.success('Signed out successfully');
        console.log('User signed out from Google');
      })
      .catch((error) => {
        this.toastr.error('Sign-out failed');
        console.error('Error during sign-out:', error);
      });
  }

  getAccessToken(): void {
    if (this.isGettingToken) return;

    this.isGettingToken = true;

    this.googleAuthService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        this.accessToken = accessToken;
        console.log('Google access token:', accessToken);
        this.googleSignIn();
      })
      .catch((error) => {
        this.toastr.error('Error getting access token');
        console.log(error);
        console.error('Error getting access token:', error);
        this.isGettingToken = false;
      });
  }

  refreshToken(): void {
    this.googleAuthService
      .refreshAuthToken(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        this.toastr.success('Token refreshed successfully');
        console.log('Google access token refreshed');
      })
      .catch((error) => {
        this.toastr.error('Token refresh failed');
        console.error('Error refreshing token:', error);
      });
  }

  loginWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  onSubmit(): void {
    if (this.showLogin) {
      this.authService.login(this.email, this.password).subscribe(
        (response: any) => {
          this.provider = false;
          if (response.status === 200) {
            const authDetails = this.authService.decodeToken(
              response.body.accessToken
            );
            this.toastr.success(response.body.Message);
if (authDetails.user.role === environment.superAdminRole) {
            this.authService.setLoginStatus(
              true,
              authDetails.user.role,
              this.provider
            );
            this.dialogRef.close();
            localStorage.setItem('authToken', response.body.accessToken);
            localStorage.setItem('id', authDetails.user.id);
            localStorage.setItem('name', authDetails.user.UserName);
            localStorage.setItem('role', authDetails.user.role);
            localStorage.setItem('email', authDetails.user.email);
            localStorage.setItem('groups', JSON.stringify(authDetails.user.groups));
            localStorage.setItem('userImage', authDetails.user.img);
            localStorage.setItem('userData', JSON.stringify(authDetails.user.data));
            this.authGuardService.loginUserRole();
            this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
          } else {
            this.authService.setLoginStatus(
              true,
              authDetails.user.role,
              this.provider
            );
            this.dialogRef.close();
            localStorage.setItem('authToken', response.body.accessToken);
            localStorage.setItem('id', authDetails.user.id);
            localStorage.setItem('name', authDetails.user.UserName);
            localStorage.setItem('role', authDetails.user.role);
            localStorage.setItem('email', authDetails.user.email);
            localStorage.setItem('groups', JSON.stringify(authDetails.user.groups));
            localStorage.setItem('userData', JSON.stringify(authDetails.user.data));
            setTimeout(() => {
              this.successMessage = '';
              this.dialogRef.close();
            }, 5000);
              this.router.navigate([adminRoutes.USER_DASHBOARD]);
            }
          }
        },
        (error) => {
          this.toastr.error(error.error);
          if (error.error.error !== undefined) {
            this.errorMessage = error.error.error;
          }
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      );
    } else {
      this.authService
        .register(
          this.email,
          this.password,
          this.firstName,
          this.lastName,
          this.phone,
          this.dob
        )
        .subscribe(
          (response: any) => {
            this.successMessage = response.message + '. Check your inbox!';
            this.toastr.success(this.successMessage);
            setTimeout(() => {
              this.successMessage = '';
            }, 5000);
          },
          (error) => {
            this.toastr.error(error.error.error);
            const errorMessages: string[] = [];
            error.error.errors.forEach((err: any) => {
              console.log(err);
              errorMessages.push(err.msg);
            });
            this.errorMessage = errorMessages.join('. ');
            setTimeout(() => {
              this.errorMessage = '';
            }, 5000);
          }
        );
      console.log('Register form submitted');
    }
  }

  onForgotPasswordSubmit(): void {
    if (this.email) {
      this.authService.forgotPassword(this.email).subscribe(
        (response) => {
          this.successMessage = response.message;
          this.toastr.success(this.successMessage);
          this.errorMessage = '';
        },
        (error) => {
          this.errorMessage = error.error ? error.error.message : 'An error occurred. Please try again later.';
          this.toastr.error(this.errorMessage);
          this.successMessage = '';
        }
      );
    } else {
      this.errorMessage = 'Please enter your email.';
    }
  }

  onResetPasswordSubmit(): void {
    if (this.password === this.confirmPassword) {
      if (this.token) {
        this.authService
          .resetPassword(this.password, this.confirmPassword, this.token)
          .subscribe(
            (response) => {
              this.successMessage =this.appConst.RESET_PASSWORD_SUCCESS_MESSAGE;
              this.toastr.success(this.successMessage);
              this.password = '';
              this.confirmPassword = '';
              const urlWithoutReset = this.router.url.split('?')[0];
              this.router.navigate([urlWithoutReset], { queryParams: {} });
              this.showReset = false;
              this.showResetTab = false;
              this.showLogin = true;
            },
            (error) => {
              this.errorMessage =
                error.error.message ||
                'Error occurred while resetting the password.';
              this.toastr.error(this.errorMessage);
            }
          );
      } else {
        this.toastr.error('Token is missing');
      }
    } else {
      this.toastr.error('Passwords do not match');
    }
  }
  checkCookieAndNavigate() {
    const loginData = this.cookieService.get('loginData');
    console.log('Login successful 002eee:', loginData);
    if (loginData) {
      const parsedData = JSON.parse(loginData);
      if (
        parsedData.valid &&
        parsedData.groups &&
        parsedData.groups[1].name === environment.superAdminRole
      ) {
        this.router.navigate([adminRoutes.ADMIN_DASHBOARD]);
      } else {
        this.router.navigate([loginRoutes.LOGIN]);
      }
    } else {
      this.router.navigate([loginRoutes.LOGIN]);
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
  get hasMinLength(): boolean {
    return this.password.length >= 8;
  }
  get hasLowercase(): boolean {
    return /[a-z]/.test(this.password);
  }
  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.password);
  }
  get hasNumber(): boolean {
    return /\d/.test(this.password);
  }
  get hasSpecialChar(): boolean {
    return /[@$!%*?&]/.test(this.password);
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
}
