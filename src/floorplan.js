//
//   Copyright 2018 Nachiket Gadre
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
//

d3.floorplan = function () {
    var layers = [],
        panZoomEnabled = true,
        maxZoom = 5,
        toolsWidth = 95,
        xScale = d3.scaleLinear(),
        yScale = d3.scaleLinear(),
        mapdata = {},
        svgCanvas = null,
        g = null;

    function map(g) {
        var width = xScale.range()[1] - xScale.range()[0],
		    height = yScale.range()[1] - yScale.range()[0];
		
		g.each(function(data){
			if (! data) return;
			
			var g = d3.select(this);

			// // define common graphical elements
			// __init_defs(g.selectAll("defs").data([0]).enter().append("defs"));

			// // setup container for layers and area to capture events
			// var vis = g.selectAll(".map-layers").data([0]),
			// visEnter = vis.enter().append("g").attr("class","map-layers"),
			// visUpdate = d3.transition(vis);

			// visEnter.append("rect")
			// .attr("class", "canvas")
			// .attr("pointer-events","all")
			// .style("opacity",0);

			// visUpdate.attr("width", width)
			// .attr("height", height)
			// .attr("x",xScale.range()[0])
			// .attr("y",yScale.range()[0]);

			// // setup map controls
			// var controls = g.selectAll(".map-controls").data([0]),
			// controlsEnter = controls.enter()
			// 				.append("g").attr("class","map-controls");

			// __init_controls(controlsEnter);
			// var offset = controls.select(".hide")
			// 			.classed("ui-show-hide") ? 95 : 10,
			// panelHt = Math.max(45, 10 + layers.length * 20);
			// controls.attr("view-width", width)
			// .attr("transform", "translate("+(width-offset)+",0)")
			// 	.select("rect")
			// 	.attr("height", panelHt);
			
			
			// // render and reorder layer controls
			// var layerControls = controls.select("g.layer-controls")
			// 	.selectAll("g").data(layers, function(l) {return l.id();}),
			// layerControlsEnter = layerControls.enter()
			// 	.append("g").attr("class", "ui-active")
			// 	.style("cursor","pointer")
			// 	.on("click", function(l) {
			// 		var button = d3.select(this);
			// 		var layer = g.selectAll("g."+l.id());
			// 		if (button.classed("ui-active")) {
			// 			layer.style("display","none");
			// 			button.classed("ui-active",false)
			// 				.classed("ui-default",true);
			// 		} else {
			// 			layer.style("display","inherit");
			// 			button.classed("ui-active", true)
			// 				.classed("ui-default", false);
			// 		}
			// 	});
			
			// layerControlsEnter.append("rect")
			// 	.attr("x", 0)
			// 	.attr("y", 1)
			// 	.attr("rx", 5)
			// 	.attr("ry", 5)
			// 	.attr("width", 75)
			// 	.attr("height", 18)
			// 	.attr("stroke-width", "1px");
			
			// layerControlsEnter.append("text")
			// 	.attr("x", 10)
			// 	.attr("y", 15)
			// 	.style("font-size","12px")
			// 	.style("font-family", "Helvetica, Arial, sans-serif")
			// 	.text(function(l) { return l.title(); });
			
			// layerControls.transition().duration(1000)
			// .attr("transform", function(d,i) { 
			// 	return "translate(0," + ((layers.length-(i+1))*20) + ")"; 
			// });

			// // render and reorder layers
			// var maplayers = vis.selectAll(".maplayer")
			// 				.data(layers, function(l) {return l.id();});
			// maplayers.enter()
			// .append("g")
			// .attr("class", function(l) {return "maplayer " + l.title();})
			// 	.append("g")
			// 	.attr("class", function(l) {return l.id();})
			// 	.datum(null);
			// maplayers.exit().remove();
			// maplayers.order();
			
			// // redraw layers
			// maplayers.each(function(layer) {
			// 	d3.select(this).select("g." + layer.id()).datum(data[layer.id()]).call(layer);
			// });
			
			// add pan - zoom behavior
			g.call(d3.zoom().scaleExtent([1,maxZoom])
					.on("zoom", function() {
						if (panZoomEnabled) {
							// __set_view(g, d3.event.scale, d3.event.transform);
                            g.attr('transform', d3.event.transform)
						}
					}));
            // g.call(d3.zoom().on("zoom", function () {
            //     svg.attr("transform", d3.event.transform)
            // }))

		});
        return this
    }

    map.xScale = function (scale) {
        if (!arguments.length) return xScale;
        xScale = scale;
        layers.forEach(function (l) {
            l.xScale(xScale);
        });
        return map;
    };

    map.yScale = function (scale) {
        if (!arguments.length) return yScale;
        yScale = scale;
        layers.forEach(function (l) {
            l.yScale(yScale);
        });
        return map;
    };

    map.maxZoom = function (zoom) {
        if (!arguments.length) return maxZoom;
        maxZoom = zoom;
        return map;
    };

    map.layersWidth = function (width) {
        if (!arguments.length) return toolsWidth;
        toolsWidth = width;
        return map;
    };

    map.panZoom = function (enabled) {
        if (!arguments.length) return panZoomEnabled;
        panZoomEnabled = enabled;
        return map;
    };

    map.addLayer = function (layer, index) {
        layer.xScale(xScale);
        layer.yScale(yScale);

        if (arguments.length > 1 && index >= 0) {
            layers.splice(index, 0, layer);
        } else {
            layers.push(layer);
        }

        return map;
    };


    map.imageLayers = function (svgCanvas, data) {
        var images = svgCanvas.selectAll("g.images")
            .data(data)
            .enter()
            .append("g")
            .attr("class", function (floor) {
                return "floor-" + floor.id;
            })
            .append("image");

        images.attr("xlink:href", function (floor) {
            return floor.image.url
        }).attr("x", function (floor) {
            return floor.image.x;
        }).attr("y", function (floor) {
            return floor.image.y;
        }).attr("width", function (floor) {
            return floor.image.w;
        }).attr("height", function (floor) {
            return floor.image.h;
        });
    };

    map.drawText = function (g, data) {

        // DATA JOIN
        // Join new data with old elements, if any.
        var text = g.selectAll("text")
            .data(data);

        // UPDATE
        // Update old elements as needed.
        text.attr("class", "update");

        // ENTER
        // Create new elements as needed.
        //
        // ENTER + UPDATE
        // After merging the entered elements with the update selection,
        // apply operations to both.
        text.enter().append("text")
            .attr("class", "enter")
            .attr("x", function (d, i) {
                return i * 32;
            })
            .attr("dy", ".35em")
            .merge(text)
            .text(function (d) {
                return d;
            });

        // EXIT
        // Remove old elements as needed.
        text.exit().remove();
    };

    map.zonePolygons = function (svgCanvas, zones) {

        // Context menu
        var menu = [
            {
                title: 'Change zone name',
                action: function (elm, d, i) {
                    console.log('Change zone name');
                    // zone.name = prompt("Please enter new name name", "Zone name");
                    d3.select("." + this.classList.item(1) + '-text').text(zone.name);
                }
            },
            {
                title: 'Delete zone',
                action: function (elm, d, i) {
                    console.log('You have deleted - ' + this.classList.item(1));
                    d3.select("." + this.classList.item(1)).remove();
                }
            }
        ];

        zones.forEach(function (zone) {
            var gPoly;
            var polyPoints = zone.points;
            drawPolygon(svgCanvas, zone);

            //Called on mousedown if mousedown point if a polygon handle
            function drawPolygon(svgCanvas, zone) {

                var isDrawing = false;
                var isDragging = false;

                var polyPoints = zone.points;
                d3.select('g.outline').remove();

                // Create polygon
                gPoly = svgCanvas.append('g')
                    .classed("polygon", true)
                    .classed("zone-" + zone.id, true);
                // Add drag behavior
                var dragBehavior = d3.drag().on("drag", alterPolygon);

                // Not needed while drawing them all at first.
                // polyPoints.splice(polyPoints.length - 1);
                //console.log(polyPoints);

                var polyEl = gPoly.append("polygon")
                    .attr("points", polyPoints);

                for (var i = 0; i < polyPoints.length; i++) {
                    gPoly.append('circle')
                        .attr("cx", polyPoints[i][0])
                        .attr("cy", polyPoints[i][1])
                        .attr("r", 4)
                        .call(dragBehavior);
                }

                var bbox = polyEl._groups[0][0].getBBox();
                var bbox2 = gPoly._groups[0][0].getBBox();

                bbox.x = 0;
                bbox.y = 0;
                bbox.width = 50;
                bbox.height = 50;

                // Set translate variable data;
                gPoly.datum({
                    x: 0,
                    y: 0
                });

                // Set translate elem attribute defaults
                gPoly.attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")"
                });

                // Add Transform for mouse drag
                gPoly.call(d3.drag().on("drag", function (d) {
                    d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
                }));

                // Add context menu
                gPoly.on('contextmenu', d3.contextMenu(menu));

                // Add label text
                var gPolyCentroid = d3.polygonCentroid(polyPoints);
                addLabel(zone.name, gPolyCentroid, "zone-" + zone.id + '-text');

            }

            //Altering polygon coordinates based on handle drag
            function alterPolygon() {

                var alteredPoints = [];
                var selectedP = d3.select(this);
                var parentNode = d3.select(this.parentNode);

                //select only the elements belonging to the parent <g> of the selected circle
                var circles = d3.select(this.parentNode).selectAll('circle');
                var polygon = d3.select(this.parentNode).select('polygon');


                var pointCX = d3.event.x;
                var pointCY = d3.event.y;

                //rendering selected circle on drag
                selectedP.attr("cx", pointCX).attr("cy", pointCY);

                //loop through the group of circle handles attatched to the polygon and push to new array
                for (var i = 0; i < polyPoints.length; i++) {

                    var circleCoord = d3.select(circles._groups[0][i]);
                    var pointCoord = [parseInt(circleCoord.attr("cx")), parseInt(circleCoord.attr("cy"))];
                    alteredPoints[i] = pointCoord;

                }

                //re-rendering polygon attributes to fit the handles
                polygon.attr("points", alteredPoints);

                // Update points
                zone.points = alteredPoints;

                // Update label
                d3.select(".polygon-id-" + zone.id + '-text').remove();
                var gPolyCentroid = d3.polygonCentroid(alteredPoints);
                addLabel(zone.name, gPolyCentroid, "polygon-id-" + zone.id + '-text');

                bbox = parentNode._groups[0][0].getBBox();
                console.log(bbox);
            }

            function addLabel(text, centroid, labelClassName) {
                var svgText = gPoly.append("text");
                svgText.attr("x", centroid[0])
                    .attr("y", centroid[1])
                    .attr('font-size', 14)
                    .attr('font-weight', 400)
                    .attr('font-family', 'sans-serif')
                    .attr('text-anchor', 'middle')
                    .style('fill', 'darkOrange')
                    .classed(labelClassName, true);
                svgText.text(text);
            }

        });
    };

    map.drawZonePolygon = function (svgCanvas, zone) {

        // Context menu
        var menu = [
            {
                title: 'Change zone name',
                action: function (elm, d, i) {
                    console.log('Change zone name');
                    zone.name = prompt("Please enter new name name", "Zone name");
                    d3.select("." + this.classList.item(1) + '-text').text(zone.name);
                }
            },
            {
                title: 'Delete zone',
                action: function (elm, d, i) {
                    console.log('You have deleted - ' + this.classList.item(1));
                    d3.select("." + this.classList.item(1)).remove();
                }
            }
        ];

        var gContainer = svgCanvas.append('g').classed("outline", true);
        var isDrawing = false;
        var isDragging = false;
        var linePoint1, linePoint2;
        var startPoint;
        var bbox;
        var boundingRect;
        var shape;
        var gPoly;
        var polyPoints = zone.points;

        var polyDraw = svgCanvas.on("mousedown", setPoints)
            .on("mousemove", drawline)
            .on("mouseup", decidePoly);

        var dragBehavior = d3.drag().on("drag", alterPolygon);
        // var dragPolygon = d3.drag().on("drag", movePolygon(bbox));

        //On mousedown - setting points for the polygon
        function setPoints() {

            if (isDragging) return;

            isDrawing = true;

            var plod = d3.mouse(this);
            linePoint1 = {
                x: plod[0],
                y: plod[1]
            };

            polyPoints.push(plod);

            var circlePoint = gContainer.append("circle")
                .attr("cx", linePoint1.x)
                .attr("cy", linePoint1.y)
                .attr("r", 4)
                .attr("start-point", true)
                .classed("handle", true)
                .style("cursor", "pointer");


            // on setting points if mousedown on a handle
            if (d3.event.target.hasAttribute("handle")) {
                completePolygon()
            }

        }

        //on mousemove - appending SVG line elements to the points
        function drawline() {

            if (isDrawing) {
                linePoint2 = d3.mouse(this);
                gContainer.select('line').remove();
                gContainer.append('line')
                    .attr("x1", linePoint1.x)
                    .attr("y1", linePoint1.y)
                    .attr("x2", linePoint2[0] - 2) //arbitary value must be substracted due to circle cursor hover not working
                    .attr("y2", linePoint2[1] - 2); // arbitary values must be tested

            }
        }

        //On mouseup - Removing the placeholder SVG lines and adding polyline
        function decidePoly() {

            gContainer.select('line').remove();
            gContainer.select('polyline').remove();

            var polyline = gContainer.append('polyline').attr('points', polyPoints);

            gContainer.selectAll('circle').remove();

            for (var i = 0; i < polyPoints.length; i++) {
                var circlePoint = gContainer.append('circle')
                    .attr('cx', polyPoints[i][0])
                    .attr('cy', polyPoints[i][1])
                    .attr('r', 5)
                    .attr("handle", true)
                    .classed("handle", true);
            }
        }

        //Called on mousedown if mousedown point if a polygon handle
        function completePolygon() {
            d3.select('g.outline').remove();

            gPoly = svgCanvas.append('g')
                .classed("polygon", true)
                .classed("zone-" + zone.id, true);

            polyPoints.splice(polyPoints.length - 1);
            //console.log(polyPoints);

            polyEl = gPoly.append("polygon")
                .attr("points", polyPoints);

            for (var i = 0; i < polyPoints.length; i++) {
                gPoly.append('circle')
                    .attr("cx", polyPoints[i][0])
                    .attr("cy", polyPoints[i][1])
                    .attr("r", 4)
                    .call(dragBehavior);
            }

            isDrawing = false;
            isDragging = true;

            bbox = polyEl._groups[0][0].getBBox();
            var bbox2 = gPoly._groups[0][0].getBBox();


            bbox.x = 0;
            bbox.y = 0;
            bbox.width = 50;
            bbox.height = 50;


            // Set translate variable defaults;
            gPoly.datum({
                x: 0,
                y: 0
            });

            // Set translate elem attribute defaults
            gPoly.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")"
            });

            // polyEL.attr("transform", "translate(" + 0 + "," + 0 + ")");
            //
            gPoly.call(d3.drag().on("drag", function (d) {
                d3.select(this).attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")")
            }));

            // Add context menu
            gPoly.on('contextmenu', d3.contextMenu(menu))

            // Add label text
            var gPolyCentroid = d3.polygonCentroid(polyPoints);
            addLabel(gPoly, zone.name, gPolyCentroid);

        }

        function addLabel(g, text, centroid) {
            var svgText = g.append("text");
            svgText.attr("x", centroid[0])
                .attr("y", centroid[1])
                .attr('font-size', 14)
                .attr('font-weight', 400)
                .attr('font-family', 'sans-serif')
                .attr('text-anchor', 'middle')
                .style('fill', 'darkOrange')
                .classed("zone-" + zone.id + '-text', true);
            svgText.text(text);
        }

        //Altering polygon coordinates based on handle drag
        function alterPolygon() {

            if (isDrawing === true) return;

            var alteredPoints = [];
            var selectedP = d3.select(this);
            var parentNode = d3.select(this.parentNode);

            //select only the elements belonging to the parent <g> of the selected circle
            var circles = d3.select(this.parentNode).selectAll('circle');
            var polygon = d3.select(this.parentNode).select('polygon');


            var pointCX = d3.event.x;
            var pointCY = d3.event.y;

            //rendering selected circle on drag
            selectedP.attr("cx", pointCX).attr("cy", pointCY);

            //loop through the group of circle handles attatched to the polygon and push to new array
            for (var i = 0; i < polyPoints.length; i++) {

                var circleCoord = d3.select(circles._groups[0][i]);
                var pointCoord = [parseInt(circleCoord.attr("cx")), parseInt(circleCoord.attr("cy"))];
                alteredPoints[i] = pointCoord;

            }

            //re-rendering polygon attributes to fit the handles
            polygon.attr("points", alteredPoints);

            // Update points
            zone.points = alteredPoints;

            // Update label
            d3.select(".zone-" + zone.id + '-text').remove();
            var gPolyCentroid = d3.polygonCentroid(alteredPoints);
            addLabel(gPoly, zone.name, gPolyCentroid);

            bbox = parentNode._groups[0][0].getBBox();
            console.log(bbox);
        }

        function movePolygon() {

        }

        function prepareTransform(bboxVal) {

            var originalPosition = {
                x: bboxVal.x,
                y: bboxVal.y
            };

            console.log(bboxVal);
            console.log(bbox);

            bbox.x = 0;
            bbox.y = 0;


            //render a bounding box
            // shape.rectEl.attr("x", bbox.x).attr("y", bbox.y).attr("height", bbox.height).attr("width", bbox.width);
            //
            // //drag points
            // shape.pointEl1.attr("cx", bbox.x).attr("cy", bbox.y).attr("r", 4);
            // shape.pointEl2.attr("cx", (bbox.x + bbox.width)).attr("cy", (bbox.y + bbox.height)).attr("r", 4);
            // shape.pointEl3.attr("cx", bbox.x + bbox.width).attr("cy", bbox.y).attr("r", 4);
            // shape.pointEl4.attr("cx", bbox.x).attr("cy", bbox.y + bbox.height).attr("r", 4);

            return originalPosition;
        }
    };

    map.sensorImageLayer = function (svgCanvas, floor, sensor) {

        // Context menu
        var menu = [
            {
                title: 'Delete sensor',
                action: function (elm, d, i) {
                    console.log('You have deleted - ' + this.classList.item(1));
                    d3.select("." + this.classList.item(0)).remove();
                }
            }
        ];

        // Select Group element of Floor sensor images
        var gFloorSensorImages = svgCanvas.selectAll(".floor-" + floor.id);

        // UPDATE
        // Update old elements as needed.
        gFloorSensorImages.attr("class", "floor-" + floor.id + " update");

        // ENTER + UPDATE
        // Create new elements as needed.
        var gSensorContainer = svgCanvas.append("g").classed("sensor-" + sensor.id, true);

        // ENTER
        // Create new elements as needed.
        var image = gSensorContainer.append("image")
            .attr("xlink:href", sensor.url)
            .attr("x", sensor.x)
            .attr("y", sensor.y)
            .attr("width", sensor.w)
            .attr("height", sensor.h);

        // Set translate variable defaults;
        gSensorContainer.datum({
            x: 0,
            y: 0
        });

        // Set translate elem attribute defaults
        gSensorContainer.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")"
        });

        d3.selectAll(".sensor-" + sensor.id).call(d3.drag().on("drag", function (d) {
            // Uncomment if you need to apply to image layer
            // d3.select("." + this.classList[0] + " image").datum(d).attr("transform",
            // "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");
            d3.select(this)
                .attr("transform", "translate(" + (d.x = d3.event.x) + "," + (d.y = d3.event.y) + ")");
        }));

        // Add context menu
        image.on('contextmenu', d3.contextMenu(menu));
    };

    function __init_defs(selection) {
        selection.each(function () {
            var defs = d3.select(this);

            var grad = defs.append("radialGradient")
                .attr("id", "metal-bump")
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "50%")
                .attr("fx", "50%")
                .attr("fy", "50%");

            grad.append("stop")
                .attr("offset", "0%")
                .style("stop-color", "rgb(170,170,170)")
                .style("stop-opacity", 0.6);

            grad.append("stop")
                .attr("offset", "100%")
                .style("stop-color", "rgb(204,204,204)")
                .style("stop-opacity", 0.5);

            var grip = defs.append("pattern")
                .attr("id", "grip-texture")
                .attr("patternUnits", "userSpaceOnUse")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 3)
                .attr("height", 3);

            grip.append("rect")
                .attr("height", 3)
                .attr("width", 3)
                .attr("stroke", "none")
                .attr("fill", "rgba(204,204,204,0.5)");

            grip.append("circle")
                .attr("cx", 1.5)
                .attr("cy", 1.5)
                .attr("r", 1)
                .attr("stroke", "none")
                .attr("fill", "url(#metal-bump)");
        });
    }

    function __init_controls(selection) {
        selection.each(function () {
            var controls = d3.select(this);

            controls.append("path")
                .attr("class", "ui-show-hide")
                .attr("d", "M10,3 v40 h-7 a3,3 0 0,1 -3,-3 v-34 a3,3 0 0,1 3,-3 Z")
                .attr("fill", "url(#grip-texture)")
                .attr("stroke", "none")
                .style("opacity", 0.5);

            controls.append("path")
                .attr("class", "show ui-show-hide")
                .attr("d", "M2,23 l6,-15 v30 Z")
                .attr("fill", "rgb(204,204,204)")
                .attr("stroke", "none")
                .style("opacity", 0.5);

            controls.append("path")
                .attr("class", "hide")
                .attr("d", "M8,23 l-6,-15 v30 Z")
                .attr("fill", "rgb(204,204,204)")
                .attr("stroke", "none")
                .style("opacity", 0);

            controls.append("path")
                .attr("d", "M10,3 v40 h-7 a3,3 0 0,1 -3,-3 v-34 a3,3 0 0,1 3,-3 Z")
                .attr("pointer-events", "all")
                .attr("fill", "none")
                .attr("stroke", "none")
                .style("cursor", "pointer")
                .on("mouseover", function () {
                    controls.selectAll("path.ui-show-hide").style("opacity", 1);
                })
                .on("mouseout", function () {
                    controls.selectAll("path.ui-show-hide").style("opacity", 0.5);
                })
                .on("click", function () {
                    if (controls.select(".hide").classed("ui-show-hide")) {
                        controls.transition()
                            .duration(1000)
                            .attr("transform", "translate(" + (controls.attr("view-width") - 10) + ",0)")
                            .each("end", function () {
                                controls.select(".hide")
                                    .style("opacity", 0)
                                    .classed("ui-show-hide", false);
                                controls.select(".show")
                                    .style("opacity", 1)
                                    .classed("ui-show-hide", true);
                                controls.selectAll("path.ui-show-hide")
                                    .style("opacity", 0.5);
                            });
                    } else {
                        controls.transition()
                            .duration(1000)
                            .attr("transform", "translate(" + (controls.attr("view-width") - 95) + ",0)")
                            .each("end", function () {
                                controls.select(".show")
                                    .style("opacity", 0)
                                    .classed("ui-show-hide", false);
                                controls.select(".hide")
                                    .style("opacity", 1)
                                    .classed("ui-show-hide", true);
                                controls.selectAll("path.ui-show-hide")
                                    .style("opacity", 0.5);
                            });
                    }
                });

            controls.append("rect")
                .attr("x", 10)
                .attr("y", 0)
                .attr("width", 85)
                .attr("fill", "rgba(204,204,204,0.9)")
                .attr("stroke", "none");

            controls.append("g")
                .attr("class", "layer-controls")
                .attr("transform", "translate(15,5)");
        });
    }

    function __set_view(g, s, t) {
        if (!g) return;
        if (s) g.__scale__ = s;
        if (t && t.length > 1) g.__translate__ = t;

        // limit translate to edges of extents
        var minXTranslate = (1 - g.__scale__) *
            (xScale.range()[1] - xScale.range()[0]);
        var minYTranslate = (1 - g.__scale__) *
            (yScale.range()[1] - yScale.range()[0]);

        g.__translate__[0] = Math.min(xScale.range()[0],
            Math.max(g.__translate__[0], minXTranslate));
        g.__translate__[1] = Math.min(yScale.range()[0],
            Math.max(g.__translate__[1], minYTranslate));
        g.selectAll(".map-layers")
            .attr("transform",
                "translate(" + g.__translate__ +
                ")scale(" + g.__scale__ + ")");
    };

    return map;
};

d3.floorplan.version = "0.1.0";