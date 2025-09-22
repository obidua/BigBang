import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { projectId, metadata, networks, wagmiAdapter } from '../config'
import LandingPage from './pages/LandingPage';
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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DashboardPage />} />
        </Routes>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;