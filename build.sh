#!/bin/bash
#
# Builds 2 JavaScript files which are used by http://mozilla.com/en-US/plugincheck
# as well as the web badge version
#
source build.conf
mkdir -p $DIST_DIR
cd $DIST_DIR
echo "Checking for bad uses of jQuery"
# We shouldn't use $,  we have Pfs.$ instead,  Regex OK
grep "$." $PERFIDIES/*.js | grep -v "Pfs.$." | grep -v "$/"

MIN_CMD=jsmin
#MIN_CMD=cat

echo "building plugincheck.js ================================================"
rm -f plugincheck.js
cp  $PERFIDIES/notice.txt plugincheck.min.js
echo -ne '// Version: '                            >> plugincheck.min.js
echo `cat ${PERFIDIES}/*.js | md5sum`              >> plugincheck.min.js

$MIN_CMD < $PERFIDIES/lib/browserdetect.js      >> plugincheck.min.js
# So it turns out that plugindetect can't be passed through jsmin or IE 7 will barf
cat $PERFIDIES/lib/plugindetect.js                 >> plugincheck.min.js
# Bug#619727 reverses Bug#535030 use mozilla.com's jquery
# Keep jquery after nova...
$MIN_CMD < $PERFIDIES/lib/jquery-1.3.2.min.js   >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/lib/jquery.jsonp-1.1.0.js >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/lib/jquery.qtip-1.0.0.js  >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/lib/jquery.color.js       >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/perfidies.js              >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/messages.js               >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/modern_browser.js         >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/exploder.js               >> plugincheck.min.js
$MIN_CMD < $PERFIDIES/plugincheck_ui.js         >> plugincheck.min.js

mv plugincheck.min.js plugincheck.js

echo "building plugincheck_badge.js ================================================"
rm -f plugincheck_badge.js
cp  $PERFIDIES/notice.txt                              plugincheck_badge.min.js
echo -ne '// Version: '                             >> plugincheck_badge.min.js

echo `cat ${PERFIDIES}/*.js | md5sum`               >> plugincheck_badge.min.js
$MIN_CMD < $PERFIDIES/lib/browserdetect.js       >> plugincheck_badge.min.js

# So it turns out that plugindetect can't be passed through jsmin or IE 7 will barf
cat $PERFIDIES/lib/plugindetect.js                  >> plugincheck_badge.min.js

$MIN_CMD <  $PERFIDIES/lib/jquery-1.3.2.min.js   >> plugincheck_badge.min.js
$MIN_CMD <  $PERFIDIES/lib/jquery.jsonp-1.1.0.js >> plugincheck_badge.min.js
$MIN_CMD <  $PERFIDIES/perfidies.js              >> plugincheck_badge.min.js
# Badge uses images outside of JS, so no localization in messages.js
# $PERFIDIES/messages.js
$MIN_CMD <  $PERFIDIES/modern_browser.js         >> plugincheck_badge.min.js
$MIN_CMD <  $PERFIDIES/exploder.js               >> plugincheck_badge.min.js
$MIN_CMD <  $PERFIDIES/plugincheck_badge_ui.js      >> plugincheck_badge.min.js

mv plugincheck_badge.min.js plugincheck_badge.js