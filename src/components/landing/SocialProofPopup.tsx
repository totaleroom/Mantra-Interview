import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProofMessage {
  name: string;
  emoji: string;
  text: string;
}

const firstNames = [
  'Rina','Andi','Dian','Fajar','Maya','Budi','Sari','Toni','Nisa','Reza','Ayu','Hendra','Putri','Rizki','Dewi',
  'Agus','Linda','Irfan','Wulan','Bayu','Citra','Dimas','Fani','Gilang','Hana','Ivan','Joko','Karina','Leo','Mira',
  'Nando','Olivia','Pandu','Qori','Ratna','Surya','Tari','Umar','Vina','Wahyu','Xena','Yoga','Zahra','Arif','Bella',
  'Chandra','Diana','Eko','Fitri','Guntur','Asep','Bambang','Cici','Doni','Eka','Fira','Gita','Hadi','Indah','Jaya',
  'Kartika','Lukman','Mega','Naufal','Okta','Prita','Rahmat','Sinta','Teguh','Umi','Vivi','Wawan','Yani','Zaki','Adi',
  'Bunga','Cahya','Devi','Erwin','Farhan','Galih','Hesti','Intan','Jasmine','Kevin','Lina','Mulia','Nia','Oscar','Pipit',
  'Rendi','Siska','Taufik','Ulfa','Vera','Winda','Yuda','Zara','Anita','Bagus','Clara','Denny','Elsa','Febri','Gina',
  'Hafiz','Ira','Johan','Kiki','Laras','Mirna','Naomi','Oki','Putra','Rini','Saiful','Tiara','Ucok','Vero','Widya',
  'Yogi','Zulfa','Alya','Bima','Cleo','Dafa','Erna','Faisal','Gani','Heru','Isma','Juni','Kurnia','Lestari','Maman',
  'Nadya','Opik','Puspita','Ridho','Shinta','Tegar','Udin','Vita','Wisnu','Yanti','Zain',
];

const lastInitials = ['S.','M.','K.','R.','L.','P.','W.','A.','H.','D.','F.','G.','T.','N.','C.','B.','J.','E.','I.','O.','V.','X.','Y.','Z.','U.','Q.'];

const cities = [
  'Jakarta','Bandung','Surabaya','Medan','Yogyakarta','Semarang','Bali','Makassar','Malang','Solo',
  'Palembang','Manado','Balikpapan','Pontianak','Padang','Lampung','Batam','Pekanbaru','Samarinda','Cirebon',
  'Bogor','Depok','Tangerang','Bekasi','Sidoarjo','Mataram','Kupang','Ambon','Jayapura','Ternate',
];

const companies = [
  'Google','Microsoft','Shopee','Tokopedia','Gojek','Grab','Unilever','McKinsey','Deloitte','Bank BCA',
  'Bank Mandiri','Pertamina','Telkom','Samsung','Apple','Amazon','Meta','Netflix','Traveloka','Bukalapak',
  'Goldman Sachs','JP Morgan','HSBC','BCG','EY','PwC','KPMG','Accenture','P&G','Nestle',
  'L\'Oreal','Danone','Coca-Cola','Toyota','Honda','BMW','Shell','Chevron','Pfizer','Siemens',
  'Nike','Adidas','IKEA','DHL','FedEx','Visa','Mastercard','Adobe','Salesforce','Oracle',
  'Indofood','Mayora','Wings','Astra','Kalbe','BNI','BRI','Xiaomi','Huawei','Sony',
  'Intel','Nvidia','Tesla','Airbnb','Spotify','LinkedIn','TikTok','Stripe','Figma','Canva',
];

const positions = [
  'Data Analyst','Product Manager','Software Engineer','UI/UX Designer','Business Analyst',
  'Marketing Executive','Management Trainee','Business Dev','Consultant','Data Engineer',
  'Frontend Developer','Backend Developer','HR Specialist','Finance Analyst','Supply Chain Analyst',
  'Digital Marketing','Content Strategist','R&D Engineer','QA Engineer','DevOps Engineer',
  'Account Executive','Brand Manager','Operations Manager','Project Manager','Full Stack Developer',
];

const modules = [
  'Module 1 — CV ATS Mastery','Module 2 — Interview Prep','Module 3 — LinkedIn Mastery',
  'Module 4 — Cover Letter','Module 5 — Interview Prep',
];

const activities = ['CV Builder','LinkedIn Optimizer','Interview Simulator','Cover Letter Generator'];

// Seeded random for consistency
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

function generateMessages(count: number): ProofMessage[] {
  const messages: ProofMessage[] = [];
  const emojis = ['🎉','💼','📝','🚀','✅'];
  const templates = [
    (s: number) => ({ emoji: '🎉', text: `baru saja mendaftar dari ${pick(cities, s + 1)}` }),
    (s: number) => ({ emoji: '💼', text: `diterima di ${pick(companies, s + 2)} sebagai ${pick(positions, s + 3)}` }),
    (s: number) => ({ emoji: '📝', text: `sedang mengerjakan ${pick(activities, s + 4)}` }),
    (s: number) => ({ emoji: '🚀', text: `baru checkout membership dari ${pick(cities, s + 5)}` }),
    (s: number) => ({ emoji: '✅', text: `menyelesaikan ${pick(modules, s + 6)}` }),
    (s: number) => ({ emoji: '✅', text: `skor CV naik dari ${Math.floor(seededRandom(s + 7) * 30 + 30)} ke ${Math.floor(seededRandom(s + 8) * 15 + 85)}` }),
    (s: number) => ({ emoji: '🎉', text: `baru saja bergabung MantraSkill` }),
    (s: number) => ({ emoji: '🚀', text: `baru upgrade ke membership` }),
    (s: number) => ({ emoji: '📝', text: `sedang optimasi LinkedIn Profile` }),
    (s: number) => ({ emoji: '📝', text: `sedang latihan Interview Simulator` }),
    (s: number) => ({ emoji: '✅', text: `menyelesaikan semua 5 module sprint` }),
    (s: number) => ({ emoji: '💼', text: `diterima di ${pick(companies, s + 9)} sebagai ${pick(positions, s + 10)}` }),
    (s: number) => ({ emoji: '🎉', text: `baru mendaftar Sprint CV dari ${pick(cities, s + 11)}` }),
    (s: number) => ({ emoji: '🚀', text: `baru checkout membership` }),
  ];

  for (let i = 0; i < count; i++) {
    const seed = i * 7 + 13;
    const firstName = pick(firstNames, seed);
    const lastI = pick(lastInitials, seed + 1);
    const template = templates[i % templates.length](seed);
    messages.push({
      name: `${firstName} ${lastI}`,
      ...template,
    });
  }
  return messages;
}

const proofMessages = generateMessages(500);

const timeAgoOptions = ['2 menit lalu', '5 menit lalu', '8 menit lalu', '12 menit lalu', '15 menit lalu', '20 menit lalu'];

export const SocialProofPopup: React.FC = () => {
  const { user } = useAuth();
  
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const getRandomTimeAgo = useCallback(() => {
    return timeAgoOptions[Math.floor(Math.random() * timeAgoOptions.length)];
  }, []);

  const [timeAgo, setTimeAgo] = useState(() => getRandomTimeAgo());

  const shouldShow = !user;

  useEffect(() => {
    if (!shouldShow) return;
    const initialDelay = setTimeout(() => {
      setVisible(true);
    }, 3000);
    return () => clearTimeout(initialDelay);
  }, [shouldShow]);

  useEffect(() => {
    if (!shouldShow || !visible) return;
    timeoutRef.current = setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % proofMessages.length);
        setTimeAgo(getRandomTimeAgo());
        setAnimating(false);
      }, 300);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shouldShow, visible, currentIndex, getRandomTimeAgo]);

  if (!shouldShow || !visible) return null;

  const current = proofMessages[currentIndex];
  const initials = current.name.split(' ').map(w => w[0]).join('');

  return (
    <div
      className={`fixed bottom-16 left-2 md:bottom-20 md:left-4 z-50 max-w-[200px] md:max-w-xs transition-all duration-300 ${
        animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-card border-2 border-foreground shadow-neoSm p-2 md:p-3 flex items-start gap-2 md:gap-3">
        <div className="w-7 h-7 md:w-10 md:h-10 shrink-0 bg-neoLime border-2 border-foreground flex items-center justify-center font-display text-[9px] md:text-xs uppercase">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body text-[11px] md:text-sm leading-snug">
            <span className="mr-1">{current.emoji}</span>
            <strong className="font-display text-[10px] md:text-xs uppercase">{current.name}</strong>{' '}
            {current.text}
          </p>
          <p className="font-body text-[9px] md:text-xs text-muted-foreground mt-1">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};
