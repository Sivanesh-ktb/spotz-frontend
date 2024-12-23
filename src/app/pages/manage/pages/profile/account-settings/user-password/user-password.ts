import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PasswordStrengthService } from 'src/app/services/password-strength.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.html',
  styleUrls: ['./user-password.css', '../account-settings.css']
})
export class UserPasswordComponent {
  newPassword = '';
  confirmPassword = '';
  currentPassword = '';
  strength: any = {};
  updateButton = true;

  constructor(
    private passwordStrengthService: PasswordStrengthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPassword = input.value;
    this.strength = this.passwordStrengthService.checkPasswordStrength(this.newPassword);
    if(this.newPassword !== this.confirmPassword) {
      this.updateButton = true;
    }
    else{
      this.updateButton = false;
    }
  }

  onConfirmPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.confirmPassword = input.value;
    if(this.newPassword !== this.confirmPassword) {
      this.updateButton = true;
    }
    else{
      this.updateButton = false;
    }
  }
  clearForm(): void {
    this.newPassword = '';
    this.confirmPassword = '';
    this.currentPassword = '';
    this.strength = '';
    this.updateButton = true;
  }

  get strengthClass(): string {
    switch (this.strength.strength) {
      case 'Very Strong': return 'very-strong';
      case 'Strong': return 'strong';
      case 'Medium': return 'medium';
      case 'Weak': return 'weak';
      default: return 'very-weak';
    }
  }
  updatePassword(){
    console.log('Password updated');
    this.userService.updatePassword(this.currentPassword, this.newPassword).subscribe(
      (response : any)=>{
        console.log(response);
        if(response.status === 200){
        this.toastr.success('Password updated successfully');
        this.clearForm();
        }
        else{
        this.toastr.error(response.body.message);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error updating password:', error);
        if (error.status === 400) {
          this.toastr.error((error.error.message || 'Please check your input.'));
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
      }
    )
  }
}
