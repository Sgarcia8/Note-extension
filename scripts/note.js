class Note{

    static count = 0;

    constructor(){
        Note.count ++;
        this._title = "N "+Note.count
        this._content = ""
        this._id = "note"+Note.count
    }

    get title(){
        return this._title;
    }

    set title(title){
        this._title = title
    }

    get content(){
        return this._content;
    }

    get id(){
        return this._id;
    }
}

export default Note;