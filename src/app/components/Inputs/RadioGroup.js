'use client'
import * as React from 'react';
import {Box, FormLabel,Radio, RadioGroup, Sheet } from '@mui/joy';
import { deepOrange, green } from '@mui/material/colors';

export default function IconlessRadioGroup({ title, values }) {
    return (
        <Box sx={{ width: 500,marginBottom:3 }}>
            <FormLabel
                id="radio-group-label"
                sx={{
                    mb: 2,
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
                sx={{ gap: 1.5, width: 500 }}
            >
                {values.map((value) => (
                    <Sheet key={value} sx={{ p: 2, width: 200, borderRadius: 'md', boxShadow: 'sm' }}>
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