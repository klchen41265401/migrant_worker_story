/**
 * main.js — 動態載入 HTML 區段並初始化頁面互動功能
 *
 * 職責：
 *   1. 依序載入 sections/ 下的 HTML 片段並注入 #content
 *   2. 初始化進度條、回到頂部按鈕
 *   3. 初始化導覽列捲動高亮
 *   4. 提供心理分析版本切換
 */
(function () {
  'use strict';

  /** 區段檔案清單（載入順序） */
  var SECTION_FILES = [
    'sections/intro.html',
    'sections/timeline-q1.html',
    'sections/timeline-q2.html',
    'sections/timeline-q3.html',
    'sections/timeline-q4.html',
    'sections/timeline-2025.html',
    'sections/timeline-2026.html',
    'sections/analysis.html',
  ];

  /** 頁尾 HTML */
  var FOOTER_HTML =
    '<div class="footer">' +
    '<p>這是一段真實的經歷紀錄。部分個人資訊已隱藏保護當事人。</p>' +
    '<p style="margin-top: 8px">小恩 &amp; 戎狄的故事 — 2024–2026 紀實</p>' +
    '<p style="margin-top: 4px; font-size: 0.78rem">最後更新：2026-04-09</p>' +
    '</div>';

  /**
   * 初始化捲動監聽：進度條 + 回到頂部按鈕
   */
  function initScrollListeners() {
    window.addEventListener('scroll', function () {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      var scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      document.getElementById('progressBar').style.width = progress + '%';
      document
        .getElementById('backTop')
        .classList.toggle('show', window.scrollY > 400);
    });
  }

  /**
   * 初始化導覽列高亮（IntersectionObserver）
   * 必須在內容載入完成後呼叫
   */
  function initNavObserver() {
    var sections = document.querySelectorAll(
      '.section-title, #intro, #analysis'
    );
    var navLinks = document.querySelectorAll('.nav-bar a');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    sections.forEach(function (s) {
      observer.observe(s);
    });
    console.log(
      '[main.js] 導覽列觀察器已啟動，監控 ' + sections.length + ' 個區段'
    );
  }

  /**
   * 依序載入所有區段 HTML 片段並注入頁面
   */
  async function loadSections() {
    var container = document.getElementById('content');

    try {
      var responses = await Promise.all(
        SECTION_FILES.map(function (file) {
          return fetch(file).then(function (res) {
            if (!res.ok) {
              throw new Error(
                '無法載入 ' + file + '（HTTP ' + res.status + '）'
              );
            }
            return res.text();
          });
        })
      );

      container.innerHTML = responses.join('\n') + FOOTER_HTML;
      console.log(
        '[main.js] 所有區段載入完成（共 ' + SECTION_FILES.length + ' 個檔案）'
      );
    } catch (err) {
      console.error('[main.js] 載入區段失敗:', err);
      container.innerHTML =
        '<div style="text-align:center;padding:60px 20px;color:#c53030;">' +
        '<p>內容載入失敗，請重新整理頁面。</p>' +
        '<p style="font-size:0.85rem;color:#6b6560;margin-top:8px;">' +
        err.message +
        '</p></div>';
      return;
    }

    // 載入完成後初始化互動功能
    initNavObserver();

    // 處理 URL hash 跳轉（例如 #apr 直接跳到四月）
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(function () {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }

  // --- 啟動 ---
  initScrollListeners();
  loadSections();
})();

/**
 * 心理分析版本切換（全域函式，供 onclick 呼叫）
 * @param {string} version - 'neutral' | 'savage' | 'ultimate'
 */
function switchAnalysis(version) {
  var versions = ['neutral', 'savage', 'ultimate'];
  var ids = ['analysis-neutral', 'analysis-savage', 'analysis-ultimate'];
  var labels = document.querySelectorAll('.version-toggle-label');

  for (var i = 0; i < versions.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) {
      el.style.display = versions[i] === version ? 'block' : 'none';
    }
  }

  labels.forEach(function (l) {
    l.classList.remove('active');
    if (l.classList.contains(version)) {
      l.classList.add('active');
    }
  });
}
// Progress bar & back to top
window.addEventListener('scroll', () => {
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
  document
    .getElementById('backTop')
    .classList.toggle('show', window.scrollY > 400);
});

// Nav active state
const sections = document.querySelectorAll('.section-title, #intro, #analysis');
const navLinks = document.querySelectorAll('.nav-bar a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + id
          );
        });
      }
    });
  },
  { rootMargin: '-80px 0px -80% 0px' }
);

sections.forEach((s) => observer.observe(s));

// Analysis version toggle (3 versions)
function switchAnalysis(version) {
  var versions = ['neutral', 'savage', 'ultimate'];
  var ids = ['analysis-neutral', 'analysis-savage', 'analysis-ultimate'];
  var labels = document.querySelectorAll('.version-toggle-label');
  for (var i = 0; i < versions.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) el.style.display = versions[i] === version ? 'block' : 'none';
  }
  labels.forEach(function (l) {
    l.classList.remove('active');
    if (l.classList.contains(version)) l.classList.add('active');
  });
}
