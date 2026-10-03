/**
 * DEVILMC NETWORK - Mağaza Mantığı (store.js)
 * Siparişler Formspree üzerinden güvenli şekilde iletilir.
 */

const STORE_FORMSPREE_URL = 'https://formspree.io/f/mzebvnbl';

document.addEventListener('DOMContentLoaded', () => {
  initStore();
});

function initStore() {
  // ── Kategori Filtresi ──────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.store-filter-tabs .tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        card.style.display = (filter === 'all' || category === filter) ? 'flex' : 'none';
      });
    });
  });

  // ── Satın Alma Modalı ──────────────────────────────────────────────────────
  const buyModal      = document.getElementById('buy-modal');
  const buyCloseBtn   = document.getElementById('buy-modal-close');
  const buyForm       = document.getElementById('buy-form');
  const buyItemLabel  = document.getElementById('buy-item-name');
  const buyItemPrice  = document.getElementById('buy-item-price');
  const buyNickInput  = document.getElementById('buy-player-nick');
  const buyHiddenItem = document.getElementById('buy-hidden-item');
  const buyHiddenPrice= document.getElementById('buy-hidden-price');
  const buySubmitBtn  = document.getElementById('buy-submit-btn');

  let currentItem = { name: '', price: 0 };

  // Satın Al butonlarına tıklama
  document.querySelectorAll('.buy-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const name  = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      currentItem = { name, price };

      if (buyItemLabel)  buyItemLabel.textContent  = name;
      if (buyItemPrice)  buyItemPrice.textContent  = price + ' ₺';
      if (buyHiddenItem) buyHiddenItem.value        = name;
      if (buyHiddenPrice)buyHiddenPrice.value       = price + ' ₺';

      // Oturum açıksa nick'i otomatik doldur
      const savedUser = localStorage.getItem('devilmc_user');
      if (savedUser && buyNickInput) {
        try {
          const u = JSON.parse(savedUser);
          buyNickInput.value = u.username;
        } catch (e) {}
      }

      if (buyModal) buyModal.classList.add('active');
    });
  });

  // Modalı kapat
  if (buyCloseBtn && buyModal) {
    buyCloseBtn.addEventListener('click', () => buyModal.classList.remove('active'));
    buyModal.addEventListener('click', (e) => {
      if (e.target === buyModal) buyModal.classList.remove('active');
    });
  }

  // ── Form Gönderimi → Formspree ─────────────────────────────────────────────
  if (buyForm) {
    buyForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nick = buyNickInput ? buyNickInput.value.trim() : '';
      if (!nick) {
        window.showToast('Lütfen teslim edilecek Minecraft adınızı girin!', 'error');
        return;
      }

      // Submit butonunu kilitle
      if (buySubmitBtn) {
        buySubmitBtn.disabled = true;
        buySubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...';
      }

      try {
        const res = await fetch(STORE_FORMSPREE_URL, {
          method: 'POST',
          body: new FormData(buyForm),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          if (buyModal) buyModal.classList.remove('active');
          window.showToast(
            'Siparişin alındı! ' + currentItem.name + ' en kısa sürede ' + nick + ' hesabına teslim edilecek.',
            'success'
          );
          buyForm.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          const msg = (data.errors || []).map(function(err) { return err.message; }).join(', ') || 'Bir hata oluştu.';
          window.showToast('Sipariş gönderilemedi: ' + msg, 'error');
        }
      } catch (err) {
        window.showToast('Bağlantı hatası! Lütfen internet bağlantınızı kontrol edin.', 'error');
      } finally {
        if (buySubmitBtn) {
          buySubmitBtn.disabled = false;
          buySubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Satın Almayı Onayla';
        }
      }
    });
  }
}
