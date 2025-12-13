import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiZap, FiPenTool } from "react-icons/fi";
import { Link } from "react-router";

const IMAGE_URLS = {
  main: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLLUDPisZFj5AwBPFA6yCse_EcuKvMvwSY6VjDIy94VZ343DVTeZr-ewRsrvhTXngUCmBqsly_uHp3Qb-SU1eRMZm-Y_diQ3yAUsngCoz9K0SiGdTcCy22T9wlMzjrEnQB6Pg7TH6Gs5K-yJ5KiTVGMQ9DR9NHW-df4wJjUDga3Xe_7Jr4u3l5T3UVmF7jwnl6b9QFJRqRFMP0Gy0k9uH73wZTMWfDroPHyHUQmXLcZo9atx8B5duGG-J7a3PgEIe-esLcfb-vb9E",
  accent1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCCJWXWFiFBj3351ssN3FC6AQiBFGxG8xlW2vPCYToTosGVwdJhkdi8OSYs4vJvbcwqFGy6fYh03ahqeL1YibozuuRJNiYdZn-TJ4ZdvvixhX53R4gG3Az9oXNwkrMH1c_qL_FzPCsyLf2o_BooXeP_zCeMJs7NenibLyCoajYMRsg6YxTsGuYCIwc-zGd-C5Gp_SR2Mf3pcmmyOBFZotuYFDMAyeXQPK03Lfp-TrLxg0_kWZ0z_ft8sSs67xcB9jz0wpfKb0e8arA",
  accent2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD8BfzgguLsA9vTuhmJ4rKKCo4IFXB-TUJRM_ekekrwIZ8KmklCFgno2WUR24uiIR20LoNqLpi21L0XnYl_n88LdaOTTozuKiV-lWhYLiYPz_b4Fwsf0SODuIaPKHOj5JPbWVxEroI8aHRR2R0ga2I6z-8h46sw7MAAgIZOoqfUqFECIt56pIUrOprF1HqZH8DeJe7cJEnFHwPQY1WlXYoOcXvNI0q4-Ir_A13gZAXDOrxi4TSs37EUhIQCfwOAqgAykV8xzMmpsOc",
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const imageGroup = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.5,
      ease: [0.6, 0.01, 0.05, 0.9],
      staggerChildren: 0.2,
    },
  },
};

const imageChild = {
  hidden: { opacity: 0, y: 50, rotate: 2 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.9 } },
};

const Hero = () => {
  return (
    <motion.section
      className="w-full h-screen min-h-[600px] bg-base-100 flex items-center relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${IMAGE_URLS.main})` }}
      ></div>
      <div className="absolute inset-0 bg-linear-to-t from-base-100/65 via-base-100/50 to-base-100/65 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="flex flex-col gap-8 pt-20 lg:pt-0">
          <motion.div variants={item}>
            <h2 className="text-lg font-semibold text-primary/80 uppercase tracking-[0.25em] mb-2">
              LuxePlan - Design & Innovation
            </h2>
          </motion.div>

          <motion.div variants={item}>
            <h1 className="text-4xl md:text-6xl font-black! font-serif leading-tight  text-gold-gradient">
              Bespoke <br /> Luxury Living.
            </h1>
          </motion.div>

          <motion.div variants={item}>
            <p className="max-w-md text-xl font-light text-base-content/70 mt-4 border-l-4 border-primary/50 pl-4">
              Seamlessly blending artistic interior design with intuitive,
              cutting-edge smart home technology for unparalleled elegance.
            </p>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap gap-4 mt-6">
            <span className="badge badge-lg badge-outline badge-primary p-4 gap-2 bg-primary/10 ">
              <FiPenTool size={18} /> Artistic Decor
            </span>
            <span className="badge badge-lg badge-outline badge-info p-4 gap-2 bg-info/10">
              <FiZap size={18} /> Smart Integration
            </span>
          </motion.div>

          <motion.div variants={item}>
            <Link
              to="/services"
              className="btn btn-primary btn-lg shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-[1.05] hover:shadow-primary/70 mt-8 group"
            >
              Explore Our Packages
              <FiArrowRight
                size={22}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="relative hidden lg:block aspect-4/3 rounded-2xl"
          variants={imageGroup}
        >
          <motion.img
            src={IMAGE_URLS.main}
            alt="Luxury Interior Design"
            className="w-full h-full object-cover rounded-2xl shadow-2xl ring-4 ring-white/10 ring-offset-4 ring-offset-base-100"
            variants={imageChild}
          />

          <motion.div
            className="absolute -top-10 right-0 w-64 h-40 bg-cover bg-center rounded-xl shadow-2xl border-4 border-primary/50"
            style={{ backgroundImage: `url(${IMAGE_URLS.accent1})` }}
            variants={imageChild}
            whileHover={{
              scale: 1.1,
              rotate: 3,
              zIndex: 10,
              transition: { type: "spring", stiffness: 300 },
            }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-sm font-bold text-white opacity-0 hover:opacity-100 transition-opacity">
              Ceremony Decor
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-10 left-0 w-64 h-40 bg-cover bg-center rounded-xl shadow-2xl border-4 border-info/50"
            style={{ backgroundImage: `url(${IMAGE_URLS.accent2})` }}
            variants={imageChild}
            whileHover={{
              scale: 1.1,
              rotate: -3,
              zIndex: 10,
              transition: { type: "spring", stiffness: 300 },
            }}
          >
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-sm font-bold text-white opacity-0 hover:opacity-100 transition-opacity">
              Smart Home Tech
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
