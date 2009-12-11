/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Plugin Check.
 *
 * The Initial Developer of the Original Code is
 * The Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2___
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Austin King <aking@mozilla.com> (Original Author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
/**
 * Plugin Finder Service Client Library.
 * There are two layers to the mozilla.com/en-US/plugincheck/ page: The UI and the PFS2 API.
 *
 * The UI JavaScript which uses this in plugincheck.js
 *
 * The main entry point into the PFS2 Client API is the findPluginInfos function.
 * This funtion takes a NavigatorInfo, a list of PluginInfos, and a callback function.
 *
 * It will serially contact the PFS2 server for each plugin and analyze the results.
 * It categorizes the plugins into disableNow, vulnerable, current, outdated, and unknown
 * and the callback recieves a list of each of these types of plugins
 * 
 * @author Austin King (ozten)
 */
if (window.Pfs === undefined) { window.Pfs = {}; }
Pfs = {
    /**
     * PFS2 accepts multiple mime-types per request. What is the maximum length
     * of each mime-type field. If a plugin has too many mime-types then it
     * will get chunked into several requests
     */
    MAX_MIMES_LENGTH: 3000,
    /**
     * Timeout a PFS request after 3 seconds
     */
    TIMEOUT: 3000,
    /**
     * Endpoint for the PFS2 API .
     */
    endpoint: "error set me before using",
    /**
     * A list of well known plugin names that are *always* up to date.
     * Bug#519234 - We skip RealPlayer G2 and use RealPlayer Version Plugin instead.
     * @client
     * @private
     */
    skipPluginsNamed: ["Default Plugin", "Default Plug-in", "Mozilla Default Plug-in", "RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit)"],
    /**
     * Status Code for incremental callback.
     *
     * The plugin is CURRENT, but their is also a known
     * vulnerability, so it should be disbaled as soon
     * as possible. No newer release is known to exist.
     */
    DISABLE:    "should_disble",
    /**
     * Status Code for incremental callback.
     *
     * This browser is vulnerable to exploit due to the
     * currently installed plugin version. Upgrade the plugin
     * to the latest version.
     * 
     * Also can be used as a constant with PFS2Info status field
     */
    VULNERABLE: "vulnerable",
    /**
     * Status Code for incremental callback
     *
     * This browser has an older version of the plugin installed.
     * There are no known vulnerabilities. Upgrade the plugin
     * to the latest version.
     *
     * Also can be used as a constant with PFS2Info status field
     */
    OUTDATED:    "outdated",
    /**
     * Status Code for incremental callback
     *
     * The browser has a current versin of the plugin. Whee!
     *
     * Also can be used as a constant with PFS2Info status field
     */
    CURRENT:    "latest",
    /**
     * Status Code for incremental callback.
     *
     * The browser has a plugin that is not tracked by the PFS2 server.
     */
    UNKNOWN:    "unknown",
    /**
     * Status Code for incremental callback.
     * 
     * Indicats that the browser's plugin is actually newer
     * than any releases tracked by the PFS2 server.
     */
    NEWER:    "newer",
    /**
     * Given information about the browser and plugins installed
     * the function contacts the PFS2 Service and analyzes each
     * plugin. When completed it uses two callback functions to
     * communicate progress and completion.
     *
     * The pluginInfos is a list of PluginInfo obejcts. The PluginInfo object
     * has a mimes property. This is a space delimited list of all the mime-types the
     * plugin accepts. You may want to include your own properties on each pluginInfo object for use
     * during the incremental callback.
     * 
     * @param {object} - navigatorInfo - A suitable navigatorInfo object is created via
     * the function browserInfo in plugincheck.js, but you can create one directly... {
     *   clientOS: "Intel Mac OS X 10.5", chromeLocale: "en-US", appID: "...", appRelease: "3.5.3", appVersion: "20090824085414"
     * }
     * @param {object} - pluginInfos - A suitable pluginInfos array is created via
     * the function browserPlugins in plugincheck.js, but you can create one directly... [{
     *     plugin: {}, mimes: ["mime1 mime2"], classified: false
     * }]
     *
     * @param {function} - incrementalCallback - A function which takes one argument pfsResults. Called once
     * each time a plugin is identified via the PFS2 service
     *
     * @param {function} - finishedCallback - A function with no arguments which is called once finding plugins
     * is completed. incremental Callback will not be called again, once this callback is invoked. It wil be invoked
     * only once.
     */
    findPluginInfos: function(navigatorInfo, pluginInfos, incrementalCallback, finishedCallback) {
        var finderState = this.createFinder(navigatorInfo, incrementalCallback, finishedCallback);
        
        // Walk through the plugins and get the metadata from PFS2
        // PFS2 is JSONP and can't be called async using jQuery.ajax
        // We'll create a queue and manage our requests
        for(var i=0; i< pluginInfos.length; i++) {            
            if (Pfs.shouldSkipPluginNamed(pluginInfos[i].plugin) !== true) {
                finderState.findPluginQueue.push(pluginInfos[i]);    
            }
            
        }
        finderState.startFindingNextPlugin();
    },
    /**
     * Creates an instance of the PluginFinder object, which tracks
     * the state of calling the PFS2 server
     * @private
     * @returns {object}
     */
    createFinder: function(navigatorInfo, incrementalCallback, finishedCallback) {        
        var finder = {
            // A list of plugin2mimeTypes
            findPluginQueue: [],
            // A plugin2mimeTypes
            currentPlugin: null,
            currentMime: -1,
            running: true,
           /**
            * The user supplied callback for when finding plugin information is complete            
            */
            finishedFn: finishedCallback,
            incrementalCallbackFn: incrementalCallback,
            startFindingNextPlugin: function() {
                //Note unknown plugins before we start the next one
                if (this.running && this.findPluginQueue.length > 0) {
                    this.currentPlugin = this.findPluginQueue.pop();
                    this.currentMime = 0;
                    
                    this.findPluginInfo();
                } else {
                    this.finishedFn();
                }
            },
            findPluginInfo: function() {
                
                var mime = this.currentPlugin.mimes[this.currentMime];
                    
                var that = this;
                this.callPfs2(mime, function(){ that.pfs2Success.apply(that, arguments);},                                
                                    function(){ that.pfs2Error.apply(that, arguments);});  
            },
            /**
             * Stops the finder from continuing to work it's way through plugins in the queue
             * 
             * Added to support web badges, where we are only interested in making PFS2 calls
             * until we hit our first "bad" plugin. Then we stop making calls.
             *
             * Once this method has been called, the callee will still receive a completed callback
             * @public
             * @void
             */
            stopFindingPluginInfos: function() {
               this.running = false;
            },
            /************* PFS2 below *************/
            callPfs2: function(mimeType, successFn, errorFn) {
                if (Pfs.endpoint == "error set me before using") {                    
                    Pfs.e("You must configure Pfs.endpoint before using this library");
                    return false;
                }
                var args = Pfs.$.extend({}, {mimetype: mimeType}, navigatorInfo);
                
                Pfs.$.jsonp({
                    cache: true,
                    callbackParameter: "callback",
                    data: args,
                    error: errorFn,
                    retry: 3,
                    success: successFn,
                    timeout: Pfs.TIMEOUT,                    
                    url: Pfs.endpoint                    
                });
                return true;
            },            
            
            startFindingNextMimetypeOnCurrentPlugin: function(pfsInfo) {
                this.currentMime += 1;
                if (this.currentMime < this.currentPlugin.mimes.length) {
                    this.findPluginInfo();
                } else {
                    Pfs.w("Exhausted Mime-Types...");
                    if (this.currentPlugin !== null &&
                        ! this.currentPlugin.classified) {
                        this.incrementalCallbackFn({
                            pluginInfo: this.currentPlugin,
                            pfsInfo: {},
                            status: Pfs.UNKNOWN,
                            url: ""
                        });
                        this.currentPlugin.classified = true;                        
                    }
                    this.startFindingNextPlugin();
                }
            },
            /**
             * pfs2Success JSON callback data has the following structure
             * [ 
             *   {
             *     aliases: {
             *         literal: [String, String],
             *         regex: [String]
             *              },
             *     releases: {
             *         latest: {name: String, version: String, etc},
             *         others: [{name: String, version: String, etc}]
             *               }
             *    }
             * ]
             */
            pfs2Success: function(data, status){
                var currentPluginName = this.currentPlugin.plugin;
                if (this.currentPlugin.raw && this.currentPlugin.raw.name) {
                    currentPluginName = this.currentPlugin.raw.name;
                }
                Pfs.i(this.currentPlugin);
                
                var searchingResults = true;
                var pluginMatch = false;
                var pluginInfo;
                
                for (var i =0; i < data.length; i++) {                    
                    if (! searchingResults) {
                        break;
                    }
                    var pfsInfo = data[i];
                    if (! pfsInfo.aliases ||
                       (! pfsInfo.aliases.literal  && ! pfsInfo.aliases.regex )) {
                            Pfs.e("Malformed PFS2 plugin info, no aliases");
                            break;
                    }
                    if (! pfsInfo.releases ||
                        ! pfsInfo.releases.latest) {
                            Pfs.e("Malformed PFS2 plugin info, no latest release");
                            break;
                    }
                    // Is pfsInfo the plugin we seek?
                    var searchingPluginInfo = true;
                    if (pfsInfo.aliases.literal) {
                        for(var j=0; searchingPluginInfo && j < pfsInfo.aliases.literal.length; j++) {
                            var litName = pfsInfo.aliases.literal[j];
                            
                            if (Pfs.$.trim(currentPluginName) == Pfs.$.trim(litName)) {
                                searchingResults = false;
                                searchingPluginInfo = false;
                                pluginMatch = true;
                                pluginInfo = pfsInfo;
                            }
                        }
                    }
                    if (pfsInfo.aliases.regex) {
                        for(var j=0; searchingPluginInfo && j < pfsInfo.aliases.regex.length; j++) {
                            var rxName = pfsInfo.aliases.regex[j];
                            if (new RegExp(rxName).test(currentPluginName)) {
                                searchingResults = false;
                                searchingPluginInfo = false;
                                pluginMatch = true;
                                pluginInfo = pfsInfo;
                            }
                        }
                    }
                    if (pluginMatch === true) {
                        var searchPluginRelease = true;
                        if (pfsInfo.releases.latest) {                            
                            switch(Pfs.compVersion(this.currentPlugin.plugin, pfsInfo.releases.latest.version)) {
                                case 1:
                                    if (Pfs.reportPluginFn) {
                                        Pfs.reportPluginFn([pfsInfo], 'newer');
                                    }                                    
                                    this.incrementalCallbackFn({
                                            pluginInfo: this.currentPlugin,
                                            pfsInfo: pfsInfo,
                                            status: Pfs.NEWER,
                                            url: pfsInfo.releases.latest.url
                                    });
                                    this.currentPlugin.classified = true;
                                    
                                    searchPluginRelease = false;
                                    break;
                                case 0:                                    
                                    if (pfsInfo.releases.latest.status == Pfs.VULNERABLE) {
                                        this.incrementalCallbackFn({
                                            pluginInfo: this.currentPlugin,
                                            pfsInfo: pfsInfo,
                                            status: Pfs.DISABLE,
                                            url: pfsInfo.releases.latest.url
                                        });
                                        this.currentPlugin.classified = true;
                                    } else {
                                        this.incrementalCallbackFn({
                                            pluginInfo: this.currentPlugin,
                                            pfsInfo: pfsInfo,
                                            status: Pfs.CURRENT,
                                            url: pfsInfo.releases.latest.url
                                        });
                                        this.currentPlugin.classified = true;
                                    }                            
                                    searchPluginRelease = false;
                                    break;
                                case -1:
                                    //keep looking
                                    break;
                                default:
                                    //keep looking
                                    break;
                            }                    
                        }                        
                        if (this.running && searchPluginRelease && pfsInfo.releases.others) {
                            var others = pfsInfo.releases.others;
                            for (var k=0; searchPluginRelease && k < others.length; k++) {                                 
                                if (! others[k].version) {
                                    continue;
                                }
                                switch(Pfs.compVersion(this.currentPlugin.plugin, others[k].version)) {
                                    case 1:
                                        //older than ours, keep looking
                                        break;
                                    case 0:                                        
                                        if (others[k].status == Pfs.VULNERABLE) {
                                            this.incrementalCallbackFn({
                                                pluginInfo: this.currentPlugin,
                                                pfsInfo: pfsInfo,
                                                status: Pfs.VULNERABLE,
                                                url: pfsInfo.releases.latest.url
                                            });
                                            this.currentPlugin.classified = true;
                                        } else {                                            
                                            this.incrementalCallbackFn({
                                                pluginInfo: this.currentPlugin,
                                                pfsInfo: pfsInfo,
                                                status: Pfs.OUTDATED,
                                                url: pfsInfo.releases.latest.url
                                            });
                                            this.currentPlugin.classified = true;
                                        }
                                        
                                        searchPluginRelease = false;
                                        break;
                                    case -1:
                                        //newer than ours, keep looking
                                        break;
                                    default:
                                        //keep looking
                                        break;
                                }
                            }
                            if (this.currentPlugin.classified !== true) {
                                // Sparse matrix of version numbers...
                                // we know about 1.0.1 and 1.0.3 in db and this browser has 1.0.2, etc
                                this.incrementalCallbackFn({
                                            pluginInfo: this.currentPlugin,
                                            pfsInfo: pfsInfo,
                                            status: Pfs.OUTDATED,
                                            url: pfsInfo.releases.latest.url
                                });
                                this.currentPlugin.classified = true;
                            }
                        }
                    } 
                    
                }//for over the pfs2 JSON data
                if (this.running === false || pluginMatch) {
                    searchingResults = false;
                    
                    this.startFindingNextPlugin();    
                } else {
                    //none of the plugins for this mime-type were a match... try the next mime-type
                    this.startFindingNextMimetypeOnCurrentPlugin(pfsInfo);
                }
            },
            /**
             * bad hostname, 500 server error, malformed JSON textStatus = 'error'
             * server timeout textStatus= 'timeout'
             */
            pfs2Error: function(xhr, textStatus, errorThrown){
                xhr.retry = xhr.retry -1;
                if (xhr.retry >= 0) {
                    Pfs.e("Error Type [", textStatus, "] retrying on mime/plugin ", xhr, textStatus, errorThrown, this.currentPlugin.mimes[this.currentMime], this.currentPlugin);
                    Pfs.$.jsonp(xhr);
                } else {
                    Pfs.$('table.status').replaceWith(Pfs.$('#error-panel').show());
                    Pfs.e("Doh failed on mime/plugin ", xhr, textStatus, errorThrown, this.currentPlugin.mimes[this.currentMime], this.currentPlugin);    
                }
            }            
        };
        return finder;
    },
    /**
     * Compares the description of two plugin versions and returns
     * either 1, 0, or -1 to indicate:
     * newer = 1
     * same = 0
     * older = -1
     * @private
     * @client
     * @param plugin1 {string} The first plugin description. Example: QuickTime Plug-in 7.6.2
     * @param plugin2 {string} The second plugin description to compare against
     * @returns {integer} The comparison results
     */
    compVersion: function(v1, v2) {
        if (v1 && v2) {
            return this.compVersionChain( this.parseVersion(v1),
                                          this.parseVersion(v2));
        } else if (v1) {
            Pfs.w("compVersion v1, v2, v2 is undefined v1=", v1, " v2=", v2);
            return 1;
        } else {
            Pfs.w("compVersion v1, v2, either v1 or v2 or both is undefined v1=", v1, " v2=", v2);
            return -1;
        }
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
     * @private
     * @client
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
                Pfs.e("This should never happen", currentVersionPart, inNumericVersion, inCharVersion);
            }        
            currentVersionPart = "";
        }
        
        for(var i=0; i < tokens.length; i++){
            var token = Pfs.$.trim(tokens[i]);
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
                        if (inNumericVersion) {
                            finishVersionPart();
                        }
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
            Pfs.w("Unable to parseVersion from " + v);
        }
        return versionChain;    
    },
    /**
     * Given two "version chains" it determines if the first is newer, the same, or older
     * than the second argument. The results is either 1, 0, or -1
     * newer = 1
     * same = 0
     * older = -1
     * @private
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
    
    /**
     * @private
     */
    shouldSkipPluginNamed: function(name) {
        return this.skipPluginsNamed.indexOf(Pfs.$.trim(name)) >= 0;
    },
     
    /**
     * Creates an object that can normailze and store mime types
     * 
     * @returns {object} - the master mime instance
     */
    createMasterMime: function() {
        return {
            seen: {},
            /**
             * normalizes a mime type. Example application/x-java-applet;version=1.3
             * becomes application/x-java-applet
             */
            normalize: function(mime) {
                return mime.split(';')[0];
            }
        };
    },
    /**
     * Log an error message if there is a console
     * @variadic
     * @param {object} or {string}
     */
    e: function(msg) {if (window.console) {console.error.apply(console, arguments);}},
    /**
     * Log a warning if there is a console
     * @variadic
     * @param {object} or {string}
     */
    w: function(msg) {if (window.console) {console.warn.apply(console, arguments);}},
    /**
     * Log a warning if there is a console
     * @variadic
     * @param {object} or {string}
     */
    i: function(msg) {if (window.console) {console.info.apply(console, arguments);}}
};
//Bug#535030 - All PFS scripts will use Pfs.$ to access jQuery, so that additional inclusions of
// jQuery or a conflicting  library won't break jQuery or it's plugins
Pfs.$ = jQuery.noConflict();