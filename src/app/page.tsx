"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, PlaySquare, ScrollText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// आपकी असली फीचर्स लिस्ट (बिना किसी बदलाव के)
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
  const [searchQuery, setSearchQuery] = useState("");

  // सर्च फिल्टर: जो टाइप करोगे वो इन 3 कार्ड्स में से मैच होगा
  const filteredFeatures = features.filter((f) => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

              {/* --- सर्च बार यहाँ है --- */}
              <div className="w-full max-w-xl mt-8 mb-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search chapters, notes, videos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border-2 border-muted p-4 pl-12 rounded-2xl focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md text-foreground"
                  />
                  <span className="absolute left-4 top-4 text-muted-foreground"><Search size={20} /></span>
                </div>
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
                width="600" height="400" alt="Hero"
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
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
            {filteredFeatures.map((feature) => (
              <Card key={feature.title} className="group overflow-hidden animated-card">
                <CardHeader className="p-0">
                  {feature.image && (
                    <Image
                      src={feature.image.imageUrl}
                      alt={feature.title}
                      width={600} height={400}
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
              Our admin-curated mind maps help you connect ideas and see the bigger picture.
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
                width="600" height="400" alt="Mind Map"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
