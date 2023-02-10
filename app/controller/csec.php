<?php

//include('vendors/Captcha.php');

class csec extends cbase {

	protected $method = 'aes-128-ctr'; // default cipher method if none supplied
	private $key;
	private $encryption_key = 'CKXH2U9RPY3EFD70TLS1ZG4N8WQBOVI6AMJ5';

	function recaptcha() {
		//$captcha = new Captcha;
		//$captcha->run();

		$path = $this->f3->get("ROOT");
		$path = str_replace("\\", "/", $path) . '/public/fonts/';

		$img = new Image();
		$aFonts = ['chock-a-block.ttf'];

		$img->captcha($aFonts[0],20,4,'SESSION.captcha_code', $path);
		//$img->captcha('asgrids2.ttf',64,5,'SESSION.captcha_code', $path);
		$img->render();
		die;
	}

	public function keepAlive() {
		$a = 1 + 2;
		die;
	}

	private function crypto_rand_secure($min, $max) {
		$range = $max - $min;
		if ($range < 1) return $min; // not so random...
		$log = ceil(log($range, 2));
		$bytes = (int) ($log / 8) + 1; // length in bytes
		$bits = (int) $log + 1; // length in bits
		$filter = (int) (1 << $bits) - 1; // set all lower bits to 1
		do {
			$rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
			$rnd = $rnd & $filter; // discard irrelevant bits
		} while ($rnd > $range);
		return $min + $rnd;
	}

	public function getToken($length) {
		$token = "";
		$codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
		$codeAlphabet.= "0123456789";
		$max = strlen($codeAlphabet); // edited

		for ($i=0; $i < $length; $i++) {
			$token .= $codeAlphabet[$this->crypto_rand_secure(0, $max-1)];
		}

		return $token;
	}

}