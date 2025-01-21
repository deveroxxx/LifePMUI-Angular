import { BoardColumnDto } from './board-column-dto';

export class BoardDto {
    id: string;
    name: string;
    description: string;
    position: number;
    columns: BoardColumnDto[];

    constructor(id: string, name: string, description: string, position: number, columns: BoardColumnDto[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.position = position;
        this.columns = columns;
    }

    // Optional methods
    printSummary(): string {
        return `Board: ${this.name} (${this.id})`;
    }
}
