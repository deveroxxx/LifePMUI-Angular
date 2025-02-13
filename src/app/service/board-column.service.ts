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
export class BoardColumnService {

  constructor(private http: HttpClient) { }





  createColumn(name: string, boardId: string) {
    return this.http.post<BoardColumnDto>(`${baseApiUrl}/board-columns`, {name, boardId});
  }

  // get columns for board

  // get one column

  // edit column

  deleteColumn(columnId: string) {
    return this.http.delete<void>(`${baseApiUrl}/board-columns/${columnId}`);
  }


  updateColumnPosition(movedItemId: string, previousItemId: string, nextItemId: string): Observable<void> {
    const payload = {
      previousItemId,
      nextItemId
    };
    return this.http.put<void>(`${baseApiUrl}/board-columns/${movedItemId}/reorder`, payload);
  }

}
