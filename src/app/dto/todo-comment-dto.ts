export class TodoCommentDto {

    constructor(
        public id: string,
        public  parentId: string,
        public  userName: string,
        public  content: string,
        public  owned: boolean,
    ) {}
}
