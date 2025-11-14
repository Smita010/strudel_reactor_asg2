import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import PreprocessorEditor from './components/PreprocessorEditor';
import PlaybackControls from "./components/PlaybackControls";
import InstrumentControls from "./components/InstrumentControls";
import TempoControl from "./components/TempoControl";
import InstrumentSelector from "./components/InstrumentSelector";
import D3Graph from "./components/D3Graph";

let globalEditor = null;

export function SetupButtons() {

    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
    document.getElementById('process').addEventListener('click', () => {
        Proc()
    }
    )
    document.getElementById('process_play').addEventListener('click', () => {
        if (globalEditor != null) {
            Proc()
            globalEditor.evaluate()
        }
    }
    )
}

export function ProcAndPlay() {
    if (globalEditor != null && globalEditor.repl.state.started == true) {
        console.log(globalEditor)
        Proc()
        globalEditor.evaluate();
    }
}

export function Proc() {

    let proc_text = document.getElementById('proc').value || "";
    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
    ProcessText(proc_text);
    globalEditor.setCode(proc_text_replaced)
}

export function ProcessText(match, ...args) {

    let replace = ""
    if (document.getElementById('flexRadioDefault2').checked) {
        replace = "_"
    }

    return replace
}
export default function StrudelDemo() {
    const hasRun = useRef(false);
    const [text, setText] = useState('<p1_Radio> ' + stranger_tune);
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleD3Data = (event) => {
        console.log(event.detail);
    };

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                    prebake: async () => {
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });
            
            document.getElementById('proc').value = stranger_tune
            SetupButtons()
            Proc()
        }
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-3">Strudel Demo</h2>
            <main>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card shadow-sm mb-3">
                            <div className="card-body">
                                <h5 className="text-primary">Preprocessor Editor</h5>
                                <PreprocessorEditor value={text} onChange={setText} />
                            </div>
                        </div>

                        <div className="card shadow-sm mb-3">
                            <div className="card-body">
                                <h5 className="text-primary">Processed Output Preview</h5>
                                <pre className="code-preview">
                                    {text.replaceAll(
                                        "<p1_Radio>",
                                        (typeof document !== "undefined" &&
                                            document.getElementById("flexRadioDefault2")?.checked)
                                            ? "_"
                                            : ""
                                    )}
                                </pre>
                            </div>
                        </div>

                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="text-primary">Live Strudel Output</h5>
                                <div id="editor" />
                                <div id="output" />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <PlaybackControls
                            onProcess={Proc}
                            onProcessPlay={() => {
                                Proc();
                                globalEditor?.evaluate();
                                setIsPlaying(true);
                            }}
                            onPlay={() => {
                                globalEditor?.evaluate();
                                setIsPlaying(true);
                            }}
                            onStop={() => {
                                globalEditor?.stop();
                                setIsPlaying(false);
                            }}
                        />
                        <TempoControl
                            onChange={(value) => {
                                setBpm(value);
                                if (typeof window.setcps === "function") {
                                    window.setcps(value / 60 / 4);
                                }
                            }}
                        />
                        <InstrumentControls onToggle={ProcAndPlay} />
                        <InstrumentSelector
                            onChange={(instrument) => {
                                console.log("Instrument changed to:", instrument);
                                ProcAndPlay();
                            }}
                        />
                        <D3Graph bpm={bpm} isPlaying={isPlaying} />
                    </div>
                </div>
                <canvas id="roll" className="mt-4"></canvas>
            </main>
        </div>
    );
}