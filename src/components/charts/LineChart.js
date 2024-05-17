import React from 'react';
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

export default function LineChart({title, data}) {

    const d = Object.entries(data).map(([date, value]) => ({date, value: parseInt(value)}));

    return (
        <div className="flex justify-center w-full">
            <Line
                data={{
                    labels: d.map(({date}) => new Date(date).toLocaleDateString('km-KH', {
                        month: 'short',
                        day: 'numeric',
                    })),
                    datasets: [
                        {
                            label: 'ចំនួនលក់សរុប',
                            data: d.map(({value}) => value),
                            borderColor: '#32a852',
                            backgroundColor: 'rgba(50, 168, 82, 0.2)',
                            tension: 0.3,
                        }
                    ]
                }}
                options={{
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: false,
                                text: 'ថ្ងៃ',
                            }
                        },
                        y: {
                            title: {
                                display: false,
                                text: 'ចំនួនលក់',
                            },
                            ticks: {
                                beginAtZero: true,
                                stepSize: 100
                            }
                        }
                    }
                }}
            />
        </div>
    );
}