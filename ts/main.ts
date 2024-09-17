const $photoURL = document.querySelector('#photo-url');
const $photo = document.querySelector('img');

if (!$photoURL) throw new Error('$photoURL query failed');
if (!$photo) throw new Error('$photo query failed');

$photoURL.addEventListener('input', (event: Event) => {
  const $eventTarget = event.target as HTMLInputElement;
  const url = $eventTarget.value;
  $photo.setAttribute('src', url);
});
