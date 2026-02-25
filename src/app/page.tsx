"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, PlaySquare, ScrollText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// ये आपके वही 3 ओरिजिनल कार्ड्स हैं
const originalFeatures = [
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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // अगर आप कुछ टाइप करेंगे, तो यह देखेगा कि वो Notes, PYQs या Videos में से कहाँ मिलेगा
  const isSearching = searchQuery.length > 0;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* --- HERO SECTION: आपका ओरिजिनल लुक --- */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                Your Expert Guide to Mastering the NEET Exam
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Access high-quality curated content, previous year questions, and visual mind maps.
              </p>

              {/* आपका ओरिजिनल सर्च बार स्टाइल */}
              <div className="relative max-w-md mt-6">
                <input
                  type="text"
                  placeholder="Search chapters (e.g. Origin, Biology)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border-2 border-muted p-4 pl-12 rounded-2xl focus:border-primary outline-none transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-4 text-muted-foreground" size={20} />
              </div>

              <div className="pt-4">
                <Button asChild size="lg">
                  <Link href="/notes">Start Learning <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            
            <Image
              src={PlaceHolderImages.find(p => p.id === 'home-hero')?.imageUrl!}
              width={600} height={400} alt="Hero"
              className="mx-auto rounded-xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* --- STUDY MATERIAL SECTION --- */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
             <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">Key Features</div>
             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Study Material</h2>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* यह हिस्सा आपके कार्ड्स को वापस लाएगा */}
            {originalFeatures.map((feature) => (
              <Card key={feature.title} className="group overflow-hidden border-2 hover:border-primary transition-all">
                <CardHeader className="p-0">
                  {feature.image && (
                    <Image src={feature.image.imageUrl} alt={feature.title} width={600} height={400} className="w-full aspect-video object-cover" />
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="flex items-center gap-2 text-xl mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                    {feature.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-4">
                    {/* अगर सर्च चालू है, तो हम बताएँगे कि यहाँ ढूँढें */}
                    {isSearching ? `Click below to find "${searchQuery}" in ${feature.title}` : feature.description}
                  </p>
                  <Button variant="link" asChild className="p-0 h-auto font-bold text-primary">
                    <Link href={feature.href}>
                      {isSearching ? `Search in ${feature.title}` : 'Explore More'} 
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- MIND MAPS: आपका ओरिजिनल सेक्शन --- */}
      <section className="w-full py-12 bg-card">
        <div className="container grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl font-bold font-headline">Mind Maps</h2>
            <p className="text-muted-foreground">Visualize concepts with our admin-curated mind maps.</p>
            <Button asChild><Link href="/mind-maps">View Mind Maps</Link></Button>
          </div>
          <Image
            src={PlaceHolderImages.find(p => p.id === 'mind-map-hero')?.imageUrl!}
            width={600} height={400} alt="Mind Map" className="rounded-xl shadow-lg"
          />
        </div>
      </section>
    </div>
  );
}
