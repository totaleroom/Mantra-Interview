import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Trash2, Sparkles, Globe } from 'lucide-react';
import type { Skills, Certification, Language } from './types';
import { suggestSkills } from '@/lib/skill-suggestions';
import { useMemo } from 'react';

interface Props {
  skills: Skills;
  certifications: Certification[];
  languages: Language[];
  onSkillsChange: (skills: Skills) => void;
  onCertsChange: (certs: Certification[]) => void;
  onLanguagesChange: (langs: Language[]) => void;
  experienceTexts?: string[];
}

const StepSkills: React.FC<Props> = ({ skills, certifications, languages, onSkillsChange, onCertsChange, onLanguagesChange, experienceTexts = [] }) => {
  const [hardInput, setHardInput] = useState('');

  const suggestedSkills = useMemo(() => {
    if (experienceTexts.length === 0) return [];
    const allCurrent = [...skills.hard_skills, ...skills.soft_skills];
    return suggestSkills(experienceTexts).filter(s => !allCurrent.includes(s));
  }, [experienceTexts, skills.hard_skills, skills.soft_skills]);

  const addSkill = (type: 'hard_skills' | 'soft_skills', input: string, setInput: (v: string) => void) => {
    const trimmed = input.trim();
    if (!trimmed || skills[type].includes(trimmed)) return;
    onSkillsChange({ ...skills, [type]: [...skills[type], trimmed] });
    setInput('');
  };

  const addSuggestedSkill = (skill: string) => {
    if (!skills.hard_skills.includes(skill)) {
      onSkillsChange({ ...skills, hard_skills: [...skills.hard_skills, skill] });
    }
  };

  const removeSkill = (type: 'hard_skills' | 'soft_skills', skill: string) => {
    onSkillsChange({ ...skills, [type]: skills[type].filter(s => s !== skill) });
  };

  const addCert = () => {
    onCertsChange([...certifications, { id: crypto.randomUUID(), name: '', issuer: '', year: '' }]);
  };

  const updateCert = (id: string, field: keyof Certification, value: string) => {
    onCertsChange(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCert = (id: string) => onCertsChange(certifications.filter(c => c.id !== id));

  const addLanguage = () => {
    onLanguagesChange([...languages, { id: crypto.randomUUID(), name: '', level: 'Basic' }]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onLanguagesChange(languages.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLanguage = (id: string) => onLanguagesChange(languages.filter(l => l.id !== id));

  const renderSkillSection = (type: 'hard_skills' | 'soft_skills', label: string, color: string, input: string, setInput: (v: string) => void) => (
    <div className="space-y-2">
      <Label className="font-display text-xs uppercase">{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(type, input, setInput))} placeholder="Ketik lalu Enter" className="border-2 border-foreground" />
        <button onClick={() => addSkill(type, input, setInput)} className={`${color} border-2 border-foreground px-3 shadow-neoSm hover:shadow-none transition-all`}><Plus size={16} /></button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills[type].map(skill => (
          <span key={skill} className={`${color} border-2 border-foreground px-3 py-1 font-body text-xs flex items-center gap-1 shadow-neoSm`}>
            {skill}
            <button onClick={() => removeSkill(type, skill)}><X size={12} /></button>
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="bg-neoLime/20 border-4 border-foreground p-4 shadow-neo">
        <h3 className="font-display text-lg uppercase mb-1">⚡ Skills, Sertifikasi & Bahasa</h3>
        <p className="font-body text-sm text-muted-foreground">Masukkan skill yang relevan dengan posisi target</p>
      </div>

      {/* Auto-suggest from experience */}
      {suggestedSkills.length > 0 && (
        <div className="border-4 border-foreground bg-neoCyan/10 p-4 shadow-neo space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-foreground" />
            <Label className="font-display text-xs uppercase">Skill Suggestion (dari pengalaman kamu)</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.slice(0, 15).map(skill => (
              <button
                key={skill}
                onClick={() => addSuggestedSkill(skill)}
                className="bg-neoCyan/30 border-2 border-foreground/60 px-3 py-1 font-body text-xs hover:bg-neoCyan hover:border-foreground transition-all flex items-center gap-1"
              >
                <Plus size={10} /> {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {renderSkillSection('hard_skills', 'Hard Skills (Technical)', 'bg-neoCyan', hardInput, setHardInput)}

      {/* Languages */}
      <div className="space-y-3 pt-4 border-t-4 border-foreground">
        <div className="flex items-center gap-2">
          <Globe size={16} />
          <Label className="font-display text-sm uppercase">Bahasa yang Dikuasai</Label>
        </div>
        {languages.map((lang) => (
          <div key={lang.id} className="border-2 border-foreground p-3 bg-card shadow-neoSm flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <Label className="font-display text-[10px] uppercase">Bahasa</Label>
              <Input value={lang.name} onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)} placeholder="English" className="border border-foreground h-8 text-sm" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="font-display text-[10px] uppercase">Level</Label>
              <Select value={lang.level} onValueChange={(v) => updateLanguage(lang.id, 'level', v)}>
                <SelectTrigger className="border border-foreground h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Native">Native</SelectItem>
                  <SelectItem value="Fluent">Fluent</SelectItem>
                  <SelectItem value="Conversational">Conversational</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <button onClick={() => removeLanguage(lang.id)} className="text-destructive p-1 mb-1"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={addLanguage} className="w-full border-4 border-dashed border-foreground/40 p-3 font-display text-xs uppercase flex items-center justify-center gap-2 hover:border-foreground transition-colors">
          <Plus size={16} /> Tambah Bahasa
        </button>
      </div>

      {/* Certifications */}
      <div className="space-y-3 pt-4 border-t-4 border-foreground">
        <Label className="font-display text-sm uppercase">Sertifikasi</Label>
        {certifications.map((cert) => (
          <div key={cert.id} className="border-2 border-foreground p-3 bg-card shadow-neoSm flex gap-3 items-end">
            <div className="flex-1 space-y-1">
              <Label className="font-display text-[10px] uppercase">Nama Sertifikasi</Label>
              <Input value={cert.name} onChange={(e) => updateCert(cert.id, 'name', e.target.value)} placeholder="AWS Certified" className="border border-foreground h-8 text-sm" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="font-display text-[10px] uppercase">Penerbit</Label>
              <Input value={cert.issuer} onChange={(e) => updateCert(cert.id, 'issuer', e.target.value)} placeholder="Amazon" className="border border-foreground h-8 text-sm" />
            </div>
            <div className="w-20 space-y-1">
              <Label className="font-display text-[10px] uppercase">Tahun</Label>
              <Input value={cert.year} onChange={(e) => updateCert(cert.id, 'year', e.target.value)} placeholder="2024" className="border border-foreground h-8 text-sm" />
            </div>
            <button onClick={() => removeCert(cert.id)} className="text-destructive p-1 mb-1"><Trash2 size={14} /></button>
          </div>
        ))}
        <button onClick={addCert} className="w-full border-4 border-dashed border-foreground/40 p-3 font-display text-xs uppercase flex items-center justify-center gap-2 hover:border-foreground transition-colors">
          <Plus size={16} /> Tambah Sertifikasi
        </button>
      </div>
    </div>
  );
};

export default StepSkills;
