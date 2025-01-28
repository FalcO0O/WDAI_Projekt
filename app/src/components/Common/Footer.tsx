import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: 'white',
                paddingY: 2,
                position: 'fixed',
                bottom: 0,
                width: '100%',
                textAlign: 'center',
            }}
        >
            <Typography variant="body1">
                © 2025 To tyle. Serio nic więcej nie ma.
            </Typography>
        </Box>
    );
}

export default Footer;
