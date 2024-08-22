document.getElementById('productForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/pos/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Product created successfully!');
            this.reset();
        } else {
            const errorData = await response.json();
            alert('Error: ' + errorData.error);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});


document.addEventListener('DOMContentLoaded', async function() {
    const categorySelect = document.getElementById('category');

    try {
        const response = await fetch('/api/pos/categories');
        const categories = await response.json();
        
        if (response.ok) {
            const categoryTree = buildCategoryTree(categories);
            populateCategoryDropdown(categorySelect, categoryTree);
        } else {
            alert('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Error loading categories');
    }
});

function buildCategoryTree(categories, parentCategoryID = null) {
    const categoryTree = [];
    categories.forEach(category => {
        if (category.parent_categoryID === parentCategoryID) {
            const children = buildCategoryTree(categories, category.categoryID);
            if (children.length) {
                category.children = children;
            }
            categoryTree.push(category);
        }
    });
    return categoryTree;
}

function populateCategoryDropdown(selectElement, categoryTree, level = 0) {
    categoryTree.forEach(category => {
        const option = document.createElement('option');
        option.value = category.categoryID;
        option.text = '—'.repeat(level) + ' ' + category.name;
        selectElement.appendChild(option);

        if (category.children) {
            populateCategoryDropdown(selectElement, category.children, level + 1);
        }
    });
}
