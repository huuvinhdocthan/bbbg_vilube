/* =====================================================================
 *  lock.js — Màn hình khóa: yêu cầu mật khẩu trước khi hiện nội dung
 * ===================================================================== */
(function () {
  var lockScreen = document.getElementById('lockScreen');
  var appRoot = document.getElementById('appRoot');
  var form = document.getElementById('lockForm');
  var input = document.getElementById('lockPassword');
  var errorBox = document.getElementById('lockError');
  var submitBtn = document.getElementById('lockSubmit');

  function showError(msg) {
	errorBox.textContent = msg;
	errorBox.style.display = 'block';
  }

  // Kiểm tra môi trường
  if (!window.BBBGCrypto || !window.BBBGCrypto.hasCrypto()) {
	showError('Trình duyệt không hỗ trợ mã hóa (Web Crypto). Vui lòng dùng Chrome/Edge/Firefox bản mới.');
	if (submitBtn) submitBtn.disabled = true;
	return;
  }

  if (typeof window.BBBG_ENC === 'undefined' || !window.BBBG_ENC) {
	showError('Chưa có dữ liệu đã mã hóa (thiếu file content.enc.js). Hãy chạy "tao-mat-khau.html" để tạo file này trước.');
	if (submitBtn) submitBtn.disabled = true;
	return;
  }

  form.addEventListener('submit', function (e) {
	e.preventDefault();
	errorBox.style.display = 'none';

	var pwd = input.value;
	if (!pwd) {
	  showError('Vui lòng nhập mật khẩu.');
	  return;
	}

	submitBtn.disabled = true;
	submitBtn.textContent = 'Đang mở khóa...';

	window.BBBGCrypto.decrypt(window.BBBG_ENC, pwd)
	  .then(function (html) {
		appRoot.innerHTML = html;
		lockScreen.remove();
		// Xóa dữ liệu mã hóa khỏi bộ nhớ sau khi đã mở
		try { delete window.BBBG_ENC; } catch (err) { window.BBBG_ENC = null; }
		if (typeof window.initBBBG === 'function') window.initBBBG();
	  })
	  .catch(function () {
		submitBtn.disabled = false;
		submitBtn.textContent = 'Mở khóa';
		input.value = '';
		input.focus();
		showError('Mật khẩu không đúng. Vui lòng thử lại.');
	  });
  });

  input.focus();
})();
