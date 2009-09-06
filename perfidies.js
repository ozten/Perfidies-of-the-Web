/**
   perfidies.js
  There are two layers - The UI and the PFS2 API
  
  This file will (evetually) only host the PFS API. Other JS files will host
  the MoCo whatsnew UI, the SFx Up Your Plug Badges, etc
  @author ozten
*/
var Pfs = {
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
    shouldSkipPluginNamed: function(name) {
        this.skipPluginsNamed.indexOf(name) >= 0
    },
    hasPluginNameHook: function(name) {
        return /Java.*/.test(name);
    },
    doPluginNameHook: function(name) {
        return "Java " + PluginDetect.getVersion('Java', 'getJavaInfo.jar').replace(/,/g, '.').replace(/_/g, '.');
    },
    /**
     * Cleans up the navigator.plugins object into a list of plugin2mimeTypes
     * Each plugin2mimeTypes has two fields
     * * plugins - the plugin Description including Version information if available
     * * mimes - An array of mime types
     * * classified - Do we know the plugins status from pfs2
     * Eample: [{plugin: "QuickTime Plug-in 7.6.2", mimes: ["image/tiff', "image/jpeg"], classified: false}]
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
            } else if (this.hasPluginNameHook(plugins[i].name)) {
                pluginInfo = this.doPluginNameHook(plugins[i].name);
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
            for (var j=0; j < plugins[i].length; j++) {
                var mimeType = plugins[i][j].type;
                if (mimeType) {
                    mimes.push(mimeType);                    
                }                
            }
            
            p.push({plugin: pluginInfo, mimes: mimes, classified: false});
        }
        
        return p;
    },
    
    /************* PFS2 below *************/
    callPfs2: function(mimeType, successFn, errorFn) {
        //var mimeType = "application/x-shockwave-flash";
	    var endpoint = "http://pfs2.ubuntu/?appID={ec8030f7-c20a-464f-9b0e-13a3a9e97384}&mimetype=" +
		            mimeType + "&appVersion=2008052906&appRelease=3.0&clientOS=Windows%20NT%205.1&chromeLocale=en-US";
        $.ajax({
            url: endpoint,
            dataType: "jsonp",
            success: successFn,
            error: errorFn
        });
    },
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
    unknownPlugins: [],
    /**
     * The user supplied callback for when finding plugin information is complete
     */
    finishedFn: function(current, outdated, vulnerable, unknown){ },
    findPluginInfos: function(pluginInfos, callbackFn) {
        this.finishedFn = callbackFn;
        // Walk through the plugins and get the metadata from PFS2
        // PFS2 is JSONP and can't be called async using jQuery.ajax
        // We'll create a queue and manage our requests
        for(var i=0; i< pluginInfos.length; i++) {
            this.findPluginQueue.push(pluginInfos[i]);
        }
        this.startFindingNextPlugin();
    },
    startFindingNextPlugin: function() {
        //Note unknown plugins before we start the next one
        if (this.currentPlugin !== null &&
            ! this.currentPlugin.classified) {
            this.unknownPlugins.push(this.currentPlugin);
        }
        if (this.findPluginQueue.length > 0) {
            this.currentPlugin = this.findPluginQueue.pop();
            this.currentMime = 0;
            
            this.findPluginInfo();
        } else {
            this.finishedFn(this.currentPlugins, this.outdatedPlugins, this.vulnerablePlugins, this.unknownPlugins);
        }
    },
    findPluginInfo: function() {
        var mime = this.currentPlugin.mimes[this.currentMime];
            
        var that = this;
        this.callPfs2(mime, function(){ that.pfs2Success.apply(that, arguments);},
                            function(){ that.pfs2Error.apply(that, arguments);});  
    },
    startFindingNextMimetypeOnCurrentPlugin: function() {
        this.currentMime += 1;
        if (this.currentMime < this.currentPlugin.mimes.length) {
            this.findPluginInfo();
        } else {
            if (window.console) { console.warn("Exhausted Mime-Types..."); }
            //TODO Add plugin to unknown
            this.startFindingNextPlugin();
        }
    },
    pfs2Success: function(data, status){
        window.d = data;
        if (data.length > 0) {
            var pluginMatch = false;
            var pluginInfo;
            for (var i=0; i < data.length; i++) {
                console.info("Trying to match----", this.currentPlugin.plugin, "---", data[i].name);
                if (this.currentPlugin.plugin.toLowerCase().indexOf(data[i].name.toLowerCase()) >= 0) {
                    pluginMatch = true;
                    pluginInfo = data[i];
                    break;
                }
            }
            
            if (pluginMatch) {
                //TODO Are unknown plugins implicit or explicit? If explicit, when do we create the list?
                this.classifyPlugin(pluginInfo, this.currentPlugin);
                this.startFindingNextPlugin();    
            } else {
                //none of the plugins for this mime-type were a match... try the next mime-type
                this.startFindingNextMimetypeOnCurrentPlugin();
            }
            
        } else {
            if (window.console) { console.info("Unknown mime type:", this.currentPlugin.mimes[this.currentMime], this.currentPlugin) };
            this.startFindingNextMimetypeOnCurrentPlugin();
        }
    },
    pfs2Error: function(xhr, textStatus, errorThrown){
        if (window.console) { console.error("Doh failed on mime/plugin ", this.currentPlugin.mimes[this.currentMime], this.currentPlugin) };
    },
    classifyPlugin: function(pluginInfo, plugin2mimeTypes) {
        console.info("classifyPlugin", pluginInfo, plugin2mimeTypes);
        if (this.compVersion(pluginInfo.version, plugin2mimeTypes.plugin) > 0) {
            if (window.console) { console.warn("newer, weird", pluginInfo.name, "----", plugin2mimeTypes.plugin); }
            this.currentPlugins.push(plugin2mimeTypes);
        } else if(this.compVersion(pluginInfo.name, plugin2mimeTypes.plugin) == 0){
            this.currentPlugins.push(plugin2mimeTypes);
        } else {
            this.outdatedPlugins.push(plugin2mimeTypes);
        }
        plugin2mimeTypes.classified = true;
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
}