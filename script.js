var items = [];
var lastPrice = 0;  // Variável para rastrear o último preço
var lastQuantity = 0;  // Variável para rastrear o último estoque
var initialStock = 0; // Estoques iniciais
var currentStock = 0; // Estoques atuais

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
    updateStockDisplay();
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
    priceCell.textContent = item.price;
    var quantityCell = document.createElement("td");
    quantityCell.textContent = item.quantity;
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
    quantityCell.textContent = item.quantity;
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
        updateStockDisplay();
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
    totalQuantityDisplay.textContent = totalQuantity.toFixed(3);
}

function updateStockDisplay() {
    var stockInput = document.getElementById("initial-stock-input");
    initialStock = parseFloat(stockInput.value);

    if (isNaN(initialStock) || initialStock < 0) {
        initialStock = 0;
        stockInput.value = 0;
    }

    currentStock = initialStock - getTotalQuantity();
    var stockInfo = document.getElementById("stock-info");
    stockInfo.textContent = "Estoque Restante: " + currentStock.toFixed(3);
}

function getTotalQuantity() {
    var totalQuantity = 0;

    for (var i = 0; i < items.length; i++) {
        totalQuantity += items[i].quantity;
    }

    return totalQuantity;
}
