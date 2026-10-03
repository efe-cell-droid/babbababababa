// Sekme Değiştirme Sistemi
function switchTab(event, tabId) {
    if (event) event.preventDefault();

    // Tüm içerikleri gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Tüm menü aktifliklerini kaldır
    document.querySelectorAll('.nav-links a').forEach(btn => {
        btn.classList.remove('active');
    });

    // Tıklananı aktif et
    document.getElementById(tabId).classList.add('active');
    if (event && event.currentTarget && event.currentTarget.tagName === 'A' && event.currentTarget.parentNode.classList.contains('nav-links')) {
        event.currentTarget.classList.add('active');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// IP Kopyalama Fonksiyonu
function copyIP() {
    const ip = "play.devilmc.com.tr";
    const btn = document.getElementById("ipElement");

    navigator.clipboard.writeText(ip).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Kopyalandı!';
        btn.style.borderColor = "#2ecc71";
        btn.style.color = "#2ecc71";

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.borderColor = "var(--border)";
            btn.style.color = "var(--text-light)";
        }, 2000);
    });
}

// Discord Webhook Başvuru Gönderimi
function submitForm(event) {
    event.preventDefault();

    // Discord'dan aldığın Webhook URL'sini buraya yaz
    const webhookURL = "https://discord.com/api/webhooks/1538218079559880836/HBEULDMgtO9Aq6J1Wxhrgy4_jB-E06zM0LBn-MR_CXApN_mhqefpo6kKe9jc7dIpBrjY";

    const oyuncuAdi = document.getElementById("oyuncuAdi").value;
    const dcAdresi = document.getElementById("dcAdresi").value;
    const yas = document.getElementById("yas").value;
    const basvuruAlani = document.getElementById("basvuruAlani").value;
    const tecrube = document.getElementById("tecrube").value;

    const payload = {
        username: "DevilMC Başvuru Sistemi",
        avatar_url: "https://i.imgur.com/AfFp7pu.png",
        embeds: [
            {
                title: "📝 Yeni Yetkili Başvurusu!",
                color: 15158332,
                fields: [
                    { name: "👤 Oyun İçi Adı", value: `\`${oyuncuAdi}\``, inline: true },
                    { name: "💬 Discord", value: `\`${dcAdresi}\``, inline: true },
                    { name: "📅 Yaş", value: `\`${yas}\``, inline: true },
                    { name: "🎯 Başvurduğu Alan", value: `**${basvuruAlani}**`, inline: false },
                    { name: "📜 Tecrübeler ve Eklenenler", value: tecrube, inline: false }
                ],
                footer: { text: "DevilMC Otomatik Form Sistemi" },
                timestamp: new Date().toISOString()
            }
        ]
    };

    fetch(webhookURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            alert("✅ Başvurunuz başarıyla ekibimize iletildi!");
            event.target.reset();
        } else {
            alert("❌ Bir hata oluştu, mesaj gönderilemedi. Lütfen yetkililerle iletişime geçin.");
        }
    })
    .catch(error => {
        console.error("Hata:", error);
        alert("Bağlantı hatası oluştu.");
    });
}