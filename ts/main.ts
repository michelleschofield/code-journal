interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  url: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

const $photoURL = document.querySelector('#photo-url');
const $photo = document.querySelector('img');
const $form = document.querySelector('form');

if (!$photoURL) throw new Error('$photoURL query failed');
if (!$photo) throw new Error('$photo query failed');
if (!$form) throw new Error('$form query failed');

$photoURL.addEventListener('input', (event: Event) => {
  const $eventTarget = event.target as HTMLInputElement;
  const url = $eventTarget.value;
  $photo.setAttribute('src', url);
});

$form.addEventListener('submit', (event: Event) => {
  event.preventDefault();

  if (!$form) return;
  const $formElements = $form.elements as FormElements;
  const title = $formElements.title.value;
  const url = $formElements.url.value;
  const notes = $formElements.notes.value;

  const entry: Entry = {
    title,
    url,
    notes,
    entryId: data.nextEntryId,
  };

  data.nextEntryId++;
  data.entries.push(entry);
});
