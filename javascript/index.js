document.addEventListener("DOMContentLoaded", function() {

    const canvas = document.getElementById('growthChart');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(89, 152, 214, 0.2)'); // Light blue using #5998D6
        gradient.addColorStop(1, 'rgba(89, 152, 214, 0)');   

        const growthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Nov 23', '24', '25', '26', '27', '28', '29', '30'],
                datasets: [{
                    label: 'Growth',
                    data: [26000, 27000, 31000, 29000, 35000, 39000, 36000, 48000],
                    borderColor: '#5998D6', // Updated to new blue
                    backgroundColor: gradient,
                    borderWidth: 3,
                    pointBackgroundColor: '#5998D6', // Updated to new blue
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: function(context) {
                        return context.dataIndex === context.dataset.data.length - 1 ? 6 : 0;
                    },
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 25000,
                        max: 50000,
                        ticks: {
                            stepSize: 5000,
                            callback: function(value) {
                                return '$' + (value / 1000) + 'K';
                            },
                            font: {
                                size: 10,
                                family: "'Inter', sans-serif"
                            },
                            color: '#999'
                        },
                        grid: {
                            color: '#f0f0f0',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 10,
                                family: "'Inter', sans-serif"
                            },
                            color: '#999'
                        }
                    }
                }
            }
        });
    }

    const currentPath = window.location.pathname.split("/").pop();
    const dockItems = document.querySelectorAll(".dock-item");

    if (dockItems.length > 0) {
        dockItems.forEach(item => {
            item.classList.remove("active");
            
            const itemHref = item.getAttribute("href");
            
            if (itemHref === currentPath || (currentPath === "" && itemHref === "index.html")) {
                item.classList.add("active");
            }
        });
    }
});