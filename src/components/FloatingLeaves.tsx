const FloatingLeaves = () => {
  const leaves = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${12 + Math.random() * 8}s`,
    size: 10 + Math.random() * 14,
    opacity: 0.15 + Math.random() * 0.15,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <svg
          key={leaf.id}
          className="leaf-particle absolute"
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            opacity: leaf.opacity,
          }}
          width={leaf.size}
          height={leaf.size}
          viewBox="0 0 24 24"
          fill="hsl(120, 75%, 23%)"
        >
          <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
        </svg>
      ))}
    </div>
  );
};

export default FloatingLeaves;
