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

/*jslint browser: true, plusplus: false */
/*global Pfs, PluginDetect, BrowserDetect, window*/
// jslint that we should fix below
/*jslint eqeqeq: false*/
if (window.Pfs === undefined) {
    window.Pfs = {};
}

/**
 * Common JS for getting browsers ready for using PFS
 * via a web page.
 */
Pfs.UI = {
    unknownVersionPlugins: [],
    /**
     * Creates a navigatorInfo object from the browser's navigator object
     */
    browserInfo: function () {
        var detected = BrowserDetect.detect(),
            appID;

        if ('Firefox' === detected.browser || 'Minefield' === detected.browser) {
            appID = '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}';
        } else {
            // TODO: More appIDs here?
            appID = detected.browser;
        }
        if ('Explorer' === detected.browser) {
	    // Two issues with BrowserDetect 
	    // 1) 7.0; and 8.0; get rid of ';'
            // 2) detected.build is currently '???', give it something decent
            detected.version = '' + parseFloat(detected.version, 10);
            detected.build = detected.version;
	    }
        // TODO IEBug navigator.language is undefined, fallback to IE specific browserLanguage
        return {
            appID:        appID,
            appRelease:   detected.version,
            appVersion:   detected.build,
            clientOS:     navigator.oscpu || navigator.platform,
            chromeLocale: navigator.language || navigator.browserLanguage || 'en-US'
        };
    },
    inList: function (pluginsSeen, name) {
        // IEBug
        if (pluginsSeen.indexOf) {
            return pluginsSeen.indexOf(name) >= 0;
        } else {
            return pluginsSeen.join(', ').indexOf(name) >= 0;
        }        
    },
    /**
     * Cleans up the navigator.plugins object into a list of plugin2mimeTypes
     * 
     * Each plugin2mimeTypes has two fields
     * * plugin - the plugin Description including Version information if available
     * * mimes - An array of mime types
     * * classified - Do we know the plugins status from pfs2
     * * raw - A reference to origional navigator.plugins object
     * Eample: [{plugin: "QuickTime Plug-in 7.6.2", detection_type: "original", mimes: ["image/tiff', "image/jpeg"], classified: false, raw: {...}}]
     *
     * Cleanup includes
     * * filtering out *always* up to date plugins
     * * Special handling of plugin names for well known plugins like Java
     * @param plugins {object} The window.navigator.plugins object
     * @returns {array} A list of plugin2mimeTypes
     */
    browserPlugins: function (plugins) {
        var p = [];
        var pluginsSeen = [];
        for (var i = 0; i < plugins.length; i++) {
            var pluginInfo;
            var rawPlugin = plugins[i];
            if (Pfs.shouldSkipPluginNamed(plugins[i].name) ||
                this.shouldSkipPluginFileNamed(plugins[i].filename) ||
                Pfs.UI.inList(pluginsSeen, plugins[i].name)) {
                continue;
            }
            // Linux Totem acts like QuickTime, DivX, VLC, etc Bug#520041
            if (plugins[i].filename == "libtotem-cone-plugin.so") {
                rawPlugin = {
                    name: "Totem",
                    description: plugins[i].description,
                    length: plugins[i].length,
                    filename: plugins[i].filename
                };
                for (var m = 0; m < plugins[i].length; m++) {
                    rawPlugin[m] = plugins[i][m];
                }                
            }
            var mimes = [];
            var marcelMrceau = Pfs.createMasterMime(); /* I hate mimes */
            for (var j = 0; j < rawPlugin.length; j++) {
                var mimeType = rawPlugin[j].type;
                if (mimeType) {
                    var mm = marcelMrceau.normalize(mimeType);
                    if (marcelMrceau.seen[mm] === undefined) {
                        marcelMrceau.seen[mm] = true;
                        mimes.push(mm);
                    } 
                }            
            }
            var wrappedPlugin = Pfs.UI.browserPlugin(rawPlugin, mimes);
            if (Pfs.UI.hasVersionInfo(wrappedPlugin.plugin) === false) {
                Pfs.UI.unknownVersionPlugins.push(rawPlugin);
                continue;
            }
            var mimeValues = [];
            if (mimes.length > 0) {
                var mimeValue = mimes[0];
                var length = mimeValue.length;
                for (var jj = 1; jj < mimes.length; jj++) {
                    length += mimes[jj].length;
                    // mime types are space delimited
                    mimeValue += " " + mimes[jj];
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
            wrappedPlugin.mimes = mimeValues;
            
            p.push(wrappedPlugin);
            
            if (rawPlugin.name) {
                // Bug#519256 - guard against duplicate plugins
                pluginsSeen.push(plugins[i].name);    
            }
            
        }
        
        return p;
    },
    /**
     * A list of well known plugin filenams that are *always* up to date.
     * Totem being DivX, WMP, or QuickTime we'll skip. For 'VLC' Totem see browserPlugins
     * where we rename the plugin to Totem
     * 
     * @private
     */
    skipPluginsFilesNamed: ["libtotem-mully-plugin.so",
                            "libtotem-narrowspace-plugin.so",
                            "libtotem-gmp-plugin.so"],
    shouldSkipPluginFileNamed: function (filename) {
        // IEBug [].indexOf is undefined
        if (this.skipPluginsFilesNamed.indexOf) {
            return this.skipPluginsFilesNamed.indexOf(Pfs.$.trim(filename)) >= 0;    
        } else {
            return this.skipPluginsFilesNamed.join(', ').indexOf(Pfs.$.trim(filename)) >= 0;
        }
    },
    /**
     * @private
     */
    hasVersionInfo: function (versionedName) {
        if (versionedName) {
            return Pfs.parseVersion(versionedName).length > 0;
        } else {
            return false;
        }
    },
    usePinladyDetection: true,
    /**
     * Cleans up a browser's plugin info based on it's
     * name, plugin.version property (Fx 3.6 only), description, 
     * and mime types. Using this info it chooses the
     * best candidate for a version string.
     *
     * This may include special handeling 
     * for known plugins using the PluginDetect or other hooks.
     *
     * lastly it return a new plugin like object suitable for
     * use with findPluginInfos.
     * 
     * @public
     * @ui - PluginDetect dependency belongs in UI, as well as hasVerison
     *       It's not so much a name hook as override version detection
     * @returns {string} - The name of the plugin, it may be enhanced via PluginDetect or other hooks
     */
    browserPlugin: function (rawPlugin, mimes) {
        var newPlugin = {
                plugin: undefined,
                mimes: undefined, // Gets set outside of this function
                detection_type: 'original',
                classified: false,
                raw: rawPlugin
            };
        if (Pfs.UI.usePinladyDetection) {
            if (/Java.*/.test(rawPlugin.name)) {
                //Bug#519823 If we want to start using Applets again
                var j =  PluginDetect.getVersion('Java', 'getJavaInfo.jar', [0, 0, 0]);
                if (j !== null) {
                    newPlugin.plugin = "Java Embedding Plugin " + j.replace(/,/g, '.').replace(/_/g, '.');
                } 
            } else if (/.*Flash/.test(rawPlugin.name)) {
                var f = PluginDetect.getVersion('Flash');
                if (f !== null) {
                    newPlugin.plugin = rawPlugin.name + " " + f.replace(/,/g, '.');    
                }
            } else if (/.*QuickTime.*/.test(rawPlugin.name)) {
                var q = PluginDetect.getVersion('QuickTime');
                if (q !== null) {
                    newPlugin.plugin = "QuickTime Plug-in " + q.replace(/,/g, '.');            
                }
            } else if (/Windows Media Player Plug-in.*/.test(rawPlugin.name)) {
                var w = PluginDetect.getVersion('WindowsMediaPlayer');
                if (w !== null) {
                    newPlugin.plugin = rawPlugin.name + " " + w.replace(/,/g, '.');
                }
            }
            /* Note: Shockwave, DevalVR, Silverlight, and VLC pinlady detection only used in exploder.js
               this is because general version detection works as well w/o instaniating the plugin */
        }
        if (newPlugin.plugin === undefined) {
            // General case
            if (rawPlugin.version !== undefined && this.hasVersionInfo(rawPlugin.version)) {
                // TODO - Note: no name or description... to avoid multiple versions
                // Example: name 'QuickTime Plug-in 7.6.5' versionproperty '7.6.5.0'
                // we'll return only '7.6.5.0'
                newPlugin.plugin = rawPlugin.version;
                newPlugin.detection_type = 'version_available';
            } else if (rawPlugin.name && this.hasVersionInfo(newPlugin.name)) {                
                newPlugin.plugin = rawPlugin.name;
            } else if (rawPlugin.description && this.hasVersionInfo(rawPlugin.description)) {                
                newPlugin.plugin = rawPlugin.description;
            } else {
                if (/.*BrowserPlus.*/.test(rawPlugin.name)) {
                    // Only used for older versions of BrowserPlus
                    var bp = "";
                    if (mimes) {
                        var re_trailing_version = /_([0-9]+\.[0-9]+\.[0-9]+)$/;
                        for (var mime in mimes) {
                            mime = mimes[mime];
                            var r = re_trailing_version.exec(mime);
                            if (r) {
                                bp = r[1];
                                break;
                            }
                        }
                    }
                    bp = name + " " + bp;
                    newPlugin.plugin = bp;
                } else if (rawPlugin.name) {
                    newPlugin.plugin = rawPlugin.name;
                } else {
                    newPlugin.plugin = rawPlugin.description;
                }
            }
        }
        if (newPlugin.plugin === undefined) {
            throw new Error('Assertion Failed', 'Attempting to return from browserPlugin without setting the plugin field with version info.');
        }
        return newPlugin;
    }
};
