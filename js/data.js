"use strict";
const data = readData();
function writeData() {
    const dataJSON = JSON.stringify(data);
    localStorage.setItem('entriesData', dataJSON);
}
function readData() {
    const dataJSON = localStorage.getItem('entriesData');
    const defaultData = {
        view: 'entries',
        entries: [],
        editing: null,
        nextEntryId: 1,
    };
    return dataJSON ? JSON.parse(dataJSON) : defaultData;
}
