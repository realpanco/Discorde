import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { PlusCircle, Smile, Hash, Users, Settings, Edit2, Trash2, X, Check } from 'lucide-react';
import { Avatar } from '../ui/Avatar/Avatar';
import { useAuthStore } from '../../stores/useAuthStore';
import { socketService } from '../../services/SocketService';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTranslation } from '../providers/I18nProvider';

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: number;
}

export const Chat: React.FC<{ roomId: string; roomName: string }> = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [msgToDelete, setMsgToDelete] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = useAuthStore(state => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { formatDate } = useTranslation();

  const { chatLayout, showAvatars, editMessages, deleteConfirm, linkPreviews, chatBackground } = useSettingsStore();

  useEffect(() => {
    if (user && roomId) {
      socketService.joinRoom(roomId, user);

      const handleNewMessage = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
      };

      socketService.onMessage(handleNewMessage);

      return () => {
        socketService.offMessage(handleNewMessage);
      };
    }
  }, [roomId, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!editingMsgId) {
      scrollToBottom();
    }
  }, [messages, editingMsgId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    socketService.sendMessage(newMessage);
    setNewMessage('');
  };

  const handleSaveEdit = (msgId: string) => {
    // In a real app we'd emit edit event via socketService
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: editContent } : m));
    setEditingMsgId(null);
  };

  const handleDelete = (msgId: string) => {
    if (deleteConfirm && msgToDelete !== msgId) {
      setMsgToDelete(msgId);
      return;
    }
    // In a real app we'd emit delete event via socketService
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setMsgToDelete(null);
  };

  const renderContentWithLinks = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (!linkPreviews || !urlRegex.test(content)) return <span>{content}</span>;

    const parts = content.split(urlRegex);
    return (
      <div className="flex flex-col gap-2">
        <div>
          {parts.map((part, i) => 
            urlRegex.test(part) ? (
              <a key={i} href={part} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                {part}
              </a>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
        {/* Link Preview Simulation */}
        {parts.filter(p => urlRegex.test(p)).map((url, i) => (
          <div key={`preview-${i}`} className="mt-1 flex max-w-sm flex-col rounded-lg border border-border bg-background p-3">
            <span className="text-xs font-bold text-text-muted">{new URL(url).hostname}</span>
            <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline mt-1 truncate">
              {url}
            </a>
            <div className="mt-2 h-32 w-full rounded bg-surface-hover flex items-center justify-center">
              <span className="text-text-muted text-xs">Preview Image</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="flex h-full w-full flex-col bg-surface overflow-hidden bg-cover bg-center"
      style={chatBackground ? { backgroundImage: `url(${chatBackground})` } : {}}
    >
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 shadow-sm">
        <div className="flex items-center gap-2 text-text">
          <Hash size={20} className="text-text-muted" />
          <h2 className="font-bold">{roomName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text">
            <Users size={20} />
          </button>
          <button className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        {messages.map((msg, index) => {
          const isSystem = msg.userId === 'system';
          const prevMsg = messages[index - 1];
          const isConsecutive = prevMsg && prevMsg.userId === msg.userId && (msg.timestamp - prevMsg.timestamp < 300000);
          const isCompact = chatLayout === 'compact';
          const isOwn = msg.userId === user?.id;

          if (isSystem) {
            return (
              <div key={msg.id} className="my-4 flex justify-center">
                <span className="rounded-full bg-surface-hover px-3 py-1 text-xs font-medium text-text-muted">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isEditing = editingMsgId === msg.id;

          return (
            <div 
              key={msg.id} 
              className={classNames(
                'group flex w-full gap-4 hover:bg-surface-hover/50 relative',
                isCompact ? 'py-0.5' : (isConsecutive ? 'mt-1 py-0.5' : 'mt-4 py-1')
              )}
            >
              {!isConsecutive && !isCompact && showAvatars ? (
                <div className="mt-0.5 shrink-0">
                  <Avatar size="md" alt={msg.username} />
                </div>
              ) : (
                <div className="w-10 shrink-0 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                  <span className="text-[10px] text-text-muted">
                    {formatDate(msg.timestamp).split(' ')[1]}
                  </span>
                </div>
              )}
              
              <div className="flex flex-col min-w-0 flex-1">
                {(!isConsecutive || isCompact) && (
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-text hover:underline cursor-pointer">{msg.username}</span>
                    <span className="text-xs text-text-muted">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                )}
                
                {isEditing ? (
                  <div className="mt-1 flex flex-col gap-2 w-full max-w-2xl">
                    <input 
                      type="text" 
                      className="w-full bg-background border border-primary/50 rounded-md px-3 py-2 text-text focus:outline-none focus:ring-1 focus:ring-primary"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveEdit(msg.id);
                        if (e.key === 'Escape') setEditingMsgId(null);
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2 text-xs">
                      <button onClick={() => setEditingMsgId(null)} className="text-text-muted hover:text-text">Cancelar</button>
                      <button onClick={() => handleSaveEdit(msg.id)} className="text-primary font-medium hover:underline">Salvar (Enter)</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-text break-words leading-relaxed">
                    {renderContentWithLinks(msg.content)}
                  </div>
                )}
              </div>

              {/* Message Actions */}
              {!isEditing && isOwn && (
                <div className="absolute right-4 top-[-8px] hidden group-hover:flex items-center gap-1 rounded-md border border-border bg-background shadow-sm p-1 z-10">
                  {editMessages && (
                    <button 
                      onClick={() => { setEditingMsgId(msg.id); setEditContent(msg.content); }}
                      className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded"
                      title="Editar"
                    >
                      <Edit2 size={14} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(msg.id)}
                    className={classNames(
                      "p-1.5 rounded",
                      msgToDelete === msg.id 
                        ? "bg-danger text-white hover:bg-danger-hover" 
                        : "text-text-muted hover:text-danger hover:bg-surface-hover"
                    )}
                    title="Excluir"
                  >
                    {msgToDelete === msg.id ? <Check size={14} /> : <Trash2 size={14} />}
                  </button>
                  {msgToDelete === msg.id && (
                    <button 
                      onClick={() => setMsgToDelete(null)}
                      className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded"
                      title="Cancelar"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 shrink-0 relative">
        <div 
          className="flex items-center gap-2 rounded-xl bg-surface-hover px-4 py-2.5 focus-within:ring-2 focus-within:ring-primary/50 relative"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                // In a real app, upload the file here
                setNewMessage(prev => prev + ` [Anexo: ${e.target.files![0].name}] `);
              }
            }} 
          />
          <button 
            type="button" 
            className="text-text-muted transition-colors hover:text-text self-end pb-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <PlusCircle size={24} />
          </button>
          <textarea
            className="flex-1 bg-transparent px-2 text-text placeholder:text-text-muted focus:outline-none resize-none max-h-32 min-h-[24px]"
            placeholder={`Message #${roomName}`}
            value={newMessage}
            rows={1}
            onChange={(e) => {
              setNewMessage(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
            }}
            onKeyDown={(e) => {
              const { enterSendsMessage } = useSettingsStore.getState();
              
              if (e.key === 'Enter') {
                if (enterSendsMessage) {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                } else {
                  if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }
              }
            }}
          />
          <button 
            type="button" 
            className="text-text-muted transition-colors hover:text-text self-end pb-1"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={24} />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 bg-surface border border-border rounded-lg shadow-xl p-2 grid grid-cols-4 gap-2 z-50">
              {['😀', '😂', '😍', '😭', '😎', '👍', '🙏', '🔥'].map(emoji => (
                <button 
                  key={emoji} 
                  className="w-8 h-8 flex items-center justify-center hover:bg-surface-hover rounded text-xl"
                  onClick={() => {
                    setNewMessage(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
