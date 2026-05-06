import React from 'react';
import { SectionWrapper } from './SectionWrapper';

interface Company {
  name: string;
  initials: string;
  domain: string;
}

const companies: Company[] = [
// === INDONESIA — TECH & STARTUP ===
{ name: 'Gojek', initials: 'GJ', domain: 'gojek.com' },
{ name: 'Tokopedia', initials: 'TK', domain: 'tokopedia.com' },
{ name: 'Shopee', initials: 'SP', domain: 'shopee.co.id' },
{ name: 'Grab', initials: 'GB', domain: 'grab.com' },
{ name: 'Bukalapak', initials: 'BL', domain: 'bukalapak.com' },
{ name: 'Traveloka', initials: 'TV', domain: 'traveloka.com' },
{ name: 'OVO', initials: 'OV', domain: 'ovo.id' },
{ name: 'Dana', initials: 'DN', domain: 'dana.id' },
{ name: 'Blibli', initials: 'BB', domain: 'blibli.com' },
{ name: 'Tiket.com', initials: 'TC', domain: 'tiket.com' },
{ name: 'Ruangguru', initials: 'RG', domain: 'ruangguru.com' },
{ name: 'Zenius', initials: 'ZN', domain: 'zenius.net' },
{ name: 'Vidio', initials: 'VD', domain: 'vidio.com' },
{ name: 'Kredivo', initials: 'KR', domain: 'kredivo.com' },
{ name: 'Akulaku', initials: 'AK', domain: 'akulaku.com' },
{ name: 'Amartha', initials: 'AM', domain: 'amartha.com' },
{ name: 'Kopi Kenangan', initials: 'KK', domain: 'kopikenangan.com' },
{ name: 'Fore Coffee', initials: 'FC', domain: 'fore.coffee' },
{ name: 'Sociolla', initials: 'SC', domain: 'sociolla.com' },
{ name: 'JD.ID', initials: 'JD', domain: 'jd.id' },
{ name: 'Halodoc', initials: 'HD', domain: 'halodoc.com' },
{ name: 'Alodokter', initials: 'AD', domain: 'alodokter.com' },
{ name: 'Stockbit', initials: 'SB', domain: 'stockbit.com' },
{ name: 'Bibit', initials: 'BT', domain: 'bibit.id' },
{ name: 'Xendit', initials: 'XN', domain: 'xendit.co' },
{ name: 'Mekari', initials: 'MK', domain: 'mekari.com' },
{ name: 'eFishery', initials: 'EF', domain: 'efishery.com' },
{ name: 'Kitabisa', initials: 'KT', domain: 'kitabisa.com' },
{ name: 'Kompas.com', initials: 'KP', domain: 'kompas.com' },
{ name: 'Detik', initials: 'DT', domain: 'detik.com' },

// === INDONESIA — BANKING ===
{ name: 'Bank BCA', initials: 'BC', domain: 'bca.co.id' },
{ name: 'Bank Mandiri', initials: 'BM', domain: 'bankmandiri.co.id' },
{ name: 'Bank BRI', initials: 'BR', domain: 'bri.co.id' },
{ name: 'Bank BNI', initials: 'BN', domain: 'bni.co.id' },
{ name: 'Bank CIMB Niaga', initials: 'CN', domain: 'cimbniaga.co.id' },
{ name: 'Bank Danamon', initials: 'BD', domain: 'danamon.co.id' },
{ name: 'Bank Permata', initials: 'BP', domain: 'permatabank.com' },
{ name: 'Bank Mega', initials: 'MG', domain: 'bankmega.com' },
{ name: 'Bank BTPN', initials: 'BT', domain: 'btpn.com' },
{ name: 'Bank Jago', initials: 'BJ', domain: 'jfrfrago.co.id' },
{ name: 'SeaBank', initials: 'SB', domain: 'seabank.co.id' },
{ name: 'Bank Syariah Indonesia', initials: 'BS', domain: 'bankbsi.co.id' },

// === INDONESIA — CONGLOMERATE & INDUSTRY ===
{ name: 'Astra', initials: 'AS', domain: 'astra.co.id' },
{ name: 'Sinar Mas', initials: 'SM', domain: 'sinarmas.com' },
{ name: 'Lippo Group', initials: 'LP', domain: 'lippogroup.com' },
{ name: 'Salim Group', initials: 'SG', domain: 'salimgroup.com' },
{ name: 'Djarum', initials: 'DJ', domain: 'djarum.com' },
{ name: 'Gudang Garam', initials: 'GG', domain: 'gudanggaramtbk.com' },
{ name: 'HM Sampoerna', initials: 'HS', domain: 'sampoerna.com' },
{ name: 'Indofood', initials: 'IF', domain: 'indofood.com' },
{ name: 'Mayora', initials: 'MY', domain: 'mayoraindah.co.id' },
{ name: 'Wings', initials: 'WG', domain: 'wingscorp.com' },
{ name: 'Paragon', initials: 'PR', domain: 'parfragon.co.id' },
{ name: 'Wardah', initials: 'WD', domain: 'wardahbeauty.com' },
{ name: 'Sido Muncul', initials: 'SD', domain: 'sidomuncul.co.id' },
{ name: 'Kalbe', initials: 'KB', domain: 'kalbe.co.id' },
{ name: 'Semen Indonesia', initials: 'SI', domain: 'semenindonesia.com' },
{ name: 'Pertamina', initials: 'PT', domain: 'pertamina.com' },
{ name: 'PLN', initials: 'PL', domain: 'pln.co.id' },
{ name: 'Telkom', initials: 'TL', domain: 'telkom.co.id' },
{ name: 'Telkomsel', initials: 'TS', domain: 'telkomsel.com' },
{ name: 'Indosat', initials: 'IS', domain: 'indosatooredoo.com' },
{ name: 'XL Axiata', initials: 'XL', domain: 'xl.co.id' },
{ name: 'Garuda Indonesia', initials: 'GA', domain: 'garuda-indonesia.com' },
{ name: 'Lion Air', initials: 'LA', domain: 'lionair.co.id' },
{ name: 'Indomaret', initials: 'IM', domain: 'indomaret.co.id' },
{ name: 'Alfamart', initials: 'AF', domain: 'alfamart.co.id' },
{ name: 'MAP', initials: 'MP', domain: 'map.co.id' },
{ name: 'Erajaya', initials: 'EJ', domain: 'erajaya.com' },
{ name: 'Kompas Gramedia', initials: 'KG', domain: 'kompasgramedia.com' },
{ name: 'Dua Kelinci', initials: 'DK', domain: 'duakelinci.com' },
{ name: "Arnott's", initials: 'AR', domain: 'arnotts.com' },
{ name: 'Implora', initials: 'IM', domain: 'implora.id' },
{ name: 'Kimia Farma', initials: 'KF', domain: 'kimiafarma.co.id' },
{ name: 'Bio Farma', initials: 'BF', domain: 'biofarma.co.id' },
{ name: 'Pupuk Indonesia', initials: 'PI', domain: 'pupuk-indonesia.com' },
{ name: 'Bulog', initials: 'BL', domain: 'bulog.co.id' },
{ name: 'Pelni', initials: 'PN', domain: 'pelni.co.id' },
{ name: 'Angkasa Pura', initials: 'AP', domain: 'angkasapura2.co.id' },
{ name: 'Jasa Marga', initials: 'JM', domain: 'jasamarga.co.id' },
{ name: 'Waskita', initials: 'WK', domain: 'waskita.co.id' },
{ name: 'Wijaya Karya', initials: 'WJ', domain: 'wika.co.id' },
{ name: 'Adhi Karya', initials: 'AK', domain: 'adhi.co.id' },
{ name: 'PP Properti', initials: 'PP', domain: 'pp-properti.com' },
{ name: 'Pegadaian', initials: 'PG', domain: 'pegadaian.co.id' },
{ name: 'Taspen', initials: 'TP', domain: 'taspen.co.id' },
{ name: 'Jiwasraya', initials: 'JW', domain: 'jiwasraya.co.id' },
{ name: 'Antam', initials: 'AT', domain: 'antam.com' },
{ name: 'Vale Indonesia', initials: 'VI', domain: 'vale.com' },
{ name: 'Freeport', initials: 'FP', domain: 'ptfi.co.id' },

// === MULTINASIONAL — TECH ===
{ name: 'Google', initials: 'GO', domain: 'google.com' },
{ name: 'Microsoft', initials: 'MS', domain: 'microsoft.com' },
{ name: 'Apple', initials: 'AP', domain: 'apple.com' },
{ name: 'Amazon', initials: 'AZ', domain: 'amazon.com' },
{ name: 'Meta', initials: 'MT', domain: 'meta.com' },
{ name: 'Netflix', initials: 'NF', domain: 'netflix.com' },
{ name: 'Spotify', initials: 'SP', domain: 'spotify.com' },
{ name: 'Uber', initials: 'UB', domain: 'uber.com' },
{ name: 'Airbnb', initials: 'AB', domain: 'airbnb.com' },
{ name: 'Salesforce', initials: 'SF', domain: 'salesforce.com' },
{ name: 'Adobe', initials: 'AD', domain: 'adobe.com' },
{ name: 'Oracle', initials: 'OR', domain: 'oracle.com' },
{ name: 'IBM', initials: 'IB', domain: 'ibm.com' },
{ name: 'Intel', initials: 'IN', domain: 'intel.com' },
{ name: 'Nvidia', initials: 'NV', domain: 'nvidia.com' },
{ name: 'AMD', initials: 'AM', domain: 'amd.com' },
{ name: 'Cisco', initials: 'CS', domain: 'cisco.com' },
{ name: 'SAP', initials: 'SP', domain: 'sap.com' },
{ name: 'Slack', initials: 'SL', domain: 'slack.com' },
{ name: 'Zoom', initials: 'ZM', domain: 'zoom.us' },
{ name: 'Twitter/X', initials: 'TX', domain: 'x.com' },
{ name: 'LinkedIn', initials: 'LI', domain: 'linkedin.com' },
{ name: 'TikTok', initials: 'TT', domain: 'tiktok.com' },
{ name: 'Stripe', initials: 'ST', domain: 'stripe.com' },
{ name: 'PayPal', initials: 'PP', domain: 'paypal.com' },
{ name: 'Shopify', initials: 'SH', domain: 'shopify.com' },
{ name: 'Snap', initials: 'SN', domain: 'snap.com' },
{ name: 'Pinterest', initials: 'PT', domain: 'pinterest.com' },
{ name: 'Dropbox', initials: 'DB', domain: 'dropbox.com' },
{ name: 'Atlassian', initials: 'AT', domain: 'atlassian.com' },
{ name: 'ServiceNow', initials: 'SN', domain: 'servicenow.com' },
{ name: 'Palantir', initials: 'PL', domain: 'palantir.com' },
{ name: 'Databricks', initials: 'DB', domain: 'databricks.com' },
{ name: 'Snowflake', initials: 'SF', domain: 'snowflake.com' },
{ name: 'MongoDB', initials: 'MG', domain: 'mongodb.com' },
{ name: 'Twilio', initials: 'TW', domain: 'twilio.com' },
{ name: 'Figma', initials: 'FG', domain: 'figma.com' },
{ name: 'Notion', initials: 'NT', domain: 'notion.so' },
{ name: 'Canva', initials: 'CV', domain: 'canva.com' },
{ name: 'ByteDance', initials: 'BD', domain: 'bytedance.com' },
{ name: 'Alibaba', initials: 'AB', domain: 'alibaba.com' },
{ name: 'Tencent', initials: 'TC', domain: 'tencent.com' },
{ name: 'Baidu', initials: 'BD', domain: 'baidu.com' },
{ name: 'Samsung', initials: 'SM', domain: 'samsung.com' },
{ name: 'Sony', initials: 'SN', domain: 'sony.com' },
{ name: 'LG', initials: 'LG', domain: 'lg.com' },
{ name: 'Huawei', initials: 'HW', domain: 'huawei.com' },
{ name: 'Xiaomi', initials: 'XM', domain: 'xiaomi.com' },
{ name: 'Dell', initials: 'DL', domain: 'dell.com' },
{ name: 'HP', initials: 'HP', domain: 'hp.com' },
{ name: 'Lenovo', initials: 'LN', domain: 'lenovo.com' },

// === MULTINASIONAL — BANKING & FINANCE ===
{ name: 'JP Morgan', initials: 'JP', domain: 'jpmorgan.com' },
{ name: 'Goldman Sachs', initials: 'GS', domain: 'goldmansachs.com' },
{ name: 'Morgan Stanley', initials: 'MS', domain: 'morganstanley.com' },
{ name: 'Citibank', initials: 'CT', domain: 'citigroup.com' },
{ name: 'HSBC', initials: 'HS', domain: 'hsbc.com' },
{ name: 'Standard Chartered', initials: 'SC', domain: 'sc.com' },
{ name: 'Deutsche Bank', initials: 'DB', domain: 'db.com' },
{ name: 'Barclays', initials: 'BC', domain: 'barclays.com' },
{ name: 'UBS', initials: 'UB', domain: 'ubs.com' },
{ name: 'Credit Suisse', initials: 'CS', domain: 'credit-suisse.com' },
{ name: 'BlackRock', initials: 'BR', domain: 'blackrock.com' },
{ name: 'Visa', initials: 'VS', domain: 'visa.com' },
{ name: 'Mastercard', initials: 'MC', domain: 'mastercard.com' },
{ name: 'American Express', initials: 'AX', domain: 'americanexpress.com' },
{ name: 'AIA', initials: 'AI', domain: 'aia.com' },
{ name: 'Prudential', initials: 'PD', domain: 'prudential.com' },
{ name: 'Manulife', initials: 'ML', domain: 'manulife.com' },
{ name: 'Allianz', initials: 'AZ', domain: 'allianz.com' },

// === MULTINASIONAL — CONSULTING ===
{ name: 'McKinsey', initials: 'MK', domain: 'mckinsey.com' },
{ name: 'BCG', initials: 'BG', domain: 'bcg.com' },
{ name: 'Bain', initials: 'BN', domain: 'bain.com' },
{ name: 'Deloitte', initials: 'DL', domain: 'deloitte.com' },
{ name: 'EY', initials: 'EY', domain: 'ey.com' },
{ name: 'PwC', initials: 'PW', domain: 'pwc.com' },
{ name: 'KPMG', initials: 'KP', domain: 'kpmg.com' },
{ name: 'Accenture', initials: 'AC', domain: 'accenture.com' },
{ name: 'Oliver Wyman', initials: 'OW', domain: 'oliverwyman.com' },
{ name: 'Roland Berger', initials: 'RB', domain: 'rolandberger.com' },
{ name: 'A.T. Kearney', initials: 'AK', domain: 'kearney.com' },
{ name: 'Capgemini', initials: 'CG', domain: 'capgemini.com' },

// === MULTINASIONAL — FMCG ===
{ name: 'Unilever', initials: 'UL', domain: 'unilever.com' },
{ name: 'P&G', initials: 'PG', domain: 'pg.com' },
{ name: 'Nestle', initials: 'NS', domain: 'nestle.com' },
{ name: 'Danone', initials: 'DN', domain: 'danone.com' },
{ name: "L'Oreal", initials: 'LR', domain: 'loreal.com' },
{ name: 'Mondelez', initials: 'MZ', domain: 'mondelezinternational.com' },
{ name: 'Coca-Cola', initials: 'CC', domain: 'coca-colacompany.com' },
{ name: 'PepsiCo', initials: 'PC', domain: 'pepsico.com' },
{ name: 'Mars', initials: 'MR', domain: 'mars.com' },
{ name: 'Colgate', initials: 'CL', domain: 'colgatepalmolive.com' },
{ name: 'Reckitt', initials: 'RK', domain: 'reckitt.com' },
{ name: 'Henkel', initials: 'HK', domain: 'henkel.com' },
{ name: 'Estée Lauder', initials: 'EL', domain: 'elcompanies.com' },
{ name: 'Kraft Heinz', initials: 'KH', domain: 'kraftheinzcompany.com' },
{ name: 'General Mills', initials: 'GM', domain: 'generalmills.com' },
{ name: 'Kellogg', initials: 'KL', domain: 'kellanova.com' },
{ name: 'AB InBev', initials: 'AB', domain: 'ab-inbev.com' },
{ name: 'Diageo', initials: 'DG', domain: 'diageo.com' },
{ name: 'Ferrero', initials: 'FR', domain: 'ferrero.com' },
{ name: 'Beiersdorf', initials: 'BD', domain: 'beiersdorf.com' },

// === MULTINASIONAL — AUTOMOTIVE ===
{ name: 'Toyota', initials: 'TY', domain: 'toyota.com' },
{ name: 'Honda', initials: 'HN', domain: 'honda.com' },
{ name: 'BMW', initials: 'BW', domain: 'bmw.com' },
{ name: 'Mercedes-Benz', initials: 'MB', domain: 'mercedes-benz.com' },
{ name: 'Volkswagen', initials: 'VW', domain: 'volkswagen.com' },
{ name: 'Hyundai', initials: 'HY', domain: 'hyundai.com' },
{ name: 'Nissan', initials: 'NS', domain: 'nissan.com' },
{ name: 'Ford', initials: 'FD', domain: 'ford.com' },
{ name: 'Tesla', initials: 'TS', domain: 'tesla.com' },
{ name: 'Porsche', initials: 'PS', domain: 'porsche.com' },
{ name: 'Suzuki', initials: 'SZ', domain: 'suzuki.com' },
{ name: 'Mitsubishi', initials: 'MT', domain: 'mitsubishi.com' },
{ name: 'Yamaha', initials: 'YM', domain: 'yamaha.com' },

// === MULTINASIONAL — PHARMA & HEALTHCARE ===
{ name: 'Pfizer', initials: 'PF', domain: 'pfizer.com' },
{ name: 'Johnson & Johnson', initials: 'JJ', domain: 'jnj.com' },
{ name: 'Roche', initials: 'RC', domain: 'roche.com' },
{ name: 'Novartis', initials: 'NV', domain: 'novartis.com' },
{ name: 'AstraZeneca', initials: 'AZ', domain: 'astrazeneca.com' },
{ name: 'Merck', initials: 'MK', domain: 'merck.com' },
{ name: 'GSK', initials: 'GS', domain: 'gsk.com' },
{ name: 'Sanofi', initials: 'SF', domain: 'sanofi.com' },
{ name: 'Abbott', initials: 'AB', domain: 'abbott.com' },
{ name: 'Bayer', initials: 'BY', domain: 'bayer.com' },
{ name: 'Moderna', initials: 'MD', domain: 'modernatx.com' },
{ name: 'Siemens Healthineers', initials: 'SH', domain: 'siemens-healthineers.com' },

// === MULTINASIONAL — ENERGY & INDUSTRIAL ===
{ name: 'Shell', initials: 'SH', domain: 'shell.com' },
{ name: 'Chevron', initials: 'CV', domain: 'chevron.com' },
{ name: 'ExxonMobil', initials: 'XM', domain: 'exxonmobil.com' },
{ name: 'BP', initials: 'BP', domain: 'bp.com' },
{ name: 'TotalEnergies', initials: 'TE', domain: 'totalenergies.com' },
{ name: 'Siemens', initials: 'SM', domain: 'siemens.com' },
{ name: 'GE', initials: 'GE', domain: 'ge.com' },
{ name: '3M', initials: '3M', domain: '3m.com' },
{ name: 'Honeywell', initials: 'HW', domain: 'honeywell.com' },
{ name: 'Caterpillar', initials: 'CT', domain: 'caterpillar.com' },
{ name: 'ABB', initials: 'AB', domain: 'abb.com' },
{ name: 'Schneider Electric', initials: 'SE', domain: 'se.com' },

// === MULTINASIONAL — RETAIL & FASHION ===
{ name: 'Nike', initials: 'NK', domain: 'nike.com' },
{ name: 'Adidas', initials: 'AD', domain: 'adidas.com' },
{ name: 'Zara', initials: 'ZR', domain: 'zara.com' },
{ name: 'H&M', initials: 'HM', domain: 'hm.com' },
{ name: 'IKEA', initials: 'IK', domain: 'ikea.com' },
{ name: 'Walmart', initials: 'WM', domain: 'walmart.com' },
{ name: 'Costco', initials: 'CO', domain: 'costco.com' },
{ name: 'LVMH', initials: 'LV', domain: 'lvmh.com' },
{ name: 'Hermès', initials: 'HE', domain: 'hermes.com' },
{ name: 'Gucci', initials: 'GC', domain: 'gucci.com' },
{ name: 'Prada', initials: 'PD', domain: 'prada.com' },
{ name: 'Chanel', initials: 'CH', domain: 'chanel.com' },
{ name: 'Burberry', initials: 'BB', domain: 'burberry.com' },
{ name: 'Puma', initials: 'PM', domain: 'puma.com' },
{ name: 'New Balance', initials: 'NB', domain: 'newbalance.com' },
{ name: 'Lululemon', initials: 'LL', domain: 'lululemon.com' },
{ name: 'Gap', initials: 'GP', domain: 'gap.com' },
{ name: 'Ralph Lauren', initials: 'RL', domain: 'ralphlauren.com' },

// === MULTINASIONAL — MEDIA & ENTERTAINMENT ===
{ name: 'Disney', initials: 'DS', domain: 'disney.com' },
{ name: 'Warner Bros', initials: 'WB', domain: 'warnerbros.com' },
{ name: 'Paramount', initials: 'PM', domain: 'paramount.com' },
{ name: 'NBCUniversal', initials: 'NB', domain: 'nbcuniversal.com' },
{ name: 'EA Games', initials: 'EA', domain: 'ea.com' },
{ name: 'Ubisoft', initials: 'UB', domain: 'ubisoft.com' },
{ name: 'Epic Games', initials: 'EG', domain: 'epicgames.com' },
{ name: 'Riot Games', initials: 'RG', domain: 'riotgames.com' },
{ name: 'Nintendo', initials: 'NT', domain: 'nintendo.com' },

// === MULTINASIONAL — FOOD & BEVERAGE ===
{ name: 'Starbucks', initials: 'SB', domain: 'starbucks.com' },
{ name: "McDonald's", initials: 'MC', domain: 'mcdonalds.com' },
{ name: 'KFC', initials: 'KF', domain: 'kfc.com' },
{ name: 'Pizza Hut', initials: 'PH', domain: 'pizzahut.com' },
{ name: 'Dominos', initials: 'DM', domain: 'dominos.com' },
{ name: 'Burger King', initials: 'BK', domain: 'bk.com' },
{ name: 'Subway', initials: 'SW', domain: 'subway.com' },
{ name: 'Taco Bell', initials: 'TB', domain: 'tacobell.com' },

// === MULTINASIONAL — AEROSPACE & DEFENSE ===
{ name: 'Boeing', initials: 'BG', domain: 'boeing.com' },
{ name: 'Airbus', initials: 'AB', domain: 'airbus.com' },
{ name: 'Lockheed Martin', initials: 'LM', domain: 'lockheedmartin.com' },
{ name: 'Raytheon', initials: 'RT', domain: 'rtx.com' },
{ name: 'Northrop Grumman', initials: 'NG', domain: 'northropgrumman.com' },

// === MULTINASIONAL — LOGISTICS ===
{ name: 'FedEx', initials: 'FX', domain: 'fedex.com' },
{ name: 'DHL', initials: 'DH', domain: 'dhl.com' },
{ name: 'UPS', initials: 'UP', domain: 'ups.com' },
{ name: 'Maersk', initials: 'MK', domain: 'maersk.com' },
{ name: 'JNE', initials: 'JN', domain: 'jne.co.id' },
{ name: 'J&T Express', initials: 'JT', domain: 'jet.co.id' },
{ name: 'SiCepat', initials: 'SC', domain: 'sicepat.com' },

// === MULTINASIONAL — OTHERS ===
{ name: 'Booking.com', initials: 'BK', domain: 'booking.com' },
{ name: 'Expedia', initials: 'EX', domain: 'expedia.com' },
{ name: 'Hilton', initials: 'HT', domain: 'hilton.com' },
{ name: 'Marriott', initials: 'MR', domain: 'marriott.com' },
{ name: 'Accor', initials: 'AC', domain: 'accor.com' },
{ name: 'WeWork', initials: 'WW', domain: 'wework.com' },
{ name: 'Lazada', initials: 'LZ', domain: 'lazada.com' },
{ name: 'Zalora', initials: 'ZL', domain: 'zalora.com' },
{ name: 'Cargill', initials: 'CG', domain: 'cargill.com' },
{ name: 'Wilmar', initials: 'WL', domain: 'wilmar-international.com' },
{ name: 'Olam', initials: 'OL', domain: 'olamgroup.com' },
{ name: 'DBS Bank', initials: 'DB', domain: 'dbs.com' },
{ name: 'OCBC', initials: 'OC', domain: 'ocbc.com' },
{ name: 'Maybank', initials: 'MB', domain: 'maybank.com' },
{ name: 'AXA', initials: 'AX', domain: 'axa.com' },
{ name: 'Zurich', initials: 'ZR', domain: 'zurich.com' },
{ name: 'MetLife', initials: 'ML', domain: 'metlife.com' },
{ name: 'Aviva', initials: 'AV', domain: 'aviva.com' },
{ name: 'Philips', initials: 'PH', domain: 'philips.com' },
{ name: 'Bosch', initials: 'BO', domain: 'bosch.com' },
{ name: 'Panasonic', initials: 'PN', domain: 'panasonic.com' },
{ name: 'Toshiba', initials: 'TB', domain: 'toshiba.com' },
{ name: 'Hitachi', initials: 'HT', domain: 'hitachi.com' },
{ name: 'Fujitsu', initials: 'FJ', domain: 'fujitsu.com' },
{ name: 'NEC', initials: 'NC', domain: 'nec.com' },
{ name: 'Epson', initials: 'EP', domain: 'epson.com' },
{ name: 'Canon', initials: 'CN', domain: 'canon.com' },
{ name: 'Nikon', initials: 'NK', domain: 'nikon.com' },
{ name: 'BASF', initials: 'BS', domain: 'basf.com' },
{ name: 'Dow', initials: 'DW', domain: 'dow.com' },
{ name: 'DuPont', initials: 'DP', domain: 'dupont.com' },
{ name: 'Michelin', initials: 'MC', domain: 'michelin.com' },
{ name: 'Bridgestone', initials: 'BS', domain: 'bridgestone.com' },
{ name: 'Goodyear', initials: 'GY', domain: 'goodyear.com' },

// === TAMBAHAN — TECH & DIGITAL ===
{ name: 'Cloudflare', initials: 'CF', domain: 'cloudflare.com' },
{ name: 'GitHub', initials: 'GH', domain: 'github.com' },
{ name: 'GitLab', initials: 'GL', domain: 'gitlab.com' },
{ name: 'Vercel', initials: 'VC', domain: 'vercel.com' },
{ name: 'DigitalOcean', initials: 'DO', domain: 'digitalocean.com' },
{ name: 'Elastic', initials: 'EL', domain: 'elastic.co' },
{ name: 'Confluent', initials: 'CF', domain: 'confluent.io' },
{ name: 'HashiCorp', initials: 'HC', domain: 'hashicorp.com' },
{ name: 'Okta', initials: 'OK', domain: 'okta.com' },
{ name: 'CrowdStrike', initials: 'CS', domain: 'crowdstrike.com' },
{ name: 'Palo Alto Networks', initials: 'PA', domain: 'paloaltonetworks.com' },
{ name: 'Fortinet', initials: 'FT', domain: 'fortinet.com' },
{ name: 'Qualcomm', initials: 'QC', domain: 'qualcomm.com' },
{ name: 'Broadcom', initials: 'BC', domain: 'broadcom.com' },
{ name: 'Texas Instruments', initials: 'TI', domain: 'ti.com' },
{ name: 'TSMC', initials: 'TS', domain: 'tsmc.com' },
{ name: 'ASML', initials: 'AS', domain: 'asml.com' },
{ name: 'Workday', initials: 'WD', domain: 'workday.com' },
{ name: 'HubSpot', initials: 'HS', domain: 'hubspot.com' },
{ name: 'Zendesk', initials: 'ZD', domain: 'zendesk.com' },
{ name: 'DocuSign', initials: 'DS', domain: 'docusign.com' },
{ name: 'Autodesk', initials: 'AU', domain: 'autodesk.com' },
{ name: 'Intuit', initials: 'IT', domain: 'intuit.com' },
{ name: 'Square', initials: 'SQ', domain: 'squareup.com' },
{ name: 'Coinbase', initials: 'CB', domain: 'coinbase.com' },
{ name: 'Robinhood', initials: 'RH', domain: 'robinhood.com' },
{ name: 'Reddit', initials: 'RD', domain: 'reddit.com' },
{ name: 'Discord', initials: 'DC', domain: 'discord.com' },
{ name: 'Roblox', initials: 'RX', domain: 'roblox.com' },
{ name: 'Unity', initials: 'UN', domain: 'unity.com' },
{ name: 'Activision', initials: 'AV', domain: 'activision.com' },

// === TAMBAHAN — INDONESIA ===
{ name: 'GoTo', initials: 'GT', domain: 'gotocompany.com' },
{ name: 'Bank Neo Commerce', initials: 'NC', domain: 'bankneo.co.id' },
{ name: 'Allo Bank', initials: 'AL', domain: 'allobank.com' },
{ name: 'LinkAja', initials: 'LA', domain: 'linkaja.id' },
{ name: 'ShopeePay', initials: 'SY', domain: 'shopeepay.co.id' },
{ name: 'Sirclo', initials: 'SR', domain: 'sirclo.com' },
{ name: 'Fazz', initials: 'FZ', domain: 'fazz.com' },
{ name: 'Pintu', initials: 'PT', domain: 'pintu.co.id' },
{ name: 'Ajaib', initials: 'AJ', domain: 'ajaib.co.id' },
{ name: 'Bareksa', initials: 'BK', domain: 'bareksa.com' },
{ name: 'Koinworks', initials: 'KW', domain: 'koinworks.com' },
{ name: 'Modalku', initials: 'MK', domain: 'modalku.co.id' },
{ name: 'Sinar Mas Land', initials: 'SL', domain: 'sinarmasland.com' },
{ name: 'Ciputra', initials: 'CP', domain: 'ciputra.com' },
{ name: 'Pakuwon', initials: 'PW', domain: 'pakuwon.com' },
{ name: 'Summarecon', initials: 'SM', domain: 'summarecon.com' },
{ name: 'Agung Sedayu', initials: 'AG', domain: 'agungsedayu.com' },
{ name: 'Semen Padang', initials: 'SP', domain: 'semenpadang.co.id' },
{ name: 'Krakatau Steel', initials: 'KS', domain: 'kfrrakatausteel.co.id' },
{ name: 'Chandra Asri', initials: 'CA', domain: 'chandraasri.com' },
{ name: 'Medco', initials: 'MD', domain: 'medcoenergi.com' },
{ name: 'Elnusa', initials: 'EL', domain: 'elnusa.co.id' },
{ name: 'Bukit Asam', initials: 'BA', domain: 'ptba.co.id' },
{ name: 'MIND ID', initials: 'MI', domain: 'mind.id' },
{ name: 'Inalum', initials: 'IN', domain: 'inalum.id' },
{ name: 'Wings Air', initials: 'WA', domain: 'lionair.co.id' },
{ name: 'Citilink', initials: 'CL', domain: 'citilink.co.id' },
{ name: 'Batik Air', initials: 'BT', domain: 'batikair.com' },
{ name: 'Pelindo', initials: 'PD', domain: 'pelindo.co.id' },
{ name: 'Pos Indonesia', initials: 'PS', domain: 'posindonesia.co.id' },
{ name: 'Kereta Api', initials: 'KA', domain: 'kai.id' },
{ name: 'Transjakarta', initials: 'TJ', domain: 'transjakarta.co.id' },
{ name: 'MRT Jakarta', initials: 'MR', domain: 'jakartamrt.co.id' },

// === TAMBAHAN — GLOBAL ===
{ name: 'Accenture', initials: 'AC', domain: 'accenture.com' },
{ name: 'Cognizant', initials: 'CG', domain: 'cognizant.com' },
{ name: 'Infosys', initials: 'IF', domain: 'infosys.com' },
{ name: 'Wipro', initials: 'WP', domain: 'wipro.com' },
{ name: 'TCS', initials: 'TC', domain: 'tcs.com' },
{ name: 'Boston Scientific', initials: 'BS', domain: 'bostonscientific.com' },
{ name: 'Medtronic', initials: 'MT', domain: 'medtronic.com' },
{ name: 'Stryker', initials: 'SK', domain: 'stryker.com' },
{ name: 'Under Armour', initials: 'UA', domain: 'underarmour.com' },
{ name: 'Skechers', initials: 'SK', domain: 'skechers.com' },
{ name: 'Cartier', initials: 'CT', domain: 'cartier.com' },
{ name: 'Dior', initials: 'DR', domain: 'dior.com' },
{ name: 'Versace', initials: 'VS', domain: 'versace.com' },
{ name: 'Balenciaga', initials: 'BL', domain: 'balenciaga.com' },
{ name: 'Uniqlo', initials: 'UQ', domain: 'uniqlo.com' },
{ name: 'Muji', initials: 'MJ', domain: 'muji.com' },
{ name: 'Dyson', initials: 'DY', domain: 'dyson.com' },
{ name: 'Bose', initials: 'BO', domain: 'bose.com' },
{ name: 'Sonos', initials: 'SN', domain: 'sonos.com' },
{ name: 'GoPro', initials: 'GP', domain: 'gopro.com' }];


// Split into 3 rows
const row1 = companies.slice(0, Math.ceil(companies.length / 3));
const row2 = companies.slice(Math.ceil(companies.length / 3), Math.ceil(companies.length * 2 / 3));
const row3 = companies.slice(Math.ceil(companies.length * 2 / 3));

const LogoItem: React.FC<{company: Company;}> = ({ company }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 px-4 shrink-0">
      <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
        {!imgError ?
        <img
          src={`https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`}
          alt={company.name}
          loading="lazy"
          className="w-10 h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300"
          onError={() => setImgError(true)} /> :


        <div className="w-10 h-10 bg-muted border border-border flex items-center justify-center font-display text-[10px] text-muted-foreground uppercase">
            {company.initials}
          </div>
        }
      </div>
      <span className="font-body text-[10px] text-muted-foreground text-center leading-tight whitespace-nowrap">
        {company.name}
      </span>
    </div>);

};

interface MarqueeRowProps {
  items: Company[];
  reverse?: boolean;
  duration: string;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({ items, reverse = false, duration }) => {
  const tripled = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${duration} linear infinite`
        }}>
        
        {tripled.map((company, i) =>
        <LogoItem key={`${company.domain}-${i}`} company={company} />
        )}
      </div>
    </div>);

};

export const CompanyLogos: React.FC = () => {
  return (
    <SectionWrapper id="alumni-companies">
      <div className="text-center mb-10">
        <div className="inline-block bg-neoCyan border-2 border-foreground px-3 py-1 font-display text-xs uppercase shadow-neoSm -rotate-1 mb-4">
          🏢 Social Proof
        </div>
        <h2 className="font-display text-3xl md:text-4xl uppercase mb-3">
          Perusahaan Top Merekrut Alumni Kami
        </h2>
        <p className="font-body text-muted-foreground max-w-md mx-auto">Perusahaan-perusahaan yang sudah menerima alumni MantraSkill setelah serius gunain mantra.

        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <MarqueeRow items={row1} duration="10s" />
        <MarqueeRow items={row2} reverse duration="10s" />
        <MarqueeRow items={row3} duration="10s" />
      </div>
    </SectionWrapper>);

};