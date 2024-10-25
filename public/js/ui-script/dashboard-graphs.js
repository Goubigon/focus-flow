
export function generateGraphByDate(duration, date, label, yText, chartType) {
    const ctx = document.getElementById('myChart').getContext('2d');

    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: date,
            datasets: [{
                label: label,
                data: duration,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true // Fill the area under the line
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Day',
                        font: {
                            weight: 'bold'
                        }

                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yText,
                        font: {
                            weight: 'bold'
                        }

                    },
                    beginAtZero: true,

                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

}


export function generateDoubleLineGraphByDate(val1, val2, date, yText) {
    const ctx = document.getElementById('myChart').getContext('2d');

    return new Chart(ctx, {
        type: 'line',

        data: {
            labels: date, // Labels for the bars
            datasets: [{
                label: 'Correct Answers',
                data: val1, // Data for correct answers
                backgroundColor: 'rgba(75, 192, 75, 0.2)', // Green for correct answers
                borderColor: 'rgba(75, 192, 75, 1)', // Dark green border for correct answers
                borderWidth: 1
            }, {
                label: 'Incorrect Answers',
                data: val2, // Data for incorrect answers
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red for incorrect answers
                borderColor: 'rgba(255, 99, 132, 1)', // Dark red border for incorrect answers
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Day',
                        font: {
                            weight: 'bold'
                        }

                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yText,
                        font: {
                            weight: 'bold'
                        }

                    },
                    beginAtZero: true,

                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

}


export function generateDoubleLineGraphByDateWithDuration(val1, val2, duration, date, yText) {
    const ctx = document.getElementById('myChart').getContext('2d');

    return new Chart(ctx, {
        type: 'line',

        data: {
            labels: date, // Labels for the bars
            datasets: [{
                label: 'Correct Answers',
                data: val1, // Data for correct answers
                backgroundColor: 'rgba(75, 192, 75, 0.2)', // Green for correct answers
                borderColor: 'rgba(75, 192, 75, 1)', // Dark green border for correct answers
                borderWidth: 5,
                yAxisID: 'y1',
            }, {
                label: 'Incorrect Answers',
                data: val2, // Data for incorrect answers
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red for incorrect answers
                borderColor: 'rgba(255, 99, 132, 1)', // Dark red border for incorrect answers
                borderWidth: 5,
                yAxisID: 'y1',
            }, {
                label: 'Duration (seconds)',
                data: duration, // Data for duration
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Blue for duration
                borderColor: 'rgba(54, 162, 235, 1)', // Dark blue border
                borderWidth: 1,
                yAxisID: 'y2',
                fill: true
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            weight: 'bold'
                        }

                    }
                },
                y1: {
                    type: 'linear',
                    position: 'left', // Primary y-axis on the left
                    title: {
                        display: true,
                        text: yText,
                        font: {
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                },
                y2: {
                    type: 'linear',
                    position: 'right', // Secondary y-axis on the right
                    title: {
                        display: true,
                        text: 'Duration (seconds)',
                        font: {
                            weight: 'bold'
                        }
                    },
                    beginAtZero: true,
                    grid: {
                        drawOnChartArea: false, // Prevent grid lines from overlapping
                    },
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: true
                }
            }
        }
    });

}

export function generateIsCorrectBarGraph(correct, incorrect) {
    const ctx = document.getElementById('myChart').getContext('2d');

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Correct', 'Incorrect'], // Labels for the bars
            datasets: [{
                data: [correct, incorrect], // Data for the bars
                backgroundColor: [
                    'rgba(75, 192, 75, 0.2)', // Green for Correct
                    'rgba(255, 99, 132, 0.2)' // Red for Incorrect
                ],
                borderColor: [
                    'rgba(75, 192, 75, 1)', // Dark green border for Correct
                    'rgba(255, 99, 132, 1)' // Dark red border for Incorrect
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Answers'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of answers'
                    },
                    beginAtZero: true
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            return `${tooltipItem.raw} answers`;
                        }
                    }
                }
            }
        }
    });



}
