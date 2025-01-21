import {Component} from '@angular/core';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {BoardService} from '../../service/boardService';

/**
 * @title Drag&Drop sorting
 */
@Component({
  selector: 'list.component',
  templateUrl: 'list.component.html',
  styleUrl: 'list.component.css',
  imports: [CdkDropList, CdkDrag],
})
export class CdkDragDropSortingExample {
  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker',
  ];
  constructor(private boardService: BoardService) {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    this.boardService.printNumber(10) // breakpoint here
  }
}
