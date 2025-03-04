/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Board from '../Board';
import type Cell from '../Layout/Cell';
import type { ComponentConnectorOptions } from './ComponentOptions';
import type {
    ComponentType,
    ComponentTypeRegistry
} from './ComponentType';
import type JSON from '../JSON';
import type NavigationBindingsOptionsObject from
    '../../Extensions/Annotations/NavigationBindingsOptions';
import type Serializable from '../Serializable';

import type DataModifier from '../../Data/Modifiers/DataModifier';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type TextOptions from './TextOptions';
import type Row from '../Layout/Row';

import CallbackRegistry from '../CallbackRegistry.js';
import DataConnector from '../../Data/Connectors/DataConnector.js';
import DG from '../Globals.js';
const {
    classNamePrefix
} = DG;
import DataTable from '../../Data/DataTable.js';
import EditableOptions from './EditableOptions.js';
import U from '../../Core/Utilities.js';
const {
    createElement,
    isArray,
    merge,
    fireEvent,
    addEvent,
    objectEach,
    isFunction,
    getStyle,
    relativeLength
} = U;

import CU from './ComponentUtilities.js';
const {
    getMargins,
    getPaddings
} = CU;
import ComponentGroup from './ComponentGroup.js';
import DU from '../Utilities.js';
const { uniqueKey } = DU;
import Sync from './Sync/Sync.js';
import ComponentRegistry from './ComponentRegistry.js';

/* *
 *
 *  Class
 *
 * */

/**
 *
 * Abstract Class of component.
 *
 * @internal
 *
 */

/**
 * Abstract Class of component.
 * @internal
 */
abstract class Component {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     *
     * Creates HTML text element like header or title
     *
     * @param tagName
     * HTML tag name used as wrapper of text like `h1`, `h2` or `p`.
     * @param elementName
     * Name of element
     * @param textOptions
     * The options for the component
     * @returns
     * HTML object when title is created, otherwise undefined
     *
     * @internal
     */
    public static createTextElement(
        tagName: string,
        elementName: string,
        textOptions: Component.TextOptionsType
    ): HTMLElement | undefined {
        if (typeof textOptions === 'object') {
            const { className, text, style } = textOptions;
            return createElement(tagName, {
                className: className || `${classNamePrefix}component-${elementName}`,
                textContent: text
            }, style);
        }

        if (typeof textOptions === 'string') {
            return createElement(tagName, {
                className: `${classNamePrefix}component-${elementName}`,
                textContent: textOptions
            });
        }
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public static Sync = Sync;
    /**
     * Default options of the component.
     */
    public static defaultOptions: Partial<Component.ComponentOptions> = {
        className: `${classNamePrefix}component`,
        parentElement: document.body,
        id: '',
        title: false,
        caption: false,
        style: {
            display: 'flex',
            'flex-direction': 'column'
        },
        sync: Sync.defaultHandlers,
        editableOptions: [{
            name: 'connectorName',
            propertyPath: ['connector', 'id'],
            type: 'select'
        }, {
            name: 'title',
            propertyPath: ['title'],
            type: 'input'
        }, {
            name: 'caption',
            propertyPath: ['caption'],
            type: 'input'
        }]
    };
    /**
     * The HTML element or id of HTML element that is used for appending
     * a component.
     *
     * @internal
     */
    public parentElement: HTMLElement;
    /**
     * Instance of cell, where component is attached.
     *
     * @internal
     */
    public cell: Cell;
    /**
     * Connector that allows you to load data via URL or from a local source.
     */
    public connector?: Component.ConnectorTypes;
    /**
     * The id of the connector in the data pool to use.
     */
    protected connectorId?: string;
    /**
     * @internal
     * The board the component belongs to
     * */
    public board: Board;
    /**
     * Size of the component (width and height).
     */
    protected dimensions: { width: number | null; height: number | null };
    /**
     * The HTML element where the component is.
     *
     * @internal
     */
    public element: HTMLElement;
    /**
     * The HTML element where the title is.
     */
    public titleElement?: HTMLElement;
    /**
     * The HTML element where the caption is.
     */
    public captionElement?: HTMLElement;
    /**
     * The HTML element where the component's content is.
     *
     * @internal
     */
    public contentElement: HTMLElement;
    /**
     * The options for the component.
     * */
    public options: Component.ComponentOptions;
    /**
     * The type of component like: `HTML`, `KPI`, `Highcharts`, `DataGrid`.
     */
    /**
     * Sets an ID for the component's `div`.
     */
    public id: string;
    /**
     * An array of options marked as editable by the UI.
     *
     */
    public editableOptions: EditableOptions;
    /**
     * Registry of callbacks registered on the component. Used in the Highcharts
     * component to keep track of chart events.
     *
     * @internal
     */
    public callbackRegistry = new CallbackRegistry();
    /**
     * The interval for redrawing the component on data changes.
     * @internal
     */
    private tableEventTimeout?: number;
    /**
     * Event listeners tied to the current DataTable. Used for redrawing the
     * component on data changes.
     *
     * @internal
     */
    private tableEvents: Function[] = [];
    /**
     * Event listeners tied to the parent cell. Used for redrawing/resizing the
     * component on interactions.
     *
     * @internal
     */
    private cellListeners: Function[] = [];

    /**
     * @internal
     */
    protected hasLoaded: boolean;
    /**
     * @internal
     */
    protected shouldRedraw: boolean;
    /**
     * @internal
     */
    protected syncHandlers: Sync.OptionsRecord;

    /**
     * DataModifier that is applied on top of modifiers set on the DataStore.
     *
     * @internal
     */
    public presentationModifier?: DataModifier;
    /**
     * The table being presented, either a result of the above or a way to
     * modify the table via events.
     *
     * @internal
     */
    public presentationTable?: DataTable;

    /**
     * The active group of the component. Used for sync.
     *
     * @internal
     */
    public activeGroup: ComponentGroup | undefined = void 0;

    /** @internal */
    public abstract sync: Sync;

    /**
     * Timeouts for calls to `Component.resizeTo()`.
     *
     * @internal
    /* *
     */
    protected resizeTimeouts: number[] = [];

    /**
     * Timeouts for resizing the content. I.e. `chart.setSize()`.
     *
     * @internal
     * */
    protected innerResizeTimeouts: number[] = [];

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Creates a component in the cell.
     *
     * @param cell
     * Instance of cell, where component is attached.
     *
     * @param options
     * The options for the component.
     */
    constructor(
        cell: Cell,
        options: Partial<Component.ComponentOptions>
    ) {
        this.board = cell.row.layout.board;

        this.cell = cell;
        // TODO: Change the TS of cell.
        this.parentElement = cell.container!;
        this.attachCellListeneres();


        this.options = merge(
            Component.defaultOptions as Required<Component.ComponentOptions>,
            options
        );
        this.id = this.options.id && this.options.id.length ?
            this.options.id :
            uniqueKey();

        // Todo: we might want to handle this later

        this.hasLoaded = false;
        this.shouldRedraw = true;
        this.editableOptions =
            new EditableOptions(this, options.editableOptionsBindings);

        this.presentationModifier = this.options.presentationModifier;

        // Initial dimensions
        this.dimensions = {
            width: null,
            height: null
        };


        this.syncHandlers = this.handleSyncOptions();
        this.element = createElement('div', {
            className: this.options.className
        });

        this.contentElement = createElement('div', {
            className: `${this.options.className}-content`
        }, {
            height: '100%'
        }, void 0, true);

    }

    /**
     * Inits connectors for the component and redraws it.
     *
     * @returns
     * Promise resolviing to the component.
     */
    public async initConnector(): Promise<this> {
        if (
            this.options.connector?.id &&
            this.connectorId !== this.options.connector.id
        ) {
            const connector = await this.board.dataPool
                .getConnector(this.options.connector.id);

            this.setConnector(connector);
            this.shouldRedraw = true;
            this.redraw();
        }
        return this;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
    * Handles the sync options. Applies the given defaults if no
    * specific callback given.
    *
    * @param defaultHandlers
    * Sync handlers on component.
    *
    * @returns
    * Sync component.
    *
    * @internal
    */
    protected handleSyncOptions(
        defaultHandlers: typeof Sync.defaultHandlers = Sync.defaultHandlers
    ): Component['syncHandlers'] {
        const sync = this.options.sync || {};

        return Object.keys(sync)
            .reduce(
                (
                    carry: Sync.OptionsRecord,
                    handlerName
                ): Sync.OptionsRecord => {
                    if (handlerName) {
                        const handler = sync[handlerName];

                        if (handler && typeof handler === 'object') {
                            carry[handlerName] = handler;
                        }
                        if (handler && typeof handler === 'boolean') {
                            carry[handlerName] = defaultHandlers[handlerName];
                        }
                    }

                    return carry;
                },
                {}
            );
    }

    /**
     * Setup listeners on cell/other things up the chain
     *
     * @internal
     */
    private attachCellListeneres(): void {
        // remove old listeners
        while (this.cellListeners.length) {
            const destroy = this.cellListeners.pop();
            if (destroy) {
                destroy();
            }
        }

        if (this.cell && Object.keys(this.cell).length) {
            const board = this.cell.row.layout.board;
            this.cellListeners.push(
                // Listen for resize on dashboard
                addEvent(board, 'cellResize', (): void => {
                    this.resizeTo(this.parentElement);
                }),
                // Listen for changed parent
                addEvent(
                    this.cell.row,
                    'cellChange',
                    (e: { row: Row }): void => {
                        const { row } = e;
                        if (row && this.cell) {
                            const hasLeftTheRow =
                                row.getCellIndex(this.cell) === void 0;
                            if (hasLeftTheRow) {
                                if (this.cell) {
                                    this.setCell(this.cell);
                                }
                            }
                        }
                    }
                )
            );

        }
    }

    /**
     * Set a parent cell.
     * @param cell
     * Instance of a cell.
     * @param resize
     * Flag that allow to resize the component.
     *
     * @internal
     */
    public setCell(cell: Cell, resize = false): void {
        this.cell = cell;
        if (cell.container) {
            this.parentElement = cell.container;
        }
        this.attachCellListeneres();
        if (resize) {
            this.resizeTo(this.parentElement);
        }
    }

    /**
     * Adds event listeners to data table.
     * @param table
     * Data table that is source of data.
     * @internal
     */
    private setupTableListeners(table: DataTable): void {
        const connector = this.connector;

        if (connector) {
            if (table) {
                [
                    'afterSetRows',
                    'afterDeleteRows',
                    'afterSetColumns',
                    'afterDeleteColumns',
                    'afterSetCell'
                ].forEach((event: any): void => {
                    this.tableEvents.push((table)
                        .on(event, (e: any): void => {
                            clearInterval(this.tableEventTimeout);
                            this.tableEventTimeout = setTimeout((): void => {
                                this.emit({
                                    ...e,
                                    type: 'tableChanged'
                                });
                                this.tableEventTimeout = void 0;
                            }, 0);
                        }));
                });
            }


            const component = this;
            this.tableEvents.push(connector.on('afterLoad', (): void => {
                this.emit({
                    target: component,
                    type: 'tableChanged'
                });
            }));
        }
    }

    /**
     * Remove event listeners in data table.
     * @internal
     */
    private clearTableListeners(): void {
        const connector = this.connector,
            tableEvents = this.tableEvents;

        if (tableEvents.length) {
            tableEvents.forEach(
                (removeEventCallback): void => removeEventCallback()
            );
        }

        if (connector) {
            tableEvents.push(connector.table.on(
                'afterSetModifier',
                (e): void => {
                    if (e.type === 'afterSetModifier') {
                        this.emit({
                            ...e,
                            type: 'tableChanged'
                        });
                    }
                }
            ));
        }
    }

    /**
     * Attaches data store to the component.
     * @param connector
     * Connector of data.
     *
     * @returns
     * Component which can be used in chaining.
     *
     * @internal
     */
    public setConnector(connector: Component.ConnectorTypes | undefined): this {

        fireEvent(this, 'setConnector', { connector });

        // Clean up old event listeners
        while (this.tableEvents.length) {
            const eventCallback = this.tableEvents.pop();
            if (typeof eventCallback === 'function') {
                eventCallback();
            }
        }

        this.connector = connector;

        if (connector) {
            // Set up event listeners
            this.clearTableListeners();
            this.setupTableListeners(connector.table);

            // re-setup if modifier changes
            connector.table.on(
                'setModifier',
                (): void => this.clearTableListeners()
            );
            connector.table.on(
                'afterSetModifier',
                (e: DataTable.SetModifierEvent): void => {
                    if (e.type === 'afterSetModifier' && e.modified) {
                        this.setupTableListeners(e.modified);
                    }
                }
            );


            // Add the component to a group based on the
            // connector table id by default
            // TODO: make this configurable
            const tableID = connector.table.id;

            if (!ComponentGroup.getComponentGroup(tableID)) {
                ComponentGroup.addComponentGroup(new ComponentGroup(tableID));
            }

            const group = ComponentGroup.getComponentGroup(tableID);
            if (group) {
                group.addComponents([this.id]);
                this.activeGroup = group;
            }
        }

        fireEvent(this, 'afterSetConnector', { connector });

        return this;
    }

    /** @internal */
    setActiveGroup(group: ComponentGroup | string | null): void {
        if (typeof group === 'string') {
            group = ComponentGroup.getComponentGroup(group) || null;
        }
        if (group instanceof ComponentGroup) {
            this.activeGroup = group;
        }
        if (group === null) {
            this.activeGroup = void 0;
        }
        if (this.activeGroup) {
            this.activeGroup.addComponents([this.id]);
        }
    }
    /**
     * Gets height of the component's content.
     *
     * @returns
     * Current height as number.
     * @internal
     */
    private getContentHeight(): number {
        const parentHeight =
            this.dimensions.height || Number(getStyle(this.element, 'height'));
        const titleHeight = this.titleElement ?
            this.titleElement.clientHeight + getMargins(this.titleElement).y :
            0;
        const captionHeight = this.captionElement ?
            this.captionElement.clientHeight +
            getMargins(this.captionElement).y :
            0;

        return parentHeight - titleHeight - captionHeight;
    }

    /**
     * Resize the component
     * @param width
     * The width to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style
     * @param height
     * The height to set the component to.
     * Can be pixels, a percentage string or null.
     * Null will unset the style.
     */
    public resize(
        width?: number | string | null,
        height?: number | string | null
    ): void {
        if (height) {
            // Get offset for border, padding
            const pad =
                getPaddings(this.element).y + getMargins(this.element).y;

            this.dimensions.height = relativeLength(
                height, Number(getStyle(this.parentElement, 'height'))
            ) - pad;
            this.element.style.height = this.dimensions.height + 'px';
            this.contentElement.style.height = this.getContentHeight() + 'px';
        }
        if (width) {
            const pad =
                getPaddings(this.element).x + getMargins(this.element).x;
            this.dimensions.width = relativeLength(
                width, Number(getStyle(this.parentElement, 'width'))
            ) - pad;
            this.element.style.width = this.dimensions.width + 'px';
        }

        if (height === null) {
            this.dimensions.height = null;
            this.element.style.removeProperty('height');
        }

        if (width === null) {
            this.dimensions.width = null;
            this.element.style.removeProperty('width');
        }

        fireEvent(this, 'resize', {
            width,
            height
        });
    }

    /**
     * Adjusts size of component to parent's cell size when animation is done.
     * @param element
     * HTML element that is resized.
     */
    public resizeTo(element: HTMLElement): void {
        while (this.resizeTimeouts.length) {
            const timeout = this.resizeTimeouts.pop();
            if (timeout) {
                cancelAnimationFrame(timeout);
            }
        }
        const timeoutID = requestAnimationFrame((): void => {
            const { width, height } = element.getBoundingClientRect();
            const padding = getPaddings(element);
            const margins = getMargins(element);

            this.resize(
                width - padding.x - margins.x,
                height - padding.y - margins.y
            );
        });

        this.resizeTimeouts.push(timeoutID);
    }

    /**
     * Handles updating via options.
     * @param newOptions
     * The options to apply.
     *
     * @param redraw
     * Set to true if the update should redraw the component.
     */
    public async update(
        newOptions: Partial<Component.ComponentOptions>,
        redraw: boolean = true
    ): Promise<void> {
        const eventObject = {
            options: newOptions,
            shouldForceRedraw: false
        };

        // Update options
        fireEvent(this, 'update', eventObject);

        this.options = merge(this.options, newOptions);

        if (
            this.options.connector?.id &&
            this.connectorId !== this.options.connector.id
        ) {
            const connector = await this.board.dataPool
                .getConnector(this.options.connector.id);

            this.setConnector(connector);
            this.shouldRedraw = true;
        }

        this.options = merge(this.options, newOptions);

        if (redraw || eventObject.shouldForceRedraw) {
            this.redraw();
        }

    }

    /**
     * Adds title at the top of component's container.
     * @param titleOptions
     * The options for the title.
     */
    public setTitle(titleOptions: Component.TextOptionsType): void {
        const previousTitle = this.titleElement;

        if (
            !titleOptions || typeof titleOptions === 'string' ?
                titleOptions === '' :
                titleOptions.text === ''
        ) {
            if (previousTitle) {
                previousTitle.remove();
            }
            return;
        }

        const titleElement =
            Component.createTextElement('h1', 'title', titleOptions);

        if (titleElement) {
            this.titleElement = titleElement;

            if (previousTitle) {
                previousTitle.replaceWith(this.titleElement);
            }
        }
    }

    /**
     * Adds caption at the bottom of component's container.
     *
     * @param captionOptions
     * The options for the caption.
     */
    public setCaption(captionOptions: Component.TextOptionsType): void {
        const previousCaption = this.captionElement;
        if (
            !captionOptions ||
                typeof captionOptions === 'string' ?
                captionOptions === '' :
                captionOptions.text === ''
        ) {
            if (previousCaption) {
                previousCaption.remove();
            }
            return;
        }

        const captionElement =
            Component.createTextElement('div', 'caption', captionOptions);

        if (captionElement) {
            this.captionElement = captionElement;

            if (previousCaption) {
                previousCaption.replaceWith(this.captionElement);
            }
        }
    }

    /**
     * Handles setting things up on initial render.
     *
     * @returns
     * The component for chaining.
     *
     * @internal
     */
    public load(): this {

        // Set up the connector on inital load if it has not been done
        if (!this.hasLoaded && this.connector) {
            this.setConnector(this.connector);
        }

        this.setTitle(this.options.title);
        this.setCaption(this.options.caption);
        [
            this.titleElement,
            this.contentElement,
            this.captionElement
        ].forEach((element): void => {
            if (element) {
                this.element.appendChild(element);
            }
        });
        // Setup event listeners
        // Grabbed from Chart.ts
        const events = this.options.events;
        if (events) {
            Object.keys(events).forEach((key): void => {
                const eventCallback = (events as any)[key];
                if (eventCallback) {
                    this.callbackRegistry.addCallback(key, {
                        type: 'component',
                        func: eventCallback
                    });
                }
            });
            objectEach(events, (eventCallback, eventType): void => {
                if (isFunction(eventCallback)) {
                    this.on(eventType as any, eventCallback as any);
                }
            });
        }

        this.on('message', (e): void => {
            if ('message' in e) {
                this.onMessage(e.message);
            }
        });

        // TODO: should cleanup this event listener
        window.addEventListener(
            'resize',
            (): void => this.resizeTo(this.parentElement)
        );

        this.hasLoaded = true;
        this.shouldRedraw = false;

        return this;
    }

    /**
     * Renders the component.
     *
     * @returns
     * The component for chaining.
     *
     * @internal
     */
    public render(): this {
        /**
         * TODO: make this call load on initial render
         */
        if (this.shouldRedraw || !this.hasLoaded) {
            this.load();
            // Call resize to fit to the cell.
            this.resizeTo(this.parentElement);
        }
        return this;
    }

    /**
     * Redraws the component.
     * @returns
     * The component for chaining.
     */
    public redraw(): this {
        // Do a redraw
        const e = {
            component: this
        };

        fireEvent(this, 'redraw', e);

        this.shouldRedraw = true; // set to make render call load as well

        return this.render();
    }

    /**
     * Destroys the component.
     */
    public destroy(): void {
        /**
         * TODO: Should perhaps also remove the component from the registry
         * or set an `isactive` flag to false.
         */

        while (this.element.firstChild) {
            this.element.firstChild.remove();
        }
        // Unregister events
        this.tableEvents.forEach((eventCallback): void => eventCallback());
        this.element.remove();

        Component.removeInstance(this);
    }

    /** @internal */
    public on<TEvent extends Component.EventTypes>(
        type: TEvent['type'],
        callback: (this: this, e: TEvent) => void
    ): Function {
        return addEvent(this, type, callback);
    }

    /** @internal */
    public emit<TEvent extends Component.EventTypes>(
        e: TEvent
    ): void {
        if (!e.target) {
            e.target = this;
        }
        fireEvent(this, e.type, e);
    }

    /** @internal */
    public postMessage(
        message: Component.MessageType,
        target: Component.MessageTarget = {
            type: 'componentType',
            target: 'all'
        }
    ): void {
        const component = Component.getInstanceById(this.id);

        if (component) {
            Component.relayMessage(component, message, target);
        }
    }

    /** @internal */
    public onMessage(message: Component.MessageType): void {
        if (message && typeof message === 'string') {
            // do something
            return;
        }

        if (
            typeof message === 'object' &&
            typeof message.callback === 'function'
        ) {
            message.callback.apply(this);
        }
    }

    /**
     * Converts the class instance to a class JSON.
     * @internal
     *
     * @returns
     * Class JSON of this Component instance.
     *
     * @internal
     */
    public toJSON(): Component.JSON {
        const dimensions: Record<'width' | 'height', number> = {
            width: 0,
            height: 0
        };
        objectEach(this.dimensions, function (value, key): void {
            if (value === null) {
                return;
            }
            dimensions[key] = value;
        });

        const json: Component.JSON = {
            $class: ComponentRegistry.getName(this.constructor),
            // connector: this.connector ? this.connector.toJSON() : void 0,
            options: {
                cell: this.options.cell,
                parentElement: this.parentElement.id,
                dimensions,
                id: this.id,
                type: this.type
            }
        };

        return json;
    }

    public getEditableOptions(): Component.ComponentOptions {
        const component = this;
        return merge(component.options);
    }


    public getEditableOptionValue(
        propertyPath?: string[]
    ): number | boolean | undefined | string {
        const component = this;
        if (!propertyPath) {
            return;
        }

        let result = component.getEditableOptions() as any;

        for (let i = 0, end = propertyPath.length; i < end; i++) {
            if (!result) {
                return;
            }

            if (isArray(result)) {
                result = result[0];
            }

            result = result[propertyPath[i]];
        }

        return result;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface Component {
    type: keyof ComponentTypeRegistry;
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace Component {

    /* *
    *
    *  Declarations
    *
    * */
    /** @internal */
    export interface JSON extends Serializable.JSON<string> {
        // connector?: DataConnector.ClassJSON;
        options: ComponentOptionsJSON;
    }

    /**
     * The basic events
     */
    /** @internal */
    export type EventTypes =
        SetConnectorEvent |
        ResizeEvent |
        UpdateEvent |
        TableChangedEvent |
        LoadEvent |
        RenderEvent |
        RedrawEvent |
        JSONEvent |
        MessageEvent |
        PresentationModifierEvent;

    export type SetConnectorEvent =
        Event<'setConnector'|'afterSetConnector', {}>;

    /** @internal */
    export type ResizeEvent = Event<'resize', {
        readonly type: 'resize';
        width?: number;
        height?: number;
    }>;

    /** @internal */
    export type UpdateEvent = Event<'update' | 'afterUpdate', {
        options?: ComponentOptions;
    }>;

    /** @internal */
    export type LoadEvent = Event<'load' | 'afterLoad', {}>;
    /** @internal */
    export type RedrawEvent = Event<'redraw' | 'afterRedraw', {}>;
    /** @internal */
    export type RenderEvent = Event<'beforeRender' | 'afterRender', {}>;
    /** @internal */
    export type MessageEvent = Event<'message', {
        message: MessageType;
        detail?: {
            sender: string;
            target: string;
        };
    }>;

    /** @internal */
    export type JSONEvent = Event<'toJSON' | 'fromJSON', {
        json: Serializable.JSON<string>;
    }>;
    /** @internal */
    export type TableChangedEvent = Event<'tableChanged', {}>;
    /** @internal */
    export type PresentationModifierEvent =
        Component.Event<'afterPresentationModifier', { table: DataTable }>;

    /** @internal */
    export type Event<
        EventType extends string,
        EventRecord extends Record<string, any>> = {
            readonly type: EventType;
            target?: Component;
            detail?: AnyRecord;
        } & EventRecord;

    /**
     * The sync can be an object configuration containing: `highlight`,
     * `visibility` or `extremes`.
     * ```
     * Example:
     * {
     *     highlight: true
     * }
     * ```
     *
     */
    export type SyncOptions = Record<string, boolean | Partial<Sync.OptionsEntry>>;

    export interface ComponentOptions {

        /**
         * Cell id, where component is attached.
         */
        cell?: string;

        /**
         * The HTML element or id of HTML element that is used for appending
         * a component.
         *
         * @internal
         */
        parentElement: HTMLElement | string;

        /**
         * The name of class that is applied to the component's container.
         */
        className?: string;

        /**
         * The type of component like: `HTML`, `KPI`, `Highcharts`, `DataGrid`.
         */
        type: keyof ComponentTypeRegistry;
        // allow overwriting gui elements
        /** @internal */
        navigationBindings?: NavigationBindingsOptionsObject[];
        /**
         * Events attached to the component : `mount`, `unmount`.
         */
        events?: Record<string, Function>;
        /**
         * Set of options that are available for editing through sidebar.
         */
        editableOptions: Array<EditableOptions.Options>;
        /** @internal */
        editableOptionsBindings: EditableOptions.OptionsBindings;
        /** @internal */
        presentationModifier?: DataModifier;
        /**
         * Defines which elements should be synced.
         * ```
         * Example:
         * {
         *     highlight: true
         * }
         * ```
         *
         */
        sync: SyncOptions;
        /**
         * Connector options
         */
        connector?: ComponentConnectorOptions;
        /**
         * Sets an ID for the component's container.
         */
        id?: string;
        /**
         * Additional CSS styles to apply inline to the component's container.
         */
        style?: CSSObject;
        /**
         * The component's title, which will render at the top.
         */
        title?: TextOptionsType;
        /**
         * The component's caption, which will render at the bottom.
         */
        caption?: TextOptionsType;
    }

    /**
     * JSON compatible options for export
     * @internal
     *  */
    export interface ComponentOptionsJSON extends JSON.Object {
        // connector?: DataConnector.ClassJSON; // connector id
        caption?: string;
        className?: string;
        cell?: string;
        editableOptions?: JSON.Array<string>;
        editableOptionsBindings?: EditableOptions.OptionsBindings&JSON.Object;
        id: string;
        parentCell?: Cell.JSON;
        // store?: DataStore.ClassJSON; // store id
        parentElement?: string; // ID?
        style?: {};
        sync?: SyncOptions&JSON.Object;
        title?: string;
        type: keyof ComponentTypeRegistry;
    }

    /** @internal */
    export type ConnectorTypes = DataConnector;

    export type TextOptionsType = string | false | TextOptions | undefined;
    /** @internal */
    export interface MessageTarget {
        type: 'group' | 'componentType' | 'componentID';
        target: (
            ComponentType['id'] |
            ComponentType['type'] |
            ComponentGroup['id']
        );
    }

    /** @internal */
    export type MessageType = string | {
        callback: Function;
    };

    /* *
    *
    *  Constants
    *
    * */

    /**
     *
     * Record of component instances
     *
     */
    /** @internal */
    export const instanceRegistry: Record<string, ComponentType> = {};
    /* *
    *
    *  Functions
    *
    * */

    /**
     * Adds component to the registry.
     *
     * @internal
     *
     * @internal
     * Adds a component instance to the registry.
     * @param component
     * The component to add.
     * Returns the true when component was found and added properly to the
     * registry, otherwise it is false.
     *
     * @internal
     */
    export function addInstance(component: ComponentType): void {
        Component.instanceRegistry[component.id] = component;
    }

    /**
     * Removes a component instance from the registry.
     * @param component
     * The component to remove.
     *
     * @internal
     */
    export function removeInstance(component: Component): void {
        delete Component.instanceRegistry[component.id];
    }

    /**
     * Retrieves the IDs of the registered component instances.
     * @returns
     * Array of component IDs.
     *
     * @internal
     */
    export function getAllInstanceIDs(): string[] {
        return Object.keys(instanceRegistry);
    }

    /**
     * Retrieves all registered component instances.
     * @returns
     * Array of components.
     *
     * @internal
     */
    export function getAllInstances(): Component[] {
        const ids = getAllInstanceIDs();
        return ids.map((id): Component => instanceRegistry[id]);
    }
    /**
     * Gets instance of component from registry.
     *
     * @param id
     * Component's id that exists in registry.
     *
     * @returns
     * Returns the component.
     * Gets instance of component from registry.
     *
     * @param id
     * Component's id that exists in registry.
     *
     * @returns
     * Returns the component type or undefined.
     *
     * @internal
     */
    export function getInstanceById(id: string): ComponentType | undefined {
        return instanceRegistry[id];
    }
    /**
     * Sends a message from the given sender to the target,
     * with an optional callback.
     *
     * @param sender
     * The sender of the message. Can be a Component or a ComponentGroup.
     *
     * @param message
     * The message. It can be a string, or a an object containing a
     * `callback` function.
     *
     * @param targetObj
     * An object containing the `type` of target,
     * which can be `group`, `componentID`, or `componentType`
     * as well as the id of the recipient.
     *
     * @internal
     */
    export function relayMessage(
        sender: ComponentType | ComponentGroup,
        // Are there cases where a group should be the sender?
        message: Component.MessageEvent['message'],
        targetObj: Component.MessageTarget
    ): void {
        const emit = (component: ComponentType): void =>
            component.emit({
                type: 'message',
                detail: {
                    sender: sender.id,
                    target: targetObj.target
                },
                message,
                target: component
            });

        const handlers: Record<Component.MessageTarget['type'], Function> = {
            'componentID': (
                recipient: Component.MessageTarget['target']
            ): void => {
                const component = getInstanceById(recipient);
                if (component) {
                    emit(component);
                }
            },
            'componentType': (
                recipient: Component.MessageTarget['target']
            ): void => {
                getAllInstanceIDs()
                    .forEach((instanceID): void => {
                        const component = getInstanceById(instanceID);
                        if (component && component.id !== sender.id) {
                            if (
                                component.type === recipient ||
                                recipient === 'all'
                            ) {
                                emit(component);
                            }
                        }
                    });
            },
            'group': (recipient: Component.MessageTarget['target']): void => {
                // Send a message to a whole group
                const group = ComponentGroup.getComponentGroup(recipient);
                if (group) {
                    group.components.forEach((id): void => {
                        const component = getInstanceById(id);
                        if (component && component.id !== sender.id) {
                            emit(component);
                        }
                    });
                }
            }
        };

        handlers[targetObj.type](targetObj.target);
    }

}

export default Component;
