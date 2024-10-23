// src/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the backend server (make sure the backend is running)
const socket = io('http://localhost:3000');

const Chat = () => {
    const [messages, setMessages] = useState([]);  // State to store messages
    const [input, setInput] = useState('');  // State for the message input
    const room = 'general';  // Example chat room

    // Join the room and listen for messages
    useEffect(() => {
        socket.emit('joinRoom', { username: 'User', room });

        // Listen for new messages from the server
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();  // Clean up the connection when component unmounts
        };
    }, []);

    // Function to handle message sending
    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit('chatMessage', input);  // Send the message to the server
        setInput('');  // Clear the input after sending the message
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>  // Display messages in a list
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;