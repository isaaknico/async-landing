const API_YT = 'https://outube-v31.p.rapidapi.com/search?channelId=UC0e7xuPDsb4qfRaXJI8MywQ&part=snippet%2Cid&order=date&maxResults=9'; // Guarda url de llamado a api
const API_RAWG = 'https://rawg-video-games-database.p.rapidapi.com';

const contentNewTrendingPCG = null || document.getElementById('new-trending-pcg');
const contentMostPopularPCG = null || document.getElementById('most-popular-pcg');
const contentLastYTVideos = null || document.getElementById('last-yt-videos'); // Referencia a elem html donde mostraremos resultado de llamado yt
const date = new Date(); // Tue Jul 26 2022 13:20:59 GMT-0500 (hora de verano central)
const isodate = date.toISOString();
console.log('isodate:', isodate);
const today = `${ date.getFullYear()}-${ date.getMonth() + 1 }-${ date.getDate() }`; // 2022-7-26
console.log('yyyy-mm-dd:', today);

// API YT
const optionsYT = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3ad4d213f6msha8f9f70ceb8f123p1e2848jsn786936e64ce7', // No mostrar ni compartir 87f5c072d69247d49911f94b482a4dc4
		'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com' 
	}
};

/* fetch('', options) // Código fetch reemplazado por async/await 
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err)); */

//Lógica de async: ir por los datos, luego esperar por ellos y finalmente retornarlos hacia el usuario
async function fetchData(urlApi, options) {
    const response = await fetch(urlApi, options); // Hace uso de fetch() y solo por esta vez le pasa las opciones
    const data = await response.json();
    return data; //retorna la información de la API que estamos solicitando
}


// API RAWG
const optionsRAWG = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3ad4d213f6msha8f9f70ceb8f123p1e2848jsn786936e64ce7',
		'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
	}
};


// Función que recibe un array con la respuesta de la api y genera un array listo para imprimir en html  con la vista por defecto
function printViewsGames(array, num) { 
    return array.results.map(game => {

        let released = (game.released < today )
            ? 'Released'
            : 'Not Released';

        let rated = (game.metacritic)
            ? game.metacritic
            : 'Not rated';

        let platforms = game.platforms.map(platform => platform.platform.name).join(', ');

        let viewGame = `
                <div class="group relative">
                    <div class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
                        <img src="${ game.background_image }" alt="${ game.slug }" class="w-full h-44">
                    </div>
                    <div class="mt-4 flex justify-between">
                        <div>
                            <h3 class="text-lg font-semibold text-slate-900">
                                <span aria-hidden="true" class="absolute inset-0"></span>
                                ${ game.name }
                            </h3>
                            <div class="inline-block px-1.5 ring-1 ring-slate-200 rounded">
                                <h3 class="text-sm text-purple-700">
                                    ${ rated }
                                </h3>
                            </div>
                        </div>
                        <div class="text-right">
                            <h3 class="text-lg font-semibold text-purple-700">
                                ${ released }
                            </h3>
                            <h3 class="text-sm text-slate-700">
                                ${ game.released }
                            </h3>
                            <h3 class="text-sm text-slate-400">
                                ${ platforms }
                            </h3>
                        </div>
                    </div>
                </div>
            `
        return viewGame;
    }).slice(0, num).join('');
}

// Función que se llama a si misma
// - Cuando se cargue el archivo .js se auto ejecutará
(async () => {
    // Dentro implementamos la lógica necesaria para hacer el llamado a la API, obtener los elementos y mostrarlos en htm
    try {
        const platforms = await fetchData(`${API_RAWG}/platforms?key=87f5c072d69247d49911f94b482a4dc4`, optionsRAWG)
        const newTrendingPCG = await fetchData(`${API_RAWG}/games?key=87f5c072d69247d49911f94b482a4dc4&dates=2022-07-01,2022-07-26&platforms=4&ordering=-released`, optionsRAWG);
        const mostPopularPCG = await fetchData(`${API_RAWG}/games?key=87f5c072d69247d49911f94b482a4dc4&dates=2022-01-01,2022-07-26&platforms=4&ordering=-released&ordering=-added`, optionsRAWG)
        const videos = await fetchData(API_YT, optionsYT);

        console.log(platforms);
        console.log(newTrendingPCG);
        console.log(mostPopularPCG);



        // Template new trending pc games
        let viewNewTrendingPCG = printViewsGames(newTrendingPCG, 8);

        // Template most popular pc games
        let viewMostPopularPCG = printViewsGames(mostPopularPCG, 12);

        // Crea template para presentar en HTML (usa bloque 'content' de template landing)
        // - viewLastVideos será un arreglo.
        // - Se usa map para mapear videos en un nuevo arreglo con un bloque html por cada video recibido en llamado
        let viewLastVideos = `
            ${videos.items.map(video => `
                <div class="group relative">
                    <div class="w-full bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:aspect-none">
                        <img src="${ video.snippet.thumbnails.high.url }" alt="${ video.snippet.description }" class="w-full">
                    </div>
                    <div class="mt-4 flex justify-between">
                        <h3 class="text-sm text-gray-700">
                            <span aria-hidden="true" class="absolute inset-0"></span>
                            ${ video.snippet.title }
                        </h3>
                    </div>
                </div>
                
            `).slice(0,4).join('')} 
        `; // Muestra solo 4 elems en vez de los 9 solicitados en la llamada a Api.

        
        contentLastYTVideos.innerHTML = viewLastVideos; 
        contentNewTrendingPCG.innerHTML = viewNewTrendingPCG;
        contentMostPopularPCG.innerHTML = viewMostPopularPCG;
    } catch (error) {
        console.log(error);
    }
})();