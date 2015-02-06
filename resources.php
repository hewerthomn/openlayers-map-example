<?php

function ping($host)
{
	exec(sprintf('ping -c 1 -W 5 %s', escapeshellarg($host)), $res, $rval);
  return $rval === 0;
}

function hostOnOff($host)
{
	return ping($host) ? '/img/up.png' : '/img/down.png';
}

$resources = [
	[
		'id' => 1,
		'title' => 'Ponto 1 - 10.1.1.1',
		'icon' => hostOnOff('10.1.1.1'),
		'xy' => [
			'x' => -5875255.7412941,
			'y' => -1059111.4637721,
		]
	],

	[
		'id' => 2,
		'title' => 'Ponto 2 - 10.1.1.4',
		'icon' => hostOnOff('10.1.1.4'),
		'xy' => [
			'x' => -967658.25551701,
			'y' => -7111653.3375207
		]
	],	
];

header('Content-Type: application\json');
die(json_encode($resources));