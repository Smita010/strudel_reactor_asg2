  // This function takes the current UI state(sliders, radio buttons, selectors, etc.)
  // and replaces the placeholder tags inside the user's Strudel template with the
  // correct Strudel syntax.
export function generateStrudelCode(state, text) {
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
        "<arp_mode>": arpCode,
        "<master>": String(state.master ?? 1),
    };

    let output = text;
    for (const token in replacements) {
        output = output.replaceAll(token, replacements[token]);
    }

    return output;
}

//  Runs the preprocessor and updates the Strudel editor with the fresh code
export function applyPreprocessing(globalEditor, uiState, rawText) {
    if (!globalEditor) return;

    const newCode = generateStrudelCode(uiState, rawText);
    globalEditor.setCode(newCode);
}

export function applyAndPlay(globalEditor, uiState, rawText) {
    if (!globalEditor) return;
    if (globalEditor.repl.state.started !== true) return;

    const newCode = generateStrudelCode(uiState, rawText);
    globalEditor.setCode(newCode);
    globalEditor.evaluate();
}
