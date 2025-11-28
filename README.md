# Warehouse Inventory Management System

A React-based inventory management application for tracking products, articles, and sales. Built with TypeScript and INGKA design system components.This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

This application allows warehouse managers to:

-   View available products and their stock levels

-   Monitor article inventory required to build products

-   Register product sales

-   Track sales history

-   Manage inventory in real-timeOpen [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

├── components/

│ ├── Products/ # Product-related components

│ └── Sales/ # Sales-related components

├── hooks/ # Custom React hooks

├── integrations/ # API service layer

├── styles/ # Global styles

└── types.ts # TypeScript type definitions

## Components

### 1. ProductList Component

**Location:** `src/components/Products/ProductList.tsx`.

**Purpose:** Displays all available products with their stock information and article details.

-   Shows products in an expandable accordion layout

-   Displays product availability status (In Stock / Out of Stock)

-   Shows maximum available quantity for each product

-   Expandable article details table

    -   Article name

    -   Required quantity per product

    -   Current stock with visual indicators

**Props:**

-   `products`: Array of products with stock information
-   `onSale`: Function to handle product sales
-   `getArticleDetails`: Function to retrieve article details for a product

### 2. SaleDialog Component

**Location:** `src/components/Sales/SaleDialog.tsx`

**Purpose:** Modal dialog for confirming product sales.

**Key Features:**

-   Displays product availability information
-   Confirms sale quantity (currently fixed at 1 unit)
-   Shows loading state during sale processing
-   Error handling with user-friendly messages
-   Cancel and Confirm actions

**Props:**

-   `openModal`: Boolean to control dialog visibility
-   `product`: Product being sold
-   `onSale`: Async function to process the sale
-   `onClose`: Function to close the dialog

### 3. SalesList Component

**Location:** `src/components/Sales/SalesList.tsx`

**Purpose:** Displays the complete sales history with management options.

**Key Features:**

-   Shows all recorded sales in a table format
-   Displays:
    -   Sale date and time
    -   Product name
    -   Quantity sold
    -   Unique sale ID
-   Delete functionality for individual sales
-   Automatic refresh after deletion
-   Loading and error states
-   Empty state when no sales exist

**Props:**

-   `fetchSales`: Async function to retrieve sales data
-   `removeSale`: Async function to delete a sale

## Custom Hooks

### useInventory Hook

**Location:** `src/hooks/useInventory.ts`

**Purpose:** Central state management for inventory operations.

**Functions:**

-   `fetchInventory()`: Loads products and articles from API
-   `registerSale(productId, quantity)`: Creates a sale and updates article stock
-   `removeSale(saleId)`: Deletes a sale record
-   `fetchSales()`: Retrieves all sales with product details
-   `getProductArticleDetails(product)`: Gets enriched article data for a product
-   `refreshInventory()`: Manually refreshes inventory data

**State:**

-   `products`: Array of products with calculated stock availability
-   `articles`: Array of raw article data
-   `loading`: Loading state indicator
-   `error`: Error state for API failures

**Key Logic:**

-   Automatically calculates maximum available quantity based on article stock
-   Enriches products with availability status
-   Handles bulk article updates after sales
-   Manages error states and loading indicators

## Data Types

### Core Types (from `types.ts`)

**Article:**

-   `id`: Unique identifier
-   `name`: Article name
-   `amountInStock`: Current stock quantity

**Product:**

-   `id`: Unique identifier
-   `name`: Product name
-   `articles`: Array of required articles with quantities

**Sale:**

-   `id`: Unique identifier
-   `createdAt`: Timestamp
-   `productId`: Reference to sold product
-   `amountSold`: Quantity sold

**Extended Types:**

-   `ProductWithStock`: Product + availability calculation
-   `ArticleWithDetails`: Article + stock details
-   `SaleWithProduct`: Sale + product information

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload if you make edits.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

## Technical Stack

-   **React** with TypeScript
-   **INGKA Design System** components
-   **CSS Modules** for component styling
-   **React Hooks** for state management
-   **Jest** for testing

## Key Features

✅ Real-time stock availability calculation
✅ Visual stock level indicators
✅ Article-level inventory tracking
✅ Sales history management
✅ Responsive error handling
✅ Loading states for async operations
✅ Component-based architecture
✅ Type-safe with TypeScript

## How It Works

### Stock Calculation

The application calculates product availability based on article inventory. For each product:

1. Identifies all required articles and their quantities
2. Calculates how many units can be made from each article
3. Takes the minimum value as the maximum available quantity

### Sales Flow

1. User views products in the Products tab
2. Clicks "Sell Product" on an available item
3. Confirms the sale in the modal dialog
4. System creates a sale record
5. Updates article stock by subtracting required amounts
6. Refreshes inventory to show updated availability

### Sales Management

1. Navigate to Sales tab to view history
2. See all sales with timestamps and details
3. Delete sales if needed (stock is not restored)

## Getting Started

1. Install dependencies:
    ```bash
    npm install
    ```
2. Start the development server:

    ```bash
    npm start
    ```

3. Run tests:
    ```bash
    npm test
    ```

## Learn More

-   [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
-   [React documentation](https://reactjs.org/)
-   [TypeScript documentation](https://www.typescriptlang.org/)
