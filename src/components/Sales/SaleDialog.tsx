import React, { useState } from "react";
import Modal, { ModalHeader, ModalFooter, Prompt } from "@ingka/modal";
import Button from "@ingka/button/Button";
import { ProductWithStock } from "../../types";

interface SaleDialogProps {
    openModal: boolean;
    product: ProductWithStock;
    onSale: (quantity: number) => Promise<void>;
    onClose: () => void;
}

const SaleDialog: React.FC<SaleDialogProps> = ({
    openModal,
    product,
    onSale,
    onClose,
}) => {
    const quantity = 1; // Fixed quantity for sale
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSale(quantity);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to register sale"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <Modal handleCloseBtn={() => {}} visible={openModal}>
                <Prompt
                    aria-label="Accessibility header for a modal"
                    className="example-prompt-override"
                    footer={
                        <ModalFooter>
                            <>
                                <Button
                                    text="cancel"
                                    type="secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                />

                                <Button
                                    text={loading ? "Processing..." : "Confirm"}
                                    type="primary"
                                    disabled={loading || quantity <= 1}
                                    onClick={(e: React.FormEvent) =>
                                        handleSubmit(e)
                                    }
                                />
                            </>
                        </ModalFooter>
                    }
                    header={<ModalHeader ariaCloseTxt="Register Sale" />}
                    title="Do you want to confirm this sale?"
                    titleId="prompt-title-id"
                >
                    <p className="available-info">
                        Available:{" "}
                        <strong>{product.maxAvailableQuantity}</strong> units
                    </p>
                    {error && <div className="error-message">{error}</div>}
                </Prompt>
            </Modal>
        </div>
    );
};

export default SaleDialog;
