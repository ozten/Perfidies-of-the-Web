#!/bin/bash
#
# Builds 2 JavaScript files which are used by http://mozilla.com/en-US/plugincheck
# as well as the web badge version
#

source build.conf
cd $MOZILLA_COM
echo "Checking for bad uses of jQuery"
grep "$." $PERFIDIES/*.js | grep -v "Pfs.$."

echo "building plugincheck.js"
rm -f js/plugincheck.js

cat $PERFIDIES/lib/plugindetect.js >>       js/plugincheck.js

# Bug#535030 use mozilla.com's jquery
#cat $PERFIDIES/lib/jquery-1.3.2.min.js >>   js/plugincheck.js
cat $PERFIDIES/lib/browserdetect.js >>      js/plugincheck.js
cat $PERFIDIES/lib/jquery-1.3.2.min.js >>   js/plugincheck.js
cat $PERFIDIES/lib/jquery.jsonp-1.1.0.js >> js/plugincheck.js
cat $PERFIDIES/perfidies.js >>              js/plugincheck.js
cat $PERFIDIES/messages.js >>               js/plugincheck.js
cat $PERFIDIES/web.js >>                    js/plugincheck.js
cat $PERFIDIES/plugincheck.js >>            js/plugincheck.js

cp  $PERFIDIES/notice.txt js/plugincheck.min.js
~/bin/jsmin < js/plugincheck.js >> js/plugincheck.min.js

mv js/plugincheck.min.js js/plugincheck.js

echo "building plugincheck_badge.js"
rm -f js/plugincheck_badge.js

cat $PERFIDIES/lib/plugindetect.js >>       js/plugincheck_badge.js
cat $PERFIDIES/lib/browserdetect.js >>      js/plugincheck_badge.js
cat $PERFIDIES/lib/jquery-1.3.2.min.js >>   js/plugincheck_badge.js
cat $PERFIDIES/lib/jquery.jsonp-1.1.0.js >> js/plugincheck_badge.js
cat $PERFIDIES/perfidies.js >>              js/plugincheck_badge.js
# TODO do I need +cat $PERFIDIES/messages.js >>               js/plugincheck.js
cat $PERFIDIES/web.js >>                    js/plugincheck_badge.js
cat $PERFIDIES/plugincheck_badge.js >>      js/plugincheck_badge.js
cp  $PERFIDIES/notice.txt js/plugincheck_badge.min.js

# Pick one of the two following minimizers...
# Used Google Closure Compiler for a release, but then on 11/23 with no
# code change, it's output broke the script ;)

# BEGIN Using jsmin
~/bin/jsmin < js/plugincheck_badge.js >> js/plugincheck_badge.min.js
mv js/plugincheck_badge.min.js js/plugincheck_badge.js
# END Using jsmin

# BEGIN Using Google Closure Compiler...
# remove whitespace for HTTP POST
#~/bin/jsmin < js/plugincheck_badge.js >> js/plugincheck_badge.post.js
#$PERFIDIES/closure_compiler.php /home/aking/mozilla.com/js/plugincheck_badge.post.js >> js/plugincheck_badge.min.js
#rm js/plugincheck_badge.post.js
#mv js/plugincheck_badge.min.js js/plugincheck_badge.js
# END Using Google Closure Compiler...
