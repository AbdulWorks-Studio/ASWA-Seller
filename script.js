// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

// Live counter animation
const counterEl = document.getElementById('counter');
let counterValue = 118420; 
setInterval(() => {
  counterValue += Math.floor(Math.random() * 6) + 1;
  counterEl.textContent = counterValue.toLocaleString();
}, 2200);

// ============ GLOBAL VARIABLES ============
const symbols = { pkr: 'Rs. ', inr: '₹', usd: '$' };
let currentServiceType = 'watchhours';
let currentSpeed = 'fast';
let currentCurrency = 'pkr';
let selectedPackage = "";
let selectedMethod = "";

const paymentDetails = {
  'JazzCash': 'Account: 03102746281 | Title: Muhammad Adil',
  'EasyPaisa': 'Account: 03102746281 | Title: Muhammad Adil',
  'Bank Alfalah': 'Account: 00231008925741 | Title: Muhammad Adil'
};

// ============ SERVICES & PRICING DATA ============
const services = {
  watchhours_slow: {
    label: 'Watch Hours (Slow)',
    unit: 'Hrs',
    packages: [
      { quantity: '1,000 Hrs', pkr: 7000,  inr: 2500, usd: 25 },
      { quantity: '2,000 Hrs', pkr: 14000, inr: 4500, usd: 50, popular: true },
      { quantity: '3,000 Hrs', pkr: 21000, inr: 6500, usd: 75 },
      { quantity: '4,000 Hrs', pkr: 28000, inr: 8500, usd: 100 },
    ],
    features: [
      "100% Organic Watch Time (Real Phones)",
      "Safe for Monetization - No Bots",
      "High Retention & Drop-Protected",
      "Complete in 60 Days (Slow Service)"
    ]
  },
  watchhours_fast: {
    label: 'Watch Hours (Fast)',
    unit: 'Hrs',
    packages: [
      { quantity: '1,000 Hrs', pkr: 12000, inr: 4000, usd: 50 },
      { quantity: '2,000 Hrs', pkr: 24000, inr: 8000, usd: 100, popular: true },
      { quantity: '3,000 Hrs', pkr: 36000, inr: 12000, usd: 150 },
      { quantity: '4,000 Hrs', pkr: 48000, inr: 16000, usd: 200 },
    ],
    features: [
      "100% Organic Watch Time (Real Phones)",
      "Safe for Monetization - No Bots",
      "High Retention & Drop-Protected",
      "Complete in 28 Days (Fast Service)"
    ]
  },
  subscribers: {
    label: 'Subscribers',
    unit: 'Subs',
    packages: [
      { quantity: '1,000 Subs', pkr: 12000, inr: 4500,  usd: 50 },
      { quantity: '2,000 Subs', pkr: 24000, inr: 9000,  usd: 100, popular: true },
      { quantity: '3,000 Subs', pkr: 36000, inr: 13500, usd: 150 },
      { quantity: '5,000 Subs', pkr: 60000, inr: 22500, usd: 250 },
    ],
    features: [
      "100% Real & Active Subscribers",
      "Safe for Monetization - No Bots",
      "Drop-Protected & High Retention",
      "Fast Delivery"
    ]
  }
};

function renderPricing() {
  const grid = document.getElementById('pricingGrid');
  grid.innerHTML = '';

  const dataKey = currentServiceType === 'watchhours' ? `watchhours_${currentSpeed}` : 'subscribers';
  const service = services[dataKey];

  service.packages.forEach(pkg => {
    const price = pkg[currentCurrency];
    const displayPrice = currentCurrency === 'usd' ? price : price.toLocaleString();
    const isPopular = pkg.popular || false;

    const featuresHtml = service.features.map(f => 
      `<li class="flex items-center gap-2"><svg class="w-4 h-4 text-[var(--gold)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>${f}</li>`
    ).join('');

    const card = document.createElement('div');
    card.className = `relative rounded-2xl p-7 transition duration-300 card-border ${isPopular ? 'featured-glow' : 'card-glow'}`;

    card.innerHTML = `
      ${isPopular ? '<span class="absolute -top-3 left-1/2 -translate-x-1/2 btn-gold text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>' : ''}
      <p class="text-xs uppercase tracking-[0.15em] text-gray-500 font-semibold mb-2">${service.label}</p>
      <h3 class="font-display font-bold text-2xl">${pkg.quantity}</h3>
      <p class="mt-4">
        <span class="font-display font-bold text-3xl ${isPopular ? 'gold-text' : 'text-white'}">${symbols[currentCurrency]}${displayPrice}</span>
      </p>
      <ul class="mt-5 space-y-2 text-sm text-gray-400">
        ${featuresHtml}
      </ul>
      <button onclick="openCheckout('${service.label} - ${pkg.quantity}')"
         class="${isPopular ? 'btn-gold' : 'btn-primary text-white'} mt-6 w-full inline-block text-center font-semibold px-5 py-3 rounded-full text-sm">
        Order Now
      </button>
    `;
    grid.appendChild(card);
  });
}

// Utility to handle tab switching UI
function updateTabUI(buttons, activeDatasetKey, activeValue) {
  buttons.forEach(btn => {
    const isActive = btn.dataset[activeDatasetKey] === activeValue;
    
    if (activeDatasetKey === 'service') {
      if (isActive) {
        btn.classList.add('text-black', 'bg-[#eab308]', 'shadow-md', 'tab-active');
        btn.classList.remove('text-gray-400', 'hover:text-white');
      } else {
        btn.classList.remove('text-black', 'bg-[#eab308]', 'shadow-md', 'tab-active');
        btn.classList.add('text-gray-400', 'hover:text-white');
      }
    } else {
      if (isActive) {
        btn.classList.add('tab-active', 'text-white', 'bg-white/10');
        btn.classList.remove('text-gray-500');
      } else {
        btn.classList.remove('tab-active', 'text-white', 'bg-white/10');
        btn.classList.add('text-gray-500');
      }
    }
  });
}

// Service tabs
document.querySelectorAll('.service-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentServiceType = btn.dataset.service;
    updateTabUI(document.querySelectorAll('.service-tab'), 'service', currentServiceType);
    
    const speedContainer = document.getElementById('speedToggleContainer');
    if (currentServiceType === 'subscribers') {
      speedContainer.classList.add('hidden');
    } else {
      speedContainer.classList.remove('hidden');
    }
    renderPricing();
  });
});

// Speed tabs
document.querySelectorAll('.speed-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentSpeed = btn.dataset.speed;
    updateTabUI(document.querySelectorAll('.speed-tab'), 'speed', currentSpeed);
    renderPricing();
  });
});

// Currency tabs
document.querySelectorAll('.currency-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    currentCurrency = btn.dataset.cur;
    updateTabUI(document.querySelectorAll('.currency-tab'), 'cur', currentCurrency);
    renderPricing();
  });
});

// Initial Render
renderPricing();

// ============ CHECKOUT (WhatsApp-based) ============
const WHATSAPP_NUMBER = "923102746281";

function openCheckout(packageName) {
  selectedPackage = packageName;
  selectedMethod = "";
  document.getElementById('modalPackage').innerText = packageName;
  document.getElementById('methodTitle').innerText = `Order via WhatsApp • ${packageName}`;
  document.getElementById('custPaymentMethod').value = "";
  document.getElementById('accountDetailsBox').classList.add('hidden');
  
  document.getElementById('checkoutModal').classList.remove('hidden');
  document.getElementById('checkoutModal').classList.add('flex');
}

function closeCheckout() {
  document.getElementById('checkoutModal').classList.add('hidden');
  document.getElementById('checkoutModal').classList.remove('flex');
  document.getElementById('custPaymentMethod').value = "";
  document.getElementById('accountDetailsBox').classList.add('hidden');
  selectedMethod = "";
}

function handleMethodDropdown(method) {
  selectedMethod = method;
  const box = document.getElementById('accountDetailsBox');
  const title = document.getElementById('instructionText');
  const info = document.getElementById('accountInfoText');
  
  if (method && paymentDetails[method]) {
    box.classList.remove('hidden');
    title.textContent = `Send payment via ${method}:`;
    info.textContent = paymentDetails[method];
  } else {
    box.classList.add('hidden');
    title.textContent = "";
    info.textContent = "";
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const channel = document.getElementById('custChannel').value.trim();
  const country = document.getElementById('custCountry').value;
  const tid = document.getElementById('custTid').value.trim();

  const text = 
    `🛒 New Order Request!\n\n` +
    `Package: ${selectedPackage || "Custom"}\n` +
    `Payment Method: ${selectedMethod || "Not Selected"}\n` +
    `Transaction ID: ${tid || "N/A"}\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `YouTube Channel: ${channel}\n` +
    `Country: ${country}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  window.open(whatsappUrl, '_blank');
  closeCheckout();
  document.getElementById('checkoutForm').reset();

  selectedPackage = "";
  selectedMethod = "";
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const icon = btn.querySelector('svg');
    const isOpen = !answer.classList.contains('hidden');

    document.querySelectorAll('.faq-a').forEach(a => a.classList.add('hidden'));
    document.querySelectorAll('.faq-q svg').forEach(i => i.style.transform = 'rotate(0deg)');

    if (!isOpen) {
      answer.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    }
  });
});

// ============ SIDE NAVIGATION & SCROLL SPY ============
const sections = document.querySelectorAll('section[id]');
const navDots = document.querySelectorAll('.aswa-dot');
const sideProgress = document.getElementById('aswaSideProgress');

window.addEventListener('scroll', () => {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navDots.forEach(dot => {
    dot.classList.remove('active');
    if (dot.getAttribute('data-section') === current) {
      dot.classList.add('active');
    }
  });

  if (sideProgress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / totalHeight) * 100;
    sideProgress.style.height = progress + '%';
  }
});

// ============ BACK TO TOP BUTTON ============
const backToTopBtn = document.getElementById('aswaBackToTop');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}