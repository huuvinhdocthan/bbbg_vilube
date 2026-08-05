window.initBBBG = function () {
  /* ============================================================
   *  ĐA NGÔN NGỮ (VI / EN)
   * ============================================================ */
  var currentLang = 'vi';

  // Từ điển cho các chuỗi sinh động bằng JS (panel, nút thêm/xóa, thông báo...)
  var DICT = {
	assetItem:      { vi: 'Tài sản #',              en: 'Asset #' },
	phTen:          { vi: 'Tên tài sản',            en: 'Asset name' },
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
	newTinhTrang:   { vi: 'Mới',                    en: 'New' },
	docTitle:       { vi: 'Biên bản bàn giao tài sản', en: 'Asset Handover Minutes' }
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

  document.getElementById('langViBtn').addEventListener('click', function () { setLang('vi'); });
  document.getElementById('langEnBtn').addEventListener('click', function () { setLang('en'); });

  /* ============================================================
   *  PANEL CHỈNH SỬA NHANH
   * ============================================================ */
  var toggleBtn = document.getElementById('toggleEditBtn');
  var panel = document.getElementById('editPanel');
  toggleBtn.addEventListener('click', function () {
	panel.classList.toggle('open');
  });

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
  document.getElementById('addHwRowBtn').addEventListener('click', function () {
	var tbody = document.getElementById('hwBody');
	var stt = pad(tbody.querySelectorAll('tr').length + 1);
	var tr = document.createElement('tr');
	tr.innerHTML =
	  '<td class="center"><span class="row-stt">' + stt + '</span>' +
	  '<button class="row-del-btn" type="button" title="' + t('titleDel') + '">✕</button></td>' +
	  '<td><span class="editable-field" data-role="ten" contenteditable="true">' + t('newTen') + '</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="sl" contenteditable="true">01</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="ma" contenteditable="true">' + t('newMa') + '</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="gia" contenteditable="true">0 VNĐ</span></td>' +
	  '<td><ul class="plain row-ghichu-list">' +
	  '<li><span data-en="Condition: ">Tình trạng: </span><span class="editable-field" data-role="tinhtrang" contenteditable="true">' + t('newTinhTrang') + '</span></li>' +
	  '<li><span data-en="Purchase date: ">Ngày mua: </span><span class="editable-field" data-role="ngaymua" contenteditable="true">--/--/----</span></li>' +
	  '<li><span data-en="Warranty ">Bảo hành </span><span class="editable-field" data-role="baohanh" contenteditable="true">--</span></li>' +
	  '</ul>' +
	  '<button class="row-thuhoi-btn" type="button">' + t('btnThuHoi') + '</button></td>';
	tbody.appendChild(tr);
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

  // Dựng panel chỉnh sửa nhanh cho TẤT CẢ dòng tài sản hiện có (kể cả dòng vừa thêm)
  function renderAssetPanel() {
	var tbody = document.getElementById('hwBody');
	var list = document.getElementById('assetPanelList');
	if (!tbody || !list) return;
	list.innerHTML = '';
	Array.prototype.forEach.call(tbody.querySelectorAll('tr'), function (tr, idx) {
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
	  item.className = 'asset-panel-item';

	  var title = document.createElement('div');
	  title.className = 'asset-panel-title';
	  title.textContent = t('assetItem') + pad(idx + 1);
	  item.appendChild(title);

	  function makeInput(el, placeholder) {
		var inp = document.createElement('input');
		inp.type = 'text';
		inp.placeholder = placeholder;
		inp.value = el ? el.textContent.trim() : '';
		inp.addEventListener('input', function () {
		  if (el) el.textContent = inp.value;
		});
		return inp;
	  }

	  var tenInp = makeInput(tenEl, t('phTen'));
	  item.appendChild(tenInp);

	  var grid = document.createElement('div');
	  grid.className = 'asset-panel-grid';
	  var slInp = makeInput(slEl, t('phSl'));
	  var maInp = makeInput(maEl, t('phMa'));
	  grid.appendChild(slInp);
	  grid.appendChild(maInp);
	  item.appendChild(grid);

	  var giaInp = makeInput(giaEl, t('phGia'));
	  item.appendChild(giaInp);

	  var ghiChuTitle = document.createElement('div');
	  ghiChuTitle.className = 'asset-panel-title';
	  ghiChuTitle.style.marginTop = '2px';
	  ghiChuTitle.textContent = t('ghiChu');
	  item.appendChild(ghiChuTitle);

	  var tinhTrangInp = makeInput(tinhTrangEl, t('phTinhTrang'));
	  item.appendChild(tinhTrangInp);

	  var grid2 = document.createElement('div');
	  grid2.className = 'asset-panel-grid';
	  var ngayMuaInp = makeInput(ngayMuaEl, t('phNgayMua'));
	  var baoHanhInp = makeInput(baoHanhEl, t('phBaoHanh'));
	  grid2.appendChild(ngayMuaInp);
	  grid2.appendChild(baoHanhInp);
	  item.appendChild(grid2);

	  // Tick "Có thu hồi thiết bị cũ" — bật thì tạo mục trong Ghi Chú, tắt thì xóa mục đó
	  var thuHoiCheckLabel = document.createElement('label');
	  thuHoiCheckLabel.className = 'checkbox-row';
	  var thuHoiCheck = document.createElement('input');
	  thuHoiCheck.type = 'checkbox';
	  thuHoiCheck.checked = !!thuHoiEl;
	  thuHoiCheckLabel.appendChild(thuHoiCheck);
	  thuHoiCheckLabel.appendChild(document.createTextNode(t('chkThuHoi')));
	  item.appendChild(thuHoiCheckLabel);

	  var thuHoiInp = document.createElement('input');
	  thuHoiInp.type = 'text';
	  thuHoiInp.placeholder = t('phThuHoi');
	  thuHoiInp.value = thuHoiEl ? thuHoiEl.textContent.trim() : '';
	  thuHoiInp.disabled = !thuHoiEl;
	  item.appendChild(thuHoiInp);

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
		  thuHoiInp.focus();
		} else {
		  if (thuHoiEl) {
			var oldLi = thuHoiEl.closest('li');
			if (oldLi) oldLi.remove();
			thuHoiEl = null;
		  }
		  thuHoiInp.value = '';
		  thuHoiInp.disabled = true;
		}
	  });

	  list.appendChild(item);

	  // Đồng bộ ngược: gõ/dán trực tiếp trong bảng cũng khớp value vào ô panel tương ứng
	  if (tenEl) tenEl.addEventListener('input', function () { tenInp.value = tenEl.textContent; });
	  if (slEl) slEl.addEventListener('input', function () { slInp.value = slEl.textContent; });
	  if (maEl) maEl.addEventListener('input', function () { maInp.value = maEl.textContent; });
	  if (giaEl) giaEl.addEventListener('input', function () { giaInp.value = giaEl.textContent; });
	  if (tinhTrangEl) tinhTrangEl.addEventListener('input', function () { tinhTrangInp.value = tinhTrangEl.textContent; });
	  if (ngayMuaEl) ngayMuaEl.addEventListener('input', function () { ngayMuaInp.value = ngayMuaEl.textContent; });
	  if (baoHanhEl) baoHanhEl.addEventListener('input', function () { baoHanhInp.value = baoHanhEl.textContent; });
	  if (thuHoiEl) thuHoiEl.addEventListener('input', function () { thuHoiInp.value = thuHoiEl.textContent; });
	});
  }

  /* ============================================================
   *  CÁC TRƯỜNG CHUNG
   * ============================================================ */

  // Dựng 3 ô chọn Ngày / Tháng / Năm, mặc định theo giá trị ban đầu
  function initDatePicker(defaultY, defaultM, defaultD) {
	var selDay = document.getElementById('selNgayDay');
	var selMonth = document.getElementById('selNgayMonth');
	var selYear = document.getElementById('selNgayYear');

	for (var d = 1; d <= 31; d++) {
	  var optD = document.createElement('option');
	  optD.value = pad(d);
	  optD.textContent = pad(d);
	  selDay.appendChild(optD);
	}
	for (var m = 1; m <= 12; m++) {
	  var optM = document.createElement('option');
	  optM.value = pad(m);
	  optM.textContent = pad(m);
	  selMonth.appendChild(optM);
	}
	var thisYear = new Date().getFullYear();
	var startYear = Math.min(thisYear, parseInt(defaultY, 10)) - 5;
	var endYear = Math.max(thisYear, parseInt(defaultY, 10)) + 5;
	for (var y = startYear; y <= endYear; y++) {
	  var optY = document.createElement('option');
	  optY.value = String(y);
	  optY.textContent = String(y);
	  selYear.appendChild(optY);
	}

	selDay.value = defaultD;
	selMonth.value = defaultM;
	selYear.value = defaultY;

	selDay.addEventListener('change', updateNgay);
	selMonth.addEventListener('change', updateNgay);
	selYear.addEventListener('change', updateNgay);
  }

  function getNgayParts() {
	return {
	  d: document.getElementById('selNgayDay').value,
	  m: document.getElementById('selNgayMonth').value,
	  y: document.getElementById('selNgayYear').value
	};
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
	  el.textContent = val || 'HỒ HỮU THƯƠNG';
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

  // Dựng nội dung HTML dùng chung cho cả xuất .docx và .doc (bất đồng bộ vì cần nhúng ảnh base64)
  function buildExportHtml() {
	var clone = document.querySelector('.WordSection1').cloneNode(true);
	clone.querySelectorAll('.editable-field').forEach(function (el) {
	  el.removeAttribute('contenteditable');
	  el.removeAttribute('class');
	});
	clone.querySelectorAll('.edit-hint, .row-del-btn, .row-thuhoi-btn').forEach(function (el) { el.remove(); });
	clone.querySelectorAll('td[style*="height:80px"]').forEach(function (el) {
	  el.style.height = '45px';
	});
	// Nếu đã bỏ chọn "Có Quản lý trực tiếp" thì loại hẳn cột đó khỏi file xuất
	if (document.getElementById('sigTable').classList.contains('hide-quanly')) {
	  clone.querySelectorAll('.col-quanly').forEach(function (el) { el.remove(); });
	}

	var imgTasks = Array.prototype.map.call(clone.querySelectorAll('img'), imgToDataUrl);

	return Promise.all(imgTasks).then(function () {
	  var content = clone.outerHTML;
	  return '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
		'xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
		'<head><meta charset="utf-8"><title>' + t('docTitle') + '</title>' +
		'<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View>' +
		'<w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->' +
		'<style>@page{size:21cm 29.7cm;margin:1.4cm 1.6cm;} ' +
		'*{font-family:"Times New Roman",serif;mso-ascii-font-family:"Times New Roman";' +
		'mso-hansi-font-family:"Times New Roman";mso-bidi-font-family:"Times New Roman";' +
		'mso-fareast-font-family:"Times New Roman";} ' +
		'body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.2;text-align:justify;} ' +
		'p, span, td, li, div, b, i, u {font-family:"Times New Roman",serif;} ' +
		'p{margin:0 0 4pt;} table{border-collapse:collapse;width:100%;} ' +
		'table.doc-table td{border:1px solid #000;padding:4px 6px;font-size:10.5pt;vertical-align:middle;text-align:left;} ' +
		'table.plain-table td{padding:2px 6px;vertical-align:middle;} .center{text-align:center;} ' +
		'.justify{text-align:justify;} .bold{font-weight:bold;} ' +
		'.title{font-size:20pt;font-weight:bold;text-align:center;margin:0;line-height:1.5;} ' +
		'.section-title{font-weight:bold;font-size:12pt;} ' +
		'ul.plain{margin:0;padding-left:36px;} ' +
		'ul.plain li{list-style:none;position:relative;margin-bottom:6px;text-align:justify;} ' +
		'ul.plain li:before{content:"-";position:absolute;left:-14px;} ' +
		'ul.sub li:before{content:"o";font-family:"Courier New";} ' +
		'table.doc-table ul.plain li{text-align:left;margin-bottom:2pt;} ' +
		'.row-ghichu-list{padding-left:18px !important;} ' +
		'.page-break{page-break-before:always;mso-page-break-before:always;}</style></head><body>' + content + '</body></html>';
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
	  var blob = htmlDocx.asBlob(html);
	  downloadBlob(blob, buildFileBaseName() + '.docx');
	});
  });

  // Xuất .doc kiểu cũ (HTML nhúng, không cần mạng, Word vẫn mở được)
  document.getElementById('exportDocBtn').addEventListener('click', function () {
	buildExportHtml().then(function (html) {
	  var blob = new Blob(['﻿', html], { type: 'application/msword' });
	  downloadBlob(blob, buildFileBaseName() + '.doc');
	});
  });

  // Khởi tạo
  applyLanguage();
};
