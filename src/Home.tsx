import { useCallback, useEffect, useState } from 'react';
import { useCosmWasmClient, useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react';
import './custom.css'; // Import the CSS file

const CONTRACT_ADDRESS = 'sei1pr5nkrx2fg7htwff4ztsfeg5l4nwg4zlg8zdj2k3h7z4k7cqr3ms6cn8d5'; // (atlantic-2 example) sei18g4g35mhy5s88nshpa6flvpj9ex6u88l6mhjmzjchnrfa7xr00js0gswru

function Home() {
    const [count, setCount] = useState<number | undefined>();
    const [error, setError] = useState<string>('');
    const [isIncrementing, setIsIncrementing] = useState<boolean>(false);
    const [name, setName] = useState<string>(''); // Step 1: Define a name state variable

    // Helpful hook for getting the currently connected wallet and chain info
    const { connectedWallet, accounts } = useWallet();

    // For querying cosmwasm smart contracts
    const { cosmWasmClient: queryClient } = useCosmWasmClient();
    
    // For executing messages on cosmwasm smart contracts
    const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient();

    const fetchCount = useCallback(async () => {
        const response = await queryClient?.queryContractSmart(CONTRACT_ADDRESS, { get_count: {} });
        return response?.count;
    }, [queryClient]);

    useEffect(() => {
        fetchCount().then(setCount);
    }, [connectedWallet, fetchCount]);

    const incrementCounter = async () => {
        setIsIncrementing(true);
        try {
            const senderAddress = accounts[0].address;

            // Step 3: Include the name in the message content
            const msg = { reset: { count: name } };

            // Define gas price and limit
            const fee = {
                amount: [{ amount: '0.1', denom: 'usei' }],
                gas: '200000'
            };

            // Call smart contract execute msg
            await signingClient?.execute(senderAddress, CONTRACT_ADDRESS, msg, fee);

            // Updates the counter state again
            const updatedCount = await fetchCount();
            setCount(updatedCount);
            
            setIsIncrementing(false);
            setError('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('unknown error');
            }
            setIsIncrementing(false);
        }
    };

    // Helpful component for wallet connection
    if (!connectedWallet) return <WalletConnectButton />;

    return (
        <div>
            <h1 style={{color:'white',}}>Human-Friendly Name: {count ? count : '---'}</h1>

            {/* Step 2: Create an input field for the name */}
            <input
				className="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={{
                    padding: '10px',
					fontSize: '24px',
					border: '1px solid rgba(255, 255, 255, 0.5)', 
					borderRadius: '5px',
					width: '50%', // Adjust the width here to make it shorter
					marginBottom: '10px',
					backgroundColor: 'rgba(255, 255, 255, 0.2)', /* Semi-transparent background */
					color: 'white',
					
                }}
            />

			<div>
				<button disabled={isIncrementing} onClick={incrementCounter}>
					{isIncrementing ? 'updating...' : 'update'}
				</button>
				
				{error && <p style={{ color: 'red' }}>{error}</p>}
			</div>
        </div>
    );
}

export default Home;
