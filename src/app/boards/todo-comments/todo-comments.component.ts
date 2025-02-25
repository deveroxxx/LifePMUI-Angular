import { Component, Input, OnInit } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { TodoService } from '../../service/todo.service';
import { QuillEditorWrapperComponent } from '../../shared/quill-editor-wrapper/quill-editor-wrapper.component';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

interface Comment {
  id: string;
  parentId: string;
  userName: string;
  content: string;
  owned: boolean;
}

@Component({
  selector: 'app-comments',
  templateUrl: './todo-comments.component.html',
  styleUrls: ['./todo-comments.component.css'],
  imports: [
    FormsModule,
    QuillEditorWrapperComponent,
    NgForOf,]
})
export class TodoCommentsComponent implements OnInit {
  @Input() todoId!: string;
  comments: Comment[] = [];
  newCommentContent: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    // Assume that getCommentsForTodo returns an Observable<Comment[]>
    this.todoService.getCommentsForTodo(this.todoId).subscribe((data: Comment[]) => {
      this.comments = data;
    });
  }

  saveEditComment = (todoId: string, value: string): Observable<any> => {
    return this.todoService.editComment(todoId, { text: value });
  };

  saveNewComment = (todoId: string, value: string): Observable<any> => {
    return this.todoService.newComment(todoId, { text: value }).pipe(
      tap(() => {
        this.loadComments(); // Reload comments after adding a new one
        this.newCommentContent = ''; // Clear input after saving
      })
    );
  };
}