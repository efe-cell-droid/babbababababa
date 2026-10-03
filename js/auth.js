/**
 * DEVILMC NETWORK - Kullanıcı Giriş & Minecraft Skin Entegrasyonu (auth.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initAuthSystem();
});

function initAuthSystem() {
  const loginModal = document.getElementById('auth-modal');
  const openLoginBtns = document.querySelectorAll('.open-login-btn');
  const closeLoginBtn = document.getElementById('auth-modal-close');
  const authForm = document.getElementById('auth-form');
  const usernameInput = document.getElementById('auth-username');
  const skinPreview = document.getElementById('modal-skin-preview');
  const userHeaderBox = document.getElementById('header-user-widget');

  checkSavedUser();

  openLoginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginModal) loginModal.classList.add('active');
    });
  });

  if (closeLoginBtn && loginModal) {
    closeLoginBtn.addEventListener('click', () => {
      loginModal.classList.remove('active');
    });

    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.remove('active');
      }
    });
  }

  // Kullanıcı adı yazıldıkça Minecraft kafa derisini (Skin) güncelle
  let typingTimer;
  if (usernameInput && skinPreview) {
    usernameInput.addEventListener('input', () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        const val = usernameInput.value.trim();
        if (val.length >= 3) {
          skinPreview.src = `https://minotar.net/helm/${val}/64.png`;
        } else {
          skinPreview.src = 'https://minotar.net/helm/Steve/64.png';
        }
      }, 400);
    });
  }

  // Giriş Yap Form Gönderimi
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      if (!username) {
        window.showToast('Lütfen geçerli bir Minecraft kullanıcı adı girin!', 'error');
        return;
      }

      const userData = {
        username: username,
        credits: 200,
        loginTime: new Date().toLocaleDateString('tr-TR')
      };

      localStorage.setItem('devilmc_user', JSON.stringify(userData));
      if (loginModal) loginModal.classList.remove('active');

      window.showToast(`DevilMC'ye hoş geldin, ${username}! Giriş başarılı.`, 'success');
      renderLoggedInUser(userData);
    });
  }

  function checkSavedUser() {
    const saved = localStorage.getItem('devilmc_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        renderLoggedInUser(user);
      } catch (err) {
        localStorage.removeItem('devilmc_user');
      }
    }
  }

  function renderLoggedInUser(user) {
    if (!userHeaderBox) return;

    userHeaderBox.innerHTML = `
      <div class="user-auth-widget">
        <div class="skin-avatar-box">
          <img src="https://minotar.net/helm/${user.username}/64.png" alt="${user.username}" 
               onerror="this.src='https://minotar.net/helm/Steve/64.png'">
        </div>
        <div class="user-auth-info">
          <h4>${user.username}</h4>
          <p><span style="color: var(--accent-gold); font-weight: 700;">${user.credits} ₺</span> Kredi | <a href="#" id="logout-btn" style="color: var(--primary); font-size: 0.78rem;">Çıkış</a></p>
        </div>
      </div>
    `;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('devilmc_user');
        window.showToast('Başarıyla çıkış yapıldı.', 'info');
        setTimeout(() => location.reload(), 600);
      });
    }
  }
}
