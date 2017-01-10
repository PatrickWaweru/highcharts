/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';

var argsToArray = function (args) {
		return Array.prototype.slice.call(args, 1);
	},
	dateFormat = H.dateFormat,
	each = H.each,
	isObject = H.isObject,
	pick = H.pick,
	wrap = H.wrap,
	Axis = H.Axis,
	Chart = H.Chart,
	Tick = H.Tick;

// Enum for which side the axis is on.
// Maps to axis.side
var axisSide = {
	top: 0,
	right: 1,
	bottom: 2,
	left: 3,
	0: 'top',
	1: 'right',
	2: 'bottom',
	3: 'left'
};

/**
 * Checks if an axis is a navigator axis.
 * @return {Boolean} true if axis is found in axis.chart.navigator
 */
Axis.prototype.isNavigatorAxis = function () {
	var axis = this,
		navigator = axis.chart.navigator;
	return navigator && (navigator.xAxis === axis || navigator.yAxis === axis);
};

/**
 * Checks if an axis is the outer axis in its dimension. Since
 * axes are placed outwards in order, the axis with the highest
 * index is the outermost axis.
 *
 * Example: If there are multiple x-axes at the top of the chart,
 * this function returns true if the axis supplied is the last
 * of the x-axes.
 *
 * @return true if the axis is the outermost axis in its dimension;
 *		 false if not
 */
Axis.prototype.isOuterAxis = function () {
	var axis = this,
		chart = axis.chart,
		thisIndex = -1,
		isOuter = true;

	each(chart.axes, function (otherAxis, index) {
		if (otherAxis.side === axis.side && !otherAxis.isNavigatorAxis()) {
			if (otherAxis === axis) {
				// Get the index of the axis in question
				thisIndex = index;

				// Check thisIndex >= 0 in case thisIndex has
				// not been found yet
			} else if (thisIndex >= 0 && index > thisIndex) {
				// There was an axis on the same side with a
				// higher index.
				isOuter = false;
			}
		}
	});
	// There were either no other axes on the same side,
	// or the other axes were not farther from the chart
	return isOuter;
};

/**
 * Get the maximum label length.
 * This function can be used in states where the axis.maxLabelLength has not
 * been set.
 *
 * @param  {boolean} force - Optional parameter to force a new calculation, even
 *                           if a value has already been set
 * @return {number} maxLabelLength - the maximum label length of the axis
 */
Axis.prototype.getMaxLabelLength = function (force) {
	var tickPositions = this.tickPositions,
		ticks = this.ticks,
		maxLabelLength = 0;

	if (!this.maxLabelLength || force) {
		each(tickPositions, function (tick) {
			tick = ticks[tick];
			if (tick && tick.labelLength > maxLabelLength) {
				maxLabelLength = tick.labelLength;
			}
		});
		this.maxLabelLength = maxLabelLength;
	}
	return this.maxLabelLength;
};

/**
 * Add custom date formats
 */
H.dateFormats = {
	// Week number
	W: function (timestamp) {
		var date = new Date(timestamp),
			day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(),
			time = date.getTime(),
			startOfYear = new Date(date.getUTCFullYear(), 0, 1, -6),
			dayNumber;
		date.setDate(date.getUTCDate() + 4 - day);
		dayNumber = Math.floor((time - startOfYear) / 86400000);
		return 1 + Math.floor(dayNumber / 7);
	},
	// First letter of the day of the week, e.g. 'M' for 'Monday'.
	E: function (timestamp) {
		return dateFormat('%a', timestamp, true).charAt(0);
	}
};

/**
 * Prevents adding the last tick label if the axis is not a category axis.
 *
 * Since numeric labels are normally placed at starts and ends of a range of
 * value, and this module makes the label point at the value, an "extra" label
 * would appear.
 *
 * @param {function} proceed - the original function
 */
wrap(Tick.prototype, 'addLabel', function (proceed) {
	var axis = this.axis,
		categoryAxis = axis.categories,
		tickPositions = axis.tickPositions,
		lastTick = tickPositions[tickPositions.length - 1],
		isLastTick = this.pos === lastTick;

	if (!axis.options.grid || categoryAxis || !isLastTick) {
		proceed.apply(this);
	}
});

/**
 * If chart is stockChart, always return 'left' to avoid first label being
 * placed inside chart.
 * @param {function} proceed - the original function
 * @return {string} 'left' if stockChart, or auto calculated alignment
 */
wrap(Axis.prototype, 'autoLabelAlign', function (proceed) {
	var axis = this,
		retVal;
	if (axis.chart.isStock) {
		retVal = 'left';
	} else {
		retVal = proceed.apply(axis, argsToArray(arguments));
	}
	return retVal;
});

/**
 * Center tick labels vertically and horizontally between ticks
 *
 * @param {function} proceed - the original function
 *
 * @return {object} object - an object containing x and y positions
 *						 for the tick
 */
wrap(Tick.prototype, 'getLabelPosition', function (proceed, x, y, label, horiz, labelOptions, tickmarkOffset, index) {
	var tick = this,
		retVal = proceed.apply(tick, argsToArray(arguments)),
		axis = tick.axis,
		options = axis.options,
		categoryAxis = axis.categories,
		tickInterval = options.tickInterval || axis.tickInterval,
		reversed = axis.reversed,
		tickPositions = axis.tickPositions,
		isFirstTick = tick.pos === axis.min,
		lastTickPos = tickPositions[tickPositions.length - 2],
		isLastTick = tick.pos === lastTickPos,
		nextTickPos = tickPositions[index + 1],
		tickPixelInterval,
		newX,
		axisMin,
		axisHeight,
		fontSize,
		labelMetrics,
		labelBase,
		labelHeight,
		axisYCenter,
		labelYCenter;

	// Only center tick labels in grid axes
	if (options.grid) {
		fontSize = options.labels.style.fontSize;
		labelMetrics = axis.chart.renderer.fontMetrics(fontSize, label.element);
		labelBase = labelMetrics.b;
		labelHeight = labelMetrics.h;
		fontSize = labelMetrics.f;
		labelYCenter = (labelBase / 2) - ((labelHeight - fontSize) / 2);

		if (axis.horiz && !categoryAxis) {
			// Center x position
			if (isFirstTick) {
				if (nextTickPos) {
					x = axis.translate((tick.pos + nextTickPos) / 2);
				}
				retVal.x = x + axis.left;
			} else if (isLastTick) {
				retVal.x = (axis.left + axis.len + x) / 2;
			} else {
				x = axis.translate(tick.pos + (tickInterval / 2));
				retVal.x = x + axis.left;
			}

			axisHeight = axis.axisGroup.getBBox().height;
			axisYCenter = (axisHeight / 2);

			y += labelYCenter;

			// Center y position
			if (axis.side === axisSide.top) {
				retVal.y = y - axisYCenter;
			} else {
				retVal.y = y + axisYCenter;
			}
		} else {
			// Center y position
			if (!categoryAxis) {
				axisMin = reversed ? axis.max : axis.min;
				tickPixelInterval = axis.translate(axisMin + tickInterval);
				retVal.y = y - (tickPixelInterval / 2) + labelYCenter;
			}

			// Center x position
			newX = (tick.label.getBBox().width / 2) - (axis.maxLabelLength / 2);
			if (axis.side === axisSide.left) {
				retVal.x += newX;
			} else {
				retVal.x -= newX;
			}
		}
	}
	return retVal;
});

/**
 * Draw vertical ticks extra long to create cell floors and roofs.
 * Overrides the tickLength for vertical axes.
 *
 * @param {function} proceed - the original function
 * @returns {array} retVal -
 */
wrap(Axis.prototype, 'tickSize', function (proceed) {
	var axis = this,
		retVal = proceed.apply(axis, argsToArray(arguments)),
		labelPadding,
		distance;

	if (axis.options.grid && !axis.horiz) {
		labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
		if (!axis.maxLabelLength) {
			axis.maxLabelLength = axis.getMaxLabelLength();
		}
		distance = axis.maxLabelLength + labelPadding;

		retVal[0] = distance;
	}
	return retVal;
});

/**
 * Sets the axis title to null unless otherwise specified by user.
 * @param {Function} proceed - the original function
 * @param {Object} userOptions - the user specified axis options
 */
wrap(Axis.prototype, 'setOptions', function (proceed, userOptions) {
	var axis = this;

	if (userOptions.title && !userOptions.title.text) {
		userOptions.title.text = null;
	}

	proceed.apply(axis, argsToArray(arguments));
});

/**
 * Disregards space required by axisTitle, by adding axisTitle to axisParent
 * instead of axisGroup, and disregarding margins and offsets related to
 * axisTitle.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'getOffset', function (proceed) {
	var axis = this,
		axisOffset = axis.chart.axisOffset,
		side = axis.side,
		axisHeight,
		tickSize,
		options = axis.options,
		axisTitleOptions = options.title,
		addTitle = axisTitleOptions &&
				axisTitleOptions.text &&
				axisTitleOptions.enabled !== false;

	if (axis.options.grid && isObject(axis.options.title)) {

		tickSize = axis.tickSize('tick')[0];
		if (axisOffset[side] && tickSize) {
			axisHeight = axisOffset[side] + tickSize;
		}

		if (addTitle) {
			// Use the custom addTitle() to add it, while preventing making room
			// for it
			axis.addTitle();
		}

		proceed.apply(axis, argsToArray(arguments));

		axisOffset[side] = pick(axisHeight, axisOffset[side]);


		// Put axis options back after original Axis.getOffset() has been called
		options.title = axisTitleOptions;

	} else {
		proceed.apply(axis, argsToArray(arguments));
	}
});

/**
 * Prevents rotation of labels when squished, as rotating them would not
 * help.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'renderUnsquish', function (proceed) {
	if (this.options.grid) {
		this.labelRotation = 0;
		this.options.labels.rotation = 0;
	}
	proceed.apply(this);
});

/**
 * Creates a left and right wall on horizontal axes:
 * - Places leftmost tick at the start of the axis, to create a left wall
 * - Ensures that the rightmost tick is at the end of the axis, minus the tick
 *   interval, to create a right wall.
 *
 * @param {function} proceed - the original function
 * @param {object} options - the pure axis options as input by the user
 */
wrap(Axis.prototype, 'setOptions', function (proceed, options) {
	var axis = this;

	if (options.grid) {

		if (!options.title) {
			options.title = '';
		}

		if (axis.horiz) {
			/*               _________________________
			* Make this:    ___|_____|_____|_____|__|
			*               ^                     ^
			*               _________________________
			* Into this:    |_____|_____|_____|_____|
			*                  ^                 ^
			*/
			options.minPadding = pick(options.minPadding, 0);
			options.maxPadding = pick(options.minPadding, 0);
		}
	}

	proceed.apply(this, argsToArray(arguments));
});

/**
 * Ensures a left wall on horizontal axes with series inheriting from column:
 * ColumnSeries normally sets pointRange to null, resulting in Axis to select
 * other values for point ranges. This enforces the above Axis.setOptions()
 * override.
 *                  _________________________
 * Enforce this:    ___|_____|_____|_____|__|
 *                  ^
 *                  _________________________
 * To be this:      |_____|_____|_____|_____|
 *                  ^
 *
 * @param {function} proceed - the original function
 * @param {object} options - the pure axis options as input by the user
 */
wrap(Axis.prototype, 'setAxisTranslation', function (proceed) {
	var axis = this;
	if (axis.options.grid && axis.horiz) {
		each(axis.series, function (series) {
			series.options.pointRange = 0;
		});
	}
	proceed.apply(axis, argsToArray(arguments));
});

/**
 * Makes tick labels which are usually ignored in a linked axis displayed if
 * they are within range of linkedParent.min.
 *                        _____________________________
 *                        |   |       |       |       |
 * Make this:             |   |   2   |   3   |   4   |
 *                        |___|_______|_______|_______|
 *                          ^
 *                        _____________________________
 *                        |   |       |       |       |
 * Into this:             | 1 |   2   |   3   |   4   |
 *                        |___|_______|_______|_______|
 *                          ^
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'trimTicks', function (proceed) {
	var axis = this,
		isGridAxis = axis.options.grid,
		isLinked = axis.isLinked,
		tickPositions = axis.tickPositions,
		firstPos = tickPositions[0],
		min = axis.linkedParent && axis.linkedParent.min,
		tickInterval = axis.tickInterval,
		withinRange = firstPos < min && firstPos + tickInterval > min;

	if (isGridAxis && isLinked && withinRange) {
		tickPositions[0] = min;
	}
	proceed.apply(axis, argsToArray(arguments));
});

/**
 * Draw an extra line on the far side of the the axisLine,
 * creating cell roofs of a grid.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'render', function (proceed) {
	var axis = this,
		options = axis.options,
		labelPadding,
		distance,
		lineWidth,
		linePath,
		yStartIndex,
		yEndIndex,
		xStartIndex,
		xEndIndex,
		x,
		y,
		path,
		attrs,
		renderer = axis.chart.renderer,
		horiz = axis.horiz,
		axisGroupBox;

	if (options.grid) {
		labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
		distance = axis.maxLabelLength + labelPadding;
		lineWidth = options.lineWidth;

		// Remove right wall before rendering
		if (axis.rightWall) {
			axis.rightWall.destroy();
		}

		// Call original Axis.render() to obtain axis.axisLine and
		// axis.axisGroup
		proceed.apply(axis);

		axisGroupBox = axis.axisGroup.getBBox();

		/*
		 * Add right and left wall on horizontal axes:
		 *               _________________________
 		 * Make this:    _______|______|______|___
 		 *               ^                       ^
 		 *               _________________________
 		 * Into this:    |______|______|______|__|
 		 *               ^                       ^
		 */
		if (horiz) {
			x = axisGroupBox.x;
			y = axisGroupBox.y;
			// Make path or left wall
			path = [
				'M', x, y,
				'L', x, y + axisGroupBox.height
			];
			attrs = {
				stroke: options.tickColor || '#ccd6eb',
				'stroke-width': options.tickWidth || 1,
				zIndex: 7,
				class: 'grid-wall'
			};

			axis.leftWall = renderer.path(path)
				.attr(attrs)
				.add(axis.axisGroup);

			// Change x positions for right wall
			path[1] = path[4] = x + axis.width + 1; // +1 accounts for left wall

			axis.rightWall = renderer.path(path)
				.attr(attrs)
				.add(axis.axisGroup);
		}

		/*
		 * Draw an extra axis line on outer axes
		 *             >
		 * Make this:    |______|______|______|___
		 *
		 *             > _________________________
		 * Into this:    |______|______|______|__|
		 *
		 */
		if (axis.isOuterAxis() && axis.axisLine) {
			if (horiz) {
				// -1 to avoid adding distance each time the chart updates
				distance = axisGroupBox.height - 1;
			}

			if (lineWidth) {
				linePath = axis.getLinePath(lineWidth);
				xStartIndex = linePath.indexOf('M') + 1;
				xEndIndex = linePath.indexOf('L') + 1;
				yStartIndex = linePath.indexOf('M') + 2;
				yEndIndex = linePath.indexOf('L') + 2;

				// Negate distance if top or left axis
				if (axis.side === axisSide.top || axis.side === axisSide.left) {
					distance = -distance;
				}

				// If axis is horizontal, reposition line path vertically
				if (horiz) {
					linePath[yStartIndex] = linePath[yStartIndex] + distance;
					linePath[yEndIndex] = linePath[yEndIndex] + distance;
				} else {
					// If axis is vertical, reposition line path horizontally
					linePath[xStartIndex] = linePath[xStartIndex] + distance;
					linePath[xEndIndex] = linePath[xEndIndex] + distance;
				}

				if (!axis.axisLineExtra) {
					axis.axisLineExtra = renderer.path(linePath)
						.attr({
							stroke: options.lineColor,
							'stroke-width': lineWidth,
							zIndex: 7
						})
						.add(axis.axisGroup);
				} else {
					axis.axisLineExtra.animate({
						d: linePath
					});
				}

				// show or hide the line depending on options.showEmpty
				axis.axisLine[axis.showAxis ? 'show' : 'hide'](true);
			}
		}
	} else {
		proceed.apply(axis);
	}
});

/**
 * Wraps chart rendering with the following customizations:
 * 1. Prohibit timespans of multitudes of a time unit
 * 2. Draw cell walls on vertical axes
 *
 * @param {function} proceed - the original function
 */
wrap(Chart.prototype, 'render', function (proceed) {
	// 25 is optimal height for default fontSize (11px)
	// 25 / 11 ≈ 2.28
	var fontSizeToCellHeightRatio = 25 / 11,
		fontMetrics,
		fontSize;

	each(this.axes, function (axis) {
		var options = axis.options;
		if (options.grid) {
			fontSize = options.labels.style.fontSize;
			fontMetrics = axis.chart.renderer.fontMetrics(fontSize);

			// Prohibit timespans of multitudes of a time unit,
			// e.g. two days, three weeks, etc.
			if (options.type === 'datetime') {
				options.units = [
					['millisecond', [1]],
					['second', [1]],
					['minute', [1]],
					['hour', [1]],
					['day', [1]],
					['week', [1]],
					['month', [1]],
					['year', null]
				];
			}

			// Make tick marks taller, creating cell walls of a grid.
			// Use cellHeight axis option if set
			if (axis.horiz) {
				options.tickLength = options.cellHeight ||
						fontMetrics.h * fontSizeToCellHeightRatio;
			} else {
				options.tickWidth = 1;
				if (!options.lineWidth) {
					options.lineWidth = 1;
				}
			}
		}
	});

	// Call original Chart.render()
	proceed.apply(this);
});
