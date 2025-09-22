import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const projectId = "f8fa01f8bf28e049d1bea3fde0e5a412"

const ramesttaNetwork = {
    id: 1370,
    name: 'Ramestta',
    nativeCurrency: {
        name: 'Rama',
        symbol: 'RAMA',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [
                'https://blockchain.ramestta.com',
                'https://blockchain2.ramestta.com'
            ],
        },
        public: {
            http: [
                'https://blockchain.ramestta.com',
                'https://blockchain2.ramestta.com',
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Ramascan',
            url: 'https://ramascan.com/',
        },
    },
    testnet: false,
}

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'https://reown.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Networks array (no type assertion needed in JS)
export const networks = [ramesttaNetwork]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
})

export const config = wagmiAdapter.wagmiConfig