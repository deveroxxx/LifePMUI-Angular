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
    this.baseUrl = 'http://localhost:8080/api/board';
  }

  getBoards(): Observable<BoardDto[]> {
    return this.http.get<BoardDto[]>(`${this.baseUrl}/all`);
  }

  getBoardById(id: number): Observable<BoardDto> {
    return this.http.get<BoardDto>(`${this.baseUrl}/${id}`);
  }

  printNumber(id: number): any {
    console.log("Hello my lord: " + id)
  }
}
