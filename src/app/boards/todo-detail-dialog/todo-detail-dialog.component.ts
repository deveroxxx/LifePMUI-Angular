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
import Quill from 'quill';

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
export class TodoDetailDialogComponent implements OnInit, OnChanges {
  constructor(
    public dialogRef: MatDialogRef<TodoDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoData,
    private sanitizer: DomSanitizer,
    private todoService: TodoService
  ) {}

  isEditing: boolean = false;
  quillEditor!: Quill;

  private _sanitizedDescription: SafeHtml = 'Click to edit description...';


  get sanitizedDescription(): SafeHtml {
    return this._sanitizedDescription;
  }

  ngOnInit(): void {
    this._sanitizedDescription = this.sanitizeDescription();
  }

  ngOnChanges(): void {
    this._sanitizedDescription = this.sanitizeDescription();
  }

  private sanitizeDescription() {
    return this.sanitizer.bypassSecurityTrustHtml(
      this.data.description || 'Click to edit description...'
    );
  }

  onEditorCreated(quill: Quill) {
    this.quillEditor = quill;



    // image button
    const toolbar:any = this.quillEditor.getModule('toolbar');
    if (toolbar) {
      toolbar.addHandler('image', this.imageHandler.bind(this));
    }
    setTimeout(() => {
      this.quillEditor.focus();
      const length = this.quillEditor.getLength();
      this.quillEditor.setSelection(length, 0);
    });
  }


  async imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();


    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const range = this.quillEditor.getSelection();
        this.todoService.uploadImage(this.data.id, file).subscribe({
          next: response => {
            console.log(response)
              if (response?.url) {
                  this.quillEditor.insertEmbed(range?.index || 0, 'image', response.url, 'user');
              }
          },
          error: error => console.error('Image upload failed', error)
      });
      }
    };
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.todoService.updateTodo(this.data.id, { description: this.data.description }).subscribe({
      next: (b) => {
      },
      error: (err) => console.error('Failed to edit description:', err),
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }
}