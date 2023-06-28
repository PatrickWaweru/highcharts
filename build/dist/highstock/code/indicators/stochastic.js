/*
 Highstock JS v11.1.0 (2023-06-28)

 Indicator series type for Highcharts Stock

 (c) 2010-2021 Pawe Fus

 License: www.highcharts.com/license
*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/indicators/stochastic",["highcharts","highcharts/modules/stock"],function(h){a(h);a.Highcharts=h;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function h(a,d,f,y){a.hasOwnProperty(d)||(a[d]=y.apply(null,f),"function"===typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:d,
module:a[d]}})))}a=a?a._modules:{};h(a,"Stock/Indicators/ArrayUtilities.js",[],function(){return{getArrayExtremes:function(a,d,f){return a.reduce((a,n)=>[Math.min(a[0],n[d]),Math.max(a[1],n[f])],[Number.MAX_VALUE,-Number.MAX_VALUE])}}});h(a,"Stock/Indicators/MultipleLinesComposition.js",[a["Core/Series/SeriesRegistry.js"],a["Core/Utilities.js"]],function(a,d){const {sma:{prototype:f}}=a.seriesTypes,{defined:h,error:n,merge:t}=d;var p;(function(a){function m(b){return"plot"+b.charAt(0).toUpperCase()+
b.slice(1)}function x(b,e){const a=[];(b.pointArrayMap||[]).forEach(b=>{b!==e&&a.push(m(b))});return a}function g(){const b=this,e=b.linesApiNames;var a=b.areaLinesNames;const r=b.points,k=b.options,q=b.graph,d={options:{gapSize:k.gapSize}},c=[];var g=x(b,b.pointValKey);let p=r.length,l;g.forEach((b,a)=>{for(c[a]=[];p--;)l=r[p],c[a].push({x:l.x,plotX:l.plotX,plotY:l[b],isNull:!h(l[b])});p=r.length});if(b.userOptions.fillColor&&a.length){var u=g.indexOf(m(a[0]));u=c[u];a=1===a.length?r:c[g.indexOf(m(a[1]))];
g=b.color;b.points=a;b.nextPoints=u;b.color=b.userOptions.fillColor;b.options=t(r,d);b.graph=b.area;b.fillGraph=!0;f.drawGraph.call(b);b.area=b.graph;delete b.nextPoints;delete b.fillGraph;b.color=g}e.forEach((a,e)=>{c[e]?(b.points=c[e],k[a]?b.options=t(k[a].styles,d):n('Error: "There is no '+a+' in DOCS options declared. Check if linesApiNames are consistent with your DOCS line names."'),b.graph=b["graph"+a],f.drawGraph.call(b),b["graph"+a]=b.graph):n('Error: "'+a+" doesn't have equivalent in pointArrayMap. To many elements in linesApiNames relative to pointArrayMap.\"")});
b.points=r;b.options=k;b.graph=q;f.drawGraph.call(b)}function u(b){var a;let c=[];b=b||this.points;if(this.fillGraph&&this.nextPoints){if((a=f.getGraphPath.call(this,this.nextPoints))&&a.length){a[0][0]="L";c=f.getGraphPath.call(this,b);a=a.slice(0,c.length);for(let b=a.length-1;0<=b;b--)c.push(a[b])}}else c=f.getGraphPath.apply(this,arguments);return c}function p(b){const a=[];(this.pointArrayMap||[]).forEach(e=>{a.push(b[e])});return a}function z(){const a=this.pointArrayMap;let e=[],c;e=x(this);
f.translate.apply(this,arguments);this.points.forEach(b=>{a.forEach((a,g)=>{c=b[a];this.dataModify&&(c=this.dataModify.modifyValue(c));null!==c&&(b[e[g]]=this.yAxis.toPixels(c,!0))})})}const A=[],v=["bottomLine"],c=["top","bottom"],l=["top"];a.compose=function(a){if(d.pushUnique(A,a)){const b=a.prototype;b.linesApiNames=b.linesApiNames||v.slice();b.pointArrayMap=b.pointArrayMap||c.slice();b.pointValKey=b.pointValKey||"top";b.areaLinesNames=b.areaLinesNames||l.slice();b.drawGraph=g;b.getGraphPath=
u;b.toYData=p;b.translate=z}return a}})(p||(p={}));return p});h(a,"Stock/Indicators/Stochastic/StochasticIndicator.js",[a["Stock/Indicators/ArrayUtilities.js"],a["Stock/Indicators/MultipleLinesComposition.js"],a["Core/Series/SeriesRegistry.js"],a["Core/Utilities.js"]],function(a,d,f,h){const {sma:n}=f.seriesTypes,{extend:t,isArray:p,merge:w}=h;class m extends n{constructor(){super(...arguments);this.points=this.options=this.data=void 0}init(){super.init.apply(this,arguments);this.options=w({smoothedLine:{styles:{lineColor:this.color}}},
this.options)}getValues(d,g){const f=g.periods[0];g=g.periods[1];const h=d.xData,m=(d=d.yData)?d.length:0,n=[],v=[],c=[];var l=null;let b,e;if(!(m<f)&&p(d[0])&&4===d[0].length){var t=!0,r=0;for(e=f-1;e<m;e++){var k=d.slice(e-f+1,e+1);b=a.getArrayExtremes(k,2,1);var q=b[0];k=d[e][3]-q;q=b[1]-q;k=k/q*100;isNaN(k)&&t?r++:(t&&!isNaN(k)&&(t=!1),q=v.push(h[e]),isNaN(k)?c.push([c[q-2]&&"number"===typeof c[q-2][0]?c[q-2][0]:null,null]):c.push([k,null]),e>=r+(f-1)+(g-1)&&(l=super.getValues({xData:v.slice(-g),
yData:c.slice(-g)},{period:g}),l=l.yData[0]),n.push([h[e],k,l]),c[q-1][1]=l)}return{values:n,xData:v,yData:c}}}}m.defaultOptions=w(n.defaultOptions,{params:{index:void 0,period:void 0,periods:[14,3]},marker:{enabled:!1},tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span><b> {series.name}</b><br/>%K: {point.y}<br/>%D: {point.smoothed}<br/>'},smoothedLine:{styles:{lineWidth:1,lineColor:void 0}},dataGrouping:{approximation:"averages"}});t(m.prototype,{areaLinesNames:[],nameComponents:["periods"],
nameBase:"Stochastic",pointArrayMap:["y","smoothed"],parallelArrays:["x","y","smoothed"],pointValKey:"y",linesApiNames:["smoothedLine"]});d.compose(m);f.registerSeriesType("stochastic",m);"";return m});h(a,"masters/indicators/stochastic.src.js",[],function(){})});
//# sourceMappingURL=stochastic.js.map