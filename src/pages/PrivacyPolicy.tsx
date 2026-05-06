import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/seo/SEOHead';

const PrivacyPolicy = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy — MantraSkill"
        description="Kebijakan privasi MantraSkill. Pelajari bagaimana kami melindungi data pribadi kamu."
        canonical="/privacy-policy"
        ogType="website"
      />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-5 py-8">
          <h1 className="font-display text-2xl md:text-3xl uppercase mb-6 border-b-4 border-foreground pb-4">Privacy Policy</h1>
          <div className="font-body text-sm text-muted-foreground space-y-5 leading-relaxed">
            <p><strong>Terakhir diperbarui:</strong> 21 Februari 2026</p>
            <h2 className="font-display text-base uppercase mt-8">Data yang Kami Kumpulkan</h2>
            <p>MantraSkill menghormati privasi pengguna. Data yang kami kumpulkan meliputi: nama, email, dan data CV yang kamu input secara sukarela. Data ini digunakan semata-mata untuk menyediakan layanan platform.</p>
            <h2 className="font-display text-base uppercase mt-8">Penggunaan Data</h2>
            <p>Data kamu digunakan untuk: menyediakan fitur CV Builder, LinkedIn Optimizer, Cover Letter Generator, dan modul pembelajaran. Kami tidak menggunakan data kamu untuk keperluan lain tanpa persetujuan.</p>
            <h2 className="font-display text-base uppercase mt-8">Keamanan Data</h2>
            <p>Data disimpan dengan enkripsi dan dilindungi oleh Row-Level Security sehingga hanya kamu yang bisa mengakses data milikmu. Kami menggunakan infrastruktur cloud yang aman dan terenkripsi.</p>
            <h2 className="font-display text-base uppercase mt-8">Berbagi Data</h2>
            <p>Kami tidak menjual, menyewakan, atau membagikan data pribadi kamu kepada pihak ketiga tanpa persetujuan.</p>
            <h2 className="font-display text-base uppercase mt-8">Hak Pengguna</h2>
            <p>Kamu berhak meminta penghapusan akun dan seluruh data terkait kapan saja dengan menghubungi kami melalui email di hello00mantra@gmail.com.</p>
            <h2 className="font-display text-base uppercase mt-8">Perubahan Kebijakan</h2>
            <p>Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan akan diinformasikan melalui platform. Dengan menggunakan MantraSkill, kamu menyetujui kebijakan privasi ini.</p>
          </div>
          <div className="mt-8">
            <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
