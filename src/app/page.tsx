"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Search, ArrowRight, BookOpen, ScrollText, PlaySquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. डेटाबेस से आपके असली चैप्टर्स लोड करना
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const collections = ['notes', 'pyqs', 'videos'];
        let results: any[] = [];
        for (const col of collections) {
          const snap = await getDocs(collection(db, col));
          snap.forEach(doc => results.push({ ...doc.data(), id: doc.id, type: col }));
        }
        setAllData(results);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchData();
  }, []);

  // 2. सर्च फ़िल्टर
  const filtered = allData.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <section className="w-full py-12 md:py-24 bg-card border-b">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-headline">
                Your Expert Guide to Mastering the NEET Exam
              </h1>
              
              {/* असली सर्च बार */}
              <div className="relative group max-w-md">
                <input
                  type="text"
                  placeholder="चैप्टर का नाम सर्च करें (e.g. Cell, Origin)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-4 pl-12 rounded-2xl border-2 border-muted focus:border-primary outline-none transition-all shadow-md bg-background"
                />
                <Search className="absolute left-4 top-4 text-muted-foreground" size={22} />
                {loading && <Loader2 className="absolute right-4 top-4 animate-spin text-primary" />}
              </div>
            </div>
            <Image 
              src={PlaceHolderImages.find(p => p.id === 'home-hero')?.imageUrl || ""} 
              width={600} height={400} alt="Hero" className="rounded-2xl shadow-2xl object-cover aspect-video"
            />
          </div>
        </div>
      </section>

      {/* RESULTS / STUDY MATERIAL */}
      <section className="w-full py-12">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">Study Material</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {searchQuery === "" ? (
              // डिफ़ॉल्ट लुक (जब सर्च खाली हो)
              <>
                <FeatureCard title="Curated Notes" href="/notes" icon={BookOpen} img="feature-notes" />
                <FeatureCard title="PYQ Access" href="/pyqs" icon={ScrollText} img="feature-pyqs" />
                <FeatureCard title="Video Lectures" href="/videos" icon={PlaySquare} img="feature-videos" />
              </>
            ) : (
              // सर्च रिजल्ट्स (जब आप कुछ टाइप करें)
              filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <Link key={i} href={`/${item.type}`}>
                    <Card className="hover:border-primary border-2 transition-all cursor-pointer h-full">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg text-primary">
                          {item.type === 'videos' ? <PlaySquare /> : <BookOpen />}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{item.title || item.name}</p>
                          <span className="text-xs uppercase text-muted-foreground font-bold">{item.type}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center p-12 border-2 border-dashed rounded-3xl">
                  "{searchQuery}" के नाम से कुछ नहीं मिला।
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// छोटा कार्ड कंपोनेंट
function FeatureCard({ title, href, icon: Icon, img }: any) {
  const image = PlaceHolderImages.find(p => p.id === img);
  return (
    <Card className="overflow-hidden border-2 hover:border-primary transition-all">
      <CardHeader className="p-0">
        {image && <Image src={image.imageUrl} alt={title} width={400} height={250} className="w-full aspect-video object-cover" />}
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="flex items-center gap-2 mb-4"><Icon className="text-primary" /> {title}</CardTitle>
        <Button variant="link" asChild className="p-0 text-primary font-bold">
          <Link href={href}>Explore More <ArrowRight className="ml-2" size={16} /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}
