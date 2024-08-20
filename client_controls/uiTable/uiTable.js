class uiTable {
    //Functionality
    allowSort = true;
    allowFilter = false; //Not Yet available
    addUndefinedColumns = true;
    
    //Data
    tableRows=[];
    allColumns={};
    displayColumns=[];
    indexField="";
    tableID="tbl1";
    sortColumns=[];
    sortDirections=[];
    sortMultiple=false;
    #domTable = null;
	#domTHead = null;
	#domTBody = null;
	
    constructor(options) {
    
    }
    addColumn(options, position) {
        if (options instanceof String || typeof options === "string") {
            //Only the name is passed
            options = {name: options};
        }   
        this.allColumns[options.name] = new uiTableColumn(options);     
    }
    setData(options) {
        this.tableRows=options;
    }
    addUpdateData(newData) {
        //This will add or update data
    }
    removeData(idx) {
        //value of the indexField to remove.
    }
    syncData(inArray) {
        //This will accept an array of rows.
        //New data will be added or updated

    }

    renderHTML(div) {
        //If There aren't any display columns dump all of them into the display.
        if (this.displayColumns.length===0)            
            for (var fieldname in this.allColumns)
                this.displayColumns.push(fieldname);

		this.#domTable = document.createElement("table");
        this.#domTable.classList.add("uiTable");
		
		this.#domTHead = document.createElement("thead");
		this.#domTable.appendChild(this.#domTHead);
		var domRow = document.createElement("tr");
		this.#domTHead.appendChild(domRow);
		for (var idx in this.displayColumns) {
            var col = this.allColumns[this.displayColumns[idx]]
            var domCol = document.createElement("th");
			domCol.innerHTML=col.caption;
			domCol.dataset.fieldName=col.name;
			domCol.dataset.sort=0;
            let fname = domCol.dataset.fieldName;
			domCol.addEventListener("click", this.headerClick.bind(this));
			domRow.appendChild(domCol);
            col.domCol=domCol;
        }

        this.#domTBody = document.createElement("tbody");
		this.#domTable.appendChild(this.#domTBody);
        for (var rowIdx=0;rowIdx<this.tableRows.length;rowIdx+=1) {
			domRow = document.createElement("tr");
			this.#domTBody.appendChild(domRow);
			
            for (var colIdx in this.displayColumns) {
                var col = this.allColumns[this.displayColumns[colIdx]]
				var domData = document.createElement("td");
				domData.innerHTML = col.renderHTML(this.tableRows[rowIdx])
			    domRow.appendChild(domData);
            }
            this.tableRows[rowIdx].domRow = domRow;
        }
		div.appendChild(this.#domTable);
        this.doSort();
        return true;
    }

    headerClick(e) {
        this.sortByColumn(e.target.dataset.fieldName, !e.ctrlKey);
    }
    
    sortByColumn(colName, singleCol) {        
        let sortColIdx = this.sortColumns.indexOf(colName);
        
        if ((sortColIdx<0 || this.sortColumns.length>1) && singleCol) {
            //For singleCol mode, clear the array if it is longer than 1 or if this column isn't in it.
            this.sortColumns=[];
            this.sortDirections=[];
            sortColIdx=-1;
        }

        if (sortColIdx<0)  {
            //If the column doesn't exist then add it with ascending order
            this.sortColumns.push(colName);
            this.sortDirections.push(1);
        } else {
            //The entry exists and we aren't in singleCol mode. Flip the flag
            this.sortDirections[sortColIdx]*=-1;
        }
        this.doSort();
	} 

    setSort(inValues) {
        this.sortColumns=[];
        this.sortDirections=[];
        if (typeof inValues == "string") {
            //A string is assumed to be a column name
            this.sortColumns.push(inValues);
            this.sortDirections.push(1);            
        } else {
            //Loop through the array
            for (let i=0;i<inValues.length;i++) {
                if (typeof inValues[i] == "string") {
                    //if the array is strings then it is column names.
                    this.sortColumns.push(inValues[i]);
                    this.sortDirections.push(1);                    
                } else {
                    //the elements should be arrays of [columnName,sortDirection]
                    this.sortColumns.push(inValues[i][0]);
                    this.sortDirections.push(inValues[i][1]);
                }
            }
        }        
    }

    doSort() {
        //Update all visible column Headers with the sorting order.
        for (let thisColName in this.allColumns) {
            let thisCol = this.allColumns[thisColName];
            if (thisCol.domCol != null) {
                let thisColOrder = this.sortColumns.indexOf(thisCol.name);
                if (thisColOrder<0) {
                    thisCol.domCol.classList.remove("asc");
                    thisCol.domCol.classList.remove("desc");            
                } else if (this.sortDirections[thisColOrder]>0) {
                    thisCol.domCol.classList.add("asc");
                    thisCol.domCol.classList.remove("desc");            
                } else {
                    thisCol.domCol.classList.remove("asc");
                    thisCol.domCol.classList.add("desc");            
                }
            }
        }

        //Sort the rows
        this.tableRows = this.tableRows.sort((a, b) => {
            for (let i=0; i<this.sortColumns.length; i++) {
                let sortedcol = this.allColumns[this.sortColumns[i]];
                let sortDirection = this.sortDirections[i];

                var value1 = sortedcol.getData(a); 
                var value2 = sortedcol.getData(b);

                if (value1<value2)
                    return -1*sortDirection;
                if (value1>value2)
                    return 1*sortDirection;            
            }
            return 0;
        });
        this.tableRows.forEach(row => this.#domTBody.appendChild(row.domRow));
    }
}

class uiTableColumn {
    isIndex;
    isVisible;
    name;
    order;
    
    type;
    caption;
    displayFormat;
    domCol = null;
    #formatOptions={};
    subObjectProperty;
    
    constructor(options) {
        if (typeof options === 'string' || options instanceof String) {
            this.name = options;
            this.isIndex = false;            
            this.isVisible = true;
            this.order = 0;
            this.type = "s";
            this.displayFormat = "";
            this.caption = this.name;
        } else {
            this.name = options.name; //Required fieldName
            this.isIndex = options.isIndex || false;
            this.isVisible = options.isVisible || true;
            this.order = options.order || 0;
            this.type = options.type || "s";
            this.displayFormat = options.displayFormat || "";
            this.caption = options.caption || this.name;
        }
        //Process if this is a subobject Property (Does not support arrays)
        this.subObjectProperty = this.name.split('.');
        
        //Need to process displayFormat to create the formatOptions object. This will vary base on datatype.
    }

    getData(obj) {
        var value = obj; 
        // Iterate over the properties to get the nested value
        for (var i = 0; i < this.subObjectProperty.length; i++) {
            if (value[this.subObjectProperty[i]] !== undefined) {
                value = value[this.subObjectProperty[i]];
            } else {
				value=null;
                break; //Propery not found
            }
        }
        return value;
    }
    renderHTML(obj) {
        var value = obj; 
        // Iterate over the properties to get the nested value
        for (var i = 0; i < this.subObjectProperty.length; i++) {
            if (value[this.subObjectProperty[i]] !== undefined) {
                value = value[this.subObjectProperty[i]];
            } else {
				value=null;
                break; //Propery not found
            }
        }

        
        if (this.type==="bool") {
            if (value)
                return '<input type="checkbox" checked>';
            else
                return '<input type="checkbox">';
        } else {
            //new Intl.NumberFormat("en-US", this.#formatOptions).format(1234567891.234567891);
            return value.toString();
        }
    }
}
