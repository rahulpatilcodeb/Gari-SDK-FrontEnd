import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { Connection, PublicKey } from '@solana/web3.js';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { Web3AuthCore } from '@web3auth/core';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { SolanaWallet } from '@web3auth/solana-provider';
import { useEffect, useRef } from 'react';
import { useAuthContext } from '../AuthContext';

export default function SignIn() {
    const web3authCore = useRef();
    const adapter = useRef();
    const web3AuthProvider = useRef();
    const [{ isAuthenticated, user }, dispatch] = useAuthContext();

    const clientId = "BO12qnqLP_vnsd3iCcH7sU3GGqYmOGr_1IgDno3t35KjWFZcdk7HIPeGGJINB4DKyvsX3YZeFdjwSbCUItLJI3U"; // get it from Web3Auth Dashboard

    async function configWeb3() {
        try {
            if (!web3authCore.current) {
                web3authCore.current = new Web3AuthCore({
                    clientId,
                    chainConfig: {
                        chainNamespace: CHAIN_NAMESPACES.SOLANA,
                        chainId: "0x2", // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
                        rpcTarget:
                            "https://summer-aged-dust.solana-testnet.quiknode.pro/039894727976ff4b40d544f35c75daf300c06024/",
                        // displayName: "Solana Mainnet",
                        // displayName: "Solana Testnet",
                        // blockExplorer: "https://explorer.solana.com",
                        blockExplorer: "https://explorer.solana.com/?cluster=testnet",
                        ticker: "SOL",
                        tickerName: "Solana Token",
                    },
                });

                adapter.current = new OpenloginAdapter({
                    adapterSettings: {
                        network: "testnet",
                        clientId,
                        uxMode: "popup", // other option: popup
                        loginConfig: {
                            jwt: {
                                name: "Demo React POC",
                                verifier: "gari-sdk",
                                typeOfLogin: "jwt",
                                clientId,
                                // clientId: "some_demo_client_id",
                            },
                        },
                    },
                });

                web3authCore.current.configureAdapter(adapter.current);
                await web3authCore.current.init();
            } else {
                console.log("Already Config");
            }
        } catch (error) {
            console.log("Error Config ==> ", error);
        }
    };

    useEffect(() => {
        configWeb3();
    }, []);

    async function loginBtn(name, id) {
        try {
            let token = await (
                await fetch(`https://gari-sdk.vercel.app/api/login?name=${name}&id=${id}`)
            ).json();
            token = token.token ? token.token : token;

            // call below code when user clicks on login button
            // it will use custom login with openlogin's authentication
            web3AuthProvider.current = await web3authCore.current.connectTo(
                adapter.current.name,
                {
                    loginProvider: "jwt",
                    extraLoginOptions: {
                        domain: "https://gari-sdk.vercel.app/",
                        id_token: token,
                        verifierIdField: "uid",
                        response_type: "token",
                        scope: "email", // e.g. email openid
                    },
                }
            );
            await checkBtn();

            // let data = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
            //   loginProvider: "jwt",
            //   extraLoginOptions: {
            //     id_token: token,
            //     verifierIdField: "uid", // sub, email, or custom
            //   },
            // });
        } catch (error) {
            alert("Error check console");
            console.log("Error Login ==> ", error);
        }
    };

    async function checkBtn() {
        try {
            if (web3AuthProvider.current) {
                const user = await web3authCore.current.getUserInfo();
                console.log("user ==> ", { user });
                // const web3AuthProvider = web3authCore.current.connect();

                const solanaWallet = new SolanaWallet(web3AuthProvider.current);

                // Get user's Solana public address
                const accounts = await solanaWallet.requestAccounts();
                const privateKey = await web3AuthProvider.current.request({ method: 'solanaPrivateKey' })
                console.log("accounts", { accounts, privateKey });

                const connectionConfig = await solanaWallet.request({
                    method: "solana_provider_config",
                    params: [],
                });

                const connection = new Connection(connectionConfig.rpcTarget);

                // Fetch the balance for the specified public key
                const balance = await connection.getBalance(new PublicKey(accounts[0]));
                dispatch({ type: 'loggedIn', payload: { publicKey: accounts[0], balance } })

                console.log("balance ==> ", { balance });
            } else {
                console.log("Not logged in");
            }
        } catch (error) {
            console.log("Error Check ==>", error);
        }
    };

    function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const id = data.get('id');
        loginBtn(name, id);
    };

    return isAuthenticated ? <>
        <Container maxWidth='sm'>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        Public Key:
                    </Grid>
                    <Grid item xs={8}>
                        {user.publicKey}
                    </Grid>
                    <Grid item xs={4}>
                        Balance:
                    </Grid>
                    <Grid item xs={8}>
                        {user.balance}
                    </Grid>
                </Grid>
            </Box>
        </Container>
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Button
                    type="button"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={async () => {
                        if (!web3authCore.current) {
                            console.log("web3auth not initialized yet");
                            return;
                        }
                        await web3authCore.current.logout();
                        dispatch({ type: 'logout' });
                    }}
                >
                    Log Out
                </Button>
            </Box>
        </Container>
    </> : (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="id"
                        label="ID"
                        id="id"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}