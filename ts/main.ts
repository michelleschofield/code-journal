interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  url: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

interface View extends HTMLDivElement {
  dataset: {
    view: string;
  };
}

interface LI extends HTMLLIElement {
  dataset: {
    entryId: string;
  };
}

const $formTitle = document.querySelector('#title') as HTMLInputElement;
const $formNotes = document.querySelector('#notes') as HTMLInputElement;
const $photoURL = document.querySelector('#photo-url') as HTMLInputElement;
const $photo = document.querySelector('img') as HTMLImageElement;
const $newOrEditing = document.querySelector(
  '#new-editing',
) as HTMLHeadingElement;
const $form = document.querySelector('form') as HTMLFormElement;
const $list = document.querySelector('ul') as HTMLUListElement;
const views = document.querySelectorAll('[data-view]');
const $entriesLink = document.querySelector(
  '#entries-link',
) as HTMLAnchorElement;
const $newEntryButton = document.querySelector(
  '#new-entry',
) as HTMLButtonElement;
const $noEntries = document.querySelector('#no-entries') as HTMLDivElement;
const $deleteButton = document.querySelector('#delete1') as HTMLButtonElement;
const $confirmationScreen = document.querySelector(
  'dialog',
) as HTMLDialogElement;
const $confirmDelete = document.querySelector('#delete2');
const $cancelDelete = document.querySelector('#cancel');

if (!$formTitle) throw new Error('$formTitle query failed');
if (!$formNotes) throw new Error('$formNotes query failed');
if (!$photoURL) throw new Error('$photoURL query failed');
if (!$photo) throw new Error('$photo query failed');
if (!$newOrEditing) throw new Error('$newOrEditing query failed');
if (!$form) throw new Error('$form query failed');
if (!$list) throw new Error('$list query failed');
if (!$entriesLink) throw new Error('$entriesLink query failed');
if (!$newEntryButton) throw new Error('$newEntryButton');
if (!$noEntries) throw new Error('$noEntries query failed');
if (!$deleteButton) throw new Error('$deleteButton query failed');
if (!$confirmationScreen) throw new Error('$confirmationScreen query failed');
if (!$confirmDelete) throw new Error('$confirmDelete query failed');
if (!$cancelDelete) throw new Error('$cancelDelete query failed');

document.addEventListener('DOMContentLoaded', () => {
  const entries = data.entries;
  for (let i = 0; i < entries.length; i++) {
    const $listItem = renderEntry(entries[i]);
    $list.appendChild($listItem);
  }
  const view = data.view;
  viewSwap(view);
  checkNoEntries();
});

$photoURL.addEventListener('input', (event: Event) => {
  const $eventTarget = event.target as HTMLInputElement;
  const url = $eventTarget.value;

  if (isValid(url)) {
    $photo.setAttribute('src', url);
  } else {
    $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  }
});

$photo.addEventListener('error', () => {
  $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
});

$form.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  if (!$form) return;

  const $formElements = $form.elements as FormElements;

  const title = $formElements.title.value;
  const url = $formElements.url.value;
  const notes = $formElements.notes.value;
  const entryId = data.nextEntryId;

  const entry: Entry = {
    title,
    url,
    notes,
    entryId,
  };

  $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  $form.reset();

  if (data.editing) {
    entry.entryId = data.editing.entryId;

    const index = data.entries.findIndex(
      (e) => e.entryId === data.editing?.entryId,
    );

    data.entries[index] = entry;

    const $changedEntry = renderEntry(entry);
    const $oldEntry = document.querySelector(
      `[data-entry-id = '${entry.entryId}']`,
    );
    if (!$oldEntry) throw new Error('$oldEntry query failed');

    $list.insertBefore($changedEntry, $oldEntry);
    $oldEntry.remove();

    data.editing = null;
  } else {
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
  data.editing = null;
  $newOrEditing.textContent = 'New Entry';
  $formTitle.value = '';
  $formNotes.value = '';
  $photoURL.value = '';
  $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  $deleteButton.className = 'delete hidden';
});

$list.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;

  if (!$eventTarget.className.includes('edit-button')) return;

  viewSwap('entry-form');

  const $li = $eventTarget.closest('li') as LI;
  const idStr = $li.dataset.entryId;
  const id = +idStr;
  const entry = data.entries.find((entry) => entry.entryId === id);

  if (!entry) return;

  data.editing = entry;

  $photo.setAttribute('src', entry.url);
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

function isValid(urlToCheck: string): boolean {
  const image = new Image();
  image.src = urlToCheck;
  if (image.width === 0) {
    return false;
  } else {
    return true;
  }
}

function renderEntry(entry: Entry): HTMLLIElement {
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
  } else {
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

function viewSwap(view: string): void {
  for (let i = 0; i < views.length; i++) {
    const $view = views[i] as View;
    if ($view.dataset.view === view) {
      $view.className = '';
    } else {
      $view.className = 'hidden';
    }
  }

  data.view = view;
  writeData();
}

function checkNoEntries(): void {
  if ($list?.children.length) {
    if ($noEntries) {
      $noEntries.className = 'column-full text-center hidden';
    }
  } else if ($noEntries) {
    $noEntries.className = 'column-full text-center';
  }
}
