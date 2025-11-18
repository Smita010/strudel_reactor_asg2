import React, { useEffect, useRef } from "react";
import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import { initAudioOnFirstClick } from "@strudel/webaudio";
import { transpiler } from "@strudel/transpiler";
import {
    getAudioContext,
    webaudioOutput,
    registerSynthSounds,
} from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import console_monkey_patch from "../console-monkey-patch";

let globalEditor = null;

//  This component sets up the actual Strudel editor 
//It only runs once when the page loads because StrudelMirror cannot be re-initialised inside React re-renders without breaking audio playback
export default function StrudelEnvironment({
    uiState,
    text,
    stranger_tune,
    applyPreprocessing,
}) {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console_monkey_patch();

        document.addEventListener("d3Data", (event) =>
            console.log(event.detail)
        );

        const canvas = document.getElementById("roll");
        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
        const drawContext = canvas.getContext("2d");
        const drawTime = [-2, 2];

        globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: document.getElementById("editor"),
            drawTime,
            onDraw: (haps, time) =>
                drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import("@strudel/core"),
                    import("@strudel/draw"),
                    import("@strudel/mini"),
                    import("@strudel/tonal"),
                    import("@strudel/webaudio")
                );
                await Promise.all([
                    loadModules,
                    registerSynthSounds(),
                    registerSoundfonts(),
                ]);
            },
        });

        setTimeout(() => {
            if (globalEditor) {
                applyPreprocessing(globalEditor, uiState, stranger_tune);
            }
        }, 800); 

    }, []); 

    return (
        <div>
            <div id="editor"></div>
            <div id="output"></div>
        </div>
    );
}

export { globalEditor };
