/**
 * Authors:
 *      Radu Cotescu (cotescu@adobe.com)
 *      Felix Oghină (foghin@adobe.com)
 *
 * Define the default probes.
 */
BrowserMap.addProbe('clientWidth', function() {
    return document.documentElement.clientWidth;
}).addProbe('screenWidth', function() {
    return screen.width;
}).addProbe('orientation', function() {
    var orientation = '';
    if (window.innerWidth > window.innerHeight) {
        orientation = 'landscape';
    }
    else {
        orientation = 'portrait';
    }
    return orientation;
}).addProbe('portrait', function() {
    return BrowserMap.probe('orientation') == 'portrait';
}).addProbe('landscape', function() {
    return BrowserMap.probe('orientation') == 'landscape';
}).addProbe('screenWidthDependingOnOrientation', function () {
    var widthDependingOnOrientation = 0;
    if (BrowserMap.probe('orientation') === 'portrait') {
        widthDependingOnOrientation = screen.width > screen.height ? screen.height : screen.width;
    } else {
        widthDependingOnOrientation = screen.width < screen.height ? screen.height : screen.width;
    }
    return widthDependingOnOrientation;
}).addProbe('clientWidthDependingOnOrientation', function () {
    var clientWidthDependingOnOrientation = 0;
    if (BrowserMap.probe('orientation') == 'portrait') {
        clientWidthDependingOnOrientation = document.documentElement.clientWidth < document.documentElement.clientHeight ? document.documentElement.clientWidth : document.documentElement.clientHeight;
    } else {
        clientWidthDependingOnOrientation = document.documentElement.clientWidth > document.documentElement.clientHeight ? document.documentElement.clientWidth : document.documentElement.clientHeight;
    }
    return clientWidthDependingOnOrientation;
}).addProbe('devicePixelRatio', function() {
    var mq = window.matchMedia,
        ratio = -1,
        userAgent;
    if (mq) {
        for (var i = 0.5; i <= 3; i+= 0.05) {
            var r = Math.round(i * 100)/100;
            if (mq('(max-resolution: ' + r + 'dppx), (max-resolution: ' + r * 96 + 'dpi), (-webkit-max-device-pixel-ratio: ' + r + '), (-o-device-pixel-ratio: ' + r + ')').matches) {
                ratio = r;
                break;
            }
        }
    }

    // hacks for browsers not returning correct answers to the above media queries
    userAgent = navigator.userAgent;
    if (userAgent.indexOf('BlackBerry') != -1 || userAgent.indexOf('Windows Phone') != -1) {
        ratio = Math.round(BrowserMap.probe('screenWidthDependingOnOrientation') / BrowserMap.probe('clientWidthDependingOnOrientation') * 100) / 100;
    }
    return ratio;
}).addProbe('canResizeBrowserWindow', function() {
    /**
     * useful to detect a mobile browser (false) / a desktop browser (true)
     */
    return Math.round(BrowserMap.probe('screenWidthDependingOnOrientation') / BrowserMap.probe('devicePixelRatio')) -
                BrowserMap.THE_ANSWER_TO_LIFE_THE_UNIVERSE_AND_EVERYTHING > BrowserMap.probe('clientWidth');
});
