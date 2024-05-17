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
    },
    dark: {
        borderColor: '#32a852',
        backgroundColor: 'rgba(50, 168, 82, 0.2)',
    },
}
export default function LineChart({title, data}) {
    const systemTheme = useMemo(() => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? DARK_THEME
            : LIGHT_THEME;
    }, []);


    console.log(systemTheme);

    const formattedData = useMemo(() => {
        return Object.entries(data).map(([date, value]) => ({
            date: new Date(date).toLocaleDateString('km-KH', {
                month: 'short',
                day: 'numeric',
            }),
            value: parseInt(value, 10) || 0,
        }));
    }, [data]);

    const chartOptions = {
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 16,
                },
                color: systemTheme === DARK_THEME ? 'white' : 'black',
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
                    stepSize: 100,
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
                borderColor: '#32a852',
                backgroundColor: 'rgba(50, 168, 82, 0.2)',
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
