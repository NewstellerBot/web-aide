"use client";

import { useEffect, useRef } from "react";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas size accounting for device pixel ratio
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Set display size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Node properties with adjusted positioning
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const nodes = [
      { x: centerX - 200, y: centerY, label: "Input" },
      { x: centerX, y: centerY, label: "Process" },
      { x: centerX + 200, y: centerY, label: "Output" },
    ];

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, "rgba(147, 51, 234, 0.5)"); // Purple
    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.5)"); // Blue
    gradient.addColorStop(1, "rgba(236, 72, 153, 0.5)"); // Pink

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw connections with gradient
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.moveTo(nodes[i]!.x + 50, nodes[i]!.y);
        ctx.lineTo(nodes[i + 1]!.x, nodes[i + 1]!.y);
      }
      ctx.stroke();

      // Draw nodes with gradients
      nodes.forEach((node) => {
        // Node background with gradient
        const nodeGradient = ctx.createRadialGradient(
          node.x + 50,
          node.y + 25,
          0,
          node.x + 50,
          node.y + 25,
          60,
        );
        nodeGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        nodeGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");

        ctx.fillStyle = nodeGradient;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(node.x, node.y - 25, 100, 50, 8);
        ctx.fill();
        ctx.stroke();

        // Node label
        ctx.fillStyle = "rgb(var(--foreground))";
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x + 50, node.y);
      });
    }

    // Animation
    let offset = 0;
    function animate() {
      if (!ctx) return;
      offset = (offset + 1) % 20;
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw connections with gradient
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.moveTo(nodes[i]!.x + 50, nodes[i]!.y);
        ctx.lineTo(nodes[i + 1]!.x, nodes[i + 1]!.y);

        // Animated dot with gradient
        const dotX =
          nodes[i]!.x +
          50 +
          ((nodes[i + 1]!.x - nodes[i]!.x - 50) * ((offset + i * 7) % 20)) / 20;
        const dotGradient = ctx.createRadialGradient(
          dotX,
          nodes[i]!.y,
          0,
          dotX,
          nodes[i]!.y,
          6,
        );
        dotGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        dotGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(dotX, nodes[i]!.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.stroke();

      // Draw nodes
      nodes.forEach((node) => {
        const nodeGradient = ctx.createRadialGradient(
          node.x + 50,
          node.y + 25,
          0,
          node.x + 50,
          node.y + 25,
          60,
        );
        nodeGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
        nodeGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");

        ctx.fillStyle = nodeGradient;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(node.x, node.y - 25, 100, 50, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "rgb(var(--foreground))";
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x + 50, node.y);
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-[300px] w-full rounded-lg bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10"
    />
  );
}
