import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useQuery } from '@apollo/client';
import { GET_INVESTMENTS, GET_TRANSACTIONS } from '../graphql/queries';
import {
        CircularProgress,
        Typography,
        Box,
        Paper,
        useTheme,
        useMediaQuery,
        Grid,
        Fade,
} from '@mui/material';
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
                const dataPoints = {};

                const processDate = (dateString) => {
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
                                labels: {
                                        font: {
                                                size: isMobile ? 10 : 12,
                                                family: theme.typography.fontFamily,
                                        },
                                        color: theme.palette.text.primary,
                                },
                        },
                        title: {
                                display: true,
                                text: 'Portfolio Performance',
                                font: {
                                        size: isMobile ? 16 : 20,
                                        weight: 'bold',
                                        family: theme.typography.fontFamily,
                                },
                                color: theme.palette.primary.main,
                        },
                        tooltip: {
                                callbacks: {
                                        label: (context) => `$${context.parsed.y.toFixed(2)}`,
                                },
                                backgroundColor: theme.palette.background.paper,
                                titleColor: theme.palette.text.primary,
                                bodyColor: theme.palette.text.secondary,
                                borderColor: theme.palette.divider,
                                borderWidth: 1,
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
                                                family: theme.typography.fontFamily,
                                        },
                                        color: theme.palette.text.secondary,
                                },
                                ticks: {
                                        maxRotation: 45,
                                        minRotation: 45,
                                        font: {
                                                size: isMobile ? 10 : 12,
                                                family: theme.typography.fontFamily,
                                        },
                                        color: theme.palette.text.secondary,
                                },
                                grid: {
                                        color: theme.palette.divider,
                                },
                        },
                        y: {
                                title: {
                                        display: true,
                                        text: 'Portfolio Value ($)',
                                        font: {
                                                size: isMobile ? 12 : 14,
                                                weight: 'bold',
                                                family: theme.typography.fontFamily,
                                        },
                                        color: theme.palette.text.secondary,
                                },
                                ticks: {
                                        callback: (value) => `$${value.toLocaleString()}`,
                                        font: {
                                                size: isMobile ? 10 : 12,
                                                family: theme.typography.fontFamily,
                                        },
                                        color: theme.palette.text.secondary,
                                },
                                beginAtZero: true,
                                grid: {
                                        color: theme.palette.divider,
                                },
                        },
                },
        };

        if (investmentsLoading || transactionsLoading) {
                return (
                        <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minHeight="400px"
                                bgcolor="background.paper"
                        >
                                <CircularProgress color="primary" />
                        </Box>
                );
        }

        if (investmentsError || transactionsError) {
                return (
                        <Fade in={true}>
                                <Paper
                                        elevation={3}
                                        sx={{
                                                p: 3,
                                                bgcolor: 'error.light',
                                                color: 'error.contrastText',
                                                width: '100%',
                                                maxWidth: 800,
                                                margin: 'auto',
                                        }}
                                >
                                        <Typography variant="h6" gutterBottom>
                                                Error loading data
                                        </Typography>
                                        <Typography>
                                                {investmentsError?.message ||
                                                        transactionsError?.message}
                                        </Typography>
                                </Paper>
                        </Fade>
                );
        }

        if (!chartData) {
                return (
                        <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minHeight="400px"
                                bgcolor="background.paper"
                        >
                                <Typography variant="body1" color="text.secondary">
                                        Processing data...
                                </Typography>
                        </Box>
                );
        }

        if (chartData.labels.length === 0) {
                return (
                        <Fade in={true}>
                                <Paper
                                        elevation={3}
                                        sx={{
                                                p: 3,
                                                width: '100%',
                                                maxWidth: 800,
                                                margin: 'auto',
                                                bgcolor: 'background.paper',
                                        }}
                                >
                                        <Typography variant="h6" gutterBottom color="text.primary">
                                                No data available
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                                There is no investment or transaction data to
                                                display in the chart.
                                        </Typography>
                                </Paper>
                        </Fade>
                );
        }

        return (
                <Fade in={true}>
                        <Grid
                                container
                                spacing={2}
                                sx={{
                                        width: '100%',
                                        maxWidth: 800,
                                        margin: 'auto',
                                }}
                        >
                                <Grid item xs={12}>
                                        <Paper
                                                elevation={3}
                                                sx={{
                                                        p: 3,
                                                        width: '100%',
                                                        maxWidth: 800,
                                                        margin: 'auto',
                                                        bgcolor: 'background.paper',
                                                }}
                                        >
                                                <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        mb={2}
                                                >
                                                        <ShowChartIcon
                                                                sx={{
                                                                        fontSize: 28,
                                                                        color: 'primary.main',
                                                                        mr: 1,
                                                                }}
                                                        />
                                                        <Typography
                                                                variant="h5"
                                                                color="primary.main"
                                                                fontWeight="bold"
                                                        >
                                                                Portfolio Performance
                                                        </Typography>
                                                </Box>
                                                <Box
                                                        sx={{
                                                                height: isMobile ? 300 : 400,
                                                        }}
                                                >
                                                        <Line
                                                                data={chartData}
                                                                options={chartOptions}
                                                        />
                                                </Box>
                                        </Paper>
                                </Grid>
                        </Grid>
                </Fade>
        );
};

export default InvestmentChart;