/**
 * Authors:
 *      Radu Cotescu (cotescu@adobe.com)
 *      Felix Oghină (foghin@adobe.com)
 *
 * Various utils used by BrowserMap-related code.
 */
BrowserMapUtil = {
    /**
     * Merge two objects as hashes. Entries with duplicate keys are overwritten with values from the second object.
     *
     * @param Type:Object hsh1 - the first hash object
     * @param Type:Object hsh2 - the second hash object
     * @returns Type:Object a hash object obtained by merging the two parameter hash objects
     */
    'merge' : function(hsh1, hsh2) {
        var hsh = { };
        for (prop in hsh1) {
            if (hsh1.hasOwnProperty(prop)) hsh[prop] = hsh1[prop];
        }
        for (prop in hsh2) {
            if (hsh2.hasOwnProperty(prop)) hsh[prop] = hsh2[prop];
        }
        return hsh;
    },

    /**
     * Returns the set difference between Array a and Array b (a \ b).
     *
     * @param Type:Array a - the first Array
     * @param Type:Array b - the second Array
     * @returns Type:Array an Array containing the set difference
     * @throws TypeError if either a or b are not of type Array
     */
    'getArrayDifference' : function (a, b) {
        if (!a instanceof Array) {
            throw new TypeError('Expected Array for a');
        }
        if (!b instanceof Array) {
            throw new TypeError('Expected Array for b');
        }
        var seen = [], diff = [];
        for ( var i = 0; i < b.length; i++)
            seen[b[i]] = true;
        for ( var i = 0; i < a.length; i++)
            if (!seen[a[i]])
            diff.push(a[i]);
        return diff;
    },

    // object for managing cookies client-side (see https://developer.mozilla.org/en/DOM/document.cookie)
    'cookieManager' : {
        'getCookie' : function (cookieName) {
            if (!cookieName || !this.cookieExists(cookieName)) { return null; }
            var cookieValue = unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(cookieName).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
            var cookie = new Cookie(cookieName, cookieValue);
            return cookie;
        },

        'setCookie' : function (cookie) {
            if (!cookie.name || /^(?:expires|max\-age|path|domain|secure)$/.test(cookie.name)) { return; }
            var sExpires = '';
            if (cookie.expires) {
                switch (typeof cookie.expires) {
                    case 'number': sExpires = '; max-age=' + cookie.expires; break;
                    case 'string': sExpires = '; expires=' + cookie.expires; break;
                    case 'object': if (cookie.expires.hasOwnProperty('toGMTString')) { sExpires = '; expires=' + cookie.expires.toGMTString(); } break;
                }
            }
            document.cookie = escape(cookie.name) + '=' + escape(cookie.value) + sExpires + (cookie.domain ? '; domain=' + cookie.domain : '') + (cookie.path ? '; path=' + cookie.path : '') + (cookie.secure ? '; secure' : '');
        },

        'removeCookie' : function (cookieName) {
            if (!cookieName || !this.cookieExists(cookieName)) { return; }
            var oExpDate = new Date();
            oExpDate.setDate(oExpDate.getDate() - 1);
            document.cookie = escape(cookieName) + '=; expires=' + oExpDate.toGMTString() + '; path=/';
        },

        'cookieExists' : function (cookieName) { return (new RegExp('(?:^|;\\s*)' + escape(cookieName).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie); },

        'cookiesEnabled' : function () {
            var cookie = new Cookie('browsermap_test_cookie', 'browsermap_test_cookie', 10, '/')
            this.setCookie(cookie);
            var test_cookie = this.getCookie('browsermap_test_cookie');
            if (test_cookie != null) {
                this.removeCookie('browsermap_test_cookie');
                return true;
            }
            return false;
        }
    },

    'file' : {
        /**
         * Returns the extension of a file based on the file name.
         *
         * @param Type:String file - the file's name
         * @returns Type:String a String containing the file's extension, empty string if the file does not have an extension
         */
        'getFileExtension' : function (file) {
            var extension = '';
            if (file && file != '') {
                extension = file.substring(file.lastIndexOf('.'), file.length);
            }
            return extension;
        }
    },

    'url' : {
        /**
         * Analyses a URL an returns the domain part from it.
         *
         * @param Type:String url - the url from which to extract the domain part
         * @retuns Type:String the detected domain
         */
        'getDomainFromURL' : function (url) {
            var domain = '';
            url = url.replace(/http:\/\/|https:\/\//, '');
            var slashIndex = url.indexOf('/');
            if (slashIndex == -1)
                domain = url;
            else {
                domain = url.substring(0, slashIndex);
            }
            return domain;
        },

        /**
         * Decodes the value of a GET URL parameter.
         *
         * @param Type:String the encoded value of the parameter
         * @returns Type:String the decoded value of the parameter
         */
        'decodeURLParameterValue' : function (value) {
            return decodeURIComponent(value.replace(/\+/g, ' '));
        },

        /**
         * Returns a map with the GET paramters of a URL.
         *
         * @param Type:String url - the URL from which the parameters need to be extracted
         * @returns Type:Map the map with the parameters and their values
         */
        'getURLParameters' : function (url) {
            var map = {}, self = this;
            var f = function(m,key,value) { map[key] = self.decodeURLParameterValue(value); };
            var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, f);
            return map;
        },

        /**
         * Returns the value of a specified GET parameter from a URL if the parameter exists. Otherwise it will return null.
         *
         * @param Type:String url - the URL from which the parameter value needs to be extracted
         * @param Type:String parameter - the name of the GET parameter whose value needs to be returned
         * @returns Type:String the value of the parameter, null if the parameter does not exist
         */
        'getValueForParameter' : function (url, parameter) {
            return this.getURLParameters(url)[parameter];
        },

        /**
         * Returns the GET parameters string from a URL.
         *
         * @param Type:String url - the URL form which the parameters string should be extracted
         * @returns Type:String the parameters string; empty string if the url is null / empty
         */
        'getURLParametersString' : function (url) {
            var urlParametersString = '';
            if (url && url != '' && url.lastIndexOf('?') != -1) {
                urlParametersString = url.substring(url.lastIndexOf('?'), url.length);
            }
            return urlParametersString;
        },

        /**
         * Returns the file part of a URL, together with whatever GET parameters might be a part of the URL. If the URL sent as a parameter
         * is empty or null, the returned value will be a null.
         *
         * @params Type:String url - the URL from which the file part should be extracted
         * @returns Type:String a String containing the file part; empty string if the URL is null or empty or points to a folder instead of a file
         */
        'getFileFromURL' : function getFileFromURL(url) {
            var file = '';
            if (url && url != '' && url[url.lastIndexOf('/') + 1] != '?') {
                file = url.substring(url.lastIndexOf('/') + 1, url.length);
            }
            return file;
        },

        /**
         * Retrieves the folder path from a URL.
         *
         * @param Type:String url - the URL from which the path is extracted
         * @returns Type:String a String containing the folder path; empty string if the URL is null or empty
         */
        'getFolderPathFromURL' : function (url) {
            var folderPath = '';
            if (url && url != '' && url.lastIndexOf('/') != -1) {
                folderPath = url.substring(0, url.lastIndexOf('/') + 1);
            }
            return folderPath;
        }
    }
};

/**
 * Creates a Coookie object.
 *
 * @param Type:String name - this cookie's name
 * @param Type:String value - this cookie's value (unescaped - the cookie manager will handle escaping / unescaping)
 * @param expires - this cookie's expires information:
 *                  Type:Number - expiration time in seconds
 *                  Type:String - expiration time as a String formatted date
 *                  Type:Object - expiration time as a Date object
 * @param Type:String path - the path for which this cookie is valid
 * @param Type:String domain - the domain for which this cookie is valid
 * @param Type:Boolean secure - boolean flag to inidicate if this cookie needs to be used only for HTTPS connections or not
 */
function Cookie(name, value, expires, path, domain, secure) {
    if (!(this instanceof Cookie)) {
        return new Cookie(name, value, expires, path, domain, secure);
    }
    this.name = name;
    this.value = value;
    this.expires = expires;
    this.path = path;
    this.domain = domain;
    this.secure = secure;
}

// Array.indexOf polyfill
// from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}
