export interface PalmAnalysisReport {
  scanId: string;
  timestamp: string;
  imageUrl?: string;
  scores: {
    personality: number;
    confidence: number;
    leadership: number;
    creativity: number;
    communication: number;
    eq: number;
  };
  lines: {
    heart: { name: string; type: string; description: string };
    head: { name: string; type: string; description: string };
    life: { name: string; type: string; description: string };
    fate: { name: string; type: string; description: string };
    sun: { name: string; type: string; description: string };
    marriage: { name: string; type: string; description: string };
  };
  mounts: {
    jupiter: { name: string; strength: string; description: string };
    saturn: { name: string; strength: string; description: string };
    apollo: { name: string; strength: string; description: string };
    mercury: { name: string; strength: string; description: string };
    venus: { name: string; strength: string; description: string };
    luna: { name: string; strength: string; description: string };
  };
  personality: string;
  career: {
    suggested: string[];
    successScore: number;
    guidance: string;
  };
  relationships: {
    compatibilityScore: number;
    strengths: string[];
    challenges: string[];
    guidance: string;
  };
  wealth: {
    disciplineScore: number;
    riskAppetite: number;
    wealthPotential: number;
    guidance: string;
  };
  health: {
    energyLevel: number;
    stressTendency: number;
    sleepQuality: number;
    mentalFocus: number;
    tendencies: string;
  };
  futureTimeline: {
    year2026: string;
    year2027: string;
    year2028: string;
    year2029: string;
    year2030: string;
  };
  remedies: {
    title: string;
    type: string;
    description: string;
    mantra?: string;
  }[];
}

export interface AstrologyProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  zodiacSign: string;
  moonSign: string;
  risingSign: string;
  birthNumber: number;
  luckyNumber: number;
  luckyColor: string;
  luckyDay: string;
  luckyGemstone: string;
  characteristics: string;
}

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

// Helper to determine Zodiac Sign based on Month & Day
export function getZodiacSign(dateStr: string): string {
  if (!dateStr) return "Leo";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Leo";
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

// Generate Astrology Data based on birth info
export function generateAstrologyProfile(name: string, birthDate: string, birthTime: string, birthPlace: string): AstrologyProfile {
  const zodiacSign = getZodiacSign(birthDate);
  
  // Deterministic seed generation based on date & name length
  const nameVal = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dayVal = birthDate ? new Date(birthDate).getDate() : 15;
  const monthVal = birthDate ? new Date(birthDate).getMonth() + 1 : 7;
  
  const seed = (nameVal + dayVal * 7 + monthVal * 31) % 9;
  
  const moonSigns = ["Cancer", "Taurus", "Leo", "Scorpio", "Gemini", "Libra", "Aries", "Virgo", "Pisces"];
  const risingSigns = ["Leo", "Libra", "Sagittarius", "Aries", "Taurus", "Gemini", "Cancer", "Virgo", "Capricorn"];
  const colors = ["Deep Crimson", "Golden Yellow", "Emerald Green", "Royal Blue", "Saffron Gold", "Amethyst Violet", "Rose Gold", "Pearlescent White"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const gemstones = ["Ruby", "Yellow Sapphire", "Emerald", "Blue Sapphire", "Diamond", "Red Coral", "Pearl", "Hessonite", "Cat's Eye"];
  
  const birthNumber = ((dayVal - 1) % 9) + 1;
  const luckyNumber = ((seed + birthNumber) % 9) + 1;
  const luckyColor = colors[seed % colors.length];
  const luckyDay = days[(seed + 3) % days.length];
  const luckyGemstone = gemstones[(seed * 2) % gemstones.length];
  
  const moonSign = moonSigns[seed % moonSigns.length];
  const risingSign = risingSigns[(seed + 2) % risingSigns.length];

  const characteristicsMap: Record<string, string> = {
    Aries: "Driven by passion, courage, and a desire to lead. You possess immense raw energy and excel in starting new ventures.",
    Taurus: "Grounded, reliable, and deeply connected to comfort and stability. You build things to last and appreciate aesthetic harmony.",
    Gemini: "Highly intellectual, versatile, and communicative. You thrive on learning new ideas and connecting different concepts.",
    Cancer: "Deeply intuitive, nurturing, and emotionally protective. You have a powerful connection to home, heritage, and empathy.",
    Leo: "Radiant, expressive, and natural leaders. You carry yourself with noble self-assurance and thrive when inspiring others.",
    Virgo: "Analytical, precise, and dedicated to service. You possess a keen eye for detail and find deep fulfillment in bringing order to chaos.",
    Libra: "Harmonious, diplomatic, and beauty-loving. You seek absolute balance in relationships and excel in artistic mediation.",
    Scorpio: "Intense, transformative, and magnetic. You possess a sharp perception that pierces through facades and values loyalty above all.",
    Sagittarius: "Philosophical, adventurous, and truth-seeking. You are driven by an insatiable curiosity to expand your horizons.",
    Capricorn: "Ambitious, disciplined, and patient. You view life as a mountain to climb, building steady long-term success.",
    Aquarius: "Visionary, eccentric, and humanitarian. You think outside societal constraints and seek to revolutionize collective ideas.",
    Pisces: "Dreamy, artistic, and spiritually sensitive. You exist at the boundary of reality and imagination, channeling deep empathy."
  };

  return {
    name: name || "Seeker",
    birthDate: birthDate || "1995-07-16",
    birthTime: birthTime || "12:00",
    birthPlace: birthPlace || "Varanasi, India",
    zodiacSign,
    moonSign,
    risingSign,
    birthNumber,
    luckyNumber,
    luckyColor,
    luckyDay,
    luckyGemstone,
    characteristics: characteristicsMap[zodiacSign] || characteristicsMap["Leo"]
  };
}

// Generate Palm Analysis
export function generatePalmAnalysis(imageUrl?: string): PalmAnalysisReport {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const heartTypes = [
    { type: "Chained and Deep", desc: "Suggests a highly emotional and passionate nature. You experience deep attachments and possess immense empathy, though you are prone to emotional vulnerability." },
    { type: "Long and Curved", desc: "Indicates that you express your feelings with warmth and directness. You are romantic and place high value on loyalty in intimate bonds." },
    { type: "Straight and Short", desc: "Suggests a practical approach to relationships. You prefer actions over words and guard your emotional space carefully." }
  ];

  const headTypes = [
    { type: "Long and Sloping", desc: "Points to a highly creative and imaginative intellect. You tend to view problems from unconventional angles and trust your intuitive insights." },
    { type: "Straight and Clear", desc: "Indicates logical, systematic thinking. You are highly analytical, realistic, and excel in structured environments requiring focus." },
    { type: "Forked at the End (Writer's Fork)", desc: "Indicates dual perspectives, excellent communication skills, and adaptability. You can easily balance creative and analytical pursuits." }
  ];

  const lifeTypes = [
    { type: "Semicircular and Strong", desc: "Indicates robust physical vitality, a strong constitution, and a zest for life. You recover quickly from setbacks and possess high resilience." },
    { type: "Chained or Broken", desc: "Suggests periods of energy fluctuations or major lifestyle transitions. You are highly sensitive to stress and need regular periods of grounding." },
    { type: "Close to the Thumb", desc: "Suggests a home-loving, cautious personality. You gain strength from familiar surroundings and prefer carefully structured paths." }
  ];

  const fateTypes = [
    { type: "Starting from the Base", desc: "Indicates a self-made destiny. You set clear goals early in life and rely on your own determination to achieve them." },
    { type: "Starting from the Life Line", desc: "Indicates that your early career was heavily influenced by family obligations or early environment, but you establish independence later." },
    { type: "Absent or Faint", desc: "Suggests a flexible career path where you prefer freedom and adaptability over rigid, pre-defined corporate structures." }
  ];

  const sunTypes = [
    { type: "Strong and Continuous", desc: "Indicates high artistic talent, public recognition, and the capacity to attract wealth easily. Your creative efforts will bear substantial fruit." },
    { type: "Faint or Segmented", desc: "Suggests that while success is assured, it will arrive in phases. Your creative endeavors require persistence and patience before public acknowledgment." },
    { type: "Forked", desc: "Indicates multiple talents. You have the potential for fame or success in more than one field, blending artistic style with material success." }
  ];

  const marriageTypes = [
    { type: "Two Clear Lines", desc: "Suggests two significant, deep emotional connections or marriages in your lifetime, both contributing heavily to your personal growth." },
    { type: "Single Straight Line", desc: "Indicates a singular, deeply committed relationship that acts as a major anchor in your life, built on mutual trust and longevity." },
    { type: "Curved Upwards", desc: "Suggests that your personal relationships will thrive when they allow you complete independence and creative space." }
  ];

  const jupiterMounts = [
    { strength: "Prominent", desc: "Highly ambitious, natural leadership skills, high self-esteem, and a philosophical mind." },
    { strength: "Normal", desc: "Healthy self-worth, motivated to achieve goals without imposing on others." }
  ];
  
  const saturnMounts = [
    { strength: "Prominent", desc: "Very disciplined, serious, reflective, and inclined toward research, spirituality, or solitude." },
    { strength: "Normal", desc: "Responsible and organized, maintaining a good balance between work and play." }
  ];

  const apolloMounts = [
    { strength: "Prominent", desc: "Extremely creative, appreciation for beauty, desires fame, and has a charismatic public presence." },
    { strength: "Normal", desc: "Appreciates art and design, enjoys social activities, seeks harmony." }
  ];

  const mercuryMounts = [
    { strength: "Prominent", desc: "Excellent communicator, quick-witted, strong business acumen, and natural scientific curiosity." },
    { strength: "Normal", desc: "Articulate and friendly, capable of expressing thoughts clearly and building professional networks." }
  ];

  const venusMounts = [
    { strength: "Prominent", desc: "Full of vitality, highly affectionate, loves luxury, food, and music, and has strong magnetic appeal." },
    { strength: "Normal", desc: "Kind and sympathetic, enjoys a stable domestic life, values close friendships." }
  ];

  const lunaMounts = [
    { strength: "Prominent", desc: "Deeply imaginative, love for travel and nature, highly intuitive, and prone to vivid dreaming." },
    { strength: "Normal", desc: "Reasonable imagination, enjoys reading, prefers stable surroundings." }
  ];

  // Pick random but highly polished entries
  const heart = heartTypes[rand(0, heartTypes.length - 1)];
  const head = headTypes[rand(0, headTypes.length - 1)];
  const life = lifeTypes[rand(0, lifeTypes.length - 1)];
  const fate = fateTypes[rand(0, fateTypes.length - 1)];
  const sun = sunTypes[rand(0, sunTypes.length - 1)];
  const marriage = marriageTypes[rand(0, marriageTypes.length - 1)];

  const jupiter = jupiterMounts[rand(0, jupiterMounts.length - 1)];
  const saturn = saturnMounts[rand(0, saturnMounts.length - 1)];
  const apollo = apolloMounts[rand(0, apolloMounts.length - 1)];
  const mercury = mercuryMounts[rand(0, mercuryMounts.length - 1)];
  const venus = venusMounts[rand(0, venusMounts.length - 1)];
  const luna = lunaMounts[rand(0, lunaMounts.length - 1)];

  const scoreP = rand(80, 96);
  const scoreConf = rand(78, 95);
  const scoreLead = rand(75, 94);
  const scoreCre = rand(82, 98);
  const scoreCom = rand(80, 96);
  const scoreEq = rand(84, 97);

  const careers = ["Entrepreneur", "Designer", "Software Engineer", "Researcher", "Teacher", "Consultant", "Creative Director"];
  const selectedCareers = [...careers].sort(() => 0.5 - Math.random()).slice(0, 4);

  const remediesList = [
    {
      title: "Morning Sun Meditation",
      type: "Meditation",
      description: "Spend 10 minutes looking in the direction of the rising sun and meditating. This strengthens the Apollo Mount, enhancing clarity, fame, and self-confidence.",
      mantra: "Om Suryaya Namaha (108 times)"
    },
    {
      title: "Anahata Heart Chakra Healing",
      type: "Spiritual Practices",
      description: "Place your hand on your chest and practice deep breathing while visualizing a warm green light. This balances emotional blockages related to a chained heart line.",
      mantra: "Yam (Chakra Seed Sound)"
    },
    {
      title: "Friday Charity and Acts of Kindness",
      type: "Charity",
      description: "Donate white items (milk, rice, or silver ornaments) or sweets to children or the underserved on Fridays. This strengthens your Venus mount, attracting luxury, love, and domestic harmony."
    },
    {
      title: "Mindfulness and Stoic Journaling",
      type: "Positive Habits",
      description: "Write down three things you are anxious about before sleeping, then cross them out. This calms the overactive Moon mount and reduces overthinking.",
      mantra: "Om Som Somaya Namaha"
    }
  ];

  return {
    scanId: Math.random().toString(36).substring(2, 11).toUpperCase(),
    timestamp: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    imageUrl,
    scores: {
      personality: scoreP,
      confidence: scoreConf,
      leadership: scoreLead,
      creativity: scoreCre,
      communication: scoreCom,
      eq: scoreEq,
    },
    lines: {
      heart: { name: "Heart Line", type: heart.type, description: heart.desc },
      head: { name: "Head Line", type: head.type, description: head.desc },
      life: { name: "Life Line", type: life.type, description: life.desc },
      fate: { name: "Fate Line", type: fate.type, description: fate.desc },
      sun: { name: "Sun Line", type: sun.type, description: sun.desc },
      marriage: { name: "Marriage Line", type: marriage.type, description: marriage.desc },
    },
    mounts: {
      jupiter: { name: "Mount of Jupiter", strength: jupiter.strength, description: jupiter.desc },
      saturn: { name: "Mount of Saturn", strength: saturn.strength, description: saturn.desc },
      apollo: { name: "Mount of Apollo (Sun)", strength: apollo.strength, description: apollo.desc },
      mercury: { name: "Mount of Mercury", strength: mercury.strength, description: mercury.desc },
      venus: { name: "Mount of Venus", strength: venus.strength, description: venus.desc },
      luna: { name: "Mount of Moon (Luna)", strength: luna.strength, description: luna.desc },
    },
    personality: "You are independent, intuitive, and highly determined. You tend to trust your instincts more than external opinions, and you possess a strong capacity for empathy combined with analytical precision. You seek depth in your pursuits and dislike superficial interactions.",
    career: {
      suggested: selectedCareers,
      successScore: rand(80, 95),
      guidance: "Your lines indicate a high affinity for roles that merge logic with creative vision. You are not suited for repetitive tasks; you require autonomy and problems to solve. Focus on leadership and strategic positioning."
    },
    relationships: {
      compatibilityScore: rand(75, 96),
      strengths: ["Loyal", "Caring", "Honest", "Empathetic"],
      challenges: ["Overthinking", "Possessiveness", "Difficulty Letting Go"],
      guidance: "Your heart line indicates deep feelings, but a tendency to guard them out of fear of rejection. Work on direct emotional expression and trust that vulnerability is your strength."
    },
    wealth: {
      disciplineScore: rand(70, 92),
      riskAppetite: rand(55, 85),
      wealthPotential: rand(80, 98),
      guidance: "A strong Mount of Mercury indicates high business intelligence. You will experience substantial wealth growth in your mid-30s, particularly through long-term real estate or technical investments. Avoid emotional spending."
    },
    health: {
      energyLevel: rand(75, 95),
      stressTendency: rand(65, 88),
      sleepQuality: rand(60, 85),
      mentalFocus: rand(78, 94),
      tendencies: "Your life line indicates high vitality, but a prominent Mount of Saturn makes you prone to mental fatigue and stress-induced digestive issues. Ensure proper hydration and structured rest."
    },
    futureTimeline: {
      year2026: "Career Growth: A major transition or expansion in your professional duties, leading to increased recognition and financial rewards.",
      year2027: "Relationship Opportunity: A significant partnership (personal or business) that aligns with your core soul values and offers emotional stability.",
      year2028: "Financial Improvement: An unexpected source of wealth or the yielding of a long-term investment, providing capital for expansion.",
      year2029: "Major Life Change: A shift in residence, philosophy, or personal direction. A spiritual awakening that changes how you approach life.",
      year2030: "Leadership Phase: Reaching a pinnacle in your chosen domain, guiding others, and cementing a long-term legacy."
    },
    remedies: remediesList
  };
}

// Generate Daily Horoscope
export interface DailyHoroscope {
  love: { score: number; desc: string };
  career: { score: number; desc: string };
  health: { score: number; desc: string };
  wealth: { score: number; desc: string };
  overall: number;
}

export function generateDailyHoroscope(zodiacSign: string): DailyHoroscope {
  const hash = zodiacSign.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const today = new Date();
  const dateSeed = today.getDate() + today.getMonth() * 31;
  const seed = (hash + dateSeed) % 100;
  
  const randScore = (offset: number) => {
    const val = (seed * offset) % 31 + 70; // score between 70 and 100
    return val;
  };

  const loveScore = randScore(3);
  const careerScore = randScore(7);
  const healthScore = randScore(11);
  const wealthScore = randScore(13);
  const overall = Math.round((loveScore + careerScore + healthScore + wealthScore) / 4);

  const loveDescriptions = [
    "Venus aligns favorably, paving the way for honest dialogue. Single souls may encounter an intriguing cosmic connection.",
    "A day to practice patience. Expressing gratitude to your partner will dissolve any minor celestial friction.",
    "Your aura is magnetic today. Trust your intuition in matters of the heart; romance is highly favored."
  ];

  const careerDescriptions = [
    "A peak of intellectual focus. Excellent time to present new ideas or conclude complex contract discussions.",
    "Mars provides drive, but Mercury urges caution. Double-check small details before signing documents.",
    "A creative breakthrough is on the horizon. Trust your unique vision and don't hesitate to take the lead."
  ];

  const healthDescriptions = [
    "Vitality is high today. Physical activities will leave you feeling rejuvenated. Remember to hydrate well.",
    "Your nervous system is slightly overstimulated. Practice deep breathing and step away from screens early.",
    "Energy is balanced. Incorporate simple stretching or meditation to maintain this peaceful alignment."
  ];

  const wealthDescriptions = [
    "Financial stars are aligned. A small, calculated risk could yield positive results. Keep an eye out for opportunities.",
    "Consolidate your budget. Refrain from impulse purchases; your future self will thank you for the restraint.",
    "A good day for long-term planning. Review your investments and seek expert guidance if starting something new."
  ];

  return {
    love: { score: loveScore, desc: loveDescriptions[seed % loveDescriptions.length] },
    career: { score: careerScore, desc: careerDescriptions[(seed + 1) % careerDescriptions.length] },
    health: { score: healthScore, desc: healthDescriptions[(seed + 2) % healthDescriptions.length] },
    wealth: { score: wealthScore, desc: wealthDescriptions[(seed + 3) % wealthDescriptions.length] },
    overall
  };
}

// Simulated Astrologer Chatbot Logic
export function getChatbotResponse(history: { role: string; content: string }[], userMessage: string, report?: PalmAnalysisReport): string {
  const msg = userMessage.toLowerCase();
  
  if (!report) {
    return "To give you precise readings, I first need you to upload or scan your palm, or fill out your astrology details! However, I can explain astrology terms: what line are you curious about (Heart, Head, Life, Fate, Sun, Marriage)?";
  }

  // Keywords checks
  if (msg.includes("heart line") || msg.includes("love") || msg.includes("relationship")) {
    return `Your Heart Line is classified as **${report.lines.heart.type}**. This means: ${report.lines.heart.description}\n\n**Relationship outlook:** ${report.relationships.guidance} (Compatibility Score: ${report.relationships.compatibilityScore}%)`;
  }
  
  if (msg.includes("head line") || msg.includes("intellect") || msg.includes("think") || msg.includes("mind")) {
    return `Your Head Line is **${report.lines.head.type}**. Interpretation: ${report.lines.head.description}\n\nThis indicates you possess strong mental focus (${report.health.mentalFocus}%) and process information with unique clarity.`;
  }

  if (msg.includes("life line") || msg.includes("health") || msg.includes("energy") || msg.includes("live")) {
    return `Your Life Line is **${report.lines.life.type}**. Analysis: ${report.lines.life.description}\n\n**Health Tendencies:** ${report.health.tendencies}\nEnergy levels: ${report.health.energyLevel}%, Stress tendency: ${report.health.stressTendency}%.`;
  }

  if (msg.includes("fate line") || msg.includes("career") || msg.includes("job") || msg.includes("work")) {
    return `Your Fate Line is **${report.lines.fate.type}**. Interpretation: ${report.lines.fate.description}\n\n**Career Guidance:** ${report.career.guidance} (Success Score: ${report.career.successScore}%)\n**Suggested paths:** ${report.career.suggested.join(", ")}.`;
  }

  if (msg.includes("sun line") || msg.includes("fame") || msg.includes("success")) {
    return `Your Sun Line is **${report.lines.sun.type}**. Interpretation: ${report.lines.sun.description}\n\nYour creativity score is ${report.scores.creativity}%. This line represents your recognition, reputation, and how easily you will attract public attention.`;
  }

  if (msg.includes("marriage line") || msg.includes("marry") || msg.includes("spouse")) {
    return `Your Marriage Line indicates **${report.lines.marriage.type}**. Meaning: ${report.lines.marriage.description}\n\nFor emotional harmony, the cosmos suggests: ${report.relationships.guidance}`;
  }

  if (msg.includes("wealth") || msg.includes("money") || msg.includes("rich") || msg.includes("finance")) {
    return `Looking at your Mount of Mercury and Mount of Venus, your wealth potential is **${report.wealth.wealthPotential}%** and your financial discipline is **${report.wealth.disciplineScore}%**.\n\n**Financial advice:** ${report.wealth.guidance}`;
  }

  if (msg.includes("remedy") || msg.includes("remedies") || msg.includes("mantra") || msg.includes("improve")) {
    const list = report.remedies.map(r => `* **${r.title}** (${r.type}): ${r.description}${r.mantra ? ` *Mantra: "${r.mantra}"*` : ""}`).join("\n");
    return `Here are the tailored remedies generated for your palm configurations to bring cosmic alignment:\n\n${list}`;
  }

  if (msg.includes("timeline") || msg.includes("future") || msg.includes("2026") || msg.includes("2027") || msg.includes("2028") || msg.includes("2029") || msg.includes("2030")) {
    return `Here is your predicted timeline for the upcoming years:\n\n* **2026**: ${report.futureTimeline.year2026}\n* **2027**: ${report.futureTimeline.year2027}\n* **2028**: ${report.futureTimeline.year2028}\n* **2029**: ${report.futureTimeline.year2029}\n* **2030**: ${report.futureTimeline.year2030}`;
  }

  if (msg.includes("mount") || msg.includes("mounts")) {
    return `Your mounts analysis is as follows:\n\n* **Jupiter**: ${report.mounts.jupiter.strength} — ${report.mounts.jupiter.description}\n* **Saturn**: ${report.mounts.saturn.strength} — ${report.mounts.saturn.description}\n* **Sun (Apollo)**: ${report.mounts.apollo.strength} — ${report.mounts.apollo.description}\n* **Mercury**: ${report.mounts.mercury.strength} — ${report.mounts.mercury.description}\n* **Venus**: ${report.mounts.venus.strength} — ${report.mounts.venus.description}\n* **Moon (Luna)**: ${report.mounts.luna.strength} — ${report.mounts.luna.description}`;
  }

  return `I understand you're asking about your palm reading. You can ask me details about:\n- Your **Heart Line** (Relationships & Love)\n- Your **Head Line** (Intellect & Mind)\n- Your **Life Line** (Vitality & Health)\n- Your **Fate Line** & **Sun Line** (Career & Success)\n- Your **Wealth** or **Remedies**\n- Your **Future Timeline** (2026–2030)`;
}
