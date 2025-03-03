/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Cell from '../Layout/Cell';
import type Options from '../../Core/Options';
import type DataGrid from '../../DataGrid/DataGrid';
import type BaseDataGridOptions from '../../DataGrid/DataGridOptions';

import Component from '../Components/Component.js';
import DataConnector from '../../Data/Connectors/DataConnector.js';
import DataConverter from '../../Data/Converters/DataConverter.js';
import U from '../../Core/Utilities.js';
const { createElement, merge, uniqueKey } = U;
import DataGridSyncHandlers from './DataGridSyncHandlers.js';

/* *
 *
 *  Class
 *
 * */

/**
 * DataGrid component for Highcharts Dashboards.
 * @internal
 */
class DataGridComponent extends Component {

    /* *
     *
     *  Static Properties
     *
     * */

    /** @internal */
    public static syncHandlers = DataGridSyncHandlers;

    /** @internal */
    public static DataGridConstructor?: typeof DataGrid;

    /** @internal */
    public static defaultOptions = merge(
        Component.defaultOptions,
        {
            dataGridClassName: 'dataGrid-container',
            dataGridID: 'dataGrid-' + uniqueKey(),
            dataGridOptions: {},
            editableOptions: [{
                name: 'connectorName',
                propertyPath: ['connector', 'id'],
                type: 'select'
            }],
            syncHandlers: DataGridSyncHandlers,
            onUpdate: DataGridComponent.onUpdate
        }
    );

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Default update function, if data grid has changed. This functionality can
     * be replaced with the {@link DataGridComponent.DataGridOptions#onUpdate}
     * option.
     *
     * @internal
     *
     * @param e
     * Related keyboard event of the change.
     *
     * @param store
     * Relate store of the change.
     */
    public static onUpdate(
        e: KeyboardEvent,
        store: Component.ConnectorTypes
    ): void {
        const inputElement = e.target as HTMLInputElement;
        if (inputElement) {
            const parentRow = inputElement
                .closest('.hc-dg-row');
            const cell = inputElement.closest('.hc-dg-cell');

            const converter = new DataConverter();

            if (
                parentRow &&
                parentRow instanceof HTMLElement &&
                cell &&
                cell instanceof HTMLElement
            ) {
                const dataTableRowIndex = parentRow
                    .dataset.rowIndex;
                const { columnName } = cell.dataset;

                if (
                    dataTableRowIndex !== void 0 &&
                    columnName !== void 0
                ) {
                    const table = store.table.modified;

                    if (table) {
                        let valueToSet = converter
                            .asGuessedType(inputElement.value);

                        if (valueToSet instanceof Date) {
                            valueToSet = valueToSet.toString();
                        }

                        table.setCell(
                            columnName,
                            parseInt(dataTableRowIndex, 10),
                            valueToSet
                        );
                    }
                }
            }
        }
    }

    /** @internal */
    public static fromJSON(
        json: DataGridComponent.ClassJSON,
        cell: Cell
    ): DataGridComponent {
        const options = json.options;
        const dataGridOptions = JSON.parse(json.options.dataGridOptions || '');

        const component = new DataGridComponent(
            cell,
            merge<DataGridComponent.ComponentOptions>(options as any, {
                dataGridOptions,
                syncHandlers: DataGridComponent.syncHandlers
            })
        );

        component.emit({
            type: 'fromJSON',
            json
        });

        return component;
    }

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    public dataGrid?: DataGrid;
    /** @internal */
    public dataGridOptions: Partial<Options>;
    /** @internal */
    public options: DataGridComponent.ComponentOptions;
    /** @internal */
    public sync: Component['sync'];
    /** @internal */
    private connectorListeners: Array<Function>;

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        cell: Cell,
        options: Partial<DataGridComponent.ComponentOptions>
    ) {
        options = merge(DataGridComponent.defaultOptions, options);

        super(cell, options);

        this.connectorListeners = [];
        this.options = options as DataGridComponent.ComponentOptions;
        this.type = 'DataGrid';

        if (this.options.dataGridClassName) {
            this.contentElement.classList.add(this.options.dataGridClassName);
        }
        if (this.options.dataGridID) {
            this.contentElement.id = this.options.dataGridID;
        }

        this.syncHandlers = this.handleSyncOptions(DataGridSyncHandlers);
        this.sync = new DataGridComponent.Sync(
            this,
            this.syncHandlers
        );

        this.dataGridOptions = this.options.dataGridOptions || ({} as any);

        this.innerResizeTimeouts = [];

        // Add the component instance to the registry
        Component.addInstance(this);
    }

    /* *
     *
     *  Class methods
     *
     * */

    /** @internal */
    public load(): this {
        this.emit({ type: 'load' });
        super.load();
        this.parentElement.appendChild(this.element);
        this.hasLoaded = true;

        if (
            this.connector &&
            !this.connectorListeners.length
        ) {
            const connectorListeners = this.connectorListeners;
            // this.on('tableChanged', (): void => this.updateSeries());

            // Reload the store when polling.
            connectorListeners.push(this.connector
                .on('afterLoad', (e: DataConnector.Event): void => {
                    if (e.table && this.connector) {
                        this.connector.table.setColumns(e.table.getColumns());
                    }
                })
            );

            // Update the DataGrid when store changed.
            connectorListeners.push(this.connector.table
                .on('afterSetCell', (e: any): void => {
                    const dataGrid = this.dataGrid;
                    let shouldUpdateTheGrid = true;

                    if (dataGrid) {
                        const row = dataGrid.rowElements[e.rowIndex],
                            cells = Array.prototype.slice.call(row.childNodes);

                        cells.forEach((cell: HTMLElement): void => {
                            if (cell.childElementCount > 0) {
                                const input =
                                    cell.childNodes[0] as HTMLInputElement,
                                    convertedInputValue =
                                        typeof e.cellValue === 'string' ?
                                            input.value :
                                            +input.value;

                                if (cell.dataset.columnName === e.columnName &&
                                    convertedInputValue === e.cellValue
                                ) {
                                    shouldUpdateTheGrid = false;
                                }
                            }
                        });
                    }

                    shouldUpdateTheGrid ? this.update({}) : void 0;
                })
            );
        }

        this.emit({ type: 'afterLoad' });

        return this;
    }

    /** @internal */
    public render(): this {
        this.emit({ type: 'beforeRender' });
        super.render();
        if (!this.dataGrid) {
            this.dataGrid = this.constructDataGrid();
        }
        if (
            this.connector &&
            this.dataGrid &&
            this.dataGrid.dataTable.modified !== this.connector.table.modified
        ) {
            this.dataGrid.update({ dataTable: this.connector.table.modified });
        }

        this.sync.start();
        this.emit({ type: 'afterRender' });

        this.setupConnectorUpdate();

        return this;
    }

    /** @internal */
    public redraw(): this {
        super.redraw();
        return this.render();
    }

    /** @internal */
    public resize(
        width?: number|null,
        height?: number|null
    ): void {
        if (this.dataGrid) {
            super.resize(width, height);
            this.dataGrid.setSize(width, height);
        }
    }

    public async update(
        options: Partial<DataGridComponent.ComponentOptions>
    ): Promise<void> {
        if (options.connector?.id !== this.connectorId) {
            const connectorListeners = this.connectorListeners;
            for (let i = 0, iEnd = connectorListeners.length; i < iEnd; ++i) {
                connectorListeners[i]();
            }
            connectorListeners.length = 0;
        }
        await super.update(options);
        if (this.dataGrid) {
            this.dataGrid.update(this.options.dataGridOptions || ({} as any));
        }
        this.emit({ type: 'afterUpdate' });
    }

    /** @internal */
    private constructDataGrid(): DataGrid {
        if (DataGridComponent.DataGridConstructor) {
            this.dataGrid = new DataGridComponent.DataGridConstructor(
                this.contentElement,
                {
                    ...this.options.dataGridOptions,
                    dataTable: this.connector && this.connector.table.modified
                }
            );
            return this.dataGrid;
        }

        throw new Error('DataGrid not connected.');
    }

    private setupConnectorUpdate(): void {
        const { connector, dataGrid } = this;

        if (connector && dataGrid) {
            dataGrid.on<DataGrid.Event>('cellClick', (e): void => {
                if ('input' in e) {
                    e.input.addEventListener(
                        'keyup',
                        (keyEvent): void =>
                            this.options.onUpdate(keyEvent, connector)
                    );
                }
            });
        }
    }

    /** @internal */
    public toJSON(): DataGridComponent.ClassJSON {
        const dataGridOptions = JSON.stringify(this.options.dataGridOptions);
        const base = super.toJSON();

        const json = {
            ...base,
            options: {
                ...base.options,
                dataGridOptions
            }
        };

        this.emit({ type: 'toJSON', json });
        return json;
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace DataGridComponent {

    /* *
     *
     *  Declarations
     *
     * */

    /** @internal */
    export type ComponentType = DataGridComponent;

    /** @internal */
    export type ChartComponentEvents = JSONEvent | Component.EventTypes;

    /** @internal */
    export type JSONEvent = Component.Event<
    'toJSON' | 'fromJSON',
    {
        json: ClassJSON;
    }
    >;

    /**
     * Options to control the DataGrid component.
     */
    export interface ComponentOptions extends Component.ComponentOptions {

        /**
         * The style class to add to the rendered data grid container.
         */
        dataGridClassName?: string;

        /**
         * The identifier for the rendered data grid container.
         */
        dataGridID?: string;

        /**
         * Callback to use when a change in the data grid occures.
         */
        onUpdate: typeof DataGridComponent.onUpdate

        type: 'DataGrid';
        /**
         * Generic options to adjust behavor and styling of the rendered data
         * grid.
         */
        dataGridOptions?: BaseDataGridOptions;

        /**
         * The set of options like `dataGridClassName` and `dataGridID`.
         */
        chartClassName?: string;

        /**
         * The id that is applied to the chart's container.
         */
        chartID?: string;

        /**
         * Names / aliases that should be mapped to xAxis values. You can use
         * null to keep columns selectively out of the chart.
         * ```
         * Example
         * columnAssignment: {
         *      'Food': 'x',
         *      'Vitamin A': 'y'
         * }
         * ```
         */
        columnAssignment?: Record<string, string | null>;

        /** @internal */
        tableAxisMap?: Record<string, string | null>;

    }

    /** @internal */
    export interface ComponentJSONOptions
        extends Component.ComponentOptionsJSON {

        /** @internal */
        dataGridOptions?: string;

        /** @internal */
        chartClassName?: string;

        /** @internal */
        chartID?: string;
    }

    /** @internal */
    export interface ClassJSON extends Component.JSON {
        /** @internal */
        options: ComponentJSONOptions;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default DataGridComponent;
