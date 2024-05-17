import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const THEMES = {
    light: {
        borderColor: '#32a852',
        backgroundColor: 'rgba(50, 168, 82, 0.2)',
        titleColor: 'black',
    },
    dark: {
        borderColor: '#32a852',
        backgroundColor: 'rgba(50, 168, 82, 0.2)',
        titleColor: 'white',
    },
};

export default function LineChart({title, data}) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? DARK_THEME
        : LIGHT_THEME;

    const theme = THEMES[systemTheme];

    const formattedData = useMemo(() => {
        return Object.entries(data).map(([date, value]) => ({
            date: new Date(date).toLocaleDateString('km-KH', {
                month: 'short',
                day: 'numeric',
            }),
            value: parseInt(value, 10) || 0,
        }));
    }, [data]);

    const maxValue = useMemo(() => {
        return Math.max(...formattedData.map(({value}) => value));
    }, [formattedData]);

    const stepSize = useMemo(() => {
        return Math.ceil(maxValue * 0.1);
    }, [maxValue]);

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                },
                color: theme.titleColor,
            },
            legend: {
                display: true,
                position: 'bottom',
            },
        },
        responsive: true,
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'ថ្ងៃ',
                },
            },
            y: {
                title: {
                    display: false,
                    text: 'ចំនួនលក់',
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: stepSize,
                    min: 0,
                },
            },
        },
    };

    const chartData = {
        labels: formattedData.map(({date}) => date),
        datasets: [
            {
                label: 'ចំនួនលក់សរុប',
                data: formattedData.map(({value}) => value),
                borderColor: theme.borderColor,
                backgroundColor: theme.backgroundColor,
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="flex justify-center w-full">
            <Line data={chartData} options={chartOptions}/>
        </div>
    );
}

LineChart.propTypes = {
    title: PropTypes.string,
    data: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
};
