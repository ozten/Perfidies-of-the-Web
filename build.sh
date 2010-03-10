#!/bin/bash
#
# Builds 2 JavaScript files which are used by http://mozilla.com/en-US/plugincheck
# as well as the web badge version
#

source build.conf
cd $MOZILLA_COM
echo "Checking for bad uses of jQuery"
# We shouldn't use $,  we have Pfs.$ instead,  Regex OK
grep "$." $PERFIDIES/*.js | grep -v "Pfs.$." | grep -v "$/"

echo "building plugincheck.js ================================================"
rm -f js/plugincheck.js
cp  $PERFIDIES/notice.txt js/plugincheck.min.js
echo -ne '// Version: '                            >> js/plugincheck.min.js;
echo `cat ${PERFIDIES}/*.js | md5sum`              >> js/plugincheck.min.js

~/bin/jsmin < $PERFIDIES/lib/browserdetect.js      >> js/plugincheck.min.js
# So it turns out that plugindetect can't be passed through jsmin or IE 7 will barf
cat $PERFIDIES/lib/plugindetect.js                 >> js/plugincheck.min.js
# Bug#535030 use mozilla.com's jquery
#             $PERFIDIES/lib/jquery-1.3.2.min.js
~/bin/jsmin < $PERFIDIES/lib/jquery.jsonp-1.1.0.js >> js/plugincheck.min.js
~/bin/jsmin < $PERFIDIES/perfidies.js              >> js/plugincheck.min.js
~/bin/jsmin < $PERFIDIES/messages.js               >> js/plugincheck.min.js
~/bin/jsmin < $PERFIDIES/web.js                    >> js/plugincheck.min.js
~/bin/jsmin < $PERFIDIES/exploder.js               >> js/plugincheck.min.js
~/bin/jsmin < $PERFIDIES/plugincheck.js            >> js/plugincheck.min.js

mv js/plugincheck.min.js js/plugincheck.js



echo "building plugincheck_badge.js ================================================"
rm -f js/plugincheck_badge.js
cp  $PERFIDIES/notice.txt                              js/plugincheck_badge.min.js
echo -ne '// Version: '                             >> js/plugincheck_badge.min.js

echo `cat ${PERFIDIES}/*.js | md5sum`               >> js/plugincheck_badge.min.js
~/bin/jsmin < $PERFIDIES/lib/browserdetect.js       >> js/plugincheck_badge.min.js

# So it turns out that plugindetect can't be passed through jsmin or IE 7 will barf
cat $PERFIDIES/lib/plugindetect.js                  >> js/plugincheck_badge.min.js

~/bin/jsmin <  $PERFIDIES/lib/jquery-1.3.2.min.js   >> js/plugincheck_badge.js
~/bin/jsmin <  $PERFIDIES/lib/jquery.jsonp-1.1.0.js >> js/plugincheck_badge.js
~/bin/jsmin <  $PERFIDIES/perfidies.js              >> js/plugincheck_badge.js
# Badge uses images outside of JS, so no localization in messages.js
# $PERFIDIES/messages.js
~/bin/jsmin <  $PERFIDIES/web.js                    >> js/plugincheck_badge.js
~/bin/jsmin <  $PERFIDIES/exploder.js               >> js/plugincheck_badge.js
~/bin/jsmin <  $PERFIDIES/plugincheck_badge.js      >> js/plugincheck_badge.js

mv js/plugincheck_badge.min.js js/plugincheck_badge.js