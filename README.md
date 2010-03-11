# PerFidieS of the Web #
This is the client side of the PFS2 project, which updates how
Mozilla tracks browser plugins. As new plugin versions are released
or vulnerabilities are discovered the PFS2 project will
encourage or alert the user to upgrade plugins.

http://mozilla.com/en-US/plugincheck/ - Uses this project and has more information

## Structure of Perfidies ##
Perfidies is broken down into several source files. Prepare for ASCII Art...
  ___________________________________________
 /                                           \
| plugincheck_ui.js | plugincheck_badge_ui.js |
|-------------------|                         |
| messages.js       |                         |
|-------------------------------------------- |
|       modern_browser.js, exploder.js        |
|-------------------------------------------- |
|       perfidies.js                          |
\_____________________________________________/

So the top layer is mozilla.com specific
messages.js - Exists for L10n

The bottom two layers should be reusable.

## Development ##
Edit js files run tests/unit.html, pfs2_json.html, via file system or local web server.

For maximum fun, setup mozilla.com, plugindir, and make this directory available
via a local web server.

## Integration test ##
Setup the plugindir server, which has a PFS2 api http://github.com/lmorchard/plugindir
then run it's tests to populate the database with test data

In this project, run tests/integration.html via a local web server
for end to end integration tests. make sure your pfs2 database has the Foobar plugin data.

## Building the project ##
1) Edit DIST_DIR and PERFIDIES env variables in build.conf
2) ./build.sh
3) Produces $DIST_DIR/plugincheck.js and $DIST_DIR/plugincheck_badge.js

## Working on Mozilla.com? ##
Set DIST_DIR to your moco checkout js directory.
Example:
    DIST_DIR=/some/path/mozilla.com/js/
Build Project and then hit local instance of mozilla.com/en-US/plugincheck/
Commit changes to this project as well as Mozilla.com js/plugincheck.js and js/plugincheck_badge.js

## Contributors: ##
* Pascal Chevrel
* Les Orchard
* Lloyd Hilaiel
* Reuses Eric Gerds' excellent PluginDetect v0.7 http://www.pinlady.net/PluginDetect 
* PPK's Browser detect library http://www.quirksmode.org/js/detect.html
