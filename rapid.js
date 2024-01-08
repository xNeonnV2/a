const http2 = require('http2');
const fs = require('fs');

const scheme = 'https';
const method = 'GET';
const host = 'tls.peet.ws';
const path = '/api/all';
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0';
const accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8';
const acceptLanguage = 'en-US,en;q=0.5';
const acceptEncoding = 'gzip, deflate, br';
const connection = 'keep-alive';
const cacheControl = 'no-cache';
const trailers = 'trailers';

const reqOptions = {
    [http2.constants.HTTP2_HEADER_METHOD]: method,
    [http2.constants.HTTP2_HEADER_PATH]: path,
    [http2.constants.HTTP2_HEADER_AUTHORITY]: host,
    [http2.constants.HTTP2_HEADER_SCHEME]: scheme,
    [http2.constants.HTTP2_HEADER_USER_AGENT]: userAgent,
    [http2.constants.HTTP2_HEADER_ACCEPT]: accept,
    [http2.constants.HTTP2_HEADER_ACCEPT_LANGUAGE]: acceptLanguage,
    [http2.constants.HTTP2_HEADER_ACCEPT_ENCODING]: acceptEncoding,
    // [http2.constants.HTTP2_HEADER_CONNECTION]: connection,
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Pragma': 'no-cache',
    [http2.constants.HTTP2_HEADER_CACHE_CONTROL]: cacheControl,
    [http2.constants.HTTP2_HEADER_TE]: trailers
};

const client = http2.connect(`${scheme}://${host}`, {
    settings: {
        // enablePush: false,
        headerTableSize: 65536,
        initialWindowSize: 131072,
        maxFrameSize: 16384
    }
}, (session) => {
    session.setLocalWindowSize(1024 * 12288);
});

function request(offset) {
    return new Promise((resolve, reject) => {
        const stream = client.request(reqOptions, {
            weight: 42,
            parent: offset === 0 ? 0 : 1,
            exclusive: false
        });
        if (offset !== 0) {
            stream.priority({
                exclusive: false,
                weight: 241
            });
        }
        stream.on('error', () => {
            console.log(stream.id);
        });
        stream.on('response', () => {
            console.log(stream.id);
        });

        stream.setEncoding('utf8');
        let data = '';
        stream.on('data', (chunk) => {
            data += chunk;
        });
        stream.on('end', () => {
            console.log(data);
            console.log(stream.id);
        });
        stream.end();
    });
}

const requests = [];
for (let i = 0; i < 7; i++) {
    requests.push(request(i));
}

Promise.all(requests).then().finally(() => {
    client.close(http2.constants.NGHTTP2_CANCEL);
});
