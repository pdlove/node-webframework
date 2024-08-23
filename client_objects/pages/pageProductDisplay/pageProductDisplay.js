class pageProductDisplay {
    rowsByID = {};
    rootRows = [];
    uiTableDOM = null;
    selectedRowID = null;

    async setParameters(parameters) {
        try {
            if (!parameters) parameters={};
            if (!parameters.apiCategories) parameters.apiCategories = await API.getAPIData('ui/categories/products');
            if (!parameters.apiProducts) parameters.apiProducts = await API.getAPIData('pos/products');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
        try {
            this.rowsByID = {};
            this.rootRows = this.#buildTree(parameters.apiCategories, null); //Start with the null parent and go out from there. This creates rows from the categories.
            parameters.apiProducts.forEach(function(product) {
                let myrow = new uiTableRow();
                let myParent = this.rowsByID[product.categoryID*-1];
                myrow.rowID = product.productID;
                myrow.rowData = product;
                myrow.rowType = 'Product';
                if (myParent) {
                    myrow.parentRowID = myParent.rowID;
                    myParent.childRowIDs.push(myrow.rowID);
                } else {
                    myrow.parentRowID = null;
                    this.rootRows.push(myrow.rowID);
                }
                this.rowsByID[myrow.rowID]=myrow;
            }.bind(this))
        } catch (error) {
            console.error('Error Building the Dataset:', error);
        }
    }
    async renderDOM(destDOM) {
        destDOM.innerHTML='';
        //this.renderHTML(destDOM);
    }


    #buildTree(apiCategories, parentCategoryID = null) {
        let newIDs = [];
        apiCategories.forEach(function(category) {
            if (category.parent_categoryID === parentCategoryID) {
                let myrow = new uiTableRow();
                myrow.rowID = category.categoryID*-1;
                myrow.rowType = 'Category';
                myrow.parentRowID = parentCategoryID;
                myrow.rowData = category;
                this.rowsByID[myrow.rowID]=myrow;
                myrow.childRowIDs = this.#buildTree(apiCategories, category.categoryID)
                newIDs.push(myrow.rowID);
            }
        }.bind(this))
        return newIDs
    }
}

