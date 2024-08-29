import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@apollo/client';
import { GET_INVESTMENTS, GET_TRANSACTIONS } from '../graphql/queries';
import { CircularProgress, Typography, Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const InvestmentChart = () => {
	const [chartData, setChartData] = useState(null);
	const { loading: investmentsLoading, error: investmentsError, data: investmentsData } = useQuery(GET_INVESTMENTS);
	const { loading: transactionsLoading, error: transactionsError, data: transactionsData } = useQuery(GET_TRANSACTIONS);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		if (investmentsData && transactionsData) {
			const processedData = processData(investmentsData.getInvestments, transactionsData.getTransactions);
			setChartData(processedData);
		}
	}, [investmentsData, transactionsData]);

	const processData = (investments, transactions) => {
		console.log('Processing data...');
		const dataPoints = {};

		const processDate = (dateString) => {
			// Convert milliseconds to seconds by dividing by 1000
			const date = new Date(parseInt(dateString, 10));
			if (isNaN(date.getTime())) {
				console.warn(`Invalid date: ${dateString}`);
				return null;
			}
			return date.toISOString().split('T')[0];
		};

		investments.forEach(investment => {
			const date = processDate(investment.date);
			if (date) {
				dataPoints[date] = (dataPoints[date] || 0) + parseFloat(investment.amount);
			}
		});

		transactions.forEach(transaction => {
			const date = processDate(transaction.date);
			if (date) {
				const amount = parseFloat(transaction.amount);
				// Assuming all transactions are expenses for now
				dataPoints[date] = (dataPoints[date] || 0) - amount;
			}
		});

		const sortedDates = Object.keys(dataPoints).sort();
		let runningTotal = 0;

		const labels = sortedDates;
		const values = sortedDates.map(date => {
			runningTotal += dataPoints[date];
			return runningTotal;
		});

		return {
			labels,
			datasets: [
				{
					label: 'Portfolio Value',
					data: values,
					fill: false,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1
				}
			]
		};
	};

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: '',
				font: {
					size: isMobile ? 16 : 18,
					weight: 'bold',
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => `$${context.parsed.y.toFixed(2)}`,
				},
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: 'Date',
					font: {
						size: isMobile ? 12 : 14,
						weight: 'bold',
					},
				},
				ticks: {
					maxRotation: 45,
					minRotation: 45,
					font: {
						size: isMobile ? 10 : 12,
					},
				},
			},
			y: {
				title: {
					display: true,
					text: 'Portfolio Value ($)',
					font: {
						size: isMobile ? 12 : 14,
						weight: 'bold',
					},
				},
				ticks: {
					callback: (value) => `$${value.toLocaleString()}`,
					font: {
						size: isMobile ? 10 : 12,
					},
				},
				beginAtZero: true,
			},
		},
	};

	if (investmentsLoading || transactionsLoading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress />
			</Box>
		);
	}

	if (investmentsError || transactionsError) {
		return (
			<Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
				<Typography variant="h6" gutterBottom>Error loading data</Typography>
				<Typography>{investmentsError?.message || transactionsError?.message}</Typography>
			</Paper>
		);
	}

	if (!chartData) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<Typography>Processing data...</Typography>
			</Box>
		);
	}

	if (chartData.labels.length === 0) {
		return (
			<Paper elevation={3} sx={{ p: 3 }}>
				<Typography variant="h6" gutterBottom>No data available</Typography>
				<Typography>There is no investment or transaction data to display in the chart.</Typography>
			</Paper>
		);
	}

	return (
		<Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: 800, margin: 'auto' }}>
			<Box display="flex" alignItems="center" mb={2}>
				<ShowChartIcon sx={{ fontSize: 28, color: 'primary.main', mr: 1 }} />
				<Typography variant="h5" color="primary">Portfolio Performance</Typography>
			</Box>
			<Box sx={{ height: isMobile ? 300 : 400 }}>
				<Line data={chartData} options={chartOptions} />
			</Box>
		</Paper>
	);
};

export default InvestmentChart;