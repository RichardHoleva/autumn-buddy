import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './state/store';
import { Details } from './screens/Details';
import { Discover } from './screens/Discover';
import { Invite } from './screens/Invite';
import { Rainy } from './screens/Rainy';
import { Saved } from './screens/Saved';
import { Welcome } from './screens/Welcome';

export function App() {
  return (
    <StoreProvider>
      {/* Hash routing keeps deep links working on any static host without server rewrites. */}
      <HashRouter>
        <div className="stage">
          <div className="phone">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/invite/:id" element={<Invite />} />
              <Route path="/rainy/:id" element={<Rainy />} />
              {/* Retired screens (invite tracking and the pretend friend's replies): send old links somewhere useful. */}
              <Route path="/invites" element={<Navigate to="/discover" replace />} />
              <Route path="/respond/:id" element={<Navigate to="/discover" replace />} />
              <Route path="/confirmed/:id" element={<Navigate to="/discover" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </StoreProvider>
  );
}
