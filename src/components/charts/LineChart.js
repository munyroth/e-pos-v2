import React, {Component} from "react";
import Chart from "react-apexcharts";

class LineChart extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const data = Object.entries(this.props.data).map(([date, value]) => ({ date, value: parseInt(value) }));
        let max = data.reduce((max, p) => p.value > max ? p.value : max, data[0]?.value);

        return (
            <div className="flex justify-center w-full">
                
                <Chart
                    series={[
                        {
                            name: "ថ្ងៃនេះ",
                            data: data.map(({value }) => value)
                        }
                    ]}
                    type="area"
                    options={{
                        chart: {
                            type: "area",
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            foreColor: '#808080',
                            dropShadow: {
                                enabled: true,
                                color: ['#32a852'],
                                top: 5,
                                left: 5,
                                blur: 2,

                            },
                            zoom: {
                                enabled: false
                            },
                            toolbar: {
                                show: false
                            }
                        },
                        fill: {
                            type: 'gradient',
                            gradient: {
                                shadeIntensity: 1,
                                opacityFrom: 0.4,
                                opacityTo: 0.2,
                                stops: [0, 90, 100]
                            }
                        },
                        colors: ['#32a852'],
                        dataLabels: {
                            enabled: false
                        },
                        stroke: {
                            curve: 'smooth',
                            width: 2,
                        },
                        // title: {
                        //     text: this.props.title,
                        //     style: {
                        //         fontSize: '18px',
                        //         fontWeight:  '700',
                        //         color:  '#111827'
                        //       },
                        // },
                        grid: {
                            strokeDashArray: 10
                        },
                        markers: {
                            size: 1
                        },
                        xaxis: {
                            axisBorder: {
                                show: false
                            },
                            axisTicks: {
                                show: false
                            },
                            categories: data.map(({ date}) => date),
                        },
                        yaxis: {
                            tickAmount: 4,
                            min: 0,
                            max: max
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'right',
                            floating: true,
                            offsetY: -40,
                            offsetX: -5
                        },
                        theme: {
                            mode: 'light',
                            palette: 'palette1',
                            monochrome: {
                                enabled: false,
                                color: '#255aee',
                                shadeTo: 'light',
                                shadeIntensity: 0.65
                            },
                        },
                        responsive: [
                            {
                                breakpoint: 2000,
                                options: {
                                    chart: {
                                        width: "2000",
                                    },
                                }
                            },
                            {
                                breakpoint: 1900,
                                options: {
                                    chart: {
                                        width: "475",
                                    },
                                }
                            },
                            {
                                breakpoint: 1800,
                                options: {
                                    chart: {
                                        width: "450",
                                    },
                                }
                            },
                            {
                                breakpoint: 1700,
                                options: {
                                    chart: {
                                        width: "425",
                                    },
                                }
                            },
                            {
                                breakpoint: 1600,
                                options: {
                                    chart: {
                                        width: "390",
                                    },
                                }
                            },
                            {
                                breakpoint: 1500,
                                options: {
                                    chart: {
                                        width: "1000",
                                        height: "300"
                                    },
                                }
                            },
                            {
                                breakpoint: 1400,
                                options: {
                                    chart: {
                                        width: "330",
                                    },
                                }
                            },
                            {
                                breakpoint: 1300,
                                options: {
                                    chart: {
                                        width: "300",
                                    },
                                }
                            },
                            {
                                breakpoint: 1200,
                                options: {
                                    chart: {
                                        width: "200",
                                    },
                                }
                            },
                        ]
                    }}
                />
            </div>

        );
    }
}

export default LineChart;