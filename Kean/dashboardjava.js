document.addEventListener('DOMContentLoaded', function () {
    const setIncomeBtn = document.getElementById('set-income-btn');
    const editIncomeBtn = document.getElementById('edit-income-btn');
    const inputSection = document.getElementById('input-section');
    const balanceSection = document.getElementById('balance-section');
    const balanceDisplay = document.getElementById('balance');
    const salaryDisplay = document.getElementById('salary');
    const inputBalance = document.getElementById('input-balance');
    const inputSalary = document.getElementById('input-salary');
    const overlay = document.getElementById('overlay'); // Get overlay

    let balance = 0;
    let salary = 0;

    setIncomeBtn.addEventListener('click', function () {
        balance = parseFloat(inputBalance.value) || 0;
        salary = parseFloat(inputSalary.value) || 0;

        // Hide error messages
        document.getElementById('balance-error').style.display = 'none';
        document.getElementById('salary-error').style.display = 'none';

        let validInput = true;

        if (isNaN(balance) || balance <= 0) {
            document.getElementById('balance-error').style.display = 'block';
            validInput = false;
        }
        if (isNaN(salary) || salary <= 0) {
            document.getElementById('salary-error').style.display = 'block';
            validInput = false;
        }

        if (validInput) {
            balanceDisplay.textContent = `₱${balance.toFixed(2)}`;
            salaryDisplay.textContent = `₱${salary.toFixed(2)}`;
            inputSection.style.display = 'none';
            balanceSection.style.display = 'block';
        }
    });

    editIncomeBtn.addEventListener('click', function () {
        inputBalance.value = balance.toFixed(2);
        inputSalary.value = salary.toFixed(2);
        inputSection.style.display = 'block';
        balanceSection.style.display = 'none';
    });

    const themeSwitch = document.getElementById('theme-switch');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const totalExpenseSection = document.getElementById('total-expense-section');
    const totalExpenseDisplay = document.getElementById('total-expense');

    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode'); // Make sure it matches the CSS class
    });

    addExpenseBtn.addEventListener('click', function () {
        const description = descriptionInput.value;
        const amount = parseFloat(amountInput.value);

        // Hide error messages
        document.getElementById('description-error').style.display = 'none';
        document.getElementById('amount-error').style.display = 'none';

        let validInput = true;

        if (!description) {
            document.getElementById('description-error').style.display = 'block';
            validInput = false;
        }
        if (isNaN(amount) || amount <= 0) {
            document.getElementById('amount-error').style.display = 'block';
            validInput = false;
        }

        if (validInput) {
            addExpense(description, amount);
            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    function addExpense(description, amount) {
        const row = document.createElement('tr');
        
        // Create and append columns (description, amount, date, actions)
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = description;

        const amountCell = document.createElement('td');
        amountCell.textContent = `₱${amount.toFixed(2)}`;

        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true // Use 12-hour format
        };
        const dateCreated = now.toLocaleString('en-US', options);

        const dateCell = document.createElement('td'); 
        dateCell.textContent = dateCreated;

        const actionsCell = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-button');
        const editIcon = document.createElement('img');
        editIcon.src = 'edit.png';
        editIcon.classList.add('icon');
        editBtn.appendChild(editIcon);
        editBtn.appendChild(document.createTextNode(' Edit'));

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-button');
        const deleteIcon = document.createElement('img');
        deleteIcon.src = 'delete.png';
        deleteIcon.classList.add('icon');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.appendChild(document.createTextNode(' Delete'));

        const paidBtn = document.createElement('button');
        paidBtn.classList.add('paid-button');
        const paidIcon = document.createElement('img');
        paidIcon.src = 'paid.png';
        paidIcon.classList.add('icon');
        paidBtn.appendChild(paidIcon);
        paidBtn.appendChild(document.createTextNode(' Paid'));

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        actionsCell.appendChild(paidBtn);

        row.appendChild(descriptionCell);
        row.appendChild(amountCell);
        row.appendChild(dateCell);
        row.appendChild(actionsCell);

        expenseList.appendChild(row);

        // Update the total when a new expense is added
        updateTotalExpense();

        editBtn.addEventListener('click', function () {
            const saveBtn = document.createElement('button');
            saveBtn.classList.add('save-button');

            const saveIcon = document.createElement('img');
            saveIcon.src = 'save.png';
            saveIcon.classList.add('icon');
            saveBtn.appendChild(saveIcon);
            saveBtn.appendChild(document.createTextNode(' Save'));

            const cancelBtn = document.createElement('button');
            cancelBtn.classList.add('cancel-button');

            const cancelIcon = document.createElement('img');
            cancelIcon.src = 'cancel.png';
            cancelIcon.classList.add('icon');
            cancelBtn.appendChild(cancelIcon);
            cancelBtn.appendChild(document.createTextNode(' Cancel'));

            actionsCell.replaceChild(saveBtn, editBtn);
            actionsCell.appendChild(cancelBtn);

            const descriptionInput = document.createElement('input');
            descriptionInput.type = 'text';
            descriptionInput.value = descriptionCell.textContent;
            descriptionCell.textContent = '';
            descriptionCell.appendChild(descriptionInput);

            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.value = amountCell.textContent.slice(1);
            amountCell.textContent = '';
            amountCell.appendChild(amountInput);

            saveBtn.addEventListener('click', function () {
                descriptionCell.textContent = descriptionInput.value;
                amountCell.textContent = `₱${parseFloat(amountInput.value).toFixed(2)}`;
                actionsCell.replaceChild(editBtn, saveBtn);
                actionsCell.removeChild(cancelBtn);

                // Update the total after editing
                updateTotalExpense();
            });

            cancelBtn.addEventListener('click', function () {
                descriptionCell.textContent = description;
                amountCell.textContent = `₱${amount.toFixed(2)}`;
                actionsCell.replaceChild(editBtn, saveBtn);
                actionsCell.removeChild(cancelBtn);
            });
        });

        deleteBtn.addEventListener('click', function () {
            showNotification(`Are you sure you want to delete "${description}"?`, function () {
                // Remove the row and update the total
                expenseList.removeChild(row);
                updateTotalExpense();
            });
        });

        paidBtn.addEventListener('click', function () {
            showNotification(`Have you successfully paid "${description}"?`, function () {
                // Remove the row and update the total
                expenseList.removeChild(row);
                updateTotalExpense();
            });
        });
    }

    function showNotification(message, onConfirm) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const yesBtn = document.getElementById('yes-btn');
        const noBtn = document.getElementById('no-btn');

        notificationMessage.textContent = message;
        notification.style.display = 'flex';
        overlay.style.display = 'block'; // Show the overlay

        yesBtn.onclick = function () {
            onConfirm();
            closeNotification();
        };

        noBtn.onclick = function () {
            closeNotification();
        };
    }

    function closeNotification() {
        const notification = document.getElementById('notification');
        const overlay = document.getElementById('overlay');
        notification.style.display = 'none';
        overlay.style.display = 'none';
    }

    // Function to update the total expense
    function updateTotalExpense() {
        const rows = expenseList.getElementsByTagName('tr');
        let total = 0;

        for (let row of rows) {
            const amountCell = row.getElementsByTagName('td')[1];
            const amount = parseFloat(amountCell.textContent.slice(1));
            total += amount;
        }

        // If there are no expenses, hide the total section
        if (total > 0) {
            totalExpenseSection.style.display = 'block';
            totalExpenseDisplay.textContent = `₱${total.toFixed(2)}`;
        } else {
            totalExpenseSection.style.display = 'none';
        }
    }

    // Clock functionality
    function updateClock() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true // Set this to true for AM/PM format
        };
        const dateTimeString = now.toLocaleString('en-US', options);
        document.getElementById('clock').textContent = dateTimeString;
    }

    // Update the clock immediately and set an interval to update every second
    updateClock();
    setInterval(updateClock, 1000);
});
