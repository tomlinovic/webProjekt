document.addEventListener("DOMContentLoaded",async()=>{const l=document.getElementById("search"),i=document.getElementById("search-results"),o=document.getElementById("friends-list");let u;try{const t=await fetch("/friends-json",{credentials:"include"});if(t.status===401){window.location.href="/login";return}const e=await t.json(),n=e.user_id,s=e.friends;o.innerHTML="",s.length===0?o.innerHTML=`
                <div class="empty-state">
                    No friends yet
                </div>
            `:s.forEach(r=>{const d=document.createElement("div");d.className="friend-card";const a=r.friend1===n?r.friend2_user:r.friend1_user;d.innerHTML=`
                    <div>${a.name}</div>
                    <button class="remove-friend-btn" data-id="${a.id}">
                        Remove
                    </button>
                `,o.appendChild(d)})}catch(t){console.error(t),o.innerHTML=`
            <div class="empty-state">
                Failed to load friends
            </div>
        `}const c=document.getElementById("friend-requests");try{const e=await(await fetch("/friend-requests",{credentials:"include"})).json();c.innerHTML="",e.length===0?c.innerHTML=`
                <div class="empty-state">
                    No pending requests
                </div>
            `:e.forEach(n=>{const s=document.createElement("div");s.className="user-card",s.innerHTML=`
                    <div>
                        <strong>${n.sender.name}</strong><br>
                        ${n.sender.email}
                    </div>

                    <div class="request-buttons">
                        <button class="accept-btn" data-id="${n.id}">Accept</button>
                        <button class="decline-btn" data-id="${n.id}">Decline</button>
                    </div>
                `,c.appendChild(s)})}catch(t){console.error(t),c.innerHTML=`
            <div class="empty-state">
                Failed to load requests
            </div>
        `}l.addEventListener("input",()=>{clearTimeout(u),u=setTimeout(async()=>{const t=l.value.trim();if(t.length===0){i.innerHTML="";return}i.innerHTML=`
                <div class="loading-state">
                    Searching...
                </div>
            `;try{const n=await(await fetch(`/search-users?q=${encodeURIComponent(t)}`)).json();if(i.innerHTML="",n.type==="email"){if(!n.user){i.innerHTML=`
                            <div class="empty-state">
                                No user found
                            </div>
                        `;return}m(n.user);return}if(n.type==="name"){if(!n.users||n.users.length===0){i.innerHTML=`
                            <div class="empty-state">
                                No users found
                            </div>
                        `;return}n.users.forEach(s=>{m(s)})}}catch(e){console.error(e),i.innerHTML=`
                    <div class="empty-state">
                        Search failed
                    </div>
                `}},300)});function m(t){const e=document.createElement("div");e.className="user-card";const n=document.createElement("div"),s=document.createElement("div"),r=document.createElement("strong");r.textContent=t.name,s.appendChild(r);const d=document.createElement("div");d.textContent=t.email,n.appendChild(s),n.appendChild(d);const a=document.createElement("button");a.className="add-friend-btn",a.dataset.id=t.id,a.textContent="Add friend",e.appendChild(n),e.appendChild(a),i.appendChild(e)}i.addEventListener("click",async t=>{if(!t.target.classList.contains("add-friend-btn"))return;const e=t.target,n=e.dataset.id;e.disabled=!0,e.textContent="Sending...";try{const r=await(await fetch("/send-friend-request",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content},body:JSON.stringify({receiver_id:n})})).json();if(r.success){e.textContent="Request sent";return}e.disabled=!1,e.textContent="Add friend",alert(r.message||"Already friends")}catch(s){console.error(s),e.disabled=!1,e.textContent="Add friend",alert("Network error")}}),document.addEventListener("click",async t=>{if(t.target.classList.contains("accept-btn")){const e=t.target.dataset.id;await fetch("/friend-requests/accept",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content},body:JSON.stringify({id:e})}),t.target.closest(".user-card").remove(),await f()}if(t.target.classList.contains("decline-btn")){const e=t.target.dataset.id;await fetch("/friend-requests/decline",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content},body:JSON.stringify({id:e})}),t.target.closest(".user-card").remove()}}),o.addEventListener("click",async t=>{if(!t.target.classList.contains("remove-friend-btn"))return;const e=t.target,n=e.dataset.id;e.disabled=!0,e.textContent="Removing...";try{(await(await fetch("/remove-friend",{method:"POST",headers:{"Content-Type":"application/json","X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').content},body:JSON.stringify({friend_id:n})})).json()).success?e.closest(".friend-card").remove():(e.disabled=!1,e.textContent="Remove",alert("Failed to remove friend"))}catch(s){console.error(s),e.disabled=!1,e.textContent="Remove",alert("Network error")}});async function f(){try{const e=await(await fetch("/friends-json",{credentials:"include"})).json(),n=e.user_id,s=e.friends;if(o.innerHTML="",s.length===0){o.innerHTML=`
                    <div class="empty-state">
                        No friends yet
                    </div>
                `;return}s.forEach(r=>{const d=document.createElement("div");d.className="friend-card";const a=r.friend1===n?r.friend2_user:r.friend1_user;d.innerHTML=`
                    <div>${a.name}</div>
                    <button class="remove-friend-btn" data-id="${a.id}">
                        Remove
                    </button>
                `,o.appendChild(d)})}catch(t){console.error(t)}}});
