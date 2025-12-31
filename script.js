// --- Data ------------------------------------------------------------------

const products = [
  // Mobiles
  {
    id: "m1",
    name: "GeoPhone X1",
    category: "mobile",
    description: "6.5\" AMOLED, 5G, 128GB storage, 5000mAh battery.",
    price: 18999,
    icon: "📱",
    image:
      "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Bestseller",
  },
  {
    id: "m2",
    name: "GeoPhone Lite",
    category: "mobile",
    description: "6.1\" display, 64GB storage, all‑day battery.",
    price: 10999,
    icon: "📱",
    image:
      "lit.jpg",
    tag: "Value pick",
  },
  {
    id: "m3",
    name: "GeoPhone Max Pro",
    category: "mobile",
    description: "120Hz display, 256GB storage, triple camera setup.",
    price: 25999,
    icon: "📱",
    image:
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "New",
  },
  // Laptops
  {
    id: "l1",
    name: "GeoBook Air 14",
    category: "laptop",
    description: "Thin & light, 14\" FHD, 8GB RAM, 512GB SSD.",
    price: 52999,
    icon: "💻",
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    tag: "Student fav",
  },
  {
    id: "l2",
    name: "GeoBook Creator 15",
    category: "laptop",
    description: "15.6\" IPS, 16GB RAM, 1TB SSD, dedicated graphics.",
    price: 81999,
    icon: "💻",
    image:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Creator",
  },
  {
    id: "l3",
    name: "GeoBook Business 13",
    category: "laptop",
    description: "13\" compact, fingerprint login, 16GB RAM.",
    price: 68999,
    icon: "💻",
    image:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    tag: "Office",
  },
  // Electronics
  {
    id: "e1",
    name: "GeoBuds Pro",
    category: "electronics",
    description: "TWS earbuds with ANC and 30 hours battery.",
    price: 3999,
    icon: "🎧",
    image:
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Hot",
  },
  {
    id: "e2",
    name: "GeoWatch Active",
    category: "electronics",
    description: "AMOLED smartwatch with health tracking.",
    price: 5999,
    icon: "⌚",
    image:
      "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800",
    tag: "Fitness",
  },
  {
    id: "e3",
    name: "GeoSound Bar 2.1",
    category: "electronics",
    description: "Bluetooth soundbar with subwoofer.",
    price: 7999,
    icon: "🔊",
    image:
      "soundbar.jpg",
    tag: "Home",
  },
];

// In‑memory state
let cart = [];
let savedAddress = null;
let orderConfirmed = false;

// --- Helpers ----------------------------------------------------------------

const formatMoney = (value) =>
  `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function findProduct(id) {
  return products.find((p) => p.id === id) || null;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- Product Rendering ------------------------------------------------------

function renderProducts(category = "all") {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const list =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  grid.innerHTML = "";

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "gc-product-card";
    card.innerHTML = `
      <span class="gc-product-tag">${product.tag}</span>
      <div class="gc-product-image">
        <div class="gc-product-image-inner">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          />
        </div>
      </div>
      <h3 class="gc-product-title">${product.name}</h3>
      <p class="gc-product-desc">${product.description}</p>
      <div class="gc-product-meta">
        <div>
          <div class="gc-product-price">${formatMoney(product.price)}</div>
          <div class="gc-price-muted">Inclusive of GST*</div>
        </div>
        <span class="gc-pill-badge">${product.category}</span>
      </div>
      <div class="gc-product-cta">
        <button class="gc-btn gc-btn-secondary" data-add="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Bind add to cart buttons
  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      addToCart(id);
    });
  });
}

function setupCategoryFilters() {
  const chips = document.querySelectorAll(".gc-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const category = chip.getAttribute("data-category") || "all";
      chips.forEach((c) => c.classList.remove("gc-chip-active"));
      chip.classList.add("gc-chip-active");
      renderProducts(category);
    });
  });
}

// --- Cart Management --------------------------------------------------------

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  orderConfirmed = false;
  renderCart();
  updateCartTotals();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  orderConfirmed = false;
  renderCart();
  updateCartTotals();
}

function updateQuantity(productId, quantity) {
  const item = cart.find((c) => c.productId === productId);
  if (!item) return;
  const q = Number(quantity);
  if (!Number.isFinite(q) || q <= 0) {
    removeFromCart(productId);
    return;
  }
  item.quantity = Math.min(Math.round(q), 99);
  renderCart();
  updateCartTotals();
}

function renderCart() {
  const tbody = document.getElementById("cart-body");
  const emptyMessage = document.getElementById("cart-empty-message");
  if (!tbody || !emptyMessage) return;

  tbody.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    return;
  }

  emptyMessage.style.display = "none";

  cart.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${formatMoney(item.price)}</td>
      <td>
        <input
          type="number"
          min="1"
          max="99"
          value="${item.quantity}"
          data-qty="${item.productId}"
          style="width: 56px; padding: 0.15rem 0.25rem; border-radius: 999px; border: 1px solid rgba(148,163,184,0.7); background: rgba(15,23,42,0.9); color: #e5e7eb; font-size: 0.78rem;"
        />
      </td>
      <td>${formatMoney(item.price * item.quantity)}</td>
      <td>
        <button
          type="button"
          class="gc-btn gc-btn-secondary"
          data-remove="${item.productId}"
        >
          ✕
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Bind quantity and remove
  tbody.querySelectorAll("[data-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("data-qty");
      updateQuantity(id, input.value);
    });
  });

  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove");
      removeFromCart(id);
    });
  });
}

function calculateTotals() {
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

function updateCartTotals() {
  const { subtotal, tax, total } = calculateTotals();
  const subtotalEl = document.getElementById("cart-subtotal");
  const taxEl = document.getElementById("cart-tax");
  const totalEl = document.getElementById("cart-total");
  const paymentAmount = document.getElementById("payment-amount");

  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (taxEl) taxEl.textContent = formatMoney(tax);
  if (totalEl) totalEl.textContent = formatMoney(total);
  if (paymentAmount) paymentAmount.textContent = formatMoney(total);
}

// --- Address Handling -------------------------------------------------------

function handleAddressSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("cust-name")?.value.trim();
  const phone = document.getElementById("cust-phone")?.value.trim();
  const email = document.getElementById("cust-email")?.value.trim();
  const line1 = document.getElementById("addr-line1")?.value.trim();
  const line2 = document.getElementById("addr-line2")?.value.trim();
  const city = document.getElementById("addr-city")?.value.trim();
  const state = document.getElementById("addr-state")?.value.trim();
  const pin = document.getElementById("addr-pin")?.value.trim();
  const statusEl = document.getElementById("address-status");

  if (!statusEl) return;

  if (cart.length === 0) {
    statusEl.textContent = "Please add at least one item to the cart.";
    statusEl.className = "gc-status-text gc-status-text--error";
    return;
  }

  if (!name || !phone || !line1 || !city || !state || !pin) {
    statusEl.textContent = "Please fill all required fields marked with *.";
    statusEl.className = "gc-status-text gc-status-text--error";
    return;
  }

  savedAddress = {
    name,
    phone,
    email,
    line1,
    line2,
    city,
    state,
    pin,
  };

  statusEl.textContent = "Address saved. You can proceed to payment.";
  statusEl.className = "gc-status-text gc-status-text--success";

  scrollToSection("payment");
}

// --- Payment & Bill ---------------------------------------------------------

function generateBillNumber() {
  const now = new Date();
  return `GEO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}-${String(
    now.getHours()
  ).padStart(2, "0")}${String(now.getMinutes()).padStart(
    2,
    "0"
  )}${String(now.getSeconds()).padStart(2, "0")}`;
}

function fillBill() {
  const { subtotal, tax, total } = calculateTotals();

  const billNumberEl = document.getElementById("bill-number");
  const billDateEl = document.getElementById("bill-date");
  const nameEl = document.getElementById("bill-customer-name");
  const addrEl = document.getElementById("bill-customer-address");
  const contactEl = document.getElementById("bill-customer-contact");
  const itemsBody = document.getElementById("bill-items");
  const subtotalEl = document.getElementById("bill-subtotal");
  const taxEl = document.getElementById("bill-tax");
  const totalEl = document.getElementById("bill-total");

  if (!itemsBody || !savedAddress) return;

  if (billNumberEl) billNumberEl.textContent = generateBillNumber();
  if (billDateEl)
    billDateEl.textContent = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (nameEl) nameEl.textContent = savedAddress.name;

  if (addrEl) {
    const lines = [savedAddress.line1];
    if (savedAddress.line2) lines.push(savedAddress.line2);
    lines.push(
      `${savedAddress.city}, ${savedAddress.state} - ${savedAddress.pin}`
    );
    addrEl.textContent = lines.join(", ");
  }

  if (contactEl) {
    const parts = [`Phone: ${savedAddress.phone}`];
    if (savedAddress.email) parts.push(`Email: ${savedAddress.email}`);
    contactEl.textContent = parts.join(" | ");
  }

  itemsBody.innerHTML = "";
  cart.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${formatMoney(item.price)}</td>
      <td>${formatMoney(item.price * item.quantity)}</td>
    `;
    itemsBody.appendChild(tr);
  });

  if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal);
  if (taxEl) taxEl.textContent = formatMoney(tax);
  if (totalEl) totalEl.textContent = formatMoney(total);
}

function handlePayNow() {
  const statusEl = document.getElementById("payment-status");

  if (!statusEl) return;

  if (cart.length === 0) {
    statusEl.textContent = "Your cart is empty. Please add items before paying.";
    statusEl.className = "gc-status-text gc-status-text--error";
    return;
  }

  if (!savedAddress) {
    statusEl.textContent =
      "Please fill and save your shipping address before payment.";
    statusEl.className = "gc-status-text gc-status-text--error";
    scrollToSection("address");
    return;
  }

  // Step 1: show QR & UPI and ask user to confirm after paying
  const qrSection = document.querySelector(".gc-payment-qr");
  const confirmBtn = document.getElementById("btn-confirm-payment");
  if (qrSection) qrSection.classList.remove("gc-hidden");
  if (confirmBtn) confirmBtn.classList.remove("gc-hidden");

  statusEl.textContent =
    "QR & UPI ID are visible. Complete payment in your UPI app, then click 'Payment Done (Show Bill)'.";
  statusEl.className = "gc-status-text gc-status-text--success";
}

function handleConfirmPayment() {
  const statusEl = document.getElementById("payment-status");
  if (!statusEl) return;

  if (cart.length === 0 || !savedAddress) {
    statusEl.textContent =
      "Cart or address missing. Please go back and check your details.";
    statusEl.className = "gc-status-text gc-status-text--error";
    return;
  }

  statusEl.textContent = "Payment confirmed (demo). Order bill generated below.";
  statusEl.className = "gc-status-text gc-status-text--success";

  orderConfirmed = true;
  fillBill();
  scrollToSection("bill");
}

function handlePrintBill() {
  if (!orderConfirmed) {
    alert("Please complete the payment before printing the bill.");
    return;
  }
  window.print();
}

// --- Wiring -----------------------------------------------------------------

function wireButtons() {
  const toAddress = document.getElementById("btn-to-address");
  if (toAddress) {
    toAddress.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add at least one product.");
        return;
      }
      scrollToSection("address");
    });
  }

  const addressForm = document.getElementById("address-form");
  if (addressForm) {
    addressForm.addEventListener("submit", handleAddressSubmit);
  }

  const payNow = document.getElementById("btn-pay-now");
  if (payNow) {
    payNow.addEventListener("click", handlePayNow);
  }

  const confirmBtn = document.getElementById("btn-confirm-payment");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", handleConfirmPayment);
  }

  const printBtn = document.getElementById("btn-print-bill");
  if (printBtn) {
    printBtn.addEventListener("click", handlePrintBill);
  }
}

function setFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts("all");
  setupCategoryFilters();
  renderCart();
  updateCartTotals();
  wireButtons();
  setFooterYear();
});


