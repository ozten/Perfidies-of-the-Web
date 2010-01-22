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

if (window.Pfs === undefined) { window.Pfs = {}; }

/**
 * Common JS for getting browsers ready for using PFS
 * via a web page.
 */
 Pfs.UI = {
    unknownVersionPlugins: [],
    /**
     * Creates a navigatorInfo object from the browser's navigator object
     */
    browserInfo: function() {
        var detected = BrowserDetect.detect(),
            appID, version_detection_scheme;

        if ('Firefox' == detected.browser || 'Minefield' == detected.browser) {
            appID = '{ec8030f7-c20a-464f-9b0e-13a3a9e97384}';
        } else {
            // TODO: More appIDs here?
            appID = detected.browser;
        }

        // TODO: invent more schemes here, eg. Firefox 3.6 has plugin versions
        version_detection_scheme = 'original';

        return {
            appID:        appID,
            appRelease:   detected.version,
            appVersion:   detected.build,
            clientOS:     navigator.oscpu || navigator.platform,
            chromeLocale: navigator.language,
            detection:    version_detection_scheme
        };
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
            var pluginInfo;
            var rawPlugin = plugins[i];
            if (Pfs.shouldSkipPluginNamed(plugins[i].name) ||
                this.shouldSkipPluginFileNamed(plugins[i].filename) ||
                pluginsSeen.indexOf(plugins[i].name) >= 0) {
                continue;
            }
            // Linux Totem acts like QuickTime, DivX, VLC, etc Bug#520041
            if (plugins[i].filename == "libtotem-cone-plugin.so") {
                rawPlugin = {
                    name:"Totem", description: plugins[i].description,
                    length: plugins[i].length,
                    filename: plugins[i].filename
                };
                for (var m=0; m < plugins[i].length; m++) {
                    rawPlugin[m] = plugins[i][m];
                }                
            }
            var mimes = [];
            var marcelMrceau = Pfs.createMasterMime(); /* I hate mimes */
            for (var j=0; j < rawPlugin.length; j++) {
                var mimeType = rawPlugin[j].type;
                if (mimeType) {
                    var m = marcelMrceau.normalize(mimeType);
                    if (marcelMrceau.seen[m] === undefined) {
                        marcelMrceau.seen[m] = true;
                        mimes.push(m);
                    } 
                }            
            }            
            pluginInfo = Pfs.UI.namePlusVersion(rawPlugin.name, rawPlugin.description, mimes);            
            if (Pfs.UI.hasVersionInfo(pluginInfo) === false) {
                Pfs.UI.unknownVersionPlugins.push(rawPlugin);
                continue;
            }
            var mimeValues = [];
            if (mimes.length > 0) {
                var mimeValue = mimes[0];
                var length = mimeValue.length;
                for (var j=1; j < mimes.length; j++) {
                    length += mimes[j].length;
                    // mime types are space delimited
                    mimeValue += " " + mimes[j];
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
            p.push({plugin: pluginInfo, mimes: mimeValues, classified: false, raw: rawPlugin});
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
    shouldSkipPluginFileNamed: function(filename) {
        return this.skipPluginsFilesNamed.indexOf(Pfs.$.trim(filename)) >= 0;
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
     * Given a name, description, and mime types, returns the name
     * and version * of the plugin. This may include special handeling *
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
    namePlusVersion: function(name, description, mimes) {
        if (/Java.*/.test(name)) {
            //Bug#519823 If we want to start using Applets again
            var j =  PluginDetect.getVersion('Java', 'getJavaInfo.jar', [0, 0, 0]);
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
        } else if(/Windows Media Player Plug-in.*/.test(name)) {
            var q = PluginDetect.getVersion('WindowsMediaPlayer');
            if (q !== null) {
                return name + " " + q.replace(/,/g, '.');            
            } else {
                return name;
            }
        } else if(/.*BrowserPlus.*/.test(name)) {
            var q = "";
            if (mimes) {
                re_trailing_version = /_([0-9]+\.[0-9]+\.[0-9]+)$/;
                for (mime in mimes) {
                    mime = mimes[mime];
                    var r = re_trailing_version.exec(mime)
                    if (r) {
                        q = r[1];
                        break;
                    }
                }
            }
            q = name + " " + q;
            return q;
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
    }
};
