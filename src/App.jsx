import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { projectId, metadata, networks, wagmiAdapter } from '../config'
import DashboardPage from './pages/DashboardPage';
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'

function App() {


  const queryClient = new QueryClient();
  
  const generalConfig = {
    projectId,
    networks,
    metadata,
    themeMode: 'black',
    themeVariables: {
      '--w3m-accent': '#000000',
    }
  }

  // Create modal
  createAppKit({
    adapters: [wagmiAdapter],
    ...generalConfig,
    features: {
      analytics: false // Optional - defaults to your Cloud configuration
    }
  })



  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;