import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BoardService} from '../../service/board.service';
import {NgForOf, NgIf} from '@angular/common';
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
import {MatIconButton} from '@angular/material/button';
import {MatDivider} from '@angular/material/divider';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmationComponent} from '../../shared/delete-confirmation/delete-confirmation.component';
import {EditableInputComponent} from '../../shared/editable-input/editable-input.component';
import {TodoDetailDialogComponent} from '../todo-detail-dialog/todo-detail-dialog.component';
import { BoardColumnService } from '../../service/board-column.service';
import { TodoService } from '../../service/todo.service';


@Component({
  selector: 'app-board-detail',
  standalone: true,
  templateUrl: './board-detail.component.html',
  styleUrls: ['./board-detail.component.css'],
  imports: [
    NgForOf,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    NgIf,
    MatDivider,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatToolbar,
    MatCardContent,
    MatCardActions,
    MatIcon,
    MatIconButton,
    EditableInputComponent
  ]
})
export class BoardDetailComponent implements OnInit {
  board!: BoardDto;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.loadBoard(id);
    });
  }

  loadBoard(id: number): void {
    this.boardService.getBoardById(id).subscribe((data) => {
      data.columns.sort((a, b) => a.position - b.position);
      data.columns.forEach((column) => {
        column.todos.sort((a, b) => a.position - b.position);
      });
      this.board = data;
    });
  }

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService,
    private boardColumnService: BoardColumnService,
    private todoService: TodoService,
    private dialog: MatDialog,
    private router: Router) {
  }

  dropColumn(event: CdkDragDrop<BoardColumnDto[], any>): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    const movedColdId = event.container.data[event.currentIndex]?.id
    const pervColId = event.container.data[event.currentIndex - 1]?.id
    const nextColId = event.container.data[event.currentIndex + 1]?.id

    this.boardColumnService
      .updateColumnPosition(movedColdId, pervColId, nextColId)
      .subscribe({
        next: () => console.log('Order updated successfully'),
        error: (err) => console.error('Failed to update order:', err),
      });

  }

  dropTask(event: CdkDragDrop<TodoDto[], any>): void {
    let newContainerId: string | undefined
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      newContainerId = event.container.id
    }

    const movedColdId = event.container.data[event.currentIndex]?.id
    const pervColId = event.container.data[event.currentIndex - 1]?.id
    const nextColId = event.container.data[event.currentIndex + 1]?.id

    this.todoService
      .updateTodoPosition(movedColdId, pervColId, nextColId, newContainerId)
      .subscribe({
        next: () => console.log('Order updated successfully'),
        error: (err) => console.error('Failed to update order:', err),
      });


  }

  addColumn($event: string, boardId: string) {
    this.boardColumnService.createColumn($event, boardId).subscribe({
      next: (b) => {
        this.board.columns.push(b);
      },
      error: (err) => console.error('Failed to add column:', err),
    });
  }

  addTodo($event: string, column: BoardColumnDto) {
    this.todoService.createTodo($event, column.id).subscribe({
      next: (t) => {
        column.todos.push(t)
      },
      error: (err) => console.error('Failed to add todo:', err),
    });
  }

  openDeleteColumnConfirmation(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteColumn(id);
      }
    });
  }

  deleteColumn(columnId: string) {
    this.boardColumnService.deleteColumn(columnId).subscribe({
      next: () => {
        this.board.columns = this.board.columns.filter((col) => col.id !== columnId);
      },
      error: (err) => console.error('Failed to delete column:', err),
    });
  }

  openDeleteBoardConfirmation(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteBoard(id);
      }
    });
  }

  deleteBoard(boardId: string) {
    this.boardService.deleteBoard(boardId).subscribe({
      next: () => {
        this.router.navigate(['/boards']);
      },
      error: (err) => console.error('Failed to delete board:', err),
    });
  }

  openTodoDetails(todo: any): void {
    const dialogRef = this.dialog.open(TodoDetailDialogComponent, {
      width: '800px',
      maxWidth: 'none',
      data: todo,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        todo.title = result.title;
        todo.description = result.description;
      }
    });
  }
  
}
