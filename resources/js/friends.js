document.addEventListener("DOMContentLoaded", async () => {

   

    const search = document.getElementById('search');

    const results = document.getElementById('search-results');

    const list = document.getElementById('friends-list');

    let searchTimeout;

   

    try {

        const res = await fetch('/friends-json', {
            credentials: 'include'
        });

       

        if (res.status === 401) {

            window.location.href = '/login';

            return;
        }

       

        const data = await res.json();

        const myId = data.user_id;

        const friends = data.friends;

       

        list.innerHTML = '';

       

        if (friends.length === 0) {

            list.innerHTML = `
                <div class="empty-state">
                    No friends yet
                </div>
            `;

        } else {

           

            friends.forEach(f => {
                const div = document.createElement('div');
                div.className = 'friend-card';

                const friend =
                    f.friend1 === myId
                        ? f.friend2_user
                        : f.friend1_user;

                div.innerHTML = `
                    <div>${friend.name}</div>
                    <button class="remove-friend-btn" data-id="${friend.id}">
                        Remove
                    </button>
                `;

                list.appendChild(div);
            });

        }

    } catch (err) {

        console.error(err);

        list.innerHTML = `
            <div class="empty-state">
                Failed to load friends
            </div>
        `;
    }

   

    const requestBox = document.getElementById('friend-requests');

    try {
        const resReq = await fetch('/friend-requests', { credentials: 'include' });
        const requests = await resReq.json();

        requestBox.innerHTML = '';

        if (requests.length === 0) {
            requestBox.innerHTML = `
                <div class="empty-state">
                    No pending requests
                </div>
            `;
        } else {
            requests.forEach(r => {
                const div = document.createElement('div');
                div.className = 'user-card';

                div.innerHTML = `
                    <div>
                        <strong>${r.sender.name}</strong><br>
                        ${r.sender.email}
                    </div>

                    <div class="request-buttons">
                        <button class="accept-btn" data-id="${r.id}">Accept</button>
                        <button class="decline-btn" data-id="${r.id}">Decline</button>
                    </div>
                `;

                requestBox.appendChild(div);
            });
        }

    } catch (err) {
        console.error(err);
        requestBox.innerHTML = `
            <div class="empty-state">
                Failed to load requests
            </div>
        `;
    }


   

    search.addEventListener('input', () => {

        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(async () => {

            const q = search.value.trim();

           

            if (q.length === 0) {

                results.innerHTML = '';

                return;
            }

           

            results.innerHTML = `
                <div class="loading-state">
                    Searching...
                </div>
            `;

            try {

                const res = await fetch(
                    `/search-users?q=${encodeURIComponent(q)}`
                );

                const data = await res.json();

                results.innerHTML = '';

               

                if (data.type === 'email') {

                    if (!data.user) {

                        results.innerHTML = `
                            <div class="empty-state">
                                No user found
                            </div>
                        `;

                        return;
                    }

                    renderUserCard(data.user);

                    return;
                }

               

                if (data.type === 'name') {

                    if (!data.users || data.users.length === 0) {

                        results.innerHTML = `
                            <div class="empty-state">
                                No users found
                            </div>
                        `;

                        return;
                    }

                    data.users.forEach(user => {
                        renderUserCard(user);
                    });
                }

            } catch (err) {

                console.error(err);

                results.innerHTML = `
                    <div class="empty-state">
                        Search failed
                    </div>
                `;
            }

        }, 300);
    });

   

    function renderUserCard(user) {

        const div = document.createElement('div');

        div.className = 'user-card';

       

        const info = document.createElement('div');

        const name = document.createElement('div');

        const strong = document.createElement('strong');

        strong.textContent = user.name;

        name.appendChild(strong);

        const email = document.createElement('div');

        email.textContent = user.email;

        info.appendChild(name);

        info.appendChild(email);

       

        const button = document.createElement('button');

        button.className = 'add-friend-btn';

        button.dataset.id = user.id;

        button.textContent = 'Add friend';

       

        div.appendChild(info);

        div.appendChild(button);

        results.appendChild(div);
    }

   

    results.addEventListener('click', async (e) => {

        if (!e.target.classList.contains('add-friend-btn')) {
            return;
        }

        const button = e.target;

        const receiverId = button.dataset.id;

       

        button.disabled = true;

        button.textContent = 'Sending...';

        try {

            const res = await fetch('/send-friend-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document.querySelector(
                            'meta[name="csrf-token"]'
                        ).content
                },
                body: JSON.stringify({
                    receiver_id: receiverId
                })
            });

            const data = await res.json();

           

            if (data.success) {

                button.textContent = 'Request sent';

                return;
            }

           

            button.disabled = false;

            button.textContent = 'Add friend';

            alert(data.message || 'Already friends');

        } catch (err) {

            console.error(err);

            button.disabled = false;

            button.textContent = 'Add friend';

            alert('Network error');
        }
    });

   

document.addEventListener('click', async (e) => {

    
    if (e.target.classList.contains('accept-btn')) {
        const id = e.target.dataset.id;

        await fetch('/friend-requests/accept', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ id })
        });

        
        e.target.closest('.user-card').remove();

        
        await reloadFriends();
    }


        
        if (e.target.classList.contains('decline-btn')) {
            const id = e.target.dataset.id;

            await fetch('/friend-requests/decline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ id })
            });

            e.target.closest('.user-card').remove();
        }
    });

   

    list.addEventListener('click', async (e) => {
        if (!e.target.classList.contains('remove-friend-btn')) return;

        const btn = e.target;
        const friendId = btn.dataset.id;

        btn.disabled = true;
        btn.textContent = 'Removing...';

        try {
            const res = await fetch('/remove-friend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({ friend_id: friendId })
            });

            const data = await res.json();

            if (data.success) {
                btn.closest('.friend-card').remove();
            } else {
                btn.disabled = false;
                btn.textContent = 'Remove';
                alert('Failed to remove friend');
            }

        } catch (err) {
            console.error(err);
            btn.disabled = false;
            btn.textContent = 'Remove';
            alert('Network error');
        }
    });

   
    async function reloadFriends() {
        try {
            const res = await fetch('/friends-json', { credentials: 'include' });
            const data = await res.json();

            const myId = data.user_id;
            const friends = data.friends;

            list.innerHTML = '';

            if (friends.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        No friends yet
                    </div>
                `;
                return;
            }

            friends.forEach(f => {
                const div = document.createElement('div');
                div.className = 'friend-card';

                const friend =
                    f.friend1 === myId
                        ? f.friend2_user
                        : f.friend1_user;

                div.innerHTML = `
                    <div>${friend.name}</div>
                    <button class="remove-friend-btn" data-id="${friend.id}">
                        Remove
                    </button>
                `;

                list.appendChild(div);
            });

        } catch (err) {
            console.error(err);
        }
    }



});