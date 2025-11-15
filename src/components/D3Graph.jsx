import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Graph({ bpm, isPlaying }) {
    const svgRef = useRef();
    const animationRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = 150;

        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const barCount = 40;
        const data = Array.from({ length: barCount }, () => Math.random());

        const x = d3.scaleBand()
            .domain(d3.range(barCount))
            .range([0, width])  
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);

        const bars = svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (_, i) => x(i))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d))
            .attr("height", d => height - y(d))
            .attr("fill", "#007bff");

        let phase = 0;

        const animate = () => {
            const animated = data.map((_, i) =>
                Math.sin(i / 5 + phase) * 0.5 + 0.5
            );

            bars
                .data(animated)
                .attr("y", d => y(d))
                .attr("height", d => height - y(d));

            phase += bpm / 5000;
            animationRef.current = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationRef.current);
        }

        return () => cancelAnimationFrame(animationRef.current);
    }, [bpm, isPlaying]);

    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body text-center">
                <h5 className="text-primary mb-2">Tempo Graph</h5>
                <svg ref={svgRef} style={{ width: "100%", height: "150px" }}></svg>
                <p className="small text-muted">Graph moves only when playback is active</p>
            </div>
        </div>
    );
}
