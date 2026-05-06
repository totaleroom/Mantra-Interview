import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import type { Education } from './types';

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const degrees = ['SMA/SMK', 'D3', 'S1', 'S2', 'S3'];

const StepEducation: React.FC<Props> = ({ data, onChange }) => {
  const add = () => {
    onChange([...data, { id: crypto.randomUUID(), institution: '', major: '', degree: 'S1', graduation_year: '', gpa: '' }]);
  };

  const remove = (id: string) => onChange(data.filter(e => e.id !== id));

  const update = (id: string, field: keyof Education, value: string) => {
    onChange(data.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="space-y-5">
      <div className="bg-neoViolet/20 border-4 border-foreground p-4 shadow-neo">
        <h3 className="font-display text-lg uppercase mb-1">🎓 Pendidikan</h3>
        <p className="font-body text-sm text-muted-foreground">Urutkan dari pendidikan terakhir</p>
      </div>

      {data.map((edu, idx) => (
        <div key={edu.id} className="border-4 border-foreground p-4 bg-card shadow-neo space-y-3">
          <div className="flex items-center justify-between">
            <span className="bg-foreground text-background font-display text-xs px-3 py-1 uppercase">Pendidikan {idx + 1}</span>
            <button onClick={() => remove(edu.id)} className="text-destructive hover:bg-destructive/10 p-1"><Trash2 size={16} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Institusi *</Label>
              <Input value={edu.institution} onChange={(e) => update(edu.id, 'institution', e.target.value)} placeholder="Universitas Indonesia" className="border-2 border-foreground" />
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Jurusan *</Label>
              <Input value={edu.major} onChange={(e) => update(edu.id, 'major', e.target.value)} placeholder="Teknik Informatika" className="border-2 border-foreground" />
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Jenjang *</Label>
              <Select value={edu.degree} onValueChange={(v) => update(edu.id, 'degree', v)}>
                <SelectTrigger className="border-2 border-foreground"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {degrees.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">Tahun Lulus *</Label>
              <Input value={edu.graduation_year} onChange={(e) => update(edu.id, 'graduation_year', e.target.value)} placeholder="2022" className="border-2 border-foreground" />
            </div>
            <div className="space-y-1">
              <Label className="font-display text-xs uppercase">IPK (opsional)</Label>
              <Input value={edu.gpa} onChange={(e) => update(edu.id, 'gpa', e.target.value)} placeholder="3.75" className="border-2 border-foreground" />
              <p className="font-body text-[10px] text-muted-foreground">💡 IPK di bawah 3.0 akan otomatis disembunyikan di CV</p>
            </div>
          </div>
        </div>
      ))}

      <button onClick={add} className="w-full border-4 border-dashed border-foreground/40 p-4 font-display text-sm uppercase flex items-center justify-center gap-2 hover:border-foreground hover:bg-accent/10 transition-colors">
        <Plus size={18} /> Tambah Pendidikan
      </button>
    </div>
  );
};

export default StepEducation;
