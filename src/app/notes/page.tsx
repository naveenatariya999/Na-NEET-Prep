import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { subjects } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Curated Study Notes
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          High-quality, hand-crafted study notes for Physics, Chemistry, and Biology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">{subject.name}</CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {subject.chapters > 0
                  ? `${subject.chapters} chapters available.`
                  : 'View available materials.'}
              </p>
              <Button asChild>
                <Link href={`/notes/${subject.id}`}>
                  View Chapters <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
