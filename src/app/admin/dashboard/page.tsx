'use client';

import * as React from 'react';
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
  FileText,
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { StudyMaterial } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function StatCard({ title, value, icon: Icon, isLoading }: { title: string, value: number, icon: React.ElementType, isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <Skeleton className="h-8 w-16" />
        ) : (
            <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">
          Total count of all {title.toLowerCase()}
        </p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const firestore = useFirestore();
  const materialsQuery = useMemoFirebase(() => collection(firestore, 'study_materials'), [firestore]);
  const { data: materials, isLoading } = useCollection<StudyMaterial>(materialsQuery);

  const stats = React.useMemo(() => {
    if (!materials) {
      return {
        totalNotes: 0,
        totalPdfs: 0,
        totalPyqs: 0,
        totalVideos: 0,
        totalMindMaps: 0,
      };
    }
    return {
      totalNotes: materials.filter(m => m.contentType === 'notes').length,
      totalPdfs: materials.filter(m => m.contentType === 'pdf').length,
      totalPyqs: materials.filter(m => m.contentType === 'pyq').length,
      totalVideos: materials.filter(m => m.contentType === 'video').length,
      totalMindMaps: materials.filter(m => m.contentType === 'mindmap').length,
    };
  }, [materials]);

  const statCards = [
    { title: 'Total Notes', value: stats.totalNotes, icon: BookOpen },
    { title: 'Total PDFs', value: stats.totalPdfs, icon: FileText },
    { title: 'Total PYQs', value: stats.totalPyqs, icon: ScrollText },
    { title: 'Total Videos', value: stats.totalVideos, icon: PlaySquare },
    { title: 'Total Mind Maps', value: stats.totalMindMaps, icon: BrainCircuit },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        {statCards.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} isLoading={isLoading} />
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
