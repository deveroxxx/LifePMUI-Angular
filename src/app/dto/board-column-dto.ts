import type {TodoDto} from "./todo-dto";

export class BoardColumnDto {
    id: string;
    createdOn: Date;
    updatedOn: Date;
    name: string;
    position: number;
    todos: TodoDto[]

    constructor(
        id: string,
        createdOn: Date,
        updatedOn: Date,
        name: string,
        position: number,
        todos: TodoDto[]
    ) {
        this.id = id;
        this.createdOn = createdOn;
        this.updatedOn = updatedOn;
        this.name = name;
        this.position = position;
        this.todos = todos;
    }

    // Optional: Add methods if needed
    printSummary(): string {
        return `Column: ${this.name} (ID: ${this.id}, Position: ${this.position})`;
    }
}
