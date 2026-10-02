'use strict';
// A free static checkout: real WhatsApp collection requests + explicitly labelled local payment previews.
// This never collects card details, opens payment apps, claims a real charge, or sends money.
const checkoutDialog=document.getElementById('checkout-dialog');
const payButton=document.getElementById('pay-button');
const paymentStatus=document.getElementById('payment-status');
const paymentDetail=document.getElementById('payment-detail');
const collectionSend=document.getElementById('collection-send');
const qrContainer=document.getElementById('payment-qr');
const paymentReset=document.getElementById('payment-reset');
const disclosure=document.getElementById('preview-disclosure');
const paymentNames={card:'Credit / debit card',gpay:'Google Pay',phonepe:'PhonePe',paytm:'Paytm'};
let selectedMethod='collection',previewTimer;
function collectionMessage(){return basketMessage()+'\n\nPayment preference: Pay on collection. Please confirm my order before I visit.';}
function resetPreview(){clearTimeout(previewTimer);payButton.disabled=false;paymentStatus.textContent='';paymentReset.hidden=true;}
function selectPayment(method){
 resetPreview();selectedMethod=method;
 const isPreview=Boolean(paymentNames[method]);
 payButton.hidden=!isPreview;collectionSend.hidden=isPreview;disclosure.hidden=!isPreview;qrContainer.hidden=method!=='qr';
 collectionSend.href=waLink(collectionMessage());
 if(method==='collection'){
  paymentDetail.textContent='No online payment needed. Send the list to our team, wait for confirmation, then pay when you collect your groceries.';
  collectionSend.textContent='Request order · pay on collection';
 }else if(method==='qr'){
  paymentDetail.textContent='Scan with your phone camera to open this shopping list in WhatsApp. This is an order-request QR, not a payment QR. No money is transferred.';
  collectionSend.textContent='Or open WhatsApp on this device';
  try{const code=qrcode(0,'M');code.addData(waLink(collectionMessage()));code.make();qrContainer.innerHTML=code.createSvgTag({cellSize:4,margin:16,scalable:true});const svg=qrContainer.querySelector('svg');svg.setAttribute('role','img');svg.setAttribute('aria-label','Scan to open this shopping list in WhatsApp');}
  catch{qrContainer.textContent='Use the WhatsApp button below to continue on your phone.';}
 }else if(method==='card'){
  paymentDetail.innerHTML='<div class="preview-card"><span>NILA · PAYMENT PREVIEW</span><strong>•••• &nbsp; •••• &nbsp; •••• &nbsp; 4242</strong><small>Example card · no card information required</small></div><p>Try the checkout interaction with this example card. No real card details are requested or processed.</p>';
  payButton.textContent='Preview card payment · '+money(total());
 }else{
  paymentDetail.textContent='See how a '+paymentNames[method]+' payment would finish. This preview stays on the website and does not launch the app or transfer money.';
  payButton.textContent='Preview '+paymentNames[method]+' · '+money(total());
 }
}
function openCheckout(){
 if(!basket.size)return;
 cartDialog.close();
 document.getElementById('checkout-summary').textContent=products.filter(p=>basket.has(p.id)).map(p=>`${basket.get(p.id)} × ${p.name} (${p.unit})`).join('\n');
 document.getElementById('checkout-total').textContent=money(total());
 document.querySelector('[name="payment-method"][value="collection"]').checked=true;
 selectPayment('collection');
 document.getElementById('payment-help').href=waLink('Hello Nila Supermarket! I need help with my shopping list and collection.');
 checkoutDialog.showModal();
}
document.getElementById('checkout-open').addEventListener('click',openCheckout);
document.getElementById('checkout-close').addEventListener('click',()=>checkoutDialog.close());
checkoutDialog.addEventListener('close',resetPreview);
document.querySelectorAll('[name="payment-method"]').forEach(input=>input.addEventListener('change',()=>selectPayment(input.value)));
payButton.addEventListener('click',()=>{
 if(payButton.disabled||!paymentNames[selectedMethod])return;
 payButton.disabled=true;paymentReset.hidden=true;
 paymentStatus.textContent='Showing the '+paymentNames[selectedMethod]+' payment preview…';
 const method=selectedMethod,amount=money(total());
 previewTimer=setTimeout(()=>{paymentStatus.textContent='Preview completed · '+amount+' via '+paymentNames[method]+'. No payment was made and no order was placed. Choose Pay on collection to send an actual order request.';payButton.hidden=true;payButton.disabled=false;paymentReset.hidden=false;},700);
});
paymentReset.addEventListener('click',()=>{selectPayment(selectedMethod);payButton.focus();});
collectionSend.addEventListener('click',()=>{paymentStatus.textContent='Continue in WhatsApp and send the message yourself. Your order is not confirmed until the store replies.';});
