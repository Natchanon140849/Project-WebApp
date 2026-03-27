const j=(k,v)=>v===undefined?JSON.parse(localStorage.getItem(k)||"[]"):localStorage.setItem(k,JSON.stringify(v));
const getCart=()=>j("cart"),saveCart=v=>j("cart",v),getOrders=()=>j("orders"),saveOrders=v=>j("orders",v);
const getReviews=()=>j("reviews"),saveReviews=v=>j("reviews",v);

const money=n=>`${+n||0} THB`;
const oldSelected=x=>[
  ...(x.protein?[{group:"Protein",label:x.protein,price:0}]:[]),
  ...((x.extras||[]).map(e=>({group:"Add-on",label:e.name,price:+e.price||0}))),
  ...((x.ingredients||[]).map(i=>({group:"Ingredient",label:i.name,price:+i.price||0})))
];
const selectedOf=x=>x.selectedOptions||oldSelected(x);
const sumSelected=x=>selectedOf(x).reduce((s,o)=>s+(+o.price||0),0);

const norm=x=>{
  const qty=Math.max(1,+x.qty||1),base=+(x.basePrice??x.price??0),selectedOptions=selectedOf(x),unit=base+sumSelected(x);
  return {...x,qty,basePrice:base,selectedOptions,unitPrice:unit,totalPrice:unit*qty};
};
const normCart=()=>{const c=getCart().map(norm);saveCart(c);return c};

const itemLabel=x=>[x.name,...selectedOf(x).filter(o=>(+o.price||0)>0).map(o=>o.label)].join(" + ");
const itemNotes=x=>selectedOf(x).map(o=>`${o.group}: ${o.label}${(+o.price||0)?` (+${o.price} THB)`:""}`);
const cartCount=()=>getCart().reduce((s,x)=>s+(+x.qty||0),0);
const updateBadges=()=>document.querySelectorAll(".js-cart-count").forEach(x=>x.textContent=cartCount());
const starText=n=>"★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n);

function addBasicItem(item){
  const c=getCart(),f=c.find(x=>x.name===item.name&&!selectedOf(x).length);
  if(f){f.qty=(+f.qty||1)+1;Object.assign(f,norm(f))}
  else c.push(norm({...item,qty:1,basePrice:item.price,selectedOptions:[]}));
  saveCart(c);updateBadges();
}
function setQty(i,qty){
  const c=normCart();if(!c[i])return c;
  if(qty<=0)c.splice(i,1);else c[i]=norm({...c[i],qty});
  saveCart(c);updateBadges();return c;
}
function pushOrder(method,paymentInfo={}){
  const items=normCart();if(!items.length)return null;
  const o={id:`ORD-${Date.now()}`,items,total:items.reduce((s,x)=>s+x.totalPrice,0),method,paymentDetail:paymentInfo.summary||"",status:"PENDING",time:new Date().toLocaleString("en-GB"),paidAt:new Date().toISOString()};
  saveOrders([o,...getOrders()]);saveCart([]);updateBadges();return o;
}
const statusBadge=s=>s==="PENDING"?"badge-ghost":s==="COOKING"?"badge-warning":"badge-success";

const getReview=reviewKey=>getReviews().find(x=>x.reviewKey===reviewKey);
const menuReviews=itemName=>getReviews().filter(x=>x.itemName===itemName);
const avgReview=itemName=>{const a=menuReviews(itemName);return a.length?(a.reduce((s,x)=>s+(+x.stars||0),0)/a.length).toFixed(1):"0.0"};
function addReview({reviewKey,orderId,itemName,itemLabel,stars,text}){
  const a=getReviews(),r={reviewKey,orderId,itemName,itemLabel,stars:+stars,text:text.trim(),time:new Date().toLocaleString("en-GB")},i=a.findIndex(x=>x.reviewKey===reviewKey);
  if(i>-1)a[i]=r;else a.unshift(r);
  saveReviews(a);return r;
}

setInterval(()=>{
  const a=getOrders();let changed=false;
  a.forEach(x=>{if(x.status==="PENDING"){x.status="COOKING";changed=true}else if(x.status==="COOKING"){x.status="DONE";changed=true}});
  if(changed)saveOrders(a);
},5000);