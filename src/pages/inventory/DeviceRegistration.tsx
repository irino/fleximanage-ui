
// src/pages/inventory/DeviceRegistration.tsx
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../Form.css';

interface NetworkInterface {
  name: string;
  mac: string;
  ip: string;
  type: string;
}

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export default function DeviceRegistration() {
  const { t } = useTranslation();
  // フォーム状態
  const [token, setToken] = useState('');
  const [hostname, setHostname] = useState('test-device-01');
  const [machineId, setMachineId] = useState('');
  const [version, setVersion] = useState('6.3.3');

  // ネットワークインターフェース
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([
    { name: 'eth0', mac: '00:11:22:33:44:55', ip: '192.168.1.100', type: 'WAN' },
    { name: 'eth1', mac: '00:11:22:33:44:66', ip: '10.0.0.1', type: 'LAN' }
  ]);

  // WebSocket状態
  const [connected, setConnected] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [approved, setApproved] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  // Machine IDを生成（初回のみ）
  useEffect(() => {
    if (!machineId) {
      const generatedId = generateMachineId();
      setMachineId(generatedId);
    }
  }, []);

  // コンポーネントのアンマウント時にWebSocketを閉じる
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const generateMachineId = () => {
    // UUIDv4形式のMachine IDを生成
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const addLog = (type: LogEntry['type'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, type, message }]);
  };

  const addInterface = () => {
    const newIndex = interfaces.length;
    setInterfaces([
      ...interfaces,
      {
        name: `eth${newIndex}`,
        mac: generateMacAddress(),
        ip: '',
        type: 'LAN'
      }
    ]);
  };

  const removeInterface = (index: number) => {
    setInterfaces(interfaces.filter((_, i) => i !== index));
  };

  const updateInterface = (index: number, field: keyof NetworkInterface, value: string) => {
    const updated = [...interfaces];
    updated[index] = { ...updated[index], [field]: value };
    setInterfaces(updated);
  };

  const generateMacAddress = () => {
    const hex = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
      if (i > 0) mac += ':';
      mac += hex[Math.floor(Math.random() * 16)];
      mac += hex[Math.floor(Math.random() * 16)];
    }
    return mac;
  };

  const connectWebSocket = () => {
    if (!token) {
      addLog('error', t('Please enter Organization Token'));
      return;
    }

    const wsUrl = 'wss://localhost:3443/socket';
    addLog('info', `WebSocket connection started: ${wsUrl}`);

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        addLog('success', 'WebSocket connection established');
        setConnected(true);

        const authMessage = {
          type: 'authenticate',
          token: token
        };

        addLog('info', 'Sending authentication message...');
        ws.send(JSON.stringify(authMessage));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (err) {
          addLog('error', `Message parse error: ${event.data}`);
        }
      };

      ws.onerror = (error) => {
        addLog('error', `WebSocket error: ${error}`);
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        addLog('warning', 'WebSocket connection closed');
        setConnected(false);
        wsRef.current = null;
      };

    } catch (error) {
      addLog('error', `Connection error: ${error}`);
    }
  };

  const handleWebSocketMessage = (data: any) => {
    addLog('info', `Message received: ${data.type}`);
    console.log('Received:', data);

    switch (data.type) {
      case 'authenticate_ack':
        if (data.status === 'success') {
          addLog('success', 'Authentication successful');
          sendRegistration();
        } else {
          addLog('error', `Authentication failed: ${data.message || 'Unknown error'}`);
        }
        break;

      case 'register_ack':
        if (data.status === 'pending') {
          addLog('success', 'Device registered (pending approval)');
          setRegistered(true);
        } else {
          addLog('error', `Registration failed: ${data.message || 'Unknown error'}`);
        }
        break;

      case 'approval':
        if (data.status === 'approved') {
          addLog('success', `Device approved: ${data.deviceName}`);
          setApproved(true);
        }
        break;

      case 'command':
        addLog('info', `Command received: ${data.action}`);
        sendCommandResponse(data.commandId, 'success', 'Command executed');
        break;

      case 'error':
        addLog('error', `Error: ${data.message}`);
        break;

      default:
        addLog('warning', `Unknown message type: ${data.type}`);
    }
  };

  const sendRegistration = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog('error', 'WebSocket is not connected');
      return;
    }

    const registrationMessage = {
      type: 'register',
      uuid: machineId,
      machineId: machineId,
      hostname: hostname,
      version: version,
      interfaces: interfaces.map(iface => ({
        name: iface.name,
        MAC: iface.mac,
        IPv4: iface.ip,
        type: iface.type
      })),
      cpuInfo: {
        cores: 4,
        model: 'Intel(R) Core(TM) i5-8250U'
      },
      memoryInfo: {
        total: 8192,
        available: 4096
      }
    };

    addLog('info', 'Sending device registration message...');
    wsRef.current?.send(JSON.stringify(registrationMessage));
  };

  const sendCommandResponse = (commandId: string, status: string, output: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const response = {
      type: 'command_result',
      commandId: commandId,
      status: status,
      output: output
    };

    wsRef.current.send(JSON.stringify(response));
    addLog('info', `Sending command result: ${commandId}`);
  };

  const sendHeartbeat = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog('error', 'WebSocket is not connected');
      return;
    }

    const heartbeat = {
      type: 'heartbeat',
      timestamp: Date.now(),
      status: 'running'
    };

    wsRef.current.send(JSON.stringify(heartbeat));
    addLog('info', 'Heartbeat sent');
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      setConnected(false);
      setRegistered(false);
      setApproved(false);
      addLog('info', 'WebSocket connection closed');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="form-container" style={{ maxWidth: '800px' }}>
      <h2 className="form-title">🧪 {t('Dummy Device Test')}</h2>

      <div className="alert alert-info">
        <strong>ℹ️ {t('About this page')}</strong>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
          {t('Dummy device info')}
        </p>
      </div>

      {/* 接続ステータス */}
      <div style={{
        padding: '15px',
        background: connected ? '#e8f5e9' : '#f5f5f5',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `2px solid ${connected ? '#4caf50' : '#ddd'}`
      }}>
        <strong>{t('Connection Status')}:</strong>
        <div style={{ marginTop: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: connected ? '#4caf50' : '#999',
            marginRight: '8px'
          }}></span>
          {connected ? `✅ ${t('Connected')}` : `⚫ ${t('Disconnected')}`}
          {registered && ` | 📝 ${t('Registered')}`}
          {approved && ` | ✅ ${t('Approved')}`}
        </div>
      </div>

      <form className="form">
        {/* Organization Token */}
        <div className="form-group">
          <label htmlFor="token" className="form-label">
            Organization Token *
          </label>
          <input
            id="token"
            type="text"
            className="form-input"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={connected}
            required
          />
          <p className="form-help-text">
            {t('Org Token Help')}
          </p>
        </div>

        {/* デバイス情報 */}
        <div className="form-section">
          <h3 className="form-section-title">{t('Device Info')}</h3>

          <div className="form-group">
            <label htmlFor="hostname" className="form-label">
              {t('Hostname')} *
            </label>
            <input
              id="hostname"
              type="text"
              className="form-input"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              disabled={connected}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="machineId" className="form-label">
              Machine ID (UUID) *
            </label>
            <input
              id="machineId"
              type="text"
              className="form-input"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              disabled={connected}
              required
            />
            <p className="form-help-text">
              {t('Machine ID Help')}
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="version" className="form-label">
              {t('Version')} *
            </label>
            <input
              id="version"
              type="text"
              className="form-input"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              disabled={connected}
              required
            />
          </div>
        </div>

        {/* ネットワークインターフェース */}
        <div className="form-section">
          <h3 className="form-section-title">{t('Network Interfaces')}</h3>

          {interfaces.map((iface, index) => (
            <div key={index} style={{
              marginBottom: '15px',
              padding: '15px',
              background: '#f9f9f9',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>{iface.name}</strong>
                {interfaces.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInterface(index)}
                    disabled={connected}
                    style={{
                      padding: '4px 12px',
                      fontSize: '12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: connected ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {t('Delete')}
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#666' }}>{t('Interface Name')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={iface.name}
                    onChange={(e) => updateInterface(index, 'name', e.target.value)}
                    disabled={connected}
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: '#666' }}>{t('Type')}</label>
                  <select
                    className="form-input"
                    value={iface.type}
                    onChange={(e) => updateInterface(index, 'type', e.target.value)}
                    disabled={connected}
                    style={{ marginTop: '4px' }}
                  >
                    <option value="WAN">WAN</option>
                    <option value="LAN">LAN</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: '#666' }}>{t('MAC Address')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={iface.mac}
                    onChange={(e) => updateInterface(index, 'mac', e.target.value)}
                    disabled={connected}
                    placeholder="00:11:22:33:44:55"
                    style={{ marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: '#666' }}>{t('IP Address')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={iface.ip}
                    onChange={(e) => updateInterface(index, 'ip', e.target.value)}
                    disabled={connected}
                    placeholder="192.168.1.100"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addInterface}
            disabled={connected}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: connected ? 'not-allowed' : 'pointer',
              opacity: connected ? 0.5 : 1
            }}
          >
            + {t('Add Interface')}
          </button>
        </div>

        {/* アクションボタン */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {!connected ? (
            <button
              type="button"
              onClick={connectWebSocket}
              className="form-submit-btn"
            >
              {t('Connect & Register')}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={sendHeartbeat}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                {t('Send Heartbeat')}
              </button>
              <button
                type="button"
                onClick={disconnect}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                {t('Disconnect')}
              </button>
            </>
          )}
        </div>
      </form>

      {/* ログ表示 */}
      <div className="form-section" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 className="form-section-title" style={{ margin: 0 }}>
            {t('Comm Log')}
          </h3>
          <button
            type="button"
            onClick={clearLogs}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {t('Clear')}
          </button>
        </div>

        <div style={{
          background: '#2d2d2d',
          color: '#f8f8f2',
          padding: '15px',
          borderRadius: '5px',
          maxHeight: '300px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.6'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#999' }}>{t('No logs')}</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{
                marginBottom: '4px',
                color: log.type === 'error' ? '#f44336' :
                  log.type === 'success' ? '#4caf50' :
                    log.type === 'warning' ? '#ff9800' : '#f8f8f2'
              }}>
                <span style={{ color: '#666' }}>[{log.timestamp}]</span> {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
