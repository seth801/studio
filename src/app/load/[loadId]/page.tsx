
import { LoadDetailsPage } from '@/components/app/load-details-page';

export default async function LoadPage({ params }: { params: { loadId: string } }) {
  return (
    <LoadDetailsPage loadId={params.loadId} />
  );
}
