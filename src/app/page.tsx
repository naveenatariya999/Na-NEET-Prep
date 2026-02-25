"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, BrainCircuit, PlaySquare, ScrollText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
];

const mindMapImage = PlaceHolderImages.find(p => p.id === 'mind-map-hero');

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // फिल्टर करने का लॉजिक (Search Logic)
  const filteredFeatures = features.filter((feature) => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || feature.category === activeTab;
    return matchesSearch && matchesTab;
  });

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

              {/* --- सर्च बार अब यहाँ काम करेगा --- */}
              <div className="w-full max-w-xl mt-8 mb-4">
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="Search notes, PYQs, videos..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border-2 border-muted p-4 pl-12 rounded-2xl focus:border-primary outline-none transition-all shadow-sm group-hover:shadow-md text-foreground"
                  />
                  <Search className="absolute left-4 top-4 text-muted-foreground w-5 h-5" />
                </div>
                
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                  {['All', 'Notes', 'PYQs', 'Videos', 'Mind Maps'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-muted bg-background hover:bg-secondary'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
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
                width="600"
                height="400"
                alt="Hero"
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
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                {searchQuery ? 'Search Results' : 'Everything You Need to Succeed'}
              </h2>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
            {filteredFeatures.length > 0 ? (
              filteredFeatures.map((feature) => (
                <Card key={feature.title} className="group overflow-hidden animated-card">
                  <CardHeader className="p-0">
                    {feature.image && (
                       <Image
                          src={feature.image.imageUrl}
                          alt={feature.title}
                          width={600}
                          height={400}
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
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-xl text-muted-foreground">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
