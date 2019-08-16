const url = require('url')

let myURL = new URL('https://github.com/njw0308/Node.js_practice/blob/master/ES2015_syntax.js') // --> WHATWG 방식. ( search 처리가 편함 )
console.log(myURL) // 현재 url 을 파싱시켜서 보여줌. url의 구성요소에 따라.. href , origin, protocol, username, password, host, hostname, port, pathname, search, searchParams, hash 
console.log(url.format(myURL)) // 파싱된 url 정보를 하나로 합쳐서 보여줌.

let parsedUrl = url.parse('https://github.com/njw0308/Node.js_practice/blob/master/ES2015_syntax.js') // -->기존 방식. ( host 가 없을 때도 쓸 수가 있음 )
console.log(parsedUrl)

// 2가지 방식 모두 알아둬야 한다. 상황에 따라 써야하는 경우가 다르기 때문!

console.log('-----------------------------------------')
// searchParam
myURL = new URL('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');
console.log('searchParams:', myURL.searchParams);
console.log('searchParams.getAll():', myURL.searchParams.getAll('category'));
console.log('searchParams.get():', myURL.searchParams.get('limit'));
console.log('searchParams.has():', myURL.searchParams.has('page'));

console.log('searchParams.keys():', myURL.searchParams.keys());
console.log('searchParams.values():', myURL.searchParams.values());

myURL.searchParams.append('filter', 'es3'); // 기존 값에서 추가.
myURL.searchParams.append('filter', 'es5');
console.log(myURL.searchParams.getAll('filter'));

myURL.searchParams.set('filter', 'es6'); // 기존 값을 초기화 한 후 수정.
console.log(myURL.searchParams.getAll('filter'));

myURL.searchParams.delete('filter');
console.log(myURL.searchParams.getAll('filter'));

console.log('searchParams.toString():', myURL.searchParams.toString()); //-->하나의 문자열로 만들어주기.
myURL.search = myURL.searchParams.toString();

console.log('-------------------------------------')
// 기존 방식의 url 을 parsing 할 때 쓰이는 모듈!
// searchParams 가 기능이 더 많기 때문에, WHATWG 방식일 때는 안쓰임.
const querystring = require('querystring')

parsedUrl = url.parse('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript');
const query = querystring.parse(parsedUrl.query);
console.log('querystring.parse():', query);
console.log('querystring.stringify():', querystring.stringify(query)); // --> 하나의 문자열로 합침.
