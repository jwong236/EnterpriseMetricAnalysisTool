import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { dateToSprintNumber } from "../utils/dateToSprint";

const Input = styled(MuiInput)`
  width: 115px;
`;
const cardBackgroundStyle = {
  width: "100%",
  marginX: "1rem",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "20px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
};

function RangeSlider({ range, onRangeChange }) {
  const [localRange, setLocalRange] = useState(
    range.map((date) => date.getTime())
  );
  const handleSliderChange = (event, newValue) => {
    setLocalRange(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    onRangeChange(newValue.map((value) => new Date(value)));
  };

  const handleInputChange = (index) => (event) => {
    const newDate = new Date(event.target.value);
    const newLocalRange = [...localRange];
    newLocalRange[index] = newDate.getTime();
    setLocalRange(newLocalRange);
    onRangeChange(newLocalRange.map((value) => new Date(value)));
  };

  return (
    <Box sx={cardBackgroundStyle}>
      <Typography id="input-slider" variant="h5">
        Sprint Range
      </Typography>
      <Grid container spacing={2.5} alignItems="center">
        <Grid item>
          <DirectionsRunIcon />
        </Grid>
        <Grid item xs sx={{ marginRight: "1rem" }}>
          <Slider
            value={localRange}
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            valueLabelDisplay="auto"
            aria-labelledby="input-slider"
            min={new Date("2023-01-01").getTime()}
            max={new Date("2023-12-31").getTime()}
            valueLabelFormat={(date) =>
              `Sprint ${dateToSprintNumber(new Date(date))}`
            }
            sx={{
              marginTop: ".5rem",
            }}
          />
        </Grid>
        {range.map((value, index) => (
          <Grid item key={index}>
            <Input
              value={new Date(localRange[index]).toISOString().substring(0, 10)}
              onChange={handleInputChange(index)}
              inputProps={{
                type: "date",
                "aria-labelledby": "input-slider",
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default RangeSlider;
