import {Routes} from '@angular/router';
import {BoardListComponent} from './boards/board-list/board-list.component';
import {BoardDetailComponent} from './boards/board-detail/board-detail.component';
import {CdkDragDropSortingExample} from './sandbox/list/list.component';

export const routes: Routes = [
  {path: '', redirectTo: '/boards', pathMatch: 'full'},
  {path: 'sandbox/list', component: CdkDragDropSortingExample},
  {
    path: 'boards',
    component: BoardListComponent, children: [
      {
        path: ':id',
        component: BoardDetailComponent,
      },
    ],
  }
];
