import React, { useState } from "react";
import circleFilled from "@ingka/ssr-icon/paths/circle-filled";
import Table, { TableBody, TableHeader } from "@ingka/table";
import Accordion, { AccordionItem } from "@ingka/accordion";
import Button from "@ingka/button/Button";
import SSRIcon from "@ingka/ssr-icon";
import { ProductWithStock, ArticleWithDetails } from "../../types";
import SaleDialog from "../Sales/SaleDialog";
import "./ProductList.css";

interface ProductListProps {
    products: ProductWithStock[];
    onSale: (productId: string, quantity: number) => Promise<void>;
    getArticleDetails: (product: ProductWithStock) => ArticleWithDetails[];
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    onSale,
    getArticleDetails,
}) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] =
        useState<ProductWithStock | null>(null);
    const handleSale = async (quantity: number) => {
        if (!selectedProduct) return;
        await onSale(selectedProduct.id, quantity);
        setSelectedProduct(null);
    };

    if (products.length === 0) {
        return <div className="empty-state">No products available</div>;
    }

    return (
        <div className="product-list">
            <div className="product-grid">
                {products.map((product) => {
                    const articleDetails = getArticleDetails(product);

                    return (
                        <div
                            key={product.id}
                            className={`product-card ${
                                !product.isAvailable ? "out-of-stock" : ""
                            }`}
                        >
                            {/* We can create Accordion as a reusable library and set it in /libraries */}
                            <Accordion>
                                <AccordionItem
                                    id="accordion-2"
                                    title={
                                        <>
                                            <div>{product.name}</div>
                                            <span
                                                className={`stock-badge ${
                                                    product.isAvailable
                                                        ? "in-stock"
                                                        : "out-of-stock"
                                                }`}
                                            >
                                                {product.isAvailable
                                                    ? `${product.maxAvailableQuantity} available`
                                                    : "Out of stock"}
                                            </span>
                                        </>
                                    }
                                >
                                    <div className="articles-section">
                                        {/* We can create Table as a reusable library and set it in /libraries */}
                                        <Table>
                                            <TableHeader sticky={true}>
                                                <tr>
                                                    <th>Article Name</th>
                                                    <th>Required</th>
                                                    <th>In Stock</th>
                                                </tr>
                                            </TableHeader>
                                            <TableBody>
                                                {articleDetails.map(
                                                    (article) => {
                                                        const canMake =
                                                            Math.floor(
                                                                article.amountInStock /
                                                                    article.amountRequired
                                                            );
                                                        const isLowStock =
                                                            canMake < 5;

                                                        return (
                                                            <tr
                                                                key={article.id}
                                                                className={
                                                                    isLowStock
                                                                        ? "low-stock"
                                                                        : ""
                                                                }
                                                            >
                                                                <td>
                                                                    {
                                                                        article.name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        article.amountRequired
                                                                    }
                                                                </td>
                                                                <td className="stock-cell">
                                                                    <>
                                                                        <span>
                                                                            {article.amountInStock ===
                                                                            0
                                                                                ? ""
                                                                                : article.amountInStock}
                                                                        </span>
                                                                        {article.amountInStock ===
                                                                            0 && (
                                                                            <span className="status-text out">
                                                                                Out
                                                                                of
                                                                                Stock
                                                                            </span>
                                                                        )}

                                                                        <span>
                                                                            {article.amountInStock >
                                                                                0 &&
                                                                                article.amountInStock <=
                                                                                    5 && (
                                                                                    <SSRIcon
                                                                                        className="low-stock"
                                                                                        paths={
                                                                                            circleFilled
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            {article.amountInStock >
                                                                                5 &&
                                                                                article.amountInStock <=
                                                                                    20 && (
                                                                                    <SSRIcon
                                                                                        className="medium-stock"
                                                                                        paths={
                                                                                            circleFilled
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            {article.amountInStock >
                                                                                20 && (
                                                                                <SSRIcon
                                                                                    className="high-stock"
                                                                                    paths={
                                                                                        circleFilled
                                                                                    }
                                                                                />
                                                                            )}
                                                                        </span>
                                                                    </>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </TableBody>
                                        </Table>
                                        {/* We can create Button as a reusable library and set it in /libraries */}
                                        <Button
                                            className="buy-no-button"
                                            href=""
                                            iconPosition="leading"
                                            size="medium"
                                            text="Buy now"
                                            type="emphasised"
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setOpenModal(true);
                                            }}
                                        />
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    );
                })}
            </div>

            {selectedProduct && (
                <SaleDialog
                    openModal={openModal}
                    product={selectedProduct}
                    onSale={handleSale}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default ProductList;
