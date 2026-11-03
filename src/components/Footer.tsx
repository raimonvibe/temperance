import { Feather } from "lucide-react";
import { openingVerse } from "@/data/content";
import { SocialIcons } from "./SocialIcons";
import { CurrentYear } from "./CurrentYear";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="ornament" aria-hidden>
          <span />
          <Feather size={16} strokeWidth={1.5} />
          <span />
        </div>
        <SocialIcons />
        <p className="footer-verse">
          <em>“{openingVerse.text}”</em> <span className="ref">{openingVerse.ref}</span>
        </p>
        <p className="footer-meta">
          © <CurrentYear /> Temperance
        </p>
      </div>
    </footer>
  );
}
