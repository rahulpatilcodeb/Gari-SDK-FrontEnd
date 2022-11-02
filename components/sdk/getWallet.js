import { configWeb3, loginBtn } from "./helper";

export async function GetWallet(token, userId) {
    const URL = 'http://localhost:5001'
    let res
    // we will first search userData in chingariSdkBackend 
    if (userId) {
        // console.log('userId', userId)
        try {
            console.log({ userId });
            res = await axios.post(`${URL}/Appwallet/getWalletDetails`, { userId })
            if (res.data.data) {
                const publicKey = res.data.data.publicKey
                const balance = res.data.data.balance
                // console.log('publicKey', publicKey, balance)
                return { publicKey, balance }
            }
        }
        catch (error) {
            console.log('error', error)
        }
    }
    console.log({ res });
    //if userwallet deatails not found in chingariSdkBackend than we will create user new wallet using web3Auth
    if (res.data.message === 'UserId Not Found') {
        console.log('firstt')
        await configWeb3();
        console.log('first')
        try {
            const response = await loginBtn('abc', 2);
            const { publicKey } = response;
            const res = await axios.post('http://localhost:5001/Appwallet/create', { publicKey });
            console.log({ res });
            console.log('web3AuthProvider', web3AuthProvider)
            // const userData = await checkUser()

            console.log('userData', userData);
            return response;
        } catch (error) {
            console.log("Error Login ==> ", error);
        }

    }

}
const token = "eyJ0eXAiOiJqd3QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjhhUHk1MVIwb0Fza3Z5NE40Ty1waUxmUVRubmstYUFYTXkyTmR3a25DX1kifQ.eyJleHAiOjE2Njc0NTYzMjMsImlhdCI6MTY2NzM2OTkyMywic3ViIjoiZ2FyaS1zZGsiLCJuYW1lIjoiYWJjIiwidWlkIjoiMTIzIn0.PFKhxZRauWPMEtf31faP5tIHvwSIIf5ncekZLbacxBIMmBIqodBPBvZ4oafRI5U4-hcMMEs72DobRc0rkMj4PzqpAMKywwnCB0TohTLr8Zzyf9O5XzyOzx3xNV78ka9FhkDC9q9LNHL3AIxX9Uc1snBWiHDTuljhGFaJV_Iej5qz6YeYjJngDXlt1aa3rbxHfefkYCaok5BMow0-lpEK7yq_0PcF-R3sfRh7v1FxIeLol-FloxEDV-bPfvlgEYpXkTvysHzUQ5Jr3z1l7CJvQUH9A01fYRLGcw09yym-0tAC-CPMeVR1azD4TubGCsbjf6y-P8-naVlEfBPuvaELIg"
const userId = '6307b6f34a4758e0604ee57'