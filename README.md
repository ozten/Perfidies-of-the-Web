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
Reuses Eric Gerds' excellent PluginDetect v0.6.3 http://www.pinlady.net/PluginDetect 