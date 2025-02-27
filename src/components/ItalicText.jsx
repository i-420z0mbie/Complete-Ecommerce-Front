import React from "react";
import "../App.css"; // Import the CSS file

function ItalicText() {
    return (
        <div>
            <h1>React Italic Example</h1>
            {/* Using inline style */}
            <p style={{ fontStyle: "italic" }}>
                This text is italicized using inline styles.
            </p>
            {/* Using CSS class */}
            <p className="italic-text">
                This text is italicized using a CSS class.
            </p>
        </div>
    );
}

export default ItalicText;
