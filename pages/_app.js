import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../AuthContext';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
});

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default MyApp
