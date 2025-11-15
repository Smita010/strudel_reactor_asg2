import React from 'react';

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
