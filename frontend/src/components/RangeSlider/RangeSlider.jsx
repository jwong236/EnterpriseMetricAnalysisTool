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

function RangeSlider({ sx, range, onRangeChange }) {
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
    newRange[index] = Math.max(0, Math.min(100, newRange[index]));
    onRangeChange(newRange);
  };

  return (
    <Box sx={sx}>
      <Typography id="input-slider" gutterBottom component="h2">
        Sprint Range
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
            aria-labelledby="input-slider"
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
