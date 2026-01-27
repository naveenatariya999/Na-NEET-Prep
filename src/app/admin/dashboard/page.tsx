import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  BrainCircuit,
  PlaySquare,
  ScrollText,
} from 'lucide-react';
import { adminDashboardStats } from '@/lib/data';

const stats = [
  {
    title: 'Total Notes',
    value: adminDashboardStats.totalNotes,
    icon: BookOpen,
  },
  {
    title: 'Total PYQs Years',
    value: adminDashboardStats.totalPyqs,
    icon: ScrollText,
  },
  {
    title: 'Total Videos',
    value: adminDashboardStats.totalVideos,
    icon: PlaySquare,
  },
  {
    title: 'Total Mind Maps',
    value: adminDashboardStats.totalMindMaps,
    icon: BrainCircuit,
  },
];

export default function AdminDashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4 font-headline">
          Welcome back, Admin!
        </h2>
        <p className="text-muted-foreground">
          Here you can manage all the content for the Na-NEET Prep app.
        </p>
      </div>
    </main>
  );
}
