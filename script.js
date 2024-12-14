// script.js
document.getElementById('budget-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const allowance = parseFloat(document.getElementById('allowance').value);
    const savingsGoal = parseFloat(document.getElementById('savings-goal').value);

    localStorage.setItem('allowance', allowance);
    localStorage.setItem('savingsGoal', savingsGoal);

    updateDashboard();
});

document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.push({ amount, category, type, date });
    localStorage.setItem('expenses', JSON.stringify(expenses));

    updateDashboard();
});

function updateDashboard() {
    const allowance = parseFloat(localStorage.getItem('allowance')) || 0;
    const savingsGoal = parseFloat(localStorage.getItem('savingsGoal')) || 0;
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const progress = ((allowance - totalExpenses) / savingsGoal) * 100;

    document.getElementById('total-income').textContent = allowance.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('goal-progress').textContent = `${Math.max(0, Math.min(100, progress.toFixed(2)))}%`;

    // Show financial tips based on progress
    const tipMessage = progress >= 50 ? 'Great job! Keep it up!' : 'Consider cutting back on some "wants" to save more.';
    document.getElementById('tip-message').textContent = tipMessage;

    // Calculate the total expenses for each category (Needs vs Wants)
    const categorizedExpenses = {
        needs: 0,
        wants: 0
    };

    expenses.forEach(expense => {
        if (expense.type === 'needs') {
            categorizedExpenses.needs += expense.amount;
        } else if (expense.type === 'wants') {
            categorizedExpenses.wants += expense.amount;
        }
    });

    // Create the chart data
    const chartData = {
        labels: ['Needs', 'Wants'],
        datasets: [{
            label: 'Expenses Breakdown',
            data: [categorizedExpenses.needs, categorizedExpenses.wants],
            backgroundColor: ['#4caf50', '#f44336'],
            borderColor: ['#4caf50', '#f44336'],
            borderWidth: 1
        }]
    };

    // Create the chart using Chart.js
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',  // You can change the chart type to 'bar' or 'line' as needed
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}
