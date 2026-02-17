const API_URL = "https://fakestoreapi.com";
let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements
const productGrid = document.getElementById("product-grid");
const trendingGrid = document.getElementById("trending-grid");
const categoryContainer = document.getElementById("category-filters");
const cartCountBadge = document.getElementById("cart-count");
const miniCartItems = document.getElementById("mini-cart-items");
const modal = document.getElementById("product_modal");

// Modal Elements
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalPrice = document.getElementById("modal-price");
const modalRating = document.getElementById("modal-rating");
const modalRatingCount = document.getElementById("modal-rating-count");
const modalDescription = document.getElementById("modal-description");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart");

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  fetchCategories();
  updateCartUI();
});

// --- API Calls ---

/**
 * Fetch all products from the API
 */
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    allProducts = data;
    renderProducts(allProducts);
    renderTrending(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    if(productGrid) {
        productGrid.innerHTML = `<p class="text-error text-center col-span-full">Failed to load products. Please try again later.</p>`;
    }
  }
}

/**
 * Fetch categories from the API
 */
async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/products/categories`);
    const categories = await res.json();
    console.log("Categories:", categories);
    renderCategories(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

/**
 * Fetch a single product detail
 */
async function fetchProductDetails(id) {
  try {
    // Show loading state in modal if needed or just wait
    const res = await fetch(`${API_URL}/products/${id}`);
    const product = await res.json();
    return product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
}

// --- Rendering Functions ---

/**
 * Render products to the main grid
 */
function renderProducts(products) {
  if (!productGrid) return; // Guard clause if element doesn't exist on page

  productGrid.innerHTML = "";
  
  if (products.length === 0) {
      productGrid.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">No products found in this category.</div>`;
      return;
  }

  products.forEach((product) => {
    const card = createProductCard(product);
    productGrid.appendChild(card);
  });
}

/**
 * Render top 3 trending products (based on rating rate)
 */
function renderTrending(products) {
  if (!trendingGrid) return; // Guard clause

  // Sort by rating.rate descending and take top 3
  const sorted = [...products].sort((a, b) => b.rating.rate - a.rating.rate);
  const trending = sorted.slice(0, 3);

  trendingGrid.innerHTML = "";
  trending.forEach((product) => {
    const card = createProductCard(product, true); // true for trending layout if different (using same for now)
    trendingGrid.appendChild(card);
  });
}

/**
 * Loop through and create category buttons
 */
function renderCategories(categories) {
  if (!categoryContainer) return; // Guard clause

  // Existing "All" button is hardcoded in HTML, append others
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline rounded-full px-6 capitalize filter-btn hover:btn-primary";
    btn.dataset.category = cat;
    btn.innerText = cat;
    
    btn.addEventListener("click", () => handleCategoryClick(cat, btn));
    categoryContainer.appendChild(btn);
  });

  // Add event listener to the "All" button
  const allBtn = document.querySelector('[data-category="all"]');
  if (allBtn) {
      allBtn.addEventListener("click", () => handleCategoryClick("all", allBtn));
  }
}

/**
 * Create HTML for a single product card
 */
function createProductCard(product) {
  const div = document.createElement("div");
  // Tailwind card classes
  div.className = "card card-compact bg-base-100 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group";
  
  const { id, title, price, image, category, rating } = product;

  div.innerHTML = `
    <figure class="h-60 p-6 bg-white overflow-hidden relative">
      <img
        src="${image}"
        alt="${title}"
        class="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
      />
      <div class="absolute top-3 right-3 badge badge-secondary badge-outline text-xs capitalize">${category}</div>
    </figure>
    <div class="card-body">
      <h2 class="card-title text-base line-clamp-2 min-h-[3rem]" title="${title}">
        ${title}
      </h2>
      <div class="flex items-center gap-2 mt-1">
         <span class="text-yellow-400 text-sm"><i class="fa-solid fa-star"></i></span>
         <span class="text-sm font-medium text-gray-600">${rating.rate}</span>
         <span class="text-xs text-gray-400">(${rating.count})</span>
      </div>
      <div class="flex items-center justify-between mt-3">
        <span class="text-xl font-bold text-primary">$${price.toFixed(2)}</span>
      </div>
      <div class="card-actions justify-end mt-3 grid grid-cols-2 gap-2">
        <button class="btn btn-sm btn-outline btn-primary" onclick="handleDetailsClick(${id})">
           <i class="fa-regular fa-eye"></i> Details
        </button>
        <button class="btn btn-sm btn-primary" onclick="addToCartEvent(${id})">
           <i class="fa-solid fa-cart-shopping"></i> Add
        </button>
      </div>
    </div>
  `;
  return div;
}

// --- Interaction Handlers ---

/**
 * Handle category filter click
 */
function handleCategoryClick(category, btnElement) {
  // Update UI active state
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
      btn.classList.remove("btn-primary", "text-white");
      btn.classList.add("btn-outline");
  });
  
  // Activate clicked button
  btnElement.classList.remove("btn-outline");
  btnElement.classList.add("btn-primary", "text-white");

  // Filter Logic
  if (category === "all") {
    renderProducts(allProducts);
  } else {
    // Filter from local products
    const filtered = allProducts.filter((p) => p.category === category);
    renderProducts(filtered);
  }
}

/**
 * Handle Details Button Click - Open Modal
 */
async function handleDetailsClick(id) {
  // Try to find in local state first
  let product = allProducts.find(p => p.id === id);
  
  // If not found (e.g., maybe on trending only and allProducts logic weird?), fetch it
  if (!product) {
      product = await fetchProductDetails(id);
  }
  
  if (!product) return;

  // Populate Modal
  if (modalImage) modalImage.src = product.image;
  if (modalTitle) modalTitle.innerText = product.title;
  if (modalCategory) modalCategory.innerText = product.category;
  if (modalPrice) modalPrice.innerText = `$${product.price}`;
  if (modalRating) modalRating.innerText = product.rating.rate;
  if (modalRatingCount) modalRatingCount.innerText = `(${product.rating.count} reviews)`;
  if (modalDescription) modalDescription.innerText = product.description;
  
  // Bind Add to Cart button in modal
  if (modalAddToCartBtn) {
      modalAddToCartBtn.onclick = () => {
          addToCart(product);
          modal.close();
      };
  }

  if (modal) modal.showModal();
}

/**
 * Intermediate helper for the HTML onclick
 */
function addToCartEvent(id) {
    // Try local array first
    let product = allProducts.find(p => p.id === id);
    if(product) { 
        addToCart(product); 
    } else {
        // Fallback fetch if somehow needed (unlikely)
        fetchProductDetails(id).then(p => { 
            if(p) addToCart(p); 
        });
    }
}

/**
 * Add product to cart state
 */
function addToCart(product) {
  cart.push(product);
  updateCartUI();
  saveCart();
}

/**
 * Update Cart Badge and UI
 */
function updateCartUI() {
  if (cartCountBadge) cartCountBadge.innerText = cart.length;
  if (miniCartItems) miniCartItems.innerText = `${cart.length} Items`;
  
  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const subtotalEl = document.querySelector(".subtotal");
  if(subtotalEl) subtotalEl.innerText = `Subtotal: $${total.toFixed(2)}`;
}

/**
 * Save cart to local storage
 */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
