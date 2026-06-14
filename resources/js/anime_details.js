document.addEventListener("DOMContentLoaded", async () => {

    const animeId = window.location.pathname.split("/").pop();

    const badge = document.getElementById("user-anime-status");
    const select = document.getElementById("status-select");
    const episodeList = document.getElementById("episode-list");

    const isLoggedIn = !!select;

    let animeData = null;

    let userStatus = {
        status: "not_watched",
        progress: 0
    };

   

    async function fetchAnime() {

        const res = await fetch(`/anime-json/${animeId}`);

        return await res.json();
    }

    async function fetchUserStatus() {

        try {

            const res = await fetch(`/anime-status/${animeId}`);

            if (!res.ok) {
                return {
                    status: "not_watched",
                    progress: 0
                };
            }

            return await res.json();

        } catch (err) {

            return {
                status: "not_watched",
                progress: 0
            };
        }
    }

   

    function updateStatusUI(status) {

        if (!isLoggedIn) return;

        select.value = status;

        badge.textContent =
            status.replace("_", " ").toUpperCase();

        badge.className =
            `user-status-badge status-${status}`;
    }

    function generateEpisodes(totalEpisodes) {

        episodeList.innerHTML = "";

        for (let i = 1; i <= totalEpisodes; i++) {

            const ep = document.createElement("div");

            ep.className = "episode-box unwatched";

            ep.dataset.ep = i;

            ep.innerHTML = `
                <div class="left-half" data-ep="${i}"></div>
                <div class="right-half" data-ep="${i}"></div>
                <span class="ep-number">${i}</span>
            `;

            episodeList.appendChild(ep);
        }
    }

    function updateEpisodeVisuals(progress, status) {

        document.querySelectorAll(".episode-box").forEach(box => {

            const epNum = parseInt(box.dataset.ep);

            box.classList.remove(
                "watched",
                "unwatched",
                "can-interact",
                "can-comment"
            );

           

            if (
                status === "watched" ||
                epNum <= progress
            ) {

                box.classList.add("watched");

            } else {

                box.classList.add("unwatched");
            }

           

            if (
                status === "watching"
            ) {
                box.classList.add("can-interact");
            }

           

            if (
                status === "watched" ||
                epNum <= progress
            ) {
                box.classList.add("can-comment");
            }
        });
    }

   

    async function renderPage() {

        animeData = await fetchAnime();

       

        document.getElementById("cover-image").src =
            animeData.cover_image ?? "/placeholder.jpg";

        document.getElementById("anime-title").textContent =
            animeData.title;

        document.getElementById("anime-episodes").textContent =
            animeData.episodes ?? "?";

        document.getElementById("anime-score").textContent =
            animeData.average_score
                ? (animeData.average_score / 10).toFixed(1) + "/10"
                : "N/A";

        document.getElementById("anime-description").textContent =
            animeData.description ?? "Nema opisa.";

        const statusEl = document.getElementById("anime-status");

        statusEl.textContent =
            animeData.status.replace("_", " ").toUpperCase();

        statusEl.className =
            `status status-${animeData.status}`;

       

        generateEpisodes(animeData.episodes);

       

        if (isLoggedIn) {

            userStatus = await fetchUserStatus();

            userStatus.status =
                userStatus.status || "not_watched";

            userStatus.progress =
                userStatus.progress || 0;

            updateStatusUI(userStatus.status);

            updateEpisodeVisuals(
                userStatus.progress,
                userStatus.status
            );

        } else {

            updateEpisodeVisuals(0, "not_watched");
        }
    }

   

    if (isLoggedIn) {

        select.addEventListener("change", async () => {

            const newStatus = select.value;

           

            await fetch("/anime-status/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    anime_id: animeId,
                    status: newStatus
                })
            });

            if (newStatus === "watching") {

                await fetch("/anime-progress/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        anime_id: animeId,
                        episode: 1
                    })
                });
            }

           

            userStatus = await fetchUserStatus();

            let progress = userStatus.progress || 0;

           

            if (newStatus === "watched") {

                progress = animeData.episodes;
            }

            if (newStatus === "not_watched") {

                progress = 0;
            }

           

            userStatus.status = newStatus;
            userStatus.progress = progress;

           

            updateStatusUI(newStatus);

            updateEpisodeVisuals(progress, newStatus);
            await loadFriendsProgress();
        });
    }

   

    episodeList.addEventListener("click", async (e) => {

        if (!isLoggedIn) return;

       

        if (
            badge &&
            badge.classList.contains("status-dropped")
        ) {
            return;
        }

       

        if (e.target.classList.contains("left-half")) {

            if (
                !badge.classList.contains("status-watching")
            ) {
                return;
            }

            const ep = parseInt(e.target.dataset.ep);

           

            await fetch("/anime-progress/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    anime_id: animeId,
                    episode: ep
                })
            });

           

            userStatus.progress = ep;

           

            updateEpisodeVisuals(
                ep,
                "watching"
            );
           

            await loadFriendsProgress();

           

            if (ep === animeData.episodes) {

                await fetch("/anime-status/update", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN":
                            document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        anime_id: animeId,
                        status: "watched"
                    })
                });

                userStatus.status = "watched";

                updateStatusUI("watched");

                updateEpisodeVisuals(
                    animeData.episodes,
                    "watched"
                );

               

                await loadFriendsProgress();

            }

            return;
        }

       

        if (e.target.classList.contains("right-half")) {

            const ep = parseInt(e.target.dataset.ep);

           

            const currentProgress =
                userStatus.progress || 0;

            if (
                userStatus.status !== "watched" &&
                ep > currentProgress
            ) {
                return;
            }

           

            window.location.href = `/comment/${animeId}/${ep}`
        }
    });



async function loadFriendsProgress() {

    const box = document.getElementById("friend-progress-box");

    if (!box) return;

    try {

        const res = await fetch(
            `/anime-progress-info/${animeId}`
        );

        const data = await res.json();

        const messages = data.message.split(". ");

        box.innerHTML = `
            <h3 class="friends-title">Friends Progress</h3>
            <div class="friends-list">
                ${messages.map(msg => `
                    <div class="friend-line">
                        ${msg.replace(".", "")}
                    </div>
                `).join("")}
            </div>
        `;

    } catch (err) {

        console.error(err);
    }
}


   
   

    renderPage();

    loadFriendsProgress();
    
});
