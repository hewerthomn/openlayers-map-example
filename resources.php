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
		'lon' => -63.88206481933594,
		'lat' => -8.767010116265327
	],

	[
		'id' => 2,
		'title' => 'Ponto 2 - 10.1.1.4',
		'icon' => hostOnOff('10.1.1.4'),
		'lon' => -63.897857666015625,
		'lat' => -8.807046709692914
	],	
];

header('Content-Type: application\json');
die(json_encode($resources));