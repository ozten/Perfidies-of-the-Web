/**
 * UI code for http://mozilla.com/en-US/plugincheck/
 */
if (window.Pfs === undefined) { window.Pfs = {}; }
Pfs.UI = {
    MAX_VISIBLE: 5,
    /**
     * Creates a navigatorInfo object from the browser's navigator object
     */
    browserInfo: function() {
        var parts = navigator.userAgent.split('/');
        var version = parts.length > 1 ? parts[parts.length - 1] : parts[0];
        return {
            appID: '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}',
            appRelease: version,
            appVersion: navigator.buildID,
            clientOS: navigator.oscpu,
            chromeLocale: 'en-US'            
        }
    },
    /**
     * Cleans up the navigator.plugins object into a list of plugin2mimeTypes
     * 
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
     * @param plugins {object} The window.navigator.plugins object
     * @returns {array} A list of plugin2mimeTypes
     */
    browserPlugins: function(plugins) {
        var p = [];
        var pluginsSeen = [];
        for (var i=0; i < plugins.length; i++) {
            
            if (Pfs.shouldSkipPluginNamed(plugins[i].name) ||
                pluginsSeen.indexOf(plugins[i].name) >= 0) {
                continue;
            }
            var pluginInfo = Pfs.UI.namePlusVersion(plugins[i].name, plugins[i].description);
            
            var mimes = [];
            var marcelMrceau = Pfs.createMasterMime(); /* I hate mimes */
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
            if (plugins[i].name) {
                // Bug#519256 - guard against duplicate plugins
                pluginsSeen.push(plugins[i].name);    
            }
            
        }
        
        return p;
    },
    /**
     * @private
     */
    hasVersionInfo: function(versionedName) {
        if (versionedName) {
            return Pfs.parseVersion(versionedName).length > 0;
        } else {
            return false;
        }
    },
    /**
     * Given a name and description, returns the name and version
     * of the plugin. This may include special handeling
     * for known plugins using the PluginDetect or other hooks.
     *
     * This function can be used to format the version property of the
     * pluginMetadata object
     * 
     * @public
     * @ui - PluginDetect dependency belongs in UI, as well as hasVerison
     *       It's not so much a name hook as override version detection
     * @returns {string} - The name of the plugin, it may be enhanced via PluginDetect or other hooks
     */
    namePlusVersion: function(name, description) {
        if (/Java.*/.test(name)) {
            var j =  PluginDetect.getVersion('Java', 'getJavaInfo.jar');
            if (j !== null) {
                return "Java Embedding Plugin " + j.replace(/,/g, '.').replace(/_/g, '.');        
            } else {
                return name;
            }
        } else if(/.*Flash/.test(name)) {
            var f = PluginDetect.getVersion('Flash');
            if (f !== null) {
                return name + " " + f.replace(/,/g, '.');    
            } else {
                return name;
            }
        } else if(/.*QuickTime.*/.test(name)) {
            var q = PluginDetect.getVersion('QuickTime');
            if (q !== null) {
                return "QuickTime Plug-in " + q.replace(/,/g, '.');            
            } else {
                return name;
            }
        } else {
            // General case
            if (name && this.hasVersionInfo(name)) {                
                return name;
            } else if (description && this.hasVersionInfo(description)) {                
                return description;
            } else {
                
                if (name) {
                    return name;
                } else {
                    return description;
                }
            }
        }
    },
};
(function(){
    
    var icons = {
        flash:     "/img/tignish/plugincheck/icon-flash.png",
        java:      "/img/tignish/plugincheck/icon-java.png",
        quicktime: "/img/tignish/plugincheck/icon-quicktime.png",
        divx: "/img/tignish/plugincheck/icon-divx.png",
        generic: "/img/tignish/plugincheck/icon-flip.png"
    };
    var iconFor = function(pluginName) {
        if (pluginName.indexOf("Flash") >= 0) {
            return icons.flash;
        } else if (pluginName.indexOf("Java") >= 0) {
            return icons.java;
        } else if (pluginName.indexOf("QuickTime") >= 0) {
            return icons.quicktime;
        } else if(pluginName.indexOf("DivX") >= 0) {
            return icons.divx;
        } else {
            return icons.generic;
        }
    };
    
    $('#pfs-status').html("Checking with Mozilla HQ to check your plugins <img class='progress' src='/img/tignish/plugincheck/ajax-loader.gif' alt='Loading Data' />");
    var states = {};
    states[Pfs.VULNERABLE] = {c:"orange", l:"Update Now",  s:"Vulnerable",             code: Pfs.VULNERABLE};
    states[Pfs.DISABLE] =    {c:"orange", l:"Disable Now", s:"Vulnerable No Fix",      code: Pfs.DISABLE};
    states[Pfs.OUTDATED] =   {c:"yellow", l:"Update",      s:"Potentially Vulnerable", code: Pfs.OUTDATED};
    states[Pfs.CURRENT] =    {c:"green",  l:"Learn More",  s:"You're Safe",            code: Pfs.CURRENT};
    
    var reportPlugins = function(pInfo, status) {
        //TODO should pInfos have a version
        //Or should the client library have a case 'newer than'?
        if (status == Pfs.NEWER) {
            if (window.console) {console.info("Report Weird, we are newer", pInfo);}    
        } else {
            if (window.console) {console.info("Report Unkown: ", status, pInfo);}    
        }
        
        
        var plugin = pInfo.raw;
        if (plugin) {
            $.ajax({
                url: Pfs.endpoint + status + "_plugin.gif",
                data: {name: plugin.name, description: plugin.description}
            });
        }
            
    }
    Pfs.reportPluginsFn = reportPlugins;
    var updateDisplayId = undefined;
    var showAll = false;
    var updateDisplay = function() {
        if (updateDisplayId !== undefined) {
            var criticalPlugins = $('tr.plugin.' + Pfs.DISABLE).add('tr.plugin.' + Pfs.VULNERABLE).add('tr.plugin.' + Pfs.OUTDATED);
            criticalPlugins.show();
            if (showAll == false && criticalPlugins.size() > Pfs.UI.MAX_VISIBLE) {
                $('tr.plugin.' + Pfs.CURRENT).hide();
            }
            $('tr.plugin').removeClass('odd')
                          .filter(':visible')
                          .filter(':odd')
                          .addClass('odd');
            
            updateDisplayId = undefined;
        }
    }
    var addBySorting = function(el, status) {        
        if (Pfs.DISABLE == status) {
            //worst
            var r = $('tr.plugin.' + Pfs.DISABLE + ':first').before(el).size();
            if (r == 0) {
                // no disabled yet, go before any other plugin
                r = $('tr.plugin:first').before(el).size();
                if (r == 0) {
                    //no other plugins, be the first plugin
                    $('#plugin-template').parent().append(el);
                }
            }
        } else if(Pfs.VULNERABLE == status) {
            //bad
            var r = $('tr.plugin.' + Pfs.DISABLE + ':last').after(el).size();
            if (r == 0) {
                // no disabled yet, go before any other vulnerable plugin
                r = $('tr.plugin.' + Pfs.VULNERABLE + ':first').before(el).size();
                if (r == 0) {
                    // no vulnerable yet, go before any other outdated plugin
                    r = $('tr.plugin.' + Pfs.OUTDATED + ':first').before(el).size();
                    if (r==0) {
                        // no outdated yet, go before all others
                        var r = $('tr.plugin:first').before(el).size();
                        if (r == 0) {
                            //no other plugins, be the first plugin
                            $('#plugin-template').parent().append(el);                
                        }
                    }
                    
                }
            }
        } else if(Pfs.OUTDATED == status) {
            //meh
            var r = $('tr.plugin.' + Pfs.OUTDATED + ':first').before(el).size();
            if (r == 0) {
                var r = $('tr.plugin.' + Pfs.CURRENT + ':first').before(el).size();
                if (r == 0) {
                    r = $('tr.plugin:last').after(el).size();
                    if (r == 0) {
                        //no other plugins, be the first plugin
                        $('#plugin-template').parent().append(el);
                    }
                }
            }
        } else if(Pfs.CURRENT == status) {
            //best
            var r = $('tr.plugin:last').after(el).size();
            if (r == 0) {
                //no other plugins, be the first plugin
                $('#plugin-template').parent().append(el);                
            }        
        } else {
            if (window.console) {console.error("Sorting to display, unknown status", status);}
        }
        if (updateDisplayId === undefined) {
            updateDisplayId = setTimeout(updateDisplay, 300);
        }
    }
    var displayPlugins = function(plugin, statusCopy, url, rowCount) {
        
        var html = $('#plugin-template').clone();
        html.removeAttr('id')
            .addClass('plugin')
            .addClass(statusCopy.code);
        var rowClass;
        
        if (rowCount % 2 == 0) {
            html.addClass('odd');            
        }        
        
        $('.name', html).text(plugin.name);
        $('.version', html).html(plugin.description);
        $('.icon', html).attr('src', iconFor(plugin.name));
        
        $('.status', html).text(statusCopy.s);
        //TODO delete we don't show unknown
        if (statusCopy == states.unk) {
            $('.action', html).html('');
        } else {
            
            $('.action a', html).addClass(statusCopy.c);
            $('.action a span', html).text(statusCopy.l);
            if (url !== undefined) {
                $('.action a', html).attr('href', url);                
            }            
        }
        
        addBySorting(html, statusCopy.code);
        
        if (Pfs.UI.MAX_VISIBLE > total) {
            html.show();                
        }        
        if (true) {
        /*<tr id="plugin-template" class="odd" style="display: none">
                    <td>
                        <img class="icon" src="/img/tignish/plugincheck/icon-divx.png" alt="DivX Icon" />
                        <h4 class="name">DivX</h4><span class="version">6.0, DivX, Inc.</span>
                    </td>
                    <td class="status">Vulnerable</td>
                    <td class="action"><a class="orange button"><span>Update Now</span></a></td>
                </tr>*/
        }
    }
    
    var browserPlugins = Pfs.UI.browserPlugins(navigator.plugins);
    /* track plugins in the UI */
    var total = 0; var disabled = 0; var vulnerables = 0; var outdated = 0;
    /**
     * incremental callback function
     */
    var incrementalCallbackFn = function(data){
        if (data.status == Pfs.UNKNOWN) {
            //ping the server
            reportPlugins(data.pluginInfo, Pfs.UNKNOWN);
        } else {
            if (data.status == Pfs.NEWER) {
                //ping the server and then treat as current
                reportPlugins(data.pluginInfo, Pfs.NEWER);
                data.status = Pfs.CURRENT;
            }
            if (states[data.status]) {
                switch (data.status) {
                    case Pfs.DISABLE:
                        disabled++;
                        // Anchor tag for instructions on how to disable a plugin
                        url = "#disable";
                        break;
                    case Pfs.VULNERABLE:
                        vulnerables++;
                        break;
                    case Pfs.OUTDATED:
                        outdated++;
                        break;
                }
                var copy = states[data.status];
                var plugin = data.pluginInfo.raw;                
                displayPlugins(plugin, copy, data.url, total);
                total++;
                
            } else {
                if (window.console) {console.error("We have an unknown status code when displaying UI.", data);}
            }
        }
    };
    var finishedCallbackFn = function(){        
        //manualTestingFakeOutput();
        
        var worstCount = 0;
        
        var worstStatus = undefined;
        if (disabled > 0) {
            worstCount = disabled;
            worstStatus = "vulnerable wih no update available";
        } else if (vulnerables > 0) {
            worstCount = vulnerables;
            worstStatus = "vulnerable";
        } else if (outdated > 0) {
            worstCount = outdated;
            worstStatus = "potentially vulnerable";
        }
        
        if (worstStatus !== undefined) {
            $('#pfs-status').html(worstCount + " of " + total + " plugins are " + worstStatus)
                            .addClass('vulnerable');
        }        
        if ($('.plugin:hidden').size() > 0) {
            $('.view-all-toggle').html("<a href='#'>View All Your Plugins</a>").click(function(){
                if (updateDisplayId === undefined) {
                    updateDisplayId = setTimeout(updateDisplay, 300);
                }
                showAll = true;
                $('tr.plugin:hidden').show();
                $('.view-all-toggle').remove();
                return false;    
            });    
        }
            
    };
    //Used in regression testing
    Pfs.UI.displayPlugin = incrementalCallbackFn;
    
    window.checkPlugins = function(endpoint) {
        Pfs.endpoint = endpoint;
        Pfs.findPluginInfos(Pfs.UI.browserInfo(), browserPlugins, incrementalCallbackFn, finishedCallbackFn);
    }
})();