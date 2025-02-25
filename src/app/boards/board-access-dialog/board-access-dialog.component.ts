import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { BoardService } from '../../service/board.service';
import { Observable } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { BoardUser } from '../../dto/board-dto';
import { NgForOf, NgIf } from '@angular/common';
import { MatOption } from '@angular/material/core';

export interface BoardAccessData {
  id: number | string;
}

@Component({
  selector: 'app-board-access-dialog',
  templateUrl: './board-access-dialog.component.html',
  styleUrls: ['./board-access-dialog.component.css'],
  imports: [
    FormsModule,
    MatInput,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatIcon,
    MatIconButton,
    MatSelectModule,
    NgForOf,
    NgIf,
  ]
})
export class BoardAccessDialogComponent implements OnInit {
  boardUsers: BoardUser[] = [];
  newUserName: string = '';
  permission: string = 'EDITOR';

  	

  permissionMapping: { [key: string]: string } = {
    OWNER: 'Owner',
    EDITOR: 'Editor',
    VIEWER: 'Viewer'
  };

  permissionOptions: string[] = ['OWNER', 'EDITOR', 'VIEWER'];

  constructor(
    public dialogRef: MatDialogRef<BoardAccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoardAccessData,
    private boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.loadBoardUsers();
  }

  loadBoardUsers(): void {
    this.boardService.getBoardUsers(this.data.id).subscribe(users => {
      this.boardUsers = users;
    });
  }

  inviteUser(): void {
    if (this.newUserName.trim()) {
      this.boardService.addBoardUser(this.data.id, this.newUserName.trim(), this.permission)
        .subscribe(() => {
          this.newUserName = '';
          this.loadBoardUsers();
        });
    }
  }

  removeUser(userName: string): void {
    this.boardService.removeBoardUser(this.data.id, userName)
      .subscribe(() => {
        this.loadBoardUsers();
      });
  }
}