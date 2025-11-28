import { useState, useEffect, useCallback } from "react";
import {
    getArticles,
    getProducts,
    getProduct,
    getSales,
    createSale,
    deleteSale,
    bulkUpdateArticles,
} from "../integrations/services";
import {
    Article,
    Product,
    ProductWithStock,
    ArticleWithDetails,
    SaleWithProduct,
    ApiError,
} from "../types";

interface InventoryState {
    products: ProductWithStock[];
    articles: Article[];
    loading: boolean;
    error: ApiError | null;
}

export const useInventory = () => {
    const [state, setState] = useState<InventoryState>({
        products: [],
        articles: [],
        loading: true,
        error: null,
    });

    // Calculate maximum available quantity for a product based on article stock
    const calculateMaxQuantity = useCallback(
        (product: Product, articles: Article[]): number => {
            if (product.articles.length === 0) return 0;

            return product.articles.reduce((maxQty, productArticle) => {
                const article = articles.find(
                    (a) => a.id === productArticle.id
                );
                if (!article) return 0;

                const availableQty = Math.floor(
                    article.amountInStock / productArticle.amountRequired
                );
                return Math.min(maxQty, availableQty);
            }, Infinity);
        },
        []
    );

    // Enrich products with stock information
    const enrichProductsWithStock = useCallback(
        (products: Product[], articles: Article[]): ProductWithStock[] => {
            return products.map((product) => {
                const maxAvailableQuantity = calculateMaxQuantity(
                    product,
                    articles
                );
                return {
                    ...product,
                    maxAvailableQuantity,
                    isAvailable: maxAvailableQuantity > 0,
                };
            });
        },
        [calculateMaxQuantity]
    );

    // Get article details for a product
    const getProductArticleDetails = useCallback(
        (product: Product): ArticleWithDetails[] => {
            return product.articles
                .map((productArticle) => {
                    const article = state.articles.find(
                        (a) => a.id === productArticle.id
                    );
                    if (!article) return null;

                    return {
                        ...productArticle,
                        name: article.name,
                        amountInStock: article.amountInStock,
                    };
                })
                .filter((item): item is ArticleWithDetails => item !== null);
        },
        [state.articles]
    );

    // Fetch inventory data
    const fetchInventory = useCallback(async () => {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const [articlesData, productsData] = await Promise.all([
                getArticles(),
                getProducts(),
            ]);

            const enrichedProducts = enrichProductsWithStock(
                productsData,
                articlesData
            );

            setState({
                products: enrichedProducts,
                articles: articlesData,
                loading: false,
                error: null,
            });
        } catch (error) {
            setState((prev) => ({
                ...prev,
                loading: false,
                error: error as ApiError,
            }));
        }
    }, [enrichProductsWithStock]);

    // Register a sale and update inventory
    const registerSale = useCallback(
        async (productId: string, quantity: number): Promise<void> => {
            const product = state.products.find((p) => p.id === productId);
            if (!product) {
                throw new Error("Product not found");
            }

            if (quantity > product.maxAvailableQuantity) {
                throw new Error("Insufficient stock");
            }

            try {
                // Create the sale
                await createSale(productId, quantity);

                // Calculate article updates
                const articleUpdates = product.articles.map(
                    (productArticle) => ({
                        id: productArticle.id,
                        amountToSubtract:
                            productArticle.amountRequired * quantity,
                    })
                );

                // Update article stock
                await bulkUpdateArticles(articleUpdates);

                // Refresh inventory
                // If we have a global store we can update the store directly instead of refetching
                await fetchInventory();
            } catch (error) {
                const apiError = error as ApiError;
                throw new Error(apiError.message);
            }
        },
        [state.products, fetchInventory]
    );

    // Delete a sale by ID
    const removeSale = useCallback(async (saleId: string): Promise<void> => {
        try {
            await deleteSale(saleId);
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message);
        }
    }, []);

    // Fetch all sales with product details
    const fetchSales = useCallback(async (): Promise<SaleWithProduct[]> => {
        try {
            const sales = await getSales();

            // Fetch product details for each sale
            const salesWithProducts = await Promise.all(
                sales.map(async (sale) => {
                    const product = await getProduct(sale.productId);
                    return {
                        ...sale,
                        product,
                    };
                })
            );

            return salesWithProducts;
        } catch (error) {
            const apiError = error as ApiError;
            throw new Error(apiError.message);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        products: state.products,
        articles: state.articles,
        loading: state.loading,
        error: state.error,
        registerSale,
        removeSale,
        fetchSales,
        refreshInventory: fetchInventory,
        getProductArticleDetails,
    };
};
