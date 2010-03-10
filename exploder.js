/*jslint browser: true */
/*global Pfs, PluginDetect, window*/

if (Pfs.$.browser.msie) {    
    window.iePlugins = [];
    var alterNavigator = function (name, description, filename, mimeType) {        
        window.iePlugins.push({
            name: name,
            description: description,
            filename: filename,
            length: 1,
            "0": {type: mimeType }
        });        
    };
    
    /* IE has no proper navigator.plugins, so we use the pinlady library
       to detect COM objects or plugins via <object> tags.
       Once we've detected an installed plugin, we set either the \
       plugin name or description to the detected version.
       Lastly we disable pinladyDetection which is an option for
       Firefox, Opera, Safari, and Chrome */
    Pfs.UI.usePinladyDetection = false;
    
    
    //Bug#519823 If we want to start using Applets again
    var j =  PluginDetect.getVersion('Java', 'getJavaInfo.jar', [0, 0, 0]);
    if (j !== null) {
        alterNavigator('Java Embedding Plugin ' + j.replace(/,/g, '.').replace(/_/g, '.'),
                       'Runs Java applets using the latest installed versions of Java.',
                       'npjp2.dll',
                       'application/x-java-applet');
    } 
    
    var f = PluginDetect.getVersion('Flash');
    if (f !== null) {
        alterNavigator('Shockwave Flash', 'Shockwave Flash ' + f.replace(/,/g, '.'), 'NPSWF32.dll', 'application/x-shockwave-flash');
    }
    
    var q = PluginDetect.getVersion('QuickTime');
    if (q !== null) {
        alterNavigator('QuickTime Plug-in ' + q.replace(/,/g, '.'),
                       'The QuickTime Plugin allows you to view a wide variety of multimedia content in web pages.',
                       'npqtplugin.dll',
                       'video/quicktime');
    }
    
    var w = PluginDetect.getVersion('WindowsMediaPlayer');
    if (q !== null) {
        alterNavigator('Windows Media Player Plug-in Dynamic Link Library',
                       q.replace(/,/g, '.'),
                       'nsdsplay.dll',
                       'video/x-ms-wmv');
    }
    var d = PluginDetect.getVersion('Shockwave');
    
    if (d !== null) {
        alterNavigator('Shockwave for Director',
                       d.replace(/,/g, '.'),
                       'np32dsw.dll',
                       'application/x-director');
    }
    var dv = PluginDetect.getVersion('DevalVR');
    if (dv !== null) {
        alterNavigator('DevalVR - QTVR player',
                       dv.replace(/,/g, '.'),
                       'jaronlanier.dll', // FIXME
                       'application/x-devalvrx');
    }
    var sl = PluginDetect.getVersion('Silverlight');
    if (sl !== null) {
        alterNavigator('Silverlight Plug-In',
                       sl.replace(/,/g, '.'),
                       'silverlight.plugin', // FIXME
                       'application/x-silverlight');
    }
    var vlc = PluginDetect.getVersion('VLC');
    if (vlc !== null) {
        alterNavigator('VLC Multimedia Plu-in',
                       vlc.replace(/,/g, '.'),
                       'npvlc.dll', // FIXME
                       'video/mp4');
    }
}