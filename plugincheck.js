/**
 * UI code for http://mozilla.com/en-US/plugincheck/
 */
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
    
    var displayPlugins = function(pInfos, status) {
        for(var i=0; i<pInfos.length; i++) {
        
            var plugin = pInfos[i].raw;
            var html = $('#plugin-template').clone();
            
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
            html.show(); //TODO needed?
            
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
    
    var browserPlugins = Pfs.browserPlugins(navigator.plugins);
    Pfs.findPluginInfos(Pfs.browserInfo(), browserPlugins, function(current, outdated, vulnerable, disableNow, unknown){        
        var total = 0;
        displayPlugins(disableNow, states.dis);
        total += disableNow.length;
        
        displayPlugins(vulnerable, states.vul);
        total += vulnerable.length;
        
        displayPlugins(outdated, states.out);
        total += outdated.length;
        
        displayPlugins(current, states.cur);
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