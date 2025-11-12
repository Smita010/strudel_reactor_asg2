import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Graph({ bpm }) {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 300;
        const height = 150;
        const margin = { top: 10, right: 10, bottom: 30, left: 30 };

        svg.selectAll("*").remove(); 
        svg.attr("width", width).attr("height", height);

        const data = Array.from({ length: 10 }, (_, i) => ({
            x: i,
            y: Number(bpm) + Math.sin(i / 2) * 10, 
        }));

        const x = d3.scaleLinear().domain([0, 9]).range([margin.left, width - margin.right]);
        const y = d3.scaleLinear().domain([50, 200]).range([height - margin.bottom, margin.top]);

        const line = d3
            .line()
            .x((d) => x(d.x))
            .y((d) => y(d.y))
            .curve(d3.curveMonotoneX);

        svg.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5));

        svg.append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(5));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#007bff")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg.selectAll(".dot")
            .data(data)
            .join("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d.x))
            .attr("cy", (d) => y(d.y))
            .attr("r", 3)
            .attr("fill", "#007bff");

    }, [bpm]); 

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body text-center">
                <h5 className="text-primary mb-2">Tempo Graph</h5>
                <svg ref={svgRef}></svg>
                <p className="text-muted small mt-2">Current BPM: {bpm}</p>
            </div>
        </div>
    );
}
