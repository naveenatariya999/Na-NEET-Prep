"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase'; // आपका फायरबेस कॉन्फिग
import { collection, query, getDocs } from 'firebase/firestore';
import { ArrowRight, Search, FileText, PlaySquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Firestore से सारा डेटा एक बार लोड करना (Notes, PYQs, Videos)
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const collections = ['notes', 'pyqs', 'videos'];
        let combinedData: any[] = [];

        for (const colName of collections) {
          const q = query(collection(db, colName));
          const snapshot = await getDocs(q);
          snapshot.forEach(doc => {
            combinedData.push({ id: doc.id, ...doc.data(), type: colName });
          });
        }
        setAllData(combinedData);
      } catch (e) {
        console.error("Data load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // सर्च फिल्टर: जो आप टाइप करेंगे वो यहाँ मैच होगा
  const filteredResults = allData.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* HERO SECTION - आपका असली लुक */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 border-b">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl font-headline">
                Your Expert Guide to Mastering the NEET Exam
              </h1>
              <p className="text-muted-foreground md:text-xl max-w-[600px]">
                Access high-quality curated content, previous year questions, and visual mind maps.
              </p>

              {/* सर्च बार - अब यह काम करेगा! */}
              <div className="relative max-w-md mt-8">
                <input
                  type="text"
                  placeholder="Search chapters (e.g. Origin, Biomolecules)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 border-2 border-transparent focus:border-primary p-4 pl-12 rounded-2xl outline-none transition-all"
                />
                <Search className="absolute left-4 top-4 text-muted-foreground" size={20} />
                {loading && <Loader2 className="absolute right-4 top-4 animate-spin text-primary" size={20} />}
              </div>
            </div>
            
            <Image
              src={PlaceHolderImages.find(p => p.id === 'home-hero')?.imageUrl || "/hero.jpg"}
              width={600} height={400} alt="NEET Prep"
              className="rounded-3xl shadow-2xl object-cover aspect-video"
            />
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS SECTION */}
      <section className="w-full py-12 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Study Material</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {searchQuery !== "" ? (
              filteredResults.length > 0 ? (
                filteredResults.map((item, idx) => (
                  <Link key={idx} href={`/${item.type}`}>
                    <Card className="hover:shadow-lg transition-all border-2 hover:border-primary group cursor-pointer">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          {item.type === 'videos' ? <PlaySquare /> : <FileText />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg group-hover:text-primary transition-colors">
                            {item.title || item.name}
                          </p>
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {item.type}
                          </span>
                        </div>
                        <ArrowRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12 border-2 border-dashed rounded-3xl">
                  <p className="text-muted-foreground italic">"{searchQuery}" के नाम से कुछ नहीं मिला।</p>
                </div>
              )
            ) : (
              // जब सर्च खाली हो, तो पुराने डिफ़ॉल्ट कार्ड्स दिखाएं
              <div className="col-span-full text-center text-muted-foreground">
                ऊपर सर्च बार में चैप्टर का नाम टाइप करें।
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
