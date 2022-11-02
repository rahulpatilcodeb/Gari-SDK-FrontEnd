import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useEffect, useRef } from 'react';
import { useAuthContext } from '../AuthContext';
import { GetWallet } from './sdk/getWallet';
import { configWeb3, loginBtn } from './sdk/helper';

const token = "eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjhhUHk1MVIwb0Fza3Z5NE40Ty1waUxmUVRubmstYUFYTXkyTmR3a25DX1kifQ.eyJleHAiOjE2Njc0NTYzMjMsImlhdCI6MTY2NzM2OTkyMywic3ViIjoiZ2FyaS1zZGsiLCJuYW1lIjoiYWJjIiwidWlkIjoiMTIzIn0.PFKhxZRauWPMEtf31faP5tIHvwSIIf5ncekZLbacxBIMmBIqodBPBvZ4oafRI5U4-hcMMEs72DobRc0rkMj4PzqpAMKywwnCB0TohTLr8Zzyf9O5XzyOzx3xNV78ka9FhkDC9q9LNHL3AIxX9Uc1snBWiHDTuljhGFaJV_Iej5qz6YeYjJngDXlt1aa3rbxHfefkYCaok5BMow0-lpEK7yq_0PcF-R3sfRh7v1FxIeLol-FloxEDV-bPfvlgEYpXkTvysHzUQ5Jr3z1l7CJvQUH9A01fYRLGcw09yym-0tAC-CPMeVR1azD4TubGCsbjf6y-P8-naVlEfBPuvaELIg"
const userId = '6307b6f34a4758e0604ee57'

export default function SignIn() {
    const web3authCore = useRef();
    const [{ isAuthenticated, user }, dispatch] = useAuthContext();


    useEffect(() => {
        configWeb3();
    }, []);



    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const id = data.get('id');
        const response = await loginBtn(name, id);
        console.log({ response });
        dispatch({ type: 'loggedIn', payload: response })
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
                        {console.log({ user }) || user.publicKey}
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
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={() => GetWallet(token, userId)}
                    >
                        Get Wallet
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}