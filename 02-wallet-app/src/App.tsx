import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import Home from './pages/Home';
import Header from './components/Header';
import ConnectionStatus from './components/ConnectionStatus';
import NetworkStatus from './components/NetworkStatus';

function App() {
  return (
    <StrictMode>
      <WalletProvider>
        <Router>
          <Header />
          <ConnectionStatus />
          <NetworkStatus />
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </StrictMode>
  );
}

export default App;
