"use client";

import { useState, Suspense, lazy } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Sparkles,
  Ticket,
  Compass,
  Trophy,
  Users,
  Dna,
  Zap,
  Map as MapIcon,
  Newspaper,
  RefreshCw,
  Dice5,
  Target,
  ListOrdered,
  Crosshair,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Shared module header: eyebrow chip + icon + title + intro
function ModuleHeader({
  eyebrow,
  Icon,
  title,
  intro,
  locale,
  linkKey,
  moduleLinkMap,
}: {
  eyebrow: string;
  Icon: LucideIcon;
  title: string;
  intro: string;
  locale: string;
  linkKey: string;
  moduleLinkMap: ModuleLinkMap;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-medium">{eyebrow}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <LinkedTitle linkData={moduleLinkMap[linkKey]} locale={locale}>
          {title}
        </LinkedTitle>
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

// Tier color styles use theme color opacity (no hardcoded hex)
const TIER_STYLES: Record<string, string> = {
  SS: "border-l-[hsl(var(--nav-theme))] bg-[hsl(var(--nav-theme)/0.14)]",
  "S+": "border-l-[hsl(var(--nav-theme)/0.8)] bg-[hsl(var(--nav-theme)/0.10)]",
  S: "border-l-[hsl(var(--nav-theme)/0.6)] bg-[hsl(var(--nav-theme)/0.07)]",
  A: "border-l-[hsl(var(--nav-theme)/0.45)] bg-[hsl(var(--nav-theme)/0.04)]",
  "13.5":
    "border-l-[hsl(var(--nav-theme-light))] bg-[hsl(var(--nav-theme-light)/0.08)]",
};

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://animevanguardswiki.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Anime Vanguards Wiki",
        description:
          "Complete Anime Vanguards Wiki covering codes, tier list, units, traits, evolutions, stages, raids, and update guides for the Roblox anime tower defense game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Vanguards - Roblox Anime Tower Defense",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Anime Vanguards Wiki",
        alternateName: "Anime Vanguards",
        url: siteUrl,
        description:
          "Complete Anime Vanguards Wiki resource hub for codes, tier list, units, traits, evolutions, raids, and update guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Vanguards Wiki - Roblox Anime Tower Defense",
        },
        sameAs: [
          "https://www.roblox.com/games/16146832113/Anime-Vanguards",
          "https://discord.com/invite/animevanguards",
          "https://www.youtube.com/@animevanguardsofficial",
          "https://x.com/Kitawari_",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Anime Vanguards",
        gamePlatform: ["Web Browser", "Roblox"],
        applicationCategory: "Game",
        genre: ["Tower Defense", "Strategy", "Anime"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/16146832113/Anime-Vanguards",
        },
      },
      {
        "@type": "VideoObject",
        name: "Anime Vanguards | RELEASE TRAILER",
        description:
          "Official Anime Vanguards release trailer showcasing gameplay, units, and tower defense action for Roblox.",
        uploadDate: "2026-03-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/XzCZRIRCuJ0",
        url: "https://www.youtube.com/watch?v=XzCZRIRCuJ0",
      },
    ],
  };

  // FAQ accordion state
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/16146832113/Anime-Vanguards"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="XzCZRIRCuJ0"
              title="Anime Vanguards | RELEASE TRAILER"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards (位于视频区之后、Latest Updates 之前) */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                "codes",
                "beginner-guide",
                "unit-tier-list",
                "units-guide",
                "traits",
                "evolutions",
                "game-modes",
                "updates",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Codes"
            Icon={Ticket}
            title={t.modules.animeVanguardsCodes.title}
            intro={t.modules.animeVanguardsCodes.intro}
            locale={locale}
            linkKey="animeVanguardsCodes"
            moduleLinkMap={moduleLinkMap}
          />

          {t.modules.animeVanguardsCodes.lastChecked && (
            <div className="text-center mb-8 md:mb-10 scroll-reveal">
              <span className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground px-3 py-1.5 rounded-full bg-white/5 border border-border">
                <Clock className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                {t.modules.animeVanguardsCodes.lastChecked}
              </span>
            </div>
          )}

          {/* Active + Expired Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
            <div className="scroll-reveal">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                <h3 className="font-bold text-lg md:text-xl">Active Codes</h3>
              </div>
              <div className="space-y-3">
                {t.modules.animeVanguardsCodes.activeCodes.map(
                  (c: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <code className="font-mono font-bold text-[hsl(var(--nav-theme-light))]">
                          {c.code}
                        </code>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {c.rewards}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.requirement}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="scroll-reveal">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-bold text-lg md:text-xl">
                  Recently Expired Codes
                </h3>
              </div>
              <div className="space-y-3">
                {t.modules.animeVanguardsCodes.expiredCodes.map(
                  (c: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 border border-border rounded-xl opacity-70"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <code className="font-mono font-bold line-through">
                          {c.code}
                        </code>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.rewards}</p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Redeem Steps */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg md:text-xl">How to Redeem Codes</h3>
            </div>
            <div className="space-y-3">
              {t.modules.animeVanguardsCodes.redeemSteps.map(
                (step: any, i: number) => (
                  <div
                    key={i}
                    className="flex gap-3 md:gap-4 p-4 md:p-5 bg-white/5 border border-border rounded-xl"
                  >
                    <div className="flex h-9 w-9 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-sm md:text-base font-bold text-[hsl(var(--nav-theme-light))]">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Reward Types */}
          <div className="scroll-reveal">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg md:text-xl">Common Code Rewards</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {t.modules.animeVanguardsCodes.rewardTypes.map(
                (r: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <h4 className="font-bold mb-1 text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`animeVanguardsCodes::rewardTypes::${i}`]
                        }
                        locale={locale}
                      >
                        {r.name}
                      </LinkedTitle>
                    </h4>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Beginner Guide"
            Icon={Compass}
            title={t.modules.animeVanguardsBeginnerGuide.title}
            intro={t.modules.animeVanguardsBeginnerGuide.intro}
            locale={locale}
            linkKey="animeVanguardsBeginnerGuide"
            moduleLinkMap={moduleLinkMap}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.animeVanguardsBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `animeVanguardsBeginnerGuide::steps::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.animeVanguardsBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 3: Unit Tier List */}
      <section id="unit-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Tier List"
            Icon={Trophy}
            title={t.modules.animeVanguardsUnitTierList.title}
            intro={t.modules.animeVanguardsUnitTierList.intro}
            locale={locale}
            linkKey="animeVanguardsUnitTierList"
            moduleLinkMap={moduleLinkMap}
          />

          <div className="scroll-reveal space-y-4 md:space-y-5">
            {t.modules.animeVanguardsUnitTierList.tiers.map(
              (tier: any, ti: number) => (
                <div
                  key={ti}
                  className={`rounded-xl border border-border border-l-4 p-4 md:p-6 ${TIER_STYLES[tier.tier] || "border-l-[hsl(var(--nav-theme)/0.4)] bg-white/5"}`}
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-xl md:text-2xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {tier.tier}
                    </span>
                    <h3 className="font-bold text-lg md:text-xl">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `animeVanguardsUnitTierList::tiers::${ti}`
                          ]
                        }
                        locale={locale}
                      >
                        {tier.tierLabel}
                      </LinkedTitle>
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {tier.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                    {tier.units.map((u: any, ui: number) => (
                      <div
                        key={ui}
                        className="p-3 bg-white/5 border border-border rounded-lg"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-sm">{u.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                            {u.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{u.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 4: Units Guide */}
      <section
        id="units-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Units"
            Icon={Users}
            title={t.modules.animeVanguardsUnitsGuide.title}
            intro={t.modules.animeVanguardsUnitsGuide.intro}
            locale={locale}
            linkKey="animeVanguardsUnitsGuide"
            moduleLinkMap={moduleLinkMap}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.animeVanguardsUnitsGuide.cards.map(
              (card: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-lg">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[
                            `animeVanguardsUnitsGuide::cards::${index}`
                          ]
                        }
                        locale={locale}
                      >
                        {card.title}
                      </LinkedTitle>
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {card.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-1.5 text-[hsl(var(--nav-theme-light))]">
                    {card.units}
                  </p>
                  {card.rarity && (
                    <p className="text-xs text-muted-foreground mb-1">
                      Rarity: {card.rarity}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mb-2">
                    <span className="font-medium text-foreground">How to get:</span>{" "}
                    {card.howToGet}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Investment:</span>{" "}
                    {card.investmentNote}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Traits Guide */}
      <section id="traits" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Traits & Rerolls"
            Icon={Dna}
            title={t.modules.animeVanguardsTraitsGuide.title}
            intro={t.modules.animeVanguardsTraitsGuide.intro}
            locale={locale}
            linkKey="animeVanguardsTraitsGuide"
            moduleLinkMap={moduleLinkMap}
          />

          <div className="scroll-reveal space-y-3">
            {t.modules.animeVanguardsTraitsGuide.items.map(
              (item: any, index: number) => {
                const labels =
                  t.modules.animeVanguardsTraitsGuide.labels || {};
                const itemIcons = [
                  RefreshCw,
                  Dice5,
                  Target,
                  ListOrdered,
                  Crosshair,
                ];
                const ItemIcon = itemIcons[index] || Dna;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-xl overflow-hidden bg-white/5"
                  >
                    <button
                      onClick={() =>
                        setFaqExpanded(faqExpanded === index ? null : index)
                      }
                      className="w-full flex items-center gap-3 justify-between p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="flex items-center gap-3 font-semibold text-sm md:text-base">
                        <ItemIcon className="w-5 h-5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `animeVanguardsTraitsGuide::items::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {item.heading}
                        </LinkedTitle>
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`}
                      />
                    </button>
                    {faqExpanded === index && (
                      <div className="px-4 md:px-5 pb-5 md:pb-6 text-sm text-muted-foreground space-y-4">
                        <p className="text-foreground/90">{item.content}</p>

                        {/* Key points */}
                        {Array.isArray(item.keyPoints) &&
                          item.keyPoints.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">
                                {labels.keyPoints}
                              </p>
                              <ul className="space-y-1.5">
                                {item.keyPoints.map((p: string, i: number) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-2"
                                  >
                                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                    <span>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* Trait roll pool */}
                        {Array.isArray(item.traits) &&
                          item.traits.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {item.traits.map((tr: any, i: number) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-border"
                                >
                                  <span className="font-semibold text-foreground text-sm min-w-[5.5rem]">
                                    {tr.name}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                                    {tr.chance}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex-1">
                                    {tr.role}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Pity targets */}
                        {Array.isArray(item.pity) &&
                          item.pity.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {item.pity.map((p: any, i: number) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-border text-sm"
                                >
                                  <span className="font-semibold text-foreground">
                                    {p.trait}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)]">
                                    {labels.pity}: {p.pity}
                                  </span>
                                </span>
                              ))}
                            </div>
                          )}

                        {/* Priority order */}
                        {Array.isArray(item.priorityOrder) &&
                          item.priorityOrder.length > 0 && (
                            <ol className="space-y-2">
                              {item.priorityOrder.map((p: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-3"
                                >
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                                    {i + 1}
                                  </span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ol>
                          )}

                        {/* Role-based matching */}
                        {Array.isArray(item.roleMatches) &&
                          item.roleMatches.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.roleMatches.map((rm: any, i: number) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg bg-white/5 border border-border"
                                >
                                  <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">
                                    {rm.role}
                                  </p>
                                  <p className="text-sm font-semibold text-foreground mb-1">
                                    {rm.bestTraits}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {rm.reason}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Evolutions Guide */}
      <section
        id="evolutions"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Evolutions"
            Icon={Zap}
            title={t.modules.animeVanguardsEvolutionsGuide.title}
            intro={t.modules.animeVanguardsEvolutionsGuide.intro}
            locale={locale}
            linkKey="animeVanguardsEvolutionsGuide"
            moduleLinkMap={moduleLinkMap}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.animeVanguardsEvolutionsGuide.steps.map(
              (step: any, index: number) => {
                const labels =
                  t.modules.animeVanguardsEvolutionsGuide.labels || {};
                return (
                  <div
                    key={index}
                    className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                      <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `animeVanguardsEvolutionsGuide::steps::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {step.title}
                        </LinkedTitle>
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3">
                        {step.description}
                      </p>

                      {/* Checklist */}
                      {Array.isArray(step.checklist) &&
                        step.checklist.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">
                              {labels.checklist}
                            </p>
                            <ul className="space-y-1.5">
                              {step.checklist.map((c: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">
                                    {c}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Examples */}
                      {Array.isArray(step.examples) &&
                        step.examples.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">
                              {labels.examples}
                            </p>
                            <ul className="space-y-1.5">
                              {step.examples.map((e: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <ArrowRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">
                                    {e}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Resource notes */}
                      {Array.isArray(step.resourceNotes) &&
                        step.resourceNotes.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-2">
                              {labels.resourceNotes}
                            </p>
                            <ul className="space-y-1.5">
                              {step.resourceNotes.map((r: string, i: number) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">
                                    {r}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Ascension bonuses */}
                      {Array.isArray(step.ascensionBonuses) &&
                        step.ascensionBonuses.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {step.ascensionBonuses.map((ab: any, i: number) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm"
                              >
                                <span className="font-semibold text-foreground">
                                  {ab.level}
                                </span>
                                <span className="text-[hsl(var(--nav-theme-light))] font-medium">
                                  {ab.bonus}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}

                      {/* Result */}
                      {step.result && (
                        <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)] mb-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                            {labels.result}
                          </p>
                          <p className="text-sm text-foreground/90">
                            {step.result}
                          </p>
                        </div>
                      )}

                      {/* Safety rule (emphasized with theme accent border) */}
                      {step.safetyRule && (
                        <div className="p-3 rounded-lg border-l-4 border-[hsl(var(--nav-theme))] bg-[hsl(var(--nav-theme)/0.12)] mb-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                            {labels.safetyRule}
                          </p>
                          <p className="text-sm text-foreground/90">
                            {step.safetyRule}
                          </p>
                        </div>
                      )}

                      {/* Best use */}
                      {step.bestUse && (
                        <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                            {labels.bestUse}
                          </p>
                          <p className="text-sm text-foreground/90">
                            {step.bestUse}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Game Modes Guide */}
      <section id="game-modes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Game Modes"
            Icon={MapIcon}
            title={t.modules.animeVanguardsGameModesGuide.title}
            intro={t.modules.animeVanguardsGameModesGuide.intro}
            locale={locale}
            linkKey="animeVanguardsGameModesGuide"
            moduleLinkMap={moduleLinkMap}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.animeVanguardsGameModesGuide.modes.map(
              (mode: any, index: number) => {
                const labels =
                  t.modules.animeVanguardsGameModesGuide.labels || {};
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="font-bold text-lg">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[
                              `animeVanguardsGameModesGuide::modes::${index}`
                            ]
                          }
                          locale={locale}
                        >
                          {mode.name}
                        </LinkedTitle>
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                        {mode.type}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                          {labels.purpose}
                        </p>
                        <p className="text-muted-foreground">{mode.purpose}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                          {labels.whatPlayersDo}
                        </p>
                        <p className="text-muted-foreground">
                          {mode.description}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                          {labels.teamFocus}
                        </p>
                        <p className="text-muted-foreground">
                          {mode.teamFocus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                          {labels.keyRewards}
                        </p>
                        <p className="text-muted-foreground">
                          {mode.keyRewards}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                        {labels.farmWhen}
                      </p>
                      <p className="text-sm text-foreground/90">
                        {mode.farmWhen}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 8: Updates and Events */}
      <section
        id="updates"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow="Updates & Events"
            Icon={Newspaper}
            title={t.modules.animeVanguardsUpdates.title}
            intro={t.modules.animeVanguardsUpdates.intro}
            locale={locale}
            linkKey="animeVanguardsUpdates"
            moduleLinkMap={moduleLinkMap}
          />

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.animeVanguardsUpdates.entries.map(
              (entry: any, index: number) => {
                const labels = t.modules.animeVanguardsUpdates.labels || {};
                return (
                  <div key={index} className="relative">
                    <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                    <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {entry.version && (
                          <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                            {entry.version}
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                          {entry.type}
                        </span>
                        {entry.date && (
                          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {entry.date}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold mb-2 text-base md:text-lg">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[`animeVanguardsUpdates::entries::${index}`]
                          }
                          locale={locale}
                        >
                          {entry.title}
                        </LinkedTitle>
                      </h3>

                      {/* Highlights */}
                      {Array.isArray(entry.highlights) &&
                        entry.highlights.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">
                              {labels.highlights}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {entry.highlights.map((h: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 rounded-md bg-white/5 border border-border"
                                >
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        {/* New units */}
                        {Array.isArray(entry.newUnits) &&
                          entry.newUnits.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">
                                {labels.newUnits}
                              </p>
                              <ul className="space-y-1">
                                {entry.newUnits.map((u: string, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-muted-foreground flex items-start gap-1.5"
                                  >
                                    <span className="text-[hsl(var(--nav-theme-light))] mt-0.5">
                                      •
                                    </span>
                                    <span>{u}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                        {/* Active events */}
                        {Array.isArray(entry.activeEvents) &&
                          entry.activeEvents.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1.5">
                                {labels.activeEvents}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {entry.activeEvents.map((e: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-xs px-2 py-1 rounded-md bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]"
                                  >
                                    {e}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Player focus */}
                      {entry.playerFocus && (
                        <div className="p-3 rounded-lg bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))] mb-1">
                            {labels.playerFocus}
                          </p>
                          <p className="text-sm text-foreground/90">
                            {entry.playerFocus}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/animevanguards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Kitawari_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@animevanguardsofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/16146832113/Anime-Vanguards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
