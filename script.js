'use strict';
const config=window.NILA_CONFIG||{};
const products=window.NILA_PRODUCTS;
const money=value=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
const waLink=text=>'https://wa.me/'+config.whatsappNumber+'?text='+encodeURIComponent(text);
const basket=new Map();
const categoryNames={fresh:'Fresh produce',pantry:'Pantry',dairy:'Dairy & bakery',home:'Home care'};
let category='all',feedbackTimer;
const grid=document.getElementById('product-grid'),cartDialog=document.getElementById('cart-dialog'),dialog=document.getElementById('enquiry-dialog');
function total(){return products.reduce((sum,p)=>sum+p.price*(basket.get(p.id)||0),0);}
function renderProducts(){
 const query=document.getElementById('product-search').value.trim().toLowerCase();
 const shown=products.filter(p=>(category==='all'||p.category===category)&&(p.name+' '+p.unit+' '+categoryNames[p.category]).toLowerCase().includes(query));
 grid.innerHTML=shown.map(p=>`<article class="product-card"><div class="product-category ${p.category}">${categoryNames[p.category]}</div><span class="offer-label">${p.label}</span><h3>${p.name}</h3><p class="product-detail">${p.detail}</p><p class="product-unit">${p.unit}</p><div class="product-bottom"><strong>${money(p.price)}</strong><button class="add-product" data-add="${p.id}" aria-label="Add ${p.name} to shopping list">Add to list</button></div></article>`).join('');
 document.getElementById('no-products').hidden=shown.length>0;document.getElementById('product-count').textContent=shown.length+' '+(shown.length===1?'essential':'essentials');
}
function setCategory(value){category=value;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===value)));renderProducts();}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.filter)));
document.querySelectorAll('[data-category]').forEach(a=>a.addEventListener('click',()=>{document.getElementById('product-search').value='';setCategory(a.dataset.category);}));
document.getElementById('product-search').addEventListener('input',renderProducts);
function basketMessage(){return 'Hello Nila Supermarket! Please confirm availability for my shopping list:\n\n'+products.filter(p=>basket.has(p.id)).map(p=>`${basket.get(p.id)} × ${p.name} (${p.unit}) — ${money(p.price*basket.get(p.id))}`).join('\n')+'\n\nEstimated subtotal: '+money(total())+'\nPlease confirm final prices, collection or delivery and payment options.';}
function renderBasket(){
 const count=[...basket.values()].reduce((a,b)=>a+b,0);document.querySelectorAll('.cart-count').forEach(el=>el.textContent=count);
 document.getElementById('cart-items').innerHTML=count?products.filter(p=>basket.has(p.id)).map(p=>`<div class="cart-row"><div><h3>${p.name}</h3><p>${p.unit} · ${money(p.price)} each</p></div><div class="quantity"><button data-change="${p.id}" data-step="-1" aria-label="Remove one ${p.name}">−</button><span aria-label="Quantity">${basket.get(p.id)}</span><button data-change="${p.id}" data-step="1" aria-label="Add one ${p.name}" ${basket.get(p.id)>=99?'disabled':''}>+</button></div><strong>${money(p.price*basket.get(p.id))}</strong></div>`).join(''):'<p class="empty-list">Your list is waiting for something good.<br>Browse our essentials and add what you need.</p>';
 document.getElementById('cart-total').textContent=money(total());document.getElementById('checkout-open').hidden=!count;
 const send=document.getElementById('cart-send');send.hidden=!count;if(count)send.href=waLink(basketMessage());else send.removeAttribute('href');
}
document.querySelectorAll('.basket-open').forEach(b=>b.addEventListener('click',()=>{renderBasket();cartDialog.showModal();}));
for(const id of ['close-cart','continue-shopping'])document.getElementById(id).addEventListener('click',()=>cartDialog.close());
grid.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;const product=products.find(p=>p.id===button.dataset.add),q=basket.get(product.id)||0;if(q>=99)return;basket.set(product.id,q+1);renderBasket();const feedback=document.getElementById('cart-feedback');feedback.textContent=product.name+' added to your list';feedback.classList.add('show');clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>feedback.classList.remove('show'),2200);});
document.getElementById('cart-items').addEventListener('click',event=>{const b=event.target.closest('[data-change]');if(!b)return;const id=b.dataset.change,next=(basket.get(id)||0)+Number(b.dataset.step);if(next>99)return;if(next<=0)basket.delete(id);else basket.set(id,next);renderBasket();const same=document.querySelector(`[data-change="${id}"][data-step="${b.dataset.step}"]`);(same||document.getElementById('close-cart')).focus();});
function review(title,description,message){document.getElementById('dialog-title').textContent=title;document.getElementById('dialog-description').textContent=description;document.getElementById('dialog-detail').textContent=message;document.getElementById('enquiry-send').href=waLink(message);dialog.showModal();}
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
for(const modal of [dialog,cartDialog])modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();}});
function safeHttps(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}}
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{const action=b.dataset.action;if(action==='payment'){renderBasket();cartDialog.showModal();}else if(action==='whatsapp'||action==='directions'){window.open(waLink(action==='directions'?'Hello! Please share the exact store location and directions.':'Hello Nila Supermarket! I would like to enquire about products or local delivery.'),'_blank','noopener,noreferrer');}else{const url=safeHttps(config[action+'Url']);if(url)window.open(url,'_blank','noopener,noreferrer');}}));
document.getElementById('enquiry-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);for(const name of ['name','message']){const field=form.elements.namedItem(name);if(!String(data.get(name)).trim()){field.setCustomValidity('Please enter a value, not only spaces.');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return;}}review('Your enquiry','Check your details, then continue to WhatsApp to send your message.','Hello Nila Supermarket!\n\nName: '+String(data.get('name')).trim()+'\nPhone: '+data.get('phone')+(data.get('email')?'\nEmail: '+data.get('email'):'')+'\n\n'+String(data.get('message')).trim());document.getElementById('form-status').textContent='Your message is ready to review. Nothing has been sent yet.';});
const chatButton=document.getElementById('chat-launch'),chatPanel=document.getElementById('chat-panel');
function setChat(open){chatPanel.hidden=!open;chatButton.setAttribute('aria-expanded',String(open));(open?document.getElementById('close-chat'):chatButton).focus();}
chatButton.addEventListener('click',()=>setChat(chatPanel.hidden));document.getElementById('close-chat').addEventListener('click',()=>setChat(false));chatPanel.addEventListener('keydown',e=>{if(e.key==='Escape')setChat(false);});
const replies={hours:'We’re open every day, from 8 am to 9 pm.',delivery:'Share your location and shopping list on WhatsApp. Our team will confirm delivery availability and charges.',orders:'Add essentials to your shopping list. Continue to checkout for collection, or send your list on WhatsApp for delivery enquiries.'};
document.querySelectorAll('[data-reply]').forEach(b=>b.addEventListener('click',()=>document.getElementById('chat-reply').textContent=replies[b.dataset.reply]));
if(/^[a-f0-9]{24}$/i.test(config.tawkPropertyId||'')&&/^[a-zA-Z0-9]+$/.test(config.tawkWidgetId||'')){window.Tawk_API=window.Tawk_API||{};window.Tawk_LoadStart=new Date();window.Tawk_API.onLoad=()=>{chatButton.hidden=true;chatPanel.hidden=true;};const s=document.createElement('script');s.async=true;s.src='https://embed.tawk.to/'+config.tawkPropertyId+'/'+config.tawkWidgetId;document.head.appendChild(s);}
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.fade').forEach(el=>observer.observe(el));}
renderProducts();renderBasket();
