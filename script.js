const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = document.querySelector("button");
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemFromStorage();

    itemsFromStorage.forEach((item) => {
        addItemToDOM(item);
    });

    checkUI();
}

function addItem(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate the input
    if (newItem === "") {
        alert("Please add an item");
        return;
    }

    // check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIIfItemExists(newItem)) {
            alert("Item already exists!");

            return;
        }
    }

    // create item to DOM element
    addItemToDOM(newItem);

    // Add item to localStorage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = "";
}

// creating list items and adding them to DOM

function addItemToDOM(item) {
    // create list item
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);

    // appending the li's  into the list item list
    itemList.appendChild(li);
}

function addItemToStorage(item) {
    // Applying the DRY concept
    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage.push(item);

    // Convert to JSON string AND set to localStorage

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

// creating the button
function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;

    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
}

// creating icon
function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

// setting the item to edit
function setItemToEdit(item) {
    isEditMode = true;

    // to unselect the gray effect from the item selection
    itemList
        .querySelectorAll("li")
        .forEach((i) => i.classList.remove("edit-mode"));

    item.classList.add("edit-mode");
    formBtn.innerHTML = '<i class=" fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = "#228B22";
    // getting the value in the input field
    itemInput.value = item.textContent;
}

function checkIIfItemExists(item) {
    const itemsInStorage = getItemFromStorage();

    return itemsInStorage.includes(item);
}

function removeItem(item) {
    if (confirm("Are you sure")) {
        // Remove item from DOM
        item.remove();

        // Remove item from localStorage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    // Filter out
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set the local Storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function clearAll(e) {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
        checkUI();
    }

    // Clearing from local storage
    localStorage.removeItem("items");
}

function filterItems(e) {
    const items = itemList.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

function checkUI() {
    itemInput.value = "";

    // checkUI() func is in global scope so we have to call it in all the functions
    const items = itemList.querySelectorAll("li");

    if (items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>Add Item';

    formBtn.style.backgroundColor = "#333";

    isEditMode = false;
}

// Event Listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", onClickItem);
clearBtn.addEventListener("click", clearAll);
itemFilter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems);

checkUI();
