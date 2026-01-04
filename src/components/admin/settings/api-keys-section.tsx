'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export function ApiKeysSection() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [keys, setKeys] = useState({
        googleMapsApiKey: '',
        geminiApiKey: '',
    });

    useEffect(() => {
        loadKeys();
    }, []);

    const loadKeys = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'settings', 'apiKeys');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setKeys(docSnap.data() as typeof keys);
            }
        } catch (error) {
            console.error('Error loading API keys:', error);
            toast({
                title: 'Error',
                description: 'Failed to load API keys',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, 'settings', 'apiKeys');
            await setDoc(docRef, {
                ...keys,
                updatedAt: new Date().toISOString(),
            });

            toast({
                title: 'Success',
                description: 'API keys saved successfully',
            });
        } catch (error) {
            console.error('Error saving API keys:', error);
            toast({
                title: 'Error',
                description: 'Failed to save API keys',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                    Manage your API keys for Google Maps and AI features
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                    <Input
                        id="googleMapsApiKey"
                        type="password"
                        value={keys.googleMapsApiKey}
                        onChange={(e) => setKeys({ ...keys, googleMapsApiKey: e.target.value })}
                        placeholder="Enter your Google Maps API key"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                    <Input
                        id="geminiApiKey"
                        type="password"
                        value={keys.geminiApiKey}
                        onChange={(e) => setKeys({ ...keys, geminiApiKey: e.target.value })}
                        placeholder="Enter your Gemini API key"
                    />
                </div>

                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save API Keys'}
                </Button>
            </CardContent>
        </Card>
    );
}
