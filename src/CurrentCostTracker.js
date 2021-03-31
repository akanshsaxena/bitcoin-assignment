import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import moment from "moment";

export default function CurrentCostTracker() {
  const [currentData, setCurrentData] = useState([]);
  const [pastCost, setPastCost] = useState([]);
  const [pastDate, setPastDate] = useState([]);
  const [currency, setCurrency] = useState("USD");

  //Lifecycle method to get current rate of bitocin
  useEffect(async () => {
    const getData = async () => {
      let arr = [];
      const res = await axios.get(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );
      const data = await res.data;
      arr.push(data);
      console.log(arr[0].time.updated);
      setCurrentData(arr);
    };
    getData();
  }, []);

  //Lifecycle method to get past data
  useEffect(async () => {
    const getPastData = async () => {
      console.log(currency);
      var month = 0;
      var date = 0;
      var currentdate = new Date();
      var pastDate = moment().subtract(60, "days").calendar();

      if (currentdate.getMonth() + 1 < 10) {
        month = `0${currentdate.getMonth() + 1}`;
      } else {
        month = currentdate.getMonth() + 1;
      }
      if (currentdate.getDate() < 10) {
        date = `0${currentdate.getDate()}`;
      } else {
        date = currentdate.getDate();
      }
      var todayDate = `${currentdate.getFullYear()}-${month}-${date}`;
      const res = await axios.get(
        `https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}&start=${
          pastDate.split("/")[2]
        }-${pastDate.split("/")[0]}-${pastDate.split("/")[1]}&end=${todayDate}`
      );
      const data = await res.data;
      let keys = Object.keys(data.bpi);
      let arr = [];
      keys.map((key) => arr.push(data.bpi[key]));
      let arr2 = [];
      keys.map((key, index) => {
        if (index % 3 === 0) arr2.push(key);
      });
      console.log(arr);
      setPastDate(arr2);
      setPastCost(arr);
      console.log(pastCost);
    };
    getPastData();
  }, [currency]);

  const handleChange = (e) => {
    setCurrency(e.target.value);
  };
  const state = {
    labels: pastDate,
    datasets: [
      {
        fill: false,
        lineTension: 0.5,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 2,
        data: pastCost,
      },
    ],
  };
  return (
    <div className="div">
      <div className="left">
        <label>
          1 Bitcoin Equals <br />
          <select name="cars" id="cars" onChange={handleChange}>
            <option value="USD">United States Dollar</option>
            <option value="GBP">British Pound Sterling</option>
            <option value="EUR">Euro</option>
          </select>
        </label>
        {currency === "USD" &&
          currentData.map((current) => (
            <>
              <h2>{current.bpi.USD.rate_float}</h2>
              <h4>{current.bpi.USD.description}</h4>
            </>
          ))}
        {currency === "GBP" &&
          currentData.map((current) => (
            <>
              <h2>{current.bpi.GBP.rate_float}</h2>
              <h4>{current.bpi.GBP.description}</h4>
            </>
          ))}
        {currency === "EUR" &&
          currentData.map((current) => (
            <>
              <h2>{current.bpi.EUR.rate_float}</h2>
              <h4>{current.bpi.EUR.description}</h4>
            </>
          ))}
      </div>
      <div className="chart">
        <Line
          data={state}
          options={{
            title: {
              display: true,
              text: "Last 60 days trend",
              fontSize: 15,
            },
            legend: {
              display: false,
              position: "right",
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}
