/*-----------------------------------------------------------------*/
/* ------------------- PERSISTENCIA DE NOTAS --------------------- */
/*-----------------------------------------------------------------*/

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
                resolve(data['notes']);
            } else {
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
                resolve(data['notes'][id]);
            } else {
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

/*-----------------------------------------------------------------*/
/* ---------------- PERSISTENCIA DE INFORMACIÓN ------------------ */ 
/*-----------------------------------------------------------------*/

// GUARDA LA POSICIÓN (VISTA Y PESTAÑA) DEL USUSARIO
export async function savePosition(info) {
    await chrome.storage.local.set({ 'info': info });
}

// RECUPERA LA ULTIMA POSICIÓN (VISTA Y PESTAÑA) EN LA QUE ESTUVO EL USUARIO
export function getInfo() {
    return new Promise((resolve) => {
        chrome.storage.local.get('info', (data) => {
            if ('info' in data  && data['info'] && Object.keys(data['info']).length > 0) {
                //console.log('Información encontrada (GetAllInfo): ', data, data['info']);
                resolve(data['info']);
            } else {
                console.log('No hay información (GetAllInfo): ');
                resolve(null);
            }
        });
    });
}

/*------------------------------------------------------------------------------------------------*/

//ELIMINAR TODDO EL STORAGE
export async function deleteAll() {
    try {
        await chrome.storage.local.clear();
    } catch (error) {
        console.log(error);
    }
}

//TRAE TODO LO QUE HAY EN EL STORAGE
export async function getAll() {
    return new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => {
            resolve(result);
        });
    });
}