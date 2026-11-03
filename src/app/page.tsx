import Image from "next/image";
import { BookOpen } from "lucide-react";
import { openingVerse } from "@/data/content";
import { DailyVerse } from "@/components/DailyVerse";
import { Disciplines } from "@/components/Disciplines";
import heroImage from "../../public/temperance.jpg";

export default function Home() {
  return (
    <>
      <section className="hero" id="top">
        <div className="container">
          <h1 className="hero-title">Temperance</h1>
          <div className="ornament" aria-hidden>
            <span />
            <span className="ornament-glyph">†</span>
            <span />
          </div>

          <figure className="hero-figure">
            <Image
              src={heroImage}
              alt="A white Bible with a cross on the cover beside an open book reading: Knowledge, Self-control, Perseverance, Godliness"
              priority
              placeholder="blur"
              sizes="(max-width: 1200px) 100vw, 1120px"
            />
          </figure>

          <blockquote className="opening-verse" id="opening">
            <BookOpen className="opening-icon" size={22} strokeWidth={1.4} aria-hidden />
            <p>“{openingVerse.text}”</p>
            <cite>{openingVerse.ref}</cite>
          </blockquote>
        </div>
      </section>

      <DailyVerse />
      <Disciplines />
    </>
  );
}
