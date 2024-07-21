import * as d3 from "d3";
import React, { useRef, useEffect } from "react";
import units from "./units";
import {isMobile} from "../utils";

const CurrentFactors = ({currentData, currentShapValues}) => {
    const svgRef = useRef(null);

    let svgHeight = '20vw';
    let svgWidth = '50vw';
    if (isMobile()) {
        svgHeight = '36vw';
        svgWidth = '90vw';
    }

    useEffect(() => {
        // drop ["Unnamed: 0"] from currentShapValues (time step index)
        delete currentShapValues["Unnamed: 0"];

        // get the index of 3 biggest and 3 smallest values of the shap values
        const shap_values = Object.keys(currentShapValues).map((key) => [key, currentShapValues[key]]);
        const shap_values_sorted = shap_values.slice().sort((a, b) => a[1] - b[1]);
        const top_3_pos_features = shap_values_sorted.slice(-3).reverse();
        const top_3_neg_features = shap_values_sorted.slice(0, 3);

        // drop timestep from currentData
        delete currentData["time_step"];
        // get the top 3 and bottom 3 data
        const data = [];
        // add the top 3 data and bottom 3 data to the data array
        for (let i = 0; i < 3; i++) {
            data.push({State: `${top_3_pos_features[i][0]}: ${
                Math.round(currentData[top_3_pos_features[i][0]])
            } ${units[top_3_pos_features[i][0]] ? units[top_3_pos_features[i][0]] : ""}` ,
                value: currentShapValues[top_3_pos_features[i][0]]});
            data.push({State: `${top_3_neg_features[i][0]}: ${
                Math.round(currentData[top_3_neg_features[i][0]])
                } ${units[top_3_neg_features[i][0]] ? units[top_3_neg_features[i][0]] : ""}`,
                value: currentShapValues[top_3_neg_features[i][0]]});
        }

        let width = 300;
        const metric = "absolute";
        const text_font_size = '1.4em';
        const number_font_size = '0.7em';
        const title_font_size = isMobile() ? '0.8em' :'1em';
        const transition_duration = 500;

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
            .attr("height", svgHeight)
            .attr("width", svgWidth);

        // Bind the data to the rectangles (bars)
        const bars = svg.selectAll("rect")
            .data(data, d => d.State); // Use the State as a key for data binding

        const titleText = d3.select("body").append("div")
            .attr("class", "current-factors-title")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("font-size", title_font_size)
            .style("text-align", "center")

        // Enter selection: Initialize new bars
        bars.enter().append("rect")
            .attr("fill", d => d3.schemeRdBu[3][d.value > 0 ? 2 : 0])
            .attr("x", x(0))
            .attr("y", d => y(d.State))
            .attr("height", y.bandwidth())
            .attr("opacity", 0.7) // Initial opacity for the entering bars
            // Transition for new bars
            .transition().duration(transition_duration)
            .attr("width", d => Math.abs(x(d.value) - x(0)))
            .attr("x", d => x(Math.min(d.value, 0)));

        // Update selection: Update existing bars
        bars.transition().duration(transition_duration)
            .attr("y", d => y(d.State))
            .attr("width", d => Math.abs(x(d.value) - x(0)))
            .attr("x", d => x(Math.min(d.value, 0)))
            .attr("height", y.bandwidth());

        // Exit selection: Remove bars that no longer have corresponding data
        bars.exit()
            .transition().duration(transition_duration)
            .attr("width", 0) // Transition exiting bars to width of 0
            .remove();

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

        // Add the title on hover over background
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("opacity", 0)
            .on("mouseover", function() {
                console.log(this.getBoundingClientRect());
                titleText.transition().duration(200).style("opacity", 1);
                titleText.html(`Current most influential factors`)
                    .style("left", (this.getBoundingClientRect().x + this.getBoundingClientRect().width/2 - titleText.node().getBoundingClientRect().width / 2) + "px")
                    .style("top", (this.getBoundingClientRect().y + this.getBoundingClientRect().height + window.scrollY + 5) + "px");
            })
            .on("mouseout", function() {
                titleText.transition().duration(200).style("opacity", 0);
            })


        if (svgRef.current) {
            svgRef.current.innerHTML = "";
            svgRef.current.appendChild(svg.node());
        }
    }, [currentData, currentShapValues]);

    return <div ref={svgRef}></div>;
};

export default CurrentFactors;