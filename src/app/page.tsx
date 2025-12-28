import { CodeCraftCopilotPage } from '@/components/app/codecraft-copilot-page';
import { CopilotProvider } from '@/components/app/copilot-context';

export default function Home() {
  return (
    <CopilotProvider>
      <CodeCraftCopilotPage />
    </CopilotProvider>
  );
}
