# PerFidieS of the Web
This is the client side of the PFS2 project, which updates how
Mozilla tracks browser plugins. As new versions are released
or vulnerabilities are discovered the PFS2 project will
encourage or alert the user to upgrade plugins.

For maximum fun, setup mozilla.com, pfs2, and make this directory available
via a local web server.

# Development
Edit js files run tests/unit.html, pfs2_json.html, via file system or local web server.

# Integration test
Setup PFS2 http://svn.mozilla.org/projects/pfs2/trunk/
then run it's tests to populate the database with test data

In this project, run tests/integration.html via a local web server
for end to end integration tests.

# Mozilla.com PluginCheck
Edit MOZILLA_COM and PERFIDIES env variables in build.sh
./build.sh which produces $MOZILLA_COM/js/plugincheck.js
Hit local instance of mozilla.com/en-US/plugincheck/

Commit changes to this project as well as Mozilla.com js/plugincheck

# Credits
* Les Orchard
* Lloyd Hilaiel
* Reuses Eric Gerds' excellent PluginDetect v0.6.3 http://www.pinlady.net/PluginDetect 
* PPK's Browser detect library http://www.quirksmode.org/js/detect.html

ScratchPad
OLD
curl "https://pfs2.stage.mozilla.com/?
appID=%7Bec8030f7-c20a-464f-9b0e-13a3a9e97384%7D&
appRelease=3.6&
appVersion=20100115133306&
callback=C"
chromeLocale=en-US&
clientOS=Linux+i686&
mimetype=application%2Fx-vlc-plugin+application%2Fvlc+video%2Fx-google-vlc-plugin+application%2Fx-ogg+application%2Fogg+audio%2Fogg+audio%2Fx-ogg+video%2Fogg+video%2Fx-ogg+application%2Fannodex+audio%2Fannodex+video%2Fannodex+video%2Fmpeg+audio%2Fwav+audio%2Fx-wav+audio%2Fmpeg+application%2Fx-nsv-vp3-mp3+video%2Fflv+application%2Fx-totem-plugin&
[
   {
      "aliases":{
         "regex":[
            ".*Flash.*"
         ],
         "literal":[
            "Adobe Flash Player",
            "Shockwave Flash"
         ]
      },
      "releases":{
         "latest":{
            "pfs_id":"adobe-flash-player",
            "name":"Shockwave Flash",
            "vendor":"Adobe",
            "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
            "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
            "status":"latest",
            "guid":"{7a646d7b-0202-4491-9151-cf66fa0722b2}",
            "version":"10.0.45.0",
            "xpi_location":"http:\/\/fpdownload.macromedia.com\/get\/flashplayer\/xpi\/current\/flashplayer-linux.xpi",
            "modified":"2010-03-03T05:50:01+00:00",
            "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
            "app_release":"*",
            "app_version":"*",
            "locale":"*",
            "os_name":"linux",
            "relevance":5
         },
         "others":[
            {
               "pfs_id":"adobe-flash-player",
               "name":"Shockwave Flash",
               "vendor":"Adobe",
               "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
               "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
               "vulnerability_url":"http:\/\/www.adobe.com\/support\/security\/bulletins\/apsb09-10.html",
               "status":"vulnerable",
               "version":"9.0.159.0",
               "modified":"2010-03-03T05:50:01+00:00",
               "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
               "app_release":"*",
               "app_version":"*",
               "locale":"*",
               "os_name":"*",
               "relevance":2
            },
            {
               "pfs_id":"adobe-flash-player",
               "name":"Shockwave Flash",
               "vendor":"Adobe",
               "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
               "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
               "vulnerability_url":"http:\/\/documents.iss.net\/whitepapers\/IBM_X-Force_WP_final.pdf",
               "status":"vulnerable",
               "version":"9.0.115.0",
               "modified":"2010-03-03T05:50:01+00:00",
               "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
               "app_release":"*",
               "app_version":"*",
               "locale":"*",
               "os_name":"*",
               "relevance":2
            },
            {
               "pfs_id":"adobe-flash-player",
               "name":"Shockwave Flash",
               "vendor":"Adobe",
               "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
               "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
               "vulnerability_url":"http:\/\/www.adobe.com\/support\/security\/bulletins\/apsb09-10.html",
               "status":"vulnerable",
               "version":"10.0.22.87",
               "modified":"2010-03-03T05:50:01+00:00",
               "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
               "app_release":"*",
               "app_version":"*",
               "locale":"*",
               "os_name":"*",
               "relevance":2
            }
         ]
      }
   }
]

NEW
curl "http://plugins.stage.mozilla.com/en-us/pfs/v2?
appID=%7Bec8030f7-c20a-464f-9b0e-13a3a9e97384%7D&
appRelease=3.6&
appVersion=20100115133306&
callback=C"
clientOS=Linux+i686&
chromeLocale=en-US&
detection=original&
mimetype=application%2Fx-vlc-plugin+application%2Fvlc+video%2Fx-google-vlc-plugin+application%2Fx-ogg+application%2Fogg+audio%2Fogg+audio%2Fx-ogg+video%2Fogg+video%2Fx-ogg+application%2Fannodex+audio%2Fannodex+video%2Fannodex+video%2Fmpeg+audio%2Fwav+audio%2Fx-wav+audio%2Fmpeg+application%2Fx-nsv-vp3-mp3+video%2Fflv+application%2Fx-totem-plugin&



[
   {
      "aliases":{
         "regex":[
            ".*Flash.*"
         ],
         "literal":[
            "Adobe Flash Player",
            "Shockwave Flash"
         ]
      },
      "releases":{
         "latest":{
            "pfs_id":"adobe-flash-player",
            "name":"Shockwave Flash",
            "vendor":"Adobe",
            "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
            "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
            "status":"latest",
            "guid":"{7a646d7b-0202-4491-9151-cf66fa0722b2}",
            "version":"10.0.45.0",
            "xpi_location":"http:\/\/fpdownload.macromedia.com\/get\/flashplayer\/xpi\/current\/flashplayer-linux.xpi",
            "modified":"2010-03-03T05:50:01+00:00",
            "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
            "app_release":"*",
            "app_version":"*",
            "locale":"*",
            "os_name":"linux",
            "relevance":5
         },
         "others":[
            {
               "pfs_id":"adobe-flash-player",
               "name":"Shockwave Flash",
               "vendor":"Adobe",
               "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
               "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
               "vulnerability_url":"http:\/\/www.adobe.com\/support\/security\/bulletins\/apsb09-10.html",
               "status":"vulnerable",
               "version":"9.0.159.0",
               "modified":"2010-03-03T05:50:01+00:00",
               "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
               "app_release":"*",
               "app_version":"*",
               "locale":"*",
               "os_name":"*",
               "relevance":2
            },
            {
               "pfs_id":"adobe-flash-player",
               "name":"Shockwave Flash",
               "vendor":"Adobe",
               "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
               "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
               "vulnerability_url":"http:\/\/documents.iss.net\/whitepapers\/IBM_X-Force_WP_final.pdf",
               "status":"vulnerable",
               "version":"9.0.115.0",
               "modified":"2010-03-03T05:50:01+00:00",
               "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
               "app_release":"*",
               "app_version":"*",
               "locale":"*",
               "os_name":"*",
               "relevance":2
            },
            {
               "pfs_id":"adobe-flash-player",
               "name":"Shockwave Flash",
               "vendor":"Adobe",
               "url":"http:\/\/www.adobe.com\/go\/getflashplayer",
               "license_url":"http:\/\/www.adobe.com\/go\/eula_flashplayer",
               "vulnerability_url":"http:\/\/www.adobe.com\/support\/security\/bulletins\/apsb09-10.html",
               "status":"vulnerable",
               "version":"10.0.22.87",
               "modified":"2010-03-03T05:50:01+00:00",
               "app_id":"{ec8030f7-c20a-464f-9b0e-13a3a9e97384}",
               "app_release":"*",
               "app_version":"*",
               "locale":"*",
               "os_name":"*",
               "relevance":2
            }
         ]
      }
   }
]