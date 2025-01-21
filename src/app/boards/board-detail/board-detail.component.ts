import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BoardService} from '../../service/boardService';
import {NgForOf} from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {BoardDto} from '../../dto/board-dto';
import {BoardColumnDto} from '../../dto/board-column-dto';
import {TodoDto} from '../../dto/todo-dto';


@Component({
  selector: 'app-board-detail',
  standalone: true,
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css'],
  imports: [
    NgForOf,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup
  ]
})
export class BoardDetailComponent implements OnInit {
  board: BoardDto | undefined;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadBoard(id);
    });
  }

  loadBoard(id: number): void {
    this.boardService.getBoardById(id).subscribe((data) => {
      this.board = data;
    });
  }

  constructor(private route: ActivatedRoute, private boardService: BoardService) {
  }

  drop(event: CdkDragDrop<TodoDto[], any>): void {
    console.log('Dropped:', event);
    console.log(event.container.data);
    console.log("Previndex ", event.previousIndex, " Next index", event.currentIndex);

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
