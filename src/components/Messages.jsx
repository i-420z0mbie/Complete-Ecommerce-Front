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
                <motion.div className="compose-panel" initial={{ x: 100 }} animate={{ x: 0 }}>
                    <div className="compose-header">
                        <h2>New Message</h2>
                        <div className="message-actions">

                        </div>
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
                            className="send-button"
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
        </div>
    );
};

export default Messages;
