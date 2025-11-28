import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the useInventory hook
jest.mock("./hooks/useInventory", () => ({
    useInventory: jest.fn(),
}));

// Mock INGKA components
jest.mock("@ingka/tabs", () => ({
    __esModule: true,
    default: ({ tabs, tabPanels }: any) => (
        <div>
            {tabs}
            {tabPanels}
        </div>
    ),
    Tab: ({ text }: any) => <button>{text}</button>,
    TabPanel: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("@ingka/loading", () => ({
    __esModule: true,
    default: ({ text, children }: any) => (
        <div>
            {text}
            {children}
        </div>
    ),
    LoadingBall: () => <div>Loading...</div>,
}));

jest.mock("./components/Products/ProductList", () => ({
    __esModule: true,
    default: () => <div>Product List</div>,
}));

jest.mock("./components/Sales/SalesList", () => ({
    __esModule: true,
    default: () => <div>Sales List</div>,
}));

const { useInventory } = require("./hooks/useInventory");

describe("App", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render loading state when loading", () => {
        useInventory.mockReturnValue({
            products: [],
            articles: [],
            loading: true,
            error: null,
            registerSale: jest.fn(),
            refreshInventory: jest.fn(),
            getProductArticleDetails: jest.fn(),
            fetchSales: jest.fn(),
            removeSale: jest.fn(),
        });

        render(<App />);

        expect(screen.getByText(/Loading inventory/i)).toBeInTheDocument();
    });

    it("should render error state when there is an error", () => {
        useInventory.mockReturnValue({
            products: [],
            articles: [],
            loading: false,
            error: { message: "Failed to load data" },
            registerSale: jest.fn(),
            refreshInventory: jest.fn(),
            getProductArticleDetails: jest.fn(),
            fetchSales: jest.fn(),
            removeSale: jest.fn(),
        });

        render(<App />);

        expect(
            screen.getByText(/Error Loading Inventory/i)
        ).toBeInTheDocument();
        expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    });

    it("should render app header and tabs when loaded successfully", () => {
        useInventory.mockReturnValue({
            products: [{ id: "1", name: "Chair" }],
            articles: [],
            loading: false,
            error: null,
            registerSale: jest.fn(),
            refreshInventory: jest.fn(),
            getProductArticleDetails: jest.fn(),
            fetchSales: jest.fn(),
            removeSale: jest.fn(),
        });

        render(<App />);

        expect(
            screen.getByText("Warehouse Inventory Management")
        ).toBeInTheDocument();
        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByText("Sales")).toBeInTheDocument();
    });
});
