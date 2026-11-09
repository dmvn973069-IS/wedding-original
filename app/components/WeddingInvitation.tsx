"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type Dispatch,
  type KeyboardEvent,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import MusicPlayer from "@/app/components/MusicPlayer";
import { weddingData as wedding } from "@/app/wedding-data";

const photos = wedding.media.gallery;

const petals = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${(index * 31 + 3) % 100}%`,
  delay: `${(index % 9) * -1.65}s`,
  duration: `${13 + (index % 7) * 2.2}s`,
  drift: `${-55 + ((index * 41) % 110)}px`,
  size: `${9 + (index % 5) * 4}px`,
  opacity: 0.2 + (index % 5) * 0.1,
  rotate: `${(index * 37) % 360}deg`,
}));

const november2026 = [
  null,
  null,
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
];

function photoAt(index: number) {
  if (!photos.length) return wedding.media.cover;

  return photos[((index % photos.length) + photos.length) % photos.length];
}

function formatNumber(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function formatGoogleCalendarDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function getGoogleCalendarUrl() {
  const start = new Date(wedding.wedding.reception.datetime);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Đám cưới ${wedding.bride.name} & ${wedding.groom.name}`,
    dates: `${formatGoogleCalendarDate(start)}/${formatGoogleCalendarDate(end)}`,
    details: wedding.site.description,
    location: wedding.families.bride.address,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function useCountdown(target: Date) {
  const calculate = useCallback(() => {
    const distance = Math.max(0, target.getTime() - Date.now());

    return {
      days: Math.floor(distance / 86_400_000),
      hours: Math.floor((distance / 3_600_000) % 24),
      minutes: Math.floor((distance / 60_000) % 60),
      seconds: Math.floor((distance / 1_000) % 60),
      ended: distance === 0,
    };
  }, [target]);

  const [countdown, setCountdown] = useState(calculate);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(calculate());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [calculate]);

  return countdown;
}

function useRevealOnScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.dataset.visible = "true";
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.dataset.visible = "true";
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [enabled]);
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      {eyebrow && (
        <p
          className={`mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-xs ${
            light ? "text-[#F1B8C9]" : "text-[#B76882]"
          }`}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={`font-heading text-4xl leading-[1.08] sm:text-5xl md:text-6xl ${
          light ? "text-white" : "text-[#5F3545]"
        }`}
      >
        {title}
      </h2>

      <div className="mx-auto mt-4 flex items-center justify-center gap-3">
        <span
          className={`h-px w-10 ${
            light
              ? "bg-gradient-to-r from-transparent to-white/70"
              : "bg-gradient-to-r from-transparent to-[#D98CA5]"
          }`}
        />

        <span
          className={`animate-heart text-base ${
            light ? "text-[#F3B8CA]" : "text-[#C95F83]"
          }`}
        >
          ♥
        </span>

        <span
          className={`h-px w-10 ${
            light
              ? "bg-gradient-to-l from-transparent to-white/70"
              : "bg-gradient-to-l from-transparent to-[#D98CA5]"
          }`}
        />
      </div>

      {description && (
        <p
          className={`mx-auto mt-4 max-w-xl text-sm leading-7 sm:text-base sm:leading-8 ${
            light ? "text-white/75" : "text-[#80616B]"
          }`}
        >
          {description}
        </p>
      )}
    </header>
  );
}

function Polaroid({
  src,
  alt,
  className = "",
  sizes = "(max-width: 640px) 42vw, 240px",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`polaroid relative overflow-hidden bg-[#FFFEFC] p-2 pb-7 shadow-[0_18px_45px_rgba(96,48,67,0.18)] sm:p-3 sm:pb-10 ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EEDDE2]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition duration-1000 ease-out hover:scale-[1.04]"
        />
      </div>
    </figure>
  );
}

function DecorativePetals() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[60] overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="falling-petal absolute -top-8 block rounded-[70%_30%_70%_30%] bg-gradient-to-br from-[#F8C8D7] to-[#D76C92]"
          style={
            {
              left: petal.left,
              width: petal.size,
              height: `calc(${petal.size} * 1.35)`,
              opacity: petal.opacity,
              animationDelay: petal.delay,
              animationDuration: petal.duration,
              "--petal-drift": petal.drift,
              "--petal-rotate": petal.rotate,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function InvitationCover({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-[#F8E5E9] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.95),transparent_28%),radial-gradient(circle_at_85%_70%,rgba(216,135,161,0.3),transparent_32%),linear-gradient(145deg,#FFF7F5_0%,#F7D8E1_48%,#E7EFE9_100%)]" />

      <div className="cover-orb absolute -left-32 top-[8%] h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      <div className="cover-orb-delayed absolute -right-32 bottom-[4%] h-80 w-80 rounded-full bg-[#D984A0]/30 blur-3xl" />

      <span className="sparkle absolute left-[12%] top-[19%] text-2xl text-white">
        ✦
      </span>
      <span className="sparkle sparkle-two absolute right-[13%] top-[26%] text-lg text-[#C96D8A]">
        ✦
      </span>
      <span className="sparkle sparkle-three absolute bottom-[21%] left-[18%] text-xl text-[#D78AA2]">
        ♡
      </span>

      <div className="cover-photo absolute left-[2%] top-[7%] z-[2] w-[25%] max-w-[125px] -rotate-[11deg] sm:left-[8%] sm:w-36 lg:left-[14%] lg:w-44">
        <Polaroid src={photoAt(0)} alt="Kỷ niệm của cô dâu chú rể" />
      </div>

      <div className="cover-photo cover-photo-two absolute right-[2%] top-[10%] z-[2] w-[23%] max-w-[115px] rotate-[9deg] sm:right-[8%] sm:w-36 lg:right-[14%] lg:w-44">
        <Polaroid src={photoAt(1)} alt="Ảnh cưới" />
      </div>

      <div className="cover-photo cover-photo-three absolute bottom-[5%] left-[3%] z-[2] w-[23%] max-w-[112px] rotate-[8deg] sm:left-[10%] sm:w-36 lg:left-[16%] lg:w-40">
        <Polaroid src={photoAt(2)} alt="Khoảnh khắc hạnh phúc" />
      </div>

      <div className="cover-photo cover-photo-four absolute bottom-[6%] right-[3%] z-[2] w-[23%] max-w-[112px] -rotate-[8deg] sm:right-[10%] sm:w-36 lg:right-[16%] lg:w-40">
        <Polaroid src={photoAt(3)} alt="Kỷ niệm tình yêu" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] px-1 sm:max-w-[470px]">
        <div className="invitation-card relative overflow-hidden rounded-[48%_48%_30px_30px/12%_12%_30px_30px] border border-white/90 bg-[linear-gradient(155deg,rgba(255,255,255,0.98),rgba(255,247,248,0.94))] px-5 pb-7 pt-10 text-center shadow-[0_35px_90px_rgba(99,50,68,0.22)] backdrop-blur sm:px-10 sm:pb-10 sm:pt-14">
          <div className="absolute inset-3 rounded-[46%_46%_24px_24px/10%_10%_24px_24px] border border-[#EBC8D3]/60" />

          <div className="relative">
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#9D6578] sm:text-xs">
              Wedding invitation
            </p>

            <p className="mt-3 font-heading text-4xl italic leading-none text-[#C76687] sm:text-5xl">
              Thiệp Mời
            </p>

            <div className="mx-auto my-5 flex items-center justify-center gap-2">
              <span className="h-px w-9 bg-[#D69AAE]" />
              <span className="text-xs text-[#CE6E8D]">♥</span>
              <span className="h-px w-9 bg-[#D69AAE]" />
            </div>

            <div className="cover-main-photo mx-auto w-[62%] -rotate-2 sm:w-[67%]">
              <Polaroid
                src={wedding.media.cover}
                alt={`Ảnh cưới ${wedding.bride.name} và ${wedding.groom.name}`}
                priority
                sizes="(max-width: 640px) 58vw, 310px"
              />
            </div>

            <h1 className="mt-5 font-heading text-[29px] leading-tight text-[#5F3545] sm:text-4xl">
              {wedding.bride.name}
              <span className="mx-2 inline-block animate-heart text-[#CA6687]">
                &
              </span>
              {wedding.groom.name}
            </h1>

            <p className="mt-2 text-[11px] font-semibold tracking-[0.2em] text-[#956777] sm:text-sm">
              {wedding.wedding.displayDate}
            </p>

            <p className="mx-auto mt-4 max-w-[280px] text-xs leading-6 text-[#7F5D69] sm:text-sm sm:leading-7">
              Hai trái tim, một hành trình.
              <br />
              Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng
              mình.
            </p>

            <button
              type="button"
              onClick={onOpen}
              className="open-button group mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#B95075,#DD8CA7)] px-7 py-3 text-xs font-semibold tracking-wide text-white shadow-[0_15px_35px_rgba(185,80,117,0.32)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_19px_40px_rgba(185,80,117,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#CB7895]/30 sm:text-sm"
            >
              <span className="animate-heart">♡</span>
              Mở thiệp mời
              <span className="transition group-hover:translate-x-1">→</span>
            </button>

            <p className="mt-4 font-heading text-lg italic text-[#C86B89] sm:text-xl">
              With love, forever
            </p>
          </div>
        </div>

        <div className="envelope-shadow mx-auto -mt-3 h-8 w-[80%] rounded-[50%] bg-[#82485E]/20 blur-xl" />
      </div>
    </section>
  );
}

function WeddingNavigation({
  scrolled,
  onOpenQR,
}: {
  scrolled: boolean;
  onOpenQR: () => void;
}) {
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/30 bg-[#FFF9FA]/85 py-2 shadow-sm backdrop-blur-xl"
          : "bg-transparent py-4"
      }`}
      aria-label="Điều hướng thiệp cưới"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          className={`font-heading text-xl italic transition ${
            scrolled ? "text-[#724556]" : "text-white"
          }`}
        >
          {wedding.couple.shortName}
        </a>

        <div
          className={`flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.15em] sm:gap-6 sm:text-xs ${
            scrolled ? "text-[#805969]" : "text-white"
          }`}
        >
          <a className="nav-link hidden md:inline" href="#loi-moi">
            Lời mời
          </a>

          <a className="nav-link hidden md:inline" href="#chuyen-tinh-yeu">
            Chuyện tình
          </a>

          <a className="nav-link hidden md:inline" href="#su-kien">
            Sự kiện
          </a>

          <a className="nav-link hidden md:inline" href="#album">
            Album
          </a>

          <a className="nav-link hidden sm:inline" href="#xac-nhan">
            RSVP
          </a>

          <button
            type="button"
            onClick={onOpenQR}
            className={`rounded-full px-4 py-2 transition ${
              scrolled
                ? "bg-[#B95C7D] text-white"
                : "border border-white/60 bg-white/10 text-white backdrop-blur"
            }`}
          >
            Mừng cưới
          </button>
        </div>
      </div>
    </nav>
  );
}

function WeddingHero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={wedding.media.hero}
        alt={`Ảnh cưới ${wedding.bride.name} và ${wedding.groom.name}`}
        fill
        priority
        sizes="100vw"
        className="hero-image object-cover object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(52,28,37,0.18),rgba(52,28,37,0.15)_40%,rgba(52,28,37,0.78))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(39,18,26,0.24)_100%)]" />

      <div className="relative z-10 flex min-h-[100svh] items-end justify-center px-4 pb-20 pt-28 text-center text-white sm:pb-24">
        <div className="max-w-4xl">
          <p className="hero-eyebrow text-[10px] font-semibold uppercase tracking-[0.38em] sm:text-xs sm:tracking-[0.5em]">
            Our wedding story
          </p>

          <h1 className="hero-title mt-5 font-heading text-6xl italic leading-[0.82] sm:text-8xl md:text-9xl">
            {wedding.bride.name}
            <span className="my-3 block text-4xl text-[#F4B5C8] sm:text-6xl">
              &
            </span>
            {wedding.groom.name}
          </h1>

          <div className="hero-date mx-auto mt-7 flex max-w-sm items-center justify-center gap-4">
            <span className="h-px flex-1 bg-white/55" />

            <p className="text-xs font-semibold tracking-[0.24em] sm:text-base">
              {wedding.wedding.displayDate}
            </p>

            <span className="h-px flex-1 bg-white/55" />
          </div>

          <p className="hero-subtitle mx-auto mt-6 max-w-lg text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            Một ngày đặc biệt sẽ càng trọn vẹn hơn khi có bạn cùng sẻ chia và
            chứng kiến khoảnh khắc chúng mình bắt đầu hành trình mới.
          </p>

          <p className="hero-subtitle mx-auto mt-4 max-w-xl font-heading text-xl italic text-[#F4B5C8] sm:text-2xl">
            “{wedding.couple.quote}”
          </p>
        </div>
      </div>

      <a
        href="#loi-moi"
        aria-label="Cuộn xuống xem lời mời"
        className="scroll-indicator absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/80"
      >
        <span className="text-[9px] uppercase tracking-[0.25em]">Khám phá</span>

        <span className="grid h-9 w-6 place-items-start rounded-full border border-white/60 p-1">
          <span className="scroll-dot mx-auto h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </a>
    </section>
  );
}

function InvitationLetter() {
  return (
    <section
      id="loi-moi"
      className="relative overflow-hidden bg-[#FFF9F8] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#F2D8E0]/55 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#E3EEE7]/70 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <SectionTitle
            eyebrow="Thư gửi những người chúng mình yêu quý"
            title={wedding.invitation.heading}
            description="Hạnh phúc không chỉ là khoảnh khắc hai người nắm tay nhau, mà còn là khi khoảnh khắc ấy được sẻ chia cùng gia đình và bạn bè."
          />
        </Reveal>

        <div className="grid items-center gap-9 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto min-h-[430px] max-w-md sm:min-h-[520px]">
              <div className="absolute left-0 top-0 w-[62%] -rotate-6">
                <Polaroid src={photoAt(0)} alt="Khoảnh khắc của chúng mình" />
              </div>

              <div className="absolute bottom-0 right-0 w-[60%] rotate-6">
                <Polaroid src={photoAt(1)} alt="Kỷ niệm của cô dâu chú rể" />
              </div>

              <div className="absolute left-[46%] top-[43%] z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-6 place-items-center rounded-full bg-[#C36686] text-center font-heading text-sm italic text-white shadow-xl sm:h-24 sm:w-24 sm:text-base">
                Love
                <br />
                always
              </div>
            </div>
          </Reveal>

          <Reveal delay={160} className="order-1 lg:order-2">
            <article className="relative rounded-[30px] border border-[#EEDCE2] bg-white/80 p-6 shadow-[0_25px_65px_rgba(101,54,71,0.09)] backdrop-blur sm:p-10">
              <span className="absolute -left-3 -top-7 font-heading text-8xl text-[#E4B5C4]/45">
                “
              </span>

              <div className="relative space-y-5 text-sm leading-7 text-[#765562] sm:text-base sm:leading-8">
                <p className="font-heading text-2xl italic text-[#B95D7D] sm:text-3xl">
                  {wedding.invitation.opening}
                </p>

                {wedding.invitation.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="pt-2">
                  <p className="font-heading text-2xl italic text-[#C66686] sm:text-3xl">
                    {wedding.invitation.closing}
                  </p>

                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#A36B7E]">
                    {wedding.bride.name} & {wedding.groom.name}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function LoveStory() {
  return (
    <section
      id="chuyen-tinh-yeu"
      className="relative overflow-hidden bg-[#F7E6EA] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#DDEAE0]/80 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionTitle
            eyebrow={wedding.story.eyebrow}
            title={wedding.story.title}
            description={wedding.story.introduction}
          />
        </Reveal>

        <div className="relative">
          <div className="absolute bottom-0 left-[18px] top-0 w-px bg-gradient-to-b from-transparent via-[#D697AC] to-transparent sm:left-1/2" />

          <div className="space-y-12 sm:space-y-20">
            {wedding.story.milestones.map((milestone, index) => {
              const imageOnLeft = index % 2 === 0;

              return (
                <Reveal
                  key={`${milestone.year}-${milestone.title}`}
                  delay={index * 80}
                >
                  <article className="relative grid gap-7 pl-12 sm:grid-cols-2 sm:items-center sm:gap-16 sm:pl-0">
                    <span className="timeline-dot absolute left-[10px] top-6 z-10 h-4 w-4 rounded-full border-4 border-[#F7E6EA] bg-[#C26383] sm:left-1/2 sm:-translate-x-1/2" />

                    <div className={imageOnLeft ? "sm:order-1" : "sm:order-2"}>
                      <div
                        className={`mx-auto max-w-sm ${
                          imageOnLeft ? "-rotate-2" : "rotate-2"
                        }`}
                      >
                        <Polaroid
                          src={milestone.image}
                          alt={milestone.title}
                          sizes="(max-width: 640px) 80vw, 430px"
                        />
                      </div>
                    </div>

                    <div
                      className={
                        imageOnLeft
                          ? "sm:order-2 sm:text-left"
                          : "sm:order-1 sm:text-right"
                      }
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B2607C] sm:text-xs">
                        {milestone.year}
                      </p>

                      <h3 className="mt-3 font-heading text-3xl leading-tight text-[#633B4A] sm:text-4xl">
                        {milestone.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-[#795866] sm:text-base sm:leading-8">
                        {milestone.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilyCard({
  label,
  father,
  mother,
  address,
  photo,
  message,
  delay,
}: {
  label: string;
  father: string;
  mother: string;
  address: string;
  photo: string;
  message: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="family-card group relative h-full overflow-hidden rounded-[30px] border border-white/80 bg-white/75 p-5 shadow-[0_20px_55px_rgba(99,54,69,0.1)] backdrop-blur sm:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-[#E7B9C8]/60" />
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-[#E7B9C8]/40" />

        <header className="relative text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B26F85]">
            Trân trọng giới thiệu
          </p>

          <h3 className="mt-2 font-heading text-3xl text-[#694050] sm:text-4xl">
            Gia đình {label.toLowerCase()}
          </h3>
        </header>

        <div className="relative mt-6 grid grid-cols-[108px_1fr] items-center gap-5 sm:grid-cols-[145px_1fr]">
          <div className="-rotate-3 transition duration-500 group-hover:rotate-0 group-hover:scale-[1.02]">
            <Polaroid src={photo} alt={`Ảnh đại diện ${label}`} />
          </div>

          <div className="min-w-0">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B26F85]">
                Ông
              </p>
              <p className="mt-1 font-heading text-xl leading-snug text-[#674251] sm:text-2xl">
                {father}
              </p>
            </div>

            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B26F85]">
                Bà
              </p>
              <p className="mt-1 font-heading text-xl leading-snug text-[#674251] sm:text-2xl">
                {mother}
              </p>
            </div>
          </div>
        </div>

        <blockquote className="relative mt-6 rounded-2xl border border-[#ECD8DF] bg-[#FFF9FA]/80 px-5 py-5 text-center">
          <span className="absolute left-3 top-0 font-heading text-5xl text-[#E0A9BB]/50">
            “
          </span>

          <p className="relative font-heading text-lg italic leading-relaxed text-[#896171] sm:text-xl">
            {message}
          </p>
        </blockquote>

        <div className="mt-4 flex gap-3 rounded-2xl bg-[#F7E8ED]/75 px-4 py-4">
          <span className="mt-0.5 text-xl text-[#BC6885]">⌖</span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B26F85]">
              Địa chỉ gia đình
            </p>

            <p className="mt-1 text-xs leading-6 text-[#765562] sm:text-sm">
              {address}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function FamilySection() {
  const familyData = [
    {
      label: wedding.families.groom.label,
      father: wedding.families.groom.father,
      mother: wedding.families.groom.mother,
      address: wedding.families.groom.address,
      photo: photoAt(2),
      message:
        "Gia đình chúng tôi rất vui mừng được chia sẻ niềm hạnh phúc của các con cùng quý khách.",
    },
    {
      label: wedding.families.bride.label,
      father: wedding.families.bride.father,
      mother: wedding.families.bride.mother,
      address: wedding.families.bride.address,
      photo: photoAt(3),
      message:
        "Tình yêu thương của gia đình là hành trang để các con cùng nhau xây dựng một mái ấm hạnh phúc.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#E8F0EA] px-4 py-16 sm:px-6 sm:py-24">
      <div className="absolute -left-20 top-10 h-52 w-52 rounded-full border border-white/80" />
      <div className="absolute -right-24 bottom-10 h-64 w-64 rounded-full border border-white/70" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <SectionTitle
            eyebrow="Hai bên gia đình"
            title="Trân trọng kính mời"
          />
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {familyData.map((family, index) => (
            <FamilyCard key={family.label} {...family} delay={index * 140} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const target = useMemo(() => new Date(wedding.wedding.ceremony.datetime), []);

  const countdown = useCountdown(target);

  if (countdown.ended) {
    return (
      <p className="text-center font-heading text-3xl italic text-[#B95F7E]">
        Ngày hạnh phúc đã đến ♡
      </p>
    );
  }

  const items = [
    { label: "Ngày", value: countdown.days },
    { label: "Giờ", value: countdown.hours },
    { label: "Phút", value: countdown.minutes },
    { label: "Giây", value: countdown.seconds },
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-4"
      role="timer"
      aria-label="Thời gian còn lại đến lễ thành hôn"
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="countdown-card rounded-2xl border border-white/80 bg-white/65 px-1.5 py-4 text-center shadow-[0_12px_35px_rgba(105,55,75,0.08)] backdrop-blur sm:rounded-3xl sm:px-4 sm:py-6"
        >
          <strong className="block font-heading text-2xl font-normal tabular-nums text-[#714353] sm:text-4xl">
            {formatNumber(item.value)}
          </strong>

          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#B06D84] sm:text-xs">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function WeddingCalendar() {
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  return (
    <div className="wedding-calendar relative overflow-hidden rounded-[32px] border border-white/80 bg-white/75 p-5 shadow-[0_25px_60px_rgba(102,51,70,0.12)] backdrop-blur sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#E9B6C7]/25 blur-2xl" />

      <header className="relative flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#AE6680]">
            Save our date
          </p>

          <h3 className="mt-2 font-heading text-4xl text-[#633B4A]">
            Tháng 11
          </h3>
        </div>

        <p className="font-heading text-5xl italic text-[#D18AA2]">2026</p>
      </header>

      <div className="mt-7 grid grid-cols-7 gap-1 text-center sm:gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="pb-2 text-[9px] font-semibold uppercase tracking-wider text-[#A4697C] sm:text-xs"
          >
            {day}
          </div>
        ))}

        {november2026.map((day, index) => {
          const isReception = day === 28;
          const isCeremony = day === 29;

          return (
            <div
              key={`${day ?? "empty"}-${index}`}
              className="relative grid aspect-square place-items-center"
            >
              {day && (
                <>
                  {(isReception || isCeremony) && (
                    <span
                      className={`calendar-heart absolute inset-0 grid place-items-center text-[34px] leading-none sm:text-[46px] ${
                        isReception ? "text-[#C75E82]" : "text-[#98AE9B]"
                      }`}
                      aria-hidden="true"
                    >
                      ♥
                    </span>
                  )}

                  <span
                    className={`relative z-10 text-xs sm:text-sm ${
                      isReception || isCeremony
                        ? "font-bold text-white"
                        : "text-[#755260]"
                    }`}
                  >
                    {day}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-[#ECD8DF] pt-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#865B6A] sm:text-xs">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#C75E82]" />
          28/11 Tiệc mừng
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#98AE9B]" />
          29/11 Thành hôn
        </span>
      </div>
    </div>
  );
}

function WeddingEvents() {
  const events = [
    {
      icon: "♧",
      title: wedding.wedding.reception.title,
      time: wedding.wedding.reception.time,
      date: wedding.wedding.reception.date,
      side: wedding.wedding.reception.side,
      description: wedding.wedding.reception.description,
      address: wedding.families.bride.address,
      mapUrl: wedding.families.bride.location.mapUrl,
    },
    {
      icon: "♡",
      title: wedding.wedding.ceremony.title,
      time: wedding.wedding.ceremony.time,
      date: wedding.wedding.ceremony.date,
      side: wedding.wedding.ceremony.side,
      description: wedding.wedding.ceremony.description,
      address: wedding.families.groom.address,
      mapUrl: wedding.families.groom.location.mapUrl,
    },
  ];

  return (
    <section
      id="su-kien"
      className="relative overflow-hidden bg-[linear-gradient(145deg,#F4CED9,#ECDDE0_45%,#F7E8E7)] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="absolute inset-0 opacity-[0.17] [background-image:radial-gradient(#9D526C_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <WeddingCalendar />
          </Reveal>

          <Reveal delay={130}>
            <SectionTitle
              eyebrow="Save the date"
              title="Ngày mình chung đôi"
              description="Chúng mình rất mong được gặp bạn trong ngày đặc biệt này."
            />

            <Countdown />

            <div className="mt-6 text-center">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#B95D7D] px-6 py-3 text-sm font-semibold text-white shadow-[0_13px_30px_rgba(168,73,105,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-[#A64E6D]"
              >
                <span>＋</span>
                Thêm vào Google Calendar
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {events.map((event, index) => (
            <Reveal key={event.title} delay={index * 120}>
              <article className="event-card group relative h-full overflow-hidden rounded-[30px] border border-white/75 bg-white/65 p-6 shadow-[0_20px_50px_rgba(106,57,74,0.1)] backdrop-blur transition duration-500 hover:-translate-y-2 hover:bg-white/85 sm:p-8">
                <div className="flex items-start gap-5">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#F3D6DF] text-3xl text-[#B8597A] transition duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                    {event.icon}
                  </span>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9F6277]">
                      {event.side}
                    </p>

                    <h3 className="mt-1 font-heading text-3xl text-[#694252] sm:text-4xl">
                      {event.title}
                    </h3>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-[90px_1fr] gap-4 rounded-2xl bg-white/65 p-4">
                  <div>
                    <p className="font-heading text-3xl text-[#B95D7D]">
                      {event.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#684453]">
                      {event.date}
                    </p>

                    <p className="mt-1 text-xs leading-6 text-[#80616D]">
                      {event.address}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-[#765562]">
                  {event.description}
                </p>

                {event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#C36A87]/40 px-5 py-2.5 text-xs font-semibold text-[#AD526F] transition hover:bg-[#B95D7D] hover:text-white"
                  >
                    Xem Google Maps
                    <span>↗</span>
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeddingSchedule() {
  return (
    <section className="relative bg-[#FFF9F8] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionTitle
            eyebrow="Wedding timeline"
            title="Lịch trình ngày vui"
            description="Một vài dấu mốc nhỏ để bạn dễ dàng sắp xếp thời gian và cùng chúng mình tận hưởng trọn vẹn buổi tiệc."
          />
        </Reveal>

        <div className="relative mx-auto max-w-3xl">
          <div className="absolute bottom-6 left-[39px] top-6 w-px bg-[#DFB3C2] sm:left-1/2" />

          <div className="space-y-5 sm:space-y-8">
            {wedding.schedule.map((item, index) => (
              <Reveal key={`${item.time}-${item.title}`} delay={index * 100}>
                <article className="relative grid pl-[82px] sm:grid-cols-2 sm:pl-0">
                  <div
                    className={`schedule-time absolute left-0 top-3 z-10 grid h-[78px] w-[78px] place-items-center rounded-full border-4 border-[#FFF9F8] font-heading text-lg text-white shadow-lg sm:left-1/2 sm:-translate-x-1/2 ${
                      index % 2 === 0 ? "bg-[#BC5D7E]" : "bg-[#91A993]"
                    }`}
                  >
                    {item.time}
                  </div>

                  <div
                    className={`rounded-3xl border border-[#EDD9E0] bg-white p-5 shadow-[0_15px_45px_rgba(89,49,64,0.08)] sm:p-7 ${
                      index % 2 === 0
                        ? "sm:col-start-2 sm:ml-14"
                        : "sm:col-start-1 sm:mr-14 sm:text-right"
                    }`}
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#AE6880]">
                      {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-2 font-heading text-2xl text-[#65404F] sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#7B5A67]">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DressCode() {
  return (
    <section className="relative overflow-hidden bg-[#E8F0EA] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionTitle
            eyebrow="Wedding palette"
            title={wedding.wedding.dressCode.title}
            description={wedding.wedding.dressCode.description}
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[32px] border border-white/80 bg-white/55 p-6 shadow-[0_24px_65px_rgba(74,93,77,0.1)] backdrop-blur sm:p-10">
            <div className="flex flex-wrap justify-center gap-5 sm:gap-9">
              {wedding.wedding.dressCode.colors.map((color, index) => (
                <div
                  key={color.name}
                  className="dress-color group text-center"
                  style={
                    {
                      "--dress-delay": `${index * 130}ms`,
                    } as CSSProperties
                  }
                >
                  <div
                    className="relative mx-auto h-20 w-20 rounded-full border-[6px] border-white shadow-[0_15px_30px_rgba(75,63,67,0.15)] transition duration-500 group-hover:-translate-y-2 group-hover:scale-110 sm:h-28 sm:w-28"
                    style={{ backgroundColor: color.value }}
                  >
                    <span className="absolute inset-2 rounded-full border border-white/40" />
                  </div>

                  <p className="mt-4 font-heading text-lg text-[#644552] sm:text-xl">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>

            <p className="mx-auto mt-9 max-w-xl text-center text-xs leading-6 text-[#748075] sm:text-sm sm:leading-7">
              Dress code chỉ là một gợi ý nhỏ. Bạn hãy lựa chọn trang phục khiến
              mình cảm thấy thoải mái và tự tin nhất nhé.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Gallery({
  slide,
  setSlide,
  onOpen,
}: {
  slide: number;
  setSlide: Dispatch<SetStateAction<number>>;
  onOpen: (index: number) => void;
}) {
  if (!photos.length) return null;

  function previous() {
    setSlide((current) => (current - 1 + photos.length) % photos.length);
  }

  function next() {
    setSlide((current) => (current + 1) % photos.length);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") previous();
    if (event.key === "ArrowRight") next();
    if (event.key === "Enter") onOpen(slide);
  }

  return (
    <div
      className="relative mx-auto max-w-4xl"
      role="region"
      aria-label="Bộ sưu tập ảnh cưới"
      tabIndex={0}
      onKeyDown={handleKeyboard}
    >
      <div className="pointer-events-none absolute -left-2 top-12 z-10 w-[22%] -rotate-[9deg] opacity-90 sm:left-0 sm:w-36">
        <Polaroid src={photoAt(slide - 1)} alt="" />
      </div>

      <div className="pointer-events-none absolute -right-2 bottom-12 z-10 w-[22%] rotate-[9deg] opacity-90 sm:right-0 sm:w-36">
        <Polaroid src={photoAt(slide + 1)} alt="" />
      </div>

      <button
        type="button"
        onClick={() => onOpen(slide)}
        className="gallery-frame group relative mx-auto block w-[78%] -rotate-1 bg-white p-2 pb-9 text-left shadow-[0_25px_60px_rgba(91,49,65,0.2)] transition hover:rotate-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#CE7896]/30 sm:w-[68%] sm:p-4 sm:pb-14"
        aria-label={`Mở ảnh ${slide + 1}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#E7EDE7] sm:aspect-[4/3]">
          {photos.map((photo, index) => (
            <Image
              key={`${photo}-${index}`}
              src={photo}
              alt={`Kỷ niệm ${index + 1} của cô dâu chú rể`}
              fill
              sizes="(max-width: 640px) 75vw, 640px"
              className={`gallery-image object-cover ${
                index === slide ? "is-active" : ""
              }`}
            />
          ))}

          <span className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lg text-[#A95372] opacity-0 shadow transition duration-300 group-hover:opacity-100">
            ⤢
          </span>
        </div>

        <p className="mt-4 text-center font-heading text-lg italic text-[#75505E] sm:text-2xl">
          Forever starts with you ♡
        </p>
      </button>

      <button
        type="button"
        onClick={previous}
        aria-label="Xem ảnh trước"
        className="gallery-arrow absolute left-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#BC5E7F] text-2xl text-white shadow-lg transition hover:scale-110 sm:left-6"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Xem ảnh tiếp theo"
        className="gallery-arrow absolute right-0 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-[#BC5E7F] text-2xl text-white shadow-lg transition hover:scale-110 sm:right-6"
      >
        ›
      </button>

      <div className="mt-8 flex justify-center gap-2">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={`${photo}-indicator`}
            onClick={() => setSlide(index)}
            aria-label={`Chuyển đến ảnh ${index + 1}`}
            aria-current={slide === index}
            className={`h-2 rounded-full transition-all duration-500 ${
              slide === index ? "w-8 bg-[#BE6282]" : "w-2 bg-[#BE6282]/30"
            }`}
          />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-7">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={`${photo}-thumbnail`}
            onClick={() => setSlide(index)}
            onDoubleClick={() => onOpen(index)}
            aria-label={`Xem ảnh kỷ niệm ${index + 1}`}
            className={`thumbnail transition duration-500 ${
              index % 2 === 0 ? "-rotate-2" : "rotate-2"
            } ${slide === index ? "z-10 scale-105" : "opacity-80"}`}
          >
            <Polaroid src={photo} alt={`Ảnh kỷ niệm ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function GallerySection({
  slide,
  setSlide,
  onOpen,
}: {
  slide: number;
  setSlide: Dispatch<SetStateAction<number>>;
  onOpen: (index: number) => void;
}) {
  return (
    <section
      id="album"
      className="relative bg-[#FFF9F8] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionTitle
            eyebrow="Our sweetest memories"
            title="Khoảnh khắc của chúng mình"
            description="Mỗi bức ảnh là một mảnh ghép nhỏ trong hành trình yêu thương mà chúng mình muốn lưu giữ thật lâu."
          />
        </Reveal>

        <Reveal delay={120}>
          <Gallery slide={slide} setSlide={setSlide} onOpen={onOpen} />
        </Reveal>
      </div>
    </section>
  );
}

function RSVPSection() {
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"yes" | "no">("yes");
  const [guestCount, setGuestCount] = useState(1);

  const phone = wedding.rsvp.phone.replace(/\s/g, "");

  const message = encodeURIComponent(
    [
      `Xin chào ${wedding.bride.name} và ${wedding.groom.name},`,
      "",
      `Mình là: ${guestName || "[Tên khách mời]"}`,
      attendance === "yes"
        ? `Mình sẽ tham dự cùng ${guestCount} người.`
        : "Rất tiếc mình không thể tham dự.",
      "",
      "Chúc hai bạn có một ngày cưới thật hạnh phúc!",
    ].join("\n"),
  );

  const smsUrl = phone ? `sms:${phone}?body=${message}` : "";

  return (
    <section
      id="xac-nhan"
      className="relative overflow-hidden bg-[#F1D4DC] px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#AFC1AE]/35 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <Reveal>
          <SectionTitle
            eyebrow={`Vui lòng xác nhận trước ${wedding.rsvp.deadline}`}
            title={wedding.rsvp.title}
            description={wedding.rsvp.description}
          />
        </Reveal>

        <Reveal delay={140}>
          <div className="rounded-[32px] border border-white/75 bg-white/70 p-5 shadow-[0_25px_70px_rgba(99,48,67,0.13)] backdrop-blur-xl sm:p-9">
            <div>
              <label
                htmlFor="guest-name"
                className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A65F78]"
              >
                Tên của bạn
              </label>

              <input
                id="guest-name"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Nhập tên khách mời"
                maxLength={80}
                className="mt-2 w-full rounded-2xl border border-[#E6C8D2] bg-white/85 px-4 py-3.5 text-sm text-[#633C4B] outline-none transition placeholder:text-[#A98C96] focus:border-[#B95D7D] focus:ring-4 focus:ring-[#B95D7D]/10"
              />
            </div>

            <fieldset className="mt-6">
              <legend className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A65F78]">
                Bạn có thể tham dự không?
              </legend>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("yes")}
                  className={`rounded-2xl border px-3 py-4 text-xs font-semibold transition sm:text-sm ${
                    attendance === "yes"
                      ? "border-[#B95D7D] bg-[#B95D7D] text-white shadow-lg"
                      : "border-[#E4C5D0] bg-white/75 text-[#76505F]"
                  }`}
                >
                  ♡ Mình sẽ tham dự
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance("no")}
                  className={`rounded-2xl border px-3 py-4 text-xs font-semibold transition sm:text-sm ${
                    attendance === "no"
                      ? "border-[#879D8B] bg-[#879D8B] text-white shadow-lg"
                      : "border-[#D5DFD6] bg-white/75 text-[#657566]"
                  }`}
                >
                  Gửi lời chúc từ xa
                </button>
              </div>
            </fieldset>

            {attendance === "yes" && (
              <div className="mt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A65F78]">
                  Số người tham dự
                </p>

                <div className="mt-3 inline-flex items-center overflow-hidden rounded-full border border-[#DFC0CB] bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((current) => Math.max(1, current - 1))
                    }
                    className="grid h-11 w-11 place-items-center text-xl text-[#A95673] transition hover:bg-[#F7E7EC]"
                    aria-label="Giảm số người tham dự"
                  >
                    −
                  </button>

                  <span className="min-w-12 text-center font-heading text-xl text-[#67414F]">
                    {guestCount}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount((current) => Math.min(10, current + 1))
                    }
                    className="grid h-11 w-11 place-items-center text-xl text-[#A95673] transition hover:bg-[#F7E7EC]"
                    aria-label="Tăng số người tham dự"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {phone && (
                <a
                  href={smsUrl}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#B95D7D] px-7 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-1"
                >
                  Gửi xác nhận
                  <span>→</span>
                </a>
              )}

              {wedding.rsvp.formUrl && (
                <a
                  href={wedding.rsvp.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#B95D7D] px-7 py-3 text-sm font-semibold text-[#A84F6E] transition hover:bg-[#B95D7D] hover:text-white"
                >
                  Mở biểu mẫu RSVP
                </a>
              )}
            </div>

            {!phone && !wedding.rsvp.formUrl && (
              <p className="mt-6 text-center text-xs leading-6 text-[#8A6573]">
                Phương thức xác nhận tham dự sẽ được cô dâu chú rể bổ sung sau.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ThankYouSection({ onOpenQR }: { onOpenQR: () => void }) {
  return (
    <section className="relative overflow-hidden bg-[#6E4052] px-4 py-20 text-white sm:px-6 sm:py-28">
      <Image
        src={wedding.media.cover}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20 grayscale"
      />

      <div className="absolute inset-0 bg-[#563140]/80" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#F3C2D1] sm:text-xs">
            Thank you for being part of our story
          </p>

          <h2 className="mt-6 font-heading text-5xl italic leading-tight sm:text-7xl">
            {wedding.bride.name}
            <span className="mx-3 inline-block text-[#F0AFC3]">&</span>
            {wedding.groom.name}
          </h2>

          <p className="mt-5 text-sm font-semibold tracking-[0.22em] text-white/85 sm:text-lg">
            {wedding.wedding.displayDate}
          </p>

          <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">
            Cảm ơn bạn đã luôn yêu thương và đồng hành cùng chúng mình. Sự hiện
            diện cùng những lời chúc tốt đẹp của bạn là món quà vô cùng ý nghĩa
            trong ngày đặc biệt này.
          </p>

          <button
            type="button"
            onClick={onOpenQR}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#8A4961] shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
          >
            <span>♡</span>
            Gửi quà mừng cưới
            <span>→</span>
          </button>

          <p className="mt-10 font-heading text-3xl italic text-[#F1AFC4]">
            Hẹn gặp bạn trong ngày vui nhé!
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-white/55">
            {wedding.couple.hashtag}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Lightbox({
  index,
  onClose,
  onChange,
}: {
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (index === null) return;

      if (event.key === "Escape") onClose();

      if (event.key === "ArrowLeft") {
        onChange((index - 1 + photos.length) % photos.length);
      }

      if (event.key === "ArrowRight") {
        onChange((index + 1) % photos.length);
      }
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [index, onChange, onClose]);

  if (index === null || !photos[index]) return null;

  return (
    <div
      className="lightbox fixed inset-0 z-[100] grid place-items-center bg-[#2C1720]/90 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh cưới"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-2xl text-white transition hover:bg-white/20"
        aria-label="Đóng ảnh"
      >
        ×
      </button>

      <div
        className="relative h-[78vh] w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={photos[index]}
          alt={`Ảnh cưới ${index + 1}`}
          fill
          sizes="95vw"
          className="object-contain"
          priority
        />

        <button
          type="button"
          onClick={() => onChange((index - 1 + photos.length) % photos.length)}
          className="absolute left-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-3xl text-white backdrop-blur transition hover:bg-white/25"
          aria-label="Ảnh trước"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => onChange((index + 1) % photos.length)}
          className="absolute right-0 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-3xl text-white backdrop-blur transition hover:bg-white/25"
          aria-label="Ảnh tiếp theo"
        >
          ›
        </button>
      </div>

      <p className="absolute bottom-5 text-xs tracking-[0.2em] text-white/80">
        {index + 1} / {photos.length}
      </p>
    </div>
  );
}

function QRModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const qrItems = [
    {
      label: `Cô dâu ${wedding.bride.name}`,
      src: wedding.bride.qr,
      bank: wedding.bride.bank,
    },
    {
      label: `Chú rể ${wedding.groom.name}`,
      src: wedding.groom.qr,
      bank: wedding.groom.bank,
    },
  ];

  return (
    <div
      className="qr-backdrop fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-[#321A23]/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-title"
      onClick={onClose}
    >
      <div
        className="qr-modal relative my-6 w-full max-w-xl overflow-hidden rounded-[32px] border border-white/70 bg-[#FFF9FA] p-6 shadow-2xl sm:p-9"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#F3DDE4] text-xl text-[#814C60] transition hover:rotate-90"
          aria-label="Đóng mã QR"
        >
          ×
        </button>

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B06981]">
            Gửi lời chúc yêu thương
          </p>

          <h2
            id="qr-title"
            className="mt-2 font-heading text-4xl text-[#613848]"
          >
            Mừng cưới
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#7E5A68]">
            Tình cảm và lời chúc của bạn là món quà quý giá đối với chúng mình.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5">
          {qrItems.map((item, index) => (
            <div
              key={item.label}
              className="qr-card rounded-2xl border border-[#EBCFD8] bg-white p-3 text-center shadow-sm sm:p-5"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="relative mx-auto aspect-square w-full max-w-[190px] overflow-hidden rounded-xl bg-white">
                <Image
                  src={item.src}
                  alt={`Mã QR ${item.label}`}
                  fill
                  sizes="190px"
                  className="object-contain"
                />
              </div>

              <p className="mt-3 font-heading text-lg text-[#744959] sm:text-xl">
                {item.label}
              </p>

              {item.bank.bankName && (
                <div className="mt-2 text-[10px] leading-5 text-[#8B6875] sm:text-xs">
                  <p>{item.bank.bankName}</p>
                  <p>{item.bank.accountNumber}</p>
                  <p>{item.bank.accountName}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WeddingInvitation() {
  const [opened, setOpened] = useState(false);
  const [slide, setSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const interactedWithGallery = useRef(false);

  useRevealOnScroll(opened);

  useEffect(() => {
    if (!opened || photos.length <= 1) return;

    const timer = window.setInterval(
      () => {
        if (document.hidden || lightboxIndex !== null) return;

        setSlide((current) => (current + 1) % photos.length);
      },
      interactedWithGallery.current ? 6000 : 4000,
    );

    return () => window.clearInterval(timer);
  }, [opened, lightboxIndex]);

  useEffect(() => {
    if (!opened) return;

    function handleScroll() {
      setScrolled(window.scrollY > 320);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [opened]);

  function openInvitation() {
    setOpened(true);

    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function selectSlide(value: SetStateAction<number>) {
    interactedWithGallery.current = true;
    setSlide(value);
  }

  return (
    <main className="wedding-page min-h-screen overflow-hidden bg-[#F8E8EB] text-[#633C4B]">
      <DecorativePetals />

      {!opened ? (
        <InvitationCover onOpen={openInvitation} />
      ) : (
        <>
          <WeddingNavigation
            scrolled={scrolled}
            onOpenQR={() => setShowQR(true)}
          />

          <WeddingHero />

          <InvitationLetter />

          <LoveStory />

          <FamilySection />

          <WeddingEvents />

          <WeddingSchedule />

          <DressCode />

          <GallerySection
            slide={slide}
            setSlide={selectSlide}
            onOpen={setLightboxIndex}
          />

          {wedding.rsvp.enabled && <RSVPSection />}

          <ThankYouSection onOpenQR={() => setShowQR(true)} />

          <footer className="bg-[#4A2936] px-4 py-8 text-center text-white/75">
            <p className="font-heading text-xl italic text-[#EDAFC2]">
              Made with love ♥
            </p>

            <p className="mt-2 text-[9px] uppercase tracking-[0.24em]">
              {wedding.bride.name} & {wedding.groom.name}
            </p>
          </footer>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            aria-label="Cuộn lên đầu trang"
            className={`fixed bottom-24 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-[#A95070] text-white shadow-xl transition duration-500 hover:-translate-y-1 sm:right-6 ${
              scrolled
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-5 opacity-0"
            }`}
          >
            ↑
          </button>
        </>
      )}

      <QRModal open={showQR} onClose={() => setShowQR(false)} />

      <Lightbox
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onChange={setLightboxIndex}
      />

      <MusicPlayer src={wedding.music.src} />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #fff9f8;
        }

        .wedding-page {
          --rose: #bd5c7e;
          --rose-light: #e6a9bc;
          --ink: #633c4b;
        }

        ::selection {
          background: #d889a4;
          color: white;
        }

        [data-reveal] {
          opacity: 0;
          transform: translateY(34px);
          transition:
            opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
          transition-delay: var(--reveal-delay, 0ms);
        }

        [data-reveal][data-visible="true"] {
          opacity: 1;
          transform: translateY(0);
        }

        .falling-petal {
          animation-name: petal-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-origin: center;
          will-change: transform;
        }

        @keyframes petal-fall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(var(--petal-rotate));
          }

          25% {
            transform: translate3d(calc(var(--petal-drift) * 0.4), 25vh, 0)
              rotate(160deg);
          }

          55% {
            transform: translate3d(calc(var(--petal-drift) * -0.35), 60vh, 0)
              rotate(420deg);
          }

          100% {
            transform: translate3d(var(--petal-drift), 112vh, 0) rotate(720deg);
          }
        }

        .animate-heart {
          display: inline-block;
          animation: heartbeat 1.8s ease-in-out infinite;
        }

        @keyframes heartbeat {
          0%,
          100% {
            transform: scale(1);
          }

          10% {
            transform: scale(1.18);
          }

          20% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.12);
          }

          45% {
            transform: scale(1);
          }
        }

        .cover-orb {
          animation: orb-float 8s ease-in-out infinite;
        }

        .cover-orb-delayed {
          animation: orb-float 10s 1.6s ease-in-out infinite reverse;
        }

        @keyframes orb-float {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(25px, -22px, 0) scale(1.08);
          }
        }

        .sparkle {
          animation: sparkle 2.8s ease-in-out infinite;
        }

        .sparkle-two {
          animation-delay: 0.8s;
        }

        .sparkle-three {
          animation-delay: 1.4s;
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.65) rotate(0);
          }

          50% {
            opacity: 1;
            transform: scale(1.2) rotate(90deg);
          }
        }

        .cover-photo {
          animation:
            cover-photo-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both,
            photo-float 6s 1.2s ease-in-out infinite;
        }

        .cover-photo-two {
          animation-delay: 0.15s, 1.35s;
        }

        .cover-photo-three {
          animation-delay: 0.3s, 1.5s;
        }

        .cover-photo-four {
          animation-delay: 0.45s, 1.65s;
        }

        @keyframes cover-photo-in {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.82);
          }

          to {
            opacity: 1;
          }
        }

        @keyframes photo-float {
          0%,
          100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -9px;
          }
        }

        .invitation-card {
          animation: invitation-in 1.2s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes invitation-in {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .cover-main-photo {
          animation: main-photo 1s 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes main-photo {
          from {
            opacity: 0;
            transform: rotate(-8deg) scale(0.8);
          }

          to {
            opacity: 1;
            transform: rotate(-2deg) scale(1);
          }
        }

        .open-button {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }

        .open-button::before {
          position: absolute;
          inset: 0;
          z-index: -1;
          content: "";
          background: linear-gradient(
            110deg,
            transparent 20%,
            rgba(255, 255, 255, 0.5) 48%,
            transparent 76%
          );
          transform: translateX(-140%);
          animation: button-shine 3.2s 1.4s ease-in-out infinite;
        }

        @keyframes button-shine {
          0%,
          60% {
            transform: translateX(-140%);
          }

          100% {
            transform: translateX(140%);
          }
        }

        .envelope-shadow {
          animation: shadow-breathe 3s ease-in-out infinite;
        }

        @keyframes shadow-breathe {
          0%,
          100% {
            transform: scaleX(0.9);
            opacity: 0.55;
          }

          50% {
            transform: scaleX(1.08);
            opacity: 0.8;
          }
        }

        .hero-image {
          animation: hero-zoom 14s ease-out both;
        }

        @keyframes hero-zoom {
          from {
            transform: scale(1.08);
          }

          to {
            transform: scale(1);
          }
        }

        .hero-eyebrow,
        .hero-title,
        .hero-date,
        .hero-subtitle {
          opacity: 0;
          animation: hero-copy-in 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .hero-eyebrow {
          animation-delay: 0.25s;
        }

        .hero-title {
          animation-delay: 0.45s;
        }

        .hero-date {
          animation-delay: 0.7s;
        }

        .hero-subtitle {
          animation-delay: 0.9s;
        }

        @keyframes hero-copy-in {
          from {
            opacity: 0;
            transform: translateY(35px);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .scroll-indicator {
          animation: scroll-indicator 2.2s ease-in-out infinite;
        }

        .scroll-dot {
          animation: scroll-dot 2.2s ease-in-out infinite;
        }

        @keyframes scroll-indicator {
          0%,
          100% {
            transform: translate(-50%, 0);
          }

          50% {
            transform: translate(-50%, 6px);
          }
        }

        @keyframes scroll-dot {
          0% {
            transform: translateY(0);
            opacity: 0;
          }

          30%,
          70% {
            opacity: 1;
          }

          100% {
            transform: translateY(17px);
            opacity: 0;
          }
        }

        .nav-link {
          position: relative;
        }

        .nav-link::after {
          position: absolute;
          left: 0;
          bottom: -5px;
          width: 0;
          height: 1px;
          content: "";
          background: currentColor;
          transition: width 300ms ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .polaroid::after {
          position: absolute;
          inset: 0;
          pointer-events: none;
          content: "";
          background: linear-gradient(
            120deg,
            transparent 35%,
            rgba(255, 255, 255, 0.25),
            transparent 65%
          );
          transform: translateX(-120%);
          transition: transform 800ms ease;
        }

        .polaroid:hover::after {
          transform: translateX(120%);
        }

        .family-card::after,
        .event-card::after {
          position: absolute;
          inset: 0;
          pointer-events: none;
          content: "";
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.26),
            transparent
          );
          transform: translateX(-110%);
          transition: transform 900ms ease;
        }

        .family-card:hover::after,
        .event-card:hover::after {
          transform: translateX(110%);
        }

        .timeline-dot {
          animation: timeline-pulse 2.6s ease-in-out infinite;
        }

        @keyframes timeline-pulse {
          0%,
          100% {
            box-shadow: 0 0 0 5px rgba(194, 99, 131, 0.14);
          }

          50% {
            box-shadow: 0 0 0 13px rgba(194, 99, 131, 0);
          }
        }

        .countdown-card {
          animation: countdown-breathe 4s ease-in-out infinite;
        }

        .countdown-card:nth-child(2) {
          animation-delay: 0.25s;
        }

        .countdown-card:nth-child(3) {
          animation-delay: 0.5s;
        }

        .countdown-card:nth-child(4) {
          animation-delay: 0.75s;
        }

        @keyframes countdown-breathe {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .wedding-calendar {
          transform: rotate(-0.5deg);
          transition:
            transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 600ms ease;
        }

        .wedding-calendar:hover {
          transform: rotate(0deg) translateY(-6px);
          box-shadow: 0 32px 75px rgba(102, 51, 70, 0.16);
        }

        .calendar-heart {
          animation: calendar-heartbeat 2.4s ease-in-out infinite;
          filter: drop-shadow(0 8px 8px rgba(139, 69, 93, 0.2));
        }

        @keyframes calendar-heartbeat {
          0%,
          100% {
            transform: scale(0.92);
          }

          15% {
            transform: scale(1.05);
          }

          30% {
            transform: scale(0.95);
          }

          45% {
            transform: scale(1);
          }
        }

        .schedule-time {
          animation: schedule-pulse 3s ease-in-out infinite;
        }

        @keyframes schedule-pulse {
          0%,
          100% {
            box-shadow: 0 12px 24px rgba(134, 64, 88, 0.18);
          }

          50% {
            box-shadow:
              0 12px 24px rgba(134, 64, 88, 0.22),
              0 0 0 9px rgba(190, 98, 130, 0.08);
          }
        }

        .dress-color {
          animation: dress-color-in 800ms var(--dress-delay)
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes dress-color-in {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.85);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .gallery-image {
          opacity: 0;
          transform: scale(1.07);
          transition:
            opacity 900ms ease,
            transform 6s ease;
        }

        .gallery-image.is-active {
          z-index: 1;
          opacity: 1;
          transform: scale(1);
        }

        .gallery-frame {
          transition:
            transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 600ms ease;
        }

        .thumbnail:hover {
          transform: translateY(-8px) rotate(0deg) scale(1.04);
        }

        .gallery-arrow {
          animation: gallery-arrow-pulse 2.8s ease-in-out infinite;
        }

        @keyframes gallery-arrow-pulse {
          0%,
          100% {
            box-shadow: 0 10px 25px rgba(120, 55, 80, 0.25);
          }

          50% {
            box-shadow:
              0 10px 25px rgba(120, 55, 80, 0.3),
              0 0 0 8px rgba(190, 98, 130, 0.1);
          }
        }

        .lightbox,
        .qr-backdrop {
          animation: backdrop-in 250ms ease both;
        }

        .lightbox > div,
        .qr-modal {
          animation: modal-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes backdrop-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modal-in {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.94);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .qr-card {
          animation: qr-card-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes qr-card-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.92);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .cover-photo {
            opacity: 0.82;
          }

          .hero-image {
            object-position: 52% center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          [data-reveal] {
            opacity: 1;
            transform: none;
          }

          .falling-petal {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
