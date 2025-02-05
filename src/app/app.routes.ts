import {Routes} from '@angular/router';
import {BoardListComponent} from './boards/board-list/board-list.component';
import {BoardDetailComponent} from './boards/board-detail/board-detail.component';
import {CdkDragDropSortingExample} from './sandbox/list/list.component';
import {LoginComponent} from './home/login/login.component';
import {WelcomeComponent} from './home/welcome/welcome.component';
import {SignupComponent} from './home/signup/signup.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {path: 'sandbox/list', component: CdkDragDropSortingExample},
  {
    path: 'boards',
    component: BoardListComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
        component: BoardDetailComponent,
      },
    ],
  }
];
