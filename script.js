'use strict';

const dialog = document.getElementById('viewer');
const viewerTitle = document.getElementById('viewer-title');
const viewerContent = document.getElementById('viewer-content');
let galleryIndex = null;
let currentGallery = null;
let previousFocus = null;

function openViewer(title, content) {
  previousFocus = document.activeElement;
  viewerTitle.textContent = title;
  viewerContent.replaceChildren(content);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
  document.querySelector('.close-button').focus();
  document.querySelectorAll('video').forEach(video => video.pause());
}

function openImage(path, title) {
  const img = new Image();
  img.src = path;
  img.alt = title;
  img.className = 'full-image';
  openViewer(title, img);
}

document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => openImage(button.dataset.image, button.dataset.title));
});

const postTitles = { brokuly: 'Brokuły na śniadanie? / copywriting', koktajl: 'Wiśniowy rytuał / copywriting', glod: 'To nie zawsze kwestia apetytu / copywriting', oddech: 'ODDECH / opis koncepcyjny', 'post1-caption': 'Jesz śniadanie, a za godzinę znowu czujesz głód? / opis posta', 'post2-caption': 'Lato się kończy. Te przepisy zostają / opis posta' };
document.querySelectorAll('[data-post]').forEach(button => {
  button.addEventListener('click', () => {
    const template = document.getElementById('post-' + button.dataset.post);
    if (template) openViewer(postTitles[button.dataset.post], template.content.cloneNode(true));
  });
});

function renderGallery() {
  const gallery = currentGallery;
  const container = document.createElement('div');
  const track = document.createElement('div');
  track.className = 'gallery-track';
  const img = new Image();
  img.src = gallery.image(galleryIndex + 1);
  img.alt = gallery.alt(galleryIndex + 1);
  img.className = 'gallery-image';
  track.append(img);
  track.addEventListener('touchstart', handleSwipeStart, { passive: true });
  track.addEventListener('touchend', handleSwipeEnd, { passive: true });
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  const prev = document.createElement('button');
  prev.textContent = '←';
  prev.setAttribute('aria-label', 'Poprzedni slajd');
  prev.disabled = galleryIndex === 0;
  prev.addEventListener('click', () => stepGallery(-1));
  const status = document.createElement('span');
  status.textContent = String(galleryIndex + 1).padStart(2, '0') + ' / ' + String(gallery.count).padStart(2, '0');
  status.setAttribute('aria-live', 'polite');
  const next = document.createElement('button');
  next.textContent = '→';
  next.setAttribute('aria-label', 'Następny slajd');
  next.disabled = galleryIndex === gallery.count - 1;
  next.addEventListener('click', () => stepGallery(1));
  controls.append(prev, status, next);
  if (gallery.count > 1) {
    const dots = document.createElement('div');
    dots.className = 'gallery-dots';
    for (let i = 0; i < gallery.count; i++) {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Przejdź do slajdu ' + (i + 1));
      if (i === galleryIndex) dot.setAttribute('aria-current', 'true');
      dot.addEventListener('click', () => stepGallery(i - galleryIndex));
      dots.append(dot);
    }
    container.append(dots);
  }
  const note = document.createElement('p');
  note.className = 'gallery-caption';
  note.textContent = gallery.caption;
  container.append(track, controls, note);
  return container;
}

let swipeStartX = null;
function handleSwipeStart(event) { swipeStartX = event.changedTouches[0].clientX; }
function handleSwipeEnd(event) {
  if (swipeStartX === null) return;
  const delta = event.changedTouches[0].clientX - swipeStartX;
  swipeStartX = null;
  if (Math.abs(delta) < 40) return;
  stepGallery(delta < 0 ? 1 : -1);
}

function stepGallery(direction) {
  if (galleryIndex === null || !currentGallery) return;
  const target = galleryIndex + direction;
  if (target < 0 || target > currentGallery.count - 1) return;
  galleryIndex = target;
  viewerContent.replaceChildren(renderGallery());
  const btn = viewerContent.querySelector(direction > 0 ? '.gallery-controls button:last-child' : '.gallery-controls button:first-child');
  if (btn && !btn.disabled) btn.focus();
  else viewerContent.querySelector('.gallery-controls button:not(:disabled)')?.focus();
}

function openGallery(title, config) {
  currentGallery = config;
  galleryIndex = 0;
  openViewer(title, renderGallery());
}

document.querySelector('[data-pitch]').addEventListener('click', () => {
  openGallery('REWEAR / prezentacja inwestorska', {
    count: 11,
    image: index => 'assets/rewear/pitch/page-' + String(index).padStart(2, '0') + '.jpg',
    alt: index => 'REWEAR - wybrany slajd ' + index + ' z 11',
    caption: 'Wybrane slajdy z prezentacji inwestorskiej REWEAR. Możesz używać strzałek na klawiaturze.'
  });
});

const postCarousels = {
  post1: {
    count: 8,
    image: index => 'assets/beata/posts/post1/' + String(index).padStart(2, '0') + '.jpg',
    alt: index => 'Beata Kotecka - slajd ' + index + ' z 8, post „Jesz śniadanie, a za godzinę znowu czujesz głód?”',
    caption: 'Prawdziwa karuzela opublikowana na Instagramie. Przewijaj strzałkami, kropkami albo gestem.',
    title: 'Beata Kotecka / post - Jesz śniadanie, a za godzinę znowu czujesz głód?'
  },
  post2: {
    count: 7,
    image: index => 'assets/beata/posts/post2/' + String(index).padStart(2, '0') + '.jpg',
    alt: index => 'Beata Kotecka - slajd ' + index + ' z 7, post „Lato się kończy. Te przepisy zostają”',
    caption: 'Prawdziwa karuzela opublikowana na Instagramie. Przewijaj strzałkami, kropkami albo gestem.',
    title: 'Beata Kotecka / post - Lato się kończy. Te przepisy zostają'
  },
  aroma: {
    count: 4,
    image: index => 'assets/aroma-trend/carousel/' + String(index).padStart(2, '0') + '.jpg',
    alt: index => ['Strona kursu Ekspert Opalania', 'Spis treści kursu', 'Lekcja o standardzie obsługi klienta', 'Przykładowy quiz w kursie'][index - 1] + ', slajd ' + index + ' z 4',
    caption: 'Wybrane ekrany z kursu udostępnianego klientom Aroma Trend. Przewijaj strzałkami, kropkami albo gestem.',
    title: 'Aroma Trend / podgląd kursu Ekspert Opalania'
  }
};
document.querySelectorAll('[data-carousel]').forEach(button => {
  button.addEventListener('click', () => {
    const config = postCarousels[button.dataset.carousel];
    if (config) openGallery(config.title, config);
  });
});

function openDocument(config) {
  const reader = document.createElement('div');
  reader.className = 'document-reader';
  const intro = document.createElement('div');
  intro.className = 'document-intro';
  const summary = document.createElement('p');
  summary.textContent = config.summary;
  let download = null;
  if (config.pdf) {
    download = document.createElement('a');
    download.href = config.pdf;
    download.download = config.filename;
    download.className = 'pill dark';
    download.textContent = 'Pobierz PDF';
  }
  intro.append(summary);
  if (download) intro.append(download);
  reader.append(intro);
  for (let page = 1; page <= config.pages; page++) {
    const figure = document.createElement('figure');
    figure.className = 'document-page';
    const caption = document.createElement('figcaption');
    caption.textContent = 'Strona ' + page + ' / ' + config.pages;
    const img = new Image();
    img.src = config.image(page);
    img.alt = config.title + ', strona ' + page + '. Wersja tekstowa jest dostępna w pliku PDF.';
    img.width = config.width;
    img.height = config.height;
    img.loading = page === 1 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      const fallback = download ? download.cloneNode(true) : document.createElement('p');
      fallback.className = 'document-error';
      fallback.textContent = download
        ? 'Nie udało się wczytać strony. Pobierz pełny dokument PDF.'
        : 'Nie udało się wczytać tej strony dokumentu.';
      img.replaceWith(fallback);
    }, { once: true });
    figure.append(caption, img);
    reader.append(figure);
  }
  openViewer(config.title, reader);
}

document.querySelector('[data-pulse-document]').addEventListener('click', () => openDocument({
  title: 'PulseNow / założenia projektu',
  summary: 'Założenia autorskiego projektu studenckiego / 6 stron',
  pdf: 'assets/pulsenow/PulseNow_projekt.pdf', filename: 'PulseNow_zalozenia_projektu.pdf',
  pages: 6, width: 1192, height: 1684,
  image: page => 'assets/pulsenow/pages/page-' + page + '.jpg'
}));

document.querySelectorAll('[data-oddech-document]').forEach(button => {
  button.addEventListener('click', () => openDocument({
    title: 'ODDECH / księga znaku',
    summary: 'Autorski projekt studencki / 17 stron',
    pdf: 'assets/oddech/ODDECH_ksiega_znaku.pdf', filename: 'ODDECH_ksiega_znaku.pdf',
    pages: 17, width: 1920, height: 1080,
    image: page => 'assets/oddech/pages/page-' + String(page).padStart(2, '0') + '.jpg'
  }));
});

document.querySelectorAll('[data-newsletter]').forEach(button => {
  button.addEventListener('click', () => openDocument({
    title: 'Beata Kotecka / newsletter „Cztery pory zdrowia”',
    summary: 'Wysyłka z 1 września 2026 r. / 2 strony',
    pages: 2, width: 1547, height: 1521,
    image: page => 'assets/beata/newsletter-' + page + '.jpg'
  }));
});

document.querySelectorAll('[data-facebook]').forEach(button => {
  button.addEventListener('click', () => {
    const url = 'https://www.facebook.com/FundacjaPrzytulKota/videos/' + button.dataset.facebook + '/';
    const wrapper = document.createElement('div');
    wrapper.className = 'facebook-view';
    const frame = document.createElement('iframe');
    frame.src = 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(url) + '&show_text=false&width=470';
    frame.title = button.dataset.title + ' - odtwarzacz Facebooka';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    const message = document.createElement('p');
    message.textContent = 'Zewnętrzny odtwarzacz Facebooka może wymagać logowania lub zgody na pliki cookie. Jeśli film się nie pojawia, otwórz oryginalną publikację.';
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'pill dark';
    link.textContent = 'Otwórz na Facebooku ↗';
    wrapper.append(frame, message, link);
    openViewer(button.dataset.title, wrapper);
  });
});

document.querySelector('.close-button').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  viewerContent.replaceChildren();
  galleryIndex = null;
  currentGallery = null;
  previousFocus?.focus({ preventScroll: true });
});
document.addEventListener('keydown', event => {
  if (!dialog.open || galleryIndex === null) return;
  if (event.key === 'ArrowRight') { event.preventDefault(); stepGallery(1); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); stepGallery(-1); }
});

document.querySelectorAll('video').forEach(video => {
  video.addEventListener('play', () => {
    document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
  });
  const addError = () => {
    if (video.parentElement.querySelector('.video-error')) return;
    const link = document.createElement('a');
    link.href = video.querySelector('source').src;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'video-error';
    link.textContent = 'Problem z odtwarzaniem? Otwórz plik wideo ↗';
    video.parentElement.append(link);
  };
  video.addEventListener('error', addError);
  video.querySelector('source').addEventListener('error', addError);
});

let ticking = false;
function updateProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
  document.querySelector('.scroll-progress span').style.transform = 'scaleX(' + ratio + ')';
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();
