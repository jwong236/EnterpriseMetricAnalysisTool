import React, { useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import './SprintRange.css'

const SprintRange = ({onStartDateChange, onEndDateChange} ) => {
    const [startDate, setStartDate] = useState(dayjs('2023-04-13 19:18')); 
    const [endDate, setEndDate] = useState(dayjs()); 

    // Validator for the start and end dates
    const handleStartDate = (newStartDate) => {
        if (dayjs(newStartDate).isBefore(endDate)){
            setStartDate(newStartDate)
            onStartDateChange(newStartDate);
        } else {
            alert("Start date must be before end date")
        }
    }
    const handleEndDate = (newEndDate) => {
        if (dayjs(newEndDate).isAfter(startDate)){
            setEndDate(newEndDate)
            onEndDateChange(newEndDate);
        } else {
            alert("End date must be before start date")
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="calendar-container">
                <h2>Select Sprint Date Range:</h2>
                <div className='calendar'>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartDate}
                    />
                    <div className="arrow">
                        <span>----------------{'>'}</span>
                    </div>
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={handleEndDate}
                    />
                </div>
            </div>  
        </LocalizationProvider>
    );
}

export default SprintRange;
