import { SeiWalletProvider } from '@sei-js/react';
import './App.css';
import Home from './Home.tsx';

function App() {
    return (
    	// Set up SeiWalletProvider for easy wallet connection and to use hooks in @sei-js/react
        <SeiWalletProvider
	    chainConfiguration={{
	        chainId: 'atlantic-2',
		restUrl: 'https://sei-testnet-api.polkachu.com',
		rpcUrl: 'https://sei-testnet-rpc.polkachu.com'
	    }}
	    wallets={['compass', 'fin']}>
	        <Home />
	</SeiWalletProvider>
    );
}

export default App;