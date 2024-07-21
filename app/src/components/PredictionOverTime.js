import * as d3 from "d3";
import React, {useEffect, useRef} from "react";
import {filterConsecutiveNumbers, isMobile, objectMap} from "../utils";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    mobileDiv: {
        marginTop: '7vh',
    }
}));

const PredictionOverTime = ({predictions, patientData, shapValues, patientTimepoint}) => {
    const svgRef = useRef(null);
    const classes = useStyles();

    let svgHeight = '20vw';
    let svgWidth = '50vw';
    if (isMobile()) {
        svgHeight = '36vw';
        svgWidth = '90vw';
    }


    // computation constants
    const threshold = 2;
    const k = 0.4; // amplification factor on graph of shap values
    const n_features = 2;

    //  plotting constants
    const width = 300;
    const height = 200;
    const text_font_size = '0.7em';
    const title_font_size = isMobile() ? '0.8em' :'1em';
    // vh to px
    const convertVwToPx = (vw) => { return vw * window.innerWidth / 100; }
    // const titleTextYMargin = isMobile() ? 25 : 50;
    const titleTextYMargin = convertVwToPx(svgHeight.slice(0, -2)/5);
    console.log(titleTextYMargin);

    // convert predictions to data obj
    let data = Object.keys(predictions).map((key) => {
        if (Number.parseInt(key) <= patientTimepoint) {
            return {
                x: Number.parseInt(key),
                y0: predictions[key][0] * 100
            }
        }});
    // remove undefined values
    data = data.filter((d) => d !== undefined);

    // transform to array (remove last two elements - last timestep and inner representation)
    const patientDataArray = Object.keys(patientData).map((key) => patientData[key]).splice(0, 72);
    // in every element of patientDataArray, drop the time_step key
    patientDataArray.forEach((element) => {
        delete element.time_step;
    });
    // find the keys with non static values over time, defined as std > 0.01
    const non_static_keys = Object.keys(patientDataArray[0]).filter((key) => {
        const values = patientDataArray.map((element) => element[key]);
        return d3.deviation(values) > 0.01;
    });
    // transform shapValues to array (remove last two elements - last timestep and inner representation)
    const shapValuesArray = Object.keys(shapValues).map((key) => shapValues[key]).splice(0, 72);
    // remove last element for each element in shapValuesArray (last timestep)
    shapValuesArray.forEach((element) => {
        // remove "Unnamed: 0"
        delete element["Unnamed: 0"];
    })

    // significant_positive_timesteps = filter_consecutive_numbers(np.where(np.diff(predictions) > threshold)[0])
    const significant_positive_timesteps = data.map((element, index) => {
        if (index > 0) {
            if (element.y0 - data[index - 1].y0 > threshold) {
                return element.x;
            }
        }
    })
    .filter((element) => element !== undefined);
    const significant_positive_timesteps_filtered = filterConsecutiveNumbers(significant_positive_timesteps);
    const significant_negative_timesteps = data.map((element, index) => {
        if (index > 0) {
            if (element.y0 - data[index - 1].y0 < -threshold) {
                return element.x;
            }
        }
    })
    .filter((element) => element !== undefined);
    const significant_negative_timesteps_filtered = filterConsecutiveNumbers(significant_negative_timesteps);

    // at every significant positive timestep, find the name of the feature with the highest delta shap value
    const delta_shap_values = shapValuesArray.map((element, index) => {
        if (index > 0) {
            return objectMap(element, (feature, feature_key) => {
                return feature - shapValuesArray[index - 1][feature_key];
        })
        }
    })

    const selected_positive_features_by_impact = significant_positive_timesteps_filtered.map((timestep) => {
        const delta_shap_values_timestep = delta_shap_values[timestep];
        const non_static_delta_shap_values_timestep = non_static_keys.map((key) => delta_shap_values_timestep[key]);
        // find absolute max value in delta shap
        const max_value = Math.max(...non_static_delta_shap_values_timestep.map(Math.abs));
        // return feature name
        return non_static_keys[non_static_delta_shap_values_timestep.map(Math.abs).indexOf(max_value)];
    })

    const selected_negative_features_by_impact = significant_negative_timesteps_filtered.map((timestep) => {
        const delta_shap_values_timestep = delta_shap_values[timestep];
        const non_static_delta_shap_values_timestep = non_static_keys.map((key) => delta_shap_values_timestep[key]);
        // find absolute max value in delta shap
        const max_value = Math.max(...non_static_delta_shap_values_timestep.map(Math.abs));
        // return feature name
        return non_static_keys[non_static_delta_shap_values_timestep.map(Math.abs).indexOf(max_value)];
    })

    // from the selected negative and positive features, make unique list
    const selected_features = [...new Set(selected_positive_features_by_impact.concat(selected_negative_features_by_impact))];
    // sort by shap value at current timepoint
    // const sorted_selected_features = selected_features.sort((a, b) => shapValuesArray[patientTimepoint -1][b] - shapValuesArray[patientTimepoint -1][a]);
    // return the top n_features
    const top_features = selected_features.slice(0, n_features);

    // for every timepoint, add shap values of top features to data as yx
    data = data.map((element, timestep) => {
        top_features.forEach((feature, feature_index) => {
            element[`y${feature_index + 1}`] = element.y0 + k * shapValuesArray[timestep][feature] * 100;
        })
        return element;
    })


    // GRAPHICS
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
            .attr("viewBox", `${-width / 2} 0 ${width} ${height}`)
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        // remove all div with class tooltip or titleText
        d3.selectAll('.prediction-over-time-tooltip').remove();
        d3.selectAll('.prediction-over-time-titleText').remove();

        const tooltip = d3.select("body").append("div")
            .attr("class", "prediction-over-time-tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("font-size", text_font_size)

        const titleText = d3.select("body").append("div")
            .attr("class", "prediction-over-time-titleText")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("font-size", title_font_size);

        svg.append("path")
            .attr("d", line0(data))
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr('opacity', 0)
            .on('mouseover', function(e) {
                d3.select(this).style('cursor', 'pointer');
                tooltip
                   .style("opacity", 1)
                       .html("Prediction over time")
                       .style("left", (e.pageX + 10) + "px")
                       .style("top", (e.pageY - 10 + window.scrollY) + "px");
            })
            .on('mouseout', function() {
                tooltip.style("opacity", 0);
            })
            .transition()
            .duration(1000)
            .attr('opacity', 1)

        svg.append("path")
            .attr("d", line1(data))
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr('opacity', 0.5);

        svg.append("path")
            .attr("d", line2(data))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr('opacity', 0.5)

        svg.append("path")
            .attr("d", positiveArea(data))
            .attr("fill", "lightblue")
            .attr("opacity", 0.2)
            .on('mouseover', function(e) {
                    d3.select(this).style('cursor', 'pointer');
                    d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', 0.4);
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip
                       .style("opacity", 1)
                           .html(`Impact of ${top_features[0]}`)
                           .style("left", (e.pageX + 10) + "px")
                           .style("top", (e.pageY - 10 + window.scrollY) + "px");
            })
            .on('mouseout', function() {
                    tooltip.style("opacity", 0);
                    d3.select(this).transition()
                          .duration('50')
                          .attr('opacity', 0.2);
            })

        svg.append("path")
            .attr("d", negativeArea(data))
            .attr("fill", "lightcoral")
            .attr("opacity", 0.1)
            .on('mouseover', function(e) {
                    d3.select(this).style('cursor', 'pointer');
                    d3.select(this).transition()
                       .duration('50')
                       .attr('opacity', 0.2);
                    tooltip.transition().duration(200).style("opacity", .9);
                    tooltip
                       .style("opacity", 1)
                           .html(`Impact of ${top_features[1]}`)
                           .style("left", (e.pageX + 50) + "px")
                           .style("top", (e.pageY - 10 + window.scrollY) + "px");
            })
            .on('mouseout', function() {
                    tooltip.style("opacity", 0);
                    d3.select(this).transition()
                          .duration('50')
                          .attr('opacity', 0.1);
            })

        // add x and y axis
        svg.append("g")
            .attr("transform", "translate(0, 170)")
            .call(d3.axisBottom(xScale))
            .on('mouseover', function(e) {
                d3.select(this).style('cursor', 'pointer');
                titleText.transition().duration(200).style("opacity", .9);
                titleText.html(`Prediction and impact factors over time`)
                    .style("left", (this.getBoundingClientRect().x + this.getBoundingClientRect().width/2 - titleText.node().getBoundingClientRect().width / 2) + "px")
                    .style("top", (this.getBoundingClientRect().y + titleTextYMargin + window.scrollY) + "px")
                    .style("z-index", -10);

            })
            .on('mouseout', function() {
                titleText.transition().duration(500).style("opacity", 0);
            });


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
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Probability of good")
            .style('font-size', text_font_size)

        svg.append("text")
            .attr("x", -100)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("functional outcome (%)")
            .style('font-size', text_font_size)

        // add vertical line for current time
        svg.append("line")
            .attr("x1", xScale(patientTimepoint))
            .attr("y1", yScale(0))
            .attr("x2", xScale(patientTimepoint))
            .attr("y2", yScale(data[patientTimepoint].y0))
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
            .text(selected_features[0])
            .style('font-size', text_font_size)
            .attr("opacity", 0.8);

        svg.append("text")
            .attr("x", 205)
            .attr("y", 40)
            .attr("text-anchor", "left")
            .text(selected_features[1])
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

        //  add legend for blue line
        svg.append("line")
            .attr("x1", 190)
            .attr("y1", 56)
            .attr("x2", 200)
            .attr("y2", 56)
            .attr("stroke", "blue")
            .attr("opacity", 0.8);

        svg.append("text")
            .attr("x", 205)
            .attr("y", 60)
            .attr("text-anchor", "left")
            .text("Prediction")
            .style('font-size', text_font_size)
            .attr("opacity", 0.8);

        if (svgRef.current) {
            svgRef.current.innerHTML = "";
            svgRef.current.appendChild(svg.node());
        }
    })

    return (
        <div ref={svgRef} className={(isMobile()) ? classes.mobileDiv : null}></div>
)

}

export default PredictionOverTime;