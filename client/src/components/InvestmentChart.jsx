import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@apollo/client';
import { GET_INVESTMENTS, GET_TRANSACTIONS } from '../graphql/queries';
import { CircularProgress, Typography, Box } from '@mui/material';
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
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: 'Portfolio Performance Over Time',
				font: {
					size: 18,
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
						size: 14,
						weight: 'bold',
					},
				},
				ticks: {
					maxRotation: 45,
					minRotation: 45,
				},
			},
			y: {
				title: {
					display: true,
					text: 'Portfolio Value ($)',
					font: {
						size: 14,
						weight: 'bold',
					},
				},
				ticks: {
					callback: (value) => `$${value.toLocaleString()}`,
				},
				beginAtZero: true,
			},
		},
	};

	if (investmentsLoading || transactionsLoading) return <CircularProgress />;
	if (investmentsError) return <Typography color="error">Error loading investments: {investmentsError.message}</Typography>;
	if (transactionsError) return <Typography color="error">Error loading transactions: {transactionsError.message}</Typography>;
	if (!chartData) return <Typography>Processing data...</Typography>;
	if (chartData.labels.length === 0) return <Typography>No data available for the chart</Typography>;

	return (
		<Box sx={{ width: '100%', maxWidth: 800, margin: 'auto', padding: 2 }}>
			<Typography variant="h5" gutterBottom align="center">Portfolio Performance</Typography>
			<Line data={chartData} options={chartOptions} />
		</Box>
	);
};

export default InvestmentChart;