import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../../service/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatLabel
  ],
  styleUrls: ['./signup.component.css'] // Optional: add your styles here
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      console.log('Signup Form Submitted', this.signupForm.value);
      this.authService.signUp(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data) => {
            this.authService
              .login(this.signupForm.value.username, this.signupForm.value.password)
              .subscribe({
                next: (loginData) => {
                  this.router.navigate(['/welcome']);
                }
              });
            console.log('Signup successful', data);
          }
        });
    }
  }
}
