// Products Data
const products = [
  {
    id: "1",
    name: "Trufa de Maracujá",
    ingredients: [
      "Chocolate ao leite",
      "Ganache de Polpa de maracujá",
    ],
    price: 3.5,
    image:
      "https://i.pinimg.com/736x/b4/23/db/b423db7866b5e3e3e61be9c7fbadf6b5.jpg",
  },
  {
    id: "2",
    name: "Trufa Tradicional",
    ingredients: [
      "Chocolate ao leite",
      "Ganache de chocolate meio amargo",
    ],
    price: 3.5,
    image:
      "https://i.pinimg.com/736x/2b/7c/25/2b7c258f2bc92ae6ef43558a3d5ebedf.jpg",
  },
  {
    id: "3",
    name: "Trufa de Morango",
    ingredients: [
      "Chocolate ao leite",
      "Mousse de morango",
    ],
    price: 3.5,
    image:
      "https://i.pinimg.com/736x/7a/66/aa/7a66aa0b300d07b0648562bd1e6fd808.jpg",
  },
  {
    id: "4",
    name: "Trufa de Beijinho",
    ingredients: [
      "Chocolate ao leite",
      "Beijinho",
    ],
    price: 3.5,
    image:
      "https://i.pinimg.com/1200x/74/83/6d/74836d34dc249b1a83d2dc989e958d90.jpg",
  },
  {
    id: "5",
    name: "Trufa de chocolate branco com Maracujá",
    ingredients: [
      "Chocolate branco",
      "Ganache de maracujá",
    ],
    price: 3.5,
    image:
      "./assets/fotos/Trufa-de-chocolate-branco-maracuja.png",
  },
  {
    id: "6",
    name: "Trufa de chocolate branco com Morango",
    ingredients: [
      "Chocolate Branco",
      "mousse de morango",
    ],
    price: 3.5,
    image:
      "assets/fotos/Trufa-de-chocolate-branco-morango.png",
  },
];

// Cart State
let cart = [];
let hasShownPromo = false;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

// Render Products
function renderProducts() {
  const grid = document.getElementById("productsGrid");

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <div class="product-image-wrapper">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-image-overlay"></div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <div>
          <p class="product-ingredients-label">Ingredientes:</p>
          <p class="product-ingredients">${product.ingredients.join(", ")}</p>
        </div>
        <div class="product-footer">
          <div class="product-price-wrapper">
            <p class="product-price">R$ ${product.price.toFixed(2)}</p>
            <p class="product-price-label">por unidade</p>
          </div>
          <button class="add-btn" onclick="addToCart('${product.id}')">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Add to Cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  showToast(`${product.name} adicionada ao carrinho!`, "success");
  updateCart();
}

// Update Cart Display
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calculate promo
  const combos = Math.floor(totalItems / 3);
  const remainingItems = totalItems % 3;
  const comboPrice = 10.0;
  const singlePrice = 3.5;
  const total = combos * comboPrice + remainingItems * singlePrice;
  const discount = subtotal - total;
  const hasPromo = combos > 0;

  // Update badge
  const badge = document.getElementById("cartBadge");
  if (totalItems > 0) {
    badge.textContent = totalItems;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }

  // Update floating cart
  const floatingCart = document.getElementById("floatingCart");
  if (totalItems > 0) {
    floatingCart.style.display = "block";

    const itemsText = document.getElementById("cartItemsText");
    itemsText.textContent = `${totalItems} ${totalItems === 1 ? "trufa" : "trufas"} no carrinho`;

    const savingsEl = document.getElementById("cartSavings");
    if (discount > 0) {
      savingsEl.textContent = `Economia: R$ ${discount.toFixed(2)}`;
      savingsEl.style.display = "block";
    } else {
      savingsEl.style.display = "none";
    }

    const totalEl = document.getElementById("cartTotal");
    totalEl.textContent = `R$ ${total.toFixed(2)}`;

    const promoNotification = document.getElementById("promoNotification");
    if (hasPromo) {
      promoNotification.style.display = "block";
      if (!hasShownPromo) {
        hasShownPromo = true;
        showToast("🎉 Combo ativado! Você está economizando!", "success");
      }
    } else {
      promoNotification.style.display = "none";
      hasShownPromo = false;
    }
  } else {
    floatingCart.style.display = "none";
  }
}

// Update Quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((item) => item.id !== productId);
  }

  updateCart();
  renderModalItems();
}

// Remove Item
function removeItem(productId) {
  cart = cart.filter((item) => item.id !== productId);
  showToast("Item removido do carrinho", "error");
  updateCart();
  renderModalItems();
}

// Open Modal
function openModal() {
  document.getElementById("modalOverlay").style.display = "block";
  document.getElementById("orderModal").style.display = "flex";
  document.body.style.overflow = "hidden";
  renderModalItems();
}

// Close Modal
function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
  document.getElementById("orderModal").style.display = "none";
  document.body.style.overflow = "";
}

// Render Modal Items
function renderModalItems() {
  const modalBody = document.getElementById("modalBody");
  const modalFooter = document.getElementById("modalFooter");

  if (cart.length === 0) {
    modalBody.innerHTML =
      '<div class="empty-cart"><p>Seu carrinho está vazio</p></div>';
    modalFooter.style.display = "none";
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const combos = Math.floor(totalItems / 3);
  const remainingItems = totalItems % 3;
  const total = combos * 10.0 + remainingItems * 3.5;
  const discount = subtotal - total;

  let html = '<div class="modal-items">';

  cart.forEach((item) => {
    html += `
      <div class="modal-item">
        <div class="modal-item-info">
          <h3 class="modal-item-name">${item.name}</h3>
          <p class="modal-item-price">R$ ${item.price.toFixed(2)} cada</p>
        </div>
        
        <div class="modal-item-controls">
          <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">
            <svg viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-item-total">
          R$ ${(item.price * item.quantity).toFixed(2)}
        </div>
        
        <button class="remove-btn" onclick="removeItem('${item.id}')">
          <svg viewBox="0 0 24 24" fill="none">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  });

  html += "</div>";

  html += '<div class="modal-summary">';
  html += `<div class="summary-row"><span>Subtotal</span><span>R$ ${subtotal.toFixed(2)}</span></div>`;

  if (discount > 0) {
    html += `<div class="summary-row discount"><span>Desconto (Combo 3x)</span><span>- R$ ${discount.toFixed(2)}</span></div>`;
  }

  html += `<div class="summary-row total"><span>Total</span><span>R$ ${total.toFixed(2)}</span></div>`;
  // Input de nome do usuário logo abaixo do total
  html += `<div id="userNameInputWrapper" style="margin-top: 16px;">
    <label for="userNameInput" style="font-weight: bold;">Seu nome:</label>
    <input type="text" id="userNameInput" placeholder="Digite seu nome" style="width: 100%; padding: 16px; margin-top: 4px; border-radius: 4px; border: 1px solid #ccc; font-size: 1rem;" />
  </div>`;
  html += "</div>";

  modalBody.innerHTML = html;
  modalFooter.style.display = "block";
}

// Confirm Order
function confirmOrder() {
  // Pega o nome do usuário
  const userNameInput = document.getElementById("userNameInput");
  const userName = userNameInput ? userNameInput.value.trim() : "";
  if (!userName) {
    showToast("Por favor, digite seu nome para continuar.", "error");
    if (userNameInput) userNameInput.focus();
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const combos = Math.floor(totalItems / 3);
  const remainingItems = totalItems % 3;
  const total = combos * 10.0 + remainingItems * 3.5;

  // Monta mensagem dos produtos
  const cartItems = cart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$${(item.price * item.quantity).toFixed(2)}`;
    })
    .join("\n");

  // Monta mensagem final
  const message = encodeURIComponent(
    `Usuário: ${userName}\nProdutos:\n${cartItems}\nTotal: R$${total.toFixed(2)}`,
  );
  const phone = "67981547862";
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  showToast(
    "🎉 Pedido encaminhado para o WhatsApp!",
    "success",
    `Total: R$ ${total.toFixed(2)}`,
  );

  cart = [];
  hasShownPromo = false;
  updateCart();
  closeModal();
}

// Show Toast
function showToast(message, type = "success", description = "") {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icon = type === "success" ? "✓" : "✕";

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
      ${description ? `<div class="toast-description">${description}</div>` : ""}
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease-out forwards";
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 4000);
}

// Add fadeOut animation
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeOut {
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(style);
