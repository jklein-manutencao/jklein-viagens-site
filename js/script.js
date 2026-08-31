document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Ano no rodapé
  document.querySelectorAll('.footer-bottom .year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Carrega cards e imagens: primeiro tenta a planilha (Google Sheets),
  // e se não estiver configurada, usa o arquivo content/<pagina>.json
  var pageKey = document.body.getAttribute('data-content');
  if (!pageKey) return;

  function renderPage(data) {
    var heroImg = document.querySelector('[data-hero-image]');
    if (heroImg && data.hero_image) {
      heroImg.src = data.hero_image;
    }

    var container = document.querySelector('[data-cards-container]');
    if (!container || !Array.isArray(data.cards)) return;

    container.innerHTML = '';
    data.cards.forEach(function (card) {
      var article = document.createElement('article');
      article.className = 'card';
      article.innerHTML =
        '<div class="card-img"><img src="' + escapeHtml(card.image) + '" alt="' + escapeHtml(card.title) + '" loading="lazy"></div>' +
        '<div class="card-body">' +
        '<h3>' + escapeHtml(card.title) + '</h3>' +
        '<p>' + escapeHtml(card.desc) + '</p>' +
        '<a href="' + escapeHtml(card.link || 'https://w.app/jkleinviagens') + '" target="_blank" rel="noopener" class="card-link">Saiba mais &rarr;</a>' +
        '</div>';
      container.appendChild(article);
    });
  }

  function loadFromJson() {
    fetch('content/' + pageKey + '.json', { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(renderPage)
      .catch(function (err) {
        console.error('Não foi possível carregar o conteúdo da página:', err);
      });
  }

  var sheetUrl = (typeof SHEET_CSV_URLS !== 'undefined') ? SHEET_CSV_URLS[pageKey] : '';

  if (sheetUrl && typeof Papa !== 'undefined') {
    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        var rows = results.data || [];
        // Uma linha especial com nome_do_lugar = "__HERO__" define a foto de fundo (opcional)
        var heroRow = rows.find(function (r) { return (r.nome_do_lugar || '').trim() === '__HERO__'; });
        var cards = rows
          .filter(function (r) { return (r.nome_do_lugar || '').trim() !== '__HERO__' && (r.nome_do_lugar || '').trim() !== ''; })
          .map(function (r) {
            return { title: r.nome_do_lugar, desc: r.frase_curta, image: r.nome_da_imagem, link: r.link_do_whatsapp };
          });
        renderPage({
          hero_image: heroRow ? heroRow.nome_da_imagem : null,
          cards: cards
        });
      },
      error: function (err) {
        console.error('Erro ao carregar a planilha, usando content/*.json como reserva:', err);
        loadFromJson();
      }
    });
  } else {
    loadFromJson();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
