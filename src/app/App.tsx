import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout/AuthLayout';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Auth/Login';
import { Register } from '../pages/Auth/Register';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuthStore } from '../stores/useAuthStore';
import { ThemeProvider } from '../components/providers/ThemeProvider';
import { NotificationProvider } from '../components/providers/NotificationProvider';
import { I18nProvider } from '../components/providers/I18nProvider';
import { ErrorBoundary } from '../components/ErrorBoundary';

import { Rooms } from '../pages/Rooms/Rooms';
import { RoomView } from '../pages/Rooms/RoomView';
import { Discover } from '../pages/Discover/Discover';
import { Friends } from '../pages/Friends/Friends';
import { Calls } from '../pages/Calls/Calls';
import { Messages } from '../pages/Messages/Messages';
import { Events } from '../pages/Events/Events';
import { Notifications } from '../pages/Notifications/Notifications';
import { Settings } from '../pages/Settings/Settings';

const NotFound = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-text">
    <h1 className="text-6xl font-bold">404</h1>
    <p className="mt-4 text-xl text-text-muted">Page not found</p>
  </div>
);

export const App: React.FC = () => {
  const checkSession = useAuthStore(state => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <I18nProvider>
            <BrowserRouter>
              <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Main Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="calls" element={<Calls />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="friends" element={<Friends />} />
                  <Route path="events" element={<Events />} />
                  <Route path="rooms" element={<Rooms />} />
                  <Route path="rooms/:roomId" element={<RoomView />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </I18nProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
