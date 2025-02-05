import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../service/auth.service';


@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // if (this.authService.isLoggedIn()) {
    //   this.router.navigate(['/boards']); // Redirect logged-in users to boards
    // }
  }
}
