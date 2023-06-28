/*
 Highcharts JS v11.1.0 (2023-06-28)

 Highcharts Drilldown module

 Author: Torstein Honsi
 License: www.highcharts.com/license

*/
'use strict';(function(a){"object"===typeof module&&module.exports?(a["default"]=a,module.exports=a):"function"===typeof define&&define.amd?define("highcharts/modules/drilldown",["highcharts"],function(l){a(l);a.Highcharts=l;return a}):a("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(a){function l(a,k,p,l){a.hasOwnProperty(k)||(a[k]=l.apply(null,p),"function"===typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:k,module:a[k]}})))}a=a?a._modules:
{};l(a,"Extensions/Breadcrumbs/BreadcrumbsDefaults.js",[],function(){return{lang:{mainBreadcrumb:"Main"},options:{buttonTheme:{fill:"none",height:18,padding:2,"stroke-width":0,zIndex:7,states:{select:{fill:"none"}},style:{color:"#334eff"}},buttonSpacing:5,floating:!1,format:void 0,relativeTo:"plotBox",rtl:!1,position:{align:"left",verticalAlign:"top",x:0,y:void 0},separator:{text:"/",style:{color:"#666666",fontSize:"0.8em"}},showFullPath:!0,style:{},useHTML:!1,zIndex:7}}});l(a,"Extensions/Breadcrumbs/Breadcrumbs.js",
[a["Extensions/Breadcrumbs/BreadcrumbsDefaults.js"],a["Core/Chart/Chart.js"],a["Core/Templating.js"],a["Core/Utilities.js"]],function(a,k,p,l){function t(){if(this.breadcrumbs){const f=this.resetZoomButton&&this.resetZoomButton.getBBox(),d=this.breadcrumbs.options;f&&"right"===d.position.align&&"plotBox"===d.relativeTo&&this.breadcrumbs.alignBreadcrumbsGroup(-f.width-d.buttonSpacing)}}function G(){this.breadcrumbs&&(this.breadcrumbs.destroy(),this.breadcrumbs=void 0)}function H(){const f=this.breadcrumbs;
if(f&&!f.options.floating&&f.level){var d=f.options,g=d.buttonTheme;g=(g.height||0)+2*(g.padding||0)+d.buttonSpacing;d=d.position.verticalAlign;"bottom"===d?(this.marginBottom=(this.marginBottom||0)+g,f.yOffset=g):"middle"!==d?(this.plotTop+=g,f.yOffset=-g):f.yOffset=void 0}}function w(){this.breadcrumbs&&this.breadcrumbs.redraw()}function D(f){!0===f.resetSelection&&this.breadcrumbs&&this.breadcrumbs.alignBreadcrumbsGroup()}const {format:I}=p,{addEvent:x,defined:E,extend:y,fireEvent:F,isString:R,
merge:r,objectEach:L,pick:u}=l,h=[];class C{static compose(f,d){l.pushUnique(h,f)&&(x(k,"destroy",G),x(k,"afterShowResetZoom",t),x(k,"getMargins",H),x(k,"redraw",w),x(k,"selection",D));l.pushUnique(h,d)&&y(d.lang,a.lang)}constructor(f,d){this.elementList={};this.isDirty=!0;this.level=0;this.list=[];d=r(f.options.drilldown&&f.options.drilldown.drillUpButton,C.defaultOptions,f.options.navigation&&f.options.navigation.breadcrumbs,d);this.chart=f;this.options=d||{}}updateProperties(f){this.setList(f);
this.setLevel();this.isDirty=!0}setList(f){this.list=f}setLevel(){this.level=this.list.length&&this.list.length-1}getLevel(){return this.level}getButtonText(f){const d=this.chart,g=this.options;var a=d.options.lang;const h=u(g.format,g.showFullPath?"{level.name}":"\u2190 {level.name}");a=a&&u(a.drillUpText,a.mainBreadcrumb);f=g.formatter&&g.formatter(f)||I(h,{level:f.levelOptions},d)||"";(R(f)&&!f.length||"\u2190 "===f)&&E(a)&&(f=g.showFullPath?a:"\u2190 "+a);return f}redraw(){this.isDirty&&this.render();
this.group&&this.group.align();this.isDirty=!1}render(){const f=this.chart,d=this.options;!this.group&&d&&(this.group=f.renderer.g("breadcrumbs-group").addClass("highcharts-no-tooltip highcharts-breadcrumbs").attr({zIndex:d.zIndex}).add());d.showFullPath?this.renderFullPathButtons():this.renderSingleButton();this.alignBreadcrumbsGroup()}renderFullPathButtons(){this.destroySingleButton();this.resetElementListState();this.updateListElements();this.destroyListElements()}renderSingleButton(){const f=
this.chart;var d=this.list;const g=this.options.buttonSpacing;this.destroyListElements();const a=this.group?this.group.getBBox().width:g;d=d[d.length-2];!f.drillUpButton&&0<this.level?f.drillUpButton=this.renderButton(d,a,g):f.drillUpButton&&(0<this.level?this.updateSingleButton():this.destroySingleButton())}alignBreadcrumbsGroup(f){if(this.group){var d=this.options;const a=d.buttonTheme,h=d.position,q="chart"===d.relativeTo||"spacingBox"===d.relativeTo?void 0:"scrollablePlotBox";var g=this.group.getBBox();
d=2*(a.padding||0)+d.buttonSpacing;h.width=g.width+d;h.height=g.height+d;g=r(h);f&&(g.x+=f);this.options.rtl&&(g.x+=h.width);g.y=u(g.y,this.yOffset,0);this.group.align(g,!0,q)}}renderButton(f,d,g){const a=this,h=this.chart,q=a.options,k=r(q.buttonTheme);d=h.renderer.button(a.getButtonText(f),d,g,function(d){const g=q.events&&q.events.click;let h;g&&(h=g.call(a,d,f));!1!==h&&(d.newLevel=q.showFullPath?f.level:a.level-1,F(a,"up",d))},k).addClass("highcharts-breadcrumbs-button").add(a.group);h.styledMode||
d.attr(q.style);return d}renderSeparator(f,d){const a=this.chart,h=this.options.separator;f=a.renderer.label(h.text,f,d,void 0,void 0,void 0,!1).addClass("highcharts-breadcrumbs-separator").add(this.group);a.styledMode||f.css(h.style);return f}update(f){r(!0,this.options,f);this.destroy();this.isDirty=!0}updateSingleButton(){const f=this.chart,d=this.list[this.level-1];f.drillUpButton&&f.drillUpButton.attr({text:this.getButtonText(d)})}destroy(){this.destroySingleButton();this.destroyListElements(!0);
this.group&&this.group.destroy();this.group=void 0}destroyListElements(f){const d=this.elementList;L(d,(a,h)=>{if(f||!d[h].updated)a=d[h],a.button&&a.button.destroy(),a.separator&&a.separator.destroy(),delete a.button,delete a.separator,delete d[h]});f&&(this.elementList={})}destroySingleButton(){this.chart.drillUpButton&&(this.chart.drillUpButton.destroy(),this.chart.drillUpButton=void 0)}resetElementListState(){L(this.elementList,a=>{a.updated=!1})}updateListElements(){const a=this.elementList,
d=this.options.buttonSpacing,g=this.list,h=this.options.rtl,k=h?-1:1,q=function(a,d){return k*a.getBBox().width+k*d},p=function(a,d,c){a.translate(d-a.getBBox().width,c)};let l=this.group?q(this.group,d):d,t,r;for(let f=0,u=g.length;f<u;++f){const c=f===u-1;let b,e;r=g[f];a[r.level]?(t=a[r.level],b=t.button,t.separator||c?t.separator&&c&&(t.separator.destroy(),delete t.separator):(l+=k*d,t.separator=this.renderSeparator(l,d),h&&p(t.separator,l,d),l+=q(t.separator,d)),a[r.level].updated=!0):(b=this.renderButton(r,
l,d),h&&p(b,l,d),l+=q(b,d),c||(e=this.renderSeparator(l,d),h&&p(e,l,d),l+=q(e,d)),a[r.level]={button:b,separator:e,updated:!0});b&&b.setState(c?2:0)}}}C.defaultOptions=a.options;"";return C});l(a,"Extensions/Drilldown.js",[a["Core/Animation/AnimationUtilities.js"],a["Core/Axis/Axis.js"],a["Core/Chart/Chart.js"],a["Core/Color/Color.js"],a["Series/Column/ColumnSeries.js"],a["Core/Globals.js"],a["Core/Defaults.js"],a["Core/Series/Point.js"],a["Core/Series/Series.js"],a["Core/Series/SeriesRegistry.js"],
a["Core/Renderer/SVG/SVGRenderer.js"],a["Core/Axis/Tick.js"],a["Core/Utilities.js"],a["Extensions/Breadcrumbs/Breadcrumbs.js"]],function(a,l,p,Q,B,G,H,w,D,I,x,E,y,F){function k(c){const b=r(this.chart.options.drilldown.animation);c&&(c.hide(),M(function(){c&&c.added&&c.fadeIn()},Math.max(b.duration-50,0)))}const {animObject:r}=a,{noop:t}=G,{defaultOptions:u}=H;({seriesTypes:a}=I);const {addEvent:h,defined:C,diffObjects:f,extend:d,fireEvent:g,merge:z,objectEach:S,pick:q,removeEvent:T,syncTimeout:M}=
y;y=a.pie;a=a.map;let N=1;d(u.lang,{});u.drilldown={activeAxisLabelStyle:{cursor:"pointer",color:"#0022ff",fontWeight:"bold",textDecoration:"underline"},activeDataLabelStyle:{cursor:"pointer",color:"#0022ff",fontWeight:"bold",textDecoration:"underline"},animation:{duration:500},drillUpButton:{position:{align:"right",x:-10,y:10}},mapZooming:!0};x.prototype.Element.prototype.fadeIn=function(c){this.attr({opacity:.1,visibility:"inherit"}).animate({opacity:q(this.newOpacity,1)},c||{duration:250})};p.prototype.addSeriesAsDrilldown=
function(c,b){const e=this;if(e.mapView){c.series.isDrilling=!0;e.series.forEach(b=>{var c;b.options.inactiveOtherPoints=!0;null===(c=b.dataLabelsGroup)||void 0===c?void 0:c.destroy();delete b.dataLabelsGroup});if(e.options.drilldown&&!e.mapView.projection.hasGeoProjection&&u.drilldown){var a=f(e.options.drilldown,u.drilldown);C(a.mapZooming)||(e.options.drilldown.mapZooming=!1)}if(e.options.drilldown&&e.options.drilldown.animation&&e.options.drilldown.mapZooming){e.mapView.allowTransformAnimation=
!0;a=r(e.options.drilldown.animation);if("boolean"!==typeof a){const d=a.complete,n=function(a){a&&a.applyDrilldown&&e.mapView&&(e.addSingleSeriesAsDrilldown(c,b),e.applyDrilldown(),e.mapView.allowTransformAnimation=!1)};a.complete=function(){d&&d.apply(this,arguments);n.apply(this,arguments)}}c.zoomTo(a)}else e.addSingleSeriesAsDrilldown(c,b),e.applyDrilldown()}else e.addSingleSeriesAsDrilldown(c,b),e.applyDrilldown()};p.prototype.addSingleSeriesAsDrilldown=function(c,b){let e=c.series,a=e.xAxis,
A=e.yAxis,f,g=[],h=[],v,m,l;l=this.styledMode?{colorIndex:q(c.colorIndex,e.colorIndex)}:{color:c.color||e.color};this.drilldownLevels||(this.drilldownLevels=[]);v=e.options._levelNumber||0;(m=this.drilldownLevels[this.drilldownLevels.length-1])&&m.levelNumber!==v&&(m=void 0);b=d(d({_ddSeriesId:N++},l),b);f=e.points.indexOf(c);e.chart.series.forEach(function(b){b.xAxis===a&&(b.options._ddSeriesId=b.options._ddSeriesId||N++,b.options.colorIndex=b.colorIndex,b.options._levelNumber=b.options._levelNumber||
v,m?(g=m.levelSeries,h=m.levelSeriesOptions):(g.push(b),b.purgedOptions=z({_ddSeriesId:b.options._ddSeriesId,_levelNumber:b.options._levelNumber,selected:b.options.selected},b.userOptions),h.push(b.purgedOptions)))});c=d({levelNumber:v,seriesOptions:e.options,seriesPurgedOptions:e.purgedOptions,levelSeriesOptions:h,levelSeries:g,shapeArgs:c.shapeArgs,bBox:c.graphic?c.graphic.getBBox():{},color:c.isNull?Q.parse(l.color).setOpacity(0).get():l.color,lowerSeriesOptions:b,pointOptions:e.options.data[f],
pointIndex:f,oldExtremes:{xMin:a&&a.userMin,xMax:a&&a.userMax,yMin:A&&A.userMin,yMax:A&&A.userMax},resetZoomButton:m&&m.levelNumber===v?void 0:this.resetZoomButton},l);this.drilldownLevels.push(c);a&&a.names&&(a.names.length=0);b=c.lowerSeries=this.addSeries(b,!1);b.options._levelNumber=v+1;a&&(a.oldPos=a.pos,a.userMin=a.userMax=null,A.userMin=A.userMax=null);b.isDrilling=!0;e.type===b.type&&(b.animate=b.animateDrilldown||t,b.options.animation=!0)};p.prototype.applyDrilldown=function(){const c=this,
b=this.drilldownLevels;let e;b&&0<b.length&&(e=b[b.length-1].levelNumber,this.drilldownLevels.forEach(function(b){c.mapView&&c.options.drilldown&&c.options.drilldown.mapZooming&&(c.redraw(),b.lowerSeries.isDrilling=!1,c.mapView.fitToBounds(b.lowerSeries.bounds),b.lowerSeries.isDrilling=!0);b.levelNumber===e&&b.levelSeries.forEach(function(a,d){c.mapView?a.options&&a.options._levelNumber===e&&a.group&&(d={},c.options.drilldown&&(d=c.options.drilldown.animation),a.group.animate({opacity:0},d,function(){a.remove(!1);
b.levelSeries.filter(b=>Object.keys(b).length).length||(c.resetZoomButton&&(c.resetZoomButton.hide(),delete c.resetZoomButton),c.pointer.reset(),g(c,"afterDrilldown"),c.mapView&&(c.series.forEach(b=>{b.isDirtyData=!0;b.isDrilling=!1}),c.mapView.fitToBounds(void 0,void 0)),g(c,"afterApplyDrilldown"))})):a.options&&a.options._levelNumber===e&&a.remove(!1)})}));c.mapView||(this.resetZoomButton&&(this.resetZoomButton.hide(),delete this.resetZoomButton),this.pointer.reset(),g(this,"afterDrilldown"),this.redraw(),
g(this,"afterApplyDrilldown"))};const O=function(c){const b=[];(c=c.drilldownLevels)&&c.length&&(b[0]||b.push({level:0,levelOptions:c[0].seriesOptions}),c.forEach(function(c,a){c.levelNumber+1>b[b.length-1].level&&b.push({level:c.levelNumber+1,levelOptions:z({name:c.lowerSeries.name},c.pointOptions)})}));return b};p.prototype.drillUp=function(c){if(this.drilldownLevels&&0!==this.drilldownLevels.length){g(this,"beforeDrillUp");for(var b=this,a=b.drilldownLevels,d=a[a.length-1].levelNumber,f=b.series,
h=b.drilldownLevels.length,l=function(c,a){let e;f.forEach(function(b){b.options._ddSeriesId===c._ddSeriesId&&(e=b)});e=e||b.addSeries(c,!1);e.type===a.type&&e.animateDrillupTo&&(e.animate=e.animateDrillupTo);if(c===k.seriesPurgedOptions)return e},K=c=>{c.remove(!1);b.series.forEach(b=>{b.colorAxis&&(b.isDirtyData=!0);b.options.inactiveOtherPoints=!1});b.redraw()},v=a.length,m,k;v--;){let e,n;k=a[v];if(k.levelNumber===d){a.pop();e=k.lowerSeries;if(!e.chart)for(m=f.length;m--;)if(f[m].options.id===
k.lowerSeriesOptions.id&&f[m].options._levelNumber===d+1){e=f[m];break}e.xData=[];e.xAxis&&e.xAxis.names&&(0===h||v===h)&&(e.xAxis.names.length=0);k.levelSeriesOptions.forEach(b=>{(b=l(b,e))&&(n=b)});g(b,"drillup",{seriesOptions:k.seriesPurgedOptions||k.seriesOptions});n&&(n.type===e.type&&(n.drilldownLevel=k,n.options.animation=b.options.drilldown.animation,e.animateDrillupFrom&&e.chart&&e.animateDrillupFrom(k)),n.options._levelNumber=d);m=e;b.mapView||m.remove(!1);n&&n.xAxis&&(m=k.oldExtremes,n.xAxis.setExtremes(m.xMin,
m.xMax,!1),n.yAxis.setExtremes(m.yMin,m.yMax,!1));k.resetZoomButton&&(b.resetZoomButton=k.resetZoomButton);this.mapView?(m=b.options.drilldown&&b.options.drilldown.animation&&b.options.drilldown.mapZooming,k.levelNumber===d&&c?e.remove(!1):(e.dataLabelsGroup&&(e.dataLabelsGroup.destroy(),delete e.dataLabelsGroup),b.mapView&&n&&(m&&(e.isDrilling=!0,n.isDrilling=!0,b.redraw(!1),b.mapView.fitToBounds(e.bounds,void 0,!0,!1)),b.mapView.allowTransformAnimation=!0,g(b,"afterDrillUp",{seriesOptions:n?n.userOptions:
void 0}),m?b.mapView.setView(void 0,1,!0,{complete:function(){Object.prototype.hasOwnProperty.call(this,"complete")&&K(e)}}):(b.mapView.allowTransformAnimation=!1,e.group?e.group.animate({opacity:0},b.options.drilldown.animation,function(){K(e);b.mapView&&(b.mapView.allowTransformAnimation=!0)}):(K(e),b.mapView.allowTransformAnimation=!0)),n.isDrilling=!1,b.ddDupes&&(b.ddDupes.length=0),g(b,"drillupall")))):(g(b,"afterDrillUp"),this.redraw(),this.ddDupes&&(this.ddDupes.length=0),g(b,"drillupall"))}}}};
h(p,"afterInit",function(){const c=this;c.drilldown={chart:c,fadeInGroup:k,update:function(b,e){z(!0,c.options.drilldown,b);q(e,!0)&&c.redraw()}}});h(p,"render",function(){(this.xAxis||[]).forEach(function(c){c.ddPoints={};c.series.forEach(function(b){let e,a=b.xData||[],d=b.points;for(e=0;e<a.length;e++){var f=b.options.data[e];"number"!==typeof f&&(f=b.pointClass.prototype.optionsToObject.call({series:b},f),f.drilldown&&(c.ddPoints[a[e]]||(c.ddPoints[a[e]]=[]),f=e-(b.cropStart||0),c.ddPoints[a[e]].push(d&&
0<=f&&f<d.length?d[f]:!0)))}});S(c.ticks,E.prototype.drillable)})});h(F,"up",function(c){const b=this.chart;c=this.getLevel()-c.newLevel;let e=1<c;for(let a=0;a<c;a++)a===c-1&&(e=!1),b.drillUp(e)});h(p,"afterDrilldown",function(){var c=this.options.drilldown;c=c&&c.breadcrumbs;this.breadcrumbs||(this.breadcrumbs=new F(this,c));this.breadcrumbs.updateProperties(O(this))});h(p,"afterDrillUp",function(){this.breadcrumbs&&this.breadcrumbs.updateProperties(O(this))});h(p,"update",function(c){const b=this.breadcrumbs,
a=c.options.drilldown&&c.options.drilldown.breadcrumbs;b&&a&&b.update(c.options.drilldown.breadcrumbs)});B.prototype.animateDrillupTo=function(c){if(!c){const b=this,c=b.drilldownLevel;this.points.forEach(function(b){const c=b.dataLabel;b.graphic&&b.graphic.hide();c&&(c.hidden="hidden"===c.attr("visibility"),c.hidden||(c.hide(),b.connector&&b.connector.hide()))});M(function(){if(b.points){let a=[];b.data.forEach(function(b){a.push(b)});b.nodes&&(a=a.concat(b.nodes));a.forEach(function(b,a){a=a===
(c&&c.pointIndex)?"show":"fadeIn";const e="show"===a?!0:void 0,d=b.dataLabel;if(b.graphic&&b.visible)b.graphic[a](e);d&&!d.hidden&&(d.fadeIn(),b.connector&&b.connector.fadeIn())})}},Math.max(this.chart.options.drilldown.animation.duration-50,0));delete this.animate}};B.prototype.animateDrilldown=function(c){let b=this,a=this.chart,f=a.drilldownLevels,g,h=r(a.options.drilldown.animation),k=this.xAxis,l=a.styledMode;c||(f.forEach(function(a){b.options._ddSeriesId===a.lowerSeriesOptions._ddSeriesId&&
(g=a.shapeArgs,l||(g.fill=a.color))}),g.x+=q(k.oldPos,k.pos)-k.pos,this.points.forEach(function(a){const c=a.shapeArgs;l||(c.fill=a.color);a.graphic&&a.graphic.attr(g).animate(d(a.shapeArgs,{fill:a.color||b.color}),h)}),a.drilldown&&a.drilldown.fadeInGroup(this.dataLabelsGroup),delete this.animate)};B.prototype.animateDrillupFrom=function(a){let b=r(this.chart.options.drilldown.animation),c=this.group,d=c!==this.chart.columnGroup,f=this;f.trackerGroups.forEach(function(b){if(f[b])f[b].on("mouseover")});
d&&delete this.group;this.points.forEach(function(e){const g=e.graphic,h=a.shapeArgs,n=function(){g.destroy();c&&d&&(c=c.destroy())};g&&h&&(delete e.graphic,f.chart.styledMode||(h.fill=a.color),b.duration?g.animate(h,z(b,{complete:n})):(g.attr(h),n()))})};y&&d(y.prototype,{animateDrillupTo:B.prototype.animateDrillupTo,animateDrillupFrom:B.prototype.animateDrillupFrom,animateDrilldown:function(a){const b=this.chart.drilldownLevels[this.chart.drilldownLevels.length-1],c=this.chart.options.drilldown.animation;
this.is("item")&&(c.duration=0);if(this.center){const e=b.shapeArgs,d=e.start,f=(e.end-d)/this.points.length,g=this.chart.styledMode;a||(this.points.forEach(function(a,h){const n=a.shapeArgs;g||(e.fill=b.color,n.fill=a.color);if(a.graphic)a.graphic.attr(z(e,{start:d+h*f,end:d+(h+1)*f}))[c?"animate":"attr"](n,c)}),this.chart.drilldown&&this.chart.drilldown.fadeInGroup(this.dataLabelsGroup),delete this.animate)}}});a&&d(a.prototype,{animateDrilldown(a){const b=this,c=this.chart,d=this.group;c&&d&&b.options&&
(a&&c.mapView?(d.attr({opacity:.01}),c.mapView.allowTransformAnimation=!1,b.options.inactiveOtherPoints=!0,b.options.enableMouseTracking=!1):(d.animate({opacity:1},c.options.drilldown.animation,function(){b.options&&(b.options.inactiveOtherPoints=!1,b.options.enableMouseTracking=q(b.userOptions&&b.userOptions.enableMouseTracking,!0),b.isDirty=!0,c.redraw())}),c.drilldown&&c.drilldown.fadeInGroup(this.dataLabelsGroup)))},animateDrillupFrom(){const a=this.chart;a&&a.mapView&&(a.mapView.allowTransformAnimation=
!1);this.options&&(this.options.inactiveOtherPoints=!0)},animateDrillupTo(a){const b=this.chart,c=this.group;b&&c&&(a?(c.attr({opacity:.01}),this.options&&(this.options.inactiveOtherPoints=!0)):(c.animate({opacity:1},b.options.drilldown.animation),b.drilldown&&b.drilldown.fadeInGroup(this.dataLabelsGroup)))}});w.prototype.doDrilldown=function(){this.runDrilldown()};w.prototype.runDrilldown=function(a,b,e){const c=this.series.chart,d=c.options.drilldown;let f=(d.series||[]).length,h;c.ddDupes||(c.ddDupes=
[]);for(;f--&&!h;)d.series[f].id===this.drilldown&&-1===c.ddDupes.indexOf(this.drilldown)&&(h=d.series[f],c.ddDupes.push(this.drilldown));g(c,"drilldown",{point:this,seriesOptions:h,category:b,originalEvent:e,points:"undefined"!==typeof b&&this.series.xAxis.getDDPoints(b).slice(0)},function(b){const c=b.point.series&&b.point.series.chart,e=b.seriesOptions;c&&e&&(a?c.addSingleSeriesAsDrilldown(b.point,e):c.addSeriesAsDrilldown(b.point,e))})};l.prototype.drilldownCategory=function(a,b){this.getDDPoints(a).forEach(function(c){c&&
c.series&&c.series.visible&&c.runDrilldown&&c.runDrilldown(!0,a,b)});this.chart.applyDrilldown()};l.prototype.getDDPoints=function(a){return this.ddPoints&&this.ddPoints[a]||[]};E.prototype.drillable=function(){const a=this.pos,b=this.label,e=this.axis,d="xAxis"===e.coll&&e.getDDPoints,f=d&&e.getDDPoints(a),g=e.chart.styledMode;d&&(b&&f&&f.length?(b.drillable=!0,b.basicStyles||g||(b.basicStyles=z(b.styles)),b.addClass("highcharts-drilldown-axis-label"),b.removeOnDrillableClick&&T(b.element,"click"),
b.removeOnDrillableClick=h(b.element,"click",function(b){b.preventDefault();e.drilldownCategory(a,b)}),g||b.css(e.chart.options.drilldown.activeAxisLabelStyle)):b&&b.drillable&&b.removeOnDrillableClick&&(g||(b.styles={},b.element.removeAttribute("style"),b.css(b.basicStyles)),b.removeOnDrillableClick(),b.removeClass("highcharts-drilldown-axis-label")))};h(w,"afterInit",function(){this.drilldown&&!this.unbindDrilldownClick&&(this.unbindDrilldownClick=h(this,"click",P));return this});h(w,"update",function(a){a=
a.options||{};a.drilldown&&!this.unbindDrilldownClick?this.unbindDrilldownClick=h(this,"click",P):!a.drilldown&&void 0!==a.drilldown&&this.unbindDrilldownClick&&(this.unbindDrilldownClick=this.unbindDrilldownClick())});const P=function(a){const b=this.series;b.xAxis&&!1===b.chart.options.drilldown.allowPointDrilldown?b.xAxis.drilldownCategory(this.x,a):this.runDrilldown(void 0,void 0,a)};h(D,"afterDrawDataLabels",function(){const a=this.chart.options.drilldown.activeDataLabelStyle,b=this.chart.renderer,
d=this.chart.styledMode;this.points.forEach(function(c){const e=c.options.dataLabels,f=q(c.dlOptions,e&&e.style,{});c.drilldown&&c.dataLabel&&("contrast"!==a.color||d||(f.color=b.getContrast(c.color||this.color)),e&&e.color&&(f.color=e.color),c.dataLabel.addClass("highcharts-drilldown-data-label"),d||c.dataLabel.css(a).css(f))},this)});const J=function(a,b,d,f){a[d?"addClass":"removeClass"]("highcharts-drilldown-point");f||a.css({cursor:b})};h(D,"afterDrawTracker",function(){const a=this.chart.styledMode;
this.points.forEach(function(b){b.drilldown&&b.graphic&&J(b.graphic,"pointer",!0,a)})});h(w,"afterSetState",function(){const a=this.series.chart.styledMode;this.drilldown&&this.series.halo&&"hover"===this.state?J(this.series.halo,"pointer",!0,a):this.series.halo&&J(this.series.halo,"auto",!1,a)});h(p,"drillup",function(){this.resetZoomButton&&(this.resetZoomButton=this.resetZoomButton.destroy())});h(p,"drillupall",function(){this.resetZoomButton&&this.showResetZoom()})});l(a,"masters/modules/drilldown.src.js",
[a["Core/Globals.js"],a["Extensions/Breadcrumbs/Breadcrumbs.js"]],function(a,k){a.Breadcrumbs=k;k.compose(a.Chart,a.defaultOptions)})});
//# sourceMappingURL=drilldown.js.map