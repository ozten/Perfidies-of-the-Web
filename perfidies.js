/**
   perfidies.js
  There are two layers - The UI and the PFS2 API
  
  This file will (evetually) only host the PFS API. Other JS files will host
  the MoCo whatsnew UI, the SFx Up Your Plug Badges, etc
  @author ozten
*/
var Pfs = {
    /**
     * PFS2 accepts multiple mime-types per request. What is the maximum length
     * of each mime-type field. If a plugin has too many mime-types then it
     * will get chunked into several requests
     */
    MAX_MIMES_LENGTH: 3000,
    /**
     * Endpoint for the PFS2 API .
     */
    endpoint: "error set me before using",
    /**
     * A list of well known plugins that are *always* up to date.
     */
    skipPluginsNamed: ["Default Plugin"],
    
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
        if (v1 && v2) {
            return this.compVersionChain( this.parseVersion(v1),
                                          this.parseVersion(v2));
        } else if (v1) {
            if(window.console) {window.console.warn("compVersion v1, v2, v2 is undefined v1=", v1, " v2=", v2);}
            return 1;
        } else {
            if(window.console) {window.console.warn("compVersion v1, v2, either v1 or v2 or both is undefined v1=", v1, " v2=", v2);}
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
                if (window.console) {console.error("This should never happen", currentVersionPart, inNumericVersion, inCharVersion); }
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
            if (window.console) {console.warn("Unable to parseVersion from " + v); }
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
        if (description) {
            return this.parseVersion(description).length > 0;
        } else {
            return false;
        }
    },
    shouldSkipPluginNamed: function(name) {
        this.skipPluginsNamed.indexOf(name) >= 0
    },
    /**
     * Certain plugins need special handeling to retrieve the version
     * 
     * @returns {boolean} or {function} - false if there is no hook, a function to run otherwise
     */
    pluginNameHook: function(name) {        
        if (/Java.*/.test(name)) {
            return "Java Embedding Plugin " + PluginDetect.getVersion('Java', 'getJavaInfo.jar').replace(/,/g, '.').replace(/_/g, '.');    
        } else if(/.*Flash/.test(name)) {            
            return name + " " + PluginDetect.getVersion('Flash').replace(/,/g, '.');
        } else if(/.*QuickTime.*/.test(name)) {            
            return "QuickTime Plug-in " + PluginDetect.getVersion('QuickTime').replace(/,/g, '.');        
        } else {            
            return false;
        }
    },    
    /**
     * Cleans up the navigator.plugins object into a list of plugin2mimeTypes
     * Each plugin2mimeTypes has two fields
     * * plugins - the plugin Description including Version information if available
     * * mimes - An array of mime types
     * * classified - Do we know the plugins status from pfs2
     * * raw - A reference to origional navigator.plugins object
     * Eample: [{plugin: "QuickTime Plug-in 7.6.2", mimes: ["image/tiff', "image/jpeg"], classified: false, raw: {...}}]
     *
     * Cleanup includes
     * * filtering out *always* up to date plugins
     * * Special handling of plugin names for well known plugins like Java
     * 
     * @param plugins {object} The window.navigator.plugins object
     * @returns {array} A list of plugin2mimeTypes
     */
    browserPlugins: function(plugins) {
        var p = [];
        for (var i=0; i < plugins.length; i++) {
            var pluginInfo;
            if (this.shouldSkipPluginNamed(plugins[i].name)) {
                continue;
            }
            var hook = this.pluginNameHook(plugins[i].name);
            if (hook !== false) {
                pluginInfo = hook;
            } else {
                
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
            }
            var mimes = [];
            var marcelMrceau = this.createMasterMime(); /* I hate mimes */
            for (var j=0; j < plugins[i].length; j++) {
                var mimeType = plugins[i][j].type;
                if (mimeType) {
                    var m = marcelMrceau.normalize(mimeType);
                    if (marcelMrceau.seen[m] === undefined) {
                        marcelMrceau.seen[m] = true;
                        mimes.push(m);
                    } 
                }            
            }            
            var mimeValues = [];
            if (mimes.length > 0) {
                var mimeValue = mimes[0];
                var length = mimeValue.length;
                for (var j=1; j < mimes.length; j++) {
                    length += mimes[j].length;
                    mimeValue += " " + mimes[j]; //TODO let JSON request url encode, or do it here?
                    if (length > Pfs.MAX_MIMES_LENGTH &&
                        (i + 1) < mimes.length) {                        
                        mimeValues.push(mimeValue);
                        //reset
                        mimeValue = mimes[i + 1];
                        length = mimeValue.length;
                    }
                }
                mimeValues.push(mimeValue);
            }            
            p.push({plugin: pluginInfo, mimes: mimeValues, classified: false, raw: plugins[i]});
        }
        
        return p;
    },
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
    VULNERABLE: "vulnerable",
    createFinder: function(callbackFn) {
        return {
            // A list of plugin2mimeTypes
            findPluginQueue: [],
            // A plugin2mimeTypes
            currentPlugin: null,
            currentMime: -1,
            // A list of plugin2mimeTypes
            currentPlugins: [],
            // A list of plugin2mimeTypes
            outdatedPlugins: [],
            // A list of plugin2mimeTypes
            vulnerablePlugins: [],
            // A list of plugin2mimeTypes
            shouldDisablePlugins: [],
            // A list of plugin2mimeTypes
            unknownPlugins: [],
           /**
            * The user supplied callback for when finding plugin information is complete
            * function(current, outdated, vulnerable, disableNow, unknown){ }
            */
            finishedFn: callbackFn,
            startFindingNextPlugin: function() {
                //Note unknown plugins before we start the next one
                if (this.findPluginQueue.length > 0) {
                    this.currentPlugin = this.findPluginQueue.pop();
                    this.currentMime = 0;
                    
                    this.findPluginInfo();
                } else {
                    this.finishedFn(this.currentPlugins, this.outdatedPlugins,
                                    this.vulnerablePlugins, this.shouldDisablePlugins,
                                    this.unknownPlugins);
                }
            },
            findPluginInfo: function() {
                var mime = this.currentPlugin.mimes[this.currentMime];
                    
                var that = this;
                this.callPfs2(mime, function(){ that.pfs2Success.apply(that, arguments);},                                
                                    function(){ that.pfs2Error.apply(that, arguments);});  
            },
            /************* PFS2 below *************/
            callPfs2: function(mimeType, successFn, errorFn) {
                if (Pfs.endpoint == "error set me before using") {
                    if (window.console) {console.error("You must configure Pfs.endpoint before using this library");}
                    return false;
                }
                //var mimeType = "application/x-shockwave-flash";
                var url = Pfs.endpoint + "/?appID={ec8030f7-c20a-464f-9b0e-13a3a9e97384}&mimetype=" +
                            mimeType + "&appVersion=2008052906&appRelease=3.0&clientOS=Windows%20NT%205.1&chromeLocale=en-US";                
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: successFn,
                    error: errorFn
                });
                return true;
            },            
            
            startFindingNextMimetypeOnCurrentPlugin: function() {
                this.currentMime += 1;
                if (this.currentMime < this.currentPlugin.mimes.length) {
                    this.findPluginInfo();
                } else {
                    if (window.console) {console.warn("Exhausted Mime-Types...");}
                    if (this.currentPlugin !== null &&
                        ! this.currentPlugin.classified) {
                        this.unknownPlugins.push(this.currentPlugin);
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
                            if (window.console) { window.console.error("Malformed PFS2 plugin info, no aliases"); }
                            break;
                    }
                    if (! pfsInfo.releases ||
                        ! pfsInfo.releases.latest) {
                            if (window.console) { window.console.error("Malformed PFS2 plugin info, no latest release"); }
                            break;
                    }
                    // Is pfsInfo the plugin we seek?
                    var searchingPluginInfo = true;
                    if (pfsInfo.aliases.literal) {
                        for(var j=0; searchingPluginInfo && j < pfsInfo.aliases.literal.length; j++) {
                            var litName = pfsInfo.aliases.literal[j];
                            if (currentPluginName == litName) {
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
                                    if (window.console) {console.info("Weird, we are newer", this.currentPlugin.plugin, pfsInfo.releases.latest);}
                                    this.classifyAsUpToDate(this.currentPlugin);    
                                    searchPluginRelease = false;
                                    break;
                                case 0:                                    
                                    if (pfsInfo.releases.latest.status == Pfs.VULNERABLE) {
                                        this.classifyAsUpToDateAndVulnerable(this.currentPlugin);
                                    } else {
                                        this.classifyAsUpToDate(this.currentPlugin);    
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
                        
                        if (searchPluginRelease && pfsInfo.releases.others) {
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
                                            this.classifyAsVulnerable(this.currentPlugin);
                                        } else {
                                            this.classifyAsOutOfDate(this.currentPlugin);    
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
                                //TODO Are unknown plugins implicit or explicit? If explicit, when do we create the list?
                    
                            }
                            if (this.currentPlugin.classified !== true) {
                                // Sparse matrix of version numbers...
                                // we know about 1.0.1 and 1.0.3 in db and this browser has 1.0.2, etc                        
                                this.classifyAsOutOfDate(this.currentPlugin);
                            }
                        }
                    } 
                    
                }//for over the pfs2 JSON data
                if (pluginMatch) {
                    searchingResults = false;
                    
                    this.startFindingNextPlugin();    
                } else {
                    //none of the plugins for this mime-type were a match... try the next mime-type
                    this.startFindingNextMimetypeOnCurrentPlugin();
                }
            },
            pfs2Error: function(xhr, textStatus, errorThrown){
                if (window.console) {console.error("Doh failed on mime/plugin ", this.currentPlugin.mimes[this.currentMime], this.currentPlugin) };
            },
            classifyAsUpToDateAndVulnerable: function(plugin2mimeTypes, releaseStatus) {
                plugin2mimeTypes.classified = true;
                this.shouldDisablePlugins.push(plugin2mimeTypes);        
            },
            classifyAsUpToDate: function(plugin2mimeTypes, releaseStatus) {
                plugin2mimeTypes.classified = true;
                this.currentPlugins.push(plugin2mimeTypes);        
            },
            classifyAsOutOfDate: function(plugin2mimeTypes) {
                plugin2mimeTypes.classified = true;
                this.outdatedPlugins.push(plugin2mimeTypes);
            },
            classifyAsVulnerable: function(plugin2mimeTypes) {
                plugin2mimeTypes.classified = true;
                this.vulnerablePlugins.push(plugin2mimeTypes);
            }
        };
    },
    findPluginInfos: function(pluginInfos, callbackFn) {
        var finderState = this.createFinder(callbackFn);
        
        // Walk through the plugins and get the metadata from PFS2
        // PFS2 is JSONP and can't be called async using jQuery.ajax
        // We'll create a queue and manage our requests
        for(var i=0; i< pluginInfos.length; i++) {
            finderState.findPluginQueue.push(pluginInfos[i]);
        }
        finderState.startFindingNextPlugin();
    },
    /**
     * PFS2 supports loading plugin data that is encoded in
     * JSON files. This function can be used to export a plugin
     * to serve as a template for that service.
     * 
     * @param plugin {object} A plugin
     * @returns {string} The JSON dump of the plugin
     */
    dumpPlugin2Pfs2: function(plugin) {
        var info = { "meta": { "pfs_id": "", "vendor": "", "name": "", "platform": { "app_id": "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}" }, 
                               "url": "", "manual_installation_url": "", "version": "",  "license_url": "", "installer_shows_ui": ""}, 
                     "releases": [{ "guid": "", "license_url": "", "os_name": "", "xpi_location": "" }], 
                     "mimes": []};
        var addMime = function (suffix, name, description) {
            suffix = suffix ? suffix : "";            
            name = name ? name : "";
            description = description ? description : "" ;
            return {"suffixes": suffix, "name": name,"description": description};
        }
        if (plugin.description) {            
            info.description = plugin.description;
        }
        if (plugin.name) {info.meta.name = plugin.name;}
        
        var rawVersion;
        if (plugin.name && this.hasVersionInfo(plugin.name)) {
            rawVersion = plugin.name;
        } else if (plugin.description && this.hasVersionInfo(plugin.description)) {
            rawVersion = plugin.description;
        }
        if (rawVersion) {
            var hook = this.pluginNameHook(plugin.name);
            if (hook !== false) {
                rawVersion = hook;
            }
            info.meta.version = this.parseVersion(rawVersion).join('.');    
        }
        
        if (navigator.oscpu){info.releases[0].os_name =  this.pluginOsName2Pfs2OsName(navigator.oscpu);}
        for (var i=0; i < plugin.length; i++) {
            var mime = plugin[i];
            if (mime) {
                info.mimes[info.mimes.length] = addMime(mime.suffixes, mime.type, mime.description);
            }
        }
        return JSON.stringify(info);
    },
    pluginOsName2Pfs2OsName: function(osCpu) {
        if (/Mac OS X/.test(osCpu)) {
            return "mac";
        // return win
        } else if (/Linux/.test(osCpu)) {
            return "lin";
        } else {
            return "unknown";
        }
    }
};
