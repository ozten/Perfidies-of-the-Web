/**
 * UI code for http://mozilla.com/en-US/plugincheck/
 */
if (window.Pfs === undefined) { window.Pfs = {}; }
Pfs.UI = {
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
        for (var i=0; i < plugins.length; i++) {
            var pluginInfo;
            if (Pfs.shouldSkipPluginNamed(plugins[i].name)) {
                continue;
            }
            var hook = Pfs.pluginNameHook(plugins[i].name);
            if (hook !== false) {
                pluginInfo = hook;
            } else {
                
                if (plugins[i].name && Pfs.hasVersionInfo(plugins[i].name)) {
                    pluginInfo = plugins[i].name;
                } else if (plugins[i].description && Pfs.hasVersionInfo(plugins[i].description)) {
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
        }
        
        return p;
    },
};
$(document).ready(function(){
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
    var states = {
                  vul: {c:"orange", l:"Update Now", s:"Vulnerable"},
                  dis: {c:"orange", l:"Disable Now", s:"Vulnerable No Fix"},
                  out: {c:"yellow", l:"Update", s:"Potentially Vulnerable"},
                  cur: {c:"green", l:"Learn More", s:"You're Safe"}};
    
    var displayPlugins = function(pInfos, status, rowCount) {
        for(var index=0; index < pInfos.length; index++) {            
            var plugin = pInfos[index].raw;
            var html = $('#plugin-template').clone();            
            var rowClass;
            
            if ((index + rowCount) % 2 == 0) {
                rowClass = 'odd';
            } else {
                rowClass = 'even';
            }
            html.addClass(rowClass);
            
            $('.name', html).text(plugin.name);
            $('.version', html).html(plugin.description);
            $('.icon', html).attr('src', iconFor(plugin.name));
            
            $('.status', html).text(status.s);
            if (status == states.unk) {
                $('.action', html).html('');
            } else {                
                $('.action a', html).addClass(status.c);
                $('.action a span', html).text(status.l);
                    
            }
            
            $('#plugin-template').parent().append(html);
            html.show();            
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
    var reportPlugins = function(pInfos, status) {
        //TODO should pInfos have a version
        //Or should the client library have a case 'newer than'?
        if (status == "newer") {
            if (window.console) {console.info("Weird, we are newer", pInfos);}    
        } else {
            if (window.console) {console.info("Report: ", status, pInfos);}    
        }
        
        for(var i=0; i < pInfos.length; i++) {
            var plugin = pInfos[i].raw;
            if (plugin) {
                $.ajax({
                    url: Pfs.endpoint + status + "_plugin.gif",
                    data: {name: plugin.name, description: plugin.description}
                });
            }
        }        
    }
    Pfs.reportPluginsFn = reportPlugins;
    
    var browserPlugins = Pfs.UI.browserPlugins(navigator.plugins);
    Pfs.findPluginInfos(Pfs.UI.browserInfo(), browserPlugins, function(current, outdated, vulnerable, disableNow, unknown){        
        var total = 0;
        displayPlugins(disableNow, states.dis, total);
        total += disableNow.length;
        
        displayPlugins(vulnerable, states.vul, total);
        total += vulnerable.length;
        
        displayPlugins(outdated, states.out, total);
        total += outdated.length;
        
        displayPlugins(current, states.cur, total);
        total += current.length;
        
        reportPlugins(unknown, 'unknown');
        
        $('.view-all-toggle').html("<a href='#'>View All Your Plugins</a>");
        var worstCount = 0;
        
        var worstStatus = undefined;
        if (disableNow.length > 0) {
            worstCount = disableNow.length;
            worstStatus = "vulnerable wih no update available";
        } else if (vulnerable.length > 0) {
            worstCount = vulnerable.length;
            worstStatus = "vulnerable";
        } else if (outdated.length > 0) {
            worstCount = outdated.length;
            worstStatus = "potentially vulnerable";
        }
        if (worstStatus !== undefined) {
            $('#pfs-status').html(worstCount + " of " + total + " plugins are " + worstStatus)
                            .addClass('vulnerable');
        }
    });    
});