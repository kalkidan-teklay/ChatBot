"use client";

import { useState } from "react";
import styles from '../styles/AiGenerator.module.css';


export default function AIGenerator() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi, how may I help you?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(prompt) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response Data:", data);
      
      const aiResponseText =  data.generatedText || "No response received.";
      console.log("AI Response Text:", aiResponseText);
        setMessages((prevMessages) => [
            ...prevMessages,
    { sender: "ai", text: aiResponseText },
]);

    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.chatContainer}>
        <div className={styles.titleContainer}>
        <h1 className= {styles.title}>AI Assistant</h1>
        </div>
      {/* Chat Messages */}
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "ai"
                ? styles.aiMessage
                : styles.userMessage
            }
          >
            {message.sender === "ai" && (
              <img
                src="/bot.jpg"
                alt="AI Avatar"
                className={styles.avatar}
              />
            )}
            <div className={styles.aiMessageContent}>
            <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      
      <div className={styles.inputContainer}>
        <textarea
          placeholder="Type your prompt..."
          className={styles.textarea}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const prompt = e.target.value.trim();
              if (prompt) {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  { sender: "user", text: prompt },
                ]);
                handleSend(prompt);
                e.target.value = "";
              }
            }
          }}
        />
        <button
          className={styles.sendButton}
          onClick={() => {
            const input = document.querySelector(`.${styles.textarea}`);
            const prompt = input.value.trim();
            if (prompt) {
              setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "user", text: prompt },
              ]);
              handleSend(prompt);
              input.value = "";
            }
          }}
        >
          Send
        </button>
      </div>

     
      {loading && <p className={styles.loading}>AI is thinking...</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
