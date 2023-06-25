class Note{

    static count = 0;

    constructor(){
        Note.count ++;
        this.title = "note"+Note.count
        this.content = ""
    }

    get title(){
        return this.title;
    }

    save(note) {
        chrome.storage.local.set({ note2: note })
        console.log(note);
    }
}

export default Note;