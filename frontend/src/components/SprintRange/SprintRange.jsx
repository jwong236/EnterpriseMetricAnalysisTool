import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material'; 
import dayjs from "dayjs";

const SprintRange = () => {
    const [startDate, setStartDate] = useState(dayjs()); 
    const [endDate, setEndDate] = useState(dayjs()); 

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                />
                <span>-</span>
                <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate} 
                />
            </div>
        </LocalizationProvider>
    );
}

export default SprintRange;
