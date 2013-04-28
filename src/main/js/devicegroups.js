/**
 * Authors:
 *      Radu Cotescu (radu@apache.org)
 *      Felix Oghină (foghin@adobe.com)
 *
 * Define the default device groups.
 */

 /*global BrowserMap:false, Modernizr:false */
BrowserMap.addDeviceGroup({
    'ranking' : 0,
    'name' : 'smartphone',
    'description' : 'Smartphone',
    'testFunction' : function() {
        if (BrowserMap.probe('clientWidth') > 480 && BrowserMap.probe('portrait')) {
            return false;
        }
        if (BrowserMap.probe('clientWidth') >= 900 && BrowserMap.probe('landscape')) {
            return false;
        }
        if (BrowserMap.probe('canResizeBrowserWindow')) {
            return false;
        }
        return true;
    },
    'isSelector' : true
});

BrowserMap.addDeviceGroup({
    'ranking' : 10,
    'name' : 'tablet',
    'description' : 'Standard Tablet',
    'testFunction' : function() {
        if (BrowserMap.probe('portrait') && BrowserMap.probe('clientWidth') <= 480) {
            return false;
        }
        if (BrowserMap.probe('landscape') && BrowserMap.probe('clientWidth') < 900) {
            return false;
        }
        if (!Modernizr.touch) {
            return false;
        }
        if (BrowserMap.probe('canResizeBrowserWindow')) {
            return false;
        }
        return true;
    },
    'isSelector' : true
});

BrowserMap.addDeviceGroup({
    'ranking' : 20,
    'name' : 'highResolutionDisplay',
    'description' : 'High Resolution Display',
    'testFunction' : function() {
        return BrowserMap.probe('devicePixelRatio') >= 2;
    },
    'isSelector' : true
});

BrowserMap.addDeviceGroup({
    'ranking' : 30,
    'name' : 'browser',
    'description' : 'Modern desktop browser',
    'testFunction': function () {
        if (BrowserMap.probe('portrait') && BrowserMap.probe('clientWidth') < 720) {
            return false;
        }
        if (BrowserMap.probe('landscape') && BrowserMap.probe('clientWidth') <1200) {
            return false;
        }
        return Modernizr.csstransforms3d && !Modernizr.touch;
    },
    'isSelector' : false
});

BrowserMap.addDeviceGroup({
    'ranking' : Number.MAX_VALUE,
    'name' : 'oldBrowser',
    'description' : 'Old desktop browser',
    'testFunction' : function() {
        for (var i in BrowserMap.getMatchedDeviceGroups()) {
            if (BrowserMap.getMatchedDeviceGroups().hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    },
    'isSelector' : false
});
