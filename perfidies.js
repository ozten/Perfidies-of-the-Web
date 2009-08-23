/* perfidies.js
  There are two layers - The UI and the PFS2 API
  
  This file will (evetually) only host the PFS API. Other JS files will host
  the MoCo whatsnew UI, the SFx Up Your Plug Badges, etc
  
*/

/**
 * Ghetto BNF:
 * A Version = description? version comment?
 * version = versionPart | versionChain
 * versionPart = digit | character
 * versionChain = versionPart (seperator versionPart)+
 * seperator = .
 * 
 * v - string like "Quicktime 3.0.12"
 * return a "VersionChain" which is an array of version parts example - [3, 0, 12]
 */
var parseVersion = function(v) {
    var tokens = v.split(' ');
    var versionChain = [];

    var inVersion = false;
    var inNumericVersion = false;
    var inCharVersion = false;

    var currentVersionPart = "";
    function isNumeric(c) { return ! isNaN(parseInt(c, 10)); }
    
    function isSeperator(c) { return c === '.'; }

    function startVersion(token, j) {
        if (isNumeric(token[j])) {
            inVersion = true;
            inNumericVersion = true;
            currentVersionPart += token[j];
        } /* else {
            skip we are in the description
        }*/
    }
    
    function finishVersionPart() {
        //cleanup this versionPart        
        if (inNumericVersion) {
            versionChain.push(parseInt(currentVersionPart, 10));
            inNumericVersion = false;
        } else if (inCharVersion) {
            versionChain.push(currentVersionPart);
            inCharVersion = false;
        } else {
            if (window.console) { console.error("This should never happen", currentVersionPart, inNumericVersion, inCharVersion); }
        }        
        currentVersionPart = "";
    }
    
    for(var i=0; i < tokens.length; i++){
        var token = tokens[i].trim();
        if (token.length === 0) {
            continue;
        }
        for(var j=0; j < token.length; j++) {            
            if (inVersion) {
                if (isNumeric(token[j])) {
                    inNumericVersion = true;
                    currentVersionPart += token[j];
                //TODO isChar...
                } else if(isSeperator(token[j])) {
                    finishVersionPart();
                } else {
                    return versionChain;
                }
            } else {
                startVersion(token, j);
            }
        }
        if (inVersion) {
            //clean up previous token
            finishVersionPart();
        }
    }
    if (! inVersion) {        
        if (window.console) { console.warn("Unable to parseVersion from " + v); }
    }
    return versionChain;    
};

function pluginData() {
    
}
function compare(v1, v2) {
    var v1c = parseVersion(v1);
}
var findPluginQueue = [];

var currentPlugins = [];
var outdatedPlugins = [];
var vulnerablePlugins = [];
var unknownPlugins = [];

