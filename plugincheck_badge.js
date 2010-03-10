Pfs.$(document).ready(function(){
    Pfs.endpoint = window.location.protocol + "//" + 'plugins.mozilla.org/en-us/pfs/v2';
    Pfs.UI.navInfo = Pfs.UI.browserInfo();
    var browserPlugins = Pfs.UI.browserPlugins(navigator.plugins);
    
    var incrementalCallbackFn = function (data) {        
        if (data.status == Pfs.DISABLE ||            
            data.status == Pfs.VULNERABLE ||
            data.status == Pfs.OUTDATED) {
            pfsNextImage = pfsUpdateImage;
            this.stopFindingPluginInfos();
        } 
    };
    var finishedCallbackFn = function() {
        Pfs.$('#mozilla_plugin_checker_badge').attr('src', pfsNextImage);
    };
    Pfs.findPluginInfos(Pfs.UI.navInfo, browserPlugins, incrementalCallbackFn, finishedCallbackFn);
});