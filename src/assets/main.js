const API = 'https://youtube-v31.p.rapidapi.com/search?channelId=UC0e7xuPDsb4qfRaXJI8MywQ&part=snippet%2Cid&order=date&maxResults=9'; // Guarda url de llamado a api

const content = null || document.getElementById('content'); // Refeencia a elem html donde mostraremos resultado de llamado

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '3ad4d213f6msha8f9f70ceb8f123p1e2848jsn786936e64ce7', // No mostrar ni compartir
		'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com' 
	}
};

/*// Código fetch reemplazado por async/await 
fetch('', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err)); */

//Lógica de async: ir por los datos, luego esperar por ellos y finalmente retornarlos hacia el usuario
async function fetchData(urlApi) {
    const response = await fetch(urlApi, options); // Hace uso de fetch() y solo por esta vez le pasa las opciones
    const data = await response.json();
    return data; //retorna la información de la API que estamos solicitando
}

// Función que se llama a si misma
// - Cuando se cargue el archivo .js se auto ejecutará
(async () => {
    // Dentro implementamos la lógica necesaria para hacer el llamado a la API, obtener los elementos y mostrarlos en htm
    try {
        const videos = await fetchData(API);

        // Crea template para presentar en HTML (usa bloque 'content' de template landing)
        // - view será un arreglo.
        // - Se usa map para mapear videos en un nuevo arreglo con un bloque html por cada video recibido en llamado
        let view = `
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
        
        content.innerHTML = view;
    } catch (error) {
        console.log(error);
    }
})();