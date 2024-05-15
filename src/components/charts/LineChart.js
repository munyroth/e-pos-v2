import React, {Component} from "react";
import Chart from "react-apexcharts";

class LineChart extends Component {

    render() {
        const data = Object.entries(this.props.data).map(([date, value]) => ({date, value: parseInt(value)}));
        let max = data.reduce((max, p) => p.value > max ? p.value : max, data[0]?.value);

        return (
            <div className="flex justify-center w-full">
                <Chart
                    series={[
                        {
                            name: "ថ្ងៃនេះ",
                            data: data.map(({value}) => value)
                        }
                    ]}
                    type="area"
                    options={
                        {
                            dataLabels: {
                                enabled: false
                            },
                            xaxis: {
                                axisBorder: {
                                    show: false
                                },
                                axisTicks: {
                                    show: false
                                },
                                categories: data.map(({date}) => date),
                            },
                            grid: {
                                strokeDashArray: 10
                            },
                            legend: {
                                position: 'top',
                                horizontalAlign: 'right',
                                floating: true,
                                offsetY: -40,
                                offsetX: -5
                            },
                            responsive: [
                                {
                                    breakpoint: 1600,
                                    options: {
                                        chart: {
                                            width: "1050",
                                            height: "300"
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
                                            width: "950",
                                            height: "300"
                                        },
                                    }
                                },
                                {
                                    breakpoint: 1300,
                                    options: {
                                        chart: {
                                            width: "900",
                                            height: "300"
                                        },
                                    }
                                },
                                {
                                    breakpoint: 1200,
                                    options: {
                                        chart: {
                                            width: "800",
                                            height: "300"
                                        },
                                    }
                                },
                                {
                                    breakpoint: 1100,
                                    options: {
                                        chart: {
                                            width: "700",
                                            height: "300"
                                        },
                                    }
                                },
                                {
                                    breakpoint: 1000,
                                    options: {
                                        chart: {
                                            width: "600",
                                            height: "300"
                                        },
                                    }
                                },
                                {
                                    breakpoint: 900,
                                    options: {
                                        chart: {
                                            width: "550",
                                            height: "300"
                                        },
                                    }
                                },
                            ],
                            fill: {
                                type: 'gradient',
                                gradient: {
                                    shadeIntensity: 1,
                                    opacityFrom: 0.4,
                                    opacityTo: 0.2,
                                    stops: [0, 90, 100]
                                }
                            },
                            markers: {
                                size: 4,
                                colors: ['#32a852'],
                                strokeWidth: 2,
                            },
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
                                    show: true
                                }
                            },
                            yaxis: {
                                tickAmount: 4,
                                min: 0,
                                max: max
                            },
                            stroke: {
                                curve: 'smooth',
                                width: 2,
                            },
                            colors: ['#32a852'],
                            // title: {
                            //     text: this.props.title,
                            //     style: {
                            //         fontSize: '18px',
                            //         fontWeight:  '700',
                            //         color:  '#111827'
                            //       },
                            // },
                            // theme: {
                            //     mode: 'light',
                            //     palette: 'palette1',
                            //     monochrome: {
                            //         enabled: false,
                            //         color: '#255aee',
                            //         shadeTo: 'light',
                            //         shadeIntensity: 0.65
                            //     },
                            // },
                        }
                    }
                />
            </div>
        );
    }
}

export default LineChart;