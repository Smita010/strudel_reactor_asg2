import React from 'react';

//  This component is just the text editor area where the user edits the preprocessing template
export default function PreprocessorEditor({ value, onChange }) {
    return (
        <div className="mb-3">
            <textarea
                id="proc"
                className="form-control"
                rows="15"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
