import { useState } from 'react';
import './App.css';

function App() {
  const [phoneState, setPhoneState] = useState('idle'); // idle, ringing, missed, texted
  const [apiResponse, setApiResponse] = useState(null);
  const [scenario, setScenario] = useState('business_hours'); // business_hours, evening, vip

  const triggerCall = async () => {
    // 1. Start Ringing
    setPhoneState('ringing');
    setApiResponse(null);

    // 2. Simulate "Missed Call" after 3 seconds
    setTimeout(() => {
      setPhoneState('missed');
      handleMissedCallLogic();
    }, 3000);
  };

  const handleMissedCallLogic = async () => {
    // 3. Call our Python Backend
    // USE THE ENV VARIABLE (Or fallback to localhost for testing)
    const API_BASE = import.meta.env.VITE_API_URL || 'https://api-call.coepi.co';

    try {
      const response = await fetch('https://api-call.coepi.co/api/missed-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caller_name: scenario === 'vip' ? 'VIP Client' : 'Stranger',
          time_of_day: scenario === 'evening' ? 'evening' : 'business_hours'
        })
      });
      const data = await response.json();

      // 4. Wait for the simulated delay (e.g. 2 seconds), then show text
      setTimeout(() => {
        setApiResponse(data);
        setPhoneState('texted');
      }, data.simulated_delay * 1000);

    } catch (error) {
      console.error("Backend error:", error);
    }
  };

  const resetPhone = () => {
    setPhoneState('idle');
    setApiResponse(null);
  };

  return (
    <div className="container">
      {/* --- LEFT: CONTROL PANEL --- */}
      <div className="controls">
        <h2>Missed Call Bot</h2>
        <p>Simulate a missed call to see how the Python backend responds.</p>

        <div className="scenario-selector">
          <label>Scenario:</label>
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            <option value="business_hours">Business Hours (Standard)</option>
            <option value="evening">After Hours (Calendar Link)</option>
            <option value="vip">VIP Client (Priority)</option>
          </select>
        </div>

        <button
          className="call-btn"
          onClick={triggerCall}
          disabled={phoneState !== 'idle'}
        >
          {phoneState === 'idle' ? '📞 Call Phone' : 'Calling...'}
        </button>

        <button className="reset-btn" onClick={resetPhone}>
          Reset Simulator
        </button>

        <div className="backend-logs">
          <h3>Backend Logic:</h3>
          {apiResponse ? (
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          ) : (
            <span className="placeholder">Waiting for trigger...</span>
          )}
        </div>
      </div>

      {/* --- RIGHT: VIRTUAL IPHONE --- */}
      <div className="phone-wrapper">
        <div className="iphone">
          <div className="notch"></div>
          <div className="screen">

            {/* SCREEN: WALLPAPER (IDLE) */}
            {phoneState === 'idle' && (
              <div className="screen-content home">
                <div className="clock">09:41</div>
                <div className="widgets">No New Notifications</div>
              </div>
            )}

            {/* SCREEN: INCOMING CALL */}
            {phoneState === 'ringing' && (
              <div className="screen-content incoming">
                <div className="caller-id">
                  <div className="avatar">👤</div>
                  <h2>{scenario === 'vip' ? 'VIP Client' : 'Unknown Caller'}</h2>
                  <p>Incoming Call...</p>
                </div>
                <div className="slide-to-answer">
                  Slide to answer
                </div>
              </div>
            )}

            {/* SCREEN: MISSED / TEXTED */}
            {(phoneState === 'missed' || phoneState === 'texted') && (
              <div className="screen-content messages">
                <div className="header">
                  <span>&lt; Messages</span>
                  <span>{scenario === 'vip' ? 'VIP Client' : 'Unknown'}</span>
                  <span>Details</span>
                </div>

                <div className="message-list">
                  {/* The Simulated Missed Call Notification */}
                  <div className="system-msg">
                    Missed Call at 09:41
                  </div>

                  {/* The Auto-Response Text */}
                  {phoneState === 'texted' && (
                    <div className="msg-bubble out">
                      {apiResponse?.message_body}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;