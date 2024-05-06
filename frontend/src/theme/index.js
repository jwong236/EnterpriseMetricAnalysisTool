import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            dark: '#3F5161',
            main: '#427CAC',
            light: '#91C8F6'
        },
        secondary: {
            dark: '#E5D9B8',
            main: '#FFD200',
            light: '#F8EFD3',
        },
        info: {
            dark: '#427CAC',
            main: '#91c8f6',
            light: '#BFC3FF',
        }
    }
});

export default theme;
