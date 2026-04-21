export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const sectionInView = {
  hidden: { opacity: 0, y: 80, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};
