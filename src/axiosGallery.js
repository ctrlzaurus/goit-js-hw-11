import axios from 'axios';

export default class PixabayAPI {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '34227427-bed69196739ab14a9612e550e';
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchPhotos() {
        const params = new URLSearchParams({
            key: this.#API_KEY,
            q: this.searchQuery,
            image_type: 'photo',
            orientation: 'horizontal',
            per_page: 40,
            safesearch: true,
            page: this.page,
        })
        try {
            const response = await axios.get(`${this.#BASE_URL}?${params}`);
            this.incrementPage();
            return response;
        } catch ({response:{status}}) {
            return status;
        }
    }
    
    async incrementPage() {
        this.page += 1;
    }
    async resetPage() {
        this.page = 1;
    }
}





// export function fetchCountries(name) {
//   const url = `https://restcountries.com/v2/name/${name}?fields=name,capital,population,flags,languages`;

//   return fetch(url).then(response => response.json());
// }


// // const BASE_URL = 'https://restcountries.com/v3.1';

// // function fetchCountries(name) {
// //     return fetch(`${BASE_URL}/name/${name}`).then(response =>
// //         response.json(),
// //     );
// // }
 
// // export default { fetchCountries };  