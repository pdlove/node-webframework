class uiMenu {
    #flatData=null;
    #treeData=null;
    selectedItem=null;
    constructor(menuData) {
        if (menuData)
            this.loadData(menuData);
    }
    loadData(menuData) {
        this.#flatData={};
        for (var idx in menuData) {
            var newMenuItem = new uiMenuItem(menuData[idx]); 
            newMenuItem.inMenu = this; //This is so that the menu item can toggle the currently effective item.
            this.#flatData[newMenuItem.menuID]=newMenuItem;
        }
        this.#parseTreeFromFlat();
    }
    #parseTreeFromFlat() {
        this.#treeData=[];
        for (let idx in this.#flatData) {        
            var menuItem = this.#flatData[idx]; //Get the item
            var parentItem = this.#flatData[menuItem.parentID]; //Get the parent
            if (!menuItem.children) {
                menuItem.children=[];
            }
            
            if (parentItem) { //If there is a parent
                if (!parentItem.children) parentItem.children=[]; //Create Child Array If Needed
                parentItem.children.push(menuItem);
                menuItem.parent=parentItem;
                menuItem.isRoot=false;
            } else {
                this.#treeData.push(menuItem);
                menuItem.parent=null;
                menuItem.isRoot=true;
            }            
        }
        return;
    }
    renderHTML(destTag) {
        let rootMenu = document.createElement("ul");
        rootMenu.classList.add("nav");
        for (var idx in this.#treeData)
				rootMenu.appendChild(this.#treeData[idx].renderItem());
        if (destTag) {
            destTag.appendChild(rootMenu);
        }
		return rootMenu;		
    }
    setSelectedItem(id) {
        //Clear the flag on the selected item and all parents.
        let workItem = this.selectedItem
        while (workItem) {
            workItem.isSelected=false;
            if (workItem.domLI) {
                workItem.domLI.classList.remove("active");
                workItem.domLI.classList.remove("activetick");
                if (workItem.domLink.children.length>0) workItem.domLink.classList.add("collapsed");
            }

            workItem=workItem.parent;
        }

        //Set the flag on the new one and all parents
        this.selectedItem = this.#flatData[id];
        workItem = this.selectedItem
        if (workItem.domLI) workItem.domLI.classList.add("activetick"); //Only the actually selected item gets the tick.
        while (workItem) {
            workItem.isSelected=true;
            if (workItem.domLI) {
                workItem.domLI.classList.add("active");
                workItem.domLink.classList.remove("collapsed");
            }
            workItem=workItem.parent;
        }
    }
}
