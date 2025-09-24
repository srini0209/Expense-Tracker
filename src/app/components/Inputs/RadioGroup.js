'use client'
import * as React from 'react';
import { Box, FormLabel, Radio, RadioGroup, Sheet } from '@mui/joy';
import { deepOrange, green } from '@mui/material/colors';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function IconlessRadioGroup({ title, values, value, onChange }) {
    return (
        <Box sx={{ width:'100%', marginBottom: 2 }}>
            <FormLabel
                id="radio-group-label"
                sx={{
                    mb: 1,
                    fontWeight: 'xl',
                    fontSize: 'xs',
                    letterSpacing: '0.15rem',
                    fontFamily: "inherit"
                }}
            >
                {title}
            </FormLabel>
            <RadioGroup
                aria-labelledby="radio-group-label"
                defaultValue="Expense"
                size="xl"
                orientation='horizontal'
                value={value}
                onChange={onChange}
                sx={{ gap: 1.5, width: '100%' }}
            >
                {values.map((value) => (
                    <Sheet key={value} sx={{ p: 1.5, width: '50%', borderRadius: 'md', boxShadow: 'sm' }}>
                        {/* {value === 'Expense' ? <TrendingDown className='checked:text-[#ff5722]'/> :

                            <TrendingUp className='checked:text-[#00e676]'/>} */}
                            <Radio
                            label={value}
                            overlay
                            disableIcon
                            value={value}
                            slotProps={{
                                label: ({ checked }) => ({
                                    sx: {
                                        fontWeight: 'lg',
                                        fontSize: 'md',
                                        justifyContent: 'center',
                                        // color: checked ? 'text.primary' : 'text.secondary',
                                        ...(checked && { color: value === 'Expense' ? deepOrange[500] : green['A400'] })
                                    },
                                }),
                                action: ({ checked }) => ({
                                    sx: (theme) => ({
                                        ...(checked && {
                                            '--variant-borderWidth': '2px',
                                            '&&': {
                                                // && to increase the specificity to win the base :hover styles
                                                borderColor: value === 'Expense' ? deepOrange[500] : green['A400'],
                                            },
                                        }),
                                    }),
                                }),
                            }}
                        />
                    </Sheet>
                ))}
            </RadioGroup>
        </Box>
    );
}