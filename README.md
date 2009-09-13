# PerFidieS of the Web
This is the client side of the PFS2 project, which updates how
Mozilla tracks browser plugins. As new versions are released
or vulnerabilities are discovered the PFS2 project will
encourage or alert the user to upgrade plugins.

# Development
Edit js files run tests/unit.html, pfs2_json.html, etc

Integration test
Setup PFS2 http://svn.mozilla.org/projects/pfs2/trunk/
then run it's tests to populate the database with test data
In this project, run tests/integration.html for end to end tests.

# Mozilla.com PluginCheck
./build.sh which produces plugin.js
Hit local instance of mozilla.com/en-US/plugincheck/