"use client";
import { useState, useEffect } from 'react';
import { Search, FileText, Loader2, ArrowRight } from 'lucide-react';

// --- आपकी GitHub जानकारी यहाँ सेट है ---
const REPO_OWNER = "naveenatariya999"; 
const REPO_NAME = "Na-NEET-Prep"; 
const FOLDER_PATH = "public"; // आप अपनी PDF फाइलें सीधा 'public' फोल्डर में अपलोड करें

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FOLDER_PATH}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const filtered = data
            .filter(file => file.name.toLowerCase().endsWith(".pdf"))
            .map(file => ({
              // फाइल का नाम सुंदर बनाएगा (e.g. Principles-of-Inheritance.pdf -> Principles of Inheritance)
              title: file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "), 
              link: `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${file.path}`,
            }));
          setFiles(filtered);
        }
      } catch (error) {
        console.error("Error loading files:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, []);

  const results = files.filter(file => 
    file.title.toLowerCase().includes(query.toLowerCase()) && query !== ""
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f8fafc] p-6">
      <div className="w-full max-w-2xl mt-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Na-NEET Search</h1>
          <p className="text-slate-500">Search PDFs directly from GitHub folder</p>
        </div>
        
        <div className="relative shadow-lg rounded-2xl overflow-hidden border-2 border-white focus-within:border-blue-500">
          <input 
            type="text" 
            placeholder="चैप्टर का नाम सर्च करें..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-6 pl-16 text-lg outline-none bg-white"
          />
          <div className="absolute left-6 top-6">
            {loading ? <Loader2 className="animate-spin text-blue-500" /> : <Search className="text-slate-400" />}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {results.map((file, index) => (
            <a 
              key={index} 
              href={file.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <FileText className="text-red-500" size={24} />
                <p className="font-bold text-slate-800 capitalize">{file.title}</p>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </a>
          ))}

          {query !== "" && results.length === 0 && !loading && (
            <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
               "{query}" के नाम से कोई PDF नहीं मिली।
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
