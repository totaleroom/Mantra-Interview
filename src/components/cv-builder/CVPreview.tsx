import React from 'react';
import type { CVData } from './types';

interface Props {
  data: CVData;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const monthIdx = parseInt(month, 10) - 1;
  return `${MONTHS[monthIdx] || month} ${year}`;
}

const expTypeLabel: Record<string, string> = {
  kerja: 'WORK EXPERIENCE',
  magang: 'INTERNSHIP',
  freelance: 'FREELANCE',
  organisasi: 'ORGANIZATION',
  volunteer: 'VOLUNTEER',
};

/** Parse description text into bullet list items or plain text */
function renderDescription(text: string) {
  const lines = text.split('\n').filter(l => l.trim());
  const bulletLines = lines.filter(l => /^\s*[-•–]\s/.test(l));
  // If most lines are bullets, render as list
  if (bulletLines.length >= lines.length * 0.5 && bulletLines.length > 0) {
    return (
      <ul className="list-disc ml-4 mt-1 space-y-0.5">
        {lines.map((line, i) => (
          <li key={i} className="text-[11px] leading-snug">
            {line.replace(/^\s*[-•–]\s*/, '')}
          </li>
        ))}
      </ul>
    );
  }
  return <p className="text-[11px] mt-1 whitespace-pre-line">{text}</p>;
}

const CVPreview: React.FC<Props> = ({ data }) => {
  const { personal_info: p, summary, target_position, experiences, education, skills, certifications, languages } = data;

  // Group experiences by type
  const groupedExp = experiences.reduce<Record<string, typeof experiences>>((acc, exp) => {
    const type = exp.type || 'kerja';
    if (!acc[type]) acc[type] = [];
    acc[type].push(exp);
    return acc;
  }, {});

  return (
    <article role="article" className="cv-preview-printable bg-white text-black p-8 font-body text-sm leading-relaxed max-w-[210mm] mx-auto border border-gray-300" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Header - Name & Contact */}
      <header className="text-center border-b-2 border-black pb-3 mb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{p.full_name || 'NAMA LENGKAP'}</h1>
        {p.tagline && <p className="text-sm text-gray-600 mt-0.5 italic">{p.tagline}</p>}
        {target_position && <p className="text-sm text-gray-600 mt-1">{target_position}</p>}
        <address className="not-italic flex flex-wrap justify-center gap-3 mt-2 text-xs text-gray-700">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>| {p.phone}</span>}
          {p.city && <span>| {p.city}</span>}
          {p.linkedin_url && <span>| {p.linkedin_url.replace(/^https?:\/\//, '')}</span>}
          {p.portfolio_url && <span>| Portfolio</span>}
        </address>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
          <p className="text-[11px] leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience - grouped by type */}
      {Object.entries(groupedExp).map(([type, exps]) => (
        <section key={type} className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">{expTypeLabel[type] || 'EXPERIENCE'}</h2>
          {exps.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[11px]">{exp.position}</span>
                <span className="text-[10px] text-gray-600">{formatMonthYear(exp.start_date)} — {exp.is_current ? 'Present' : formatMonthYear(exp.end_date)}</span>
              </div>
              <p className="text-[11px] text-gray-700 italic">{exp.company}</p>
              {exp.description && renderDescription(exp.description)}
            </div>
          ))}
        </section>
      ))}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">EDUCATION</h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[11px]">{edu.degree} — {edu.major}</span>
                <span className="text-[10px] text-gray-600">{edu.graduation_year}</span>
              </div>
              <p className="text-[11px] text-gray-700">
                {edu.institution}
                {edu.gpa ? ` | IPK: ${edu.gpa}` : ''}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.hard_skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">SKILLS</h2>
          <p className="text-[11px]"><strong>Technical:</strong> {skills.hard_skills.join(', ')}</p>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">LANGUAGES</h2>
          <p className="text-[11px]">{languages.map(l => `${l.name} (${l.level})`).join(' · ')}</p>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-1 mb-2">CERTIFICATIONS</h2>
          {certifications.map((cert) => (
            <p key={cert.id} className="text-[11px] mb-1">{cert.name} — {cert.issuer} ({cert.year})</p>
          ))}
        </section>
      )}
    </article>
  );
};

export default CVPreview;
