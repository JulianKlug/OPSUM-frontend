import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const CurrentPrediction = ({functional_prediction, mortality_prediction}) => {
    const svgRef = useRef(null);

    useEffect(() => {
        let width = 148;
        let height = width/2;
        let radius = Math.min(width, height*2) / 2;
        let angle = 0.5 * Math.PI;
        let data = [
            {
                label: 'Data',
                good_functional_outcome: Number.parseFloat(functional_prediction * 100).toFixed(0),
                mortality: Number.parseFloat(mortality_prediction * 100).toFixed(0)
            }
        ];

        let backgroundArc = d3
            .arc()
            .innerRadius(58)
            .outerRadius(radius)
            .cornerRadius(20)
            .startAngle(angle * -1)
            .endAngle(angle);

        let leftArc = d3
            .arc()
            .innerRadius(58)
            .outerRadius(radius)
            .cornerRadius(20)
            .startAngle(angle * -1)
            .endAngle(function(d) { return -angle + (d.good_functional_outcome / 100) * 2 * angle; });

        let rightArc = d3
            .arc()
            .innerRadius(58)
            .outerRadius(radius)
            .cornerRadius(20)
            .startAngle(function(d) {
                // d should be the distance to the end of the arc
                return angle - (d.mortality / 100) * 2 * angle;
            })
            .endAngle(angle);

        if (svgRef.current) {
            svgRef.current.innerHTML = ""; // Clear previous SVG content

            let svg = d3
                .select(svgRef.current)
                .append('svg')
                .attr("viewBox", `0 0 ${width} ${height}`)

            let charts = svg
                .selectAll('g')
                .data(data)
                .enter()
                .append('g')
                .attr('transform', function() {
                    return (
                        'translate(' + width / 2 + ',' + height / 1 + ')'
                    );
                });


            const text_font_size = '0.5em';
            let legend = svg
                .selectAll('.legend')
                .data(data)
                .enter()
                .append('g')
                .attr('class', 'legend')

            // legend just left to the chart
            legend
                .append('text')
                .attr('x', -45)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .attr(
                    'transform',
                    'translate(' + width / 2 + ',' + height / 1 + ')'
                )
                .text(function(d) {
                    return d.good_functional_outcome + '%';
                })
            // text size
                .style('font-size', text_font_size)
                .style('fill', '#000');

            // legend just right to the chart
            legend
                .append('text')
                .attr('x', 45)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .attr(
                    'transform',
                    'translate(' + width / 2 + ',' + height / 1 + ')'
                )
                .text(function(d) {
                    return d.mortality + '%';
                })
                .style('font-size', text_font_size)
                .style('fill', '#000');

            charts
                .append('path')
                .attr('d', backgroundArc)
                .attr('fill', '#F3F3F4');

            var tooltip = d3.select(svgRef.current).append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)
                    .style("position", "absolute")
            // let text be centered on the beginning of the tooltip
                .style("text-align", "center")

            charts
                .append('path')
                .attr('d', leftArc)
                // turquoise
                .attr('fill', '#00B0B9')
                .on('mouseover', function(e) {
                    d3.select(this).style('cursor', 'pointer');
                    d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '.85');
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`Good Functional Outcome`)
                        // .style("left", (e.pageX - 50) + "px")
                        // .style("top", (e.pageY - 60) + "px");
                        .style("left", (this.getBoundingClientRect().x - tooltip.node().getBoundingClientRect().width / 2) + "px")
                        .style("top", (this.getBoundingClientRect().y + this.getBoundingClientRect().height  + window.scrollY + 10) + "px");

                })
                .on('mouseout', function (d, i) {
                  d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '1');
                    tooltip.transition().duration(500).style("opacity", 0);

                })
                .transition() // Start a transition
                .duration(1000) // Duration of 1000ms (1 second)
                .attrTween('d', function(d) {
                    var i = d3.interpolate(leftArc.startAngle()(), leftArc.endAngle()(d));
                    return function(t) {
                        return leftArc.endAngle(i(t))(d);
                    };
                });


            charts
                .append('path')
                .attr('d', rightArc)
                // dark red
                .attr('fill', '#D7263D')
                .on('mouseover', function(e) {
                    d3.select(this).style('cursor', 'pointer');
                    d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '.85');
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip.html(`Mortality`)
                        // .style("left", (e.pageX - 50) + "px")
                        // .style("top", (e.pageY - 60) + "px");
                        .style('text-align', 'right')
                        .style("left", (this.getBoundingClientRect().x + this.getBoundingClientRect().width - tooltip.node().getBoundingClientRect().width / 2) + "px")
                        .style("top", (this.getBoundingClientRect().y + this.getBoundingClientRect().height  + window.scrollY + 10) + "px");

                })
                .on('mouseout', function (d, i) {
                  d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', '1');
                  tooltip.transition().duration(500).style("opacity", 0);
                })
                .transition() // Start a transition
                .duration(1000) // Duration of 1000ms (1 second)
                .attrTween('d', function(d) {
                    var i = d3.interpolate(rightArc.endAngle()(), rightArc.startAngle()(d));
                    return function(t) {
                        return rightArc.startAngle(i(t))(d);
                    };
                });

        }
    }, [functional_prediction, mortality_prediction]);

    return (
        <div ref={svgRef}></div>
    );
};

export default CurrentPrediction;