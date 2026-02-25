"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, PlaySquare, ScrollText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

// यह वो लिस्ट है जहाँ आपकी वेबसाइट का सारा डेटा (Notes, PYQs, Videos) रहता है
const features = [
  {
    id: 'notes',
    icon: BookOpen,
    title: 'Curated Notes',
    description: 'High-quality, hand-crafted study notes for Physics, Chemistry, and Biology.',
    href: '/notes',
    image: PlaceHolderImages.find(p => p.id === 'feature-notes'),
    category: 'Notes',
  },
  {
    id: 'pyqs',
    icon: ScrollText,
    title: 'PYQ Access',
    description: 'Browse Previous Year Questions with original, insightful explanations.',
    href: '/pyqs',
    image: PlaceHolderImages.find(p => p.id === 'feature-pyqs'),
    category: 'PYQs',
  },
  {
    id: 'videos',
    icon: PlaySquare,
    title: 'Video Lectures',
    description: 'Stream educational videos from our YouTube channel without leaving the app.',
    href: '/videos',
    image: PlaceHolderImages.find(p => p.id === 'feature-videos'),
    category: 'Videos',
  },
  {
    id: 'inheritance',
    icon: BookOpen,
    title: 'Principles of Inheritance and Variation',
    description: 'Comprehensive biology notes for NEET preparation.',
    href: '/notes/biology', // यहाँ आपका असली लिंक आएगा
    category: 'Notes',
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  // सर्च फिल्टर: जो भी वेबसाइट के डेटा में है, उसे यहाँ से खोजा जाएगा
  const filteredResults = features.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* --- HERO SECTION (आपका पुराना लुक) --- */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Your Expert Guide to Mastering the NEET Exam
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Access high-quality curated content, previous year questions, and visual mind maps.
                </p>
              </div>

              {/* स्मार्ट सर्च बार - डिज़ाइन में कोई बदलाव नहीं */}
              <div className="w-full max-w-md mt-6">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search anything on website..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border-2 border-muted p-4 pl-12 rounded-2xl focus:border-primary outline-none transition-all shadow-sm"
                  />
                  <Search className="absolute left-4 top-4 text-muted-foreground" size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
                <Button asChild size="lg">
                  <Link href="/notes">Start Learning <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            {/* हीरो इमेज */}
            {PlaceHolderImages.find(p => p.id === 'home-hero') && (
              <Image
                src={PlaceHolderImages.find(p => p.id === 'home-hero')?.imageUrl!}
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last shadow-2xl"
              />
            )}
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION (सर्च रिजल्ट्स यहीं दिखेंगे) --- */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Study Material</h2>
          </div>
          
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <Card key={item.title} className="group overflow-hidden border-2 hover:border-primary transition-all">
                  <CardHeader className="p-0">
                    {item.image && (
                      <Image src={item.image.imageUrl} alt={item.title} width={600} height={400} className="w-full aspect-video object-cover" />
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="flex items-center gap-2 text-xl mb-2">
                      <item.icon className="w-6 h-6 text-primary" />
                      {item.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                    <Button variant="link" asChild className="p-0 h-auto font-bold text-primary">
                      <Link href={item.href}>View Content <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center p-10 border-2 border-dashed rounded-2xl text-muted-foreground">
                "{searchQuery}" के नाम से कुछ नहीं मिला।
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- MIND MAP SECTION (पुराना लुक) --- */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline tracking-tighter">Mind Maps</h2>
            <p className="text-muted-foreground md:text-xl">Improve retention with visual maps.</p>
            <Button asChild><Link href="/mind-maps">View Mind Maps</Link></Button>
          </div>
          {PlaceHolderImages.find(p => p.id === 'mind-map-hero') && (
            <Image
              src={PlaceHolderImages.find(p => p.id === 'mind-map-hero')?.imageUrl!}
              width="600" height="400" alt="Mind Map" className="mx-auto aspect-video rounded-xl object-cover shadow-lg"
            />
          )}
        </div>
      </section>
    </div>
  );
}
