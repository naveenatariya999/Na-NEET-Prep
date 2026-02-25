import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, PlaySquare, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: BookOpen,
    title: 'Curated Notes',
    description: 'High-quality, hand-crafted study notes for Physics, Chemistry, and Biology.',
    href: '/notes',
    image: PlaceHolderImages.find(p => p.id === 'feature-notes'),
  },
  {
    icon: ScrollText,
    title: 'PYQ Access',
    description: 'Browse Previous Year Questions with original, insightful explanations.',
    href: '/pyqs',
    image: PlaceHolderImages.find(p => p.id === 'feature-pyqs'),
  },
  {
    icon: PlaySquare,
    title: 'Video Lectures',
    description: 'Stream educational videos from our YouTube channel without leaving the app.',
    href: '/videos',
    image: PlaceHolderImages.find(p => p.id === 'feature-videos'),
  },
];

const mindMapImage = PlaceHolderImages.find(p => p.id === 'mind-map-hero');

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Your Expert Guide to Mastering the NEET Exam
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Access high-quality curated content, previous year questions, and visual mind maps to excel in your preparation.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/notes">
                    Start Learning
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            {PlaceHolderImages.find(p => p.id === 'home-hero') && (
              <Image
                src={PlaceHolderImages.find(p => p.id === 'home-hero')?.imageUrl!}
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="medical student studying"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            )}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Everything You Need to Succeed
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform is designed to provide a focused, distraction-free learning environment with all the tools for a comprehensive preparation.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
            {features.map((feature) => (
              <Card key={feature.title} className="group overflow-hidden animated-card">
                <CardHeader className="p-0">
                  {feature.image && (
                     <Image
                        src={feature.image.imageUrl}
                        alt={feature.title}
                        width={600}
                        height={400}
                        data-ai-hint={feature.image.imageHint}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                  )}
                  <div className="p-6">
                     <CardTitle className="flex items-center gap-2">
                      <feature.icon className="w-6 h-6 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                   <Button variant="link" asChild className="p-0 mt-4 h-auto">
                    <Link href={feature.href}>
                      Explore More <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Visualize Concepts with Mind Maps
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our admin-curated mind maps help you connect ideas, improve memory retention, and see the bigger picture.
            </p>
            <Button asChild>
              <Link href="/mind-maps">
                View Mind Maps
                <BrainCircuit className="ml-2" />
              </Link>
            </Button>
          </div>
          {mindMapImage && (
            <div className="flex space-x-4">
               <Image
                src={mindMapImage.imageUrl}
                width="600"
                height="400"
                alt="Mind Map"
                data-ai-hint={mindMapImage.imageHint}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}                                                                                  
