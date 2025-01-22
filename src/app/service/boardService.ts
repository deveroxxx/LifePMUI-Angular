import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {BoardDto} from '../dto/board-dto';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8080/api';
  }

  getBoards(): Observable<BoardDto[]> {
    return this.http.get<BoardDto[]>(`${this.baseUrl}/board/all`);
  }

  getBoardById(id: number): Observable<BoardDto> {
    return this.http.get<BoardDto>(`${this.baseUrl}/board/${id}`);
  }

  updateColumnPosition(movedItemId: string, previousItemId: string, nextItemId: string): Observable<void> {
    const payload = {
      movedItemId,
      previousItemId,
      nextItemId
    };
    return this.http.put<void>(`${this.baseUrl}/board-column/update-position`, payload);
  }

  updateTodoPosition(movedItemId: string, previousItemId: string, nextItemId: string, newColumnId?: string): Observable<void> {
    const payload = {
      movedItemId,
      previousItemId,
      nextItemId,
      newColumnId
    };

    return this.http.put<void>(`${this.baseUrl}/todo/update-position`, payload);
  }

  printNumber(id: number): any {
    console.log("Hello my lord: " + id)
  }
}
