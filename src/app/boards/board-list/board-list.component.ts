import { Component } from '@angular/core';
import {BoardService} from '../../service/board.service';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-board-list',
  standalone: true,
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css'],
  imports: [
    RouterLink,
    NgForOf,
    RouterOutlet,
    RouterLinkActive
  ]
})
export class BoardListComponent {
  boards: any[] = [];

  constructor(private boardService: BoardService) {
    this.boardService.getBoards().subscribe((data) => {
      this.boards = data;
    });
  }
}
