import { Link, useNavigate } from "react-router-dom";
import { type IThumbnail } from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, Download, TrashIcon } from "lucide-react";
import api from "../config/api";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

function MyGeneration() {
  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
    "1:1": "aspect-square",
  };
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const getThumbnails = async () => {
    try {
      const { data } = await api.get("/user/thumbnails");
      setThumbnails(data?.thumbnail);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching thumbnails:", error);
      setLoading(false);
    }
  };

  const handleDownload = (image_url: string) => {
    const link = document.createElement("a");
    link.href = image_url.replace("/upload", "/upload/fl_attachment");

    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDelete = async (id: string) => {
    try {
      const { data } = await api.delete(`/thumbnail/delete/${id}`);
      toast.success(data?.message, {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
      if (data?.updatedThumbnails) {
        setThumbnails(data?.updatedThumbnails);
      }
    } catch (error) {
      console.error("Error deleting thumbnail:", error);
      toast.error("Failed to delete thumbnail", {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getThumbnails();
    }
  }, [isLoggedIn]);
  return (
    <>
      <SoftBackdrop />
      <motion.div
        className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
          <p className="mt-1 text-sm text-zinc-400">
            View and manage your AI-generated thumbnails
          </p>
        </div>
        {/* loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl h-[260px] w-full animate-pulse bg-white/6 border border-white/10 "
              />
            ))}
          </div>
        )}
        {/* empty */}
        {!loading && thumbnails.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-lg font-semibold text-zinc-200">
              No thumbnails yet
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Generate some thumbnails to get started.
            </p>
          </div>
        )}
        {/* Grid */}
        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 2xl:columns-4">
            {thumbnails.map((thumbnail) => {
              const aspectRatioClass =
                aspectRatioClassMap[thumbnail?.aspect_ratio || "16:9"];
              return (
                <div
                  key={thumbnail._id}
                  onClick={() => navigate(`/generate/${thumbnail._id}`)}
                  className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6 border border-white/10 transition shadow-xl break-inside-avoid"
                >
                  <div
                    className={`relative overflow-hidden rounded-t-2xl bg-black ${aspectRatioClass}`}
                  >
                    {thumbnail.image_url ? (
                      <img
                        src={thumbnail.image_url}
                        alt={thumbnail.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm text-zinc-400">
                        {thumbnail.isGenerating ? "Generating..." : "No image"}
                      </div>
                    )}
                    {thumbnail.isGenerating && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium text-white">
                        Generating...
                      </div>
                    )}
                  </div>
                  {/* content */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2">
                      {thumbnail.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumbnail.style}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumbnail.color_scheme}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/8">
                        {thumbnail.aspect_ratio}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      {new Date(thumbnail.createdAt!).toDateString()}
                    </p>
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 max-sm:flex sm:hidden  group-hover:flex gap-1.5"
                  >
                    <TrashIcon
                      onClick={() => handleDelete(thumbnail._id)}
                      className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                    />
                    <Download
                      onClick={() => handleDownload(thumbnail.image_url!)}
                      className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all"
                    />
                    <Link
                      target="_blank"
                      to={`/preview?thumbnail_url=${thumbnail.image_url}&title=${thumbnail.title}`}
                    >
                      <ArrowUpRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-pink-600 transition-all" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </>
  );
}

export default MyGeneration;
