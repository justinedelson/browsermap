module('BrowserMapUtil')
test('merge', function() {
    var hash1 = {a : 1, b : 2};
    var hash2 = {b : 3, c : 3};
    var hash3 = {a : 1, b : 3, c : 3};
    deepEqual(BrowserMapUtil.merge(hash1, hash2), hash3, 'merge');
});
test('getArrayDifference', function() {
    var a = [1, 2, 3];
    var b = [4, 5, 6];
    var c = [3, 4, 5];
    deepEqual(BrowserMapUtil.getArrayDifference(a, b), [1, 2, 3], 'getArrayDifference - different sets');
    deepEqual(BrowserMapUtil.getArrayDifference(a, a), [], 'getArrayDifference - identical sets');
    deepEqual(BrowserMapUtil.getArrayDifference(a, c), [1, 2], 'getArrayDifference - sets with some common elements');
});
test('cookiemanager', function() {
    var c = 'test=test';
    document.cookie = c;
    ok(BrowserMapUtil.cookieManager.cookieExists('test'), 'cookieExists');
    var cookie = BrowserMapUtil.cookieManager.getCookie('test');
    ok(cookie instanceof Cookie, 'getCookie - returned object type');
    strictEqual(cookie.name, 'test', 'getCookie - test cookie name');
    cookie.value = 'test2';
    BrowserMapUtil.cookieManager.setCookie(cookie);
    strictEqual(BrowserMapUtil.cookieManager.getCookie('test').value, 'test2', 'setCookie');
    BrowserMapUtil.cookieManager.removeCookie('test');
    equal(BrowserMapUtil.cookieManager.getCookie('test'), null, 'removeCookie');
});
test('file', function() {
    strictEqual(BrowserMapUtil.file.getFileExtension('index.html'), '.html', 'getFileExtension - file with extension');
    strictEqual(BrowserMapUtil.file.getFileExtension('index.html.exe'), '.exe', 'getFileExtension - file with 2 extensions');
    strictEqual(BrowserMapUtil.file.getFileExtension('index'), '', 'getFileExtension - file without extension');
    strictEqual(BrowserMapUtil.file.removeSelectorsFromFile('index.a.b.html'), 'index.html', 'removeSelectorsFromFile - two selectors');
    strictEqual(BrowserMapUtil.file.removeSelectorsFromFile('index.html'), 'index.html', 'removeSelectorsFromFile - no selectors');
});
test('url', function() {
    strictEqual(BrowserMapUtil.url.getDomainFromURL('http://www.example.com'), 'www.example.com', 'getDomainFromURL - http, no parameters');
    strictEqual(BrowserMapUtil.url.getDomainFromURL('http://www.example.com/?s='), 'www.example.com', 'getDomainFromURL - http, 1 parameter');
    strictEqual(BrowserMapUtil.url.decodeURLParameterValue('test+te%20st'), 'test te st', 'decodeURLParameterValue');
    deepEqual(BrowserMapUtil.url.getURLParameters('http://www.example.com/?a=a&b=b'), {a : 'a', b : 'b'}, 'getURLParameters - 2 parameters');
    deepEqual(BrowserMapUtil.url.getURLParameters('http://www.example.com/'), {}, 'getURLParameters - no parameters');
    strictEqual(BrowserMapUtil.url.getValueForParameter('http://www.example.com/?a=test', 'a'), 'test', 'getValueForParameter - 1 parameter');
    equal(BrowserMapUtil.url.getValueForParameter('http://www.example.com/', 'a'), null, 'getValueForParameter - no parameters');
    strictEqual(BrowserMapUtil.url.getURLParametersString('http://www.example.com?a=test&b=test'), '?a=test&b=test', 'getURLParametersString - with parameters');
    strictEqual(BrowserMapUtil.url.getURLParametersString('http://www.example.com'), '', 'getURLParametersString - without parameters');
    strictEqual(BrowserMapUtil.url.getFileFromURL('http://www.example.com/index.html?param=true'), 'index.html?param=true', 'getFileFromURL - with parameters');
    strictEqual(BrowserMapUtil.url.getFileFromURL('http://www.example.com/folder/index.html?param=true'), 'index.html?param=true', 'getFileFromURL - with parameters + folder');
    strictEqual(BrowserMapUtil.url.getFileFromURL('http://www.example.com/folder/'), '', 'getFileFromURL - no file + folder');
    strictEqual(BrowserMapUtil.url.getFileFromURL('http://www.example.com'), '', 'getFileFromURL - web root');
    strictEqual(BrowserMapUtil.url.getFolderPathFromURL('http://www.example.com/index.html'), 'http://www.example.com/', 'getFolderPathFromURL - url ends with file');
    strictEqual(BrowserMapUtil.url.getFolderPathFromURL('http://www.example.com/'), 'http://www.example.com/', 'getFolderPathFromURL - url ends with /');
    strictEqual(BrowserMapUtil.url.getFolderPathFromURL('http://www.example.com'), '', 'getFolderPathFromURL - url ends with TLD');
    deepEqual(BrowserMapUtil.url.getSelectorsFromURL('http://www.example.com/index.a.b.html'), ['a', 'b'], 'getSelectorsFromURL - two selectors');
    deepEqual(BrowserMapUtil.url.getSelectorsFromURL('http://www.example.com/index.html'), [], 'getSelectorsFromURL - no selectors');
    strictEqual(BrowserMapUtil.url.addSelectorsToURL('http://www.example.com/index.html', ['a', 'b']), 'http://www.example.com/index.a.b.html', 'addSelectorsToURL - two selectors');
    strictEqual(BrowserMapUtil.url.addSelectorsToURL('http://www.example.com/index.html', []), 'http://www.example.com/index.html', 'addSelectorsToURL - no selectors');
});

module('Array.indexOf polyfill')
test('Array.indexOf', function() {
    ok(!!Array.prototype.indexOf, 'Array.indexOf is defined');
});

module('BrowserMap')
test("getAllAlternateSites", function() {
    var currentURL = window.location.href;
    var alternateSites = [
        {href: currentURL, hreflang : 'en', media : 'browser', id : ''},
        {href: currentURL, hreflang : 'de', media : 'browser', id : ''},
        {href: window.location.href.replace(".html", ".smartphone.html"), hreflang : 'en', media : 'smartphone', id : ''}
    ]
    deepEqual(BrowserMap.getAllAlternateSites(), alternateSites);
});
test("getAlternateSite", function() {
    var filter = function(link) {return link.hreflang == 'de'};
    var currentURL = window.location.href;
    deepEqual(BrowserMap.getAlternateSite(['browser'], filter), {href: currentURL, hreflang : 'de', media : 'browser', id : ''});
});
test("getDeviceGroupsInRankingOrder", function() {
    BrowserMap.addDeviceGroup({ranking: 1, testFunction : function() {}, name : 'dg2'});
    BrowserMap.addDeviceGroup({ranking: 0, testFunction : function() {}, name : 'dg1'});
    var expectedDgs = [{ranking: 0, testFunction : function() {}, name : 'dg1'}, {ranking: 1, testFunction : function() {}, name : 'dg2'}];
    var dgs = BrowserMap.getDeviceGroupsInRankingOrder();
    for (var i = 0; i < expectedDgs.length; i++) {
        strictEqual(dgs[i].name, expectedDgs[i].name);
        strictEqual(dgs[i].ranking, expectedDgs[i].ranking);
    }
});
test("probe", function() {
    equal(null, BrowserMap.probe('nothingHere'));
});
test("getNewURL", function() {
    strictEqual(BrowserMap.getNewURL(window.location.href, ['smartphone'], ['smartphone']), window.location.href.replace(".html", ".smartphone.html"));
});
test("isEnabled", function() {
    strictEqual(BrowserMap.isEnabled(), false);
    // now disable BrowserMap by removing the meta tag and call BrowserMap.isEnabled() once more
    var headElement = document.getElementsByTagName('head')[0],
        metaTags,
        i,
        tag,
        name;
    if (headElement) {
        metaTags = headElement.getElementsByTagName('meta');
        for (i = 0; i < metaTags.length; i++) {
            if ((tag = metaTags[i]) && (name = tag.getAttribute('name'))) {
                if (name === 'browsermap.enabled' && tag.getAttribute('content') === 'false') {
                    headElement.removeChild(tag);
                }
            }
        }
    }
    strictEqual(BrowserMap.isEnabled(), true);
    // re-add the removed tag
    if (tag) {
        headElement.appendChild(tag);
    }
});
