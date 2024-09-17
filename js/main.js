'use strict';
const $photoURL = document.querySelector('#photo-url');
const $photo = document.querySelector('img');
const $form = document.querySelector('form');
if (!$photoURL) throw new Error('$photoURL query failed');
if (!$photo) throw new Error('$photo query failed');
if (!$form) throw new Error('$form query failed');
$photoURL.addEventListener('input', (event) => {
  const $eventTarget = event.target;
  const url = $eventTarget.value;
  $photo.setAttribute('src', url);
});
$form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!$form) return;
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
  data.nextEntryId++;
  data.entries.push(entry);
  $photo.setAttribute('src', 'images/placeholder-image-square.jpg');
  $form.reset();
});
