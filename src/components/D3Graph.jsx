import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Graph({ bpm, isPlaying }) {
    const svgRef = useRef();
    const animationRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 350;
        const height = 150;
        svg.selectAll("*").remove();

        const data = Array.from({ length: 100 }, (_, i) =>
            Math.sin(i / 10) * 0.5 + 0.5
        );

        const x = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
        const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

        const line = d3
            .line()
            .x((_, i) => x(i))
            .y((d) => y(d))
            .curve(d3.curveBasis);

        const path = svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#007bff")
            .attr("stroke-width", 2)
            .attr("d", line);

        let phase = 0;
        const animate = () => {
            const offsetData = data.map((_, i) => Math.sin(i / 10 + phase) * 0.5 + 0.5);
            path.attr("d", line(offsetData));
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
                <svg ref={svgRef} width="100%" height="150"></svg>
                <p className="small text-muted">
                    Graph moves only when playback is active
                </p>
            </div>
        </div>
    );
}
