const KEY="elvaret_clients_v1";let clients=JSON.parse(localStorage.getItem(KEY)||"[]");
const $=id=>document.getElementById(id);
function saveDB(){localStorage.setItem(KEY,JSON.stringify(clients));render()}
function money(n){return new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN"}).format(n||0)}
function render(){
 const q=$("search").value.toLowerCase();
 const list=clients.filter(c=>[c.name,c.phone,c.city,c.car,c.reg,c.service].join(" ").toLowerCase().includes(q));
 $("clientsCount").textContent=clients.length;
 $("visitsCount").textContent=clients.length;
 $("revenue").textContent=money(clients.reduce((s,c)=>s+(+c.price||0),0));
 $("clients").innerHTML=list.length?list.map((c,i)=>`<article class="card"><h3>${esc(c.name)}</h3><div class="muted">📞 ${esc(c.phone)} ${c.city?"• "+esc(c.city):""}</div><p>🚗 <b>${esc(c.car)}</b> • ${esc(c.reg)}</p><p>🧽 ${esc(c.service)}<br>📅 ${esc(c.date)} <span class="price">${money(c.price)}</span></p><div class="actions"><a href="tel:${esc(c.phone)}">📞 Zadzwoń</a><button onclick="delClient(${i})">Usuń</button></div></article>`).join(""):`<div class="empty">Brak klientów.<br>Dodaj pierwszego klienta przyciskiem <b>+ Klient</b>.</div>`;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function delClient(i){if(confirm("Usunąć tego klienta?")){clients.splice(i,1);saveDB()}}
$("addBtn").onclick=()=>{$("modal").classList.remove("hidden");$("date").value=new Date().toISOString().slice(0,10)}
$("cancel").onclick=()=>$("modal").classList.add("hidden")
$("search").oninput=render
$("save").onclick=()=>{
 const c={name:$("name").value.trim(),phone:$("phone").value.trim(),city:$("city").value.trim(),car:$("car").value.trim(),reg:$("reg").value.trim(),service:$("service").value.trim(),price:+$("price").value||0,date:$("date").value};
 if(!c.name){alert("Podaj imię i nazwisko");return}
 clients.unshift(c);saveDB();$("modal").classList.add("hidden");
 ["name","phone","city","car","reg","service","price","date"].forEach(id=>$(id).value="")
}
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
render();
