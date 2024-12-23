// register.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  phone = '';
  dob = '';
  errorMessage = '';
  successMessage = '';
	model: NgbDateStruct | undefined;
  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.register(this.email, this.password, this.firstName, this.lastName, this.phone, this.dob).subscribe(
      (response: any) => {
       this.successMessage = response.message;
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      },
      error => {
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
  }
}
