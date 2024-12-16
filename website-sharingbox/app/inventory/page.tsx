"use client"

import React, { useEffect } from 'react';

const InventoryPage = () => {
    interface InventoryItem {
        name: string;
        // Add other properties if needed
    }

    const [inventory, setInventory] = React.useState<InventoryItem[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const data = await fetch('/api/inventory');
                const response = await data.json();
                if (response.inventory) {
                    setInventory(response.inventory);
                } else {
                    setError('Inventory data is not available');
                }
                console.log(response);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch inventory');
            }
        };
        fetchInventory();
    }, []);

    return (
        <div>
            <h1>Inventory List</h1>
            {error ? (
                <p>{error}</p>
            ) : (
                <ul>
                    {inventory.map((item, index) => (
                        <li key={index}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InventoryPage;