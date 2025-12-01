import React from "react";
import { screen, fireEvent, render } from "@testing-library/react";
import SaleDialog from "../SaleDialog";
import { ProductWithStock } from "../../../types";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock INGKA Modal components
jest.mock("@ingka/modal", () => ({
    __esModule: true,
    default: ({ children, visible }: any) =>
        visible ? <div>{children}</div> : null,
    ModalHeader: ({ ariaCloseTxt }: any) => <div>{ariaCloseTxt}</div>,
    ModalFooter: ({ children }: any) => <div>{children}</div>,
    Prompt: ({ children, footer, header, title }: any) => (
        <div>
            {header}
            <div>{title}</div>
            {children}
            {footer}
        </div>
    ),
}));

// Mock INGKA Button component
jest.mock("@ingka/button/Button", () => ({
    __esModule: true,
    default: ({ text, onClick, disabled }: any) => (
        <button onClick={onClick} disabled={disabled}>
            {text}
        </button>
    ),
}));

const mockProduct: ProductWithStock = {
    id: "p1",
    name: "Dining Chair",
    articles: [{ id: "1", amountRequired: 4 }],
    maxAvailableQuantity: 5,
    isAvailable: true,
};

describe("SaleDialog", () => {
    const mockOnSale = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render modal with product availability", () => {
        render(
            <SaleDialog
                openModal={true}
                product={mockProduct}
                onSale={mockOnSale}
                onClose={mockOnClose}
            />
        );

        expect(
            screen.getByText(/Do you want to confirm this sale/i)
        ).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should render cancel and confirm buttons", () => {
        render(
            <SaleDialog
                openModal={true}
                product={mockProduct}
                onSale={mockOnSale}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText("cancel")).toBeInTheDocument();
        expect(screen.getByText("Confirm")).toBeInTheDocument();
    });

    it("should call onClose when cancel button is clicked", () => {
        render(
            <SaleDialog
                openModal={true}
                product={mockProduct}
                onSale={mockOnSale}
                onClose={mockOnClose}
            />
        );

        const cancelButton = screen.getByText("cancel");
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalled();
    });
});
