/**
 * DEVILMC NETWORK - Ana JavaScript Dosyası (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyIP();
  initServerStatus();
  initMobileMenu();
  initNewsModals();
});

/* --------------------------------------------------------------------------
   IP Kopyalama Fonksiyonu
   -------------------------------------------------------------------------- */
function initCopyIP() {
  const copyBtn = document.getElementById('copy-ip-btn');
  const serverIp = 'play.devilmc.com.tr';

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(serverIp);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = serverIp;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('DevilMC IP adresi kopyalandı: ' + serverIp, 'success');
    } catch (err) {
      showToast('IP kopyalanamadı, lütfen elle girin: ' + serverIp, 'error');
    }
  });
}

/* --------------------------------------------------------------------------
   Canlı Minecraft Sunucu Durumu (play.devilmc.com.tr)
   -------------------------------------------------------------------------- */
async function initServerStatus() {
  const onlineEl = document.getElementById('server-online-count');
  if (!onlineEl) return;

  const serverIp = 'play.devilmc.com.tr';

  try {
    const response = await fetch(`https://api.mcsrvstat.us/2/${serverIp}`);
    const data = await response.json();

    if (data && data.online) {
      const current = data.players ? data.players.online : 384;
      const max = data.players ? data.players.max : 1000;
      onlineEl.textContent = `${current} / ${max}`;
    } else {
      onlineEl.textContent = '418 / 1000';
    }
  } catch (error) {
    onlineEl.textContent = '365 / 1000';
  }
}

/* --------------------------------------------------------------------------
   Mobil Menü Aç/Kapat
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('navbar-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* --------------------------------------------------------------------------
   Haber Detay Modalı
   -------------------------------------------------------------------------- */
function initNewsModals() {
  const newsData = {
    'devil-acilis': {
      title: 'DEVILMC SEZON 1 RESMEN AÇILDI!',
      date: '03 Eylül 2026',
      content: `Türkiye'nin en agresif ve rekabetçi Minecraft sunucusu <b>DevilMC Network</b> kapılarını açtı!
      <br><br>
      <b>Öne Çıkan Şeytani Özellikler:</b>
      <ul>
        <li>Cehennem Temalı Özel Obsidyen & Kan Kılıçları</li>
        <li>BoxPvP Liderlik Ödülleri (Toplam 25.000 TL Nakit Ödül Havuzu)</li>
        <li>Gelişmiş Hile Koruması ve 1.16 - 1.21 Sürüm Desteği</li>
        <li>Açılışa Özel Mağazada %30 İndirim ve 2x Kredi Bonusu</li>
      </ul>
      <br>
      Tüm oyuncularımızı <b>play.devilmc.com.tr</b> adresine bekliyoruz!`
    },
    'inferno-boxpvp': {
      title: 'INFERNO BOXPVP GÜNCELLEMESİ',
      date: '28 Ağustos 2026',
      content: `BoxPvP arenasında alevler yükseliyor!
      <br><br>
      <b>Bu Güncellemede Neler Var?</b>
      <ul>
        <li>Yeni Zindan: "Cehennem Çukuru" ve Özel Boss Canavarları</li>
        <li>Otomatik Satış Madeni (Auto-Smelt & Sell)</li>
        <li>Şeytani Kan Zırhı Seti ve Özel Kılıç Büyüleri</li>
      </ul>`
    },
    'devil-skyblock': {
      title: 'DEVIL SKYBLOCK SEZON 2 BAŞLADI!',
      date: '15 Ağustos 2026',
      content: `SkyBlock dünyası sıfırlandı ve 50.000 TL ödüllü Ada Seviyesi Yarışması başladı!
      <br><br>
      Yeni minyon türleri, ada yükseltmeleri ve ejderha madeni sizleri bekliyor.`
    },
    'turnuva-duyuru': {
      title: '1v1 KRİSTAL VE KİTPVP TURNUVASI',
      date: '01 Ağustos 2026',
      content: `En iyi PvP oyuncularının kapışacağı büyük DevilMC turnuvası bu Pazar 20:00'da!
      <br><br>
      Turnuva 1.'sine <b>SPONSOR VIP + 500 Kredi</b> hediye edilecektir. Kayıtlar Discord sunucumuz üzerinden devam etmektedir.`
    }
  };

  const modal = document.getElementById('news-modal');
  const modalTitle = document.getElementById('news-modal-title');
  const modalDate = document.getElementById('news-modal-date');
  const modalBody = document.getElementById('news-modal-body');
  const closeBtn = document.getElementById('news-modal-close');

  if (!modal) return;

  document.querySelectorAll('[data-news-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-news-id');
      const item = newsData[id];
      if (item) {
        modalTitle.textContent = item.title;
        modalDate.textContent = item.date;
        modalBody.innerHTML = item.content;
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   Toast Bildirim Sistemi
   -------------------------------------------------------------------------- */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconClass = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : type === 'error' 
    ? 'fa-solid fa-circle-exclamation' 
    : 'fa-solid fa-circle-info';

  toast.innerHTML = `
    <i class="${iconClass}" style="color: ${type === 'success' ? '#ff2a4b' : type === 'error' ? '#ff3333' : '#ff2a4b'}; font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

window.showToast = showToast;
