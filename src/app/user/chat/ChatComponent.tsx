"use client";

import React, { useState, useEffect } from 'react';

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [city, setCity] = useState<string>('Lagos, Portugal');
  const [restaurantBoolean, setRestaurantBoolean] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch('https://wik-suggester-api-340847553966.europe-west4.run.app/');
        const data = await response.text(); // Assuming the API returns HTML as plain text
        setMessages([data]); // Set the initial message
      } catch (error) {
        console.error('Error fetching initial message:', error);
      }
    };

    fetchInitialMessage();
  }, []);

  const handleSendMessage = async () => {
    if (input.trim()) {
      try {
        // Construct the API URL with query parameters
        const apiUrl = `https://wik-suggester-api-340847553966.europe-west4.run.app/ml/places?query=${encodeURIComponent(
          input
        )}&city=${encodeURIComponent(city)}&restaurant_boolean=${restaurantBoolean}&return_type=html&max_amount=5`;

        // Fetch the response from the API
        const response = await fetch(apiUrl);
        const data = await response.text(); // Assuming the API returns HTML as plain text

        // Update the messages state with the response
        setMessages([...messages, data]);
        setInput(''); // Clear the input field
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '500px', overflowY: 'scroll' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{ marginBottom: '10px' }}
            dangerouslySetInnerHTML={{ __html: message }}
          />
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '5px', marginRight: '10px' }}
          />
          <button onClick={handleSendMessage} style={{ padding: '5px 10px' }}>
            Send
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            style={{ flex: 1, padding: '5px', marginRight: '10px' }}
          />
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={restaurantBoolean}
              onChange={(e) => setRestaurantBoolean(e.target.checked)}
              style={{ marginRight: '5px' }}
            />
            Restaurant Boolean
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;