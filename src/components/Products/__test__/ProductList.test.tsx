import { render, screen } from "@testing-library/react";
import ProductList from "../ProductList";
import { ProductWithStock, ArticleWithDetails } from "../../../types";

const mockProducts: ProductWithStock[] = [
    {
        id: "p1",
        name: "Dining Chair",
        articles: [
            { id: "1", amountRequired: 4 },
            { id: "2", amountRequired: 8 },
        ],
        maxAvailableQuantity: 3,
        isAvailable: true,
    },
    {
        id: "p2",
        name: "Dining Table",
        articles: [{ id: "3", amountRequired: 1 }],
        maxAvailableQuantity: 0,
        isAvailable: false,
    },
];

const mockArticleDetails: ArticleWithDetails[] = [
    { id: "1", amountRequired: 4, name: "Leg", amountInStock: 12 },
    { id: "2", amountRequired: 8, name: "Screw", amountInStock: 24 },
];

describe("ProductList", () => {
    const mockOnSale = jest.fn();
    const mockGetArticleDetails = (
        product: ProductWithStock
    ): ArticleWithDetails[] => {
        return mockArticleDetails;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render product names correctly", () => {
        render(
            <ProductList
                products={mockProducts}
                onSale={mockOnSale}
                getArticleDetails={mockGetArticleDetails}
            />
        );

        expect(screen.getByText("Dining Chair")).toBeInTheDocument();
        expect(screen.getByText("Dining Table")).toBeInTheDocument();
    });

    it("should display availability status for each product", () => {
        render(
            <ProductList
                products={mockProducts}
                onSale={mockOnSale}
                getArticleDetails={mockGetArticleDetails}
            />
        );

        expect(screen.getByText("3 available")).toBeInTheDocument();
        expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });

    it("should show empty state when no products exist", () => {
        render(
            <ProductList
                products={[]}
                onSale={mockOnSale}
                getArticleDetails={mockGetArticleDetails}
            />
        );

        expect(screen.getByText("No products available")).toBeInTheDocument();
    });
});
