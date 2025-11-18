# Strudel Demo 

## Overview

Strudel Reactor is a React-based interface that sits on top of a local Strudel.cc instance. 
The goal of the project is to make live-coding music easier by replacing manual text edits with an interactive UI. 
Instead of changing patterns or effects by typing into the Strudel editor directly, users can adjust controls (tempo, instruments, arpeggiators, reverb, etc.), 
and the preprocessor updates the underlying Strudel code automatically. 

## Installation and Setup

### Prerequisites
- Node.js (v24.x or later recommended)
- npm (Node Package Manager, typically bundled with Node.js)
- Git for cloning the repository
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### Notes
- The `node_modules` folder is excluded from the repository via `.gitignore`. You must run `npm install` on any new machine or after a fresh clone.
- The development server runs continuously in your terminal. To stop it, use `Ctrl+C` (or `Cmd+C` on macOS).
- If port 3000 is already in use, npm will prompt you to use an alternative port.

## Core Features and Requirements Met

### UI & Controls 

All required Bootstrap component types are included:

- **Buttons**: Playback (Preprocess, Proc & Play, Play, Stop)
- **Radio Buttons**: p1 ON/HUSH toggle
- **Dropdowns**: Instrument selector, Arpeggiator selector
- **Sliders**: Tempo, Reverb amount, Master volume
- **File Input**: JSON load
- **Alerts**: Browser-based for invalid JSON

**Styling**
- Custom pink theme and gradients
- Glass-style cards with rounded edges
- Matching scrollbar theme
- Hover effects and clean layout
- Components positioned using Flexbox
- Fully consistent look across all control panels

### Preprocessing Logic & Maintainability 

Full component-based structure (no logic dumped in App.js)

**Clean division of responsibilities:**
- PreprocessorEditor
- PlaybackControls
- InstrumentControls
- InstrumentSelector
- ArpSelector
- ReverbControl
- TempoControl
- D3Graph
- JsonControls

**All state stored and updated in App.js (top-down approach)**

**Preprocessor replaces tags like:**
- `<p1_Radio>`
- `<instrument>`
- `<arp_mode>`
- `<reverb>`
- `<master>`

Arpeggiator logic supports multiple modes including a combined mode

State is passed down using props and updated through callback functions

### Additional Features 
**JSON Save + Load**
- Save current settings into a downloadable JSON file
- Load settings back into the UI using the FileReader API
- Error handling for invalid files

**D3 Graph**
- Real-time animated bar graph
- Animation speed reacts to BPM
- Graph stops when Strudel playback stops
- Uses requestAnimationFrame and D3 scales

### Video Demonstration 
Link: https://youtu.be/QhApz6f3_zc
A screen recording is included in the submission, showing:
- How controls affect the music
- Switching instruments
- Tempo and arpeggiator behaviour
- JSON save/load example
- Real-time graph animation

### README Requirements 

This README covers:
- What each control does
- How to use the app
- Feature explanations
- Attribution
- AI usage disclosure (if needed)

## Implementation Details and Architecture

### Tech Stack

- React (functional components + Hooks)
- Bootstrap 5 for UI components
- Custom CSS for theme and overrides
- D3.js for real-time graph animation
- Strudel.cc Web Audio libraries
- Create React App for the build scaffold

### State Management

All important state lives in App.js:
- BPM
- p1 toggle
- Instrument
- Reverb
- Arp mode
- Master volume
- Text in the preprocessor editor
- Playback state

This makes debugging easier and prevents components from managing their own conflicting logic.

**Child components only do two things:**
1. Display values from props
2. Call setter functions when changed

### Critical Preprocessing Logic

The preprocessor takes the text inside the editor and swaps template tags with values from the UI. 
The idea is simple but powerful — this lets the user create reusable patterns where only certain parts are "dynamic."

Arpeggiator patterns are handled with a small conditional that chooses different pick patterns depending on the selected mode.

All replacements are done using a simple loop:
```javascript
for (const token in replacements) {
    output = output.replaceAll(token, replacements[token]);
}
```

### Why Certain Design Choices Were Made

**Single global Strudel editor:**
Storing it outside React state avoids re-renders recreating the editor instance.

**Separate components for each control:**
This avoids huge files and makes the UI easier to adjust later.

**Custom CSS with !important:**
This was needed to override Bootstrap defaults for the pink theme.

**D3 separate from React state:**
Using refs instead of state prevents React from re-rendering during animation and keeps it smooth.

## How to Interact With the App

### 1. Start the App

Open the browser at `http://localhost:3000`.

### 2. Load the Initial Song

The editor on the left already has starter code. You can add your own tags too.

### 3. Preprocess

Click "Preprocess" to update the Strudel editor with values from the UI.

### 4. Play Music

Click "Play".
The music should start and the D3 graph should animate.

### 5. Try the Controls

- **Tempo slider**: adjusts song speed
- **Instrument selector**: changes the voice
- **p1 ON/HUSH**: mutes/unmutes instrument
- **Arp selector**: changes arpeggiator pattern
- **Reverb slider**: adjusts effect level
- **Master volume**: global output level

Every control updates the Strudel code.

### 6. Save Your Settings

Click "Save JSON" to download all settings to a file.

## Control Descriptions

### Playback Controls

- **Preprocess** → Updates the right code panel but doesn't start music
- **Play** → Plays current Strudel code
- **Stop** → Stops playback

### Tempo Slider
Changes BPM (speed).

### Instrument Toggle (p1)
Switch between playable and muted.

### Instrument Selector
Choose Supersaw, Bass, or Drums.

### Arpeggiator Mode
Select between different patterns or a combined pattern.

### Reverb Slider
Adjust wet/dry effect.

### Master Volume
Adjust overall output.

### JSON Save/Load
Save full UI state → reload it later.

## Attribution

- Starter Strudel integration provided by course instructor
- Base tune adapted from Strudel community bakery
- Libraries used:
  - React
  - Bootstrap
  - D3.js
  - Strudel.cc npm packages

## Attribution and Sources

### Music Code
The base musical pattern used in this project (`stranger_tune` in `tunes.js`) was adapted from the Strudel.cc community bakery. Original pattern author: from Algorave Dave's code found here: https://www.youtube.com/watch?v=ZCcpWzhekEY.

### Third-Party Libraries
- React (MIT License)
- Bootstrap 5.3 (MIT License)
- D3.js v7 (ISC License)
- Strudel.cc libraries (MIT License)

### Starter Code
Base project structure and initial Strudel integration provided by course instructor. 

## Known Issues and Limitations

- Safari may behave differently with Web Audio
- App is designed mainly for desktop
- High BPM or dense patterns may lag on low-end machines
- Application tied to specific Strudel library versions; future Strudel updates may introduce breaking changes

## Future Enhancements

Potential improvements for future iterations:
- Additional instrument types and effects
- MIDI controller input support
- Pattern recording and loop functionality
- Multi-track sequencer interface
- Responsive mobile layout
- Real-time collaboration features
- Audio export functionality

## AI Usage
- Chatgpt for Debugging and UI fixes
