
// ===== Store =====
function getCart(){return JSON.parse(localStorage.getItem("cart")||"[]")}
function saveCart(c){localStorage.setItem("cart",JSON.stringify(c))}
function getOrders(){return JSON.parse(localStorage.getItem("orders")||"[]")}
function saveOrders(o){localStorage.setItem("orders",JSON.stringify(o))}

// ===== Status Color =====
function statusBadge(status){
  if(status==="PENDING") return "badge-ghost";
  if(status==="COOKING") return "badge-warning";
  if(status==="DONE") return "badge-success";
  return "badge";
}

// ===== Mock Progress =====
function tickStatus(){
  const orders=getOrders();
  let changed=false;
  orders.forEach(o=>{
    if(o.status==="PENDING"){ o.status="COOKING"; changed=true; }
    else if(o.status==="COOKING"){ o.status="DONE"; changed=true; }
  });
  if(changed) saveOrders(orders);
}
setInterval(tickStatus, 5000);
