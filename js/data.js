"use strict";
const data = readData();
function writeData() {
    const dataJSON = JSON.stringify(data);
    localStorage.setItem('entriesData', dataJSON);
}
function readData() {
    const dataJSON = localStorage.getItem('entriesData');
    if (!dataJSON) {
        const defaultData = {
            view: 'entry-form',
            entries: [],
            editing: null,
            nextEntryId: 1,
        };
        return defaultData;
    }
    return JSON.parse(dataJSON);
}
