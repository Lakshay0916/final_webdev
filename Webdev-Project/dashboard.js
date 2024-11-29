// Global variable to store the loaded data
let organData = null;

// Load the organ data
async function loadOrganData() {
    try {
        const response = await fetch('organ-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        organData = await response.json();
        // Initialize the default tab after data is loaded
        updateOrganContent('heart');
    } catch (error) {
        console.error('Error loading organ data:', error);
        showErrorMessage('Failed to load organ data. Please try again later.');
    }
}

// Error message display function
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'warning-box';
    errorDiv.innerHTML = `<h4>⚠️ Error</h4><p>${message}</p>`;
    document.querySelector('.main-content').prepend(errorDiv);
}

// Event listeners for tab switching
document.querySelectorAll('.record-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        if (!organData) return; // Prevent switching if data isn't loaded

        // Update tab styles
        document.querySelector('.record-tab.active').classList.remove('active');
        tab.classList.add('active');

        // Show corresponding content
        const organ = tab.dataset.organ;
        document.querySelector('.organ-content.active').classList.remove('active');
        document.getElementById(`${organ}-content`).classList.add('active');

        // Update content and initialize charts
        updateOrganContent(organ);
    });
});

function updateOrganContent(organ) {
    if (!organData || !organData[organ]) return;

    const data = organData[organ];
    const content = document.getElementById(`${organ}-content`);

    // Update organ icon and scan information
    content.querySelector('.placeholder-img').textContent = data.icon;
    content.querySelector('.organ-visual h3').textContent = data.scanType;
    content.querySelector('.scan-image').textContent = data.scanLabel;

    // Update metrics and initialize charts
    updateMetrics(organ, data);
}

function updateMetrics(organ, data) {
    const content = document.getElementById(`${organ}-content`);
    
    // Clear existing charts
    Chart.helpers.each(Chart.instances, (instance) => {
        instance.destroy();
    });

    // Update metrics based on organ type
    switch(organ) {
        case 'heart':
            updateHeartMetrics(content, data);
            break;
        case 'brain':
            updateBrainMetrics(content, data);
            break;
        case 'kidney':
            updateKidneyMetrics(content, data);
            break;
        case 'eyes':
            updateEyeMetrics(content, data);
            break;
    }
}

function createChart(ctx, chartData) {
    return new Chart(ctx, {
        type: chartData.type,
        data: {
            labels: chartData.labels,
            datasets: [{
                label: chartData.label,
                data: chartData.data,
                borderColor: '#45B1A8',
                backgroundColor: '#45B1A8',
                tension: chartData.type === 'line' ? 0.4 : 0,
                fill: false,
                borderRadius: chartData.type === 'bar' ? 5 : 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: chartData.yAxisMin === 0,
                    min: chartData.yAxisMin,
                    max: chartData.yAxisMax
                }
            }
        }
    });
}

function updateHeartMetrics(content, data) {
    const ctx = content.querySelector('#heartRateChart').getContext('2d');
    createChart(ctx, data.metrics.heartRate.chartData);
    
    // Update other metrics
    content.querySelector('.stat-box:nth-child(2) p').textContent = data.metrics.bloodPressure.value;
    content.querySelector('.stat-box:nth-child(3) p').textContent = data.metrics.pulse.value;
    
    // Update foods to avoid
    const foodsGrid = content.querySelector('.foods-grid');
    foodsGrid.innerHTML = data.foodsToAvoid.map(food => `
        <div class="food-item">
            <div class="placeholder-img">${food.icon}</div>
            <p>${food.name}</p>
        </div>
    `).join('');
}

function updateBrainMetrics(content, data) {
    const ctx = content.querySelector('#brainActivityChart').getContext('2d');
    createChart(ctx, data.metrics.neuralActivity.chartData);
    
    // Update cognitive tests
    const cognitiveTests = content.querySelector('.stat-box:nth-child(2)');
    cognitiveTests.innerHTML = `
        <h3>${data.metrics.cognitiveTests.title}</h3>
        ${data.metrics.cognitiveTests.values.map(test => `
            <p>${test.label}: ${test.value}</p>
        `).join('')}
    `;
    
    // Update sleep quality
    const sleepQuality = content.querySelector('.stat-box:nth-child(3)');
    sleepQuality.innerHTML = `
        <h3>${data.metrics.sleepQuality.title}</h3>
        ${data.metrics.sleepQuality.values.map(item => `
            <p>${item.label}: ${item.value}</p>
        `).join('')}
    `;
    
    // Update recommendations
    const recommendations = content.querySelector('.warning-box');
    recommendations.innerHTML = `
        <h4>⚠️ Recommendations</h4>
        ${data.recommendations.map(rec => `<p>${rec}</p>`).join('')}
    `;
}

function updateKidneyMetrics(content, data) {
    const ctx = content.querySelector('#kidneyFunctionChart').getContext('2d');
    createChart(ctx, data.metrics.kidneyFunction.chartData);
    
    // Update measurements
    const metricsGrid = content.querySelector('.metrics-grid');
    metricsGrid.innerHTML = data.metrics.measurements.map(metric => `
        <div class="stat-box">
            <h3>${metric.title}</h3>
            <p>${metric.value}</p>
        </div>
    `).join('');
    
    // Update hydration status
    const hydrationBox = content.querySelector('.warning-box');
    hydrationBox.innerHTML = `
        <h4>💧 Hydration Status</h4>
        <p>Current: ${data.hydrationStatus.current}</p>
        <p>Recommendation: ${data.hydrationStatus.recommendation}</p>
    `;
}

function updateEyeMetrics(content, data) {
    const ctx = content.querySelector('#screenTimeChart').getContext('2d');
    createChart(ctx, data.metrics.screenTime.chartData);
    
    // Update vision metrics
    const metricsGrid = content.querySelector('.metrics-grid');
    metricsGrid.innerHTML = data.metrics.vision.map(metric => `
        <div class="stat-box">
            <h3>${metric.title}</h3>
            <p>${metric.value}</p>
        </div>
    `).join('');
    
    // Update eye care tips
    const tipsBox = content.querySelector('.warning-box');
    tipsBox.innerHTML = `
        <h4>👀 Eye Care Tips</h4>
        ${data.eyeCareTips.map(tip => `<p>${tip}</p>`).join('')}
    `;
}

// Load the data when the page loads
document.addEventListener('DOMContentLoaded', loadOrganData);

// Select the button element
const bookButton = document.querySelector('.book-btn');

// Add an event listener for the 'click' event
bookButton.addEventListener('click', () => {
    // Redirect to the booking page
    window.location.href = "doctor_aproval.html"; // Replace with your actual page URL
});
