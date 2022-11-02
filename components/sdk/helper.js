import { Connection, PublicKey } from "@solana/web3.js";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Web3AuthCore } from "@web3auth/core";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { SolanaWallet } from "@web3auth/solana-provider";

let web3authCore;
let adapter;
let web3AuthProvider;

const clientId = "BO12qnqLP_vnsd3iCcH7sU3GGqYmOGr_1IgDno3t35KjWFZcdk7HIPeGGJINB4DKyvsX3YZeFdjwSbCUItLJI3U"; // get it from Web3Auth Dashboard

export async function configWeb3() {
    try {
        if (!web3authCore) {
            web3authCore = new Web3AuthCore({
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

            adapter = new OpenloginAdapter({
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

            web3authCore.configureAdapter(adapter);
            await web3authCore.init();
        } else {
            console.log("Already Config");
        }
    } catch (error) {
        console.log("Error Config ==> ", error);
    }
};

export async function loginBtn(name, id) {
    try {
        let token = await (
            await fetch(`https://gari-sdk.vercel.app/api/login?name=${name}&id=${id}`)
        ).json();
        token = token.token ? token.token : token;

        // call below code when user clicks on login button
        // it will use custom login with openlogin's authentication
        web3AuthProvider = await web3authCore.connectTo(
            adapter.name,
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
        if (web3AuthProvider) {
            const user = await web3authCore.getUserInfo();
            console.log("user ==> ", { user });
            // const web3AuthProvider = web3authCore.connect();

            const solanaWallet = new SolanaWallet(web3AuthProvider);

            // Get user's Solana public address
            const accounts = await solanaWallet.requestAccounts();
            const privateKey = await web3AuthProvider.request({ method: 'solanaPrivateKey' })
            console.log("accounts", { accounts, privateKey });

            const connectionConfig = await solanaWallet.request({
                method: "solana_provider_config",
                params: [],
            });

            const connection = new Connection(connectionConfig.rpcTarget); false

            // Fetch the balance for the specified public key
            const balance = await connection.getBalance(new PublicKey(accounts[0]));
            // dispatch({ type: 'loggedIn', payload: { publicKey: accounts[0], balance } })
            console.log("balance ==> ", { balance });
            return { publicKey: accounts[0], balance };

        } else {
            console.log("Not logged in");
        }

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