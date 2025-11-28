// API Response Types
export interface Article {
    id: string;
    name: string;
    amountInStock: number;
}

export interface ProductArticle {
    id: string;
    amountRequired: number;
}

export interface Product {
    id: string;
    name: string;
    articles: ProductArticle[];
}

export interface Sale {
    id: string;
    createdAt: string;
    productId: string;
    amountSold: number;
}

// Extended types for UI
export interface ProductWithStock extends Product {
    maxAvailableQuantity: number;
    isAvailable: boolean;
}

export interface ArticleWithDetails extends ProductArticle {
    name: string;
    amountInStock: number;
}

export interface SaleWithProduct extends Sale {
    product: Product;
}

// API Error type
export interface ApiError {
    message: string;
    status?: number;
}
