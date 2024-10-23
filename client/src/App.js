// src/App.js
import React from 'react';
import Chat from './Chat';  // Import the Chat component

function App() {
    return (
        <div className="App">
            <h1>Real-Time Chat App</h1>
            <Chat />  {/* Render the Chat component */}
        </div>
    );
}

export default App;