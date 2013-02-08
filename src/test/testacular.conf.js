// Testacular configuration
// Generated on Fri Jan 25 2013 15:43:08 GMT+0200 (EET)


// base path, that will be used to resolve files and exclude
basePath = '../../';


// list of files / patterns to load in the browser
files = [
    QUNIT,
    QUNIT_ADAPTER,
    'src/main/js/bmaputil.js',
    'src/main/js/bmap.js',
    'src/main/lib/matchMedia/matchMedia.js',
    'src/main/lib/modernizr/modernizr.custom.js',
    'src/main/js/probes.js',
    'src/main/js/devicegroups.js',
    'src/test/js/*.js'
];


// list of files to exclude
exclude = [

];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress', 'junit'];
junitReporter = {
    outputFile: 'target/test-results.xml'
}

// web server port
port = 8081;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome', 'ChromeCanary', 'Firefox'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 30000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

// report which specs are slower than 500ms
// CLI --report-slower-than 500
reportSlowerThan = 500;
