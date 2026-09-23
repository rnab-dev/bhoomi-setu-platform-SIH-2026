import { PageContainer } from '@/components/layout/PageContainer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Database } from 'lucide-react';

export default function AuditLogPage() {
  return (
    <PageContainer 
      title="Audit Log" 
      description="System-wide audit trail and compliance logs."
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
