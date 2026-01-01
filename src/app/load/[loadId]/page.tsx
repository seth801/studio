
import { DeliveryOpsDashboard } from '@/components/app/delivery-ops-dashboard';
import { LoadDetailsPage } from '@/components/app/load-details-page';

export default function LoadPage({ params }: { params: { loadId: string } }) {
  // We will need to wrap this in the main dashboard layout
  // For now, we render the dashboard and the detail page
  // This will be fixed in a follow up.
  return (
    <>
        <div className='hidden'>
            <DeliveryOpsDashboard />
        </div>
        <LoadDetailsPage loadId={params.loadId} />
    </>
  );
}

    