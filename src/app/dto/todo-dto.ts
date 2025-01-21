import { TodoTagDto } from './todo-tag-dto';

export class TodoDto {
    id: string;
    title: string;
    description?: string;
    priority: string;
    todoType: string;
    archived: boolean;
    todoTags: TodoTagDto[];
    position: number;

    constructor(
        id: string,
        title: string,
        description: string | undefined,
        priority: string,
        todoType: string,
        archived: boolean,
        todoTags: TodoTagDto[],
        position: number
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.todoType = todoType;
        this.archived = archived;
        this.todoTags = todoTags;
        this.position = position;
    }
}
