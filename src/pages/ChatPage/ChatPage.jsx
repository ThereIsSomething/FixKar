import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaMapMarkerAlt } from 'react-icons/fa';
import Logo from '../../components/Logo/Logo';
import styles from './ChatPage.module.css';

// Mock worker data (simulating API response)
const mockWorkers = {
  1: {
    id: 1,
    name: "John Doe",
    profession: "electrician",
    rating: 4.8,
    completedJobs: 150,
    location: "Mumbai, MH"
  },
  2: {
    id: 2,
    name: "Jane Smith",
    profession: "plumbing",
    rating: 4.9,
    completedJobs: 200,
    location: "Delhi, DL"
  }
};

// Mock chat messages
const mockMessages = [
  {
    id: 1,
    text: "Hello, I need help with electrical wiring",
    sender: 'user',
    timestamp: '2024-05-25T10:00:00'
  },
  {
    id: 2,
    text: "Hi! I'd be happy to help. Can you describe the issue?",
    sender: 'worker',
    timestamp: '2024-05-25T10:01:00'
  }
];

const ChatPage = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToggles, setUserToggles] = useState({
    started: false,
    completed: false
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Validate and load worker data
  useEffect(() => {
    const loadWorkerData = async () => {
      try {
        if (!workerId) {
          throw new Error('No worker ID provided');
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const workerData = mockWorkers[workerId];
        if (!workerData) {
          throw new Error('Worker not found');
        }

        setWorker(workerData);
        setMessages(mockMessages); // In real app, this would be fetched from API
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadWorkerData();
  }, [workerId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !worker) return;

    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Simulate worker response after 1 second
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        text: "Thanks for your message. I'll help you with that.",
        sender: 'worker',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleToggleChange = (type) => {
    setUserToggles(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading chat...</p>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className={styles.errorContainer}>
        <h2>{error || 'Chat Error'}</h2>
        <p>
          {error 
            ? 'We encountered an error while loading the chat.' 
            : "We couldn't establish a chat connection."}
        </p>
        <p className={styles.errorDetail}>
          Please try again or contact support if the problem persists.
        </p>
        <button onClick={() => navigate(-1)} className={styles.retryButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.chatPage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
          </button>
          <div className={styles.workerInfo}>
            <h1>{worker.name}</h1>
            <p className={styles.profession}>{worker.profession}</p>
            <p className={styles.location}>
              <FaMapMarkerAlt /> {worker.location}
            </p>
          </div>
          <Logo />
        </div>
      </header>

      <main className={styles.chatContainer}>
        <div className={styles.messagesList}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.workerMessage
              }`}
            >
              <div className={styles.messageContent}>
                <p>{message.text}</p>
                <span className={styles.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.inputSection}>
          <div className={styles.toggles}>
            <label className={styles.toggleContainer}>
              <input
                type="checkbox"
                checked={userToggles.started}
                onChange={() => handleToggleChange('started')}
                disabled={userToggles.completed}
              />
              <span className={styles.toggleLabel}>
                {userToggles.started ? 'Job Started' : 'Start Job'}
              </span>
            </label>

            <label className={styles.toggleContainer}>
              <input
                type="checkbox"
                checked={userToggles.completed}
                onChange={() => handleToggleChange('completed')}
                disabled={!userToggles.started || userToggles.completed}
              />
              <span className={styles.toggleLabel}>
                {userToggles.completed ? 'Job Completed' : 'Complete Job'}
              </span>
            </label>
          </div>

          <div className={styles.messageInput}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className={styles.sendButton}
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
