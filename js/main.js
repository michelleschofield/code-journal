"use strict";
const $formTitle = document.querySelector('#title');
const $formNotes = document.querySelector('#notes');
const $photoURL = document.querySelector('#photo-url');
const $formPhoto = document.querySelector('img');
const $newOrEditing = document.querySelector('#new-editing');
const $form = document.querySelector('form');
const $list = document.querySelector('ul');
const views = document.querySelectorAll('[data-view]');
const $entriesLink = document.querySelector('#entries-link');
const $newEntryButton = document.querySelector('#new-entry');
const $noEntries = document.querySelector('#no-entries');
const $deleteButton = document.querySelector('#delete1');
const $confirmationScreen = document.querySelector('dialog');
const $confirmDelete = document.querySelector('#delete2');
const $cancelDelete = document.querySelector('#cancel');
if (!$formTitle)
    throw new Error('$formTitle query failed');
if (!$formNotes)
    throw new Error('$formNotes query failed');
if (!$photoURL)
    throw new Error('$photoURL query failed');
if (!$formPhoto)
    throw new Error('$formPhoto query failed');
if (!$newOrEditing)
    throw new Error('$newOrEditing query failed');
if (!$form)
    throw new Error('$form query failed');
if (!$list)
    throw new Error('$list query failed');
if (!$entriesLink)
    throw new Error('$entriesLink query failed');
if (!$newEntryButton)
    throw new Error('$newEntryButton');
if (!$noEntries)
    throw new Error('$noEntries query failed');
if (!$deleteButton)
    throw new Error('$deleteButton query failed');
if (!$confirmationScreen)
    throw new Error('$confirmationScreen query failed');
if (!$confirmDelete)
    throw new Error('$confirmDelete query failed');
if (!$cancelDelete)
    throw new Error('$cancelDelete query failed');
document.addEventListener('DOMContentLoaded', () => {
    const entries = data.entries;
    for (let i = 0; i < entries.length; i++) {
        const $listItem = renderEntry(entries[i]);
        $list.appendChild($listItem);
    }
    viewSwap(data.view);
    checkNoEntries();
});
$photoURL.addEventListener('input', (event) => {
    const $eventTarget = event.target;
    const url = $eventTarget.value;
    if (isValid(url)) {
        $formPhoto.setAttribute('src', url);
    }
    else {
        $formPhoto.setAttribute('src', 'images/placeholder-image-square.jpg');
    }
});
$formPhoto.addEventListener('error', () => {
    $formPhoto.setAttribute('src', 'images/placeholder-image-square.jpg');
});
$form.addEventListener('submit', (event) => {
    event.preventDefault();
    const $formElements = $form.elements;
    const title = $formElements.title.value;
    const url = $formElements.url.value;
    const notes = $formElements.notes.value;
    const entryId = data.nextEntryId;
    const entry = {
        title,
        url,
        notes,
        entryId,
    };
    $formPhoto.setAttribute('src', 'images/placeholder-image-square.jpg');
    $form.reset();
    if (data.editing) {
        entry.entryId = data.editing.entryId;
        const index = data.entries.findIndex((e) => e.entryId === data.editing?.entryId);
        data.entries[index] = entry;
        const $changedEntry = renderEntry(entry);
        const $oldEntry = document.querySelector(`[data-entry-id = '${entry.entryId}']`);
        if (!$oldEntry)
            throw new Error('$oldEntry query failed');
        $list.insertBefore($changedEntry, $oldEntry);
        $oldEntry.remove();
        data.editing = null;
    }
    else {
        $list.prepend(renderEntry(entry));
        data.nextEntryId++;
        data.entries.unshift(entry);
    }
    writeData();
    checkNoEntries();
    viewSwap('entries');
});
$entriesLink.addEventListener('click', () => {
    viewSwap('entries');
});
$newEntryButton.addEventListener('click', () => {
    viewSwap('entry-form');
    $form.reset();
    data.editing = null;
    $newOrEditing.textContent = 'New Entry';
    $formPhoto.setAttribute('src', 'images/placeholder-image-square.jpg');
    $deleteButton.className = 'delete hidden';
});
$list.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    if (!$eventTarget.className.includes('edit-button'))
        return;
    viewSwap('entry-form');
    const $li = $eventTarget.closest('li');
    const idStr = $li.dataset.entryId;
    const id = +idStr;
    const entry = data.entries.find((entry) => entry.entryId === id);
    if (!entry)
        return;
    data.editing = entry;
    $formPhoto.setAttribute('src', entry.url);
    $photoURL.value = entry.url;
    $formTitle.value = entry.title;
    $formNotes.value = entry.notes;
    $newOrEditing.textContent = 'Edit Entry';
    $deleteButton.className = 'delete';
});
$deleteButton.addEventListener('click', () => {
    $confirmationScreen.showModal();
});
$cancelDelete.addEventListener('click', () => {
    $confirmationScreen.close();
});
$confirmDelete.addEventListener('click', () => {
    if (!data.editing)
        throw new Error('attempted to delete while not editing');
    const index = data.entries.findIndex((e) => e.entryId === data.editing?.entryId);
    data.entries.splice(index, 1);
    const $deletedEntry = document.querySelector(`[data-entry-id = '${data.editing.entryId}']`);
    if (!$deletedEntry)
        throw new Error('$deletedEntry query failed');
    $deletedEntry.remove();
    checkNoEntries();
    data.editing = null;
    $confirmationScreen.close();
    writeData();
    viewSwap('entries');
});
function isValid(urlToCheck) {
    const image = new Image();
    image.src = urlToCheck;
    if (image.width === 0) {
        return false;
    }
    else {
        return true;
    }
}
function renderEntry(entry) {
    const $li = document.createElement('li');
    const $row = document.createElement('div');
    const $firstColumn = document.createElement('div');
    const $img = document.createElement('img');
    const $secondColumn = document.createElement('div');
    const $spacingDiv = document.createElement('div');
    const $editButton = document.createElement('button');
    const $title = document.createElement('h3');
    const $notes = document.createElement('p');
    $li.setAttribute('data-entry-id', `${entry.entryId}`);
    $row.className = 'row';
    $firstColumn.className = 'column-half';
    $secondColumn.className = 'column-half';
    $spacingDiv.className = 'space-between';
    $editButton.className = 'fa-solid fa-pencil edit-button';
    const url = entry.url;
    if (isValid(url)) {
        $img.setAttribute('src', url);
    }
    else {
        $img.setAttribute('src', 'images/placeholder-image-square.jpg');
    }
    $title.textContent = entry.title;
    $notes.textContent = entry.notes;
    $li.appendChild($row);
    $row.append($firstColumn, $secondColumn);
    $firstColumn.appendChild($img);
    $secondColumn.append($spacingDiv, $notes);
    $spacingDiv.append($title, $editButton);
    return $li;
}
function viewSwap(view) {
    for (let i = 0; i < views.length; i++) {
        const $view = views[i];
        $view.className = $view.dataset.view === view ? '' : 'hidden';
    }
    data.view = view;
    writeData();
}
function checkNoEntries() {
    if (!$noEntries || !$list)
        return;
    const noEntriesClass = $list.children.length
        ? 'column-full text-center hidden'
        : 'column-full text-center';
    $noEntries.className = noEntriesClass;
}
