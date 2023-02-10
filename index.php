<?php

// let php do the dirty works
require_once('vendor/autoload.php');

$f3 = \Base::instance();
$f3->config('app/config/config.ini');
$f3->config('app/config/routes.ini');

$f3->run();
