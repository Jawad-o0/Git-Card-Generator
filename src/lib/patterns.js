export const patterns = {
  mesh: {
    name: "Metal Mesh",
    description: "Layered luminous mesh",
    style: {
      backgroundImage:
        "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.22), transparent 45%), radial-gradient(circle at 80% 15%, rgba(255,255,255,0.18), transparent 50%), radial-gradient(circle at 10% 85%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.16), transparent 60%)",
      backgroundBlendMode: "screen",
      backgroundSize: "140% 140%"
    }
  },
  noise: {
    name: "Micro Grain",
    description: "Fine brushed metal grain",
    style: {
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
      backgroundSize: "4px 4px",
      opacity: 0.85
    }
  }
};
