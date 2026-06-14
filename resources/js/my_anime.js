document.addEventListener("DOMContentLoaded", () => {

    fetch("/my-anime-json")
        .then(res => res.json())
        .then(data => {

            fillSection("watching", data.watching);
            fillSection("watched", data.watched);
            fillSection("dropped", data.dropped);

        })
        .catch(err => console.error(err));

    function fillSection(status, items) {
        const grid = document.getElementById(status + "-grid");

        if (!items || items.length === 0) {
            grid.innerHTML = "<p>No anime in this category.</p>";
            return;
        }

        grid.innerHTML = "";

        items.forEach(item => {
            const anime = item.anime;

            const card = document.createElement("a");
            card.href = "/anime/" + anime.id;
            card.className = "anime-card";

            card.innerHTML = `
                <img src="${anime.cover_image}" alt="">
                <div class="anime-title">${anime.title}</div>
            `;

            grid.appendChild(card);
        });
    }

});
