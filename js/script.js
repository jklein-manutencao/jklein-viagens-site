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

  // Carrega cards e imagens a partir de /content/<pagina>.json
  var pageKey = document.body.getAttribute('data-content');
  if (!pageKey) return;

  fetch('content/' + pageKey + '.json', { cache: 'no-store' })
    .then(function (res) { return res.json(); })
    .then(function (data) {
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
          '<a href="https://w.app/jkleinviagens" target="_blank" rel="noopener" class="card-link">Saiba mais &rarr;</a>' +
          '</div>';
        container.appendChild(article);
      });
    })
    .catch(function (err) {
      console.error('Não foi possível carregar o conteúdo da página:', err);
    });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
});
