import "./styles/App.css";
import Tabs, { Tab, TabPanel } from "@ingka/tabs";
import Loading, { LoadingBall } from "@ingka/loading";
import { useInventory } from "./hooks/useInventory";
import ProductList from "./components/Products/ProductList";
import SalesList from "./components/Sales/SalesList";
import "./App.css";

function App() {
    const {
        products,
        loading,
        error,
        registerSale,
        refreshInventory,
        getProductArticleDetails,
        fetchSales,
        removeSale,
    } = useInventory();

    const handleSale = async (productId: string, quantity: number) => {
        await registerSale(productId, quantity);
    };

    if (loading && products.length === 0) {
        return (
            <div className="App">
                <div className="loading-container">
                    <Loading text="Loading inventory...">
                        <LoadingBall color="emphasised" size="large" />
                    </Loading>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="App">
                <div className="error-container">
                    <h2>Error Loading Inventory</h2>
                    <p>{error.message}</p>
                    <button className="btn-primary" onClick={refreshInventory}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="app-header">
                <h1>Warehouse Inventory Management</h1>
            </header>
            <main className="app-main">
                {/* We can create Tabs as a reusable library and set it in /libraries */}
                <Tabs
                    tabPanels={[
                        <TabPanel key="0" tabPanelId="tab_0">
                            <ProductList
                                products={products}
                                onSale={handleSale}
                                getArticleDetails={getProductArticleDetails}
                            />
                        </TabPanel>,
                        <TabPanel key="1" tabPanelId="tab_1">
                            <SalesList
                                fetchSales={fetchSales}
                                removeSale={removeSale}
                            />
                        </TabPanel>,
                    ]}
                    tabs={[
                        <Tab
                            key="0"
                            id="tab-btn-0"
                            tabPanelId="tab_0"
                            text="Products"
                        />,
                        <Tab
                            key="1"
                            id="tab-btn-1"
                            tabPanelId="tab_1"
                            text="Sales"
                        />,
                    ]}
                />
            </main>
        </div>
    );
}

export default App;
