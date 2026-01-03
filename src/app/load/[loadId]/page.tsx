
import { LoadDetailsPage } from '@/components/admin/dashboard/load-details-page';

export default async function LoadPage({ params }: { params: Promise<{ loadId: string }> }) {
  const { loadId } = await params;
  return (
    <LoadDetailsPage loadId={loadId} />
  );
}
