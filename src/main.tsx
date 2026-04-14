import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { DEV_PERSONAS } from './mocks/devSwitch';

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });

    // Auto-login as PLATFORM_ADMIN only on first visit (no stored session)
    const hasSession = !!localStorage.getItem('access_token');
    if (!hasSession) {
      const defaultPersona = DEV_PERSONAS.find((p) => p.id === 'platform-admin')!;
      const token = `mock-token-${defaultPersona.id}`;
      localStorage.setItem('access_token', token);
      localStorage.setItem(
        'auth-store',
        JSON.stringify({
          state: { user: defaultPersona.user, accessToken: token, isAuthenticated: true },
          version: 0,
        }),
      );
    }
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
