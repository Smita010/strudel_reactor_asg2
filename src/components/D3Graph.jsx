import React, { useEffect, useRef } from "react";
import * as d3 from "d3";


// D3 graph that shows a simple animated bar visualiser.
export default function D3Graph({ bpm, isPlaying }) {
    const svgRef = useRef();
    const animationRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = svgRef.current.clientWidth;
        const height = 150;

        // Clear any previous drawings so the graph resets properly
        svg.selectAll("*").remove();
        svg.attr("width", width).attr("height", height);

        const barCount = 40;

        // Pink gradient used on the bars to match the theme
        const defs = svg.append("defs");
        const gradient = defs.append("linearGradient")
            .attr("id", "pinkGradient")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#f7b2c4");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#f78ca0");

        // Random starting data for the bars
        const data = Array.from({ length: barCount }, () => Math.random());

        // Standard D3 scales for layout
        const x = d3.scaleBand()
            .domain(d3.range(barCount))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);

        // Draw the bars once
        const bars = svg
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (_, i) => x(i))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d))
            .attr("height", d => height - y(d))
            .attr("fill", "url(#pinkGradient)");

        let phase = 0;

        // Animation function updated using requestAnimationFrame
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

        // Only animate when the song is playing
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
                <h5>Tempo Graph</h5>
                <svg ref={svgRef} style={{ width: "100%", height: "150px" }}></svg>
                <p className="small text-muted">Graph moves only when playback is active</p>
            </div>
        </div>
    );
}
