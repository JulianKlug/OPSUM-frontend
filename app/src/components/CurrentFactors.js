import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

const CurrentFactors = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        const data = [
            { State: "NIHSS: 0", value: 0.11 },
            { State: "IVT timing: <91 min", value: 0.10 },
            { State: "INR: 0.9", value: 0.06 },
            { State: "Leucocytes: 12 G/L", value: -0.06 }, // units are in 10^9/L
            { State: "Temperature: 37.9°C", value: -0.03 },
            { State: "Sodium: 143 mmol/L", value: -0.02 }, // units are in mmol/L
        ];

        let width = 300;
        const metric = "absolute";
        const text_font_size = '1.4em';
        const number_font_size = '0.7em';

        // Specify the chart’s dimensions.
        const barHeight = 50;
        const marginTop = 0;
        const marginRight = 0;
        const marginBottom = 0;
        const marginLeft = 0;
        const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

        // Create the positional scales.
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.value))
            .rangeRound([marginLeft, width - marginRight]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.State))
            .rangeRound([marginTop, height - marginBottom])
            .padding(0.2);

        // Create the format function.
        const format = d3.format(metric === "absolute" ? "+.2f" : "+.0%");
        const tickFormat = metric === "absolute" ? d3.formatPrefix("+.1", 1e6) : d3.format("+.0%");

        // Create the SVG container.
        const svg = d3.create("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `${-width} 0 ${width} ${height}`)
            .attr("width", '50vw')
            .attr("height", '20vw')

        // Add a rect for each state.
        svg.append("g")
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("fill", (d) => d3.schemeRdBu[3][d.value > 0 ? 2 : 0])
            // set opacity
            .attr("opacity", 0.7)
            .attr("x", (d) => x(Math.min(d.value, 0)))
            .attr("y", (d) => y(d.State))
            .attr("width", d => Math.abs(x(d.value) - x(0)))
            .attr("height", y.bandwidth());

        // Add a text label for each state.
        svg.append("g")
            .attr("font-family", "sans-serif")
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("text-anchor", d => d.value < 0 ? "end" : "start")
            .attr("x", (d) => x(d.value) + Math.sign(d.value - 0) * 4)
            .attr("y", (d) => y(d.State) + y.bandwidth() / 2)
            .attr("dy", "0.35em")
            .text(d => format(d.value))
            .style('font-size', number_font_size)

        // Add the axes and grid lines.
        svg.append("g")
            .attr("transform", `translate(0,${marginTop})`)
            .call(d3.axisTop(x).ticks(width / 80).tickFormat(tickFormat))
            .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.05))
            .call(g => g.select(".domain").remove());

        svg.append("g")
            .attr("transform", `translate(${x(0)},0)`)
            .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
            .call(g => g.selectAll(".tick text").filter((d, i) => data[i].value < 0)
            .attr("text-anchor", "start")
            .attr("x", 4))
            .selectAll("text")
            .style('font-size', text_font_size)
            .style('fill', '#000');

        if (svgRef.current) {
            svgRef.current.innerHTML = "";
            svgRef.current.appendChild(svg.node());
        }
    }, []);

    return <div ref={svgRef}></div>;
};

export default CurrentFactors;