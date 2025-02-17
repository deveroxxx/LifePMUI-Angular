import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../service/board.service';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {NgForOf} from '@angular/common';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatIconButton} from '@angular/material/button';
import {EditableInputComponent} from '../../shared/editable-input/editable-input.component';
import {BoardDto} from '../../dto/board-dto';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-board-list',
  standalone: true,
  templateUrl: './board-list.component.html',
  styleUrls: ['./board-list.component.css'],
  imports: [
    NgForOf,
    RouterOutlet,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer,
    EditableInputComponent,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    MatIconButton
  ]
})
export class BoardListComponent implements OnInit {
  boards: BoardDto[] = [];

  constructor(private boardService: BoardService) {}

  ngOnInit(): void {
    this.boardService.loadBoards();
    this.boardService.boards$.subscribe(boards => {
      this.boards = boards;
    });
  }

  addBoard($event: string): void {
    this.boardService.addBoard($event)
  }

}
