
  // ==========================================================
// Ceylon Artisanal Cinnamon - Interactive Store & Cart Logic
// File: script.js
// ==========================================================

let cart = [];
const deliveryFee = 350;

// Cart Drawer විවෘත කිරීම සහ වැසීම
const cartOverlay = document.getElementById('cartOverlay');
const cartOpenBtn = document.getElementById('cartOpenBtn');
const cartCloseBtn = document.getElementById('cartCloseBtn');

if (cartOpenBtn) {
  cartOpenBtn.addEventListener('click', () => {
    cartOverlay.classList.add('active');
    renderCart();
  });
}

if (cartCloseBtn) {
  cartCloseBtn.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
  });
}

// පිටත ක්ලික් කළ විට Drawer එක වැසීම
if (cartOverlay) {
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove('active');
    }
  });
}

// Add Item to Cart
function addToCart(productName, price) {
  const existingIndex = cart.findIndex(item => item.name === productName);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ name: productName, price: price, qty: 1 });
  }
  updateBadge();
  showToast(`"${productName}" සාර්ථකව කරත්තයට එකතු කරන ලදී! 🌿`);
}

// Quick Buy Action
function quickBuy(productName, price) {
  addToCart(productName, price);
  cartOverlay.classList.add('active');
  renderCart();
}

// Remove Item from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateBadge();
  renderCart();
}

// Update Cart Badge Count
function updateBadge() {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.innerText = totalCount;
  }
}

// Render Cart Items & Total in Drawer
function renderCart() {
  const cartList = document.getElementById('cartItemsList');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `<p style="color: #888; text-align: center; padding: 24px 0;">ඔබගේ කරත්තය හිස්ව පවතී (Your cart is empty).</p>`;
    if (cartSubtotal) cartSubtotal.innerText = 'Rs. 0';
    if (cartTotal) cartTotal.innerText = 'Rs. 0';
    return;
  }

  let subtotal = 0;
  cartList.innerHTML = '';

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';
    itemRow.innerHTML = `
      <div>
        <span class="cart-item-name">${item.name}</span>
        <div style="font-size: 12px; color: #777;">Rs. ${item.price.toLocaleString()} × ${item.qty}</div>
      </div>
      <div>
        <span class="cart-item-price">Rs. ${itemTotal.toLocaleString()}</span>
        <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove item">✕ ඉවත් කරන්න</button>
      </div>
    `;
    cartList.appendChild(itemRow);
  });

  const finalTotal = subtotal + deliveryFee;
  if (cartSubtotal) cartSubtotal.innerText = `Rs. ${subtotal.toLocaleString()}`;
  if (cartTotal) cartTotal.innerText = `Rs. ${finalTotal.toLocaleString()}`;
}

// Handle Order Placement & Checkout Submission
function handlePlaceOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert('කරුණාකර ඇණවුම් කිරීමට පෙර නිෂ්පාදනයක් තෝරන්න (Please select a product first).');
    return;
  }

  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Card';

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = subtotal + deliveryFee;

  // Confirmation Alert
  alert(`🎉 ස්තූතියි ${name}!\nඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී.\n\nමුළු මුදල: Rs. ${total.toLocaleString()}\nගෙවීම් ක්‍රමය: ${paymentMethod}\nදුරකථන අංකය: ${phone}\nලිපිනය: ${address}\n\nඅපගේ නියෝජිතයෙකු කෙටි වේලාවකින් ඔබ හා සම්බන්ධ වනු ඇත!`);

  // Reset Cart and form
  cart = [];
  updateBadge();
  document.getElementById('orderForm').reset();
  cartOverlay.classList.remove('active');
}

// Toast notification helper
function showToast(msg) {
  const toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.backgroundColor = '#4A2411';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '14px';
  toast.style.transition = 'opacity 0.3s ease';

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
})();
