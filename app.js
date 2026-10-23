// Ubah harga dan nama paket pada daftar ini. Harga adalah harga jual usulan dan perlu disesuaikan dengan modal/resource.
const PACKAGES = [
  {id:"ram1",name:"Panel 1 GB",ram:1,price:1000,category:"bot",description:"Untuk bot ringan dan uji coba.",icon:"⌁"},
  {id:"ram2",name:"Panel 2 GB",ram:2,price:2000,category:"bot",description:"Bot kecil dan aplikasi ringan.",icon:"⌘"},
  {id:"ram3",name:"Panel 3 GB",ram:3,price:3000,category:"bot",description:"Untuk beberapa proses ringan.",icon:"⌘"},
  {id:"ram4",name:"Panel 4 GB",ram:4,price:4000,category:"bot",description:"Pilihan seimbang untuk aplikasi.",icon:"▤"},
  {id:"ram5",name:"Panel 5 GB",ram:5,price:5000,category:"bot",description:"Resource lebih lega untuk bot.",icon:"▤"},
  {id:"ram6",name:"Panel 6 GB",ram:6,price:6000,category:"game",description:"Untuk kebutuhan game kecil, jika didukung.",icon:"✣"},
  {id:"ram7",name:"Panel 7 GB",ram:7,price:7000,category:"game",description:"Resource tambahan untuk game.",icon:"✣"},
  {id:"ram8",name:"Panel 8 GB",ram:8,price:8000,category:"game",description:"Untuk server game yang lebih besar.",icon:"✣"},
  {id:"ram9",name:"Panel 9 GB",ram:9,price:9000,category:"game",description:"Konfirmasi CPU dan disk sebelum order.",icon:"◈"},
  {id:"ram10",name:"Panel 10 GB",ram:10,price:10000,category:"game",description:"Kapasitas besar, bergantung resource.",icon:"◈"},
  {id:"unlimited",name:"Panel Unlimited",ram:null,price:10000,category:"bot",description:"Batas resource wajib dikonfirmasi admin.",icon:"∞",featured:true},
  {id:"reseller",name:"Reseller Panel",ram:null,price:10000,category:"bot",description:"Akses reseller sesuai ketentuan penyedia.",icon:"♙"},
  {id:"adp",name:"Admin Panel (ADP)",ram:null,price:15000,category:"bot",description:"Hanya jika hak admin tersedia secara resmi.",icon:"⬡"}
];
const money = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
const productRoot = document.querySelector("#products");
const packageSelect = document.querySelector("#packageSelect");
const selectedPrice = document.querySelector("#selectedPrice");
const form = document.querySelector("#orderForm");
const toast = document.querySelector("#toast");
let activeFilter = "all";
function showToast(message){toast.textContent=message;toast.classList.add("show");window.setTimeout(()=>toast.classList.remove("show"),3800)}
function renderProducts(){
  productRoot.innerHTML="";
  PACKAGES.filter(p=>activeFilter==="all"||p.category===activeFilter).forEach(p=>{
    const card=document.createElement("article");
    card.className="product"+(p.featured?" featured":"");
    card.innerHTML=`<div class="p-icon">${p.icon}</div><h3>${p.name}</h3><p>${p.description}</p><div class="price">${money(p.price)} <small>/ konfirmasi durasi</small></div><button type="button" data-select="${p.id}">Pilih paket ↗</button>`;
    productRoot.appendChild(card);
  });
}
function renderSelect(){
  packageSelect.innerHTML='<option value="">Pilih paket</option>';
  PACKAGES.forEach(p=>{const option=document.createElement("option");option.value=p.id;option.textContent=`${p.name} — ${money(p.price)}`;packageSelect.appendChild(option)});
}
function updatePrice(){
  const p=PACKAGES.find(x=>x.id===packageSelect.value);
  selectedPrice.textContent=p?money(p.price):"Pilih paket";
}
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
  activeFilter=btn.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.toggle("active",b===btn));
  renderProducts();
}));
productRoot.addEventListener("click",e=>{
  const btn=e.target.closest("[data-select]");
  if(!btn)return;
  packageSelect.value=btn.dataset.select;updatePrice();
  document.querySelector("#pesan").scrollIntoView({behavior:"smooth"});
});
packageSelect.addEventListener("change",updatePrice);
form.addEventListener("submit",e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form).entries());
  const pkg=PACKAGES.find(p=>p.id===data.package);
  if(!pkg){showToast("Pilih paket terlebih dahulu.");return}
  const orderId="NSP-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+Math.random().toString(36).slice(2,7).toUpperCase();
  const message=[
    "PESANAN BARU — NOVASTRIA PANEL",
    "Nomor order: "+orderId,
    "Nama: "+data.customer,
    "Email: "+data.email,
    "WhatsApp: "+data.whatsapp,
    "Paket: "+pkg.name,
    "Harga tertera: "+money(pkg.price),
    "Penggunaan: "+data.use,
    "Catatan: "+(data.notes||"-"),
    "",
    "Mohon konfirmasi ketersediaan, durasi, batas resource, harga akhir, dan instruksi pembayaran. Belum ada pembayaran yang dilakukan."
  ].join("\n");
  const blob=new Blob([message],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=orderId+".txt";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
  const wa=prompt("Ringkasan order sudah diunduh. Masukkan nomor WhatsApp admin (format internasional tanpa +, contoh 62812xxxx) untuk membuka chat, atau tekan Batal.");
  if(wa && /^\d{8,16}$/.test(wa.trim())){
    window.open("https://wa.me/"+wa.trim()+"?text="+encodeURIComponent(message),"_blank","noopener");
  }else{
    showToast("Ringkasan pesanan diunduh. Kirim file/teks itu ke admin untuk konfirmasi.");
  }
});
document.querySelector("#year").textContent=new Date().getFullYear();
renderProducts();renderSelect();updatePrice();
