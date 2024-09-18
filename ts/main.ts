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

const $photoURL = document.querySelector('#photo-url');
const $photo = document.querySelector('img');
const $form = document.querySelector('form');
const $list = document.querySelector('ul');
const views = document.querySelectorAll('[data-view]');
const $entriesLink = document.querySelector('a');
const $newEntryButton = document.querySelector('#new-entry');
const $noEntries = document.querySelector('#no-entries');

if (!$photoURL) throw new Error('$photoURL query failed');
if (!$photo) throw new Error('$photo query failed');
if (!$form) throw new Error('$form query failed');
if (!$list) throw new Error('$list query failed');
if (!$entriesLink) throw new Error('$entriesLink query failed');
if (!$newEntryButton) throw new Error('$newEntryButton');
if (!$noEntries) throw new Error('$noEntries query failed');

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

  data.nextEntryId++;
  data.entries.unshift(entry);
  writeData();

  $list.prepend(renderEntry(entry));

  $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  $form.reset();

  viewSwap('entries');
  checkNoEntries();
});

$entriesLink.addEventListener('click', () => {
  viewSwap('entries');
});

$newEntryButton.addEventListener('click', () => {
  viewSwap('entry-form');
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
  const $title = document.createElement('h3');
  const $notes = document.createElement('p');

  $row.className = 'row';
  $firstColumn.className = 'column-half';
  $secondColumn.className = 'column-half';

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
  $secondColumn.append($title, $notes);

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
