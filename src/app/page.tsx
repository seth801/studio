
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <h1 className="text-4xl font-bold">Ideal Delivery Ops</h1>
      <div className="flex gap-4">
        <Link href="/admin">
          <Button size="lg">Admin Dashboard</Button>
        </Link>
        <Link href="/driver">
          <Button size="lg" variant="outline">Driver App</Button>
        </Link>
      </div>
    </div>
  );
}
