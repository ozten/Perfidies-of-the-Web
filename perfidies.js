/* perfidies.js
  There are two layers - The UI and the PFS2 API
  
  This file will (evetually) only host the PFS API. Other JS files will host
  the MoCo whatsnew UI, the SFx Up Your Plug Badges, etc
  
*/
var Pfs = {
    /**
     * Compares the description of two plugin versions and returns
     * either 1, 0, or -1 to indicate:
     * newer = 1
     * same = 0
     * older = -1
     * @param plugin1 {string} The first plugin description. Example: QuickTime Plug-in 7.6.2
     * @param plugin2 {string} The second plugin description to compare against
     * @returns {integer} The comparison results
     */
    compVersion: function(v1, v2) {
        return this.compVersionChain( this.parseVersion(v1),
                                      this.parseVersion(v2));
    },
    
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
     parseVersion: function(v) {
        var tokens = v.split(' ');
        var versionChain = [];
    
        var inVersion = false;
        var inNumericVersion = false;
        var inCharVersion = false;
    
        var currentVersionPart = "";
        function isNumeric(c) { return ! isNaN(parseInt(c, 10)); }
        
        function isChar(c) { return "abcdefghijklmnopqrstuvwxyz".indexOf(c.toLowerCase())  >= 0; }
        
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
                        if (inCharVersion) {
                            finishVersionPart();
                        }
                        inNumericVersion = true;
                        currentVersionPart += token[j];                
                    } else if(j != 0 && isChar(token[j])) {
                        //    j != 0 - We are mid-token right? 3.0pre OK 3.0 Pre BAD
                        if (inNumericVersion) {
                            finishVersionPart();
                        }
                        inCharVersion = true;
                        currentVersionPart += token[j];
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
    },
    /**
     * Given two "version chains" it determines if the first is newer, the same, or older
     * than the second argument. The results is either 1, 0, or -1
     * newer = 1
     * same = 0
     * older = -1
     * @param versionChain1 {array} A list of version components Example [5, 3, 'a']
     * @param versionChain2 {array} The other version chain to compare against
     * @returns integer
     */
    compVersionChain: function(vc1, vc2) {
        for(var i=0; i < vc1.length && i < vc2.length; i++) {
            if (vc1[i] != vc2[i]) {
                if (vc1[i] > vc2[i]) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        if (vc1.length != vc2.length) {
            if (vc1.length > vc2.length) {
                return 1;
            } else {
                return -1;
            }
        }
        return 0;
    },
    hasVersionInfo: function(description) {
        return this.parseVersion(description).length > 0
    },
    /**
     * @param plugins {object} The window.navigator.plugins object
     */
    browserPlugins: function(plugins) {
        var p = [];
        for (var i=0; i < plugins.length; i++) {
            var pluginInfo;
            if (plugins[i].name && this.hasVersionInfo(plugins[i].name)) {
                pluginInfo = plugins[i].name;
            } else if (plugins[i].description && this.hasVersionInfo(plugins[i].description)) {
                pluginInfo = plugins[i].description;
            } else {                
                if (plugins[i].name) {
                    pluginInfo = plugins[i].name;    
                } else {
                    pluginInfo = plugins[i].description;
                }
            }
            var mimes = [];
            for (var j=0; j < plugins[i].length; j++) {
                var mimeType = plugins[i][j].type;
                if (mimeType) {
                    mimes.push(mimeType);                    
                }                
            }
            p.push({plugin: pluginInfo, mimes: mimes});
        }
        return p;
    },
    pluginData: function() {
        
    }
}
/*
  findPluginQueue: [],    
    currentPlugins: [],
    outdatedPlugins: [],
    vulnerablePlugins: [],
    unknownPlugins: []
*/
