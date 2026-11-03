import {
  Brain,
  Hammer,
  Hand,
  HeartHandshake,
  LayoutGrid,
  ListOrdered,
  ScanEye,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

export type Verse = { ref: string; text: string };

export type Discipline = {
  id: string;
  numeral: string;
  title: string;
  icon: LucideIcon;
  notes: string[];
  verses: Verse[];
};

export const openingVerse: Verse = {
  ref: "2 Peter 1:6",
  text: "and in knowledge, self-control; and in self-control, perseverance; and in perseverance, godliness.",
};

export const disciplines: Discipline[] = [
  {
    id: "flexible-thinking",
    numeral: "I",
    title: "Flexible thinking",
    icon: Waypoints,
    notes: [
      "When negative thoughts come, take refuge in God.",
      "Plan carefully toward profit, but know when to adjust, and when you've made more than enough, give some away.",
    ],
    verses: [
      {
        ref: "Proverbs 27:12",
        text: "The prudent see danger and take refuge, but the simple keep going and pay the penalty.",
      },
      {
        ref: "Proverbs 21:5",
        text: "The plans of the diligent lead to profit as surely as haste leads to loss.",
      },
    ],
  },
  {
    id: "working-memory",
    numeral: "II",
    title: "Working memory",
    icon: Brain,
    notes: ["When Jesus gives you insight, you should listen to it."],
    verses: [
      {
        ref: "Proverbs 3:21",
        text: "My son, do not let wisdom and understanding out of your sight, keep sound judgment and discretion.",
      },
      {
        ref: "Philippians 4:8",
        text: "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable—if anything is excellent or praiseworthy—think about such things.",
      },
    ],
  },
  {
    id: "self-monitoring",
    numeral: "III",
    title: "Self-monitoring",
    icon: ScanEye,
    notes: [
      "Whoever you are, be honest about where you stand, then take the bread and the wine. Receiving from Jesus that way is acceptable.",
    ],
    verses: [
      {
        ref: "1 Corinthians 11:28",
        text: "Everyone ought to examine themselves before they eat of the bread and drink from the cup.",
      },
      {
        ref: "Galatians 6:4",
        text: "Each of you should test your own actions. Then you can take pride in yourself, without comparing yourself to somebody else.",
      },
      {
        ref: "Matthew 7:3",
        text: "Why do you look at the speck of sawdust in your brother's eye and pay no attention to the plank in your own eye?",
      },
    ],
  },
  {
    id: "planning-and-prioritizing",
    numeral: "IV",
    title: "Planning and prioritizing",
    icon: ListOrdered,
    notes: ["Tell the Lord about your plan, and it will succeed."],
    verses: [
      {
        ref: "Proverbs 21:5",
        text: "The plans of the diligent lead to profit as surely as haste leads to loss.",
      },
      {
        ref: "Proverbs 16:3",
        text: "Commit to the Lord whatever you do, and your plans will succeed.",
      },
    ],
  },
  {
    id: "task-initiation",
    numeral: "V",
    title: "Task initiation",
    icon: Hammer,
    notes: ["Remember that you only work for the Lord Jesus Christ, whom you are serving."],
    verses: [
      {
        ref: "Proverbs 6:6–8",
        text: "Go to the ant, you sluggard; consider its ways and be wise! It has no commander, no overseer or ruler, yet it stores its provisions in summer and gathers its food at harvest.",
      },
      {
        ref: "Colossians 3:23–24",
        text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters, since you know that you will receive an inheritance from the Lord as a reward. It is the Lord Christ you are serving.",
      },
    ],
  },
  {
    id: "organization",
    numeral: "VI",
    title: "Organization",
    icon: LayoutGrid,
    notes: ["Indeed, God is not a God of confusion, but of peace."],
    verses: [
      { ref: "1 Corinthians 14:33", text: "God is not a God of confusion but of peace." },
      { ref: "1 Corinthians 14:40", text: "Let all things be done decently and in order." },
    ],
  },
  {
    id: "impulse-control",
    numeral: "VII",
    title: "Impulse control",
    icon: Hand,
    notes: [
      "When you notice that you don't like your impulses, share them with God and invite His Spirit into that space.",
    ],
    verses: [
      {
        ref: "Proverbs 16:32",
        text: "The one who is slow to anger is better than the mighty, and the one who rules his spirit is better than the one who captures a city.",
      },
      { ref: "2 Corinthians 10:5", text: "Take captive every thought to make it obedient to Christ." },
      {
        ref: "Galatians 5:22–23",
        text: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.",
      },
    ],
  },
  {
    id: "emotional-control",
    numeral: "VIII",
    title: "Emotional control",
    icon: HeartHandshake,
    notes: ["Release our emotional weight to Jesus rather than carrying it alone or acting it out."],
    verses: [{ ref: "1 Peter 5:7", text: "Cast all your anxiety on him because he cares for you." }],
  },
];

/** Every verse once (Proverbs 21:5 appears under two headings), with where it lives. */
export const allVerses: (Verse & { from: Discipline })[] = (() => {
  const seen = new Set<string>();
  const out: (Verse & { from: Discipline })[] = [];
  for (const d of disciplines) {
    for (const v of d.verses) {
      if (seen.has(v.ref)) continue;
      seen.add(v.ref);
      out.push({ ...v, from: d });
    }
  }
  return out;
})();
