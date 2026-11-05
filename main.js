const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Открыть меню' : 'Закрыть меню');
  navigation?.classList.toggle('open', !isOpen);
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Открыть меню');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.intro-grid, .stats, .project-card, .catalog-card, .service-card, .value-card, .approach-content, .process-list article, .quote-band, .contact-copy, .contact-form').forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    const start = performance.now();
    const duration = 1300;
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      entry.target.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.65 });

document.querySelectorAll('[data-count]').forEach((counter) => counterObserver.observe(counter));

const phoneInput = document.querySelector('input[name="phone"]');
const countries = [
  { flag: '🇰🇬', name: 'Кыргызстан', code: '+996' }, { flag: '🇷🇺', name: 'Россия', code: '+7' },
  { flag: '🇰🇿', name: 'Казахстан', code: '+7' }, { flag: '🇺🇿', name: 'Узбекистан', code: '+998' },
  { flag: '🇺🇸', name: 'США', code: '+1' }, { flag: '🇨🇦', name: 'Канада', code: '+1' },
  { flag: '🇬🇧', name: 'Великобритания', code: '+44' }, { flag: '🇩🇪', name: 'Германия', code: '+49' },
  { flag: '🇹🇷', name: 'Турция', code: '+90' }, { flag: '🇦🇪', name: 'ОАЭ', code: '+971' },
  { flag: '🇫🇷', name: 'Франция', code: '+33' }, { flag: '🇮🇹', name: 'Италия', code: '+39' },
  { flag: '🇪🇸', name: 'Испания', code: '+34' }, { flag: '🇨🇳', name: 'Китай', code: '+86' },
  { flag: '🇯🇵', name: 'Япония', code: '+81' }, { flag: '🇰🇷', name: 'Южная Корея', code: '+82' },
  { flag: '🇹🇯', name: 'Таджикистан', code: '+992' }, { flag: '🇦🇿', name: 'Азербайджан', code: '+994' },
  { flag: '🇦🇲', name: 'Армения', code: '+374' }, { flag: '🇧🇾', name: 'Беларусь', code: '+375' },
  { flag: '🇵🇱', name: 'Польша', code: '+48' }, { flag: '🇳🇱', name: 'Нидерланды', code: '+31' },
  { flag: '🇨🇭', name: 'Швейцария', code: '+41' }, { flag: '🇦🇺', name: 'Австралия', code: '+61' },
  { flag: '🇧🇷', name: 'Бразилия', code: '+55' }, { flag: '🇮🇳', name: 'Индия', code: '+91' },
  { flag: '🇸🇦', name: 'Саудовская Аравия', code: '+966' }, { flag: '🇮🇱', name: 'Израиль', code: '+972' },
  { flag: '🇺🇦', name: 'Украина', code: '+380' }, { flag: '🇲🇽', name: 'Мексика', code: '+52' },
];
let selectedCountry = countries[0];

if (phoneInput) {
  phoneInput.placeholder = 'Номер телефона';
  phoneInput.autocomplete = 'tel';
  const phoneControl = document.createElement('div');
  phoneControl.className = 'phone-control';
  const countryPicker = document.createElement('div');
  countryPicker.className = 'country-picker';
  countryPicker.innerHTML = '<button class="country-trigger" type="button" aria-expanded="false" aria-label="Выбрать код страны"><span></span><b>⌄</b></button><div class="country-menu" hidden><input class="country-search" type="search" placeholder="Найти страну" aria-label="Найти страну"><div class="country-options" role="listbox"></div><small>Или введите полный номер с кодом страны</small></div>';
  const countryTrigger = countryPicker.querySelector('.country-trigger');
  const countryMenu = countryPicker.querySelector('.country-menu');
  const countryLabel = countryPicker.querySelector('.country-trigger span');
  const countryOptions = countryPicker.querySelector('.country-options');
  const countrySearch = countryPicker.querySelector('.country-search');
  const phoneLabel = phoneInput.closest('label');
  const renderCountries = (query = '') => {
    countryOptions.replaceChildren();
    countries.filter((country) => `${country.name} ${country.code}`.toLowerCase().includes(query.toLowerCase())).forEach((country) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'country-option';
      option.setAttribute('role', 'option');
      option.innerHTML = `<span>${country.flag} ${country.name}</span><b>${country.code}</b>`;
      option.addEventListener('click', () => {
        selectedCountry = country;
        countryLabel.textContent = `${country.flag} ${country.code}`;
        countryTrigger.setAttribute('aria-expanded', 'false');
        countryMenu.hidden = true;
        countrySearch.value = '';
        renderCountries();
        phoneInput.focus();
      });
      countryOptions.append(option);
    });
  };
  countryLabel.textContent = `${selectedCountry.flag} ${selectedCountry.code}`;
  renderCountries();
  countryTrigger.addEventListener('click', () => {
    const open = countryTrigger.getAttribute('aria-expanded') !== 'true';
    countryTrigger.setAttribute('aria-expanded', String(open));
    countryMenu.hidden = !open;
    if (open) countrySearch.focus();
  });
  countrySearch.addEventListener('input', () => renderCountries(countrySearch.value));
  document.addEventListener('click', (event) => {
    if (!countryPicker.contains(event.target)) {
      countryMenu.hidden = true;
      countryTrigger.setAttribute('aria-expanded', 'false');
    }
  });
  phoneControl.append(countryPicker, phoneInput);
  phoneLabel.append(phoneControl);
  const phoneHint = document.createElement('small');
  phoneHint.className = 'phone-hint';
  phoneHint.textContent = 'Выберите код страны или введите полный международный номер';
  phoneLabel.append(phoneHint);
}

const planSelect = document.querySelector('.contact-form select[name="plan"]');
if (planSelect) {
  const customSelect = document.createElement('div');
  customSelect.className = 'custom-select';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'custom-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.textContent = planSelect.options[0].textContent;
  const list = document.createElement('div');
  list.className = 'custom-select-menu';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  const valueInput = document.createElement('input');
  valueInput.type = 'hidden';
  valueInput.name = planSelect.name;
  Array.from(planSelect.options).slice(1).forEach((option) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'custom-select-option';
    item.setAttribute('role', 'option');
    item.textContent = option.textContent;
    item.addEventListener('click', () => {
      valueInput.value = option.value || option.textContent;
      trigger.textContent = option.textContent;
      trigger.classList.remove('is-placeholder', 'is-invalid');
      list.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    });
    list.append(item);
  });
  trigger.classList.add('is-placeholder');
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    list.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  });
  customSelect.append(trigger, list, valueInput);
  planSelect.replaceWith(customSelect);
}

const contactForm = document.querySelector('#contactForm');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const planValue = contactForm.querySelector('.custom-select input[type="hidden"]');
  if (planValue && !planValue.value) {
    const planButton = contactForm.querySelector('.custom-select-trigger');
    planButton.classList.add('is-invalid');
    planButton.focus();
    return;
  }
  if (!contactForm.reportValidity()) return;
  if (phoneInput?.value.trim()) {
    const enteredPhone = phoneInput.value.trim();
    const digits = enteredPhone.replace(/\D/g, '');
    phoneInput.value = enteredPhone.startsWith('+') ? `+${digits}` : `${selectedCountry.code}${digits}`;
  }
  const submit = contactForm.querySelector('button[type="submit"]');
  const status = contactForm.querySelector('.form-success');
  submit.disabled = true;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
    });
    if (!response.ok) throw new Error('Contact service unavailable');
    status.textContent = 'Спасибо! Заявка отправлена. Мы скоро свяжемся с вами.';
    status.classList.remove('is-error');
    status.classList.add('visible');
    contactForm.reset();
  } catch {
    status.textContent = 'Сервер ещё не подключён, поэтому заявка пока не отправлена. Напишите нам: alichamp0017@mail.ru';
    status.classList.add('is-error', 'visible');
  } finally {
    submit.disabled = false;
  }
});
contactForm?.addEventListener('reset', () => {
  const planButton = contactForm.querySelector('.custom-select-trigger');
  const planValue = contactForm.querySelector('.custom-select input[type="hidden"]');
  if (planButton && planValue) {
    planValue.value = '';
    planButton.textContent = 'Выберите вариант';
    planButton.classList.add('is-placeholder');
    planButton.classList.remove('is-invalid');
  }
});

const heroVideo = document.querySelector('.hero-video');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const syncVideoMotion = () => {
  if (!heroVideo) return;
  if (reduceMotion.matches) {
    heroVideo.pause();
  } else {
    heroVideo.play().catch(() => {
      heroVideo.style.display = 'none';
    });
  }
};

syncVideoMotion();
reduceMotion.addEventListener?.('change', syncVideoMotion);
heroVideo?.addEventListener('error', () => {
  heroVideo.style.display = 'none';
});

let scrollFrame = null;
const updateScrollEffects = () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.body.style.setProperty('--scroll-progress', `${progress}%`);

    if (!reduceMotion.matches && window.innerWidth > 700) {
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) heroImage.style.transform = `translateY(${window.scrollY * 0.12}px) scale(1.02)`;
    }
    scrollFrame = null;
  });
};

window.addEventListener('scroll', updateScrollEffects, { passive: true });
updateScrollEffects();

const chatWidget = document.createElement('aside');
chatWidget.className = 'chat-widget';
chatWidget.innerHTML = `
  <button class="chat-launcher" type="button" aria-expanded="false" aria-controls="siteChat">
    <span class="chat-launcher-icon" aria-hidden="true">✳</span><span>Спросить ИИ</span>
  </button>
  <section class="chat-panel" id="siteChat" aria-label="Чат с помощником СЕВЕР" hidden>
    <header class="chat-head"><div><b>Помощник СЕВЕР</b><small><i></i> Ответы по проектам и строительству</small></div><button class="chat-close" type="button" aria-label="Закрыть чат">×</button></header>
    <div class="chat-messages" aria-live="polite"><div class="chat-message chat-assistant">Здравствуйте! Задайте вопрос о проектах, сроках или строительстве дома.</div></div>
    <form class="chat-form"><label class="visually-hidden" for="chatMessage">Ваш вопрос</label><input id="chatMessage" name="message" maxlength="1000" placeholder="Напишите вопрос…" autocomplete="off" required><button type="submit" aria-label="Отправить сообщение">↗</button></form>
  </section>`;
document.body.append(chatWidget);

const chatLauncher = chatWidget.querySelector('.chat-launcher');
const chatPanel = chatWidget.querySelector('.chat-panel');
const chatMessages = chatWidget.querySelector('.chat-messages');
const chatForm = chatWidget.querySelector('.chat-form');
const chatInput = chatWidget.querySelector('input[name="message"]');
const appendChatMessage = (message, role) => {
  const node = document.createElement('div');
  node.className = `chat-message chat-${role}`;
  node.textContent = message;
  chatMessages.append(node);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return node;
};

chatLauncher.addEventListener('click', () => {
  const open = chatLauncher.getAttribute('aria-expanded') !== 'true';
  chatLauncher.setAttribute('aria-expanded', String(open));
  chatPanel.hidden = !open;
  if (open) chatInput.focus();
});
chatWidget.querySelector('.chat-close').addEventListener('click', () => {
  chatLauncher.setAttribute('aria-expanded', 'false');
  chatPanel.hidden = true;
  chatLauncher.focus();
});
chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  appendChatMessage(message, 'user');
  chatInput.value = '';
  const pending = appendChatMessage('Секунду…', 'assistant');
  const submit = chatForm.querySelector('button');
  submit.disabled = true;
  await new Promise((resolve) => window.setTimeout(resolve, 260));
  pending.textContent = window.SeverTemplateBot
    ? window.SeverTemplateBot.reply(message)
    : 'Помощник временно недоступен. Напишите нам: alichamp0017@mail.ru';
  submit.disabled = false;
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
