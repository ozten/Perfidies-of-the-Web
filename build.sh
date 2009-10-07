#!/bin/bash

# Location of the mozilla.com/trunk
MOZILLA_COM=/home/ozten/Projects/mozilla.com
# Location of the Perfidies code
PERFIDIES=/home/ozten/Projects/Perfidies-of-the-Web

cd $MOZILLA_COM
rm -f js/plugincheck.js js/plugincheck.min.js
cat $PERFIDIES/plugindetect.js >> js/plugincheck.js
cat $PERFIDIES/perfidies.js >> js/plugincheck.js
cat $PERFIDIES/plugincheck.js >> js/plugincheck.js

cp  $PERFIDIES/notice.txt js/plugincheck.min.js
~/bin/jsmin < js/plugincheck.js >> js/plugincheck.min.js

mv js/plugincheck.min.js js/plugincheck.js