import { Typography } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import Chart from "react-apexcharts";
import { getRequest } from "../../utils/apiHandler";

const OrdersOverTime = () => {
  const [seriesInfo, setSeriesInfo] = useState([]);
  const [xCategories, setXCategories] = useState([]);

  const options = {
    stroke: {
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.6,
      },
    },
    yaxis: {
      title: {
        text: "Orders Count",
      },
    },
  };

  const { data, isLoading } = useQuery({
    queryKey: ["ordersOverTime"],
    queryFn: async () => {
      const res = await getRequest({ endpoint: "/dashboard/orders-over-time" });
      return res.data;
    },
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      const labels = data.map((entry) => entry.month);
      const values = data.map((entry) => entry.count);

      setSeriesInfo([{ name: "Orders", data: values }]);
      setXCategories(labels);
    }
  }, [data]);

  return (
    <div className="flex-1 p-5 flex flex-col bg-white rounded shadow-sm">
      <div className="flex justify-between items-center gap-x-4">
        <Typography variant="h6">Monthly Orders Growth</Typography>
      </div>

      {!isLoading && data && (
        <div className="mt-5 flex-1 border">
          <Chart
            type="line"
            series={seriesInfo}
            options={{
              ...options,
              xaxis: {
                categories: xCategories,
              },
            }}
            height="350px"
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default OrdersOverTime;
