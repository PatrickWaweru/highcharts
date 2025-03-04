Types of components
===

Components are the building blocks of the dashboard layout. There are several types of components, which you can use out of the box. Some of them come with a default configuration (KPI, Highcharts, DataGrid), and some components are completely flexible, so that you can configure them all by yourself (HTMLComponent). You define which type of component you want to use by defining its `type` property in the configuration object.
Each component apart from the most basic one, which is HTMLComponent, needs to be imported with the `dashboards-plugin.js` module.

Here is the overview of most important parameters, that can be defined for a component:
* `Id` - The unique id of the component, which is later used to identify it by dashboard and/or used to set CSS styles.
* `Cell` - id of the cell, in which the component should be placed
* `Class` - CSS class
* `Type` - the type of the component.
* `Events` - object containing a pair of name of the event and callback function that should be called on a given event. The list of events can be found in the API Reference but the most common one is `mount`.
* `Sync` - list of events, which should be synchronized between components.

### HTML Component
The most basic and generic component type. Allows you to add everything which could be defined as HTML, as well as add some custom events, but requires the most configuration. The configuration is AST-like, where you can define the name of the tag, its attributes, and nested children elements. [Check out the basic HTML component demo here.](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/components/component-html)

Code snippet:
``` JS
    {
        type: 'html',
        cell: 'dashboard-1',
        elements: [{
            tagName: 'img',
            attributes: {
                src: 'https://www.highcharts.com/samples/graphics/stock-dark.svg'
            }
        }]
    }
```
Also please check the [Custom Component](http://www.highcharts.com/docs/dashboards/custom-component) section below, where you can find alternative ways to create HTML components.

### Highcharts Component
The option to include a Highcharts chart in one of the components is available out of the box. Here is the set of files that need to be included to make the Highcharts component work.
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/dashboards-plugin.js"></script>
```

Also the set of CSS styles needs to be imported, so that the Highcharts displays correctly.
```css
    @import url("https://code.highcharts.com/css/highcharts.css");
```

The last thing that you have to do is to specify the `type: 'Highcharts'` in the component’s config and that’s it. All of the charts options can be defined in the `chartOptions` object. You can either define static data, as you would do in the basic highcharts chart, or use the store <LINK TO STORE> to connect some dynamic data. The data gets parsed through the `columnAssignment` option to map correct values from the store to reflect them in the series. 
[Here is the example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demo/component-highcharts). The null value keeps columns selectively out of the chart.

### DataGrid Component
To visualize data in a row column format you can use the DataGrid component. Same as in Highcharts component, first, it needs to be imported. Here is the set of files.
```html
    <script src="https://code.highcharts.com/dashboards.js"></script>
    <script src="https://code.highcharts.com/datagrid.js"></script>
    <script src="https://code.highcharts.com/modules/dashboards-plugin.js"></script>
```

Also the set of CSS styles needs to be imported, so that the DataGrid displays correctly.
```css
    @import url("https://code.highcharts.com/css/datagrid.css");
```
Then you need to specify the component type with `type: 'DataGrid'`.
If you connect this component to the store, the content of the component will be automatically filled with data, and will allow the user to change the data in the store and automatically in all components that also are connected to this store, by editing values in the cell. [Here is the example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/samples/dashboards/demo/datagrid-sync)

### KPI Component
Another type of component type that allows you to visualize key performance indicators is KPIComponent. This component type is added with the dashboard package, so nothing apart from the basic dashboards package needs to be imported.
You can define the threshold to change the style of the component, when one value exceeds it and some other useful features to better show what is important to you.

[Here is the example](http://utils.highcharts.local/samples/#view/dashboards/demo/component-kpi)

Code snippet:
``` JS
   {
        cell: 'kpi-00',
        type: 'KPI',
        title: 'Average revenue',
        value: 888,
        threshold: [200, 800],
        thresholdColors: ['#f45b5b', '#f7a35c', '#90ed7d']
    },
```

### Component groups

Components can be assigned to groups. Groups are used to synchronize the state of components.

via
```js
    group.addComponents(...componentIDs);
```

or
```js
    component.setActiveGroup(groupOrGroupIDOrNull)
```

Groups which have shared state can be accessible via
```js
    component.activeGroup.getSharedState()
```
Also you can post data between components in the same group via `postMessage` method.
```js
    component.postMessage('hello world');
```

### Component errors
Components have built-in error handling that displays "Something went wrong" as a component title. In the developer's console, you have error details.

The error title has also a specific class that allows you to customize styles.
```css
    .highcharts-dashboards-component-title-error
```