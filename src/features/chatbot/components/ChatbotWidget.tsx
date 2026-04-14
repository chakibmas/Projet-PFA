import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatbotApi } from '../api/chatbotApi';
import { ChatMessage, SuggestedAction } from '@/shared/types/chatbot.types';
import { getErrorMessage } from '@/shared/api/apiClient';

function makeId() {
  return Math.random().toString(36).slice(2);
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    '👋 Bonjour ! Je suis l\'assistant FAQ de UniClubs. Je peux vous aider à répondre à vos questions sur les clubs, adhésions, événements et plus encore. Comment puis-je vous aider ?',
  timestamp: new Date().toISOString(),
};

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestedAction[]>([]);
  const [escalated, setEscalated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const askMutation = useMutation({
    mutationFn: (message: string) => chatbotApi.ask({ message }),
    onSuccess: (res) => {
      const botMsg: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: res.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setSuggestions(res.suggestedActions ?? []);
      if (res.escalate) setEscalated(true);
    },
    onError: (err) => {
      const errMsg: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        content: `⚠️ Erreur: ${getErrorMessage(err)}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setSuggestions([]);
    askMutation.mutate(text.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Tooltip title="Aide / FAQ" placement="left">
        <Fab
          color="primary"
          aria-label="Ouvrir le chatbot FAQ"
          onClick={() => setOpen((o) => !o)}
          sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}
        >
          {open ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Tooltip>

      {/* Chat window */}
      {open && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            borderRadius: 3,
            overflow: 'hidden',
          }}
          role="dialog"
          aria-label="Chatbot FAQ UniClubs"
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              px: 2,
              py: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SmartToyIcon aria-hidden />
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight={700}>
                Assistant UniClubs
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                Assistant automatique – pas un humain
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{ color: 'white' }}
              onClick={() => setOpen(false)}
              aria-label="Fermer le chatbot"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.50' }}
            aria-live="polite"
            aria-label="Conversation"
          >
            <Stack gap={1.5}>
              {messages.map((msg) => (
                <Stack
                  key={msg.id}
                  direction="row"
                  gap={1}
                  alignItems="flex-end"
                  justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                >
                  {msg.role === 'assistant' && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light' }} aria-hidden>
                      <SmartToyIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: '78%',
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                      color: msg.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      px: 2,
                      py: 1,
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  </Box>
                </Stack>
              ))}

              {askMutation.isPending && (
                <Stack direction="row" gap={1} alignItems="center">
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.light' }} aria-hidden>
                    <SmartToyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <CircularProgress size={18} aria-label="L'assistant écrit..." />
                </Stack>
              )}

              {escalated && (
                <Box
                  sx={{ bgcolor: 'warning.light', borderRadius: 2, p: 1.5, mt: 1 }}
                  role="status"
                >
                  <Stack direction="row" gap={1} alignItems="center">
                    <SupportAgentIcon fontSize="small" aria-hidden />
                    <Typography variant="caption">
                      Cette question nécessite une assistance humaine. Contactez-nous à{' '}
                      <strong>support@uniclubs.fr</strong>
                    </Typography>
                  </Stack>
                </Box>
              )}

              <div ref={bottomRef} />
            </Stack>
          </Box>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <Box sx={{ px: 2, pb: 1, bgcolor: 'grey.50' }}>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {suggestions.map((s) => (
                  <Button
                    key={s.value}
                    size="small"
                    variant="outlined"
                    onClick={() => sendMessage(s.value)}
                    sx={{ borderRadius: 4, textTransform: 'none', fontSize: 12 }}
                  >
                    {s.label}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {/* Input */}
          <Box sx={{ p: 1.5, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" gap={1} alignItems="center">
              <TextField
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                size="small"
                multiline
                maxRows={3}
                fullWidth
                inputProps={{ 'aria-label': 'Message au chatbot' }}
                disabled={askMutation.isPending}
              />
              <IconButton
                color="primary"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || askMutation.isPending}
                aria-label="Envoyer le message"
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
}
