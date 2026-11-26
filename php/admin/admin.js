/* پنل مدیریت قالب — تعاملات سبک */
(function(){
  // Drag & Drop ترتیب اجزای صفحه اصلی
  var list = document.getElementById('secList');
  if (list) {
    var dragging = null;
    list.querySelectorAll('.adm-sec-row').forEach(function(row){
      row.draggable = true;
      row.addEventListener('dragstart', function(){ dragging = row; row.classList.add('dragging'); });
      row.addEventListener('dragend', function(){ row.classList.remove('dragging'); dragging = null; sync(); });
      row.addEventListener('dragover', function(e){ e.preventDefault(); if (!dragging || dragging === row) return;
        var r = row.getBoundingClientRect(); var after = (e.clientY - r.top) > r.height / 2;
        list.insertBefore(dragging, after ? row.nextSibling : row); });
    });
    function sync(){ list.querySelectorAll('.adm-sec-row').forEach(function(row, i){ var n = row.querySelector('.sec-num'); if (n) n.textContent = (i+1); }); }
  }
  // پیش‌نمایش سه‌دستگاهی
  var frame = document.getElementById('previewFrame');
  document.querySelectorAll('[data-device]').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('[data-device]').forEach(function(b){ b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      if (frame) { frame.style.maxWidth = btn.getAttribute('data-device') + 'px'; frame.style.margin = '0 auto'; frame.style.display = 'block'; }
    });
  });
  var reload = document.getElementById('previewReload');
  if (reload && frame) reload.addEventListener('click', function(){ frame.src = frame.src.split('?')[0] + '?_=' + Date.now(); });
  // پیش‌نمایش زنده رنگ‌ها
  document.querySelectorAll('[data-live]').forEach(function(inp){
    inp.addEventListener('input', function(){ var p = document.getElementById('livePreview'); if (p) p.style.setProperty(inp.getAttribute('data-live'), inp.value + (inp.getAttribute('data-unit') || '')); });
  });
})();

/* ═══ جستجوی بخش‌ها + حالت تاریک ═══ */
(function(){
  var body = document.body;
  try { if (localStorage.getItem('mm_adm_dark') === '1') body.classList.add('is-dark'); } catch(e){}
  var dk = document.getElementById('admDark');
  if (dk) dk.addEventListener('click', function(){ body.classList.toggle('is-dark'); try { localStorage.setItem('mm_adm_dark', body.classList.contains('is-dark') ? '1' : '0'); } catch(e){} });
  var s = document.getElementById('admSearch'), tabs = {};
  try { tabs = JSON.parse(body.getAttribute('data-tabs') || '{}'); } catch(e){}
  if (s) s.addEventListener('change', function(){
    var v = s.value.trim(); for (var k in tabs) { if (tabs[k] === v || tabs[k].indexOf(v) !== -1) { location.href = 'index.php?tab=' + k; return; } }
  });
})();
