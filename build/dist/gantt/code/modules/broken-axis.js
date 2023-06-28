/*
 Highcharts JS v11.1.0 (2023-06-28)

 (c) 2009-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
'use strict';(function(e){"object"===typeof module&&module.exports?(e["default"]=e,module.exports=e):"function"===typeof define&&define.amd?define("highcharts/modules/broken-axis",["highcharts"],function(h){e(h);e.Highcharts=h;return e}):e("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(e){function h(e,n,l,h){e.hasOwnProperty(n)||(e[n]=h.apply(null,l),"function"===typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:n,module:e[n]}})))}e=e?e._modules:
{};h(e,"Core/Axis/BrokenAxis.js",[e["Core/Axis/Stacking/StackItem.js"],e["Core/Utilities.js"]],function(e,n){const {addEvent:l,find:h,fireEvent:y,isArray:A,isNumber:k,pick:v}=n;var w;(function(w){function B(){"undefined"!==typeof this.brokenAxis&&this.brokenAxis.setBreaks(this.options.breaks,!1)}function C(){this.brokenAxis&&this.brokenAxis.hasBreaks&&(this.options.ordinal=!1)}function D(){const a=this.brokenAxis;if(a&&a.hasBreaks){const c=this.tickPositions,d=this.tickPositions.info,b=[];for(let d=
0;d<c.length;d++)a.isInAnyBreak(c[d])||b.push(c[d]);this.tickPositions=b;this.tickPositions.info=d}}function E(){this.brokenAxis||(this.brokenAxis=new r(this))}function F(){const {isDirty:a,options:{connectNulls:c},points:d,xAxis:b,yAxis:g}=this;if(a){let a=d.length;for(;a--;){const f=d[a],e=!(null===f.y&&!1===c)&&(b&&b.brokenAxis&&b.brokenAxis.isInAnyBreak(f.x,!0)||g&&g.brokenAxis&&g.brokenAxis.isInAnyBreak(f.y,!0));f.visible=e?!1:!1!==f.options.visible}}}function G(){this.drawBreaks(this.xAxis,
["x"]);this.drawBreaks(this.yAxis,v(this.pointArrayMap,["y"]))}function H(a,c){const d=this,b=d.points;let g,f,e,p;if(a&&a.brokenAxis&&a.brokenAxis.hasBreaks){const x=a.brokenAxis;c.forEach(function(c){g=x&&x.breakArray||[];f=a.isXAxis?a.min:v(d.options.threshold,a.min);b.forEach(function(b){p=v(b["stack"+c.toUpperCase()],b[c]);g.forEach(function(d){if(k(f)&&k(p)){e=!1;if(f<d.from&&p>d.to||f>d.from&&p<d.from)e="pointBreak";else if(f<d.from&&p>d.from&&p<d.to||f>d.from&&p>d.to&&p<d.from)e="pointInBreak";
e&&y(a,e,{point:b,brk:d})}})})})}}function I(){var a=this.currentDataGrouping,c=a&&a.gapSize;a=this.points.slice();const d=this.yAxis;let b=this.options.gapSize,g=a.length-1;var f;if(b&&0<g)for("value"!==this.options.gapUnit&&(b*=this.basePointRange),c&&c>b&&c>=this.basePointRange&&(b=c);g--;)f&&!1!==f.visible||(f=a[g+1]),c=a[g],!1!==f.visible&&!1!==c.visible&&(f.x-c.x>b&&(f=(c.x+f.x)/2,a.splice(g+1,0,{isNull:!0,x:f}),d.stacking&&this.options.stacking&&(f=d.stacking.stacks[this.stackKey][f]=new e(d,
d.options.stackLabels,!1,f,this.stack),f.total=0)),f=c);return this.getGraphPath(a)}const z=[];w.compose=function(a,c){n.pushUnique(z,a)&&(a.keepProps.push("brokenAxis"),l(a,"init",E),l(a,"afterInit",B),l(a,"afterSetTickPositions",D),l(a,"afterSetOptions",C));if(n.pushUnique(z,c)){const a=c.prototype;a.drawBreaks=H;a.gappedPath=I;l(c,"afterGeneratePoints",F);l(c,"afterRender",G)}return a};class r{static isInBreak(a,c){const d=a.repeat||Infinity,b=a.from,e=a.to-a.from;c=c>=b?(c-b)%d:d-(b-c)%d;return a.inclusive?
c<=e:c<e&&0!==c}static lin2Val(a){var c=this.brokenAxis;c=c&&c.breakArray;if(!c||!k(a))return a;let d,b;for(b=0;b<c.length&&!(d=c[b],d.from>=a);b++)d.to<a?a+=d.len:r.isInBreak(d,a)&&(a+=d.len);return a}static val2Lin(a){var c=this.brokenAxis;c=c&&c.breakArray;if(!c||!k(a))return a;let d=a,b,e;for(e=0;e<c.length;e++)if(b=c[e],b.to<=a)d-=b.len;else if(b.from>=a)break;else if(r.isInBreak(b,a)){d-=a-b.from;break}return d}constructor(a){this.hasBreaks=!1;this.axis=a}findBreakAt(a,c){return h(c,function(d){return d.from<
a&&a<d.to})}isInAnyBreak(a,c){const d=this.axis,b=d.options.breaks||[];let e=b.length,f,x,p;if(e&&k(a)){for(;e--;)r.isInBreak(b[e],a)&&(f=!0,x||(x=v(b[e].showPoints,!d.isXAxis)));p=f&&c?f&&!x:f}return p}setBreaks(a,c){const d=this,b=d.axis,e=A(a)&&!!a.length;b.isDirty=d.hasBreaks!==e;d.hasBreaks=e;a!==b.options.breaks&&(b.options.breaks=b.userOptions.breaks=a);b.forceRedraw=!0;b.series.forEach(function(b){b.isDirty=!0});e||b.val2lin!==r.val2Lin||(delete b.val2lin,delete b.lin2val);e&&(b.userOptions.ordinal=
!1,b.lin2val=r.lin2Val,b.val2lin=r.val2Lin,b.setExtremes=function(a,c,e,k,g){if(d.hasBreaks){const b=this.options.breaks||[];let e;for(;e=d.findBreakAt(a,b);)a=e.to;for(;e=d.findBreakAt(c,b);)c=e.from;c<a&&(c=a)}b.constructor.prototype.setExtremes.call(this,a,c,e,k,g)},b.setAxisTranslation=function(){b.constructor.prototype.setAxisTranslation.call(this);d.unitLength=void 0;if(d.hasBreaks){const a=b.options.breaks||[],c=[],e=[],g=v(b.pointRangePadding,0);let n=0,h,t,q=b.userMin||b.min,u=b.userMax||
b.max,m,l;a.forEach(function(a){t=a.repeat||Infinity;k(q)&&k(u)&&(r.isInBreak(a,q)&&(q+=a.to%t-q%t),r.isInBreak(a,u)&&(u-=u%t-a.from%t))});a.forEach(function(a){m=a.from;t=a.repeat||Infinity;if(k(q)&&k(u)){for(;m-t>q;)m-=t;for(;m<q;)m+=t;for(l=m;l<u;l+=t)c.push({value:l,move:"in"}),c.push({value:l+a.to-a.from,move:"out",size:a.breakSize})}});c.sort(function(a,b){return a.value===b.value?("in"===a.move?0:1)-("in"===b.move?0:1):a.value-b.value});h=0;m=q;c.forEach(function(a){h+="in"===a.move?1:-1;1===
h&&"in"===a.move&&(m=a.value);0===h&&k(m)&&(e.push({from:m,to:a.value,len:a.value-m-(a.size||0)}),n+=a.value-m-(a.size||0))});d.breakArray=e;k(q)&&k(u)&&k(b.min)&&(d.unitLength=u-q-n+g,y(b,"afterBreaks"),b.staticScale?b.transA=b.staticScale:d.unitLength&&(b.transA*=(u-b.min+g)/d.unitLength),g&&(b.minPixelPadding=b.transA*(b.minPointOffset||0)),b.min=q,b.max=u)}});v(c,!0)&&b.chart.redraw()}}w.Additions=r})(w||(w={}));return w});h(e,"masters/modules/broken-axis.src.js",[e["Core/Globals.js"],e["Core/Axis/BrokenAxis.js"]],
function(e,h){h.compose(e.Axis,e.Series)})});
//# sourceMappingURL=broken-axis.js.map