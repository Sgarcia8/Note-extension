class Note{

    static count = 0;

    constructor(){
        Note.count ++;
        this._title = "note"+Note.count
        this._content = ""
    }

    get title(){
        return this._title;
    }

    get content(){
        return this._content;
    }

    save(note) {
        chrome.storage.local.set({ note2: note })
        console.log(note);
    }
}

export default Note;