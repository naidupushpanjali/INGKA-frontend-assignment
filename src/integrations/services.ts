import axios, { AxiosError } from "axios";
import { Product, Article, Sale, ApiError } from "../types";

const API_BASE_URL = "http://localhost:7000";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Utility function to handle retries for unreliable API
async function retryRequest<T>(
    request: () => Promise<T>,
    retries: number = MAX_RETRIES
): Promise<T> {
    try {
        return await request();
    } catch (error) {
        if (retries > 0 && axios.isAxiosError(error)) {
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            return retryRequest(request, retries - 1);
        }
        throw error;
    }
}

// Error handler
function handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return {
            message: axiosError.message || "An error occurred",
            status: axiosError.response?.status,
        };
    }
    return {
        message: error instanceof Error ? error.message : "Unknown error",
    };
}

// Get all artciles
export const getArticles = async (): Promise<Article[]> => {
    try {
        const response = await retryRequest(() =>
            axios.get<Article[]>(`${API_BASE_URL}/articles`)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Get single article by ID
export const getArticle = async (id: string): Promise<Article> => {
    try {
        const response = await retryRequest(() =>
            axios.get<Article>(`${API_BASE_URL}/articles/${id}`)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Update article stock
export const updateArticle = async (
    id: string,
    data: Partial<Article>
): Promise<Article> => {
    try {
        const response = await retryRequest(() =>
            axios.patch<Article>(`${API_BASE_URL}/articles/${id}`, data)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Bulk update articles
export const bulkUpdateArticles = async (
    articles: Array<{
        id: string;
        amountToSubtract?: number;
        amountInStock?: number;
    }>
): Promise<Article[]> => {
    try {
        const response = await retryRequest(() =>
            axios.patch<Article[]>(`${API_BASE_URL}/articles`, articles)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Get Products
export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await retryRequest(() =>
            axios.get<Product[]>(`${API_BASE_URL}/products`)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Get single product by ID
export const getProduct = async (id: string): Promise<Product> => {
    try {
        const response = await retryRequest(() =>
            axios.get<Product>(`${API_BASE_URL}/products/${id}`)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Get All Sales
export const getSales = async (): Promise<Sale[]> => {
    try {
        const response = await retryRequest(() =>
            axios.get<Sale[]>(`${API_BASE_URL}/sales`)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Get single Sale by ID
export const getSale = async (id: string): Promise<Sale[]> => {
    try {
        const response = await retryRequest(() =>
            axios.get<Sale[]>(`${API_BASE_URL}/sales/${id}`)
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Create a new sale
export const createSale = async (
    productId: string,
    amountSold: number
): Promise<Sale> => {
    try {
        const response = await retryRequest(() =>
            axios.post<Sale>(`${API_BASE_URL}/sales`, {
                productId,
                amountSold,
            })
        );
        return response.data;
    } catch (error) {
        throw handleError(error);
    }
};

// Delete a sale by ID
export const deleteSale = async (saleId: string): Promise<void> => {
    try {
        await retryRequest(() =>
            axios.delete(`${API_BASE_URL}/sales/${saleId}`)
        );
    } catch (error) {
        throw handleError(error);
    }
};
