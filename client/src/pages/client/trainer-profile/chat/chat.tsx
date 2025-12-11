import { useState } from 'react';
// import { Link } from 'react-router-dom';

export const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Привет! Как тренировки?', sender: 'trainer', time: '10:00' },
        { id: 2, text: 'Всё отлично, спасибо!', sender: 'me', time: '10:05' },
        {
            id: 3,
            text: 'Не забудь про питание сегодня',
            sender: 'trainer',
            time: '10:10',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                text: newMessage,
                sender: 'me',
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <h3>Чат с тренером</h3>

            <div
                style={{
                    height: '300px',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    padding: '10px',
                    border: '1px solid #eee',
                    borderRadius: '5px',
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            marginBottom: '10px',
                            textAlign: msg.sender === 'me' ? 'right' : 'left',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                backgroundColor:
                                    msg.sender === 'me' ? '#007bff' : '#e9ecef',
                                color: msg.sender === 'me' ? 'white' : 'black',
                                maxWidth: '80%',
                            }}
                        >
                            {msg.text}
                            <div
                                style={{
                                    fontSize: '11px',
                                    opacity: 0.7,
                                    marginTop: '3px',
                                }}
                            >
                                {msg.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Отправить</button>
            </div>
        </div>
    );
};
