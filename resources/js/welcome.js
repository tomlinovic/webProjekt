document.addEventListener("DOMContentLoaded", () => {

    
    function stringToColor(str) {
        let a = 0, b = 0, c = 0;
        for (let i = 0; i < str.length; i++) {
            a = (a + str.charCodeAt(i) * 17) % 256;
            b = (b + str.charCodeAt(i) * 31) % 256;
            c = (c + str.charCodeAt(i) * 47) % 256;
        }
        const hash = [a, b, c].map(x => x.toString(16).padStart(2, '0')).join('');
        const bg = `#${hash}`;
        const r = parseInt(hash.substring(0, 2), 16);
        const g = parseInt(hash.substring(2, 4), 16);
        const bVal = parseInt(hash.substring(4, 6), 16);
        const luminance = 0.299 * r + 0.587 * g + 0.114 * bVal;
        return { bg, textColor: luminance > 150 ? '#000' : '#fff' };
    }

    
    function renderAnime(animeList) {
        const container = document.getElementById('random-anime');
        const status = document.getElementById('search-status');

        if (animeList.length === 0) {
            container.innerHTML = '';
            status.textContent = 'Nije pronađen nijedan anime.';
            return;
        }

        status.textContent = '';
        container.innerHTML = animeList.map(anime => {
            const { bg, textColor } = stringToColor(anime.title);
            return `
                <a href="/anime/${anime.id}">
                    <div class="anime-card" style="background:${bg}; color:${textColor}">
                        <img src="${anime.cover_image}" alt="${anime.title}">
                        <h3>${anime.title}</h3>
                    </div>
                </a>
            `;
        }).join('');
    }

    
    function loadAnime(query = '') {
        const status = document.getElementById('search-status');
        const url = query
            ? `/search-anime?q=${encodeURIComponent(query)}`
            : '/search-anime';

        status.textContent = 'Učitavanje...';

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Greška pri dohvatu podataka.');
                return res.json();
            })
            .then(renderAnime)
            .catch(err => {
                status.textContent = 'Greška: ' + err.message;
                console.error(err);
            });
    }

    
    let debounceTimer;
    document.getElementById('search-input').addEventListener('input', (e) => {
        const value = e.target.value;

        
        if (/[<>{}]/.test(value)) {
            document.getElementById('search-status').textContent = 'Nedozvoljeni znakovi u pretrazi.';
            return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => loadAnime(value.trim()), 300);
    });

    
    loadAnime();
});
