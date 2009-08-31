/* PluginDetect v0.6.3 [ onWindowLoaded getVersion Java(OTF) ] by Eric Gerds www.pinlady.net/PluginDetect */ if(!PluginDetect){var PluginDetect={getNum:function(b,c){if(!this.num(b)){return null
}var a;
if(typeof c=="undefined"){a=/[\d][\d\.\_,-]*/.exec(b)
}else{a=(new RegExp(c)).exec(b)
}return a?a[0].replace(/[\.\_-]/g,","):null
},hasMimeType:function(c){if(PluginDetect.isIE){return null
}var b,a,d,e=c.constructor==String?[c]:c;
for(d=0;
d<e.length;
d++){b=navigator.mimeTypes[e[d]];
if(b&&b.enabledPlugin){a=b.enabledPlugin;
if(a.name||a.description){return b
}}}return null
},findNavPlugin:function(g,d){var a=g.constructor==String?g:g.join(".*"),e=d===false?"":"\\d",b,c=new RegExp(a+".*"+e+"|"+e+".*"+a,"i"),f=navigator.plugins;
for(b=0;
b<f.length;
b++){if(c.test(f[b].description)||c.test(f[b].name)){return f[b]
}}return null
},AXO:window.ActiveXObject,getAXO:function(b,a){var f=null,d,c=false;
try{f=new this.AXO(b);
c=true
}catch(d){}if(typeof a!="undefined"){delete f;
return c
}return f
},num:function(a){return(typeof a!="string"?false:(/\d/).test(a))
},compareNums:function(g,e){var d=this,c,b,a,f=window.parseInt;
if(!d.num(g)||!d.num(e)){return 0
}if(d.plugin&&d.plugin.compareNums){return d.plugin.compareNums(g,e)
}c=g.split(",");
b=e.split(",");
for(a=0;
a<Math.min(c.length,b.length);
a++){if(f(c[a],10)>f(b[a],10)){return 1
}if(f(c[a],10)<f(b[a],10)){return -1
}}return 0
},formatNum:function(b){if(!this.num(b)){return null
}var a,c=b.replace(/\s/g,"").replace(/[\.\_]/g,",").split(",").concat(["0","0","0","0"]);
for(a=0;
a<4;
a++){if(/^(0+)(.+)$/.test(c[a])){c[a]=RegExp.$2
}}if(!(/\d/).test(c[0])){c[0]="0"
}return c[0]+","+c[1]+","+c[2]+","+c[3]
},initScript:function(){var $=this,userAgent=navigator.userAgent;
$.isIE=
/*@cc_on!@*/
false;
$.IEver=$.isIE&&((/MSIE\s*(\d\.?\d*)/i).exec(userAgent))?parseFloat(RegExp.$1,10):-1;
$.ActiveXEnabled=false;
if($.isIE){var x,progid=["Msxml2.XMLHTTP","Msxml2.DOMDocument","Microsoft.XMLDOM","ShockwaveFlash.ShockwaveFlash","TDCCtl.TDCCtl","Shell.UIHelper","Scripting.Dictionary","wmplayer.ocx"];
for(x=0;
x<progid.length;
x++){if($.getAXO(progid[x],1)){$.ActiveXEnabled=true;
break
}}$.head=typeof document.getElementsByTagName!="undefined"?document.getElementsByTagName("head")[0]:null
}$.isGecko=!$.isIE&&typeof navigator.product=="string"&&(/Gecko/i).test(navigator.product)&&(/Gecko\s*\/\s*\d/i).test(userAgent)?true:false;
$.GeckoRV=$.isGecko?$.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(userAgent)?RegExp.$1:"0.9"):null;
$.isSafari=!$.isIE&&(/Safari\s*\/\s*\d/i).test(userAgent)?true:false;
$.isChrome=(/Chrome\s*\/\s*\d/i).test(userAgent)?true:false;
$.onWindowLoaded(0)
},init:function(c,a){if(typeof c!="string"){return -3
}c=c.toLowerCase().replace(/\s/g,"");
var b=this,d;
if(typeof b[c]=="undefined"){return -3
}d=b[c];
b.plugin=d;
if(typeof d.installed=="undefined"||a==true){d.installed=null;
d.version=null;
d.version0=null;
d.getVersionDone=null;
d.$=b
}b.garbage=false;
if(b.isIE&&!b.ActiveXEnabled){if(b.plugin!=b.java){return -2
}}return 1
},isMinVersion:function(g,e,c,b){
return -3
},getVersion:function(e,b,a){
var d=PluginDetect,c=d.init(e),f;
if(c<0){return null
}f=d.plugin;
if(f.getVersionDone!=1){f.getVersion(b,a);
if(f.getVersionDone===null){f.getVersionDone=1
}}d.cleanup();
return(f.version||f.version0);
;
return null
},getInfo:function(f,c,b){var a={};
;
return a
},cleanup:function(){
var a=this;
if(a.garbage&&typeof window.CollectGarbage!="undefined"){window.CollectGarbage()
}
},isActiveXObject:function(b){
},codebaseSearch:function(c){var e=this;
if(!e.ActiveXEnabled){return null
}if(typeof c!="undefined"){return e.isActiveXObject(c)
}
},dummy1:0}
}PluginDetect.onDetectionDone=function(g,e,d,a){
return -1
};
PluginDetect.onWindowLoaded=function(c){
var b=PluginDetect,a=window;
if(b.EventWinLoad===true){}else{b.winLoaded=false;
b.EventWinLoad=true;
if(typeof a.addEventListener!="undefined"){a.addEventListener("load",b.runFuncs,false)
}else{if(typeof a.attachEvent!="undefined"){a.attachEvent("onload",b.runFuncs)
}else{if(typeof a.onload=="function"){b.funcs[b.funcs.length]=a.onload
}a.onload=b.runFuncs
}}}if(typeof c=="function"){b.funcs[b.funcs.length]=c
}
};
;
PluginDetect.funcs=[0];
PluginDetect.runFuncs=function(){var b=PluginDetect,a;
b.winLoaded=true;
for(a=0;
a<b.funcs.length;
a++){if(typeof b.funcs[a]=="function"){b.funcs[a](b);
b.funcs[a]=null
}}};
;
PluginDetect.java={mimeType:"application/x-java-applet",classID:"clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",DTKclassID:"clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA",DTKmimeType:"application/npruntime-scriptable-plugin;DeploymentToolkit",JavaVersions:[[1,9,2,25],[1,8,2,25],[1,7,2,25],[1,6,2,25],[1,5,2,25],[1,4,2,25],[1,3,1,25]],searchJavaPluginAXO:function(){var h=null,a=this,c=a.$,g=[],j=[1,5,0,14],i=[1,6,0,2],f=[1,3,1,0],e=[1,4,2,0],d=[1,5,0,7],b=false;
if(!c.ActiveXEnabled){return null
};
if(c.IEver>=a.minIEver){g=a.searchJavaAXO(i,i,b);
if(g.length>0&&b){g=a.searchJavaAXO(j,j,b)
}}else{
if(g.length==0){g=a.searchJavaAXO(f,e,false)
}}if(g.length>0){h=g[0]
}a.JavaPlugin_versions=[].concat(g);
return h
},searchJavaAXO:function(l,i,m){var n,f,h=this.$,p,k,a,e,g,j,b,q=[];
if(h.compareNums(l.join(","),i.join(","))>0){i=l
}i=h.formatNum(i.join(","));
var o,d="1,4,2,0",c="JavaPlugin."+l[0]+""+l[1]+""+l[2]+""+(l[3]>0?("_"+(l[3]<10?"0":"")+l[3]):"");
for(n=0;
n<this.JavaVersions.length;
n++){f=this.JavaVersions[n];
p="JavaPlugin."+f[0]+""+f[1];
g=f[0]+"."+f[1]+".";
for(a=f[2];
a>=0;
a--){b="JavaWebStart.isInstalled."+g+a+".0";
if(h.compareNums(f[0]+","+f[1]+","+a+",0",i)>=0&&!h.getAXO(b,1)){continue
}o=h.compareNums(f[0]+","+f[1]+","+a+",0",d)<0?true:false;
for(e=f[3];
e>=0;
e--){k=a+"_"+(e<10?"0"+e:e);
j=p+k;
if(h.getAXO(j,1)&&(o||h.getAXO(b,1))){q[q.length]=g+k;
if(!m){return q
}}if(j==c){return q
}}if(h.getAXO(p+a,1)&&(o||h.getAXO(b,1))){q[q.length]=g+a;
if(!m){return q
}}if(p+a==c){return q
}}}return q
},minIEver:7,getFromMimeType:function(a){var h,f,c=this.$,j=new RegExp(a),d,k,i={},e=0,b,g=[""];
for(h=0;
h<navigator.mimeTypes.length;
h++){k=navigator.mimeTypes[h];
if(j.test(k.type)&&k.enabledPlugin){k=k.type.substring(k.type.indexOf("=")+1,k.type.length);
d="a"+c.formatNum(k);
if(typeof i[d]=="undefined"){i[d]=k;
e++
}}}for(f=0;
f<e;
f++){b="0,0,0,0";
for(h in i){if(i[h]){d=h.substring(1,h.length);
if(c.compareNums(d,b)>0){b=d
}}}g[f]=i["a"+b];
i["a"+b]=null
}if(!(/windows|macintosh/i).test(navigator.userAgent)){g=[g[0]]
}return g
},queryJavaHandler:function(){var b=PluginDetect.java,a=window.java,c;
b.hasRun=true;
try{if(typeof a.lang!="undefined"&&typeof a.lang.System!="undefined"){b.value=[a.lang.System.getProperty("java.version")+" ",a.lang.System.getProperty("java.vendor")+" "]
}}catch(c){}},queryJava:function(){var c=this,d=c.$,b=navigator.userAgent,f;
if(typeof window.java!="undefined"&&navigator.javaEnabled()&&!c.hasRun){if(d.isGecko){if(d.hasMimeType("application/x-java-vm")){try{var g=document.createElement("div"),a=document.createEvent("HTMLEvents");
a.initEvent("focus",false,true);
g.addEventListener("focus",c.queryJavaHandler,false);
g.dispatchEvent(a)
}catch(f){}if(!c.hasRun){c.queryJavaHandler()
}}}else{if((/opera.9\.(0|1)/i).test(b)&&(/mac/i).test(b)){}else{if(!c.hasRun){c.queryJavaHandler()
}}}}return c.value
},forceVerifyTag:[],jar:[],VENDORS:["Sun Microsystems Inc.","Apple Computer, Inc."],init:function(){var a=this,b=a.$;
if(typeof a.app!="undefined"){a.delJavaApplets(b)
}a.hasRun=false;
a.value=[null,null];
a.useTag=[2,2,2];
a.app=[0,0,0,0,0,0];
a.appi=3;
a.queryDTKresult=null;
a.OTF=0;
a.BridgeResult=[[null,null],[null,null],[null,null]];
a.JavaActive=[0,0,0];
a.All_versions=[];
a.DeployTK_versions=[];
a.MimeType_versions=[];
a.JavaPlugin_versions=[];
a.funcs=[];
var c=a.NOTF;
if(c){c.$=b;
if(c.javaInterval){clearInterval(c.javaInterval)
}c.EventJavaReady=null;
c.javaInterval=null;
c.count=0;
c.intervalLength=250;
c.countMax=40
}a.lateDetection=b.winLoaded;
if(!a.lateDetection){b.onWindowLoaded(a.delJavaApplets)
}},getVersion:function(f,l){var h,d=this,g=d.$,j=null,n=null,e=null,c=navigator.javaEnabled();
if(d.getVersionDone===null){d.init()
}var k;
if(typeof l!="undefined"&&l.constructor==Array){for(k=0;
k<d.useTag.length;
k++){if(typeof l[k]=="number"){d.useTag[k]=l[k]
}}}for(k=0;
k<d.forceVerifyTag.length;
k++){d.useTag[k]=d.forceVerifyTag[k]
}if(typeof f!="undefined"){d.jar[d.jar.length]=f
}if(d.getVersionDone==0){if(!d.version||d.useAnyTag()){h=d.queryExternalApplet(f);
if(h[0]){e=h[0];
n=h[1]
}}d.EndGetVersion(e,n);
return
}var i=d.queryDeploymentToolKit();
if(typeof i=="string"&&i.length>0){j=i;
n=d.VENDORS[0]
}if(!g.isIE){var q,m,b,o,a;
a=g.hasMimeType(d.mimeType);
o=(a&&c)?true:false;
if(d.MimeType_versions.length==0&&a){h=d.getFromMimeType("application/x-java-applet.*jpi-version.*=");
if(h[0]!=""){if(!j){j=h[0]
}d.MimeType_versions=h
}}if(!j&&a){h="Java[^\\d]*Plug-in";
b=g.findNavPlugin(h);
if(b){h=new RegExp(h,"i");
q=h.test(b.description)?g.getNum(b.description):null;
m=h.test(b.name)?g.getNum(b.name):null;
if(q&&m){j=(g.compareNums(g.formatNum(q),g.formatNum(m))>=0)?q:m
}else{j=q||m
}}}if(!j&&a&&(/macintosh.*safari/i).test(navigator.userAgent)){b=g.findNavPlugin("Java.*\\d.*Plug-in.*Cocoa",false);
if(b){q=g.getNum(b.description);
if(q){j=q
}}}if(j){d.version0=j;
if(c){e=j
}}if(!e||d.useAnyTag()){b=d.queryExternalApplet(f);
if(b[0]){e=b[0];
n=b[1]
}}if(!e){b=d.queryJava();
if(b[0]){d.version0=b[0];
e=b[0];
n=b[1];
if(d.installed==-0.5){d.installed=0.5
}}}if(d.installed===null&&!e&&o&&!(/macintosh.*ppc/i).test(navigator.userAgent)){h=d.getFromMimeType("application/x-java-applet.*version.*=");
if(h[0]!=""){e=h[0]
}}if(!e&&o){if(/macintosh.*safari/i.test(navigator.userAgent)){if(d.installed===null){d.installed=0
}else{if(d.installed==-0.5){d.installed=0.5
}}}}}else{if(!j&&i!=-1){j=d.searchJavaPluginAXO();
if(j){n=d.VENDORS[0]
}}if(!j){d.JavaFix()
}if(j){d.version0=j;
if(c&&g.ActiveXEnabled){e=j
}}if(!e||d.useAnyTag()){h=d.queryExternalApplet(f);
if(h[0]){e=h[0];
n=h[1]
}}}if(d.installed===null){d.installed=e?1:(j?-0.2:-1)
}d.EndGetVersion(e,n)
},EndGetVersion:function(b,d){var a=this,c=a.$;
if(a.version0){a.version0=c.formatNum(c.getNum(a.version0))
}if(b){a.version=c.formatNum(c.getNum(b));
a.vendor=(typeof d=="string"?d:"")
}if(a.getVersionDone!=1){a.getVersionDone=0
}},queryDeploymentToolKit:function(){var d=this,g=d.$,i,b,h=null,a=null;
if((g.isGecko&&g.compareNums(g.GeckoRV,g.formatNum("1.6"))<=0)||g.isSafari||(g.isIE&&!g.ActiveXEnabled)){d.queryDTKresult=0
}if(d.queryDTKresult!==null){return d.queryDTKresult
}if(g.isIE&&g.IEver>=6){d.app[0]=g.instantiate("object",[],[]);
h=g.getObject(d.app[0])
}else{if(!g.isIE&&g.hasMimeType(d.DTKmimeType)){d.app[0]=g.instantiate("object",["type",d.DTKmimeType],[]);
h=g.getObject(d.app[0])
}}if(h){if(g.isIE&&g.IEver>=6){try{h.classid=d.DTKclassID
}catch(i){}}try{var c,f=h.jvms;
if(f){a=f.getLength();
if(typeof a=="number"){for(b=0;
b<a;
b++){c=f.get(a-1-b);
if(c){c=c.version;
if(g.getNum(c)){d.DeployTK_versions[b]=c
}}}}}}catch(i){}}g.hideObject(h);
d.queryDTKresult=d.DeployTK_versions.length>0?d.DeployTK_versions[0]:(a==0?-1:0);
return d.queryDTKresult
},queryExternalApplet:function(d){var c=this,e=c.$,h=c.BridgeResult,b=c.app,g=c.appi,a="&nbsp;&nbsp;&nbsp;&nbsp;";
if(typeof d!="string"||!(/\.jar\s*$/).test(d)){return[null,null]
}if(c.OTF<1){c.OTF=1
}if(!e.isIE){if((e.isGecko||e.isChrome)&&!e.hasMimeType(c.mimeType)&&!c.queryJava()[0]){return[null,null]
}}if(c.OTF<2){c.OTF=2
}if(!b[g]&&c.canUseObjectTag()&&c.canUseThisTag(0)){b[1]=e.instantiate("object",[],[],a);
b[g]=e.isIE?e.instantiate("object",["archive",d,"code","A.class","type",c.mimeType],["archive",d,"code","A.class","mayscript","true","scriptable","true"],a):e.instantiate("object",["archive",d,"classid","java:A.class","type",c.mimeType],["archive",d,"mayscript","true","scriptable","true"],a);
h[0]=[0,0];
c.query1Applet(g)
}if(!b[g+1]&&c.canUseAppletTag()&&c.canUseThisTag(1)){b[g+1]=e.instantiate("applet",["archive",d,"code","A.class","alt",a,"mayscript","true"],["mayscript","true"],a);
h[1]=[0,0];
c.query1Applet(g+1)
}if(e.isIE&&!b[g+2]&&c.canUseObjectTag()&&c.canUseThisTag(2)){b[g+2]=e.instantiate("object",["classid",c.classID],["archive",d,"code","A.class","mayscript","true","scriptable","true"],a);
h[2]=[0,0];
c.query1Applet(g+2)
};
var j,f=0;
for(j=0;
j<h.length;
j++){if(b[g+j]||c.canUseThisTag(j)){f++
}else{break
}}if(f==h.length){c.getVersionDone=1;
if(c.forceVerifyTag.length>0){c.getVersionDone=0
}}return c.getBR()
},canUseAppletTag:function(){return((!this.$.isIE||navigator.javaEnabled())?true:false)
},canUseObjectTag:function(){return((!this.$.isIE||this.$.ActiveXEnabled)?true:false)
},useAnyTag:function(){var b=this,a;
for(a=0;
a<b.useTag.length;
a++){if(b.canUseThisTag(a)){return true
}}return false
},canUseThisTag:function(c){var a=this,b=a.$;
if(a.useTag[c]==3){return true
}if(!a.version0||!navigator.javaEnabled()||(b.isIE&&!b.ActiveXEnabled)){if(a.useTag[c]==2){return true
}if(a.useTag[c]==1&&!a.getBR()[0]){return true
}}return false
},getBR:function(){var b=this.BridgeResult,a;
for(a=0;
a<b.length;
a++){if(b[a][0]){return[b[a][0],b[a][1]]
}}return[b[0][0],b[0][1]]
},delJavaApplets:function(b){var c=b.java.app,a;
for(a=c.length-1;
a>=0;
a--){b.uninstantiate(c[a])
}},query1Applet:function(g){var f,c=this,d=c.$,a=null,h=null,b=d.getObject(c.app[g],true);
try{if(b){a=b.getVersion()+" ";
h=b.getVendor()+" ";
if(d.num(a)){c.BridgeResult[g-c.appi]=[a,h];
d.hideObject(c.app[g])
}if(d.isIE&&a&&b.readyState!=4){d.garbage=true;
d.uninstantiate(c.app[g])
}}}catch(f){}},NOTF:{isJavaActive:function(){
}},append:function(e,d){for(var c=0;
c<d.length;
c++){e[e.length]=d[c]
}},getInfo:function(){var m={};
;
return m
},JavaFix:function(){}};
;
PluginDetect.div=null;
PluginDetect.pluginSize=1;
PluginDetect.DOMbody=null;
PluginDetect.uninstantiate=function(a){var c,b=this;
if(!a){return
}try{if(a[0]&&a[0].firstChild){a[0].removeChild(a[0].firstChild)
}if(a[0]&&b.div){b.div.removeChild(a[0])
}if(b.div&&b.div.childNodes.length==0){b.div.parentNode.removeChild(b.div);
b.div=null;
if(b.DOMbody&&b.DOMbody.parentNode){b.DOMbody.parentNode.removeChild(b.DOMbody)
}b.DOMbody=null
}a[0]=null
}catch(c){}};
PluginDetect.getObject=function(b,a){var f,c=this,d=null;
try{if(b&&b[0]&&b[0].firstChild){d=b[0].firstChild
}}catch(f){}try{if(a&&d&&typeof d.focus!="undefined"&&typeof document.hasFocus!="undefined"&&!document.hasFocus()){d.focus()
}}catch(f){}return d
};
PluginDetect.getContainer=function(a){var c,b=null;
if(a&&a[0]){b=a[0]
}return b
};
PluginDetect.hideObject=function(a){var b=this.getObject(a);
if(b&&b.style){b.style.height="0"
}};
PluginDetect.instantiate=function(h,b,c,a){var j=function(d){var e=d.style;
if(!e){return
}e.border="0px";
e.padding="0px";
e.margin="0px";
e.fontSize=(g.pluginSize+3)+"px";
e.height=(g.pluginSize+3)+"px";
e.visibility="visible";
if(d.tagName&&d.tagName.toLowerCase()=="div"){e.width="100%";
e.display="block"
}else{if(d.tagName&&d.tagName.toLowerCase()=="span"){e.width=g.pluginSize+"px";
e.display="inline"
}}};
var k,l=document,g=this,p,i=(l.getElementsByTagName("body")[0]||l.body),o=l.createElement("span"),n,f,m="/";
if(typeof a=="undefined"){a=""
}p="<"+h+' width="'+g.pluginSize+'" height="'+g.pluginSize+'" ';
for(n=0;
n<b.length;
n=n+2){p+=b[n]+'="'+b[n+1]+'" '
}p+=">";
for(n=0;
n<c.length;
n=n+2){p+='<param name="'+c[n]+'" value="'+c[n+1]+'" />'
}p+=a+"<"+m+h+">";
if(!g.div){g.div=l.createElement("div");
f=l.getElementById("plugindetect");
if(f){j(f);
f.appendChild(g.div)
}else{if(i){try{if(i.firstChild&&typeof i.insertBefore!="undefined"){i.insertBefore(g.div,i.firstChild)
}else{i.appendChild(g.div)
}}catch(k){}}else{try{l.write('<div id="pd33993399">o<'+m+"div>");
i=(l.getElementsByTagName("body")[0]||l.body);
i.appendChild(g.div);
i.removeChild(l.getElementById("pd33993399"))
}catch(k){try{g.DOMbody=l.createElement("body");
l.getElementsByTagName("html")[0].appendChild(g.DOMbody);
g.DOMbody.appendChild(g.div)
}catch(k){}}}}j(g.div)
}if(g.div&&g.div.parentNode&&g.div.parentNode.parentNode){g.div.appendChild(o);
try{o.innerHTML=p
}catch(k){}j(o);
return[o]
}return[null]
};
;
PluginDetect.initScript();
