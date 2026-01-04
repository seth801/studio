import { ApiKeysSection } from '@/components/admin/settings/api-keys-section';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your application settings and API keys
                </p>
            </div>

            <ApiKeysSection />
        </div>
    );
}
