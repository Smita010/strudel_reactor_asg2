import "./App.css";
import React, { useState } from "react";
import D3Graph from "./components/D3Graph";
import PreprocessorEditor from "./components/PreprocessorEditor";
import JsonControls from "./components/JsonControls";
import { stranger_tune } from "./tunes";
import { applyPreprocessing, applyAndPlay } from "./utils/preprocessor";
import StrudelEnvironment, { globalEditor } from "./components/StrudelEnvironment";
import ControlPanel from "./components/ControlPanel";

export default function StrudelDemo() {
  const [text, setText] = useState("<p1_Radio> " + stranger_tune);
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [p1Mode, setP1Mode] = useState("on");
  const [instrument, setInstrument] = useState("supersaw");
  const [reverb, setReverb] = useState(0.4);
  const [arpMode, setArpMode] = useState("arp1");
  const [master, setMaster] = useState(1);

  const uiState = { p1: p1Mode, instrument, bpm, isPlaying, reverb, arpMode, master };

  return (
    <div>
      <h2 className="text-center mb-3">Strudel Demo</h2>
      <main>
        <div className="row">
          <div className="col-md-10">
            <D3Graph bpm={bpm} isPlaying={isPlaying} />
            <div className="editor-panels">
              <div className="editor-card">
                <div className="card">
                  <div className="card-body">
                    <h5>Preprocessor Editor</h5>
                    <PreprocessorEditor value={text} onChange={setText} />
                  </div>
                </div>
              </div>
              <div className="editor-card">
                <div className="card">
                  <div className="card-body">
                    <h5>Live Strudel Output</h5>
                    <StrudelEnvironment
                      uiState={uiState}
                      text={text}
                      stranger_tune={stranger_tune}
                      applyPreprocessing={applyPreprocessing}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="json-spacing">
              <div className="json-wrapper">
                <JsonControls
                  uiState={uiState}
                  onLoadState={(loaded) => {
                    setP1Mode(loaded.p1 ?? "on");
                    setInstrument(loaded.instrument ?? "supersaw");
                    setBpm(loaded.bpm ?? 120);
                    setReverb(loaded.reverb ?? 0.4);
                    setArpMode(loaded.arpMode ?? "arp1");
                    setMaster(loaded.master ?? 1);
                    applyAndPlay(globalEditor, loaded, text);
                  }}
                />
              </div>
            </div>
          </div>
          <ControlPanel
            uiState={uiState}
            text={text}
            setBpm={setBpm}
            setP1Mode={setP1Mode}
            setInstrument={setInstrument}
            setReverb={setReverb}
            setArpMode={setArpMode}
            setMaster={setMaster}
            setIsPlaying={setIsPlaying}
            applyAndPlay={applyAndPlay}
            applyPreprocessing={applyPreprocessing}
          />
        </div>
        <canvas id="roll" className="mt-4"></canvas>
      </main>
    </div>
  );
}