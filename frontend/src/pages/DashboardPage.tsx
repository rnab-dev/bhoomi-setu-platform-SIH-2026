import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderKanban, 
  MapPin, 
  IndianRupee, 
  Users, 
  Activity,
  Globe
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <PageContainer 
      title="Dashboard" 
      description="Overview of national land acquisition metrics and status."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards Placeholders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-mute">
              Total Projects
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-text-faint" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">--</div>
            <p className="text-xs text-text-faint mt-1">Pending API integration</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-mute">
              Land Under Acquisition
            </CardTitle>
            <MapPin className="h-4 w-4 text-text-faint" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">-- Hectares</div>
            <p className="text-xs text-text-faint mt-1">Pending API integration</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-mute">
              Compensation Disbursed
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-text-faint" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">₹ --</div>
            <p className="text-xs text-text-faint mt-1">Pending API integration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-mute">
              Affected Families
            </CardTitle>
            <Users className="h-4 w-4 text-text-faint" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-ink">--</div>
            <p className="text-xs text-text-faint mt-1">Pending API integration</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        {/* Geographic Overview Placeholder */}
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-accent" />
              Geographic Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-line bg-slate-50/50">
            <p className="text-sm text-text-mute">Map visualization will be implemented in Phase 11 (GIS)</p>
          </CardContent>
        </Card>

        {/* Recent Activity Placeholder */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="border-t border-line bg-slate-50/50 h-[300px] p-6 flex flex-col justify-center items-center">
            <p className="text-sm text-text-mute text-center">Activity feed data connection pending</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 mt-6">
        {/* Compliance / Timeline Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline Compliance</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center border-t border-line bg-slate-50/50">
            <p className="text-sm text-text-mute">Compliance charts will be available in the Analytics module</p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
