/* =====================================================================
 *  crypto-util.js — Mã hóa / giải mã nội dung biên bản
 *  Thuật toán: AES-GCM 256-bit, khóa dẫn xuất bằng PBKDF2-SHA256 (250.000 vòng)
 *  Định dạng dữ liệu: base64( salt[16 byte] || iv[12 byte] || ciphertext )
 * ===================================================================== */
window.BBBGCrypto = (function () {
  var ITERATIONS = 250000;

  function hasCrypto() {
	return !!(window.crypto && window.crypto.subtle);
  }

  function deriveKey(password, salt) {
	var enc = new TextEncoder();
	return crypto.subtle
	  .importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey'])
	  .then(function (baseKey) {
		return crypto.subtle.deriveKey(
		  { name: 'PBKDF2', salt: salt, iterations: ITERATIONS, hash: 'SHA-256' },
		  baseKey,
		  { name: 'AES-GCM', length: 256 },
		  false,
		  ['encrypt', 'decrypt']
		);
	  });
  }

  function bytesToBase64(bytes) {
	var bin = '';
	var chunk = 0x8000;
	for (var i = 0; i < bytes.length; i += chunk) {
	  bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
	}
	return btoa(bin);
  }

  function base64ToBytes(b64) {
	var bin = atob(b64);
	var bytes = new Uint8Array(bin.length);
	for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
	return bytes;
  }

  function encrypt(plainText, password) {
	var salt = crypto.getRandomValues(new Uint8Array(16));
	var iv = crypto.getRandomValues(new Uint8Array(12));
	return deriveKey(password, salt).then(function (key) {
	  return crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: iv },
		key,
		new TextEncoder().encode(plainText)
	  );
	}).then(function (cipherBuf) {
	  var cipher = new Uint8Array(cipherBuf);
	  var out = new Uint8Array(salt.length + iv.length + cipher.length);
	  out.set(salt, 0);
	  out.set(iv, salt.length);
	  out.set(cipher, salt.length + iv.length);
	  return bytesToBase64(out);
	});
  }

  function decrypt(b64, password) {
	var raw = base64ToBytes(b64);
	var salt = raw.subarray(0, 16);
	var iv = raw.subarray(16, 28);
	var cipher = raw.subarray(28);
	return deriveKey(password, salt).then(function (key) {
	  return crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipher);
	}).then(function (plainBuf) {
	  return new TextDecoder().decode(plainBuf);
	});
  }

  return { encrypt: encrypt, decrypt: decrypt, hasCrypto: hasCrypto };
})();
