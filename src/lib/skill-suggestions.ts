// Skill Suggestions Library - 100% offline, keyword-based

const SKILL_MAP: Record<string, string[]> = {
  "media sosial": ["Social Media Management", "Content Creation", "Instagram", "TikTok", "Facebook Ads", "Canva"],
  "sosmed": ["Social Media Management", "Content Creation", "Instagram", "TikTok", "Canva"],
  "marketing": ["Digital Marketing", "SEO", "SEM", "Google Analytics", "Google Ads", "Content Marketing"],
  "desain": ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva", "UI/UX Design"],
  "design": ["Figma", "Adobe Photoshop", "Adobe Illustrator", "Canva", "UI/UX Design"],
  "data": ["Data Analysis", "Microsoft Excel", "Google Sheets", "SQL", "Python", "Tableau"],
  "excel": ["Microsoft Excel", "Pivot Table", "VLOOKUP", "Dashboard", "Data Visualization"],
  "admin": ["Microsoft Office", "Data Entry", "Filing", "Scheduling", "Google Workspace"],
  "customer": ["Customer Service", "CRM", "Communication", "Problem Solving"],
  "sales": ["Sales", "Negotiation", "CRM", "Lead Generation", "Cold Calling"],
  "accounting": ["Accounting", "Jurnal Umum", "Laporan Keuangan", "Microsoft Excel", "Accurate", "SAP"],
  "keuangan": ["Financial Analysis", "Budgeting", "Microsoft Excel", "Financial Reporting"],
  "programming": ["JavaScript", "Python", "Git", "Problem Solving", "Agile"],
  "web": ["HTML", "CSS", "JavaScript", "React", "Next.js", "Git"],
  "mobile": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
  "video": ["Video Editing", "Adobe Premiere", "CapCut", "DaVinci Resolve", "Storytelling"],
  "menulis": ["Content Writing", "Copywriting", "SEO Writing", "Editing", "Proofreading"],
  "writing": ["Content Writing", "Copywriting", "SEO Writing", "Editing"],
  "fotografi": ["Photography", "Adobe Lightroom", "Adobe Photoshop", "Composition"],
  "event": ["Event Planning", "Project Management", "Vendor Management", "Budgeting"],
  "mengajar": ["Teaching", "Curriculum Development", "Public Speaking", "Training"],
  "riset": ["Research", "Data Collection", "Analysis", "Report Writing", "SPSS"],
  "logistik": ["Supply Chain", "Inventory Management", "Warehouse", "Distribution"],
  "hrd": ["Recruitment", "HRIS", "Employee Relations", "Training & Development"],
  "hr": ["Recruitment", "HRIS", "Employee Relations", "Training & Development"],
};

export function suggestSkills(experienceTexts: string[]): string[] {
  const combined = experienceTexts.join(' ').toLowerCase();
  const suggested = new Set<string>();

  // Sort by key length (desc) to match longer phrases first
  const sortedKeys = Object.keys(SKILL_MAP).sort((a, b) => b.length - a.length);

  for (const keyword of sortedKeys) {
    if (combined.includes(keyword)) {
      for (const skill of SKILL_MAP[keyword]) {
        suggested.add(skill);
      }
    }
  }

  return Array.from(suggested);
}
