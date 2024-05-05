import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

const Input = styled(MuiInput)`
  width: 42px;
`;

function RangeSlider({ range, onRangeChange }) {
  const handleSliderChange = (event, newValue) => {
    onRangeChange(newValue);
  };

  const handleInputChange = (index) => (event) => {
    const newRange = [...range];
    newRange[index] = event.target.value === '' ? 0 : Number(event.target.value);
    onRangeChange(newRange);
  };

  const handleBlur = (index) => () => {
    const newRange = [...range];
    if (newRange[index] < 0) {
      newRange[index] = 0;
    } else if (newRange[index] > 100) {
      newRange[index] = 100;
    }
    onRangeChange(newRange);
  };

  return (
    <Box sx={{ width: 300 }}>
      <Typography id="input-slider" gutterBottom>
        <h2>Sprint Range</h2>
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <DirectionsRunIcon />
        </Grid>
        <Grid item xs>
          <Slider
            value={range}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={100}
          />
        </Grid>
        {range.map((value, index) => (
          <Grid item key={index}>
            <Input
              value={value}
              size="small"
              onChange={handleInputChange(index)}
              onBlur={handleBlur(index)}
              inputProps={{
                step: 1,
                min: 0,
                max: 100,
                type: 'number',
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
