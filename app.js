// Storage 

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
        items: [
            {id: 0, name: 'Riz', calories: 400},
            {id: 1, name: 'Pates', calories: 400},
            {id: 2, name: 'Pomme de Terre', calories: 400}

        ],
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
            data.items.push(newItem)
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
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
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
        getSelectors: function() {
            return UISelectors;
        }
    }
})();

//App 

const App = (function(ItemCtrl, UICtrl) {
    // loard event listteners 
    const loadEventListeners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    //Add item submit
    const itemAddSubmit = function(e) {
        // Get form input from UI Controller
        const input = UICtrl.getItemInput();

        //check for name and calrie input
        if(input.name.trim() !== '' && input.calories.match(/^\d{1,4}$/)) {
            //Add Item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
        } else {
            console.log('error')
        }


        e.preventDefault();
    }

    // Public Methods
    return {
        init: function() {
            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Populate list with items
            UICtrl.populateItemList(items);

            //Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

// initialize app
App.init();