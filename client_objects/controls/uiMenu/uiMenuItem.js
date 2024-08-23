class uiMenuItem {
    inMenu = null;
    menuID = 0;
    parent_menu_id=0;

    parent=null;
    children = [];
    
    iconClass = null;
    iconText = null;
    name = "";

    panel = null;
    panel_parameters = "";
    external_link = null;

    domLI = null;
    domLink = null;
    domSubMenu = null;

    constructor(inData) {
        if (inData) {
            if (inData.menuID) {
                this.menuID=`M${inData.menuID}`;
            } else {
                this.menuID = `C${inData.categoryID}`;
            }
            this.menuID=inData.menuID;
            this.parent_menu_id = (inData.parent_menu_id||0);
            this.iconClass = (inData.iconClass||'');
            this.iconText = (inData.iconText||'');
            this.name = inData.name;
            this.panel = (inData.panel||null);
            this.panel_parameters = (inData.panel_parameters||null);
            this.external_link = (inData.external_link||null);
            this.isSelected = (inData.isSelected||false);
			if (this.iconClass===''&&this.iconText==='') this.iconText=this.name[0];
            if (!this.menuID) {
                throw new Error("Menu Item ID is required but missing.");
            }
            if (!this.name) {
                throw new Error("Display Text is required but missing.");
            }
        }
    }
    renderItem() {
        
        //Every entry consists of a <li> with and <a> in it.
        //Inside the <a> is and icon <i> or small text <span class="sidebar-mini-icon">
        
        
        this.domLI = document.createElement("li");
        if (this.isSelected) this.domLI.classList.add("active");
        if (this.isSelected&&this.children.length===0) this.domLI.classList.add("activetick")
		this.domLink = document.createElement("a");
        this.domLI.appendChild(this.domLink)
        
        //Detemine what goes in the icon area
        let itemIcon = null;
        if (this.iconClass!=='') {
			itemIcon = document.createElement("i");
            this.iconClass.split(' ').forEach(element => {
                itemIcon.classList.add(element);
            });            
		} else {
            itemIcon = document.createElement("span");
            itemIcon.classList.add("text-icon");
            itemIcon.innerHTML=this.iconText;
		}
		this.domLink.appendChild(itemIcon);

        let itemText = null;
        if (this.parent) { //This is for a child element
            itemText = document.createElement("span");
            itemText.classList.add("normal");
        } else { //This is for the root elements
            itemText = document.createElement("p");
        }
        itemText.innerHTML=this.name;
        this.domLink.appendChild(itemText);

        if (this.children.length>0) {
            //Configure the link to have the class for collapsing
            this.domLink.classList.add("collapsable");
            if (!this.isSelected) this.domLink.classList.add("collapsed");            

            //Configure the click Action to collapse/expand
            this.domLink.addEventListener("click", function(e) {
                e.currentTarget.classList.toggle("collapsed");                
            }.bind(this));
            
            //Add the caret to indicate expanded/collapsed
            let itemCaret = document.createElement("b");
            itemCaret.classList.add("caret");
            itemText.appendChild(itemCaret);

            //Create the submenu
            this.domSubMenu = document.createElement("ul");
            this.domSubMenu.classList.add("sub");
            for (var idx in this.children)
				this.domSubMenu.appendChild(this.children[idx].renderItem());
            this.domLI.appendChild(this.domSubMenu);


        } else {
            this.domLink.addEventListener("click", function(e) {
                this.inMenu.setSelectedItem(this.menuID);
            }.bind(this));
        }


        //Configure the click action
        

        return this.domLI;

		if (this.children.length>0) {
			//Check if selected and add Collapse class to the div if not.
			myHTML+='<div class="'+collapsedClass+'" id="M'+this.menuID+'"><ul class="nav" style="background-color: #FFFFFF11">';
			for (var idx in this.children)
				myHTML+=this.children[idx].renderItem();
			myHTML+='</ul></div>';
		}
        myHTML+='</li>';
        return myHTML
    }
    executeMenu() {
        console.log("Ran menu item "+this.name);
    }
}
