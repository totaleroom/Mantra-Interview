import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PersonalInfo } from './types';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  lockedName?: string;
}

const StepPersonal: React.FC<Props> = ({ data, onChange, lockedName }) => {
  const update = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  // Auto-sync name from profile
  const displayName = lockedName || data.full_name;

  return (
    <div className="space-y-5">
      <div className="bg-neoLime/20 border-4 border-foreground p-4 shadow-neo">
        <h3 className="font-display text-lg uppercase mb-1">📋 Data Pribadi</h3>
        <p className="font-body text-sm text-muted-foreground">Informasi kontak yang akan tampil di header CV</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Nama Lengkap *</Label>
          <Input value={displayName} onChange={(e) => !lockedName && update('full_name', e.target.value)} readOnly={!!lockedName} placeholder="John Doe" className={`border-2 border-foreground shadow-neoSm ${lockedName ? 'bg-muted cursor-not-allowed opacity-70' : ''}`} />
          {lockedName && <p className="font-body text-xs text-muted-foreground">🔒 Nama diambil dari akun dan tidak dapat diubah</p>}
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Email *</Label>
          <Input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} placeholder="john@email.com" className="border-2 border-foreground shadow-neoSm" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Nomor Telepon *</Label>
          <Input value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="08123456789" className="border-2 border-foreground shadow-neoSm" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Kota *</Label>
          <Input value={data.city} onChange={(e) => update('city', e.target.value)} placeholder="Jakarta" className="border-2 border-foreground shadow-neoSm" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">LinkedIn URL</Label>
          <Input value={data.linkedin_url} onChange={(e) => update('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/johndoe" className="border-2 border-foreground shadow-neoSm" />
        </div>
        <div className="space-y-2">
          <Label className="font-display text-xs uppercase">Portfolio / Website</Label>
          <Input value={data.portfolio_url} onChange={(e) => update('portfolio_url', e.target.value)} placeholder="https://johndoe.com" className="border-2 border-foreground shadow-neoSm" />
        </div>
      </div>

      {/* Professional Tagline */}
      <div className="space-y-2">
        <Label className="font-display text-xs uppercase">Professional Tagline</Label>
        <Input value={data.tagline || ''} onChange={(e) => update('tagline', e.target.value)} placeholder="Data-Driven Marketing Strategist" className="border-2 border-foreground shadow-neoSm" />
        <p className="font-body text-xs text-muted-foreground">Satu kalimat yang menggambarkan identitas profesional kamu</p>
      </div>
    </div>
  );
};

export default StepPersonal;
