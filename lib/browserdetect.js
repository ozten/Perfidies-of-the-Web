/*jslint browser: true, plusplus: false */
/*global Pfs, PluginDetect, window*/
// jslint that we should fix below
/*jslint eqeqeq: false*/

/**
 * Browser detection based on QuirksMode code
 *
 * See also: http://www.quirksmode.org/js/detect.html
 * License: http://www.quirksmode.org/about/copyright.html
 */
/*jslint laxbreak: true */
window.BrowserDetect = {
    detect: function () {
        return {
            browser: 
                this.searchString(this.dataBrowser) || "???",
            version: 
                this.searchRev(this.versionSearchString, navigator.userAgent)
                || this.searchRev(this.versionSearchString, navigator.appVersion)
                || "???",
            build: 
                navigator.buildID
                || this.searchRev(this.buildSearchString, navigator.userAgent)
                || this.searchRev(this.buildSearchString, navigator.appVersion)
                || "???",
            os: 
                this.searchString(this.dataOS) || "???"
        };
    },
    searchString: function (data) {
        var i, dataString, dataProp;
        for (i = 0; i < data.length; i++) {
            dataString = data[i].string;
            dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            this.buildSearchString = data[i].buildSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1) {
                    return data[i].identity;
                }
            } else if (dataProp) {
                return data[i].identity;
            }
        }
        return undefined;
    },
    searchRev: function (searchString, dataString) {
        var index = dataString.indexOf(searchString),
	    val;
        if (index == -1) {
            return undefined;
        }
        val = dataString.substring(index + searchString.length + 1);
        return val.split(' ')[0];
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version",
            buildSearch: "Safari"
        },
        {
            prop: window.opera,
            identity: "Opera",
            buildSearch: "Presto"
        },
        {	    
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.userAgent,
            subString: "Minefield",
            identity: "Minefield",
            versionSearch: "Minefield"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {
            // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        { 
            // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]
};
