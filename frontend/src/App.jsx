import React, { useState } from 'react';
import NotificationForm from './components/NotificationForm';
import NotificationHistory from './components/NotificationHistory';
import Header from './components/Header';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('send');

  return (
    <div className="App">
      <Header />
      <div className="tabs">
        <button
          className={activeTab === 'send' ? 'active' : ''}
          onClick={() => setActiveTab('send')}
        >
          Send Notification
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>
      <div className="content">
        {activeTab === 'send' && <NotificationForm />}
        {activeTab === 'history' && <NotificationHistory />}
      </div>
    </div>
  );
}

export default App;