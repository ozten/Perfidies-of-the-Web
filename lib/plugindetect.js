/* PluginDetect v0.7.0 by Eric Gerds www.pinlady.net/PluginDetect [ onWindowLoaded getVersion Java(OTF) QT DevalVR Shockwave Flash WMP Silverlight VLC ] */var PluginDetect={handler:function(c,b,a){return function(){c(b,a)
}
},isDefined:function(b){return typeof b!="undefined"
},isArray:function(b){return(b&&b.constructor===Array)
},isFunc:function(b){return typeof b=="function"
},isString:function(b){return typeof b=="string"
},num:function(a){return(this.isString(a)&&(/\d/).test(a))
},getNumRegx:/[\d][\d\.\_,-]*/,splitNumRegx:/[\.\_,-]/g,getNum:function(b,c){var d=this,a=d.num(b)?(d.isDefined(c)?new RegExp(c):d.getNumRegx).exec(b):null;
return a?a[0].replace(d.splitNumRegx,","):null
},compareNums:function(h,f,d){var e=this,c,b,a,g=parseInt;
if(e.num(h)&&e.num(f)){if(e.isDefined(d)&&d.compareNums){return d.compareNums(h,f)
}c=h.split(e.splitNumRegx);
b=f.split(e.splitNumRegx);
for(a=0;
a<Math.min(c.length,b.length);
a++){if(g(c[a],10)>g(b[a],10)){return 1
}if(g(c[a],10)<g(b[a],10)){return -1
}}}return 0
},formatNum:function(b){var c=this,a,d;
if(!c.num(b)){return null
}d=b.replace(/\s/g,"").split(c.splitNumRegx).concat(["0","0","0","0"]);
for(a=0;
a<4;
a++){if(/^(0+)(.+)$/.test(d[a])){d[a]=RegExp.$2
}}if(!(/\d/).test(d[0])){d[0]="0"
}return d.slice(0,4).join(",")
},$$hasMimeType:function(a){return function(d){if(!a.isIE){var c,b,e,f=a.isString(d)?[d]:d;
for(e=0;
e<f.length;
e++){c=navigator.mimeTypes[f[e]];
if(c&&(b=c.enabledPlugin)){if(b.name||b.description){return c
}}}}return null
}
},findNavPlugin:function(g,d){var a=this.isString(g)?g:g.join(".*"),e=d===false?"":"\\d",b,c=new RegExp(a+".*"+e+"|"+e+".*"+a,"i"),f=navigator.plugins;
for(b=0;
b<f.length;
b++){if(c.test(f[b].description)||c.test(f[b].name)){return f[b]
}}return null
},AXO:window.ActiveXObject,getAXO:function(b,a){var g=null,f,d=false,c=this;
try{g=new c.AXO(b);
d=true
}catch(f){}if(c.isDefined(a)){delete g;
return d
}return g
},convertFuncs:function(f){var a,g,d,b=/^[\$][\$]/,c={};
for(a in f){if(b.test(a)){c[a]=1
}}for(a in c){try{g=a.slice(2);
if(g.length>0&&!f[g]){f[g]=f[a](f)
}}catch(d){}}},initScript:function(){var $=this,nav=navigator,userAgent=(nav&&$.isString(nav.userAgent)?nav.userAgent:""),vendor=(nav&&$.isString(nav.vendor)?nav.vendor:"");
$.convertFuncs($);
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
}}$.head=$.isDefined(document.getElementsByTagName)?document.getElementsByTagName("head")[0]:null
}$.isGecko=!$.isIE&&$.isString(navigator.product)&&(/Gecko/i).test(navigator.product)&&(/Gecko\s*\/\s*\d/i).test(userAgent);
$.GeckoRV=$.isGecko?$.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(userAgent)?RegExp.$1:"0.9"):null;
$.isSafari=!$.isIE&&(/Safari\s*\/\s*\d/i).test(userAgent)&&(/Apple/i).test(vendor);
$.isChrome=!$.isIE&&(/Chrome\s*\/\s*\d/i).test(userAgent);
$.isOpera=!$.isIE&&(/Opera\s*[\/]?\s*\d/i).test(userAgent);
;
$.addWinEvent("load",$.handler($.runWLfuncs,$));

},init:function(d,a){var c=this,b;
if(!c.isString(d)){return -3
}if(d.length==1){c.getVersionDelimiter=d;
return -3
}d=d.toLowerCase().replace(/\s/g,"");
if(!c.isDefined(c[d])){return -3
}b=c[d];
c.plugin=b;
if(!c.isDefined(b.installed)||a==true){b.installed=b.version=b.version0=b.getVersionDone=null;
b.$=c
}c.garbage=false;
if(c.isIE&&!c.ActiveXEnabled){if(b!==c.java){return -2
}}return 1
},fPush:function(b,a){var c=this;
if(c.isArray(a)&&(c.isFunc(b)||(c.isArray(b)&&b.length>0&&c.isFunc(b[0])))){a[a.length]=b
}},callArray:function(b){var c=this,a;
if(c.isArray(b)){for(a=0;
a<b.length;
a++){if(b[a]===null){return
}c.call(b[a]);
b[a]=null
}}},call:function(c){var b=this,a=b.isArray(c)?c.length:-1;
if(a>0&&b.isFunc(c[0])){c[0](b,a>1?c[1]:0,a>2?c[2]:0,a>3?c[3]:0)
}else{if(b.isFunc(c)){c(b)
}}},getVersionDelimiter:",",$$getVersion:function(a){return function(g,d,c){var e=a.init(g),f,b;
if(e<0){return null
}f=a.plugin;
if(f.getVersionDone!=1){f.getVersion(d,c);
if(f.getVersionDone===null){f.getVersionDone=1
}}a.cleanup();
b=(f.version||f.version0);
return b?b.replace(a.splitNumRegx,a.getVersionDelimiter):b
}
},cleanup:function(){
var a=this;
if(a.garbage&&a.isDefined(window.CollectGarbage)){window.CollectGarbage()
}
},isActiveXObject:function(b){var d=this,a,g,f="/",c='<object width="1" height="1" style="display:none" '+d.plugin.getCodeBaseVersion(b)+">"+d.plugin.HTML+"<"+f+"object>";
if(d.head.firstChild){d.head.insertBefore(document.createElement("object"),d.head.firstChild)
}else{d.head.appendChild(document.createElement("object"))
}d.head.firstChild.outerHTML=c;
try{d.head.firstChild.classid=d.plugin.classID
}catch(g){}a=false;
try{if(d.head.firstChild.object){a=true
}}catch(g){}try{if(a&&d.head.firstChild.readyState<4){d.garbage=true
}}catch(g){}d.head.removeChild(d.head.firstChild);
return a
},codebaseSearch:function(c){var e=this;
if(!e.ActiveXEnabled){return null
}if(e.isDefined(c)){return e.isActiveXObject(c)
}var j=[0,0,0,0],g,f,b=e.plugin.digits,i=function(k,l){return e.isActiveXObject((k==0?l:j[0])+","+(k==1?l:j[1])+","+(k==2?l:j[2])+","+(k==3?l:j[3]))
},h,d,a=false;
for(g=0;
g<b.length;
g++){h=b[g]*2;
j[g]=0;
for(f=0;
f<20;
f++){if(h==1&&g>0&&a){break
}if(h-j[g]>1){d=Math.round((h+j[g])/2);
if(i(g,d)){j[g]=d;
a=true
}else{h=d
}}else{if(h-j[g]==1){h--;
if(!a&&i(g,h)){a=true
}break
}else{if(!a&&i(g,h)){a=true
}break
}}}if(!a){return null
}}return j.join(",")
},addWinEvent:function(d,c){var e=this,a=window,b;
if(e.isFunc(c)){if(a.addEventListener){a.addEventListener(d,c,false)
}else{if(a.attachEvent){a.attachEvent("on"+d,c)
}else{b=a["on"+d];
a["on"+d]=e.winHandler(c,b)
}}}},winHandler:function(d,c){return function(){d();
if(typeof c=="function"){c()
}}
},WLfuncs:[0],runWLfuncs:function(a){a.winLoaded=true;
a.callArray(a.WLfuncs);
if(a.onDoneEmptyDiv){a.onDoneEmptyDiv()
}},winLoaded:false,$$onWindowLoaded:function(a){return function(b){if(a.winLoaded){a.call(b)
}else{a.fPush(b,a.WLfuncs)
}}
},div:null,divWidth:50,pluginSize:1,emptyDiv:function(){var c=this,a,d,b;
if(c.div&&c.div.childNodes){for(a=c.div.childNodes.length-1;
a>=0;
a--){b=c.div.childNodes[a];
if(b&&b.childNodes){for(d=b.childNodes.length-1;
d>=0;
d--){b.removeChild(b.childNodes[d])
}c.div.removeChild(b)
}}}},onDoneEmptyDiv:function(){var a=this;
if(!a.winLoaded){return
}if(a.WLfuncs&&a.WLfuncs.length>0&&a.isFunc(a.WLfuncs[a.WLfuncs.length-1])){return
}if(a.java){if(a.java.OTF==3){return
}if(a.java.funcs&&a.java.funcs.length>0&&a.isFunc(a.java.funcs[a.java.funcs.length-1])){return
}}a.emptyDiv()
},getObject:function(c,a){var g,d=this,f=null,b=d.getContainer(c);
try{if(b&&b.firstChild){f=b.firstChild
}if(a&&f){f.focus()
}}catch(g){}return f
},getContainer:function(a){return(a&&a[0]?a[0]:null)
},instantiate:function(i,c,f,a,j){var l,m=document,h=this,q,p=m.createElement("span"),o,g,n="/";
var k=function(s,r){var u=s.style,d,t;
if(!u){return
}u.outline="none";
u.border="none";
u.padding="0px";
u.margin="0px";
u.visibility="visible";
if(h.isArray(r)){for(d=0;
d<r.length;
d=d+2){try{u[r[d]]=r[d+1]
}catch(t){}}return
}},b=function(){var s,t="pd33993399",r=null,d=(m.getElementsByTagName("body")[0]||m.body);
if(!d){try{m.write('<div id="'+t+'">o<'+n+"div>");
r=m.getElementById(t)
}catch(s){}}d=(m.getElementsByTagName("body")[0]||m.body);
if(d){if(d.firstChild&&h.isDefined(d.insertBefore)){d.insertBefore(h.div,d.firstChild)
}else{d.appendChild(h.div)
}if(r){d.removeChild(r)
}}else{}};
if(!h.isDefined(a)){a=""
}if(h.isString(i)&&(/[^\s]/).test(i)){q="<"+i+' width="'+h.pluginSize+'" height="'+h.pluginSize+'" ';
for(o=0;
o<c.length;
o=o+2){if(/[^\s]/.test(c[o+1])){q+=c[o]+'="'+c[o+1]+'" '
}}q+=">";
for(o=0;
o<f.length;
o=o+2){if(/[^\s]/.test(f[o+1])){q+='<param name="'+f[o]+'" value="'+f[o+1]+'" />'
}}q+=a+"<"+n+i+">"
}else{q=a
}if(!h.div){h.div=m.createElement("div");
g=m.getElementById("plugindetect");
if(g){h.div=g
}else{h.div.id="plugindetect";
b()
}k(h.div,["width",h.divWidth+"px","height",(h.pluginSize+3)+"px","fontSize",(h.pluginSize+3)+"px","lineHeight",(h.pluginSize+3)+"px","verticalAlign","baseline","display","block"]);
if(!g){k(h.div,["position","absolute","right","0px","top","0px"])
}}if(h.div&&h.div.parentNode){h.div.appendChild(p);
k(p,["fontSize",(h.pluginSize+3)+"px","lineHeight",(h.pluginSize+3)+"px","verticalAlign","baseline","display","inline"]);
;
try{if(p&&p.parentNode){p.focus()
}}catch(l){}try{p.innerHTML=q
}catch(l){}if(p.childNodes.length==1){k(p.childNodes[0],["display","inline"])
}return[p]
}return[null]
},quicktime:{mimeType:["video/quicktime","application/x-quicktimeplayer","image/x-macpaint","image/x-quicktime"],progID:"QuickTimeCheckObject.QuickTimeCheck.1",progID0:"QuickTime.QuickTime",classID:"clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",minIEver:7,HTML:'<param name="src" value="A14999.mov" /><param name="controller" value="false" />',getCodeBaseVersion:function(a){return'codebase="#version='+a+'"'
},digits:[8,64,16,0],getVersion:function(){var c=null,f,d=this.$,g=true;
if(!d.isIE){if(navigator.platform&&(/linux/i).test(navigator.platform)){g=false
}if(g){f=d.findNavPlugin(["QuickTime","(Plug-in|Plugin)"]);
if(f&&f.name&&d.hasMimeType(this.mimeType)){c=d.getNum(f.name)
}}this.installed=c?1:-1
}else{var e;
if(d.IEver>=this.minIEver&&d.getAXO(this.progID0,1)){c=d.codebaseSearch()
}else{e=d.getAXO(this.progID);
if(e&&e.QuickTimeVersion){c=e.QuickTimeVersion.toString(16);
c=c.charAt(0)+"."+c.charAt(1)+"."+c.charAt(2)
}}this.installed=c?1:(d.getAXO(this.progID0,1)?0:-1)
}c=d.formatNum(c);
if(c){var b=c.split(d.splitNumRegx);
if(d.isIE&&d.compareNums(c,"7,50,0,0")>=0&&d.compareNums(c,"7,60,0,0")<0){b=[b[0],b[1].charAt(0),b[1].charAt(1),b[2]]
}b[3]="0";
c=b.join(",")
}this.version=d.formatNum(c)
}},java:{mimeType:"application/x-java-applet",classID:"clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",DTKclassID:"clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA",DTKmimeType:["application/java-deployment-toolkit","application/npruntime-scriptable-plugin;DeploymentToolkit"],JavaVersions:[[1,9,2,30],[1,8,2,30],[1,7,2,30],[1,6,1,30],[1,5,1,30],[1,4,2,30],[1,3,1,30]],searchJavaPluginAXO:function(){var h=null,a=this,c=a.$,g=[],j=[1,5,0,14],i=[1,6,0,2],f=[1,3,1,0],e=[1,4,2,0],d=[1,5,0,7],b=false;
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
if(!c.isDefined(i[d])){i[d]=k;
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
},queryJavaHandler:function(c){var b=c.java,a=window.java,d;
b.hasRun=true;
try{if(c.isDefined(a.lang)&&c.isDefined(a.lang.System)){b.value=[a.lang.System.getProperty("java.version")+" ",a.lang.System.getProperty("java.vendor")+" "]
}}catch(d){}},queryJava:function(){var c=this,d=c.$,b=navigator.userAgent,f;
if(d.isDefined(window.java)&&navigator.javaEnabled()&&!c.hasRun){if(d.isGecko){if(d.hasMimeType("application/x-java-vm")){try{var g=document.createElement("div"),a=document.createEvent("HTMLEvents");
a.initEvent("focus",false,true);
g.addEventListener("focus",d.handler(c.queryJavaHandler,d),false);
g.dispatchEvent(a)
}catch(f){}if(!c.hasRun){c.queryJavaHandler(d)
}}}else{if((/opera.9\.(0|1)/i).test(b)&&(/mac/i).test(b)){}else{if(!c.hasRun){c.queryJavaHandler(d)
}}}}return c.value
},forceVerifyTag:[],jar:[],VENDORS:["Sun Microsystems Inc.","Apple Computer, Inc."],init:function(){var a=this,b=a.$;
a.hasRun=false;
a.value=[null,null];
a.tryApplet=[2,2,2];
a.DOMobj=[0,0,0,0,0,0];
a.Applet0Index=3;
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
c.countMax=33
}},getVersion:function(e,j){var g,d=this,f=d.$,i=vendor=versionEnabled=null,c=navigator.javaEnabled();
if(d.getVersionDone===null){d.init()
}var k;
if(f.isArray(j)){for(k=0;
k<d.tryApplet.length;
k++){if(typeof j[k]=="number"){d.tryApplet[k]=j[k]
}}}for(k=0;
k<d.forceVerifyTag.length;
k++){d.tryApplet[k]=d.forceVerifyTag[k]
}if(f.isString(e)){d.jar[d.jar.length]=e
}if(d.getVersionDone==0){if(!d.version||d.useAnyTag()){g=d.queryExternalApplet(e);
if(g[0]){d.installed=1;
d.EndGetVersion(g[0],g[1])
}}return
}var h=d.queryDeploymentToolKit();
if(f.num(h)){i=h;
vendor=d.VENDORS[0]
}if(!f.isIE){var n,l,b,m,a;
a=f.hasMimeType(d.mimeType);
m=(a&&c)?true:false;
if(d.MimeType_versions.length==0&&a){g=d.getFromMimeType("application/x-java-applet.*jpi-version.*=");
if(g[0]!=""){if(!i){i=g[0]
}d.MimeType_versions=g
}}if(!i&&a){g="Java[^\\d]*Plug-in";
b=f.findNavPlugin(g);
if(b){g=new RegExp(g,"i");
n=g.test(b.description)?f.getNum(b.description):null;
l=g.test(b.name)?f.getNum(b.name):null;
if(n&&l){i=(f.compareNums(f.formatNum(n),f.formatNum(l))>=0)?n:l
}else{i=n||l
}}}if(!i&&a&&(/macintosh.*safari/i).test(navigator.userAgent)){b=f.findNavPlugin("Java.*\\d.*Plug-in.*Cocoa",false);
if(b){n=f.getNum(b.description);
if(n){i=n
}}}if(i){d.version0=i;
if(c){versionEnabled=i
}}if(!versionEnabled||d.useAnyTag()){b=d.queryExternalApplet(e);
if(b[0]){versionEnabled=b[0];
vendor=b[1]
}}if(!versionEnabled){b=d.queryJava();
if(b[0]){d.version0=b[0];
versionEnabled=b[0];
vendor=b[1];
if(d.installed==-0.5){d.installed=0.5
}}}if(d.installed===null&&!versionEnabled&&m&&!(/macintosh.*ppc/i).test(navigator.userAgent)){g=d.getFromMimeType("application/x-java-applet.*version.*=");
if(g[0]!=""){versionEnabled=g[0]
}}if(!versionEnabled&&m){if(/macintosh.*safari/i.test(navigator.userAgent)){if(d.installed===null){d.installed=0
}else{if(d.installed==-0.5){d.installed=0.5
}}}}}else{if(!i&&h!=-1){i=d.searchJavaPluginAXO();
if(i){vendor=d.VENDORS[0]
}}if(!i){d.JavaFix()
}if(i){d.version0=i;
if(c&&f.ActiveXEnabled){versionEnabled=i
}}if(!versionEnabled||d.useAnyTag()){g=d.queryExternalApplet(e);
if(g[0]){versionEnabled=g[0];
vendor=g[1]
}}}if(d.installed===null){d.installed=versionEnabled?1:(i?-0.2:-1)
}d.EndGetVersion(versionEnabled,vendor)
},EndGetVersion:function(b,d){var a=this,c=a.$;
if(a.version0){a.version0=c.formatNum(c.getNum(a.version0))
}if(b){a.version=c.formatNum(c.getNum(b));
a.vendor=(c.isString(d)?d:"")
}if(a.getVersionDone!=1){a.getVersionDone=0
}},queryDeploymentToolKit:function(){var d=this,g=d.$,i,b,c,h=null,a=null;
if((g.isGecko&&g.compareNums(g.GeckoRV,g.formatNum("1.6"))<=0)||g.isSafari||(g.isIE&&!g.ActiveXEnabled)){d.queryDTKresult=0
}if(d.queryDTKresult!==null){return d.queryDTKresult
}if(g.isIE&&g.IEver>=6){d.DOMobj[0]=g.instantiate("object",[],[]);
h=g.getObject(d.DOMobj[0])
}else{if(!g.isIE&&(c=g.hasMimeType(d.DTKmimeType))&&c.type){d.DOMobj[0]=g.instantiate("object",["type",c.type],[]);
h=g.getObject(d.DOMobj[0])
}}if(h){if(g.isIE&&g.IEver>=6){try{h.classid=d.DTKclassID
}catch(i){}}try{var c,f=h.jvms;
if(f){a=f.getLength();
if(typeof a=="number"){for(b=0;
b<a;
b++){c=f.get(a-1-b);
if(c){c=c.version;
if(g.getNum(c)){d.DeployTK_versions[b]=c
}}}}}}catch(i){}}d.queryDTKresult=d.DeployTK_versions.length>0?d.DeployTK_versions[0]:(a==0?-1:0);
return d.queryDTKresult
},queryExternalApplet:function(g){var d=this,i=d.$,l=d.BridgeResult,c=d.DOMobj,k=d.Applet0Index,a="&nbsp;&nbsp;&nbsp;&nbsp;",f="A.class";
if(!i.isString(g)||!(/\.jar\s*$/).test(g)||(/\\/).test(g)){return[null,null]
}if(d.OTF<1){d.OTF=1
}if((i.isGecko||i.isChrome||(i.isOpera&&!navigator.javaEnabled()))&&!i.hasMimeType(d.mimeType)&&!d.queryJava()[0]){return[null,null]
}if(d.OTF<2){d.OTF=2
}if(!c[1]&&d.canUseObjectTag()){c[1]=i.instantiate("object",[],[],a)
}if(!c[2]){c[2]=i.instantiate("",[],[],a)
}var n=g,h="",q;
if((/[\/]/).test(g)){q=g.split("/");
n=q[q.length-1];
q[q.length-1]="";
h=q.join("/")
}var e=["archive",n,"code",f],b=["mayscript","true"],p=["scriptable","true"].concat(b);
if(!c[k]&&d.canUseObjectTag()&&d.canTryApplet(0)){c[k]=i.isIE?i.instantiate("object",["type",d.mimeType].concat(e),["codebase",h].concat(e).concat(p),a,d):i.instantiate("object",["type",d.mimeType,"archive",n,"classid","java:"+f],["codebase",h,"archive",n].concat(p),a,d);
l[0]=[0,0];
d.query1Applet(k)
}if(!c[k+1]&&d.canUseAppletTag()&&d.canTryApplet(1)){c[k+1]=i.isIE?i.instantiate("applet",["alt",a].concat(b).concat(e),["codebase",h].concat(b),a,d):i.instantiate("applet",["codebase",h,"alt",a].concat(b).concat(e),[].concat(b),a,d);
l[1]=[0,0];
d.query1Applet(k+1)
}if(!c[k+2]&&d.canUseObjectTag()&&d.canTryApplet(2)){c[k+2]=i.isIE?i.instantiate("object",["classid",d.classID],["codebase",h].concat(e).concat(p),a,d):i.instantiate();
l[2]=[0,0];
d.query1Applet(k+2)
};
var o,j=0;
for(o=0;
o<l.length;
o++){if(c[k+o]||d.canTryApplet(o)){j++
}else{break
}}if(j==l.length){d.getVersionDone=d.forceVerifyTag.length>0?0:1
}return d.getBR()
},canUseAppletTag:function(){return((!this.$.isIE||navigator.javaEnabled())?true:false)
},canUseObjectTag:function(){return((!this.$.isIE||this.$.ActiveXEnabled)?true:false)
},useAnyTag:function(){var b=this,a;
for(a=0;
a<b.tryApplet.length;
a++){if(b.canTryApplet(a)){return true
}}return false
},canTryApplet:function(c){var a=this,b=a.$;
if(a.tryApplet[c]==3){return true
}if(!a.version0||!navigator.javaEnabled()||(b.isIE&&!b.ActiveXEnabled)){if(a.tryApplet[c]==2){return true
}if(a.tryApplet[c]==1&&!a.getBR()[0]){return true
}}return false
},getBR:function(){var b=this.BridgeResult,a;
for(a=0;
a<b.length;
a++){if(b[a][0]){return[b[a][0],b[a][1]]
}}return[b[0][0],b[0][1]]
},query1Applet:function(g){var f,c=this,d=c.$,a=vendor=null,b=d.getObject(c.DOMobj[g],true);
if(b){try{a=b.getVersion()+" ";
vendor=b.getVendor()+" ";
b.statusbar(d.winLoaded?" ":" ")
}catch(f){}if(d.num(a)){c.BridgeResult[g-c.Applet0Index]=[a,vendor]
}try{if(d.isIE&&a&&b.readyState!=4){d.garbage=true;
b.parentNode.removeChild(b)
}}catch(f){}}},append:function(e,d){for(var c=0;
c<d.length;
c++){e[e.length]=d[c]
}},JavaFix:function(){}},devalvr:{mimeType:"application/x-devalvrx",progID:"DevalVRXCtrl.DevalVRXCtrl.1",classID:"clsid:5D2CF9D0-113A-476B-986F-288B54571614",getVersion:function(){var a=null,g,c=this.$,f;
if(!c.isIE){g=c.findNavPlugin("DevalVR");
if(g&&g.name&&c.hasMimeType(this.mimeType)){a=g.description.split(" ")[3]
}this.installed=a?1:-1
}else{var b,h,d;
h=c.getAXO(this.progID,1);
if(h){b=c.instantiate("object",["classid",this.classID],["src",""],"",this);
d=c.getObject(b);
if(d){try{if(d.pluginversion){a="00000000"+d.pluginversion.toString(16);
a=a.substr(a.length-8,8);
a=parseInt(a.substr(0,2),16)+","+parseInt(a.substr(2,2),16)+","+parseInt(a.substr(4,2),16)+","+parseInt(a.substr(6,2),16)
}}catch(f){}}}this.installed=a?1:(h?0:-1)
}this.version=c.formatNum(a)
}},flash:{mimeType:["application/x-shockwave-flash","application/futuresplash"],progID:"ShockwaveFlash.ShockwaveFlash",classID:"clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",getVersion:function(){var c=function(i){if(!i){return null
}var e=/[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(i);
return e?e[0].replace(/[rRdD\.]/g,",").replace(/\s/g,""):null
};
var j,g=this.$,h,f,b=null,a=null,d=null;
if(!g.isIE){j=g.findNavPlugin("Flash");
if(j&&j.description&&g.hasMimeType(this.mimeType)){b=c(j.description)
}}else{for(f=15;
f>2;
f--){a=g.getAXO(this.progID+"."+f);
if(a){d=f.toString();
break
}}if(d=="6"){try{a.AllowScriptAccess="always"
}catch(h){return"6,0,21,0"
}}try{b=c(a.GetVariable("$version"))
}catch(h){}if(!b&&d){b=d
}}this.installed=b?1:-1;
this.version=g.formatNum(b);
return true
}},shockwave:{mimeType:"application/x-director",progID:"SWCtl.SWCtl",classID:"clsid:166B1BCA-3F9C-11CF-8075-444553540000",getVersion:function(){var a=null,b=null,f,d,c=this.$;
if(!c.isIE){d=c.findNavPlugin("Shockwave for Director");
if(d&&d.description&&c.hasMimeType(this.mimeType)){a=c.getNum(d.description)
}}else{try{b=c.getAXO(this.progID).ShockwaveVersion("")
}catch(f){}if(c.isString(b)&&b.length>0){a=c.getNum(b)
}else{if(c.getAXO(this.progID+".8",1)){a="8"
}else{if(c.getAXO(this.progID+".7",1)){a="7"
}else{if(c.getAXO(this.progID+".1",1)){a="6"
}}}}}this.installed=a?1:-1;
this.version=c.formatNum(a)
}},windowsmediaplayer:{mimeType:["application/x-mplayer2","application/asx"],progID:"wmplayer.ocx",classID:"clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",getVersion:function(){var a=null,e=this.$,b=null;
this.installed=-1;
if(!e.isIE){if(e.hasMimeType(this.mimeType)){if(e.findNavPlugin(["Windows","Media","(Plug-in|Plugin)"],false)||e.findNavPlugin(["Flip4Mac","Windows","Media"],false)){this.installed=0
}var d=e.isGecko&&e.compareNums(e.GeckoRV,e.formatNum("1.8"))<0;
if(!d&&e.findNavPlugin(["Windows","Media","Firefox Plugin"],false)){var c=e.instantiate("object",["type",this.mimeType[0]],[],"",this),f=e.getObject(c);
if(f){a=f.versionInfo
}}}}else{b=e.getAXO(this.progID);
if(b){a=b.versionInfo
}}if(a){this.installed=1
}this.version=e.formatNum(a)
}},silverlight:{mimeType:"application/x-silverlight",progID:"AgControl.AgControl",digits:[9,20,9,12,31],getVersion:function(){var e=this.$,j=document,i=null,c=null,h=false,b=[1,0,1,1,1],r=[1,0,1,1,1],k=function(d){return(d<10?"0":"")+d.toString()
},n=function(s,d,u,v,t){return(s+"."+d+"."+u+k(v)+k(t)+".0")
},o=function(d,s){return q((d==0?s:r[0]),(d==1?s:r[1]),(d==2?s:r[2]),(d==3?s:r[3]),(d==4?s:r[4]))
},q=function(t,s,w,v,u){var u;
try{return c.IsVersionSupported(n(t,s,w,v,u))
}catch(u){}return false
};
if(!e.isIE){var a=[null,null],f=e.findNavPlugin("Silverlight Plug-in",false),g=e.isGecko&&e.compareNums(e.GeckoRV,e.formatNum("1.6"))<=0;
if(f&&e.hasMimeType(this.mimeType)){i=e.formatNum(f.description);
if(i){r=i.split(e.splitNumRegx);
if(parseInt(r[2],10)>=30226&&parseInt(r[0],10)<2){r[0]="2"
}i=r.join(",")
}if(e.isGecko&&!g){h=true
}if(!h&&!g&&i){a=e.instantiate("object",["type",this.mimeType],[],"",this);
c=e.getObject(a);
if(c){if(q(b[0],b[1],b[2],b[3],b[4])){h=true
}if(!h){c.data="data:"+this.mimeType+",";
if(q(b[0],b[1],b[2],b[3],b[4])){h=true
}}}}}}else{c=e.getAXO(this.progID);
var m,l,p;
if(c&&q(b[0],b[1],b[2],b[3],b[4])){for(m=0;
m<this.digits.length;
m++){p=r[m];
for(l=p+(m==0?0:1);
l<=this.digits[m];
l++){if(o(m,l)){h=true;
r[m]=l
}else{break
}}if(!h){break
}}if(h){i=n(r[0],r[1],r[2],r[3],r[4])
}}}this.installed=h&&i?1:(i?-0.2:-1);
this.version=e.formatNum(i)
}},vlc:{mimeType:"application/x-vlc-plugin",progID:"VideoLAN.VLCPlugin",compareNums:function(e,d){var c=this.$,k=e.split(c.splitNumRegx),i=d.split(c.splitNumRegx),h,b,a,g,f,j;
for(h=0;
h<Math.min(k.length,i.length);
h++){j=/([\d]+)([a-z]?)/.test(k[h]);
b=parseInt(RegExp.$1,10);
g=(h==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;
j=/([\d]+)([a-z]?)/.test(i[h]);
a=parseInt(RegExp.$1,10);
f=(h==2&&RegExp.$2.length>0)?RegExp.$2.charCodeAt(0):-1;
if(b!=a){return(b>a?1:-1)
}if(h==2&&g!=f){return(g>f?1:-1)
}}return 0
},getVersion:function(){var b=this.$,d,a=null,c;
if(!b.isIE){if(b.hasMimeType(this.mimeType)){d=b.findNavPlugin(["VLC","(Plug-in|Plugin)"],false);
if(d&&d.description){a=b.getNum(d.description,"[\\d][\\d\\.]*[a-z]*")
}}this.installed=a?1:-1
}else{d=b.getAXO(this.progID);
if(d){try{a=b.getNum(d.VersionInfo,"[\\d][\\d\\.]*[a-z]*")
}catch(c){}}this.installed=d?1:-1
}this.version=b.formatNum(a)
}},zz:0};
PluginDetect.initScript();
