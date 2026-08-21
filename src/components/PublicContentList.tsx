'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';
import { StudyMaterial } from '@/lib/types';
import { subjects } from '@/lib/data';

const extractNumber = (title: string): number => {
  const match = title.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
};

interface PublicContentListProps {
  contentType: StudyMaterial['contentType'];
  pageTitle: string;
}

export default function PublicContentList({ contentType, pageTitle }: PublicContentListProps) {
  const params = useParams();
  // Donों URL parameters support karein (subject ho ya subjectId)
  const subjectParam = (params.subjectId || params.subject) as string;
  const firestore = useFirestore();

  const currentSubject = subjects.find((s) => s.id === subjectParam);

  const materialsQuery = useMemoFirebase(() => {
    // Agar subject query mein ho to filter karein, warna general type filter
    if (subjectParam) {
      return query(
        collection(firestore, 'study_materials'),
        where('contentType', '==', contentType),
        where('subject', '==', subjectParam),
        where('visible', '==', true)
      );
    }
    return query(
      collection(firestore, 'study_materials'),
      where('contentType', '==', contentType),
      where('visible', '==', true)
    );
  }, [firestore, contentType, subjectParam]);

  const { data: materials, isLoading, error } = useCollection<StudyMaterial>(materialsQuery);

  const sortedMaterials = React.useMemo(() => {
    if (!materials) return [];
    return [...materials].sort((a, b) => extractNumber(a.title) - extractNumber(b.title));
  }, [materials]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          {currentSubject ? `${currentSubject.name} ${pageTitle}` : pageTitle}
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse {pageTitle} {currentSubject ? `for ${currentSubject.name}` : ''}.
        </p>
      </div>

      {isLoading && <p className="text-center">Loading materials...</p>}
      {error && <p className="text-center text-destructive">Could not load content.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!isLoading &&
          sortedMaterials.map((item) => (
            <Card key={item.id} className="animated-card">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-4">
                  {item.subject}
                </Badge>
                <p className="text-muted-foreground mb-4">Click to view content.</p>
                <Button asChild>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}

        {!isLoading && sortedMaterials.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No content available for this section yet.
          </div>
        )}
      </div>
    </div>
  );
}
