import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

const Input = styled(MuiInput)`
  width: 115px;
`;

function dateToSprintNumber(date) {
  const startDate = new Date('2023-01-01');
  const diffTime = Math.abs(date - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 14) + 1;
}

function RangeSlider({ sx, range, onRangeChange }) {
  const handleSliderChange = (event, newValue) => {
    onRangeChange(newValue.map(value => new Date(value)));
  };

  const handleInputChange = (index) => (event) => {
    const newRange = [...range];
    newRange[index] = new Date(event.target.value);
    onRangeChange(newRange);
  };

  return (
    <Box sx={sx}>
      <Typography id="input-slider" variant="h5">
        Sprint Range
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <DirectionsRunIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={range.map(date => date.getTime())}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="input-slider"
            min={new Date('2023-01-01').getTime()}
            max={new Date('2023-12-31').getTime()}
            valueLabelFormat={date => `Sprint ${dateToSprintNumber(new Date(date))}`}
          />
        </Grid>
        {range.map((value, index) => (
          <Grid item key={index}>
            <Input
              value={value.toISOString().substring(0, 10)}
              onChange={handleInputChange(index)}
              onBlur={() => {}}
              inputProps={{
                type: 'date',
                'aria-labelledby': 'input-slider',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RangeSlider;
