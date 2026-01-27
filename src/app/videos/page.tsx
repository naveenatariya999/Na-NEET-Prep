'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

function getYouTubeVideoId(url: string) {
    let videoId = '';
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            videoId = urlObj.searchParams.get('v') || '';
        }
    } catch(e) {
        // if the url is not a valid URL, just return empty string
        return '';
    }
    return videoId;
}

type Video = {
    id: string;
    title: string;
    subject: string;
    url: string;
};

export default function VideosPage() {
    const firestore = useFirestore();

    const videosQuery = useMemoFirebase(() => {
        return query(
            collection(firestore, 'study_materials'),
            where('contentType', '==', 'video'),
            where('visible', '==', true)
        );
    }, [firestore]);

    const { data: videos, isLoading, error } = useCollection<Video>(videosQuery);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline sm:text-5xl">
          Video Lectures
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Stream educational videos directly from our YouTube channel.
        </p>
      </div>
      
      {isLoading && <p className="text-center">Loading videos...</p>}
      {error && <p className="text-center text-destructive">Could not load videos.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {!isLoading && videos?.map((video) => {
          const videoId = getYouTubeVideoId(video.url);
          if (!videoId) return null;

          return (
            <Card key={video.id}>
                <CardHeader>
                <YouTubeEmbed videoId={videoId} title={video.title} />
                </CardHeader>
                <CardContent>
                <Badge variant="default" className="mb-2 bg-primary">{video.subject}</Badge>
                <CardTitle className="text-xl font-headline">{video.title}</CardTitle>
                </CardContent>
            </Card>
          );
        })}
        {!isLoading && videos?.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">
                No videos available yet.
            </div>
        )}
      </div>
    </div>
  );
}
