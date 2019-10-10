// Storage 
const StorageCtrl = (function() {



    //Public methods
    return {
        storeItem: function(item) {
            let items;
            
            //Check if any items in ls
            if(localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                
                //set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));

                items.push(item);

                //Re set ls
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items; 
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

//Item controller

const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        //items: [],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            // Create ID
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number 
            calories = parseInt(calories);

            // Create new Item
            let newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id) {
            let found = null;
            //Loop through items
            data.items.forEach(item => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            // Calories to number 
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item => {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function(id) {
            // get the ids
            let ids = data.items.map(item => {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id); 

            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            //Loop through items and add cals
            data.items.forEach(item => {
                total += item.calories;
            }),

            data.totalCalories = total;

            return data.totalCalories;
        },

        logData: function() {
            return data;
        }
    }
})();

//UI controller

const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Public Methods
    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                        <strong>${item.name} : </strong><em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                        </li>`;
            });

            // Insert list Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //add ID
            li.id = `item-${item.id}`;

            // add HTML
            li.innerHTML = `<strong>${item.name} : </strong><em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                            </a>`;

            // insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                let itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name} : </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            document.getElementById('item-list').innerHTML = '';
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'block';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();

//App 

const App = (function(ItemCtrl, StorageCtrl ,UICtrl) {
    // loard event listteners 
    const loadEventListeners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter key
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event 
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // delete/clear all items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

        //Back Button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
    }

    //Add item submit
    const itemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        //check for name and calrie input
        if(input.name.trim() !== '' && input.calories.trim() !== '') {
            //Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // Add item to UI lsit
            UICtrl.addListItem(newItem);

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total Calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Store in LocalStorage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        } 

        e.preventDefault();
    }

    // Click edit on an item
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            // get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArr = listId.split('-');

            //get the actual id
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

           // Set current item
           ItemCtrl.setCurrentItem(itemToEdit);

           // Add item to form
           UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = function(e) {
        // get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update in UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total Calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();


        e.preventDefault();
    }

    const itemDeleteSubmit = function(e) {
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete item from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total Calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from localStorage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    //Clear items event
    const clearAllItemsClick = function() {
        //get total calories
        const totalCalories = 0//ItemCtrl.getTotalCalories();
        // Add total Calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        //Hide UL
        UICtrl.hideList();

        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        //Remove from UI
        UICtrl.removeItems();

        //Clear local storage
        StorageCtrl.clearItemsFromStorage()

    }

    // Public Methods
    return {
        init: function() {
            // Clear edit state / set initial state
            UICtrl.clearEditState();

            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //Populate list with items
                UICtrl.populateItemList(items);
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total Calories to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// initialize app
App.init();