import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: '#000000',
                opacity: 0.2,
                color: 'white',
                paddingY: 2,
                position: 'sticky',
                bottom: 0,
                width: '100%',
                textAlign: 'center',
            }}
        >
            <Typography variant="body1">
                © 2025 Moja Strona
            </Typography>
        </Box>
    );
}

export default Footer;
