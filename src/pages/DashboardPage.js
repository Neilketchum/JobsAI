import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import AppBar from '../components/AppBar';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { Typography, Box } from '@mui/material';

const DashboardPage = () => {
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = 'daipayanh@gmail.com'; // Replace with actual method to get logged-in email
        const response = await axios.get(`https://jobsai-446602.wm.r.appspot.com/getAnalytics/${email}`);
        const userActivity = response.data.userActivity;

        if (!userActivity) {
          throw new Error("User activity data is undefined");
        }

        const data = Object.entries(userActivity.chartMapper).map(([date, values]) => ({
          date,
          resumesAnalyzed: values.totalResumesAnalyzed || 0,
          coverLetterGenerated: values.totalCoverLetterGenerated || 0,
        }));
        const totalResumeAnalyzed = userActivity.totalResumeAnalyzed;
        const totalCoverLetterGenerated = userActivity.totalCoverLetterGenerated;

        if (totalResumeAnalyzed === undefined || totalCoverLetterGenerated === undefined) {
          throw new Error("Total resume or cover letter data is undefined");
        }
        setChartData(data);

        console.log("line 38");
        console.log("Total Resume Analyzed:", totalResumeAnalyzed);
        console.log("Total Cover Letter Generated:", totalCoverLetterGenerated);
        const pieDataArray = [
          {
            data: [
              { id: 0,  value: totalResumeAnalyzed,label: 'Resumes Analyzed' ,color: '#8884d8' },
              { id: 1,  value: totalCoverLetterGenerated,label: 'Cover Letters Generated' ,color:'#82ca9d' },
            ],
            highlightScope: { fade: 'global', highlight: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ];
        setPieData(pieDataArray);
        console.log("Pie Data:", pieDataArray);
        console.log("line 46");

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };
    fetchData();
  }, []);

  const dates = chartData.map(item => new Date(item.date).getTime());
  const resumesAnalyzed = chartData.map(item => item.resumesAnalyzed);
  const coverLetterGenerated = chartData.map(item => item.coverLetterGenerated);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const pieParams = {
    height: 300,
    margin: { right: 5 },
    slotProps: { legend: { hidden: true } },
  };
  return (
    <div>
      <AppBar />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '20px',marginTop: '64px', padding: '20px' }}>
        <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2 }}>
          <h2>Resumes Analyzed Over Last 30 Days</h2>
          <LineChart
            width={400}
            height={300}
            xAxis={[{ data: dates, label: 'Date', valueFormatter: formatDate }]}
            series={[
              { data: resumesAnalyzed, label: 'Resumes Analyzed', color: '#8884d8' }
            ]}
          />
        </Box>
        <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2 }}>
          <h2>Cover Letters Generated Over Last 30 Days</h2>
          <LineChart
            width={400}
            height={300}
            xAxis={[{ data: dates, label: 'Date', valueFormatter: formatDate }]}
            series={[
              { data: coverLetterGenerated, label: 'Cover Letters Generated', color: '#82ca9d' }
            ]}
          />
        </Box>
        <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2 }}>
          <h2>Overall Distribution</h2>
          {pieData && pieData.length > 0 && (
            <>
              <PieChart
                series={pieData}
                width={400}
                {...pieParams}
              />
              <Box sx={{ mt: 2, alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#82ca9d' }} />
                  <Typography variant="body2">
                    Cover Letters Generated: {pieData[0].data[1].value}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#8884d8' }} />
                  <Typography variant="body2">
                    Resumes Analyzed: {pieData[0].data[0].value}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
        <Box sx={{ boxShadow: 3, borderRadius: 2, border: '1px solid #e0e0e0', p: 2, textAlign: 'center' }}>
          <h2>Recent Activity</h2>
          <p>This space is reserved for a future chart.</p>
        </Box>
      </div>
    </div>
  );
};

export default DashboardPage;