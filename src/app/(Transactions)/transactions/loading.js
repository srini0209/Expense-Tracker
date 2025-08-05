import React from 'react'
import { CircularProgress, Box } from '@mui/material'

const loading = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    )
}

export default loading