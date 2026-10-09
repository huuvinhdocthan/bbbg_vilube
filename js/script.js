window.initBBBG = function () {
  /* ============================================================
   *  ĐA NGÔN NGỮ (VI / EN)
   * ============================================================ */
  var currentLang = 'vi';

  // Từ điển cho các chuỗi sinh động bằng JS (panel, nút thêm/xóa, thông báo...)
  var DICT = {
	assetItem:      { vi: 'Tài sản #',              en: 'Asset #' },
	phTen:          { vi: 'Tên tài sản',            en: 'Asset name' },
	searchDevice:   { vi: '🔍 Chọn nhanh từ danh mục: gõ tên hoặc mã...', en: '🔍 Pick from catalog: type name or code...' },
	noDevice:       { vi: 'Không tìm thấy thiết bị nào.', en: 'No matching device found.' },
	phKemTheo:      { vi: 'VD: 01 Adapter sạc Dell', en: 'e.g. 01 Dell power adapter' },
	chkKemTheo:     { vi: ' Có phụ kiện kèm theo',  en: ' Has included accessories' },
	chkKhac:        { vi: ' Có dòng thông tin khác', en: ' Has other info line' },
	phKhac:         { vi: 'Nội dung tự nhập...',    en: 'Type your own info...' },
	phSl:           { vi: 'SL',                     en: 'Qty' },
	phMa:           { vi: 'Mã tài sản',             en: 'Asset code' },
	phGia:          { vi: 'Giá trị tài sản',        en: 'Asset value' },
	ghiChu:         { vi: 'Ghi chú',                en: 'Notes' },
	phTinhTrang:    { vi: 'Tình trạng',             en: 'Condition' },
	phNgayMua:      { vi: 'Ngày mua',               en: 'Purchase date' },
	phBaoHanh:      { vi: 'Bảo hành',               en: 'Warranty' },
	chkThuHoi:      { vi: ' Có thu hồi thiết bị cũ', en: ' Recall old device' },
	phThuHoi:       { vi: 'Tên thiết bị cũ (S/T: ...)', en: 'Old device name (S/N: ...)' },
	btnThuHoi:      { vi: '+ Thu hồi thiết bị cũ',  en: '+ Recall old device' },
	titleDel:       { vi: 'Xóa dòng',               en: 'Delete row' },
	confirmDel:     { vi: 'Xóa dòng thiết bị này?', en: 'Delete this equipment row?' },
	alertMinRow:    { vi: 'Bảng phải có ít nhất 1 dòng thiết bị.', en: 'The table must have at least 1 equipment row.' },
	alertNoLib:     {
	  vi: 'Không tải được thư viện tạo .docx (cần kết nối mạng). Vui lòng kiểm tra internet rồi thử lại, hoặc dùng nút Xuất Word (.doc).',
	  en: 'Could not load the .docx library (internet required). Please check your connection and try again, or use the Export Word (.doc) button.'
	},
	newTen:         { vi: 'Tên tài sản',            en: 'Asset name' },
	newMa:          { vi: 'Mã tài sản',             en: 'Asset code' },
	newTinhTrang:   { vi: 'Mới 100%',               en: '100% new' },
	condUsed:       { vi: 'Đã sử dụng',             en: 'Used' },
	docTitle:       { vi: 'Biên bản bàn giao tài sản', en: 'Asset Handover Minutes' },
	lblCpu:         { vi: 'CPU',                    en: 'CPU' },
	lblRam:         { vi: 'RAM',                    en: 'RAM' },
	lblStorage:     { vi: 'Ổ cứng',                 en: 'Storage' },
	btnAddDevice:   { vi: '+ Thêm',                 en: '+ Add' }
  };

  var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
				   'July', 'August', 'September', 'October', 'November', 'December'];

  function t(key) {
	var entry = DICT[key];
	return entry ? (entry[currentLang] || entry.vi) : '';
  }

  // Đổi ngôn ngữ cho toàn bộ phần tử có gắn data-en (bản gốc tiếng Việt được lưu vào data-vi)
  function applyLanguage() {
	document.querySelectorAll('[data-en]').forEach(function (el) {
	  if (!el.hasAttribute('data-vi')) el.setAttribute('data-vi', el.textContent);
	  el.textContent = currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
	});
	document.querySelectorAll('.row-thuhoi-btn').forEach(function (btn) {
	  btn.textContent = t('btnThuHoi');
	});
	document.querySelectorAll('.row-del-btn').forEach(function (btn) {
	  btn.title = t('titleDel');
	});
	document.querySelectorAll('.side-sec-add').forEach(function (btn) {
	  btn.textContent = t('btnAddDevice');
	});
	document.documentElement.lang = currentLang;
	document.title = t('docTitle');
	updateNgay();
	renderAssetPanel();
  }

  function setLang(lang) {
	currentLang = lang;
	document.getElementById('langViBtn').classList.toggle('active', lang === 'vi');
	document.getElementById('langEnBtn').classList.toggle('active', lang === 'en');
	applyLanguage();
  }

  // Cờ dạng SVG cho nút VI / EN — emoji cờ (🇻🇳 🇬🇧) không hiển thị trên Windows, chỉ ra chữ "VN"/"GB"
  var FLAG_VI = '<svg class="lang-flag" viewBox="0 0 30 20" aria-hidden="true">' +
	'<rect width="30" height="20" fill="#da251d"/>' +
	'<polygon fill="#ffff00" points="15.00,4.40 16.39,8.68 20.90,8.68 17.25,11.33 18.64,15.62 15.00,12.97 11.36,15.62 12.75,11.33 9.10,8.68 13.61,8.68"/></svg>';
  var FLAG_EN = '<svg class="lang-flag" viewBox="0 0 60 30" aria-hidden="true">' +
	'<clipPath id="ukClip"><path d="M30,15h30v15zv15h-30zh-30v-15zv-15h30z"/></clipPath>' +
	'<path d="M0,0v30h60v-30z" fill="#012169"/>' +
	'<path d="M0,0 60,30M60,0 0,30" stroke="#fff" stroke-width="6"/>' +
	'<path d="M0,0 60,30M60,0 0,30" clip-path="url(#ukClip)" stroke="#c8102e" stroke-width="4"/>' +
	'<path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/>' +
	'<path d="M30,0v30M0,15h60" stroke="#c8102e" stroke-width="6"/></svg>';
  document.getElementById('langViBtn').innerHTML = FLAG_VI + '<span>Tiếng Việt</span>';
  document.getElementById('langEnBtn').innerHTML = FLAG_EN + '<span>English</span>';

  document.getElementById('langViBtn').addEventListener('click', function () { setLang('vi'); });
  document.getElementById('langEnBtn').addEventListener('click', function () { setLang('en'); });

  /* ============================================================
   *  PANEL CHỈNH SỬA NHANH
   * ============================================================ */
  // Panel luôn mở — bỏ nút "Chỉnh sửa nhanh" (chỉ dùng để ẩn/hiện panel, không cần thiết)
  var toggleBtn = document.getElementById('toggleEditBtn');
  if (toggleBtn) toggleBtn.remove();
  document.getElementById('editPanel').classList.add('open');

  // Đổi chữ 1 nhãn song ngữ (giữ cơ chế data-vi / data-en của applyLanguage)
  function setLabel(span, vi, en) {
	if (!span) return;
	span.setAttribute('data-vi', vi);
	span.setAttribute('data-en', en);
	span.textContent = currentLang === 'en' ? en : vi;
  }

  /* Nhóm "Thông tin chung": gom theo từng bên, mỗi bên 1 khối có viền màu
   *   BÊN A · BÀN GIAO (xanh dương) — BÊN B · NHẬN (xanh lá) — QUẢN LÝ TRỰC TIẾP (cam, có công tắc) */
  function groupPartyFields(body) {
	var grids = body.querySelectorAll(':scope > .asset-panel-grid');
	function partyBox(cls, vi, en, content) {
	  var box = document.createElement('div');
	  box.className = 'party-box ' + cls;
	  var head = document.createElement('div');
	  head.className = 'party-head';
	  var title = document.createElement('span');
	  setLabel(title, vi, en);
	  head.appendChild(title);
	  box.appendChild(head);
	  content.parentNode.insertBefore(box, content);
	  box.appendChild(content);
	  return { box: box, head: head };
	}
	if (grids[0]) {
	  partyBox('party-a', 'Bên A · Bàn giao', 'Party A · Handover', grids[0]);
	  var a = grids[0].querySelectorAll('label > span[data-en]');
	  setLabel(a[0], 'Họ tên', 'Full name');
	}
	if (grids[1]) {
	  partyBox('party-b', 'Bên B · Nhận', 'Party B · Receiver', grids[1]);
	  var b = grids[1].querySelectorAll('label > span[data-en]');
	  setLabel(b[0], 'Họ tên', 'Full name');
	}

	// Quản lý trực tiếp: ô tick -> công tắc trên tiêu đề khối; tắt thì ẩn ô nhập
	var chk = document.getElementById('chkQuanLy');
	var inp = document.getElementById('inpQuanLy');
	if (chk && inp) {
	  var chkRow = chk.closest('label');
	  var inpLabel = inp.closest('label');
	  var mgr = partyBox('party-mgr', 'Quản lý trực tiếp', 'Direct manager', inpLabel);
	  var sw = document.createElement('label');
	  sw.className = 'party-switch';
	  sw.appendChild(chk);
	  mgr.head.appendChild(sw);
	  var lbl = inpLabel.querySelector('span[data-en]');
	  if (lbl) lbl.style.display = 'none';      // tiêu đề khối đã có chữ "Quản lý trực tiếp"
	  if (chkRow) chkRow.remove();
	  function syncMgr() { mgr.box.classList.toggle('off', !chk.checked); }
	  chk.addEventListener('change', syncMgr);
	  syncMgr();
	}
  }

  (function buildSidebarSections() {
	var panel = document.getElementById('editPanel');
	var oldTitle = panel.querySelector('.panel-section-title');
	var assetList = document.getElementById('assetPanelList');

	function makeSection(id, iconVi, titleEn, titleVi) {
	  var sec = document.createElement('details');
	  sec.className = 'side-sec';
	  sec.id = id;
	  sec.open = true;
	  var sum = document.createElement('summary');
	  sum.innerHTML = '<span class="side-sec-title" data-en="' + iconVi + ' ' + titleEn + '">' + iconVi + ' ' + titleVi + '</span>';
	  sec.appendChild(sum);
	  var body = document.createElement('div');
	  body.className = 'side-sec-body';
	  sec.appendChild(body);
	  return { sec: sec, sum: sum, body: body };
	}

	// Nhóm 1: mọi trường nằm trước tiêu đề "Tài sản phần cứng"
	var info = makeSection('secInfo', '📋', 'General info', 'Thông tin chung');
	while (panel.firstChild && panel.firstChild !== oldTitle) info.body.appendChild(panel.firstChild);
	panel.insertBefore(info.sec, oldTitle);
	groupPartyFields(info.body);

	// Nhóm 2: ô tìm danh mục + các thẻ thiết bị, kèm nút "+ Thêm" trên đầu
	var dev = makeSection('secDevices', '💻', 'Devices', 'Thiết bị');
	var count = document.createElement('span');
	count.id = 'secDevicesCount';
	count.className = 'side-sec-count';
	dev.sum.appendChild(count);
	var addBtn = document.createElement('button');
	addBtn.type = 'button';
	addBtn.className = 'side-sec-add';
	addBtn.textContent = t('btnAddDevice');
	addBtn.addEventListener('click', function (e) {
	  e.preventDefault();          // không đóng/mở nhóm khi bấm nút
	  e.stopPropagation();
	  addHwRow();
	  openAssetIdx = document.querySelectorAll('#hwBody tr').length - 1;
	  dev.sec.open = true;
	  applyLanguage();
	  var cards = document.querySelectorAll('#assetPanelList .asset-card');
	  var last = cards[cards.length - 1];
	  if (last) {
		last.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
		var first = last.querySelector('.catalog-search') || last.querySelector('input');
		if (first) first.focus();
	  }
	});
	dev.sum.appendChild(addBtn);
	dev.body.appendChild(assetList);
	panel.insertBefore(dev.sec, oldTitle);
	oldTitle.remove();
  })();

  function pad(n) { return String(n).padStart(2, '0'); }

  // Đánh số lại cột STT theo đúng thứ tự dòng còn lại
  function renumberHwRows() {
	var tbody = document.getElementById('hwBody');
	Array.prototype.forEach.call(tbody.querySelectorAll('tr'), function (tr, idx) {
	  var sttEl = tr.querySelector('.row-stt');
	  if (sttEl) sttEl.textContent = pad(idx + 1);
	});
  }

  // Thêm dòng thiết bị mới vào bảng Phần cứng (đầy đủ data-role + data-en để tự dịch và tự vào panel)
  function addHwRow() {
	var tbody = document.getElementById('hwBody');
	var stt = pad(tbody.querySelectorAll('tr').length + 1);
	var tr = document.createElement('tr');
	tr.innerHTML =
	  '<td class="center"><span class="row-stt">' + stt + '</span>' +
	  '<button class="row-del-btn" type="button" title="' + t('titleDel') + '">✕</button></td>' +
	  '<td><span class="editable-field" data-role="ten" contenteditable="true">' + t('newTen') + '</span>' +
	  '<ul class="plain row-specs-list">' +
	  '<li><span data-en="CPU: ">CPU: </span><span class="editable-field" data-role="cpu" contenteditable="true">--</span></li>' +
	  '<li><span data-en="RAM: ">RAM: </span><span class="editable-field" data-role="ram" contenteditable="true">--</span></li>' +
	  '<li><span data-en="Storage: ">Storage: </span><span class="editable-field" data-role="storage" contenteditable="true">--</span></li>' +
	  '<li><span data-en="Included: ">Kèm theo: </span>' +
	  '<span class="editable-field" data-role="kemtheo" contenteditable="true">--</span></li></ul></td>' +
	  '<td class="center"><span class="editable-field" data-role="sl" contenteditable="true">01</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="ma" contenteditable="true">' + t('newMa') + '</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="gia" contenteditable="true">-</span></td>' +
	  '<td><ul class="plain row-ghichu-list">' +
	  '<li><span data-en="Condition: ">Tình trạng: </span><span class="editable-field" data-role="tinhtrang" contenteditable="true">' + t('newTinhTrang') + '</span></li>' +
	  '<li><span data-en="Purchase date: ">Ngày mua: </span><span class="editable-field" data-role="ngaymua" contenteditable="true">--/--/----</span></li>' +
	  '<li><span data-en="Warranty ">Bảo hành </span><span class="editable-field" data-role="baohanh" contenteditable="true">--</span></li>' +
	  '</ul>' +
	  '<button class="row-thuhoi-btn" type="button">' + t('btnThuHoi') + '</button></td>';
	tbody.appendChild(tr);
	return tr;
  }

  document.getElementById('addHwRowBtn').addEventListener('click', function () {
	var tr = addHwRow();
	applyLanguage();
	var firstField = tr.querySelector('.editable-field');
	if (firstField) firstField.focus();
  });

  // Xóa dòng / thêm mục "Thu hồi thiết bị cũ" — dùng ủy quyền sự kiện vì các dòng có thể được thêm động
  document.getElementById('hwBody').addEventListener('click', function (e) {
	var delBtn = e.target.closest ? e.target.closest('.row-del-btn') : null;
	if (delBtn) {
	  var tr = delBtn.closest('tr');
	  var tbody = document.getElementById('hwBody');
	  if (tbody.querySelectorAll('tr').length <= 1) {
		alert(t('alertMinRow'));
		return;
	  }
	  if (confirm(t('confirmDel'))) {
		tr.remove();
		renumberHwRows();
		renderAssetPanel();
	  }
	  return;
	}

	var thuHoiBtn = e.target.closest ? e.target.closest('.row-thuhoi-btn') : null;
	if (thuHoiBtn) {
	  var ul = thuHoiBtn.previousElementSibling;
	  if (!ul || !ul.classList.contains('row-ghichu-list')) return;
	  if (ul.querySelector('[data-role="thuhoi"]')) return;
	  var li = document.createElement('li');
	  li.innerHTML = '<span data-en="Recall ">Thu hồi </span>' +
		'<span class="editable-field" data-role="thuhoi" contenteditable="true"></span>';
	  ul.appendChild(li);
	  applyLanguage();
	  var f = li.querySelector('[data-role="thuhoi"]');
	  if (f) f.focus();
	}
  });

  /* ============================================================
   *  DANH MỤC THIẾT BỊ (data-thietbi.js — quản lý bằng admin.html)
   * ============================================================ */
  function getCatalog() {
	return Array.isArray(window.BBBG_DEVICES) ? window.BBBG_DEVICES : [];
  }

  // Các dòng thông số nằm dưới Tên tài sản, theo đúng thứ tự hiển thị
  var SPEC_DEFS = [
	{ role: 'cpu',     vi: 'CPU: ',      en: 'CPU: ',       chiMay: true },
	{ role: 'ram',     vi: 'RAM: ',      en: 'RAM: ',       chiMay: true },
	{ role: 'storage', vi: 'Storage: ',  en: 'Storage: ',   chiMay: true },
	{ role: 'kemtheo', vi: 'Kèm theo: ', en: 'Included: ',  chiMay: false },
	{ role: 'khac',    vi: 'Khác: ',     en: 'Other: ',     chiMay: false }
  ];

  function escHtml(s) {
	return String(s == null ? '' : s)
	  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Dựng lại khối thông số theo loại thiết bị:
  //   loai = "may"  -> có CPU / RAM / Ổ cứng
  //   loai = "khac" -> bỏ hẳn 3 dòng đó (màn hình, chuột, phím...)
  function rebuildSpecs(tr, dev) {
	var tenEl = tr.querySelector('[data-role="ten"]');
	if (!tenEl) return;
	var ul = tr.querySelector('.row-specs-list');
	var laMay = window.BBBG_getType ? window.BBBG_getType(dev.loai).specs : true;

	var rows = SPEC_DEFS.filter(function (d) {
	  if (d.chiMay && !laMay) return false;
	  return !!(dev[d.role] && String(dev[d.role]).trim());
	});

	if (!rows.length) { if (ul) ul.remove(); return; }

	if (!ul) {
	  ul = document.createElement('ul');
	  ul.className = 'plain row-specs-list';
	  tenEl.parentNode.appendChild(ul);
	}
	ul.innerHTML = rows.map(function (d) {
	  return '<li><span data-en="' + escHtml(d.en) + '">' + escHtml(d.vi) + '</span>' +
		'<span class="editable-field" data-role="' + d.role + '" contenteditable="true">' +
		escHtml(dev[d.role]) + '</span></li>';
	}).join('');
  }

  // Điền thông tin 1 thiết bị trong danh mục vào 1 dòng của bảng
  function applyDeviceToRow(tr, dev) {
	function setField(role, value) {
	  var el = tr.querySelector('[data-role="' + role + '"]');
	  if (el && value) el.textContent = value;
	}
	setField('ten', dev.ten);
	setField('ma', dev.ma);
	setField('gia', dev.gia);
	setField('ngaymua', dev.ngaymua);
	setField('baohanh', dev.baohanh);
	rebuildSpecs(tr, dev);
	applyLanguage(); // dịch nhãn mới + dựng lại panel
  }

  /* ---- Ô TÌM DANH MỤC — nằm ngay trong thẻ của từng thiết bị ----
   * Chọn kết quả -> điền thẳng vào ĐÚNG dòng của thẻ đó (không còn bước "Áp dụng vào dòng"). */
  function normText(s) {
	return stripAccents(String(s || '')).toLowerCase();
  }

  function makeCatalogPicker(tr) {
	var cat = getCatalog();
	if (!cat.length) return null;

	var box = document.createElement('div');
	box.className = 'catalog-box';

	var inp = document.createElement('input');
	inp.type = 'text';
	inp.className = 'catalog-search';
	inp.placeholder = t('searchDevice');
	box.appendChild(inp);

	var res = document.createElement('div');
	res.className = 'catalog-results';
	box.appendChild(res);

	function renderResults() {
	  var q = normText(inp.value).trim();
	  res.innerHTML = '';
	  var matches = cat.filter(function (d) {
		return !q || normText(d.ten).indexOf(q) >= 0 || normText(d.ma).indexOf(q) >= 0;
	  });
	  if (!matches.length) {
		var none = document.createElement('div');
		none.className = 'catalog-none';
		none.textContent = t('noDevice');
		res.appendChild(none);
		return;
	  }
	  matches.slice(0, 30).forEach(function (d) {
		var it = document.createElement('div');
		it.className = 'catalog-result';
		var tp = window.BBBG_getType ? window.BBBG_getType(d.loai) : { icon: '💻' };
		it.innerHTML =
		  '<span class="cat-name">' + tp.icon + ' ' + escHtml(d.ten) + '</span>' +
		  (d.ma ? '<span class="cat-ma">' + escHtml(d.ma) + '</span>' : '');
		it.addEventListener('mousedown', function (e) { e.preventDefault(); }); // giữ focus, tránh đóng danh sách trước khi click
		it.addEventListener('click', function () { applyDeviceToRow(tr, d); });
		res.appendChild(it);
	  });
	}

	// Danh sách gợi ý chỉ hiện khi đang ở trong ô tìm — đỡ chiếm chỗ
	inp.addEventListener('focus', function () { renderResults(); box.classList.add('show-results'); });
	inp.addEventListener('input', function () { renderResults(); box.classList.add('show-results'); });
	inp.addEventListener('blur', function () { box.classList.remove('show-results'); });
	inp.addEventListener('keydown', function (e) {
	  if (e.key === 'Escape') { inp.blur(); }
	  if (e.key === 'Enter') {      // Enter = chọn kết quả đầu tiên
		var first = res.querySelector('.catalog-result');
		if (first) first.click();
	  }
	});
	return box;
  }

  /* ---- Panel thiết bị: mỗi thiết bị 1 thẻ thu gọn được, chỉ mở 1 thẻ mỗi lúc ----
   * Bấm vào dòng thiết bị trong biên bản -> tự mở đúng thẻ đó và tô sáng dòng. */
  var openAssetIdx = 0;   // thẻ đang mở (-1 = đóng hết)

  function highlightRow(idx) {
	document.querySelectorAll('#hwBody tr').forEach(function (tr, i) {
	  tr.classList.toggle('row-active', i === idx);
	});
  }

  function openAsset(idx, scroll) {
	openAssetIdx = idx;
	document.querySelectorAll('#assetPanelList .asset-card').forEach(function (card, i) {
	  card.classList.toggle('open', i === idx);
	});
	highlightRow(idx);
	if (scroll && idx >= 0) {
	  var card = document.querySelectorAll('#assetPanelList .asset-card')[idx];
	  if (card) card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}
  }

  // Dựng panel chỉnh sửa nhanh cho TẤT CẢ dòng tài sản hiện có (kể cả dòng vừa thêm)
  function renderAssetPanel() {
	var tbody = document.getElementById('hwBody');
	var list = document.getElementById('assetPanelList');
	if (!tbody || !list) return;
	list.innerHTML = '';
	var rows = tbody.querySelectorAll('tr');
	if (openAssetIdx >= rows.length) openAssetIdx = rows.length - 1;
	var countEl = document.getElementById('secDevicesCount');
	if (countEl) countEl.textContent = '(' + rows.length + ')';

	Array.prototype.forEach.call(rows, function (tr, idx) {
	  var tenEl = tr.querySelector('[data-role="ten"]');
	  var slEl = tr.querySelector('[data-role="sl"]');
	  var maEl = tr.querySelector('[data-role="ma"]');
	  var giaEl = tr.querySelector('[data-role="gia"]');
	  var tinhTrangEl = tr.querySelector('[data-role="tinhtrang"]');
	  var ngayMuaEl = tr.querySelector('[data-role="ngaymua"]');
	  var baoHanhEl = tr.querySelector('[data-role="baohanh"]');
	  var thuHoiEl = tr.querySelector('[data-role="thuhoi"]');
	  var ghiChuUl = tr.querySelector('.row-ghichu-list');
	  if (!tenEl) return;

	  var item = document.createElement('div');
	  item.className = 'asset-card' + (idx === openAssetIdx ? ' open' : '');

	  // Đầu thẻ: số thứ tự · tên · mã · nút xóa · mũi tên
	  var head = document.createElement('div');
	  head.className = 'asset-card-head';
	  var noEl = document.createElement('span');
	  noEl.className = 'asset-card-no';
	  noEl.textContent = pad(idx + 1);
	  var nameEl = document.createElement('span');
	  nameEl.className = 'asset-card-name';
	  var maTag = document.createElement('span');
	  maTag.className = 'asset-card-ma';
	  var delBtn = document.createElement('button');
	  delBtn.type = 'button';
	  delBtn.className = 'asset-card-del';
	  delBtn.title = t('titleDel');
	  delBtn.textContent = '🗑';
	  var arrow = document.createElement('span');
	  arrow.className = 'asset-card-arrow';
	  arrow.textContent = '▾';
	  head.appendChild(noEl);
	  head.appendChild(nameEl);
	  head.appendChild(maTag);
	  head.appendChild(delBtn);
	  head.appendChild(arrow);
	  item.appendChild(head);

	  function refreshHead() {
		nameEl.textContent = tenEl.textContent.trim() || t('newTen');
		var ma = maEl ? maEl.textContent.trim() : '';
		maTag.textContent = ma;
		maTag.style.display = ma ? '' : 'none';
	  }
	  refreshHead();

	  head.addEventListener('click', function () {
		openAsset(item.classList.contains('open') ? -1 : idx, false);
	  });
	  delBtn.addEventListener('click', function (e) {
		e.stopPropagation();
		var rowDel = tr.querySelector('.row-del-btn');
		if (rowDel) rowDel.click();   // dùng lại xử lý xóa sẵn có (hỏi xác nhận, giữ tối thiểu 1 dòng)
	  });

	  var body = document.createElement('div');
	  body.className = 'asset-card-body';
	  item.appendChild(body);

	  var picker = makeCatalogPicker(tr);
	  if (picker) body.appendChild(picker);

	  // 1 ô nhập có nhãn phía trên; gõ vào ô -> cập nhật ngay vào biên bản
	  function makeInput(el, placeholder) {
		var inp = document.createElement('input');
		inp.type = 'text';
		inp.placeholder = placeholder;
		inp.value = el ? el.textContent.trim() : '';
		inp.addEventListener('input', function () {
		  if (el) el.textContent = inp.value;
		  refreshHead();
		});
		return inp;
	  }
	  function field(labelText, inp, cls) {
		var wrap = document.createElement('label');
		wrap.className = 'fld' + (cls ? ' ' + cls : '');
		var lb = document.createElement('span');
		lb.className = 'fld-label';
		lb.textContent = labelText;
		wrap.appendChild(lb);
		wrap.appendChild(inp);
		return wrap;
	  }
	  function row(cols) {
		var r = document.createElement('div');
		r.className = 'fld-row';
		for (var i = 0; i < cols.length; i++) r.appendChild(cols[i]);
		body.appendChild(r);
		return r;
	  }
	  function sub(text) {
		var s = document.createElement('div');
		s.className = 'fld-sub';
		s.textContent = text;
		body.appendChild(s);
	  }

	  var tenInp = makeInput(tenEl, t('phTen'));
	  row([field(t('phTen'), tenInp)]);

	  // CPU / RAM / Ổ cứng — chỉ hiện khi dòng có các thông số này (máy tính)
	  var specInputs = [];
	  [['cpu', 'lblCpu'], ['ram', 'lblRam'], ['storage', 'lblStorage']].forEach(function (s) {
		var el = tr.querySelector('[data-role="' + s[0] + '"]');
		if (!el) return;
		var inp = makeInput(el, t(s[1]));
		el.addEventListener('input', function () { inp.value = el.textContent; });
		specInputs.push(field(t(s[1]), inp));
	  });
	  if (specInputs.length) row(specInputs).classList.add('fld-row-3');

	  var slInp = makeInput(slEl, t('phSl'));
	  var maInp = makeInput(maEl, t('phMa'));
	  var giaInp = makeInput(giaEl, t('phGia'));
	  row([field(t('phSl'), slInp, 'fld-narrow'), field(t('phMa'), maInp), field(t('phGia'), giaInp)]);

	  /* Tạo cặp [tick bật/tắt] + [ô nhập] cho 1 dòng phụ trong ô Tên tài sản.
	   * Tick vào -> thêm dòng "<nhãn>: ..." vào bảng. Bỏ tick -> xóa dòng đó. */
	  function makeSpecToggle(role, labelVi, labelEn, chkText, phText) {
		var el = tr.querySelector('[data-role="' + role + '"]');

		var chkLabel = document.createElement('label');
		chkLabel.className = 'checkbox-row';
		var chk = document.createElement('input');
		chk.type = 'checkbox';
		chk.checked = !!el;
		chkLabel.appendChild(chk);
		chkLabel.appendChild(document.createTextNode(chkText));
		body.appendChild(chkLabel);

		var inp = document.createElement('input');
		inp.type = 'text';
		inp.placeholder = phText;
		inp.value = el ? el.textContent.trim() : '';
		inp.disabled = !el;
		inp.className = 'toggle-input';
		inp.style.display = el ? '' : 'none';
		body.appendChild(inp);

		inp.addEventListener('input', function () {
		  if (el) el.textContent = inp.value;
		});

		chk.addEventListener('change', function () {
		  if (chk.checked) {
			if (!el) {
			  var ul = tr.querySelector('.row-specs-list');
			  if (!ul) {
				ul = document.createElement('ul');
				ul.className = 'plain row-specs-list';
				tenEl.parentNode.appendChild(ul);
			  }
			  var li = document.createElement('li');
			  li.innerHTML = '<span data-en="' + escHtml(labelEn) + '">' + escHtml(labelVi) + '</span>' +
				'<span class="editable-field" data-role="' + role + '" contenteditable="true"></span>';
			  ul.appendChild(li);
			  var lbl = li.querySelector('[data-en]');
			  if (lbl) {
				lbl.setAttribute('data-vi', lbl.textContent);
				if (currentLang === 'en') lbl.textContent = lbl.getAttribute('data-en');
			  }
			  el = li.querySelector('[data-role="' + role + '"]');
			  el.addEventListener('input', function () { inp.value = el.textContent; });
			}
			inp.disabled = false;
			inp.style.display = '';
			inp.focus();
		  } else {
			if (el) {
			  var oldLi = el.closest('li');
			  if (oldLi) oldLi.remove();
			  el = null;
			}
			inp.value = '';
			inp.disabled = true;
			inp.style.display = 'none';
		  }
		});

		if (el) el.addEventListener('input', function () { inp.value = el.textContent; });
	  }

	  makeSpecToggle('kemtheo', 'Kèm theo: ', 'Included: ', t('chkKemTheo'), t('phKemTheo'));
	  makeSpecToggle('khac', 'Khác: ', 'Other: ', t('chkKhac'), t('phKhac'));

	  sub('📝 ' + t('ghiChu'));
	  // Tình trạng: chọn 1 trong 2 — "Mới 100%" / "Đã sử dụng"
	  var COND_OPTS = [t('newTinhTrang'), t('condUsed')];
	  function condValue(text) {
		var n = normText(text);
		if (/su dung|used/.test(n)) return t('condUsed');
		if (/moi|new/.test(n)) return t('newTinhTrang');
		return text.trim();
	  }
	  var tinhTrangInp = document.createElement('select');
	  function fillCond(cur) {
		tinhTrangInp.innerHTML = '';
		var opts = COND_OPTS.slice();
		if (cur && opts.indexOf(cur) < 0) opts.push(cur);   // giữ lại nội dung cũ tự gõ (nếu có)
		opts.forEach(function (o) {
		  var op = document.createElement('option');
		  op.value = o;
		  op.textContent = o;
		  tinhTrangInp.appendChild(op);
		});
		tinhTrangInp.value = cur || COND_OPTS[0];
	  }
	  var condCur = tinhTrangEl ? condValue(tinhTrangEl.textContent) : COND_OPTS[0];
	  fillCond(condCur);
	  if (tinhTrangEl && tinhTrangEl.textContent.trim() !== condCur) tinhTrangEl.textContent = condCur;
	  tinhTrangInp.addEventListener('change', function () {
		if (tinhTrangEl) tinhTrangEl.textContent = tinhTrangInp.value;
	  });
	  // Ngày mua: ô chọn ngày có lịch. Biên bản vẫn ghi dd/mm/yyyy ("--/--/----" khi để trống)
	  function dmyToIso(txt) {
		var m = /(\d{1,2})\s*[\/.-]\s*(\d{1,2})\s*[\/.-]\s*(\d{4})/.exec(txt || '');
		return m ? m[3] + '-' + pad(parseInt(m[2], 10)) + '-' + pad(parseInt(m[1], 10)) : '';
	  }
	  var ngayMuaInp = document.createElement('input');
	  ngayMuaInp.type = 'date';
	  ngayMuaInp.value = ngayMuaEl ? dmyToIso(ngayMuaEl.textContent) : '';
	  ngayMuaInp.addEventListener('change', function () {
		if (!ngayMuaEl) return;
		var p = ngayMuaInp.value.split('-');
		ngayMuaEl.textContent = p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : '--/--/----';
	  });
	  ngayMuaInp.addEventListener('click', function () {
		if (typeof ngayMuaInp.showPicker === 'function') { try { ngayMuaInp.showPicker(); } catch (e) { /* bỏ qua */ } }
	  });
	  var baoHanhInp = makeInput(baoHanhEl, t('phBaoHanh'));
	  row([field(t('phTinhTrang'), tinhTrangInp)]);
	  row([field(t('phNgayMua'), ngayMuaInp), field(t('phBaoHanh'), baoHanhInp)]);

	  // Tick "Có thu hồi thiết bị cũ" — bật thì tạo mục trong Ghi Chú, tắt thì xóa mục đó
	  var thuHoiCheckLabel = document.createElement('label');
	  thuHoiCheckLabel.className = 'checkbox-row';
	  var thuHoiCheck = document.createElement('input');
	  thuHoiCheck.type = 'checkbox';
	  thuHoiCheck.checked = !!thuHoiEl;
	  thuHoiCheckLabel.appendChild(thuHoiCheck);
	  thuHoiCheckLabel.appendChild(document.createTextNode(t('chkThuHoi')));
	  body.appendChild(thuHoiCheckLabel);

	  var thuHoiInp = document.createElement('input');
	  thuHoiInp.type = 'text';
	  thuHoiInp.placeholder = t('phThuHoi');
	  thuHoiInp.value = thuHoiEl ? thuHoiEl.textContent.trim() : '';
	  thuHoiInp.disabled = !thuHoiEl;
	  thuHoiInp.className = 'toggle-input';
	  thuHoiInp.style.display = thuHoiEl ? '' : 'none';
	  body.appendChild(thuHoiInp);

	  thuHoiInp.addEventListener('input', function () {
		if (thuHoiEl) thuHoiEl.textContent = thuHoiInp.value;
	  });

	  thuHoiCheck.addEventListener('change', function () {
		if (thuHoiCheck.checked) {
		  if (!thuHoiEl && ghiChuUl) {
			var li = document.createElement('li');
			li.innerHTML = '<span data-en="Recall ">Thu hồi </span>' +
			  '<span class="editable-field" data-role="thuhoi" contenteditable="true"></span>';
			ghiChuUl.appendChild(li);
			var lbl = li.querySelector('[data-en]');
			if (lbl) {
			  lbl.setAttribute('data-vi', lbl.textContent);
			  if (currentLang === 'en') lbl.textContent = lbl.getAttribute('data-en');
			}
			thuHoiEl = li.querySelector('[data-role="thuhoi"]');
			thuHoiEl.addEventListener('input', function () { thuHoiInp.value = thuHoiEl.textContent; });
		  }
		  thuHoiInp.disabled = false;
		  thuHoiInp.style.display = '';
		  thuHoiInp.focus();
		} else {
		  if (thuHoiEl) {
			var oldLi = thuHoiEl.closest('li');
			if (oldLi) oldLi.remove();
			thuHoiEl = null;
		  }
		  thuHoiInp.value = '';
		  thuHoiInp.disabled = true;
		  thuHoiInp.style.display = 'none';
		}
	  });

	  list.appendChild(item);

	  // Đồng bộ ngược: gõ/dán trực tiếp trong bảng cũng khớp value vào ô panel tương ứng
	  if (tenEl) tenEl.addEventListener('input', function () { tenInp.value = tenEl.textContent; refreshHead(); });
	  if (slEl) slEl.addEventListener('input', function () { slInp.value = slEl.textContent; });
	  if (maEl) maEl.addEventListener('input', function () { maInp.value = maEl.textContent; refreshHead(); });
	  if (giaEl) giaEl.addEventListener('input', function () { giaInp.value = giaEl.textContent; });
	  if (tinhTrangEl) tinhTrangEl.addEventListener('input', function () { fillCond(condValue(tinhTrangEl.textContent)); });
	  if (ngayMuaEl) ngayMuaEl.addEventListener('input', function () { ngayMuaInp.value = dmyToIso(ngayMuaEl.textContent); });
	  if (baoHanhEl) baoHanhEl.addEventListener('input', function () { baoHanhInp.value = baoHanhEl.textContent; });
	  if (thuHoiEl) thuHoiEl.addEventListener('input', function () { thuHoiInp.value = thuHoiEl.textContent; });
	});
	highlightRow(openAssetIdx);
  }

  // Bấm / gõ vào 1 dòng thiết bị trong biên bản -> mở đúng thẻ của dòng đó ở sidebar
  function rowIndexOf(target) {
	var tr = target.closest ? target.closest('#hwBody tr') : null;
	if (!tr) return -1;
	return Array.prototype.indexOf.call(document.querySelectorAll('#hwBody tr'), tr);
  }
  ['click', 'focusin'].forEach(function (evt) {
	document.getElementById('hwBody').addEventListener(evt, function (e) {
	  if (e.target.closest && e.target.closest('.row-del-btn')) return;
	  var idx = rowIndexOf(e.target);
	  if (idx >= 0 && idx !== openAssetIdx) openAsset(idx, true);
	});
  });

  /* ============================================================
   *  CÁC TRƯỜNG CHUNG
   * ============================================================ */

  // 1 ô chọn ngày có lịch (thay cho 3 ô Ngày / Tháng / Năm) — dựng ngay tại chỗ của khung cũ
  function initDatePicker(defaultY, defaultM, defaultD) {
	var grid = document.querySelector('.date-picker-grid');
	var inp = document.createElement('input');
	inp.type = 'date';
	inp.id = 'inpNgay';
	inp.value = defaultY + '-' + defaultM + '-' + defaultD;
	grid.parentNode.replaceChild(inp, grid);
	inp.addEventListener('change', updateNgay);
	// Bấm vào bất kỳ đâu trên ô cũng mở lịch (không chỉ biểu tượng lịch)
	inp.addEventListener('click', function () {
	  if (typeof inp.showPicker === 'function') { try { inp.showPicker(); } catch (e) { /* bỏ qua */ } }
	});
  }

  function getNgayParts() {
	var v = (document.getElementById('inpNgay').value || '').split('-');
	return { y: v[0] || '', m: v[1] || '', d: v[2] || '' };
  }

  function updateNgay() {
	var parts = getNgayParts();
	if (!parts.d || !parts.m || !parts.y) return;
	document.getElementById('ngayCauVan').textContent = currentLang === 'en'
	  ? MONTHS_EN[parseInt(parts.m, 10) - 1] + ' ' + parts.d + ', ' + parts.y
	  : 'ngày ' + parts.d + ' tháng ' + parts.m + ' năm ' + parts.y;
  }

  function updateNguoiGiao() {
	var val = document.getElementById('inpNguoiGiao').value.trim();
	document.querySelectorAll('.nguoiGiao').forEach(function (el) {
	  el.textContent = val || 'ĐOÀN HỮU VINH';
	});
  }

  function updateNguoiNhan() {
	var val = document.getElementById('inpNguoiNhan').value.trim();
	document.querySelectorAll('.nguoiNhan').forEach(function (el) {
	  el.textContent = val || 'NGUYỄN VĂN A';
	});
  }

  function updateQuanLy() {
	var val = document.getElementById('inpQuanLy').value.trim();
	document.querySelectorAll('.quanLy').forEach(function (el) {
	  el.textContent = val || 'ĐOÀN HỮU VINH';
	});
  }

  function updateBoPhan() {
	var val = document.getElementById('inpBoPhan').value.trim();
	document.querySelectorAll('.boPhan').forEach(function (el) {
	  el.textContent = val || 'IT';
	});
  }

  function updatePhongBan() {
	var val = document.getElementById('inpPhongBan').value.trim();
	document.querySelectorAll('.phongBan').forEach(function (el) {
	  el.textContent = val || 'B2C SALES';
	});
  }

  (function () {
	var today = new Date();
	initDatePicker(String(today.getFullYear()), pad(today.getMonth() + 1), pad(today.getDate()));
  })();
  document.getElementById('inpNguoiGiao').addEventListener('input', updateNguoiGiao);
  document.getElementById('inpNguoiGiao').addEventListener('change', updateNguoiGiao);
  document.getElementById('inpNguoiNhan').addEventListener('input', updateNguoiNhan);
  document.getElementById('inpQuanLy').addEventListener('input', updateQuanLy);
  document.getElementById('inpBoPhan').addEventListener('input', updateBoPhan);
  document.getElementById('inpPhongBan').addEventListener('input', updatePhongBan);

  // Phòng ban (Bên B): danh sách chọn sẵn + mục "Khác" để tự nhập
  var DEPARTMENTS = [
	'Warehouse', 'MAP CS', 'D-Center', 'D-LAB', 'Engineering',
	'Factory', 'Factory Office', 'Finance', 'HR & Admin', 'HSE', 'IT', 'Marketing', 'Motul Tech',
	'PI&HSE', 'Production', 'Project', 'QA', 'Quality', 'Regional', 'Sales AO', 'Sales B2B',
	'Sales B2C', 'Sales CI', 'Supply Chain', 'Supply Chain & Operations',
	'Supply Planning', 'Sustainability'
  ];
  var DEPT_OTHER = '__other__';
  (function () {
	var inp = document.getElementById('inpPhongBan');
	var sel = document.createElement('select');
	sel.id = 'selPhongBan';
	DEPARTMENTS.forEach(function (name) {
	  var opt = document.createElement('option');
	  opt.value = name;
	  opt.textContent = name;
	  sel.appendChild(opt);
	});
	var optOther = document.createElement('option');
	optOther.value = DEPT_OTHER;
	optOther.textContent = '✏️ Khác / Other (tự nhập)…';
	sel.appendChild(optOther);
	inp.parentNode.insertBefore(sel, inp);
	inp.placeholder = 'Nhập tên phòng ban…';

	function syncDept() {
	  var isOther = sel.value === DEPT_OTHER;
	  inp.style.display = isOther ? '' : 'none';
	  if (isOther) {
		inp.value = '';
		inp.focus();
	  } else {
		inp.value = sel.value;
	  }
	  updatePhongBan();
	}
	sel.addEventListener('change', syncDept);
	sel.value = 'Sales B2C';
	syncDept();
  })();

  // Bật/tắt cột "Quản lý trực tiếp" trong bảng chữ ký — xóa nếu không cần
  var chkQuanLy = document.getElementById('chkQuanLy');
  var inpQuanLyEl = document.getElementById('inpQuanLy');
  var sigTable = document.getElementById('sigTable');
  chkQuanLy.addEventListener('change', function () {
	sigTable.classList.toggle('hide-quanly', !chkQuanLy.checked);
	inpQuanLyEl.disabled = !chkQuanLy.checked;
  });

  // Dán (paste) vào ô sửa nhanh trong bảng chỉ lấy văn bản thuần, không dính định dạng
  document.addEventListener('paste', function (e) {
	var t2 = e.target;
	if (t2 && t2.classList && t2.classList.contains('editable-field') && t2.isContentEditable) {
	  e.preventDefault();
	  var text = (e.clipboardData || window.clipboardData).getData('text/plain');
	  document.execCommand('insertText', false, text);
	}
  });

  /* ============================================================
   *  ĐẶT TÊN FILE & XUẤT FILE
   * ============================================================ */
  // Bỏ dấu tiếng Việt (giữ khoảng trắng giữa các từ)
  function stripAccents(str) {
	str = (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
	str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
	return str;
  }

  // Bỏ dấu, viết liền không khoảng trắng, chỉ giữ chữ/số — dùng cho mã tài sản, ngày...
  function removeDiacritics(str) {
	return stripAccents(str).replace(/[^a-zA-Z0-9]+/g, '');
  }

  // Rút gọn tên người: chữ cái đầu của các từ (trừ từ cuối) + từ cuối viết đầy đủ
  // Nguyen van A -> NVA | Nguyen ba linh -> NBLINH
  function abbreviateName(fullName) {
	var clean = stripAccents(fullName).replace(/[^a-zA-Z\s]+/g, '').trim();
	var words = clean.split(/\s+/).filter(Boolean);
	if (words.length === 0) return '';
	if (words.length === 1) return words[0].toUpperCase();
	var lastWord = words[words.length - 1];
	var initials = words.slice(0, -1).map(function (w) { return w.charAt(0); }).join('');
	return (initials + lastWord).toUpperCase();
  }

  // Ghép tên file: {Mã tài sản dòng 1}_{Tên người nhận rút gọn}_{ddmmyyyy}
  // Ví dụ: DMLB6F4_NVA_05082026
  function buildFileBaseName() {
	var firstRow = document.querySelector('#hwBody tr');
	var maEl = firstRow ? firstRow.querySelector('[data-role="ma"]') : null;
	var ma = removeDiacritics(maEl ? maEl.textContent.trim() : '') || 'ThietBi';

	var nguoiNhanVal = document.getElementById('inpNguoiNhan').value;
	var nguoiNhan = abbreviateName(nguoiNhanVal) || 'NGUOINHAN';

	var ngay = getNgayParts();
	var ngayStr = (ngay.d && ngay.m && ngay.y) ? (ngay.d + ngay.m + ngay.y) : '';

	return [ma, nguoiNhan, ngayStr].filter(Boolean).join('_');
  }

  // Đánh dấu phần trang 1 (mọi thứ trước mục II) = .pg1 để khi in / xuất Word được nén gọn hơn trang 2
  var pageBreak = document.querySelector('.WordSection1 .page-break');
  if (pageBreak) {
	for (var pg1El = pageBreak.previousElementSibling; pg1El; pg1El = pg1El.previousElementSibling) {
	  pg1El.classList.add('pg1');
	}
  }

  /* ---- Tự canh trang: trang 1 và trang 2 đều vừa kín A4, không chừa khoảng trống cuối trang ----
   * Bật html.fit-on (bố cục giống bản in, rộng 178mm), rồi dò nhị phân giá trị giãn dòng
   * --lh1 (trang 1) / --lh2 (trang 2) lớn nhất mà nội dung vẫn lọt trong chiều cao vùng in A4. */
  var PAGE_H_PX = (297 - 20) * 96 / 25.4;   // A4 cao 297mm - lề trên/dưới 2x10mm (khớp @page trong CSS)
  var FIT_MIN = 1.1, FIT_MAX = 2.0;
  var fitResult = { t1: 1.25, t2: 1.4 };

  function measurePages() {
	var ws = document.querySelector('.WordSection1');
	var pb = ws.querySelector('.page-break');
	var wsRect = ws.getBoundingClientRect();
	var pbRect = pb.getBoundingClientRect();
	return { p1: pbRect.top - wsRect.top, p2: wsRect.bottom - pbRect.bottom };
  }

  function fitOne(varName, key, limit) {
	var root = document.documentElement;
	function fits(t) {
	  root.style.setProperty(varName, t.toFixed(3));
	  return measurePages()[key] <= limit;
	}
	if (fits(FIT_MAX)) return FIT_MAX;
	if (!fits(FIT_MIN)) return FIT_MIN;   // nội dung quá dài (vd. nhiều thiết bị) -> giữ gọn nhất
	var lo = FIT_MIN, hi = FIT_MAX;
	for (var i = 0; i < 14; i++) {
	  var mid = (lo + hi) / 2;
	  if (fits(mid)) lo = mid; else hi = mid;
	}
	root.style.setProperty(varName, lo.toFixed(3));
	return lo;
  }

  function fitPages() {
	if (!document.querySelector('.WordSection1 .page-break')) return fitResult;
	document.documentElement.classList.add('fit-on');
	var limit = PAGE_H_PX * 0.985;            // chừa ~4mm phòng sai số khi trình duyệt dàn trang in
	fitResult = { t1: fitOne('--lh1', 'p1', limit), t2: fitOne('--lh2', 'p2', limit) };
	return fitResult;
  }
  function unfitPages() { document.documentElement.classList.remove('fit-on'); }

  // Ctrl+P hoặc nút "In / Xuất PDF" đều kích hoạt beforeprint
  window.addEventListener('beforeprint', fitPages);
  window.addEventListener('afterprint', unfitPages);

  // Thanh cố định trên cùng màn hình: chọn ngôn ngữ + 3 nút xuất (.docx / .doc / PDF) chung 1 hàng.
  // Sidebar bên trái chỉ còn phần nhập liệu.
  var exportRow = document.querySelector('.export-word-row');
  exportRow.appendChild(document.getElementById('exportPdfBtn'));
  var topBar = document.createElement('div');
  topBar.id = 'docTopBar';
  topBar.appendChild(document.querySelector('.lang-switch'));
  topBar.appendChild(exportRow);
  document.body.insertBefore(topBar, document.body.firstChild);
  document.body.classList.add('has-topbar');
  // tao-mat-khau.html có thanh đỏ #devBar dính trên cùng -> đặt thanh này ngay bên dưới nó
  var devBar = document.getElementById('devBar');
  if (devBar) {
	var devH = devBar.offsetHeight;
	topBar.style.top = devH + 'px';
	var sideBar = document.getElementById('editToolbar');
	sideBar.style.top = (76 + devH) + 'px';
	// Trừ luôn chiều cao thanh đỏ, nếu không đáy sidebar bị đẩy ra ngoài màn hình (không cuộn tới được)
	sideBar.style.maxHeight = 'calc(100vh - ' + (96 + devH) + 'px)';
  }
  var oldRow = document.querySelector('#editToolbar .toolbar-row');
  if (oldRow && !oldRow.children.length) oldRow.remove();

  // Print / PDF export — đặt tạm tiêu đề trang để trình duyệt gợi ý đúng tên file khi "Save as PDF"
  document.getElementById('exportPdfBtn').addEventListener('click', function () {
	var originalTitle = document.title;
	document.title = buildFileBaseName();
	window.print();
	setTimeout(function () { document.title = originalTitle; }, 1000);
  });

  // Chuyển 1 thẻ <img> sang base64 (data URI) để file xuất tự chứa ảnh, không phụ thuộc đường dẫn ngoài.
  // Vẽ qua <canvas> từ ảnh gốc đã tải trên trang (tránh lỗi fetch/CORS khi mở file bằng file://).
  function imgToDataUrl(imgEl) {
	return new Promise(function (resolve) {
	  try {
		var srcImg = document.querySelector('.WordSection1 img[src="' + imgEl.getAttribute('src') + '"]');
		if (!srcImg) srcImg = imgEl;
		var draw = function (readyImg) {
		  var canvas = document.createElement('canvas');
		  canvas.width = readyImg.naturalWidth || readyImg.width;
		  canvas.height = readyImg.naturalHeight || readyImg.height;
		  var ctx = canvas.getContext('2d');
		  ctx.drawImage(readyImg, 0, 0);
		  var dataUrl = canvas.toDataURL('image/png');
		  imgEl.setAttribute('src', dataUrl);
		  resolve();
		};
		if (srcImg.complete && srcImg.naturalWidth > 0) {
		  draw(srcImg);
		} else {
		  srcImg.addEventListener('load', function () { draw(srcImg); });
		  srcImg.addEventListener('error', function () { resolve(); });
		}
	  } catch (err) {
		resolve(); // nếu lỗi (vd. canvas bị "tainted") thì giữ nguyên src cũ
	  }
	});
  }

  // Gộp thêm style nội tuyến cho 1 thẻ (giữ nguyên style sẵn có)
  function addStyle(el, css) {
	var cur = el.getAttribute('style') || '';
	if (cur && cur.charAt(cur.length - 1) !== ';') cur += ';';
	el.setAttribute('style', cur + css);
  }

  var TNR = "font-family:'Times New Roman',serif;mso-ascii-font-family:'Times New Roman';" +
	"mso-hansi-font-family:'Times New Roman';mso-bidi-font-family:'Times New Roman';";

  /* Word (.doc/.docx) KHÔNG đọc CSS trong thẻ <style> và KHÔNG hiểu pseudo-element (:before).
   * Vì vậy phải ép mọi định dạng thành style nội tuyến và đổi bullet giả thành ký tự thật. */
  function prepareForWord(root) {
	// 1) Danh sách -> đoạn <p> thụt lề treo + ký tự bullet thật.
	//    Word bỏ qua list-style:none nên nếu giữ <ul>/<li> sẽ bị thêm bullet thứ hai.
	//    Lề lấy theo CSS bản in (PDF): ngoài bảng 36px, mục con thêm 24px, trong bảng 14px.
	root.querySelectorAll('ul.plain').forEach(function (ul) {
	  var inTable = !!ul.closest('table');
	  var isSub = ul.classList.contains('sub');
	  var isPg1 = ul.classList.contains('pg1');
	  var lh = isPg1 ? wordLh.t1 : wordLh.t2;
	  var left = inTable ? 10 : (isSub ? 45 : 27);   // pt
	  var hang = inTable ? 8 : (isSub ? 13 : 11);    // pt — khoảng lùi cho ký tự bullet
	  var frag = document.createDocumentFragment();
	  Array.prototype.slice.call(ul.children).forEach(function (li) {
		var p = document.createElement('p');
		p.setAttribute('style', 'margin:0 0 ' + (inTable ? '0pt' : fitSp(lh, 10)) + ' ' + left + 'pt;' +
		  'text-indent:-' + hang + 'pt;text-align:' + (inTable ? 'left' : 'justify') + ';' +
		  (inTable ? 'line-height:1.15;font-size:10.5pt;' : 'line-height:' + lh.toFixed(2) + ';'));
		var bullet = document.createElement('span');
		bullet.textContent = isSub ? 'o' : '-';
		if (isSub) bullet.setAttribute('style', "font-family:'Courier New';");
		p.appendChild(bullet);
		p.appendChild(document.createTextNode('\u00a0\u00a0'));
		while (li.firstChild) p.appendChild(li.firstChild);
		frag.appendChild(p);
	  });
	  ul.parentNode.replaceChild(frag, ul);
	});

	// 2) Định dạng theo lớp -> style nội tuyến
	root.querySelectorAll('.title').forEach(function (el) {
	  addStyle(el, 'font-size:20pt;font-weight:bold;text-align:center;margin:0;line-height:1.5;');
	});
	root.querySelectorAll('.section-title').forEach(function (el) {
	  var lh = el.classList.contains('pg1') ? wordLh.t1 : wordLh.t2;
	  addStyle(el, 'font-weight:bold;font-size:12pt;margin:' + fitSp(lh, 20) + ' 0 ' + fitSp(lh, 10) +
		';line-height:' + lh.toFixed(2) + ';');
	});
	root.querySelectorAll('.center').forEach(function (el) { addStyle(el, 'text-align:center;'); });
	root.querySelectorAll('.justify').forEach(function (el) { addStyle(el, 'text-align:justify;'); });
	root.querySelectorAll('.bold').forEach(function (el) { addStyle(el, 'font-weight:bold;'); });

	// 3) Bảng
	root.querySelectorAll('table').forEach(function (tb) {
	  addStyle(tb, 'border-collapse:collapse;width:100%;');
	});
	root.querySelectorAll('table.doc-table td').forEach(function (td) {
	  addStyle(td, 'border:1px solid #000000;padding:2px 5px;font-size:10.5pt;' +
		'vertical-align:middle;text-align:left;line-height:1.15;');
	});
	root.querySelectorAll('table.doc-table [data-role="ten"]').forEach(function (el) {
	  addStyle(el, 'display:block;margin:0;padding:0;');
	});
	root.querySelectorAll('table.plain-table td').forEach(function (td) {
	  addStyle(td, 'padding:2px 6px;vertical-align:middle;');
	});
	root.querySelectorAll('table.plain-table.center td').forEach(function (td) {
	  addStyle(td, 'text-align:center;');
	});

	// Bảng thông tin Bên A / Bên B: nhãn ("BÊN B - NGƯỜI NHẬN:") giữ trên 1 dòng như bản PDF.
	// Font Times trong Word rộng hơn trình duyệt nên nới cột nhãn và cấm xuống dòng.
	root.querySelectorAll('table.plain-table:not(.center) tr').forEach(function (tr) {
	  var cells = tr.children;
	  if (cells.length === 3) {
		cells[0].setAttribute('width', '32%');
		cells[1].setAttribute('width', '32%');
		cells[2].setAttribute('width', '36%');
	  }
	  var label = cells[0];
	  if (!label) return;
	  label.setAttribute('nowrap', 'nowrap');
	  addStyle(label, 'white-space:nowrap;');
	  var walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
	  while (walker.nextNode()) {
		walker.currentNode.textContent = walker.currentNode.textContent.replace(/ /g, '\u00a0');
	  }
	});

	// 3b) Chữ nằm thẳng trong ô bảng (không có <p> bao ngoài) bị Word lấy font mặc định của bảng
	//     thay vì Times New Roman -> gom các đoạn chữ/thẻ inline liên tiếp vào <p> riêng.
	var BLOCK_TAGS = { P: 1, DIV: 1, UL: 1, OL: 1, TABLE: 1 };
	root.querySelectorAll('td').forEach(function (td) {
	  var tr = td.parentNode;
	  var align = (td.classList.contains('center') || tr.classList.contains('center') ||
		td.closest('table').classList.contains('center')) ? 'center' : 'left';
	  var pStyle = 'margin:0;line-height:1.15;text-align:' + align + ';' +
		'font-size:' + (td.closest('table.doc-table') ? '10.5pt' : '12pt') + ';' +
		((td.classList.contains('bold') || tr.classList.contains('bold')) ? 'font-weight:bold;' : '');
	  var run = null;
	  Array.prototype.slice.call(td.childNodes).forEach(function (node) {
		if (node.nodeType === 1 && BLOCK_TAGS[node.tagName]) { run = null; return; }
		if (node.nodeType === 3 && !node.textContent.trim()) {
		  if (run) run.appendChild(node); else td.removeChild(node);
		  return;
		}
		if (!run) {
		  run = document.createElement('p');
		  run.setAttribute('style', pStyle);
		  td.insertBefore(run, node);
		}
		run.appendChild(node);
	  });
	});

	// Đoạn văn ngoài bảng: giãn dòng + cách đoạn theo giá trị tự canh trang (Word không kế thừa từ thẻ cha)
	root.querySelectorAll('p').forEach(function (p) {
	  if (p.closest('table')) return;
	  var lh = p.classList.contains('pg1') ? wordLh.t1 : wordLh.t2;
	  var st = p.getAttribute('style') || '';
	  if (!/line-height/.test(st)) addStyle(p, 'line-height:' + lh.toFixed(2) + ';');
	  if (!/margin/.test(st)) addStyle(p, 'margin:0 0 ' + fitSp(lh, 10) + ';');
	});

	// 4) Ép font Times New Roman cho toàn bộ thẻ

	addStyle(root, TNR + 'font-size:12pt;line-height:1.4;text-align:justify;');
	root.querySelectorAll('*').forEach(function (el) {
	  if (el.tagName === 'IMG' || el.tagName === 'BR') return;
	  var cur = el.getAttribute('style') || '';
	  el.setAttribute('style', TNR + (cur && cur.charAt(cur.length - 1) !== ';' ? cur + ';' : cur));
	});

	// 5) Word KHÔNG hiểu line-height dạng số không đơn vị (vd. 1.4) -> coi như giãn dòng đơn.
	//    Đổi sang pt theo cỡ chữ của thẻ (vd. 12pt x 1.4 = 16.8pt), kiểu "at least" để không cắt dấu tiếng Việt.
	function fontSizePt(el) {
	  for (var n = el; n && n.getAttribute; n = n.parentNode) {
		var m = /font-size:\s*([\d.]+)pt/.exec(n.getAttribute('style') || '');
		if (m) return parseFloat(m[1]);
	  }
	  return 12;
	}
	[root].concat(Array.prototype.slice.call(root.querySelectorAll('*'))).forEach(function (el) {
	  var st = el.getAttribute('style') || '';
	  if (!/line-height:\s*[\d.]+\s*(;|$)/.test(st)) return;
	  var fs = fontSizePt(el);
	  el.setAttribute('style', st.replace(/line-height:\s*([\d.]+)\s*(;|$)/g, function (_, n) {
		return 'line-height:' + (parseFloat(n) * fs).toFixed(1) + 'pt;mso-line-height-rule:at-least;';
	  }));
	});
  }

  // Dựng nội dung HTML dùng chung cho cả xuất .docx và .doc (bất đồng bộ vì cần nhúng ảnh base64)
  // Khoảng cách theo giãn dòng t — cùng công thức với CSS (html.fit-on): (t - 1) x hệ số pt
  function fitSp(t, k) { return ((t - 1) * k).toFixed(1) + 'pt'; }
  var wordLh = { t1: 1.25, t2: 1.4 };
  // Word dàn trang khác trình duyệt (đo bằng Word thật): trang 2 thưa hơn, trang 1 (có bảng) dày hơn
  // -> hiệu chỉnh riêng cho bản .doc/.docx
  var WORD_ADJ = { t1: -0.20, t2: -0.03 };   // đã đo bằng Word thật: trang 2 kín ~98%, 1-3 thiết bị vừa trang 1
  var WORD_MIN = 1.0;
  var WORD_SIG_H = 45;   // chiều cao khoảng ký tên (px) trong file Word
  var WORD_DOC_T2 = 0.07; // .doc (HTML) Word dàn gọn hơn .docx ~6% -> giãn thêm trang 2 cho kín

  function buildExportHtml(isDoc) {
	var fit = fitPages();
	unfitPages();
	wordLh = { t1: Math.max(WORD_MIN, fit.t1 + WORD_ADJ.t1), t2: Math.max(WORD_MIN, fit.t2 + WORD_ADJ.t2 + (isDoc ? WORD_DOC_T2 : 0)) };
	var clone = document.querySelector('.WordSection1').cloneNode(true);

	// Giá trị tài sản: nếu bỏ trống hoặc bằng 0 thì hiển thị dấu "-" thay vì "0 VNĐ"
	clone.querySelectorAll('[data-role="gia"]').forEach(function (el) {
	  var txt = el.textContent.replace(/ /g, ' ').trim();
	  var digits = txt.replace(/[^0-9]/g, '');
	  if (txt === '' || digits === '' || parseInt(digits, 10) === 0) {
		el.textContent = '-';
	  }
	});

	clone.querySelectorAll('.editable-field').forEach(function (el) {
	  el.removeAttribute('contenteditable');
	  el.removeAttribute('class');
	});
	clone.querySelectorAll('.edit-hint, .row-del-btn, .row-thuhoi-btn').forEach(function (el) { el.remove(); });
	clone.querySelectorAll('td[style*="height:80px"]').forEach(function (el) {
	  el.style.height = WORD_SIG_H + 'px';
	});
	// Nếu đã bỏ chọn "Có Quản lý trực tiếp" thì loại hẳn cột đó khỏi file xuất
	if (document.getElementById('sigTable').classList.contains('hide-quanly')) {
	  clone.querySelectorAll('.col-quanly').forEach(function (el) { el.remove(); });
	}

	// Dấu ngắt trang trước mục II -> ngắt trang thật của Word
	clone.querySelectorAll('.page-break').forEach(function (el) {
	  var br = document.createElement('br');
	  br.setAttribute('clear', 'all');
	  br.setAttribute('style', 'mso-special-character:line-break;page-break-before:always;');
	  el.parentNode.replaceChild(br, el);
	});

	// Ép định dạng trực tiếp vào từng thẻ (Word/docx không đọc CSS trong <style> và không hiểu :before)
	prepareForWord(clone);

	var imgTasks = Array.prototype.map.call(clone.querySelectorAll('img'), imgToDataUrl);

	return Promise.all(imgTasks).then(function () {
	  var content = clone.outerHTML;
	  return '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
		'xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
		'<head><meta charset="utf-8"><title>' + t('docTitle') + '</title>' +
		'<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View>' +
		'<w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->' +
		'<style>@page WordSection1{size:21cm 29.7cm;margin:1cm 1.6cm;mso-header-margin:0.5cm;mso-footer-margin:0.5cm;} ' +
		'div.WordSection1{page:WordSection1;} ' +   // .doc: Word chỉ áp lề trang khi gắn với trang có tên
		'*{font-family:"Times New Roman",serif;mso-ascii-font-family:"Times New Roman";' +
		'mso-hansi-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";' +
		'mso-fareast-font-family:"Times New Roman";} ' +
		'body{font-family:"Times New Roman",serif;font-size:12pt;line-height:16.8pt;text-align:justify;} ' +
		'p{margin:0 0 4pt;line-height:16.8pt;} table{border-collapse:collapse;width:100%;} ' +
		'ul{list-style:none;margin:0;padding:0;} ' +
		'tr{page-break-inside:avoid;}</style></head><body>' + content + '</body></html>';
	});
  }

  function downloadBlob(blob, filename) {
	var link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
  }

  // Xuất .docx (chuẩn OOXML thật, cần mạng để tải thư viện)
  document.getElementById('exportDocxBtn').addEventListener('click', function () {
	if (typeof htmlDocx === 'undefined') {
	  alert(t('alertNoLib'));
	  return;
	}
	buildExportHtml().then(function (html) {
	  // html-docx-js KHÔNG đọc @page trong CSS (mặc định lề 2.54cm mỗi phía) -> phải truyền lề trực tiếp.
	  // Đơn vị twip: 1mm = 56.7 twip. Khớp với bản PDF: trên/dưới 10mm, trái/phải 16mm.
	  var blob = htmlDocx.asBlob(html, {
		orientation: 'portrait',
		margins: { top: 567, bottom: 567, left: 907, right: 907, header: 283, footer: 283, gutter: 0 }
	  });
	  downloadBlob(blob, buildFileBaseName() + '.docx');
	});
  });

  // Xuất .doc kiểu cũ (HTML nhúng, không cần mạng, Word vẫn mở được)
  document.getElementById('exportDocBtn').addEventListener('click', function () {
	buildExportHtml(true).then(function (html) {
	  var blob = new Blob(['﻿', html], { type: 'application/msword' });
	  downloadBlob(blob, buildFileBaseName() + '.doc');
	});
  });

  // Khởi tạo
  applyLanguage();
};
