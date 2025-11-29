import { Route, Navigate } from 'react-router-dom';

import { Router } from 'lib/electron-router-dom';

import { MainMenuScreen } from './screens/MainMenuScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegistrationScreen } from './screens/RegistrationScreen';
import { RegistrationProfileEditScreen } from './screens/RegistrationProfileEditScreen';
import { GameSelectionScreen } from './screens/GameSelectionScreen';
import { GamesHistoryScreen } from './screens/GamesHistoryScreen';
import { ProfileEditScreen } from './screens/ProfileEditScreen';
import { Navigation, ProtectedRoute, PublicRoute } from './components';
import { AppLayout } from './layout';
import { HeartGameScreen } from './screens/HeartGameScreen';
import { useAuth } from './contexts/UserContext';
import { BlackjackGameScreen } from './screens/BlackjackGameScreen';

function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="screen-container">
        <div className="screen-content flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return <Navigate to={isAuthenticated ? '/main-menu' : '/login'} replace />;
}

export function AppRoutes() {
  return (
    <Router
      main={
        <Route element={<AppLayout />}>
          <Route element={<RootRedirect />} path="/" />
          <Route
            element={
              <PublicRoute>
                <LoginScreen />
              </PublicRoute>
            }
            path="/login"
          />
          <Route
            element={
              <PublicRoute>
                <RegistrationScreen />
              </PublicRoute>
            }
            path="/register"
          />
          <Route
            element={
              <PublicRoute>
                <RegistrationProfileEditScreen />
              </PublicRoute>
            }
            path="/register-profile"
          />
          <Route
            element={
              <ProtectedRoute>
                <MainMenuScreen />
              </ProtectedRoute>
            }
            path="/main-menu"
          />
          <Route
            element={
              <ProtectedRoute>
                <GameSelectionScreen />
              </ProtectedRoute>
            }
            path="/game-selection"
          />
          <Route
            element={
              <ProtectedRoute>
                <HeartGameScreen />
              </ProtectedRoute>
            }
            path="/heart-game"
          />
          <Route
            element={
              <ProtectedRoute>
                <BlackjackGameScreen />
              </ProtectedRoute>
            }
            path="/blackjack"
          />
          <Route
            element={
              <ProtectedRoute>
                <GamesHistoryScreen />
              </ProtectedRoute>
            }
            path="/games-history"
          />
          <Route
            element={
              <ProtectedRoute>
                <ProfileEditScreen />
              </ProtectedRoute>
            }
            path="/profile-edit"
          />
        </Route>
      }
    />
  );
}
