import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mindMaps } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function MindMapsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Workspace / Mind Maps
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Visualize complex topics and enhance your learning with our curated mind maps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {mindMaps.map((map) => {
          const image = PlaceHolderImages.find(p => p.id === map.imageId);
          return (
            <Card key={map.id} className="overflow-hidden group">
              <CardHeader className="p-0">
                {image && (
                   <Image
                    src={image.imageUrl}
                    alt={map.title}
                    width={600}
                    height={400}
                    data-ai-hint={image.imageHint}
                    className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </CardHeader>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-2">{map.subject}</Badge>
                <CardTitle className="text-xl font-headline">{map.title}</CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
