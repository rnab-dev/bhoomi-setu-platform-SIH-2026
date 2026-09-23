import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Database } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <PageContainer 
      title="Analytics" 
      description="Advanced analytics and reporting."
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
