// GUARDA UNA NOTA
export async function saveNote(note, notes) {
    let data = {};

    if (notes) {
        data = notes;
        data[note._id] = note;
    } else {
        data = {};
        data[note._id] = note;
    }
    await chrome.storage.local.set({ 'notes': data });
}

// RECUPERA TODAS LAS NOTAS
export function getAllNotes() {
    return new Promise((resolve) => {
        chrome.storage.local.get('notes', (data) => {
            if ('notes' in data  && data['notes'] && Object.keys(data['notes']).length > 0) {
                console.log('Notas encontradas (GetAll): ', data, data['notes']);
                resolve(data['notes']);
            } else {
                console.log('No hay notas (GetAll): ');
                resolve(null);
            }
        });
    });
}

// RECUPERAR UNA NOTA POR SU ID
export function getNoteById(id) {
    return new Promise((resolve) => {
        chrome.storage.local.get('notes', (data) => {
            if (id in data['notes']) {
                console.log('Nota encontrada (GetById): ',data['notes'][id])
                resolve(data['notes'][id]);
            } else {
                console.log('Nota NO encontrada (GetById)')
                resolve(null);
            }
        });
    });
}

// ELIMINAR UNA NOTA POR SU ID
export function deleteNote(id) {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, async (result) => {
            if ('notes' in result) {
                let notes = result.notes;
                if (id in notes) {
                    delete notes[id];
                    await chrome.storage.local.set({ 'notes': notes }).then(() => {
                        console.log('Nota eliminada deleteNote');
                        resolve(true);
                    })
                } else {
                    console.log('Error deletNote no id in notes');
                    resolve(false);
                }
            } else {
                console.log('Error deletNote no notes in result');
                resolve(false);
            }
        });
    });
}


//ELIMINAR TODDO EL STORAGE
export async function deleteAll() {
    try {
        await chrome.storage.local.clear();
    } catch (error) {
        console.log(error);
    }
}