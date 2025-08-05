// Food Categories based on Anuga Trade Shows
export interface FoodCategory {
    id: string;
    name: string;
    description: string;
    subCategories: FoodSubCategory[];
}

export interface FoodSubCategory {
    id: string;
    name: string;
    description: string;
}

export const ANUGA_FOOD_CATEGORIES: FoodCategory[] = [
    {
        id: 'alternatives',
        name: 'Alternatives',
        description: 'Alternative and innovative food products',
        subCategories: [
            { id: 'plant-based', name: 'Plant-based Products', description: 'Meat and dairy alternatives' },
            { id: 'vegan', name: 'Vegan Products', description: 'Completely plant-based foods' },
            { id: 'gluten-free', name: 'Gluten-free', description: 'Products without gluten' },
            { id: 'alternative-protein', name: 'Alternative Proteins', description: 'Insect protein, algae, etc.' },
            { id: 'functional-foods', name: 'Functional Foods', description: 'Foods with health benefits' },
            { id: 'superfood', name: 'Superfood', description: 'Nutrient-dense foods' }
        ]
    },
    {
        id: 'bread-bakery',
        name: 'Bread & Bakery',
        description: 'Bread, bakery products and baking ingredients',
        subCategories: [
            { id: 'fresh-bread', name: 'Fresh Bread', description: 'Daily baked bread products' },
            { id: 'pastries', name: 'Pastries', description: 'Sweet and savory pastries' },
            { id: 'cakes', name: 'Cakes & Desserts', description: 'Baked desserts and celebration cakes' },
            { id: 'cookies', name: 'Cookies & Biscuits', description: 'Sweet and savory biscuits' },
            { id: 'artisan-bread', name: 'Artisan Bread', description: 'Specialty and craft breads' },
            { id: 'baking-ingredients', name: 'Baking Ingredients', description: 'Flour, yeast, and baking supplies' }
        ]
    },
    {
        id: 'chilled-fresh',
        name: 'Chilled & Fresh',
        description: 'Fresh and chilled food products',
        subCategories: [
            { id: 'fresh-vegetables', name: 'Fresh Vegetables', description: 'Seasonal fresh vegetables' },
            { id: 'fresh-fruits', name: 'Fresh Fruits', description: 'Seasonal fresh fruits' },
            { id: 'salads', name: 'Ready-to-eat Salads', description: 'Pre-prepared fresh salads' },
            { id: 'herbs', name: 'Fresh Herbs', description: 'Culinary herbs and spices' },
            { id: 'prepared-meals', name: 'Prepared Meals', description: 'Ready-to-eat fresh meals' },
            { id: 'deli-products', name: 'Deli Products', description: 'Fresh deli and specialty items' }
        ]
    },
    {
        id: 'dairy',
        name: 'Dairy',
        description: 'Dairy products and milk-based items',
        subCategories: [
            { id: 'milk', name: 'Milk Products', description: 'Fresh milk and milk drinks' },
            { id: 'cheese', name: 'Cheese', description: 'Various types of cheese' },
            { id: 'yogurt', name: 'Yogurt', description: 'Yogurt and fermented dairy' },
            { id: 'butter', name: 'Butter & Spreads', description: 'Butter and dairy spreads' },
            { id: 'cream', name: 'Cream Products', description: 'Cooking cream and dessert cream' },
            { id: 'ice-cream', name: 'Ice Cream', description: 'Frozen dairy desserts' }
        ]
    },
    {
        id: 'drinks',
        name: 'Drinks',
        description: 'Beverages and drink products',
        subCategories: [
            { id: 'soft-drinks', name: 'Soft Drinks', description: 'Carbonated and non-carbonated drinks' },
            { id: 'juices', name: 'Juices & Smoothies', description: 'Fruit and vegetable juices' },
            { id: 'water', name: 'Water', description: 'Bottled and flavored water' },
            { id: 'energy-drinks', name: 'Energy Drinks', description: 'Sports and energy beverages' },
            { id: 'alcoholic', name: 'Alcoholic Beverages', description: 'Wine, beer, and spirits' },
            { id: 'specialty-drinks', name: 'Specialty Drinks', description: 'Unique and craft beverages' }
        ]
    },
    {
        id: 'fine-food',
        name: 'Fine Food',
        description: 'Gourmet and specialty food products',
        subCategories: [
            { id: 'gourmet', name: 'Gourmet Products', description: 'High-end specialty foods' },
            { id: 'delicatessen', name: 'Delicatessen', description: 'Premium deli items' },
            { id: 'condiments', name: 'Condiments & Sauces', description: 'Specialty sauces and condiments' },
            { id: 'preserves', name: 'Jams & Preserves', description: 'Artisan jams and preserves' },
            { id: 'oils-vinegars', name: 'Oils & Vinegars', description: 'Premium cooking oils and vinegars' },
            { id: 'specialty-ingredients', name: 'Specialty Ingredients', description: 'Unique cooking ingredients' }
        ]
    },
    {
        id: 'frozen-food',
        name: 'Frozen Food',
        description: 'Frozen food products and ingredients',
        subCategories: [
            { id: 'frozen-meals', name: 'Frozen Meals', description: 'Complete frozen dinner meals' },
            { id: 'frozen-vegetables', name: 'Frozen Vegetables', description: 'Frozen vegetable products' },
            { id: 'frozen-fruits', name: 'Frozen Fruits', description: 'Frozen fruit products' },
            { id: 'frozen-seafood', name: 'Frozen Seafood', description: 'Frozen fish and seafood' },
            { id: 'frozen-desserts', name: 'Frozen Desserts', description: 'Frozen sweet treats' },
            { id: 'frozen-bakery', name: 'Frozen Bakery', description: 'Frozen bread and pastries' }
        ]
    },
    {
        id: 'hot-beverages',
        name: 'Hot Beverages',
        description: 'Coffee, tea and hot drink products',
        subCategories: [
            { id: 'coffee', name: 'Coffee', description: 'Coffee beans, ground coffee, instant coffee' },
            { id: 'tea', name: 'Tea', description: 'Various types of tea' },
            { id: 'hot-chocolate', name: 'Hot Chocolate', description: 'Cocoa and hot chocolate products' },
            { id: 'specialty-hot-drinks', name: 'Specialty Hot Drinks', description: 'Unique hot beverage blends' },
            { id: 'coffee-accessories', name: 'Coffee Accessories', description: 'Coffee-making equipment and supplies' },
            { id: 'tea-accessories', name: 'Tea Accessories', description: 'Tea-making equipment and supplies' }
        ]
    },
    {
        id: 'meat',
        name: 'Meat',
        description: 'Meat products and meat alternatives',
        subCategories: [
            { id: 'fresh-meat', name: 'Fresh Meat', description: 'Fresh beef, pork, lamb, and poultry' },
            { id: 'processed-meat', name: 'Processed Meat', description: 'Sausages, deli meats, and cured products' },
            { id: 'seafood', name: 'Seafood', description: 'Fresh and processed seafood products' },
            { id: 'poultry', name: 'Poultry', description: 'Chicken, turkey, and other poultry' },
            { id: 'game-meat', name: 'Game Meat', description: 'Wild game and specialty meats' },
            { id: 'meat-snacks', name: 'Meat Snacks', description: 'Jerky, dried meats, and meat-based snacks' }
        ]
    },
    {
        id: 'organic',
        name: 'Organic',
        description: 'Certified organic food products',
        subCategories: [
            { id: 'organic-produce', name: 'Organic Produce', description: 'Certified organic fruits and vegetables' },
            { id: 'organic-dairy', name: 'Organic Dairy', description: 'Organic milk, cheese, and dairy products' },
            { id: 'organic-meat', name: 'Organic Meat', description: 'Organic and grass-fed meat products' },
            { id: 'organic-packaged', name: 'Organic Packaged Foods', description: 'Packaged organic food products' },
            { id: 'organic-beverages', name: 'Organic Beverages', description: 'Organic drinks and juices' },
            { id: 'organic-baby-food', name: 'Organic Baby Food', description: 'Organic products for infants and children' }
        ]
    }
];

// Helper function to get subcategories by category ID
export const getSubCategoriesByCategoryId = (categoryId: string): FoodSubCategory[] => {
    const category = ANUGA_FOOD_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.subCategories : [];
};

// Helper function to get category by ID
export const getCategoryById = (categoryId: string): FoodCategory | undefined => {
    return ANUGA_FOOD_CATEGORIES.find(cat => cat.id === categoryId);
};

// Helper function to get subcategory by ID
export const getSubCategoryById = (categoryId: string, subCategoryId: string): FoodSubCategory | undefined => {
    const subCategories = getSubCategoriesByCategoryId(categoryId);
    return subCategories.find(sub => sub.id === subCategoryId);
};