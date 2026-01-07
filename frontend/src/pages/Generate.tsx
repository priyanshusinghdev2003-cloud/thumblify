import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle,
} from "../assets/assets";
import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import { motion } from "framer-motion";
import PreviewPanel from "../components/PreviewPanel";
import { useAuth } from "../context/authContext";
import api from "../config/api";
import toast from "react-hot-toast";

export const Generate = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [loading, setLoading] = useState(false);
  const [colorSchemeId, setColorSchemeId] = useState<string>(
    colorSchemes[0].id
  );
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      return toast.error("Please login to generate thumbnail", {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
    }
    try {
      if (!title.trim()) {
        return toast.error("Please enter title", {
          style: {
            borderRadius: "10px",
            background: "#363636",
            color: "#fff",
          },
        });
      }
      setLoading(true);
      const api_payload = {
        title,
        style,
        aspectRatio,
        text_overlay: true,
        color_schema: colorSchemes[colorSchemeId as keyof typeof colorSchemes],
        prompt: additionalDetails,
      };
      const { data } = await api.post("/thumbnail/generate", api_payload);
      if (data?.thumbnail) {
        navigate(`/generate/${data?.thumbnail._id}`);
        toast.success(data?.message || "Thumbnail generated successfully", {
          style: {
            borderRadius: "10px",
            background: "#363636",
            color: "#fff",
          },
        });
      }
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong or limit has been exceeded", {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    try {
      if (id) {
        const { data }: any = await api.get(`/user/thumbnails/${id}`);
        setThumbnail(data?.thumbnail);
        setAdditionalDetails(data?.thumbnail?.user_prompt);
        setTitle(data?.thumbnail?.title);
        setColorSchemeId(data?.thumbnail?.color_schema);
        setAspectRatio(data?.thumbnail?.aspectRatio);
        setStyle(data?.thumbnail?.style);
        setLoading(!data?.thumbnail.image_url);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong or limit has been exceeded", {
        style: {
          borderRadius: "10px",
          background: "#363636",
          color: "#fff",
        },
      });
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn && id) {
      fetchThumbnail();
    }
    if (id && loading && isLoggedIn) {
      const interval = setInterval(() => {
        fetchThumbnail();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [id, loading, isLoggedIn]);

  useEffect(() => {
    if (!id && thumbnail) {
      setThumbnail(null);
    }
  }, [pathname]);

  return (
    <>
      <SoftBackdrop />
      <motion.div
        className="pt-24 min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left panel */}
            <div className={`space-y-6 ${id && "pointer-events-none"}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div className="">
                  <h2 className="text-xl font-bold text-zinc-100">
                    Create your thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI bring it to life
                  </p>
                </div>
                <div className="space-y-5">
                  {/* title input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 10 Tips for better sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={title}
                      maxLength={100}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {title.length}/100
                      </span>
                    </div>
                  </div>
                  {/* Aspect Ratio Selector */}
                  <AspectRatioSelector
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />
                  {/* style selector */}
                  <StyleSelector
                    isOpen={styleDropdownOpen}
                    setIsOpen={setStyleDropdownOpen}
                    value={style}
                    onChange={setStyle}
                  />
                  {/* color schema selector */}
                  <ColorSchemeSelector
                    value={colorSchemeId}
                    onChange={setColorSchemeId}
                  />
                  {/* additional details */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additional Prompts{" "}
                      <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      placeholder="Add any specific elements, mood,or style preferences.."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/6 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                      value={additionalDetails}
                      rows={3}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                    />
                  </div>
                </div>
                {/* Button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating..." : "Generate"}
                  </button>
                )}
              </div>
            </div>
            {/* Right panel */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold mb-4 text-zinc-100">
                  Preview
                </h2>
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspect={aspectRatio}
                />
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </>
  );
};
