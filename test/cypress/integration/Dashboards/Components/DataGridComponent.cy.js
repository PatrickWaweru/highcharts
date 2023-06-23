describe('layout resize on window changes', () => {
    before(()=>{
        cy.visit('/dashboards/cypress/component-datagrid');
    });

    it('Chart and DataGridComponent should have synced hover events.', () => {
        const firstDataGridRow = cy.get('.hc-dg-cell').eq(0)

        // Hover over DataGridComponent.
        firstDataGridRow.trigger('mouseover');
        firstDataGridRow.parent().should('have.class', 'hc-dg-row hovered');
        cy.chart().then(chart =>{
            assert.notOk(
                chart.tooltip.isHidden,
                'When hovering over DataGrid, chart should have tooltip.'
            )
        })

        // Hover over the chart.
        cy.get('.highcharts-point').eq(1).trigger('mouseover');
        firstDataGridRow.parent().should('not.have.class', 'hc-dg-row hovered');
        cy.get('.hc-dg-row').eq(1).should('have.class', 'hc-dg-row hovered');

        // Hover over the first point
        cy.get('.highcharts-point').eq(0).trigger('mouseover');
        firstDataGridRow.parent().should('not.have.class', 'hc-dg-row hovered');
        cy.get('.hc-dg-row').eq(0).should('have.class', 'hc-dg-row hovered');
    });

    it('Updating of the store should work by changing chart and datagrid', () =>{
        cy.get('.hc-dg-row').eq(1).children().eq(1)
            .type('{backspace}{backspace}{backspace}000');

        cy.chart().then(chart =>{
            assert.strictEqual(
                chart.series[0].points[1].y,
                2000,
                'After updating the Data Grid the chart should be updated.'
            )
        })
    })

    it('Chart and DataGridComponent should have synced selection events.', () => {
        let containerTop;

        cy.get('.hc-dg-outer-container')
            .invoke('scrollTop')
            .then((scrollTopValue) => {
                containerTop = scrollTopValue;
            });

        cy.get('.highcharts-dashboards-component-content').eq(0)
            .trigger('mousedown', 300)
            .trigger('mousemove', 300, 100)
            .trigger('mouseup');


        cy.get('.hc-dg-outer-container').then($container =>{
            assert.ok(
                $container.scrollTop() > containerTop,
                'When selecting a range in the chart, the DataGridComponent should scroll.'
            )

        })
    });
});
