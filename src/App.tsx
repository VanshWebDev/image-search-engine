import { useEffect, useState } from "react";
import { Search, Loader2, Download } from "lucide-react";

interface UserProfile {
  name: string;
  profile_image?: {
    small?: string;
  };
}

interface ImageUrls {
  small: string;
}

interface ImageResult {
  id: string;
  urls: ImageUrls;
  alt_description?: string;
  description?: string;
  likes: number;
  user: UserProfile;
  links?: {
    download?: string;
  };
}

function App() {
  const [input, setInput] = useState<string>("nature");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const apiKey = import.meta.env.VITE_API_URL;

  const fetchImages = async (
    query: string,
    pageNum: number = 1,
    append: boolean = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://api.unsplash.com/search/photos?page=${pageNum}&query=${query}&client_id=${apiKey}&per_page=30`
      );
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      if (append) {
        setResults([...results, ...(data.results || [])]);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      setError("Failed to load images. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(input, 1, false);
    setPage(1);
  }, []);

  const handleSearch = () => {
    if (input.trim()) {
      fetchImages(input, 1, false);
      setPage(1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  function shortenText(text: string | null | undefined, maxWords = 5): string {
    if (!text) return "No description";
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-sm bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Image Gallery
            </h1>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search images..."
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-sm hover:shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">
              No images found. Try a different search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {results.map((model, i) => (
                <div
                  key={model.id || i}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200"
                >
                  {/* Image Container */}
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                    <img
                      src={model.urls.small}
                      alt={model.alt_description || "image"}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                      {shortenText(model.alt_description)}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                      {shortenText(model.description, 10)}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {model.user.profile_image?.small && (
                          <img
                            src={model.user.profile_image.small}
                            alt={model.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-xs text-gray-600 truncate">
                          {model.user.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-500">
                          {model.likes} ❤️
                        </div>
                        {model.links?.download && (
                          <a
                            href={`${model.links.download}&force=true`}
                            download
                            // target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-600 transition"
                            title="Download image"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchImages(input, nextPage, true);
                }}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
