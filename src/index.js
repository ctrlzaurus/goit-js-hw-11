import './css/styles.css';
import PixabayAPI from './axiosGallery';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';


const pixabayAPI = new PixabayAPI();

const formSearch = document.querySelector('#search-form');
const input = document.querySelector('.input');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');

formSearch.addEventListener('submit', onSubmit);
loadBtn.addEventListener('click', onBtnClick);
input.addEventListener('input', ()=> {
  if (input.value === '') {
    gallery.innerHTML = '';
    disabledBtn();
  }
})

async function onSubmit(event) {
  event.preventDefault();
  disabledBtn();
  pixabayAPI.searchQuery = input.value.trim();
  if (input.value.trim() === '') {
    showInfoSpace();
    return;
  }
  gallery.innerHTML = '';
  pixabayAPI.resetPage();

  const response = await pixabayAPI.fetchPhotos();
  
  const images = await response.data.hits;
  const totalHits = await response.data.totalHits;
  
  if (images.length === 0) {
    showError();
    return;
  }

  showInfoHits(totalHits);
  appendImages(images);
  lightbox.refresh();

  if (totalHits <= 40) {
    disabledBtn();
    return;
  }

  enableBtn();
}

function showInfoEnd() {
  Notiflix.Notify.failure(
    `We're sorry, but you've reached the end of search results.`,
  {
  timeout: 2000,
  },
);
}

function showInfoHits(data) {
  Notiflix.Notify.success(
    `Hooray! We found ${data} images.`,
  {
  timeout: 2000,
  },
);
}

function showInfoSpace() {
    Notiflix.Notify.info(
      `Ooops, too many matches found. Please enter a more specific name.`,
    {
    timeout: 2000,
    },
 );
}

function showError() {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`,
    {
    timeout: 2000,
    },
 );
}

async function onBtnClick() {
  const response = await pixabayAPI.fetchPhotos();
  if (response === 400 || response.data.hits.length === 0) {
    disabledBtn();
    showInfoEnd();
    return;
  }
  const images = await response.data.hits;
  const totalHits = await response.data.totalHits;

  appendImages(images);
  lightbox.refresh();
}

function enableBtn() {
  loadBtn.classList.remove('disabled');
}

function disabledBtn() {
  loadBtn.classList.add('disabled');
}

function appendImages(images) {
  const markup = images.map(image => `
    <div class="photo-card">
      <a href ='${image.largeImageURL}' class='link-img'>
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" class='valera' />
      </a>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </div>
  `).join('');
  gallery.innerHTML += markup;
}

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250});