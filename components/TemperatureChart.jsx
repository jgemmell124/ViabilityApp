import React, { useState } from "react";
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native";
import { Rect, Text } from "react-native-svg";
import { View } from "react-native";
import { Text as RenderText } from "./Themed";

export default function TemperatureChart({ tempData, timeRange }) {

  const screenWidth = Dimensions.get("window").width;
  const filterData = ((timeRange) => {
    switch (timeRange) {
      case 'Hour':
        return tempData.filter((temp) => temp.date.getHours() === new Date().getHours());
      case 'Day':
        return tempData.filter((temp) => temp.date.getDay() === new Date().getDay());
      case 'Week':
        return tempData.filter((temp) => temp.date.getDate() >= new Date().getDate() - 7);
      case 'Month':
        return tempData.filter((temp) => temp.date.getMonth() === new Date().getMonth());
      case 'Year':
        return tempData.filter((temp) => temp.date.getFullYear() === new Date().getFullYear());
    }
  })(timeRange);
  // get hour
  const temps = filterData.map(temp => temp.temperature);
  const dates = filterData.map((temp) => temp.date.toISOString());

  const dataLength = dates.length;
  const maxLabels = 5;
  const labelRadix = Math.max(Math.floor(dataLength / maxLabels), 1)

  const formatXLabel = (xValue) => {
    // show first and last label
    /* if (xValue === dates[0] || xValue === dates[dates.length - 1]) { */
    /*   return; */
    /* } */
    // only show 5 labels over the entire interval of dates
    if (dataLength > 5) {
      const index = dates.findIndex((date) => date === xValue);
      if (index % Math.ceil(dataLength / 5) !== 0) {
        return "";
      }
    }

    const date = new Date(xValue);
    switch (timeRange) {
      case 'Hour':
        // show minutes and seconds of the last hour
        return date.toISOString().split("T")[1].split(".")[0];
      case 'Day':
        // show hours and minutes of the last 24 hours
        return date.toISOString().split("T")[1].split(".")[0];
      case 'Week':
        // show month and day of the last 7 days
        return date.toISOString().split("T")[0];
      case 'Month':
        return date.toISOString().split("T")[0];
      case 'Year':
        return date.toISOString().split("T")[0];
    }
  }

  const data = {
    labels: dates,
    datasets: [
      {
        data: temps,
        color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
  }

  const chartConfig = {
    backgroundColor: 'white',
    backgroundGradientFrom: "#ffffff",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#ffffff",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "1",
      strokeWidth: "0",
      stroke: "#000000"
    },
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false,
    barPercentage: 0.5,
  };

  const formatToDateAndTime = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString()?.split("T")[0] + " " + date.toISOString().split("T")[1].split(".")[0];
  };

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <LineChartWithTooltips
        style={{ margin: 10 }}
        data={data}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        xLabelsOffset={-10}
        withDots={true}
        formatXLabel={formatXLabel}
        valueFormatter={(value) => `${value}°C`}
        yAxisSuffix="°C"
      />
      <RenderText>
        {dates[0]} - {dates[dates.length - 1]}
      </RenderText>
    </View>
  );
};


import PropTypes from 'prop-types';
import { Circle, G } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

const Tooltip = ({ x, y, textX, textY, stroke, pointStroke, position }) => {
  let tipW = 136,
  tipH = 36,
  tipX = 5,
  tipY = -9,
  tipTxtX = 12,
  tipTxtY = 6;
  const posY = y;
  const posX = x;

  if (posX > screenWidth - tipW) {
    tipX = -(tipX + tipW);
    tipTxtX = tipTxtX - tipW - 6;
  }

  const boxPosX = position === 'left' ? posX - tipW - 10 : posX;

  return (
    <G>
      <Circle
        cx={posX}
        cy={posY}
        r={4}
        stroke={pointStroke}
        strokeWidth={2}
        fill={'blue'}
      />
      <Rect
        x={x-1}
        y={y}
        width={2}
        height={180 - y}
        fill={'rgba(0, 0, 0, 0.9)'}
      />
      <G x={boxPosX < 40 ? 40 : boxPosX} y={posY}>
        <Rect
          x={tipX + 1}
          y={tipY - 1}
          width={tipW - 2}
          height={tipH - 2}
          fill={'rgba(255, 255, 255, 0.9)'}
          rx={2}
          ry={2}
        />
        <Rect
          x={tipX}
          y={tipY}
          width={tipW}
          height={tipH}
          rx={2}
          ry={2}
          fill={'transparent'}
          stroke={stroke}
        />
        <Text x={tipTxtX} y={tipTxtY} fontSize="10" textAnchor="start">
          {textX}
        </Text>

        <Text
          x={tipTxtX}
          y={tipTxtY + 14}
          fontSize="12"
          textAnchor="start">
          {textY}
        </Text>
      </G>
    </G>
  );
};

Tooltip.propTypes = {
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  height: PropTypes.number,
  stroke: PropTypes.string,
  pointStroke: PropTypes.string,
  textX: PropTypes.string,
  textY: PropTypes.string,
  position: PropTypes.string,
};

Tooltip.defaultProps = {
  position: 'right',
};

const tooltipDecorators = (state, data, valueFormatter) => () => {
  if (state === null) {
    return null;
  }

  const { index, value, x, y } = state;
  const textX = data.labels[index];
  console.log(data.labels);
  const position = data.labels.length === index + 1 ? 'left' : 'right';

  return (
    <Tooltip
      textX={String(textX)}
      textY={valueFormatter(value)}
      x={x}
      y={y}
      stroke={'#000000'}
      pointStroke={'#000000'}
      position={position}
    />
  );
};

const LineChartWithTooltips = ({ valueFormatter, ...props }) => {
  const [state, setState] = useState(null);
  return (
    <LineChart
      {...props}
      decorator={tooltipDecorators(state, props.data, valueFormatter)}
      onDataPointClick={setState}
    />
  );
};

LineChartWithTooltips.propTypes = {
  valueFormatter: PropTypes.func,
};

LineChartWithTooltips.defaultProps = {
  valueFormatter: value => String(value),
};
