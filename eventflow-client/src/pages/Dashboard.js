import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {

  const [
    analytics,
    setAnalytics,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH ANALYTICS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const response =
            await axios.get(

              "http://localhost:5002/api/analytics"
            );

          setAnalytics(
            response.data
          );

        } catch (error) {

          console.error(
            error
          );
        }
      };

    fetchAnalytics();

  }, []);

  if (!analytics) {

    return (
      <div
        style={{
          color: "#fff",
          padding: "30px",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  return (

    <div
      style={{
        background:
          "#0f172a",
        minHeight:
          "100vh",
        padding:
          "30px",
        color:
          "#fff",
      }}
    >

      <h1
        style={{
          marginBottom:
            "30px",
        }}
      >
        📊 EventFlow Analytics
      </h1>

      {/* CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom:
            "40px",
        }}
      >

        <div style={styles.card}>

          <h2>
            💬 Total Messages
          </h2>

          <h1>
            {
              analytics.totalMessages
            }
          </h1>
        </div>

        <div style={styles.card}>

          <h2>
            🏠 Active Rooms
          </h2>

          <h1>
            {
              analytics.activeRooms
            }
          </h1>
        </div>

        <div style={styles.card}>

          <h2>
            📎 Uploads
          </h2>

          <h1>
            {
              analytics.uploads
            }
          </h1>
        </div>
      </div>

      {/* CHART */}

      <div
        style={{
          background:
            "#111827",
          padding:
            "20px",
          borderRadius:
            "12px",
        }}
      >

        <h2
          style={{
            marginBottom:
              "20px",
          }}
        >
          📈 Messages Per Room
        </h2>

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <BarChart
            data={
              analytics.roomStats
            }
          >

            <XAxis
              dataKey="_id"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="messages"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {

  card: {
    background:
      "#111827",
    padding:
      "25px",
    borderRadius:
      "12px",
    textAlign:
      "center",
  },
};

export default Dashboard;