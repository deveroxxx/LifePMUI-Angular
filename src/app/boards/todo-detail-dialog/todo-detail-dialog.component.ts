import {Component, Inject} from '@angular/core';
import {NgIf} from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatLabel} from '@angular/material/form-field';
import { QuillModule } from 'ngx-quill';
import { TodoService } from '../../service/todo.service';

export interface TodoData {
  id: string,
  title: string;
  description: string;
}

@Component({
  selector: 'app-todo-detail-dialog',
  templateUrl: './todo-detail-dialog.component.html',
  styleUrls: ['./todo-detail-dialog.component.css'],
  imports: [
    FormsModule,
    MatInput,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatLabel,
    QuillModule,
    NgIf
  ]
})
export class TodoDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TodoDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoData,
    private todoService: TodoService
  ) {}
  isEditing: boolean = false;

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    console.log( this.data.description);
    this.todoService.updateTodo(this.data.id, { description: this.data.description }).subscribe({
      next: (b) => {
       
      },
      error: (err) => console.error('Failed to edit description:', err),
    });
    //this.dialogRef.close();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }
}
