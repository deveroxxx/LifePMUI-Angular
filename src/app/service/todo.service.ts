import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TodoDto } from '../dto/todo-dto';
import { baseApiUrl } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class TodoService {

  private todosSubject = new BehaviorSubject<TodoDto[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  createTodo(name: string, columnId: string) {
    return this.http.post<TodoDto>(`${baseApiUrl}/todos`, {name, columnId});
  }

  // get all todos for column

  // get one todo

  updateTodo(id: string, patchData: any): Observable<TodoDto> {
    console.log("updatecall")
    return this.http.patch<TodoDto>(`${baseApiUrl}/todos/${id}`, { description: patchData.description }).pipe(
      tap(updatedTodo => {
        const updatedTodos = this.todosSubject.value.map(todo => 
          todo.id === id ? updatedTodo : todo
        );
        this.todosSubject.next(updatedTodos);
      })
    );
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${baseApiUrl}/todos/${id}`).pipe(
      tap(() => {
        const updatedTodos = this.todosSubject.value.filter(todo => todo.id !== id);
        this.todosSubject.next(updatedTodos);
      })
    );
  }

  updateTodoPosition(movedItemId: string, previousItemId: string, nextItemId: string, newColumnId?: string): Observable<void> {
    const payload = {
      movedItemId,
      previousItemId,
      nextItemId,
      newColumnId
    };

    return this.http.put<void>(`${baseApiUrl}/todos/${movedItemId}/reorder`, payload);
  }

  uploadImage(todoId: string, file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ imageUrl: string }>(`${baseApiUrl}/todos/${todoId}/upload-image`, formData);
  }
}
