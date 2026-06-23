"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

// 激活模式：IntersectionObserver 自动播放（静音循环）或用户点击播放（带声音）
type ActivationMode = "auto" | "manual";

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activated, setActivated] = useState<ActivationMode | null>(null);
  const [
    thumbSrc,
    setThumbSrc,
  ] = useState(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 自动播放：静音 + 循环（IntersectionObserver 进入视口触发）
  const autoplayEmbed = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  // 用户点击播放：带声音（用户手势满足浏览器音频自动播放策略）
  const clickEmbed = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`,
    [videoId],
  );

  // IntersectionObserver：滚动进入视口时自动激活
  useEffect(() => {
    if (!containerRef.current || activated) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            setActivated("auto");
          }
        }
      },
      { threshold: [0.45, 0.5] },
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activated]);

  // 缩略图回退：maxresdefault → hqdefault
  useEffect(() => {
    const probe = new Image();
    probe.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    probe.onerror = () => {
      setThumbSrc(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    };
  }, [videoId]);

  const embedSrc = activated === "manual" ? clickEmbed : autoplayEmbed;

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {activated ? (
          <iframe
            key={embedSrc}
            className="absolute top-0 left-0 w-full h-full"
            src={embedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbSrc}
              alt={title}
              className="absolute top-0 left-0 h-full w-full object-cover"
              loading="lazy"
            />
            <button
              type="button"
              onClick={() => setActivated("manual")}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
              aria-label={`Play ${title}`}
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] transition-colors hover:bg-[hsl(var(--nav-theme)/0.9)] md:h-20 md:w-20">
                <Play
                  className="ml-1 h-7 w-7 text-white md:h-8 md:w-8"
                  fill="currentColor"
                />
              </span>
            </button>
          </>
        )}
      </div>

      {/* SSR/无 JS 回退：直接显示可播放 iframe，保证爬虫和无 JS 客户端可见 */}
      {!activated && (
        <noscript>
          <iframe
            className="w-full rounded-lg"
            style={{ aspectRatio: "16 / 9" }}
            src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </noscript>
      )}

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
