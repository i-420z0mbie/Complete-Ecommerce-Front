import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import api from "../api.js";
import { FiSend, FiCheckCircle, FiUser, FiShoppingBag, FiArrowUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import "../Messages.css";

const Messages = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [receiver, setReceiver] = useState(""); // Holds either a store name (for customers) or a customer ID (for store owners)

    // New states for receiver suggestions and loading indicator
    const [receiverSuggestions, setReceiverSuggestions] = useState([]);
    const [receiverLoading, setReceiverLoading] = useState(false);

    // Fetch messages from the backend
    const fetchMessages = async () => {
        try {
            const response = await api.get("/store/messages/");
            setMessages(response.data);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("Failed to load messages.");
        }
    };

    // Poll messages every 10 seconds
    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 10000);
        return () => clearInterval(intervalId);
    }, []);

    // Handle suggestions for receiver input (only for customers)
    useEffect(() => {
        let isMounted = true;
        // Only fetch suggestions if the user is not a store owner and receiver field is non-empty
        if (receiver && (!user || !user.store)) {
            setReceiverLoading(true);
            api.get(`/store/stores/?search=${encodeURIComponent(receiver)}`)
                .then((response) => {
                    if (isMounted) {
                        setReceiverSuggestions(response.data);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching store suggestions:", err);
                })
                .finally(() => {
                    if (isMounted) {
                        setReceiverLoading(false);
                    }
                });
        } else {
            setReceiverSuggestions([]);
        }
        return () => {
            isMounted = false;
        };
    }, [receiver, user]);

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError("");
        try {
            let payload = {};
            if (user && user.store) {
                // Store owner sending a message to a customer.
                const receiverId = parseInt(receiver, 10);
                if (isNaN(receiverId)) {
                    setError("Please enter a valid numeric Customer ID for the recipient.");
                    return;
                }
                payload = {
                    receiver_user: receiverId,
                    content: newMessage,
                };
            } else {
                // Customer sending message to a store.
                const storeSearchResponse = await api.get(
                    `/store/stores/?search=${encodeURIComponent(receiver)}`
                );
                if (!storeSearchResponse.data || storeSearchResponse.data.length === 0) {
                    setError("Store with the given name does not exist.");
                    return;
                }
                // Use the first matching store
                const storeInstance = storeSearchResponse.data[0];
                payload = {
                    receiver_store: storeInstance.id,
                    content: newMessage,
                };
            }
            const response = await api.post("/store/messages/", payload);
            setMessages((prevMessages) => [response.data, ...prevMessages]);
            setNewMessage("");
            setReceiver("");
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to send message.");
        }
    };

    // Mark a specific message as read
    const markAsRead = async (messageId) => {
        try {
            await api.patch(`/store/messages/${messageId}/`, { is_read: true });
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === messageId ? { ...msg, is_read: true } : msg
                )
            );
        } catch (err) {
            console.error("Error marking message as read:", err);
            setError("Failed to mark message as read.");
        }
    };

    // Determine the label for the recipient input based on user type.
    const receiverLabel =
        user && user.store ? "Customer ID (Recipient)" : "Store Name (Recipient)";

    return (
        <div className="messages-app">
            {/* Floating Header */}
            <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className="app-header">
                <h1 className="app-title">
                    <span className="gradient-text">Message Center</span>
                    <div className="unread-badge">{messages.filter((m) => !m.is_read).length}</div>
                </h1>
            </motion.header>

            <div className="messages-layout">
                {/* Message List */}
                <motion.div className="message-list-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="message-list-header">
                        <h2>Conversations</h2>
                        <div className="search-bar">
                            <input type="text" placeholder="Search messages..." />
                        </div>
                    </div>

                    <AnimatePresence>
                        <div className="messages-list">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`message-card ${!msg.is_read ? "unread" : ""}`}
                                >
                                    <div className="message-avatar">
                                        {msg.sender_avatar ? (
                                            <img src={msg.sender_avatar} alt={msg.sender} />
                                        ) : (
                                            <FiUser className="avatar-icon" />
                                        )}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <span className="sender-name">{msg.sender}</span>
                                            <span className="message-time">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </span>
                                            {!msg.is_read && (
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    className="mark-read-btn"
                                                    onClick={() => markAsRead(msg.id)}
                                                >
                                                    <FiCheckCircle />
                                                </motion.button>
                                            )}
                                        </div>
                                        <p className="message-text">{msg.content}</p>
                                        {msg.receiver && (
                                            <div className="store-tag">
                                                <FiShoppingBag />
                                                {msg.receiver}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </motion.div>

                {/* Compose Message Panel */}
                <motion.div className="compose-panel redesigned" initial={{ x: 100 }} animate={{ x: 0 }}>
                    <div className="compose-header">
                        <h2>New Message</h2>
                    </div>

                    <form onSubmit={handleSendMessage} className="message-form">
                        <div className="form-group floating-input">
                            <input
                                type="text"
                                id="receiver"
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                                required
                            />
                            <label htmlFor="receiver">{receiverLabel}</label>
                            {/* Suggestions dropdown for store names (only for customers) */}
                            {(!user || !user.store) && receiver && (
                                <div className="receiver-suggestions">
                                    {receiverLoading ? (
                                        <div className="loading-spinner">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        receiverSuggestions.map((store) => (
                                            <div
                                                key={store.id}
                                                className="suggestion-item"
                                                onClick={() => setReceiver(store.name)}
                                            >
                                                {store.name}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <textarea
                                id="message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write your message here..."
                                className="message-input"
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="send-button redesigned-send"
                            type="submit"
                        >
                            <FiSend className="send-icon" />
                            Send Message
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Error Toast */}
            {error && (
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="error-toast">
                    {error}
                </motion.div>
            )}

            {/* Additional styling for new design modifications */}
            <style>
                {`
                    .compose-panel.redesigned {
                        background: #f9f9f9;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        padding: 20px;
                    }
                    .send-button.redesigned-send {
                        background: linear-gradient(45deg, #667eea, #764ba2);
                        color: #fff;
                        border: none;
                        border-radius: 50px;
                        padding: 12px 20px;
                        font-size: 1rem;
                    }
                    .send-button.redesigned-send:hover {
                        background: linear-gradient(45deg, #5570e0, #684a9e);
                    }
                    .receiver-suggestions {
                        background: #fff;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        margin-top: 5px;
                        max-height: 150px;
                        overflow-y: auto;
                    }
                    .suggestion-item {
                        padding: 5px 10px;
                        cursor: pointer;
                    }
                    .suggestion-item:hover {
                        background: #f0f0f0;
                    }
                `}
            </style>
        </div>
    );
};

export default Messages;
