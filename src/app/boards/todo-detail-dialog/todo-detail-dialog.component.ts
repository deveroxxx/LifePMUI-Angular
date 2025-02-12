import {Component, Inject} from '@angular/core';
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

export interface TodoData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-todo-detail-dialog',
  templateUrl: './todo-detail-dialog.component.html',
  styleUrls: ['./todo-detail-dialog.component.scss'],
  imports: [
    FormsModule,
    MatInput,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatLabel
  ]
})
export class TodoDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TodoDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
