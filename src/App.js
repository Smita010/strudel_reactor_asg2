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
import console_monkey_patch from './console-monkey-patch';
import PreprocessorEditor from './components/PreprocessorEditor';
import PlaybackControls from "./components/PlaybackControls";
import InstrumentControls from "./components/InstrumentControls";
import TempoControl from "./components/TempoControl";
import InstrumentSelector from "./components/InstrumentSelector";
import D3Graph from "./components/D3Graph";
import ReverbControl from "./components/ReverbControl";
import ArpSelector from "./components/ArpSelector";


let globalEditor = null;

export function SetupButtons() {
    document.getElementById('play').addEventListener('click', () => {
        globalEditor.evaluate();});

    document.getElementById('stop').addEventListener('click', () => {
        globalEditor.stop();});

    document.getElementById('process').addEventListener('click', () => {
        Proc(window.__uiState);});

    document.getElementById('process_play').addEventListener('click', () => {
        Proc(window.__uiState);
        globalEditor.evaluate();});
}
export function ProcAndPlay(uiState) {
    if (!globalEditor) return;

    if (globalEditor.repl.state.started === true) {
        Proc(uiState);
        globalEditor.evaluate();
    }
}

function generateStrudelCode(state, text) {
    let arpCode = `pick(arpeggiator1, "<0 1 2 3>/2")`; 

    if (state.arpMode === "arp2") {
        arpCode = `pick(arpeggiator2, "<0 1 2 3>/2")`;
    } else if (state.arpMode === "combo") {
        arpCode = `pick(arpeggiator1, "<0 1 2 3>/2") # pick(arpeggiator2, "<0 1 2 3>/2") / 2`;
    }

    const replacements = {
        "<p1_Radio>": state.p1 === "hush" ? "_" : "",
        "<instrument>": state.instrument || "",
        "<reverb>": String(state.reverb ?? 0.4),
        "<arp_mode>": arpCode
    };

    let output = text;
    for (const token in replacements) {
        output = output.replaceAll(token, replacements[token]);
    }

    return output;
}

export function Proc(uiState) {
    if (!globalEditor) {
        console.warn("Strudel editor not ready yet");
        return;
    }

    const text = document.getElementById('proc').value || "";

    const currentState = {
        p1: uiState.p1,
        instrument: uiState.instrument,
        reverb: uiState.reverb,
        arpMode: uiState.arpMode
    };

    const newCode = generateStrudelCode(currentState, text);
    globalEditor.setCode(newCode);
}

export default function StrudelDemo() {
    const hasRun = useRef(false);
    const [text, setText] = useState('<p1_Radio> ' + stranger_tune);
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [p1Mode, setP1Mode] = useState("on");  
    const [instrument, setInstrument] = useState("supersaw");
    const [reverb, setReverb] = useState(0.4);
    const [arpMode, setArpMode] = useState("arp1");


    const uiState = {
        p1: p1Mode,
        instrument: instrument,
        bpm: bpm,
        isPlaying: isPlaying,
        reverb: reverb,
        arpMode: arpMode,

    };
    window.__uiState = uiState;

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
            Proc(window.__uiState)
        }
    }, [ ]);

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
                                    {generateStrudelCode(
                                        { p1: p1Mode, instrument: instrument, reverb: reverb },
                                        text
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
                            onProcess={() => Proc(uiState)}
                            onProcessPlay={() => {
                                Proc(uiState)
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
                        <InstrumentControls
                            onToggle={(mode) => {
                                setP1Mode(mode);
                                const newState = { ...uiState, p1: mode };
                                ProcAndPlay(newState);
                            }}
                        />
                        <InstrumentSelector
                            onChange={(value) => {
                                setInstrument(value);
                                const newState = { ...uiState, instrument: value };
                                ProcAndPlay(newState);
                            }}
                        />
                        <ArpSelector
                            value={arpMode}
                            onChange={(value) => {
                                setArpMode(value);
                                ProcAndPlay({ ...uiState, arpMode: value });
                            }}
                        />
                        <ReverbControl
                            value={reverb}
                            onChange={(v) => {
                                setReverb(v);
                                const updatedState = {
                                    ...uiState,
                                    reverb: v
                                };
                                window.__uiState = updatedState;
                                ProcAndPlay(updatedState);
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