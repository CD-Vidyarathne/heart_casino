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

export function AppRoutes() {
  return (
    <div className="background">
      <Router
        main={
          <>
            <Route element={<LoginScreen />} path="/login" />
            <Route element={<RegistrationScreen />} path="/register" />
            <Route
              element={<RegistrationProfileEditScreen />}
              path="/register-profile"
            />
            <Route element={<MainMenuScreen />} path="/main-menu" />
            <Route element={<GameSelectionScreen />} path="/game-selection" />
            <Route element={<GamesHistory />} path="/games-history" />
            <Route element={<ProfileEditScreen />} path="/profile-edit" />
            <Route element={<MainMenuScreen />} path="/" />
          </>
        }
      />
    </div>
  );
}
