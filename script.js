// ==================== Cart Logic ====================
let cart = [];
let total = 0;

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) cart = JSON.parse(saved);
    calculateTotal();
    updateCartCount();
    renderCart();
}

function calculateTotal() {
    total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    calculateTotal();
    updateCartCount();
    renderCart();
}

function updateCartCount() {
    const count = document.getElementById('cartCount');
    if (count) count.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function toggleCart() {
    document.getElementById('cartPanel')?.classList.toggle('active');
}

function addToCart(name, price, quantity = 1) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + quantity;
    } else {
        cart.push({ name, price, quantity });
    }
    saveCart();

    // Toast بدل الـ alert
    showToast('تمت الإضافة إلى السلة ✓', 'success');
}
// دالة Toast أنيقة
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        ${document.documentElement.dir === 'rtl' ? 'right' : 'left'}: 30px;
        padding: 14px 24px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.4s ease, transform 0.4s ease;
        transform: translateY(20px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    `;

    if (type === 'success') {
        toast.style.background = 'linear-gradient(135deg, #28a745, #1e7e34)';
    } else if (type === 'error') {
        toast.style.background = 'linear-gradient(135deg, #dc3545, #b02a37)';
    }

    document.body.appendChild(toast);

    // ظهور
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);

    // اختفاء
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function renderCart() {
    const list = document.getElementById('cartItems');
    if (!list) return;

    list.innerHTML = '';

    cart.forEach((item, index) => {
        const product = productsData.find(p => p.name === item.name) || {};
        const itemTotal = (item.price * (item.quantity || 1)).toLocaleString();

        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.img || 'img/placeholder.jpg'}" alt="${item.name}" />
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="price">${item.price.toLocaleString()} ج.م × ${item.quantity || 1}</p>
                <p class="item-total"><strong>${itemTotal} ج.م</strong></p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">✕</button>
        `;
        list.appendChild(li);
    });

    const totalEl = document.getElementById('total');
    if (totalEl) totalEl.textContent = `الإجمالي: ${total.toLocaleString()} ج.م`;

    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#888; padding:40px 0;">السلة فارغة حالياً</p>';
    }
}

// ==================== Products Data ====================
const productsData = [
    { id: 1, name: "سوفاج", price: 1600, img: "/suvage.webp", alt: "سوفاج", category: "رجالي", badge: "الأكثر مبيعًا", rating: 4.9 },
    { id: 2, name: "رويال عود", price: 1200, img: "/royal oud.jpg", alt: "رويال عود", category: "رجالي", badge: null, rating: 4.7 },
    { id: 3, name: "خمرة", price: 1300, img: "/خمره.jpg", alt: "خمرة", category: "يونيسكس", badge: "جديد", rating: 4.8 },
    { id: 4, name: "بلو دي شانل", price: 1800, img: "/Bleu de Chanel.avif", alt: "بلو دي شانل", category: "رجالي", badge: null, rating: 4.9 },
    { id: 5, name: "ايفنتس", price: 2200, img: "/ايفنتس.jpg", alt: "ايفنتس", category: "رجالي", badge: "الأكثر مبيعًا", rating: 4.8 },
    { id: 6, name: "عود خشب", price: 1950, img: "/عدو خشب.jpg", alt: "عود خشب", category: "رجالي", badge: null, rating: 4.6 },
    { id: 7, name: "مانسيرا روز فانيليا", price: 1400, img: "/مانسيرا روز فانيلا.jpg", alt: "مانسيرا روز فانيليا", category: "نسائي", badge: null, rating: 4.7 },
    { id: 8, name: "عطر سكاندال المثير", price: 1500, img: "/سكاندل.webp", alt: "سكاندال", category: "نسائي", badge: "خصم 20%", rating: 4.5 },
    { id: 9, name: "توم فورد نوري", price: 2100, img: "/توم فورد نوري.webp", alt: "توم فورد نوري", category: "رجالي", badge: null, rating: 4.9 },
    { id: 10, name: "ديور هومي انستنس", price: 1700, img: "/ديور.webp", alt: "ديور هومي انستنس", category: "رجالي", badge: null, rating: 4.8 },
    { id: 11, name: "انفكتوس", price: 900, img: "/انفكتوس.jpg", alt: "انفكتوس", category: "رجالي", badge: "خصم 20%", rating: 4.6 },
];

// ==================== Carousel ====================
function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    track.innerHTML = '';

    productsData.slice(0, 6).forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <div class="product-image-wrapper">
                <img 
                    class="product-img"
                    src="${product.img}" 
                    alt="${product.alt}"
                    data-full="${product.img}"
                    onclick="openImageModal(this)"
                >
            </div>
            <h3>${product.name}</h3>
            <p class="price">${product.price} ج.م</p>
            <div class="quantity-control">
                <button type="button" class="qty-minus" onclick="changeQty(this, -1)">−</button>
                <span class="qty-number">1</span>
                <button type="button" class="qty-plus" onclick="changeQty(this, 1)">+</button>
            </div>
            <button class="add-cart" onclick="addToCart('${product.name}', ${product.price}, parseInt(this.previousElementSibling.querySelector('.qty-number').textContent || '1'))">أضف إلى السلة</button>
        `;
        track.appendChild(div);
    });
}

// ==================== Shop Grid ====================
function renderShop() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;

    let filtered = [...productsData];

    const search = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    if (search) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    }

    const activeTab = document.querySelector('.tab.active');
    let cat = activeTab ? activeTab.dataset.category : 'all';
    if (cat !== 'all') {
        filtered = filtered.filter(p => p.category === cat);
    }

    const min = parseInt(document.getElementById('minPrice')?.value) || 0;
    const max = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
    filtered = filtered.filter(p => p.price >= min && p.price <= max);

    const sort = document.getElementById('sortSelect')?.value || 'default';
    if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
    if (sort === 'name-asc') filtered.sort((a,b) => a.name.localeCompare(b.name, 'ar'));
    if (sort === 'name-desc') filtered.sort((a,b) => b.name.localeCompare(a.name, 'ar'));

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align:center; padding:120px 20px; color:#888; font-size:1.6rem; line-height:1.6;">
                <div style="font-size:7rem; margin-bottom:25px; opacity:0.5;">😕</div>
                <strong>لا توجد نتائج مطابقة</strong><br>
                جرب تغيير كلمة البحث أو الفلاتر المختارة
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <div class="product-image-wrapper">
                <img class="product-img" src="${p.img}" alt="${p.alt}" data-full="${p.img}" onclick="openImageModal(this)">
                ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
            </div>
            <h3>${p.name}</h3>
            <div class="rating">★★★★★ <span>(${p.rating || "4.5"})</span></div>
            <p class="price">${p.price} ج.م</p>
            <div class="quantity-control">
                <button type="button" class="qty-minus" onclick="changeQty(this, -1)">−</button>
                <span class="qty-number">1</span>
                <button type="button" class="qty-plus" onclick="changeQty(this, 1)">+</button>
            </div>
            <button class="add-cart" onclick="addToCart('${p.name}', ${p.price}, parseInt(this.previousElementSibling.querySelector('.qty-number').textContent || '1'))">أضف إلى السلة</button>
        `;
        grid.appendChild(div);
    });
}

function changeQty(btn, delta) {
    const container = btn.parentElement;
    const number = container.querySelector('.qty-number');
    let value = parseInt(number.textContent) || 1;
    value = Math.max(1, Math.min(10, value + delta));
    number.textContent = value;
}

function initTabs() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderShop();
        });
    });
}

// ==================== Image Modal ====================
function openImageModal(imgElement) {
    const modal = document.getElementById("imageModal");
    if (!modal) return;

    const modalImg = document.getElementById("modalImage");
    const caption = document.getElementById("caption");

    modal.classList.add("active");
    modalImg.src = imgElement.dataset.full || imgElement.src;
    caption.textContent = imgElement.alt || "زجاجة العطر";
    document.body.style.overflow = "hidden";
}

function closeImageModal(e) {
    const modal = document.getElementById("imageModal");
    if (!modal) return;

    if (!e || e.target.id === "imageModal" || e.target.classList.contains("modal-close")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }
}

// ==================== Go to Checkout ====================
function goToCheckout() {
    if (cart.length === 0) {
        alert('السلة فارغة! أضف منتجات أولاً');
        return;
    }
    window.location.href = 'checkout.html';
}

// ==================== Clear Cart ====================
function clearCart() {
    if (confirm('هل أنت متأكد من تفريغ السلة؟')) {
        cart = [];
        saveCart();
    }
}

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    initTabs();

    if (document.getElementById('carouselTrack')) {
        renderCarousel();
    }

    if (document.getElementById('shopGrid')) {
        renderShop();

        document.getElementById('searchInput')?.addEventListener('input', renderShop);
        document.getElementById('minPrice')?.addEventListener('input', renderShop);
        document.getElementById('maxPrice')?.addEventListener('input', renderShop);
        document.getElementById('sortSelect')?.addEventListener('change', renderShop);

        const mobileBtn = document.getElementById('mobileFiltersBtn');
        const filtersDiv = document.querySelector('.filters');
        if (mobileBtn && filtersDiv) {
            mobileBtn.addEventListener('click', () => {
                filtersDiv.classList.toggle('active');
                mobileBtn.textContent = filtersDiv.classList.contains('active') 
                    ? 'إخفاء الفلاتر ▲' 
                    : 'فلاتر البحث ▼';
            });
        }
    }

    document.getElementById('cartBtn')?.addEventListener('click', toggleCart);

    document.getElementById('imageModal')?.addEventListener('click', closeImageModal);
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeImageModal();
    });

    // Pop-up ترحيبي
    if (!localStorage.getItem('welcomeShown')) {
        setTimeout(() => {
            const popup = document.getElementById('welcomePopup');
            if (popup) popup.classList.add('active');
            localStorage.setItem('welcomeShown', 'true');
        }, 1500);
    }

    document.getElementById('closePopup')?.addEventListener('click', () => {
        document.getElementById('welcomePopup')?.classList.remove('active');
    });
});

// إصلاح ظهور قسم About مع السكرول
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const checkAboutVisibility = () => {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            aboutSection.classList.add('visible');
        }
    };
    window.addEventListener('scroll', checkAboutVisibility);
    checkAboutVisibility();
}
// أضف هذين الدالتين في نهاية script.js
function updateQuantityInCheckout(index, delta) {
    let savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart[index]) {
        savedCart[index].quantity = Math.max(1, (savedCart[index].quantity || 1) + delta);
        localStorage.setItem('cart', JSON.stringify(savedCart));
        renderOrderSummary();
        if (typeof loadCart === 'function') loadCart();
    }
}

function removeFromCheckout(index) {
    if (confirm('هل تريد حذف هذا المنتج؟')) {
        let savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        savedCart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(savedCart));
        renderOrderSummary();
        if (typeof loadCart === 'function') loadCart();
    }
}