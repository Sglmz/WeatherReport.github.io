document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "3cf22418cce6a8927db3c1c586ec582d";
    const weatherElement = document.getElementById("weather");
    const songButtonsElement = document.getElementById("song-buttons");
    const audioPlayer = document.getElementById("audio-player");
    const audioSource = document.getElementById("audio-source");

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getWeather, showError);
        } else {
            weatherElement.innerHTML = "<p>Geolocalización no soportada en este navegador.</p>";
        }
    }

    async function getWeather(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`);
            
            if (!response.ok) {
                throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            displayWeather(data);
        } catch (error) {
            weatherElement.innerHTML = `<p>Error al obtener los datos del clima: ${error.message}</p>`;
        }
    }

    function displayWeather(data) {
        const city = data.name; 
        const temp = data.main.temp.toFixed(1);
        const description = data.weather[0].description.toLowerCase();
        weatherElement.innerHTML = `<p>Clima en ${city}: ${description}, ${temp}°C</p>`;

        recommendMusic(description);
    }

    function recommendMusic(description) {
        let song1 = "";
        let song2 = "";

        if (description.includes("lluvia") || description.includes("nublado") || description.includes("nuboso")) {
            song1 = "lluvia1.mp3";
            song2 = "lluvia2.mp3";
        } else if (description.includes("soleado") || description.includes("despejado") || description.includes("nubes") || description.includes("claro")) {
            song1 = "summer1.mp3";
            song2 = "summer2.wav";
        }

        songButtonsElement.innerHTML = `
            <button onclick="playSong('${song1}')">Opción 1</button>
            <button onclick="playSong('${song2}')">Opción 2</button>
        `;
    }

    window.playSong = function(song) {
        audioSource.src = `audio/${song}`;
        audioPlayer.load();
        audioPlayer.play();
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                weatherElement.innerHTML = "<p>Se negó la solicitud de geolocalización.</p>";
                break;
            case error.POSITION_UNAVAILABLE:
                weatherElement.innerHTML = "<p>La ubicación no está disponible.</p>";
                break;
            case error.TIMEOUT:
                weatherElement.innerHTML = "<p>La solicitud para obtener la ubicación ha caducado.</p>";
                break;
            case error.UNKNOWN_ERROR:
                weatherElement.innerHTML = "<p>Ocurrió un error desconocido.</p>";
                break;
        }
    }

    getLocation();
});
