'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight } from 'lucide-react';
import type { StudyMaterial } from '@/lib/types';

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
  const subject = params?.subject as string;
  const firestore = useFirestore();

  const contentQuery = useMemoFirebase(() => {
    if (!subject) return null;
    return query(
      collection(firestore, 'study_materials'),
      where('contentType', '==', contentType),
      where('subject', '==', subject),
      where('visible', '==', true)
    );
  }, [firestore, subject, contentType]);

  const { data: rawContent, isLoading, error } = useCollection<StudyMaterial>(contentQuery);

  const sortedContent = React.useMemo(() => {
    if (!rawContent) return [];
    return [...rawContent].sort((a: any, b: any) => {
      const orderA = a.order !== undefined ? a.order : extractNumber(a.title || '');
      const orderB = b.order !== undefined ? b.order : extractNumber(b.title || '');
      if (orderA !== orderB) return orderA - orderB;
      return (a.title || '').localeCompare(b.title || '');
    });
  }, [rawContent]);

  const subjectTitle = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : '';

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight capitalize font-headline">
          {subjectTitle} {pageTitle}
        </h1>
        <p className="text-muted-foreground mt-2">Browse {pageTitle} for {subjectTitle}.</p>
      </div>

      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-destructive">Error: {error.message}</p>}
      {!isLoading && sortedContent.length === 0 && (
        <p className="text-center text-muted-foreground">No content available for this subject yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedContent.map((item: any) => (
          <Card key={item.id} className="flex flex-col justify-between hover:shadow-lg transition-all border-2">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg mt-1">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="capitalize text-xs mb-1">
                    {item.subject}
                  </Badge>
                  <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-4">Click to view material.</p>
              <Button asChild className="w-full gap-2">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  Open <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
