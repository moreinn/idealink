import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export default function Chat() {
  const { connectionId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [callState, setCallState] = useState('idle');
  const [incomingSignal, setIncomingSignal] = useState(null);
  const bottomRef = useRef(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    socket.emit('join_room', connectionId);

    api.get(`/connections/${connectionId}/messages`)
      .then(({ data }) => setMessages(data));

    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('incoming_call', ({ signal }) => {
      setIncomingSignal(signal);
      setCallState('receiving');
    });

    socket.on('call_accepted', async ({ signal }) => {
      try {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        setCallState('active');
      } catch (err) {
        console.error('call_accepted error:', err);
      }
    });

    socket.on('ice_candidate', async ({ candidate }) => {
      try {
        if (peerRef.current && candidate) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('ICE error:', err);
      }
    });

    socket.on('call_ended', () => endCall());

    return () => {
      socket.off('receive_message');
      socket.off('incoming_call');
      socket.off('call_accepted');
      socket.off('call_ended');
      socket.off('ice_candidate');
    };
  }, [connectionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit('send_message', { connectionId, senderId: user.id, text });
    setText('');
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection(ICE_SERVERS);
      peerRef.current = peer;

      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        setCallState('active');
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', { connectionId, candidate: event.candidate });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('call_user', { connectionId, signal: offer, from: user.id });
      setCallState('calling');
    } catch (err) {
      console.error('Call error:', err);
      alert(err.message);
    }
  };

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection(ICE_SERVERS);
      peerRef.current = peer;

      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        setCallState('active');
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice_candidate', { connectionId, candidate: event.candidate });
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(incomingSignal));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('accept_call', { connectionId, signal: answer });
      setCallState('active');
    } catch (err) {
      console.error('Accept error:', err);
      alert(err.message);
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (myVideoRef.current) myVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    socket.emit('end_call', { connectionId });
    setCallState('idle');
    setIncomingSignal(null);
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatBox}>

        {(callState === 'active' || callState === 'calling') && (
          <div style={styles.videoArea}>
            <video ref={remoteVideoRef} autoPlay playsInline style={styles.remoteVideo} />
            <video ref={myVideoRef} autoPlay playsInline muted style={styles.myVideo} />
            <div style={styles.videoControls}>
              {callState === 'calling' && (
                <span style={styles.callingText}>Calling... waiting for answer</span>
              )}
              <button style={styles.endCallBtn} onClick={endCall}>End Call</button>
            </div>
          </div>
        )}

        {callState === 'receiving' && (
          <div style={styles.incomingBanner}>
            <p style={{ margin: 0, fontWeight: '500' }}>Incoming video call...</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={styles.acceptBtn} onClick={acceptCall}>Accept</button>
              <button style={styles.rejectBtn} onClick={() => {
                setCallState('idle');
                setIncomingSignal(null);
                socket.emit('end_call', { connectionId });
              }}>Decline</button>
            </div>
          </div>
        )}

        <div style={styles.header}>
          <h3 style={styles.headerTitle}>Chat</h3>
          {callState === 'idle' && (
            <button style={styles.callBtn} onClick={startCall}>Video Call</button>
          )}
        </div>

        <div style={styles.messages}>
          {messages.map((m, i) => {
            const isMe = m.sender?._id === user?.id || m.sender === user?.id;
            return (
              <div key={i} style={{
                ...styles.message,
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                background: isMe ? '#e94560' : '#f0f0f0',
                color: isMe ? '#fff' : '#333',
              }}>
                <p style={{ margin: 0 }}>{m.text}</p>
                <span style={styles.time}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputRow}>
          <input style={styles.input} placeholder="Type a message..."
            value={text} onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()} />
          <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 20px',
    background: '#f5f5f5', minHeight: '90vh' },
  chatBox: { background: '#fff', borderRadius: '16px', width: '680px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)', display: 'flex',
    flexDirection: 'column', height: '75vh', overflow: 'hidden' },
  videoArea: { position: 'relative', background: '#111', height: '280px' },
  remoteVideo: { width: '100%', height: '100%', objectFit: 'cover' },
  myVideo: { position: 'absolute', bottom: '12px', right: '12px',
    width: '120px', height: '90px', borderRadius: '8px',
    objectFit: 'cover', border: '2px solid #fff' },
  videoControls: { position: 'absolute', bottom: '12px', left: '50%',
    transform: 'translateX(-50%)', display: 'flex',
    flexDirection: 'column', alignItems: 'center', gap: '8px' },
  callingText: { color: '#fff', fontSize: '13px', background: 'rgba(0,0,0,0.5)',
    padding: '4px 12px', borderRadius: '12px' },
  endCallBtn: { background: '#e94560', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: '24px', cursor: 'pointer', fontSize: '14px' },
  incomingBanner: { background: '#1a1a2e', color: '#fff', padding: '16px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  acceptBtn: { background: '#1D9E75', color: '#fff', border: 'none',
    padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' },
  rejectBtn: { background: '#e94560', color: '#fff', border: 'none',
    padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 24px', borderBottom: '1px solid #eee' },
  headerTitle: { margin: 0, color: '#1a1a2e', fontSize: '16px' },
  callBtn: { background: '#1a1a2e', color: '#fff', border: 'none',
    padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  messages: { flex: 1, overflowY: 'auto', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '12px' },
  message: { maxWidth: '70%', padding: '10px 16px', borderRadius: '12px' },
  time: { fontSize: '11px', opacity: 0.7, display: 'block', marginTop: '4px' },
  inputRow: { display: 'flex', padding: '16px', borderTop: '1px solid #eee', gap: '12px' },
  input: { flex: 1, padding: '12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '15px' },
  sendBtn: { padding: '12px 24px', background: '#e94560', color: '#fff',
    border: 'none', borderRadius: '8px', cursor: 'pointer' },
};