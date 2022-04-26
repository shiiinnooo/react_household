/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect } from "react";
import * as echarts from "echarts";

const EChartsRender = (props) => {
  const { options } = props;
  const chartRef = useRef(null);
  let chartInstance = null;
  
  const renderChart = () => {
    chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(options);
  };

  window.onresize = function() {
    chartInstance.resize();
  }
  
  useEffect(() => {
    renderChart();
  }, [options]);

  return (
    <div
      className="w-full h-[400px]"
      ref={chartRef}
      // style={{ width: 600, height: 400 }}
    ></div>
  );
};

export default EChartsRender;