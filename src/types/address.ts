// Shared Address interface for structured address storage
export interface Address {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
}

// Helper to format address for display
export const formatFullAddress = (address: Address): string => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipcode}`;
};

// Helper to format address as "City, ST"
export const formatCityState = (address: Address): string => {
    return `${address.city}, ${address.state}`;
};

// Helper to parse old string addresses (for migration)
export const parseAddress = (addressString: string): Address | null => {
    // This is a best-effort parser for existing data
    // Pattern: "Street, City, ST Zipcode" or variations
    const parts = addressString.split(',').map(s => s.trim());

    if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1];
        const stateZipMatch = lastPart.match(/^([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/);

        if (stateZipMatch) {
            const state = stateZipMatch[1];
            const zipcode = stateZipMatch[2];
            const city = parts[parts.length - 2];
            const street = parts.slice(0, -2).join(', ');

            return {
                street: street || '',
                city,
                state,
                zipcode,
                country: 'USA'
            };
        }
    }

    // Fallback for simpler formats
    return {
        street: '',
        city: addressString,
        state: '',
        zipcode: '',
        country: 'USA'
    };
};
