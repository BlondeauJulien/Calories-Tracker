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

        logData: function() {
            return data;
        }
    }
})();

//UI controller

const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list'
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
        }
    }
})();

//App 

const App = (function(ItemCtrl, UICtrl) {

    // Public Methods
    return {
        init: function() {
            //Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Populate list with items
            UICtrl.populateItemList(items);
        }
    }

})(ItemCtrl, UICtrl);

// initialize app
App.init();