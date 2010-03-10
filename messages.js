/* L10N Note: The following block of strings are used by JavaScript
   for the plugin detection part of the page */
/*jslint browser: true, plusplus: false */
/*global Pfs_external, window*/
var Pfs_internal = [];
// General Copy
Pfs_internal[0] = "Checking with Mozilla on the status of your plugins";
Pfs_internal[1] = "Loading Data";
Pfs_internal[2] = "View All Your Plugins";

// label and status for plugin detection table 
Pfs_internal[3] = "Disable Now"; //DISABLE
Pfs_internal[4] = "Vulnerable No Fix"; //DISABLE

Pfs_internal[5] = "Update Now"; //VULNERABLE
Pfs_internal[6] = "Vulnerable"; //VULNERABLE
	
Pfs_internal[7] = "Update"; //OUTDATED
Pfs_internal[8] = "Outdated Version"; //OUTDATED
	
Pfs_internal[9] = "Up to Date"; //CURRENT
// no plugin_latest_status... It is set to the Version number detected

Pfs_internal[10] = "Research"; //UNKNOWN
Pfs_internal[11] = "Unable to Detect Plugin Version"; //UNKNOWN

/* At the top of the table is an overall summary about the "worst"
   plugin situation you have. Examples:
   1 of 14 plugins are vulnerable with no update availble
     or
   1 of 2 plugins are potentially vulnerable */
Pfs_internal[12] = "of";

Pfs_internal[13] = "plugins are vulnerable wih no update available";
Pfs_internal[14] = "plugins are vulnerable";
Pfs_internal[15] = "plugins are potentially vulnerable";
    
//Or if there weren't any "bad" plugins we show one of these:
Pfs_internal[16] = "The plugins listed below are up to date";
Pfs_internal[17] = "No plugins were detected";

//The button for unknown plugins use a search engine so the user can Research their plugin 
Pfs_internal[18] = "http://www.google.com/search?q=";
/*search terms before the plugin name...
 Example if there was a plugin named "DivX Media Player" that we couldn't detect, then we would
 search google for "current version plugin DivX Media Player */
Pfs_internal[19] = "current version plugin";

// more labels and status for plugin detection table 
Pfs_internal[20] = "Update Now"; //MAYBE_VULNERABLE
Pfs_internal[21] = "Potentially Vulnerable"; //MAYBE_VULNERABLE

Pfs_internal[22] = "Update"; //MAYBE_OUTDATED
Pfs_internal[23] = "Potentially Outdated Version"; //MAYBE_OUTDATED

if (window.Pfs_external && Pfs_external.length) {
    for (var i = 0; i < Pfs_external.length; i++) {
        if (typeof Pfs_external[i] !== 'undefined') {
            Pfs_internal[i] = Pfs_external[i];
        }
    }    
}