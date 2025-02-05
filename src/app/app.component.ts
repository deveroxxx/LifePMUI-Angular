import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from './service/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  constructor(private authService: AuthService, private router: Router) {
  }

  logout() {
    this.authService.logout().subscribe({next: () => {this.router.navigate(['/login']);}});
  }


}
