import { Route } from 'react-router-dom';

import { Router } from 'lib/electron-router-dom';

import { MainMenuScreen } from './screens/MainMenuScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegistrationScreen } from './screens/RegistrationScreen';
import { RegistrationProfileEditScreen } from './screens/RegistrationProfileEditScreen';
import { GameSelectionScreen } from './screens/GameSelectionScreen';
import { GamesHistory } from './screens/GamesHistory';
import { ProfileEditScreen } from './screens/ProfileEditScreen';
import { Navigation } from './components';
import { AppLayout } from './layout';
import { HeartGameScreen } from './screens/HeartGameScreen';

export function AppRoutes() {
  return (
    <Router
      main={
        <Route element={<AppLayout />}>
          <Route element={<LoginScreen />} path="/login" />
          <Route element={<RegistrationScreen />} path="/register" />
          <Route
            element={<RegistrationProfileEditScreen />}
            path="/register-profile"
          />
          <Route element={<MainMenuScreen />} path="/main-menu" />
          <Route element={<GameSelectionScreen />} path="/game-selection" />
          <Route element={<HeartGameScreen />} path="/heart-game" />
          <Route element={<GamesHistory />} path="/games-history" />
          <Route element={<ProfileEditScreen />} path="/profile-edit" />
          <Route element={<MainMenuScreen />} path="/" />
        </Route>
      }
    />
  );
}
