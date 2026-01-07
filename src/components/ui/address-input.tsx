'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Address } from '@/types/address';

interface AddressInputProps {
    value: Address;
    onChange: (address: Address) => void;
    label?: string;
    required?: boolean;
}

const US_STATES = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export function AddressInput({ value, onChange, label, required = false }: AddressInputProps) {
    const handleChange = (field: keyof Address, newValue: string) => {
        onChange({ ...value, [field]: newValue });
    };

    return (
        <div className="space-y-4">
            {label && (
                <Label className="text-sm font-medium">
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            <div className="grid gap-4">
                {/* Street Address */}
                <div className="space-y-2">
                    <Label htmlFor="street" className="text-xs text-muted-foreground">
                        Street Address
                    </Label>
                    <Input
                        id="street"
                        value={value.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        placeholder="123 Main St"
                        required={required}
                    />
                </div>

                {/* City, State, Zip Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="city" className="text-xs text-muted-foreground">
                            City
                        </Label>
                        <Input
                            id="city"
                            value={value.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            placeholder="City"
                            required={required}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="state" className="text-xs text-muted-foreground">
                            State
                        </Label>
                        <Select value={value.state} onValueChange={(val) => handleChange('state', val)}>
                            <SelectTrigger id="state">
                                <SelectValue placeholder="ST" />
                            </SelectTrigger>
                            <SelectContent>
                                {US_STATES.map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="zipcode" className="text-xs text-muted-foreground">
                            Zip Code
                        </Label>
                        <Input
                            id="zipcode"
                            value={value.zipcode}
                            onChange={(e) => handleChange('zipcode', e.target.value)}
                            placeholder="12345"
                            maxLength={10}
                            required={required}
                        />
                    </div>
                </div>

                {/* Country (optional, defaults to USA) */}
                <div className="space-y-2">
                    <Label htmlFor="country" className="text-xs text-muted-foreground">
                        Country
                    </Label>
                    <Input
                        id="country"
                        value={value.country}
                        onChange={(e) => handleChange('country', e.target.value)}
                        placeholder="USA"
                    />
                </div>
            </div>
        </div>
    );
}
