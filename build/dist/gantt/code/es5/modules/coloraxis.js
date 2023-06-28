/*
 Highcharts JS v11.1.0 (2023-06-28)

 ColorAxis module

 (c) 2012-2021 Pawel Potaczek

 License: www.highcharts.com/license
*/
'use strict';(function(d){"object"===typeof module&&module.exports?(d["default"]=d,module.exports=d):"function"===typeof define&&define.amd?define("highcharts/modules/color-axis",["highcharts"],function(m){d(m);d.Highcharts=m;return d}):d("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(d){function m(d,k,x,p){d.hasOwnProperty(k)||(d[k]=p.apply(null,x),"function"===typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:k,module:d[k]}})))}d=d?d._modules:
{};m(d,"Core/Axis/Color/ColorAxisComposition.js",[d["Core/Color/Color.js"],d["Core/Utilities.js"]],function(d,k){var q=d.parse,p=k.addEvent,m=k.extend,A=k.merge,t=k.pick,D=k.splat,r;(function(d){function r(){var b=this,a=this.options;this.colorAxis=[];a.colorAxis&&(a.colorAxis=D(a.colorAxis),a.colorAxis.forEach(function(a){new y(b,a)}))}function x(a){var b=this,e=function(c){c=a.allItems.indexOf(c);-1!==c&&(b.destroyItem(a.allItems[c]),a.allItems.splice(c,1))},c=[],l,h;(this.chart.colorAxis||[]).forEach(function(a){(l=
a.options)&&l.showInLegend&&(l.dataClasses&&l.visible?c=c.concat(a.getDataClassLegendSymbols()):l.visible&&c.push(a),a.series.forEach(function(a){if(!a.options.showInLegend||l.dataClasses)"point"===a.options.legendType?a.points.forEach(function(a){e(a)}):e(a)}))});for(h=c.length;h--;)a.allItems.unshift(c[h])}function B(a){a.visible&&a.item.legendColor&&a.item.legendItem.symbol.attr({fill:a.item.legendColor})}function z(){var a=this.chart.colorAxis;a&&a.forEach(function(a,b,c){a.update({},c)})}function n(){(this.chart.colorAxis&&
this.chart.colorAxis.length||this.colorAttribs)&&this.translateColors()}function G(){var a=this.axisTypes;a?-1===a.indexOf("colorAxis")&&a.push("colorAxis"):this.axisTypes=["colorAxis"]}function f(a){var b=this,c=a?"show":"hide";b.visible=b.options.visible=!!a;["graphic","dataLabel"].forEach(function(a){if(b[a])b[a][c]()});this.series.buildKDTree()}function a(){var a=this,b=this.options.nullColor,c=this.colorAxis,e=this.colorKey;(this.data.length?this.data:this.points).forEach(function(h){var g=h.getNestedProperty(e);
(g=h.options.color||(h.isNull||null===h.value?b:c&&"undefined"!==typeof g?c.toColor(g,h):h.color||a.color))&&h.color!==g&&(h.color=g,"point"===a.options.legendType&&h.legendItem&&h.legendItem.label&&a.chart.legend.colorizeItem(h,h.visible))})}function b(a){var b=a.prototype.createAxis;a.prototype.createAxis=function(a,c){if("colorAxis"!==a)return b.apply(this,arguments);var e=new y(this,A(c.axis,{index:this[a].length,isX:!1}));this.isDirtyLegend=!0;this.axes.forEach(function(a){a.series=[]});this.series.forEach(function(a){a.bindAxes();
a.isDirtyData=!0});t(c.redraw,!0)&&this.redraw(c.animation);return e}}function c(){this.elem.attr("fill",q(this.start).tweenTo(q(this.end),this.pos),void 0,!0)}function e(){this.elem.attr("stroke",q(this.start).tweenTo(q(this.end),this.pos),void 0,!0)}var h=[],y;d.compose=function(l,g,d,v,w){y||(y=l);k.pushUnique(h,g)&&(l=g.prototype,l.collectionsWithUpdate.push("colorAxis"),l.collectionsWithInit.colorAxis=[l.addColorAxis],p(g,"afterGetAxes",r),b(g));k.pushUnique(h,d)&&(g=d.prototype,g.fillSetter=
c,g.strokeSetter=e);k.pushUnique(h,v)&&(p(v,"afterGetAllItems",x),p(v,"afterColorizeItem",B),p(v,"afterUpdate",z));k.pushUnique(h,w)&&(m(w.prototype,{optionalAxis:"colorAxis",translateColors:a}),m(w.prototype.pointClass.prototype,{setVisible:f}),p(w,"afterTranslate",n,{order:1}),p(w,"bindAxes",G))};d.pointSetVisible=f})(r||(r={}));return r});m(d,"Core/Axis/Color/ColorAxisDefaults.js",[],function(){return{lineWidth:0,minPadding:0,maxPadding:0,gridLineColor:"#ffffff",gridLineWidth:1,tickPixelInterval:72,
startOnTick:!0,endOnTick:!0,offset:0,marker:{animation:{duration:50},width:.01,color:"#999999"},labels:{distance:8,overflow:"justify",rotation:0},minColor:"#e6e9ff",maxColor:"#0022ff",tickLength:5,showInLegend:!0}});m(d,"Core/Axis/Color/ColorAxis.js",[d["Core/Axis/Axis.js"],d["Core/Color/Color.js"],d["Core/Axis/Color/ColorAxisComposition.js"],d["Core/Axis/Color/ColorAxisDefaults.js"],d["Core/Legend/LegendSymbol.js"],d["Core/Series/SeriesRegistry.js"],d["Core/Utilities.js"]],function(d,k,m,p,C,A,t){var q=
this&&this.__extends||function(){var d=function(f,a){d=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(a,c){a.__proto__=c}||function(a,c){for(var b in c)Object.prototype.hasOwnProperty.call(c,b)&&(a[b]=c[b])};return d(f,a)};return function(f,a){function b(){this.constructor=f}if("function"!==typeof a&&null!==a)throw new TypeError("Class extends value "+String(a)+" is not a constructor or null");d(f,a);f.prototype=null===a?Object.create(a):(b.prototype=a.prototype,new b)}}(),r=k.parse,
x=A.series,E=t.extend,F=t.isArray,B=t.isNumber,z=t.merge,n=t.pick;k=function(d){function f(a,b){var c=d.call(this,a,b)||this;c.beforePadding=!1;c.chart=void 0;c.coll="colorAxis";c.dataClasses=void 0;c.options=void 0;c.stops=void 0;c.visible=!0;c.init(a,b);return c}q(f,d);f.compose=function(a,b,c,e){m.compose(f,a,b,c,e)};f.prototype.init=function(a,b){var c=a.options.legend||{},e=b.layout?"vertical"!==b.layout:"vertical"!==c.layout,h=b.visible;c=z(f.defaultColorAxisOptions,b,{showEmpty:!1,title:null,
visible:c.enabled&&!1!==h});this.side=b.side||e?2:1;this.reversed=b.reversed||!e;this.opposite=!e;d.prototype.init.call(this,a,c,"colorAxis");this.userOptions=b;F(a.userOptions.colorAxis)&&(a.userOptions.colorAxis[this.index]=b);b.dataClasses&&this.initDataClasses(b);this.initStops();this.horiz=e;this.zoomEnabled=!1};f.prototype.initDataClasses=function(a){var b=this.chart,c=this.legendItem=this.legendItem||{},e=a.dataClasses.length,h=this.options,d,f=0,g=b.options.chart.colorCount;this.dataClasses=
d=[];c.labels=[];(a.dataClasses||[]).forEach(function(a,c){a=z(a);d.push(a);if(b.styledMode||!a.color)"category"===h.dataClassColor?(b.styledMode||(c=b.options.colors,g=c.length,a.color=c[f]),a.colorIndex=f,f++,f===g&&(f=0)):a.color=r(h.minColor).tweenTo(r(h.maxColor),2>e?.5:c/(e-1))})};f.prototype.hasData=function(){return!!(this.tickPositions||[]).length};f.prototype.setTickPositions=function(){if(!this.dataClasses)return d.prototype.setTickPositions.call(this)};f.prototype.initStops=function(){this.stops=
this.options.stops||[[0,this.options.minColor],[1,this.options.maxColor]];this.stops.forEach(function(a){a.color=r(a[1])})};f.prototype.setOptions=function(a){d.prototype.setOptions.call(this,a);this.options.crosshair=this.options.marker};f.prototype.setAxisSize=function(){var a=this.legendItem&&this.legendItem.symbol,b=this.chart,c=b.options.legend||{},e,h;a?(this.left=c=a.attr("x"),this.top=e=a.attr("y"),this.width=h=a.attr("width"),this.height=a=a.attr("height"),this.right=b.chartWidth-c-h,this.bottom=
b.chartHeight-e-a,this.len=this.horiz?h:a,this.pos=this.horiz?c:e):this.len=(this.horiz?c.symbolWidth:c.symbolHeight)||f.defaultLegendLength};f.prototype.normalizedValue=function(a){this.logarithmic&&(a=this.logarithmic.log2lin(a));return 1-(this.max-a)/(this.max-this.min||1)};f.prototype.toColor=function(a,b){var c=this.dataClasses,e=this.stops,h;if(c)for(h=c.length;h--;){var d=c[h];var f=d.from;e=d.to;if(("undefined"===typeof f||a>=f)&&("undefined"===typeof e||a<=e)){var g=d.color;b&&(b.dataClass=
h,b.colorIndex=d.colorIndex);break}}else{a=this.normalizedValue(a);for(h=e.length;h--&&!(a>e[h][0]););f=e[h]||e[h+1];e=e[h+1]||f;a=1-(e[0]-a)/(e[0]-f[0]||1);g=f.color.tweenTo(e.color,a)}return g};f.prototype.getOffset=function(){var a=this.legendItem&&this.legendItem.group,b=this.chart.axisOffset[this.side];if(a){this.axisParent=a;d.prototype.getOffset.call(this);var c=this.chart.legend;c.allItems.forEach(function(a){a instanceof f&&a.drawLegendSymbol(c,a)});c.render();this.chart.getMargins(!0);this.added||
(this.added=!0,this.labelLeft=0,this.labelRight=this.width);this.chart.axisOffset[this.side]=b}};f.prototype.setLegendColor=function(){var a=this.reversed,b=a?1:0;a=a?0:1;b=this.horiz?[b,0,a,0]:[0,a,0,b];this.legendColor={linearGradient:{x1:b[0],y1:b[1],x2:b[2],y2:b[3]},stops:this.stops}};f.prototype.drawLegendSymbol=function(a,b){var c;b=b.legendItem||{};var e=a.padding,d=a.options,k=this.options.labels,l=n(d.itemDistance,10),g=this.horiz,u=n(d.symbolWidth,g?f.defaultLegendLength:12),v=n(d.symbolHeight,
g?12:f.defaultLegendLength),w=n(d.labelPadding,g?16:30);this.setLegendColor();b.symbol||(b.symbol=this.chart.renderer.symbol("roundedRect",0,a.baseline-11,u,v,{r:null!==(c=d.symbolRadius)&&void 0!==c?c:3}).attr({zIndex:1}).add(b.group));b.labelWidth=u+e+(g?l:n(k.x,k.distance)+this.maxLabelLength);b.labelHeight=v+e+(g?w:0)};f.prototype.setState=function(a){this.series.forEach(function(b){b.setState(a)})};f.prototype.setVisible=function(){};f.prototype.getSeriesExtremes=function(){var a=this.series,
b=a.length,c;this.dataMin=Infinity;for(this.dataMax=-Infinity;b--;){var e=a[b];var d=e.colorKey=n(e.options.colorKey,e.colorKey,e.pointValKey,e.zoneAxis,"y");var f=e.pointArrayMap;var k=e[d+"Min"]&&e[d+"Max"];if(e[d+"Data"])var g=e[d+"Data"];else if(f){g=[];f=f.indexOf(d);var u=e.yData;if(0<=f&&u)for(c=0;c<u.length;c++)g.push(n(u[c][f],u[c]))}else g=e.yData;k?(e.minColorValue=e[d+"Min"],e.maxColorValue=e[d+"Max"]):(g=x.prototype.getExtremes.call(e,g),e.minColorValue=g.dataMin,e.maxColorValue=g.dataMax);
"undefined"!==typeof e.minColorValue&&(this.dataMin=Math.min(this.dataMin,e.minColorValue),this.dataMax=Math.max(this.dataMax,e.maxColorValue));k||x.prototype.applyExtremes.call(e)}};f.prototype.drawCrosshair=function(a,b){var c=this.legendItem||{},e=b&&b.plotX,f=b&&b.plotY,k=this.pos,l=this.len;if(b){var g=this.toPixels(b.getNestedProperty(b.series.colorKey));g<k?g=k-2:g>k+l&&(g=k+l+2);b.plotX=g;b.plotY=this.len-g;d.prototype.drawCrosshair.call(this,a,b);b.plotX=e;b.plotY=f;this.cross&&!this.cross.addedToColorAxis&&
c.group&&(this.cross.addClass("highcharts-coloraxis-marker").add(c.group),this.cross.addedToColorAxis=!0,this.chart.styledMode||"object"!==typeof this.crosshair||this.cross.attr({fill:this.crosshair.color}))}};f.prototype.getPlotLinePath=function(a){var b=this.left,c=a.translatedValue,e=this.top;return B(c)?this.horiz?[["M",c-4,e-6],["L",c+4,e-6],["L",c,e],["Z"]]:[["M",b,c],["L",b-6,c+6],["L",b-6,c-6],["Z"]]:d.prototype.getPlotLinePath.call(this,a)};f.prototype.update=function(a,b){var c=this.chart.legend;
this.series.forEach(function(a){a.isDirtyData=!0});(a.dataClasses&&c.allItems||this.dataClasses)&&this.destroyItems();d.prototype.update.call(this,a,b);this.legendItem&&this.legendItem.label&&(this.setLegendColor(),c.colorizeItem(this,!0))};f.prototype.destroyItems=function(){var a=this.chart,b=this.legendItem||{};if(b.label)a.legend.destroyItem(this);else if(b.labels){var c=0;for(b=b.labels;c<b.length;c++)a.legend.destroyItem(b[c])}a.isDirtyLegend=!0};f.prototype.destroy=function(){this.chart.isDirtyLegend=
!0;this.destroyItems();d.prototype.destroy.apply(this,[].slice.call(arguments))};f.prototype.remove=function(a){this.destroyItems();d.prototype.remove.call(this,a)};f.prototype.getDataClassLegendSymbols=function(){var a=this,b=a.chart,c=a.legendItem&&a.legendItem.labels||[],d=b.options.legend,f=n(d.valueDecimals,-1),k=n(d.valueSuffix,""),l=function(b){return a.series.reduce(function(a,c){a.push.apply(a,c.points.filter(function(a){return a.dataClass===b}));return a},[])},g;c.length||a.dataClasses.forEach(function(d,
e){var h=d.from,m=d.to,q=b.numberFormatter,n=!0;g="";"undefined"===typeof h?g="< ":"undefined"===typeof m&&(g="> ");"undefined"!==typeof h&&(g+=q(h,f)+k);"undefined"!==typeof h&&"undefined"!==typeof m&&(g+=" - ");"undefined"!==typeof m&&(g+=q(m,f)+k);c.push(E({chart:b,name:g,options:{},drawLegendSymbol:C.rectangle,visible:!0,isDataClass:!0,setState:function(a){for(var b=0,c=l(e);b<c.length;b++)c[b].setState(a)},setVisible:function(){this.visible=n=a.visible=!n;for(var c=0,d=l(e);c<d.length;c++)d[c].setVisible(n);
b.legend.colorizeItem(this,n)}},d))});return c};f.defaultColorAxisOptions=p;f.defaultLegendLength=200;f.keepProps=["legendItem"];return f}(d);Array.prototype.push.apply(d.keepProps,k.keepProps);"";return k});m(d,"masters/modules/coloraxis.src.js",[d["Core/Globals.js"],d["Core/Axis/Color/ColorAxis.js"]],function(d,k){d.ColorAxis=k;k.compose(d.Chart,d.Fx,d.Legend,d.Series)})});
//# sourceMappingURL=coloraxis.js.map