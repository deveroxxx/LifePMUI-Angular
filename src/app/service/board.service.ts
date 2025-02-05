import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BoardDto} from '../dto/board-dto';
import {BoardColumnDto} from '../dto/board-column-dto';
import {TodoDto} from '../dto/todo-dto';
import {baseApiUrl} from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  constructor(private http: HttpClient) {}

  getBoards(): Observable<BoardDto[]> {
    return this.http.get<BoardDto[]>(`${baseApiUrl}/board/all`);
  }

  getBoardById(id: number): Observable<BoardDto> {
    return this.http.get<BoardDto>(`${baseApiUrl}/board/${id}`);
  }

  updateColumnPosition(movedItemId: string, previousItemId: string, nextItemId: string): Observable<void> {
    const payload = {
      movedItemId,
      previousItemId,
      nextItemId
    };
    return this.http.put<void>(`${baseApiUrl}/board-column/update-position`, payload);
  }

  updateTodoPosition(movedItemId: string, previousItemId: string, nextItemId: string, newColumnId?: string): Observable<void> {
    const payload = {
      movedItemId,
      previousItemId,
      nextItemId,
      newColumnId
    };

    return this.http.put<void>(`${baseApiUrl}/todo/update-position`, payload);
  }

  createColumn(name: string, boardId: string) {
    return this.http.post<BoardColumnDto>(`${baseApiUrl}/board-column/create`, {name, boardId});
  }

  createTodo(name: string, columnId: string) {
    return this.http.post<TodoDto>(`${baseApiUrl}/todo/create`, {name, columnId});
  }

  deleteColumn(boardId: string) {
    return this.http.delete<void>(`${baseApiUrl}/board-column/delete/${boardId}`);
  }

  printNumber(id: number): any {
    console.log("Hello my lord: " + id)
  }
}
