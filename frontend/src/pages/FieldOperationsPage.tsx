import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Database } from 'lucide-react';

export default function FieldOperationsPage() {
  return (
    <PageContainer 
      title="Field Operations" 
      description="Manage on-ground field surveys and operations."
    >
      <div className="mt-6">
        <EmptyState 
          title="Module Under Construction"
          description="Data integration for this module is planned for a future phase."
          icon={<Database className="h-10 w-10" />}
        />
      </div>
    </PageContainer>
  );
}
