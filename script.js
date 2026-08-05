(function () {
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

  // Thêm dòng thiết bị mới vào bảng Phần cứng (đầy đủ data-role để panel bên trái tự nhận thêm dòng)
  document.getElementById('addHwRowBtn').addEventListener('click', function () {
	var tbody = document.getElementById('hwBody');
	var stt = pad(tbody.querySelectorAll('tr').length + 1);
	var tr = document.createElement('tr');
	tr.innerHTML =
	  '<td class="center"><span class="row-stt">' + stt + '</span>' +
	  '<button class="row-del-btn" type="button" title="Xóa dòng">✕</button></td>' +
	  '<td><span class="editable-field" data-role="ten" contenteditable="true">Tên tài sản</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="sl" contenteditable="true">01</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="ma" contenteditable="true">Mã tài sản</span></td>' +
	  '<td class="center"><span class="editable-field" data-role="gia" contenteditable="true">0 VNĐ</span></td>' +
	  '<td><ul class="plain row-ghichu-list">' +
	  '<li>Tình trạng: <span class="editable-field" data-role="tinhtrang" contenteditable="true">Mới</span></li>' +
	  '<li>Ngày mua: <span class="editable-field" data-role="ngaymua" contenteditable="true">--/--/----</span></li>' +
	  '<li>Bảo hành <span class="editable-field" data-role="baohanh" contenteditable="true">--</span></li>' +
	  '</ul>' +
	  '<button class="row-thuhoi-btn" type="button">+ Thu hồi thiết bị cũ</button></td>';
	tbody.appendChild(tr);
	tr.querySelector('.editable-field').focus();
	renderAssetPanel();
  });

  // Xóa dòng / thêm mục "Thu hồi thiết bị cũ" — dùng ủy quyền sự kiện vì các dòng có thể được thêm động
  document.getElementById('hwBody').addEventListener('click', function (e) {
	var delBtn = e.target.closest ? e.target.closest('.row-del-btn') : null;
	if (delBtn) {
	  var tr = delBtn.closest('tr');
	  var tbody = document.getElementById('hwBody');
	  if (tbody.querySelectorAll('tr').length <= 1) {
		alert('Bảng phải có ít nhất 1 dòng thiết bị.');
		return;
	  }
	  if (confirm('Xóa dòng thiết bị này?')) {
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
	  var li = document.createElement('li');
	  li.innerHTML = 'Thu hồi <span class="editable-field" data-role="thuhoi" contenteditable="true">Tên thiết bị cũ (S/T: ...)</span>';
	  ul.appendChild(li);
	  li.querySelector('.editable-field').focus();
	  renderAssetPanel();
	}
  });

  // Dựng panel chỉnh sửa nhanh cho TẤT CẢ dòng tài sản hiện có (kể cả dòng vừa thêm)
  function renderAssetPanel() {
	var tbody = document.getElementById('hwBody');
	var list = document.getElementById('assetPanelList');
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
	  title.textContent = 'Tài sản #' + pad(idx + 1);
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

	  var tenInp = makeInput(tenEl, 'Tên tài sản');
	  item.appendChild(tenInp);

	  var grid = document.createElement('div');
	  grid.className = 'asset-panel-grid';
	  var slInp = makeInput(slEl, 'SL');
	  var maInp = makeInput(maEl, 'Mã tài sản');
	  grid.appendChild(slInp);
	  grid.appendChild(maInp);
	  item.appendChild(grid);

	  var giaInp = makeInput(giaEl, 'Giá trị tài sản');
	  item.appendChild(giaInp);

	  var ghiChuTitle = document.createElement('div');
	  ghiChuTitle.className = 'asset-panel-title';
	  ghiChuTitle.style.marginTop = '2px';
	  ghiChuTitle.textContent = 'Ghi chú';
	  item.appendChild(ghiChuTitle);

	  var tinhTrangInp = makeInput(tinhTrangEl, 'Tình trạng');
	  item.appendChild(tinhTrangInp);

	  var grid2 = document.createElement('div');
	  grid2.className = 'asset-panel-grid';
	  var ngayMuaInp = makeInput(ngayMuaEl, 'Ngày mua');
	  var baoHanhInp = makeInput(baoHanhEl, 'Bảo hành');
	  grid2.appendChild(ngayMuaInp);
	  grid2.appendChild(baoHanhInp);
	  item.appendChild(grid2);

	  // Ô "Thu hồi thiết bị cũ" — nếu dòng chưa có mục thu hồi thì gõ vào panel sẽ tự tạo trong bảng
	  var thuHoiInp = document.createElement('input');
	  thuHoiInp.type = 'text';
	  thuHoiInp.placeholder = 'Thu hồi thiết bị cũ (nếu có)';
	  thuHoiInp.value = thuHoiEl ? thuHoiEl.textContent.trim() : '';
	  thuHoiInp.addEventListener('input', function () {
		if (!thuHoiEl && ghiChuUl) {
		  var li = document.createElement('li');
		  li.innerHTML = 'Thu hồi <span class="editable-field" data-role="thuhoi" contenteditable="true"></span>';
		  ghiChuUl.appendChild(li);
		  thuHoiEl = li.querySelector('[data-role="thuhoi"]');
		  thuHoiEl.addEventListener('input', function () { thuHoiInp.value = thuHoiEl.textContent; });
		}
		if (thuHoiEl) thuHoiEl.textContent = thuHoiInp.value;
	  });
	  item.appendChild(thuHoiInp);

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
  renderAssetPanel();

  function updateNgay() {
	var val = document.getElementById('inpNgay').value; // yyyy-mm-dd
	if (!val) return;
	var parts = val.split('-');
	var y = parts[0], m = parts[1], d = parts[2];
	document.getElementById('ngayCauVan').textContent =
	  'ngày ' + d + ' tháng ' + m + ' năm ' + y;
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
	  el.textContent = val || 'NGUYỄN BÁ LINH';
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

  document.getElementById('inpNgay').addEventListener('input', updateNgay);
  document.getElementById('inpNguoiGiao').addEventListener('input', updateNguoiGiao);
  document.getElementById('inpNguoiNhan').addEventListener('input', updateNguoiNhan);
  document.getElementById('inpQuanLy').addEventListener('input', updateQuanLy);
  document.getElementById('inpBoPhan').addEventListener('input', updateBoPhan);
  document.getElementById('inpPhongBan').addEventListener('input', updatePhongBan);

  // Dán (paste) vào ô sửa nhanh trong bảng chỉ lấy văn bản thuần, không dính định dạng
  document.addEventListener('paste', function (e) {
	var t = e.target;
	if (t && t.classList && t.classList.contains('editable-field') && t.isContentEditable) {
	  e.preventDefault();
	  var text = (e.clipboardData || window.clipboardData).getData('text/plain');
	  document.execCommand('insertText', false, text);
	}
  });

  // Print / PDF export
  document.getElementById('exportPdfBtn').addEventListener('click', function () {
	window.print();
  });

  // Dựng nội dung HTML dùng chung cho cả xuất .docx và .doc
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
	var content = clone.outerHTML;
	return '<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" ' +
	  'xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
	  '<head><meta charset="utf-8"><title>Biên bản bàn giao tài sản</title>' +
	  '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View>' +
	  '<w:DoNotOptimizeForBrowser/></w:WordDocument></xml><![endif]-->' +
	  '<style>@page{size:21cm 29.7cm;margin:1.4cm 1.6cm;} ' +
	  'body{font-family:"Times New Roman",serif;font-size:12pt;line-height:1.2;} ' +
	  'p{margin-bottom:4pt;} table{border-collapse:collapse;} ' +
	  'table.doc-table td{border:1px solid #000;padding:4px 6px;font-size:10.5pt;} ' +
	  'table.plain-table td{padding:2px 6px;} .center{text-align:center;} ' +
	  '.justify{text-align:justify;} .bold{font-weight:bold;} .title{font-size:20pt;font-weight:bold;text-align:center;margin:0;} ' +
	  '.section-title{font-weight:bold;} ul.plain{margin:0;padding-left:18px;} ' +
	  'ul.plain li{margin-bottom:2pt;} ' +
	  '.page-break{page-break-before:always;mso-page-break-before:always;}</style></head><body>' + content + '</body></html>';
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
	var html = buildExportHtml();
	if (typeof htmlDocx === 'undefined') {
	  alert('Không tải được thư viện tạo .docx (cần kết nối mạng). Vui lòng kiểm tra internet rồi thử lại, hoặc dùng nút Xuất Word (.doc).');
	  return;
	}
	var blob = htmlDocx.asBlob(html);
	downloadBlob(blob, 'Bien-ban-ban-giao-tai-san.docx');
  });

  // Xuất .doc kiểu cũ (HTML nhúng, không cần mạng, Word vẫn mở được)
  document.getElementById('exportDocBtn').addEventListener('click', function () {
	var html = buildExportHtml();
	var blob = new Blob(['﻿', html], { type: 'application/msword' });
	downloadBlob(blob, 'Bien-ban-ban-giao-tai-san.doc');
  });
})();
