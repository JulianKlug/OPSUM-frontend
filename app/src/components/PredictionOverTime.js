import * as d3 from "d3";
import React, {useEffect, useRef} from "react";

const PredictionOverTime = ({ data }) => {
        const svgRef = useRef(null);

    var data = [
    {x: 0, y0: 11, y1: 15, y2: 5},
    {x: 11, y0: 20, y1: 35, y2: 15},
    {x: 22, y0: 40, y1: 55, y2: 35},
    {x: 33, y0: 50, y1: 65, y2: 45},
    {x: 44, y0: 60, y1: 68, y2: 45},
    {x: 48, y0: 68, y1: 74, y2: 48},
    {x: 58, y0: 62, y1: 71, y2: 50},
    {x: 62, y0: 66, y1: 71, y2: 50},
    ]

    const current_time = 62

    const width = 300;
    const height = 200;
    const text_font_size = '0.7em';


    useEffect(() => {
        var xScale = d3.scaleLinear().domain([0, 72]).range([0, 225]);
        var yScale = d3.scaleLinear().domain([0, 100]).range([170, 15]);

        var positiveArea = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.y0))
            .y1(d => yScale(d.y1));

        const negativeArea = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.y0))
            .y1(d => yScale(d.y2));

        // add line for y0
        const line0 = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y0));

        // add line for y1
        const line1 = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y1));

        // add line for y2
        const line2 = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y2));

        const svg = d3.create("svg")
         .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `${-width/2} 0 ${width} ${height}`)
            .attr("width", '50vw')
            .attr("height", '20vw')

        svg.append("path")
            .attr("d", line0(data))
            .attr("fill", "none")
            .attr("stroke", "blue");

        svg.append("path")
            .attr("d", line1(data))
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr('opacity', 0.5);

        svg.append("path")
            .attr("d", line2(data))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr('opacity', 0.5);

        svg.append("path")
            .attr("d", positiveArea(data))
            .attr("fill", "lightblue")
            .attr("opacity", 0.2);

        svg.append("path")
            .attr("d", negativeArea(data))
            .attr("fill", "lightcoral")
            .attr("opacity", 0.1);

        // add x and y axis
        svg.append("g")
            .attr("transform", "translate(0, 170)")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", "translate(0, 0)")
            .call(d3.axisLeft(yScale).ticks(5));

        // add label for x axis
        svg.append("text")
            .attr("x", 100)
            .attr("y", 200)
            .attr("text-anchor", "middle")
            .text("Time (hours)")
            .style('font-size', text_font_size)


        // add label for y axis
        svg.append("text")
            .attr("x", -100)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Probability (%)")
            .style('font-size', text_font_size)

        // add vertical line for current time
        svg.append("line")
            .attr("x1", xScale(current_time))
            .attr("y1", 67)
            .attr("x2", xScale(current_time))
            .attr("y2", 170)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", 5)
            .attr("opacity", 0.1);

        // add text for current time
        // svg.append("text")
        //     .attr("x", xScale(current_time) + 5)
        //     .attr("y", 160)
        //     .attr("text-anchor", "left")
        //     .text("Current Prediction")
        //     .style('font-size', text_font_size)
        //     .attr("opacity", 0.7);

        // add legend upper right
        svg.append("text")
            .attr("x", 205)
            .attr("y", 20)
            .attr("text-anchor", "left")
            .text("NIHSS")
            .style('font-size', text_font_size)
            .attr("opacity", 0.8);

        svg.append("text")
            .attr("x", 205)
            .attr("y", 40)
            .attr("text-anchor", "left")
            .text("Temperature")
            .style('font-size', text_font_size)
            .attr("opacity", 0.8);

        svg.append("rect")
            .attr("x", 190)
            .attr("y", 10)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "lightblue")
            .attr("opacity", 0.6);

        svg.append("rect")
            .attr("x", 190)
            .attr("y", 30)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "lightcoral")
            .attr("opacity", 0.35);







        if (svgRef.current) {
            svgRef.current.innerHTML = "";
            svgRef.current.appendChild(svg.node());
        }
    })

        return <div ref={svgRef}></div>;

}

export default PredictionOverTime;