var items = [];
var lastPrice = 0;  // Variável para rastrear o último preço
var lastQuantity = 0;  // Variável para rastrear o último estoque

function addPrice() {
    var priceInput = document.getElementById("price-input");
    var quantityInput = document.getElementById("quantity-input");
    var price = parseFloat(priceInput.value);
    var quantity = parseFloat(quantityInput.value);

    if (isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        return;
    }

    // Atualiza o histórico
    lastPrice = price;
    lastQuantity = quantity;

    var existingItem = items.find(function(item) {
        return item.price === price;
    });

    if (existingItem) {
        existingItem.quantity += quantity;
        updateItem(existingItem);
        updateHistory(price, quantity);
    } else {
        var item = {
            price: price,
            quantity: quantity
        };

        var insertIndex = 0;
        while (insertIndex < items.length && items[insertIndex].price <= price) {
            insertIndex++;
        }

        items.splice(insertIndex, 0, item);
        displayItem(item);
    }

    priceInput.value = "";
    quantityInput.value = "";
    priceInput.focus();

    calculateAverage();
    calculateTotalQuantity();
}

function handleKeyDown(event, nextElementId) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById(nextElementId).focus();
    }
}

function displayItem(item) {
    var tableBody = document.getElementById("items-body");
    var row = document.createElement("tr");
    row.setAttribute("data-price", item.price);
    var priceCell = document.createElement("td");
    priceCell.textContent = item.price.toFixed(2);
    var quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity.toFixed(2);
    var actionsCell = document.createElement("td");
    var deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function() {
        deleteItem(item);
    });
    actionsCell.appendChild(deleteButton);

    // Adicione uma célula vazia para a coluna "Histórico"
    var historyCell = document.createElement("td");
    
    row.appendChild(priceCell);
    row.appendChild(quantityCell);
    row.appendChild(actionsCell);
    row.appendChild(historyCell);

    var existingRows = tableBody.querySelectorAll("tr[data-price]");
    if (existingRows.length > 0) {
        var insertBeforeRow = null;
        for (var i = 0; i < existingRows.length; i++) {
            var existingPrice = parseFloat(existingRows[i].getAttribute("data-price"));
            if (item.price < existingPrice) {
                insertBeforeRow = existingRows[i];
                break;
            }
        }
        if (insertBeforeRow) {
            tableBody.insertBefore(row, insertBeforeRow);
        } else {
            tableBody.appendChild(row);
        }
    } else {
        tableBody.appendChild(row);
    }
}

function updateItem(item) {
    var row = document.querySelector("tr[data-price='" + item.price + "']");
    var quantityCell = row.querySelector("td:nth-child(2)");
    quantityCell.textContent = item.quantity.toFixed(2);
}

function updateHistory(price, quantity) {
    var historyCell = document.querySelector("tr[data-price='" + price + "'] td:nth-child(4)");
    historyCell.textContent = price.toFixed(2) + " - " + quantity.toFixed(2);
}

function deleteItem(item) {
    var index = items.indexOf(item);
    if (index !== -1) {
        items.splice(index, 1);
        var row = document.querySelector("tr[data-price='" + item.price + "']");
        row.remove();
        calculateAverage();
        calculateTotalQuantity();
    }
}

function calculateAverage() {
    var total = 0;
    var totalQuantity = 0;

    for (var i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
        totalQuantity += items[i].quantity;
    }

    var average = total / totalQuantity;
    var averageDisplay = document.getElementById("average");
    averageDisplay.textContent = average.toFixed(2);
}

function calculateTotalQuantity() {
    var totalQuantity = 0;

    for (var i = 0; i < items.length; i++) {
        totalQuantity += items[i].quantity;
    }

    var totalQuantityDisplay = document.getElementById("total-quantity");
    totalQuantityDisplay.textContent = totalQuantity;
}
