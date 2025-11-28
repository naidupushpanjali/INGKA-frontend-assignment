import React, { useState, useEffect } from "react";
import Table, { TableBody, TableHeader } from "@ingka/table";
import Button from "@ingka/button/Button";
import { SaleWithProduct } from "../../types";

interface SalesListProps {
    fetchSales: () => Promise<SaleWithProduct[]>;
    removeSale: (saleId: string) => Promise<void>;
}

const SalesList: React.FC<SalesListProps> = ({ fetchSales, removeSale }) => {
    const [sales, setSales] = useState<SaleWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSales = async () => {
            try {
                setLoading(true);
                const salesData = await fetchSales();
                setSales(salesData);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load sales"
                );
            } finally {
                setLoading(false);
            }
        };
        loadSales();
    }, [fetchSales]);

    const handleDeleteSale = async (saleId: string) => {
        try {
            await removeSale(saleId);
            // Refresh sales list
            const salesData = await fetchSales();
            setSales(salesData);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete sale"
            );
        }
    };

    if (loading) {
        return <div className="loading-container">Loading sales...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (sales.length === 0) {
        return <div className="empty-state">No sales recorded</div>;
    }

    return (
        <div className="product-list">
            <h2>Sales History</h2>
            <div className="product-grid">
                <Table>
                    <TableHeader sticky={true}>
                        <tr>
                            <th>Date</th>
                            <th>Product Name</th>
                            <th>Quantity Sold</th>
                            <th>Sale ID</th>
                            <th>Actions</th>
                        </tr>
                    </TableHeader>
                    <TableBody>
                        {sales.map((sale) => {
                            const saleDate = new Date(
                                sale.createdAt
                            ).toLocaleString();

                            return (
                                <tr key={sale.id}>
                                    <td>{saleDate}</td>
                                    <td>{sale.product.name}</td>
                                    <td>{sale.amountSold}</td>
                                    <td className="sale-id">{sale.id}</td>
                                    <td>
                                        <Button
                                            href=""
                                            size="small"
                                            text="Delete"
                                            type="secondary"
                                            onClick={() =>
                                                handleDeleteSale(sale.id)
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default SalesList;
