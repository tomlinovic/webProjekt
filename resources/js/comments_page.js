const friendComments = window.AppData.friendComments;
const allComments = window.AppData.allComments;

const userId = window.AppData.userId;
const userName = window.AppData.userName;

const animeId = window.AppData.animeId;
const episode = window.AppData.episode;

const csrf = window.AppData.csrf;

    let currentFilter = "friends";

    function normalizeDate(dateString) {
        if (!dateString) return null;
        if (dateString.includes("T")) return dateString;

        if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
            return dateString.replace(" ", "T");
        }

        const parts = dateString.match(/(\d+)\.\s*(\d+)\.\s*(\d+)\.\s*(\d+):(\d+):(\d+)/);
        if (parts) {
            const [_, day, month, year, hour, minute, second] = parts;
            return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
        }

        return null;
    }

    function timeAgo(date) {
        if (!date) return "just now";

        const seconds = Math.floor((new Date() - new Date(date)) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1
        };

        for (let key in intervals) {
            const value = Math.floor(seconds / intervals[key]);
            if (value > 0) {
                return `${value} ${key}${value > 1 ? 's' : ''} ago`;
            }
        }

        return "just now";
    }

    function renderComments() {
        const container = document.getElementById("comments-container");
        container.innerHTML = "";

        const list = currentFilter === "friends" ? friendComments : allComments;

        if (list.length === 0) {
            container.innerHTML = currentFilter === "friends"
                ? `<p>No friend comments yet.</p>`
                : `<p>No comments yet.</p>`;
            return;
        }

        list.forEach(c => {
            const div = document.createElement("div");
            div.classList.add("comment-box");

            const isoDate = normalizeDate(c.created_at);

            div.innerHTML = `
                <div class="comment-user">${c.user.name}</div>
                <div class="comment-time">${timeAgo(isoDate)}</div>

                <div class="comment-text" id="comment-text-${c.id}">
                    ${c.text}
                </div>

                <div class="comment-actions">
                    ${c.user.id === userId
                    ? `<button class="edit-btn" data-id="${c.id}">Edit</button>
                    <button class="delete-btn" data-id="${c.id}">Delete</button>`
                    : `<button class="report-btn" data-id="${c.id}">Report</button>`
                }
                </div>



            `;

            container.appendChild(div);
        });
    }

    document.getElementById("filter-friends").onclick = () => {
        currentFilter = "friends";
        document.getElementById("filter-friends").classList.add("active");
        document.getElementById("filter-everyone").classList.remove("active");
        renderComments();
    };

    document.getElementById("filter-everyone").onclick = () => {
        currentFilter = "everyone";
        document.getElementById("filter-everyone").classList.add("active");
        document.getElementById("filter-friends").classList.remove("active");
        renderComments();
    };

    document.getElementById("submit-comment").onclick = async () => {
        const text = document.getElementById("comment-input").value.trim();
        if (!text) return;

        const response = await fetch(`/comment/${animeId}/${episode}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (data.success) {
            const newComment = {
                id: data.id,
                user: { 
                    id: userId,
                    name: userName
                },
                text: text,
                created_at: data.created_at,
                anime_id: animeId,
                episode: episode
            };


            allComments.push(newComment);

            document.getElementById("comment-input").value = "";
            renderComments();
        }
    };

    
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("edit-btn")) return;

        const id = e.target.dataset.id;
        const textDiv = document.getElementById(`comment-text-${id}`);
        const oldText = textDiv.innerText;

        textDiv.innerHTML = `
            <textarea id="edit-input-${id}" class="edit-input">${oldText}</textarea>
            <button class="save-edit-btn" data-id="${id}">Save</button>
            <button class="cancel-edit-btn" data-id="${id}">Cancel</button>
        `;
    });

    
    document.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("save-edit-btn")) return;

        const id = e.target.dataset.id;
        const input = document.getElementById(`edit-input-${id}`);
        if (!input) return;

        const newText = input.value.trim();
        if (!newText) return;

        try {
            const response = await fetch(`/comment/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: JSON.stringify({ text: newText })
            });


            if (!response.ok) {
                console.error("Response not OK:", response.status);
                return;
            }

            const data = await response.json();
            console.log("Update response:", data);

            if (data.success) {
                const updateList = (list) => {
                    const item = list.find(c => c.id == id);
                    if (item) item.text = newText;
                };

                updateList(allComments);
                updateList(friendComments);

                renderComments();
            } else {
                console.error("Update failed:", data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    });


    
    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("cancel-edit-btn")) return;

        const id = e.target.dataset.id;
        const original = allComments.find(c => c.id == id)?.text;

        document.getElementById(`comment-text-${id}`).innerHTML = original;
    });

    
    document.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("delete-btn")) return;

        const id = e.target.dataset.id;

        if (!confirm("Are you sure you want to delete this comment?")) return;

        const response = await fetch(`/comment/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        const data = await response.json();

        if (data.success) {
            
            const removeFrom = (list) => {
                const index = list.findIndex(c => c.id == id);
                if (index !== -1) list.splice(index, 1);
            };

            removeFrom(allComments);
            removeFrom(friendComments);

            renderComments();
        }
    });

    
   document.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("report-btn")) return;

    const id = e.target.dataset.id;

    const response = await fetch(`/comment/${id}/report`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({})
    });

    const data = await response.json();

    const msgBox = document.getElementById("report-message");

    function showMessage(text, color = "#f1c40f") {
        msgBox.textContent = text;
        msgBox.style.background = color;
        msgBox.style.display = "block";

        setTimeout(() => {
            msgBox.style.display = "none";
        }, 5000);
    }

    
    if (!data.success) {
        showMessage(data.error, "#e74c3c"); 
        return;
    }

    
    if (data.deleted) {
        const removeFrom = (list) => {
            const index = list.findIndex(c => c.id == id);
            if (index !== -1) list.splice(index, 1);
        };

        removeFrom(allComments);
        removeFrom(friendComments);

        renderComments();
        showMessage("Comment removed due to multiple spoiler reports", "#2ecc71"); 
        return;
    }

    
    showMessage(`Reported (${data.count}/3)`, "#f1c40f"); 
});





    renderComments();
