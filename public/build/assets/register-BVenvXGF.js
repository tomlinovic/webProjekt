document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".toggle-password").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.target,n=document.getElementById(e);n.type==="password"?(n.type="text",t.textContent="👁"):(n.type="password",t.textContent="◡")})});const o=document.getElementById("password"),s=document.getElementById("password-strength");o.addEventListener("input",()=>{const t=o.value;let e=0;if(t.length>=8&&e++,/[A-Z]/.test(t)&&e++,/[0-9]/.test(t)&&e++,/[^A-Za-z0-9]/.test(t)&&e++,t.length===0){s.textContent="",s.className="";return}e<=1?(s.textContent="Weak password",s.className="password-weak"):e<=3?(s.textContent="Good password",s.className="password-good"):(s.textContent="Great password",s.className="password-great")}),document.getElementById("register-btn").addEventListener("click",async t=>{t.preventDefault();const e=[],n=document.getElementById("name").value.trim(),r=document.getElementById("email").value.trim(),d=document.getElementById("password").value,c=document.getElementById("password_confirmation").value;n.length<3&&e.push("Name must be at least 3 characters."),r.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)||e.push("Email format is invalid."),d.length<8&&e.push("Password must be at least 8 characters."),d!==c&&e.push("Passwords do not match.");const a=document.getElementById("errors");if(a.innerHTML="",e.length>0){a.innerHTML=e.map(i=>`
                <div class="error">
                    ${i}
                </div>
            `).join("");return}if((await(await fetch(`/check-email?email=${encodeURIComponent(r)}`)).json()).exists){a.innerHTML=`
                <div class="error">
                    Email is already taken.
                </div>
            `;return}document.getElementById("register-form").submit()})});
