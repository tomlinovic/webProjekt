document.addEventListener("DOMContentLoaded",()=>{fetch("/my-anime-json").then(e=>e.json()).then(e=>{t("watching",e.watching),t("watched",e.watched),t("dropped",e.dropped)}).catch(e=>console.error(e));function t(e,i){const c=document.getElementById(e+"-grid");if(!i||i.length===0){c.innerHTML="<p>No anime in this category.</p>";return}c.innerHTML="",i.forEach(d=>{const a=d.anime,n=document.createElement("a");n.href="/anime/"+a.id,n.className="anime-card",n.innerHTML=`
                <img src="${a.cover_image}" alt="">
                <div class="anime-title">${a.title}</div>
            `,c.appendChild(n)})}});
