import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { QuillModule } from 'ngx-quill';
import { TodoService } from '../../service/todo.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QuillEditorWrapperComponent } from '../../shared/quill-editor-wrapper/quill-editor-wrapper.component';
import { TodoCommentsComponent } from '../todo-comments/todo-comments.component';
import { Observable } from 'rxjs';

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
    QuillEditorWrapperComponent,
    TodoCommentsComponent,
  ]
})
export class TodoDetailDialogComponent implements OnInit, OnChanges {
  constructor(
    public dialogRef: MatDialogRef<TodoDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoData,
    private sanitizer: DomSanitizer,
    private todoService: TodoService
  ) {}


  saveTodo = (dataId: string, value: string): Observable<any> => {
    return this.todoService.updateTodo(dataId, { description: value });
  };

  ngOnInit(): void {
  }

  ngOnChanges(): void {
  }




}