import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/landing/Header';
import { Shield, Users, Key, Plus, ArrowLeft, ShieldX, Copy, Download, Zap, UserCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [licenseKeys, setLicenseKeys] = useState<any[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newDays, setNewDays] = useState(365);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkDays, setBulkDays] = useState(90);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [activatingUserId, setActivatingUserId] = useState<string | null>(null);
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([]);
  const [showBulk, setShowBulk] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/');
  }, [user, loading, navigate]);

  // Check admin role
  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    };
    check();
  }, [user]);

  // Load data when confirmed admin
  useEffect(() => {
    if (!isAdmin) return;
    const loadData = async () => {
      const [profilesRes, keysRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('license_keys').select('*').order('created_at', { ascending: false }),
      ]);
      if (profilesRes.data) setProfiles(profilesRes.data);
      if (keysRes.data) setLicenseKeys(keysRes.data);
    };
    loadData();
  }, [isAdmin]);

  const addLicenseKey = async () => {
    if (!newKey.trim()) return;
    const { error } = await supabase.from('license_keys').insert({
      key: newKey.toUpperCase().trim(),
      validity_days: newDays,
      status: 'active',
    });
    if (error) {
      toast({ title: 'Gagal menambah key', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'License key ditambahkan! 🔑' });
      setNewKey('');
      // Reload
      const { data } = await supabase.from('license_keys').select('*').order('created_at', { ascending: false });
      if (data) setLicenseKeys(data);
    }
  };

  const deactivateKey = async (id: string) => {
    await supabase.from('license_keys').update({ status: 'inactive' }).eq('id', id);
    setLicenseKeys(keys => keys.map(k => k.id === id ? { ...k, status: 'inactive' } : k));
    toast({ title: 'Key dinonaktifkan' });
  };

  const generateRandomKey = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `MNTR-${segment(4)}-${segment(4)}`;
  };

  const bulkGenerate = async () => {
    const count = Math.min(Math.max(1, bulkCount), 3000);
    setBulkLoading(true);
    const keys = Array.from({ length: count }, () => generateRandomKey());
    const rows = keys.map(k => ({ key: k, validity_days: bulkDays, status: 'active' as const }));

    // Insert in batches of 500
    for (let i = 0; i < rows.length; i += 500) {
      const batch = rows.slice(i, i + 500);
      const { error } = await supabase.from('license_keys').insert(batch);
      if (error) {
        setBulkLoading(false);
        toast({ title: `Gagal di batch ${Math.floor(i / 500) + 1}`, description: error.message, variant: 'destructive' });
        return;
      }
    }
    setBulkLoading(false);
    setGeneratedKeys(keys);
    toast({ title: `${keys.length} keys berhasil di-generate! 🔑` });
    // Reload keys
    const { data } = await supabase.from('license_keys').select('*').order('created_at', { ascending: false });
    if (data) setLicenseKeys(data);
  };

  const activateUser = async (userId: string) => {
    setActivatingUserId(userId);
    const { data, error } = await supabase.functions.invoke('activate-user', {
      body: { user_id: userId },
    });
    setActivatingUserId(null);
    if (error || !data?.success) {
      toast({ title: 'Gagal aktivasi', description: data?.error || error?.message || 'Unknown error', variant: 'destructive' });
      return;
    }
    toast({ title: `User berhasil diaktivasi! 🎉`, description: `Key: ${data.key} | Berlaku ${data.validity_days} hari` });
    // Reload data
    const [profilesRes, keysRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('license_keys').select('*').order('created_at', { ascending: false }),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (keysRes.data) setLicenseKeys(keysRes.data);
  };

  const copyAllKeys = () => {
    navigator.clipboard.writeText(generatedKeys.join('\n'));
    toast({ title: 'Semua keys di-copy ke clipboard!' });
  };

  const downloadCSV = () => {
    const csv = 'key,validity_days,status\n' + generatedKeys.map(k => `${k},${bulkDays},active`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `license-keys-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || !user) return null;

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-display text-xl animate-pulse">Checking access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="border-4 border-foreground bg-destructive/20 p-8 shadow-neoLg text-center max-w-md">
          <ShieldX size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="font-display text-xl uppercase mb-2">Akses Ditolak</h2>
          <p className="font-body text-sm text-muted-foreground mb-4">Kamu tidak memiliki akses admin.</p>
          <button onClick={() => navigate('/dashboard')} className="bg-foreground text-background font-display text-xs uppercase px-4 py-2 border-2 border-foreground">
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activeUsers = profiles.filter(p => p.license_expires_at && new Date(p.license_expires_at) > new Date()).length;
  const activeKeys = licenseKeys.filter(k => k.status === 'active').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-5 py-8">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 font-display text-xs uppercase mb-6 hover:text-neoPink transition-colors">
          <ArrowLeft size={14} /> Dashboard
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Shield size={24} className="text-neoPink" />
          <h1 className="font-display text-2xl uppercase">Admin Panel</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users', value: profiles.length, icon: Users, color: 'bg-neoCyan' },
            { label: 'Active Users', value: activeUsers, icon: Users, color: 'bg-neoLime' },
            { label: 'Active Keys', value: activeKeys, icon: Key, color: 'bg-neoPink' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} border-4 border-foreground p-4 shadow-neo`}>
              <stat.icon size={20} className="mb-2" />
              <p className="font-display text-2xl">{stat.value}</p>
              <p className="font-display text-[10px] uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* License Key Management */}
        <div className="border-4 border-foreground bg-card p-5 shadow-neo mb-8">
          <h2 className="font-display text-lg uppercase mb-4 flex items-center gap-2"><Key size={18} /> Manage License Keys</h2>
          <div className="flex gap-3 mb-4">
            <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="KEY NAME" className="border-2 border-foreground flex-1" />
            <Input type="number" value={newDays} onChange={(e) => setNewDays(parseInt(e.target.value) || 365)} className="border-2 border-foreground w-24" />
            <button onClick={addLicenseKey} className="bg-neoLime border-2 border-foreground px-4 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center gap-1">
              <Plus size={14} /> Add
            </button>
            <button onClick={() => { setShowBulk(!showBulk); setGeneratedKeys([]); }} className="bg-neoCyan border-2 border-foreground px-4 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all flex items-center gap-1">
              <Zap size={14} /> Bulk
            </button>
          </div>

          {/* Bulk Generator */}
          {showBulk && (
            <div className="border-2 border-foreground bg-accent/30 p-4 mb-4 space-y-3">
              <p className="font-display text-xs uppercase">Bulk Generate Keys</p>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="font-body text-[10px] text-muted-foreground">Jumlah (1-3000)</label>
                  <Input type="number" min={1} max={3000} value={bulkCount} onChange={(e) => setBulkCount(parseInt(e.target.value) || 10)} className="border-2 border-foreground" />
                </div>
                <div className="w-24">
                  <label className="font-body text-[10px] text-muted-foreground">Hari</label>
                  <Input type="number" value={bulkDays} onChange={(e) => setBulkDays(parseInt(e.target.value) || 90)} className="border-2 border-foreground" />
                </div>
                <button onClick={bulkGenerate} disabled={bulkLoading} className="bg-neoPink border-2 border-foreground px-4 py-2 font-display text-xs uppercase shadow-neoSm hover:shadow-none transition-all disabled:opacity-50">
                  {bulkLoading ? '...' : 'Generate'}
                </button>
              </div>
              <p className="font-body text-[10px] text-muted-foreground">Format: MNTR-XXXX-XXXX (huruf + angka random)</p>

              {generatedKeys.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xs uppercase text-neoLime">{generatedKeys.length} keys generated!</p>
                    <div className="flex gap-2">
                      <button onClick={copyAllKeys} className="bg-neoLime border-2 border-foreground px-3 py-1 font-display text-[10px] uppercase flex items-center gap-1 shadow-neoSm hover:shadow-none transition-all">
                        <Copy size={12} /> Copy All
                      </button>
                      <button onClick={downloadCSV} className="bg-neoCyan border-2 border-foreground px-3 py-1 font-display text-[10px] uppercase flex items-center gap-1 shadow-neoSm hover:shadow-none transition-all">
                        <Download size={12} /> CSV
                      </button>
                    </div>
                  </div>
                  <div className="max-h-32 overflow-y-auto border-2 border-foreground bg-background p-2 font-mono text-xs">
                    {generatedKeys.map((k, i) => <div key={i}>{k}</div>)}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {licenseKeys.map(k => (
              <div key={k.id} className="flex items-center justify-between border-2 border-foreground p-2 bg-background text-sm">
                <span className="font-body font-bold">{k.key}</span>
                <span className="font-body text-xs text-muted-foreground">{k.validity_days}d</span>
                <span className={`font-display text-[10px] uppercase px-2 py-0.5 border ${k.status === 'active' ? 'bg-neoLime' : k.status === 'used' ? 'bg-neoCyan' : 'bg-muted'}`}>{k.status}</span>
                {k.status === 'active' && (
                  <button onClick={() => deactivateKey(k.id)} className="text-destructive font-display text-[10px] uppercase hover:underline">Deactivate</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="border-4 border-foreground bg-card p-5 shadow-neo">
          <h2 className="font-display text-lg uppercase mb-4 flex items-center gap-2"><Users size={18} /> Daftar Users</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {profiles.map(p => {
              const hasLicense = !!p.license_key;
              const notExpired = p.license_expires_at && new Date(p.license_expires_at) > new Date();
              const isActive = hasLicense && notExpired;
              const canActivate = !isActive;
              return (
                <div key={p.id} className="flex items-center justify-between border-2 border-foreground p-3 bg-background">
                  <div>
                    <p className="font-body font-bold text-sm">{p.full_name || 'No Name'}</p>
                    {p.phone && <p className="font-body text-xs text-neoCyan">📱 {p.phone}</p>}
                    <p className="font-body text-xs text-muted-foreground">{p.license_key || 'Belum diaktivasi'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-display text-[10px] uppercase ${isActive ? 'text-neoLime' : 'text-destructive'}`}>
                        {isActive ? 'Active' : hasLicense ? 'Expired' : 'Pending'}
                      </p>
                      <p className="font-body text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    {canActivate && (
                      <button
                        onClick={() => activateUser(p.user_id)}
                        disabled={activatingUserId === p.user_id}
                        className="bg-neoLime border-2 border-foreground px-3 py-1.5 font-display text-[10px] uppercase shadow-neoSm hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-1"
                      >
                        {activatingUserId === p.user_id ? <Loader2 size={12} className="animate-spin" /> : <UserCheck size={12} />}
                        Aktivasi
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
