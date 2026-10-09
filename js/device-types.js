/* =====================================================================
 *  device-types.js — ĐỊNH NGHĨA LOẠI THIẾT BỊ (dùng chung cho admin + biên bản)
 *  ---------------------------------------------------------------------
 *  specs = true  -> biên bản CÓ hiện dòng CPU / RAM / Ổ cứng
 *  specs = false -> KHÔNG hiện (màn hình, chuột, phụ kiện...)
 * ===================================================================== */
(function () {
  window.BBBG_DEVICE_TYPES = [
	{ id: 'laptop',  vi: 'Laptop',     en: 'Laptop',     icon: '💻', specs: true  },
	{ id: 'desktop', vi: 'PC Desktop', en: 'PC Desktop', icon: '🖥️', specs: true  },
	{ id: 'manhinh', vi: 'Màn hình',   en: 'Monitor',    icon: '📺', specs: false },
	{ id: 'chuot',   vi: 'Chuột',      en: 'Mouse',      icon: '🖱️', specs: false },
	{ id: 'phukien', vi: 'Phụ kiện',   en: 'Accessory',  icon: '🔌', specs: false }
  ];

  function stripAccentsLocal(str) {
	str = (str || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
	return str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }

  // Nhận mọi cách viết (kể cả dữ liệu cũ "may"/"khac") -> trả về id chuẩn
  window.BBBG_normalizeType = function (v) {
	var s = stripAccentsLocal(String(v == null ? '' : v)).toLowerCase().replace(/[^a-z]/g, '');
	if (!s) return 'laptop';

	if (s.indexOf('laptop') >= 0 || s === 'may' || s.indexOf('notebook') >= 0) return 'laptop';
	if (s.indexOf('desktop') >= 0 || s.indexOf('pc') >= 0 || s.indexOf('caynh') >= 0) return 'desktop';
	if (s.indexOf('manhinh') >= 0 || s.indexOf('monitor') >= 0 || s.indexOf('screen') >= 0) return 'manhinh';
	if (s.indexOf('chuot') >= 0 || s.indexOf('mouse') >= 0) return 'chuot';
	if (s.indexOf('phukien') >= 0 || s === 'khac' || s.indexOf('accessor') >= 0 ||
		s.indexOf('other') >= 0) return 'phukien';

	return 'laptop';
  };

  window.BBBG_getType = function (v) {
	var id = window.BBBG_normalizeType(v);
	for (var i = 0; i < window.BBBG_DEVICE_TYPES.length; i++) {
	  if (window.BBBG_DEVICE_TYPES[i].id === id) return window.BBBG_DEVICE_TYPES[i];
	}
	return window.BBBG_DEVICE_TYPES[0];
  };
})();
