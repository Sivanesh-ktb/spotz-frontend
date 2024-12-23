import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordStrengthService {
  checkPasswordStrength(password: string): { strength: string, requirements: string[] } {
    let strength = 0;
    const requirements: string[] = [];

    if (password.length >= 8) {
      strength += 1;
    } else {
      requirements.push('Must be at least 8 characters long');
    }
    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      requirements.push('Must contain one uppercase letter');
    }
    if (/[a-z]/.test(password)) {
      strength += 1;
    }
    if (/\d/.test(password)) {
      strength += 1;
    } else {
      requirements.push('Must contain one number');
    }
    if (/[@$!%*?&]/.test(password)) {
      strength += 1;
    } else {
      requirements.push('Must contain one non-alphanumeric character (symbol)');
    }

    let strengthLabel = '';
    switch (strength) {
      case 5: strengthLabel = 'Very Strong'; break;
      case 4: strengthLabel = 'Strong'; break;
      case 3: strengthLabel = 'Medium'; break;
      case 2: strengthLabel = 'Weak'; break;
      default: strengthLabel = 'Very Weak'; break;
    }

    return { strength: strengthLabel, requirements: requirements };
  }
}
