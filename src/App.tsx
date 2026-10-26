import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { StoreProvider } from './state/store';
import { Confirmed } from './screens/Confirmed';
import { Details } from './screens/Details';
import { Discover } from './screens/Discover';
import { Invite } from './screens/Invite';
import { Invites } from './screens/Invites';
import { Rainy } from './screens/Rainy';
import { Response } from './screens/Response';
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
              <Route path="/invites" element={<Invites />} />
              <Route path="/details/:id" element={<Details />} />
              <Route path="/invite/:id" element={<Invite />} />
              <Route path="/respond/:id" element={<Response />} />
              <Route path="/confirmed/:id" element={<Confirmed />} />
              <Route path="/rainy/:id" element={<Rainy />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </StoreProvider>
  );
}
