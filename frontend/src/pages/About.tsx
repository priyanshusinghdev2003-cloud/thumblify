import SoftBackdrop from "../components/SoftBackdrop";
import { motion } from "motion/react";
import { Sparkles, Layout, Zap, Shield } from "lucide-react";

const pillars = [
  {
    icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    title: "AI Generation",
    description:
      "Create stunning thumbnails in seconds using our advanced AI algorithms.",
  },
  {
    icon: <Layout className="w-6 h-6 text-purple-500" />,
    title: "Vibrant Designs",
    description:
      "Stand out with professionally curated color palettes and layouts.",
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Hyper Fast",
    description:
      "Optimized workflow to get your content ready for publishing instantly.",
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: "Premium Quality",
    description:
      "High-resolution outputs that look great on any platform or device.",
  },
];

const About = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden ">
      <SoftBackdrop />

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

      <main className="container mx-auto px-6 pt-40 pb-20 relative z-10">
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">
              About Thumblify
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-6">
              Founded in 2026, Thumblify was born out of a simple observation:
              creators spend too much time on thumbnails and not enough on
              storytelling.
            </p>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed">
              Our mission is to democratize high-end design through artificial
              intelligence, giving every creator the tools to build a
              professional digital identity without the steep learning curve of
              traditional software.
            </p>
          </motion.div>
        </div>

        <section className="mb-32">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-2 text-white/90">
              Our Core Pillars
            </h2>
            <div className="w-12 h-1 bg-pink-600 rounded-full" />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all group"
              >
                <div className="mb-4 p-3 rounded-2xl bg-white/[0.03] w-fit group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white/80">
                  {pillar.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-[2rem] border border-white/5 bg-linear-to-br from-white/[0.03] to-transparent backdrop-blur-3xl"
          >
            <h2 className="text-3xl font-bold mb-6 text-white/90">
              Built for the next generation of creators
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              We believe that the future of content is visually driven. As
              platforms evolve, the first impression matters more than ever.
              Thumblify is more than just a tool; it's a partner in your
              creative journey, constantly evolving to meet the demands of the
              modern web.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default About;
