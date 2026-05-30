/*
 * Figure 이미지 라이트박스 — 클릭하면 전체 화면으로 확대.
 * astro.config.mjs 의 head 설정으로 페이지당 1회 로드된다(Figure 개수와 무관).
 * 동작: .ue-figure__zoom 버튼 클릭 → 오버레이 열기 / 배경·Esc·× 로 닫기 /
 *       라이트박스 이미지 한 번 더 클릭 → 원본 크기 토글(스크롤 패닝).
 * 오버레이는 첫 클릭 때 한 번만 만들어 재사용한다(이미지 없는 페이지에선 아무것도 안 만듦).
 */
(function () {
  'use strict';

  var overlay, imgEl, capEl, closeBtn;
  var lastFocused = null;
  var openToken = 0;

  function build() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'ue-lightbox';
    overlay.className = 'ue-lightbox';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<button type="button" class="ue-lightbox__close" aria-label="닫기 (Esc)">×</button>' +
      '<figure class="ue-lightbox__figure">' +
      '<img class="ue-lightbox__img" alt="" />' +
      '<figcaption class="ue-lightbox__cap" hidden></figcaption>' +
      '</figure>';
    document.body.appendChild(overlay);

    imgEl = overlay.querySelector('.ue-lightbox__img');
    capEl = overlay.querySelector('.ue-lightbox__cap');
    closeBtn = overlay.querySelector('.ue-lightbox__close');

    // 배경/닫기 버튼/캡션 클릭 → 닫기 (이미지 클릭은 아래에서 전파를 막아 제외).
    overlay.addEventListener('click', close);

    // 라이트박스 이미지 클릭 → 원본 크기 토글.
    imgEl.addEventListener('click', function (e) {
      e.stopPropagation();
      var actual = imgEl.classList.toggle('is-actual');
      overlay.classList.toggle('is-actual', actual);
    });
  }

  function open(src, alt, caption) {
    if (!src) return;
    build();
    openToken++;
    imgEl.src = src;
    imgEl.alt = alt || '';
    if (caption) {
      capEl.textContent = caption;
      capEl.hidden = false;
    } else {
      capEl.textContent = '';
      capEl.hidden = true;
    }
    imgEl.classList.remove('is-actual');
    overlay.classList.remove('is-actual');
    overlay.hidden = false;
    requestAnimationFrame(function () {
      overlay.classList.add('is-open');
    });
    document.documentElement.style.overflow = 'hidden';
    lastFocused = document.activeElement;
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    var token = openToken;
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    // 트랜지션 길이 후 숨김. 그 사이 다시 열리면(토큰 변경) 숨기지 않는다.
    setTimeout(function () {
      if (openToken !== token) return;
      overlay.hidden = true;
      imgEl.removeAttribute('src');
    }, 220);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // 위임: 어떤 Figure 이미지를 눌러도 열린다.
  document.addEventListener('click', function (e) {
    var target = e.target;
    if (!target || typeof target.closest !== 'function') return;
    var zoom = target.closest('.ue-figure__zoom');
    if (!zoom) return;
    var img = zoom.querySelector('img');
    if (!img) return;
    var figure = zoom.closest('figure');
    var cap = figure ? figure.querySelector('figcaption') : null;
    open(
      img.getAttribute('src'),
      img.getAttribute('alt'),
      cap ? (cap.textContent || '').trim() : ''
    );
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && !overlay.hidden) close();
  });
})();
