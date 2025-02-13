import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {BoardDto} from '../dto/board-dto';
import {BoardColumnDto} from '../dto/board-column-dto';
import {TodoDto} from '../dto/todo-dto';
import {baseApiUrl} from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  constructor(private http: HttpClient) { }

  init(){
    this.loadBoards();
  }

  addBoard(name: string) {
    this.http.post<BoardDto>(`${baseApiUrl}/boards`, { name }).subscribe({
      next: (b) => {
        const updatedBoards = [...this.boardsSubject.value, b];
        this.boardsSubject.next(updatedBoards);
      },
      error: (err) => console.error('Failed to add board:', err),
    });
  }

  private boardsSubject = new BehaviorSubject<BoardDto[]>([]);
  boards$ = this.boardsSubject.asObservable();

  private loadBoards() {
    this.http.get<BoardDto[]>(`${baseApiUrl}/boards`).subscribe(boards => {
      this.boardsSubject.next(boards);
    });
  }

  getBoardById(id: number): Observable<BoardDto> {
    return this.http.get<BoardDto>(`${baseApiUrl}/boards/${id}`);
  }


  // editBoard(id: number??)

  deleteBoard(boardId: string): Observable<void> {
    return this.http.delete<void>(`${baseApiUrl}/boards/${boardId}`).pipe(
      tap(() => {
        const updatedBoards = this.boardsSubject.value.filter(b => b.id !== boardId);
        this.boardsSubject.next(updatedBoards);
      })
    );
  }

  printNumber(id: number): any {
    console.log("Hello my lord: " + id)
  }
}
