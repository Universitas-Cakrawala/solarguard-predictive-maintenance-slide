import { useState, type ReactNode } from 'react';
import { Step, Steps, type SlideTransition, type DesignSystem, type Page, type SlideMeta, useSlidePageNumber } from '@open-slide/core';
import irradiation from '@assets/eda_irradiation_power.png';
import diagnostics from '@assets/final_test_diagnostics.png';
import importance from '@assets/permutation_importance.png';

export const design: DesignSystem = {
  palette: { bg: '#F3F7F1', text: '#12352B', accent: '#D68A12' },
  fonts: { display: 'Arial, sans-serif', body: 'Arial, sans-serif' },
  typeScale: { hero: 164, body: 36 },
  radius: 0,
};
const muted = '#4B665A';
const line = '#D5E3D9';
const blue = '#167A52';
const amber = '#D68A12';
const red = '#B34A3C';

export const transition: SlideTransition = {
  duration: 260,
  exit: { keyframes: [{ opacity: 1 }, { opacity: 1 }], easing: 'cubic-bezier(0.4, 0, 1, 1)' },
  enter: { keyframes: [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], easing: 'cubic-bezier(0, 0, 0.2, 1)' },
};

const motionStyles = `
@keyframes solar-detail { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.solar-control:focus-visible { outline: 3px solid #167A52; outline-offset: 4px; }
.solar-control:hover { box-shadow: inset 0 -3px 0 #D68A12; }
.solar-detail { animation: solar-detail 220ms ease-out both; }
.solar-print { display: none !important; }
@media (prefers-reduced-motion: reduce) { .solar-detail { animation: none; } .solar-control { transition: none !important; } }
@media print { .solar-controls, .solar-screen { display: none !important; } .solar-print { display: grid !important; } [data-osd-step] { opacity: 1 !important; visibility: visible !important; } .solar-detail { animation: none !important; } }
`;
const Choice = ({ children, active, onClick }: { children: ReactNode; active: boolean; onClick: () => void }) => <button type="button" className="solar-control" aria-pressed={active} onClick={e => { e.stopPropagation(); onClick(); }} onKeyDown={e => { if ([' ', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.stopPropagation(); }} style={{ fontFamily: 'inherit', fontSize: 24, fontWeight: 700, padding: '12px 20px', border: `1px solid ${active ? blue : line}`, background: active ? blue : '#FFFFFF', color: active ? '#FFFFFF' : '#12352B', cursor: 'pointer', transition: 'background 180ms ease, color 180ms ease' }}>{children}</button>;

const TestMetrics = () => {
  const [plant, setPlant] = useState<'all' | 'p1' | 'p2'>('all');
  const values = { all: ['196,019', '502,776', '0,978851', 'gabungan'], p1: ['291,823', '678,561', '0,964396', 'Plant 1'], p2: ['104,683', '234,109', '0,390257', 'Plant 2'] }[plant];
  return <><style>{motionStyles}</style><div className="solar-controls" role="group" aria-label="Pilih cakupan metrik test" style={{ position: 'absolute', top: 64, right: 96, display: 'flex', gap: 10 }}><Choice active={plant === 'all'} onClick={() => setPlant('all')}>Gabungan</Choice><Choice active={plant === 'p1'} onClick={() => setPlant('p1')}>Plant 1</Choice><Choice active={plant === 'p2'} onClick={() => setPlant('p2')}>Plant 2</Choice></div><div key={plant} className="solar-screen solar-detail" aria-live="polite" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 36 }}><Metric value={values[0]} label={`MAE test · ${values[3]}`} /><Metric value={values[1]} label={`RMSE test · ${values[3]}`} /><Metric value={values[2]} label={`R² · ${values[3]}`} /></div><div className="solar-print" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 36 }}><Metric value="196,019" label="MAE test gabungan" /><Metric value="502,776" label="RMSE test gabungan" /><Metric value="0,978851" label="R² gabungan" /></div></>;
};

const FoldExplorer = () => {
  const [fold, setFold] = useState(5);
  const selected = [{ days: 7, end: '21 Mei', validation: '22–25 Mei' }, { days: 11, end: '25 Mei', validation: '26–29 Mei' }, { days: 15, end: '29 Mei', validation: '30 Mei–2 Juni' }, { days: 19, end: '2 Juni', validation: '3–6 Juni' }, { days: 23, end: '6 Juni', validation: '7–10 Juni' }][fold - 1];
  return <div><style>{motionStyles}</style><strong style={{ fontSize: 30 }}>Lima fold, jendela pelatihan bertambah</strong><div className="solar-controls" role="group" aria-label="Pilih fold validasi" style={{ display: 'flex', gap: 12, margin: '24px 0' }}><Choice active={fold === 1} onClick={() => setFold(1)}>1</Choice><Choice active={fold === 2} onClick={() => setFold(2)}>2</Choice><Choice active={fold === 3} onClick={() => setFold(3)}>3</Choice><Choice active={fold === 4} onClick={() => setFold(4)}>4</Choice><Choice active={fold === 5} onClick={() => setFold(5)}>5</Choice></div><div className="solar-screen solar-detail" key={fold} aria-live="polite"><Text size={30}>Fold {fold}: {selected.days} hari training + 4 hari validasi</Text><div style={{ display: 'flex', width: 720, gap: 6, marginBottom: 20 }}><div style={{ width: selected.days * 24, height: 20, background: blue, transition: 'width 240ms ease-out' }} />  <div style={{ width: 96, height: 20, background: '#F3C85B' }} /></div><Text size={26}>Training: 15 Mei–{selected.end}<br />Validasi: {selected.validation} 2020</Text></div><div className="solar-print" style={{ fontSize: 30, lineHeight: 1.6, marginTop: 24 }}>Training: 7 / 11 / 15 / 19 / 23 hari<br />Setiap fold diikuti 4 hari validasi</div><Text size={26}>Semua baris pada tanggal yang sama berada pada partisi yang sama.</Text></div>;
};

const Title = ({ children }: { children: ReactNode }) => <h1 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 72, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.025em', margin: 0 }}>{children}</h1>;
const Footer = ({ source = 'SolarGuard.ipynb · snapshot 14 Oktober 2026' }: { source?: string }) => {
  const { current, total } = useSlidePageNumber();
  return <footer style={{ position: 'absolute', left: 96, right: 96, bottom: 40, paddingTop: 18, borderTop: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', gap: 24, color: muted, fontSize: 22 }}><span>SolarGuard · Kelompok 7</span><span>{source}</span><span>{String(current).padStart(2, '0')} / {total}</span></footer>;
};
const Eyebrow = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--osd-accent)', marginBottom: 24, fontWeight: 700 }}>{children}</div>;
const Frame = ({ label, title, source, children }: { label: string; title: string; source?: string; children: ReactNode }) => <section data-solar-page style={{ width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', padding: '72px 96px 110px', background: 'var(--osd-bg)', color: 'var(--osd-text)', fontFamily: 'var(--osd-font-body)' }}><Eyebrow>{label}</Eyebrow><Title>{title}</Title><div style={{ marginTop: 40 }}>{children}</div><Footer source={source} /></section>;
const Text = ({ children, size = 36, color = muted }: { children: ReactNode; size?: number; color?: string }) => <p style={{ fontSize: size, lineHeight: 1.45, color, margin: '0 0 24px' }}>{children}</p>;
const Metric = ({ value, label, detail, color = blue }: { value: string; label: string; detail?: string; color?: string }) => <div style={{ borderTop: `3px solid ${color}`, paddingTop: 18 }}><div style={{ color, fontSize: 72, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{value}</div><div style={{ fontSize: 30, marginTop: 12 }}>{label}</div>{detail && <div style={{ fontSize: 24, lineHeight: 1.4, color: muted, marginTop: 12 }}>{detail}</div>}</div>;
const Finding = ({ n, title, children }: { n: string; title: string; children: ReactNode }) => <div style={{ display: 'flex', gap: 24, padding: '20px 0', borderTop: `1px solid ${line}` }}><span style={{ fontSize: 26, color: amber, paddingTop: 6 }}>{n}</span><div><strong style={{ fontSize: 31, lineHeight: 1.3 }}>{title}</strong><p style={{ fontSize: 28, lineHeight: 1.4, color: muted, margin: '12px 0 0' }}>{children}</p></div></div>;

const Cover: Page = () => <section data-solar-page style={{ width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', padding: '92px 96px', fontFamily: 'var(--osd-font-body)', color: 'var(--osd-text)', background: 'var(--osd-bg)' }}>
  <Eyebrow>Predictive Analytics · Kelompok 7 · Untuk pimpinan operasi</Eyebrow>
  <h1 style={{ fontSize: 'var(--osd-size-hero)', fontFamily: 'var(--osd-font-display)', letterSpacing: '-0.06em', lineHeight: 1, margin: '66px 0 32px', fontWeight: 800 }}>SolarGuard<span style={{ color: amber }}>.</span></h1>
  <div style={{ width: 1180, fontSize: 66, lineHeight: 1.15, letterSpacing: '-0.025em' }}>Estimasi output untuk<br />prioritas inspeksi</div>
  <div style={{ position: 'absolute', top: 320, right: 96, width: 350, borderTop: `4px solid ${amber}`, paddingTop: 24 }}><Text size={28}>Usulan keputusan</Text><Text size={38} color="#12352B">Pilot Plant 1 dengan tinjauan operator</Text></div>
  <div style={{ marginTop: 70, fontSize: 27, lineHeight: 1.65, color: muted }}>Titanio Yudista · 24120500031 · Ketua<br />Farisyah Aulia Hanum · 24120500027<br />Sayyid Abdul Aziz Haidar · 24120500005</div>
  <Footer source="Estimasi kontemporer · horizon 0" />
</section>;

const Problem: Page = () => <Frame label="01 / Keputusan operasional" title="Output rendah perlu konteks cuaca">
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, marginTop: 34 }}>
    <div><div style={{ fontSize: 24, color: muted, marginBottom: 24 }}>PENGAMATAN SAAT INI</div><div style={{ fontSize: 60, lineHeight: 1.15, maxWidth: 690 }}>Apakah inverter<br />perlu diperiksa?</div><Text size={36}>Daya berubah mengikuti kondisi cuaca. Membandingkan output mentah saja dapat menyesatkan.</Text></div>
    <div style={{ borderLeft: `2px solid ${line}`, paddingLeft: 64 }}><Steps><Step><Finding n="1" title="Estimasi daya yang diharapkan">Gunakan cuaca pada waktu yang sama dan identitas inverter.</Finding></Step><Step><Finding n="2" title="Tinjau selisih yang bertahan">Bandingkan prediksi dengan aktual, lalu minta verifikasi operator.</Finding></Step></Steps></div>
  </div>
  <div style={{ marginTop: 52, padding: '24px 32px', background: '#E7F0E8', fontSize: 30 }}>Keluaran prototype: daftar prioritas tinjauan. Manfaat inspeksi masih perlu diukur dalam pilot.</div>
</Frame>;

const Data: Page = () => <Frame label="02 / Data dan cakupan" title="Dua pembangkit, 34 hari pengamatan" source="DATA_SOURCE.md · dataset_dimensions.csv · cleaning_row_flow.csv">
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 48 }}><Metric value="4" label="CSV sumber" detail="Pembangkitan dan cuaca untuk setiap plant" /><Metric value="44" label="inverter" detail="Dua pembangkit di India" /><Metric value="136.476" label="baris pembangkitan" detail="Observasi mentah" /><Metric value="77.098" label="baris analisis" detail="Irradiation > 0 dan target valid" /></div>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginTop: 72 }}><div><Text color="#12352B">Target: DC_POWER pada waktu t</Text><Text size={30}>Cuaca t, waktu, serta identitas plant/inverter menjadi input. Evaluasi berlaku pada inverter yang dikenal.</Text></div><div><Text color="#12352B">15 Mei–17 Juni 2020</Text><Text size={30}>Satuan fisik belum terverifikasi. Analisis mempertahankan skala asli, dengan hasil terpisah per pembangkit.</Text></div></div>
  <Text size={24}>Sumber: Ani Kannal, Solar Power Generation Data, Kaggle v1. Diakses 14 Oktober 2026. Registrasi dan keunikan dikonfirmasi kelompok.</Text>
</Frame>;

const Validation: Page = () => <Frame label="03 / Validasi" title="Tanggal utuh menjaga urutan evaluasi" source="cv_folds.csv · join_audit.csv · initial_selection_lock.json">
  <div style={{ display: 'flex', gap: 12, marginTop: 12 }}><div style={{ flex: 27, background: blue, color: 'white', padding: 32, fontSize: 34 }}>Development · 27 hari<br /><span style={{ fontSize: 26 }}>15 Mei–10 Juni 2020 · 60.510 baris</span></div><div style={{ flex: 7, background: '#F3C85B', padding: 32, fontSize: 34 }}>Test · 7 hari<br /><span style={{ fontSize: 26 }}>11–17 Juni · 16.588 baris</span></div></div>
  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 80, marginTop: 48 }}><FoldExplorer /><div><Finding n="01" title="Penggabungan terkontrol">PLANT_ID + DATE_TIME, banyak-ke-satu. Empat baris tanpa pasangan cuaca dicatat.</Finding><Finding n="02" title="Transformasi hanya belajar dari training">Target/proksi dikeluarkan. Model dan ambang dikunci sebelum test pertama.</Finding></div></div>
  <Text size={24}>Eksekusi terbaru mereproduksi keputusan awal setelah test pernah dilihat. Test tersebut bukan evaluasi independen baru.</Text>
</Frame>;

const EDA: Page = () => <Frame label="04 / Temuan data" title="Plant 2 memerlukan pemeriksaan lebih lanjut" source="EDA development · eda_irradiation_power.png · development_scale_audit.csv">
  <img src={irradiation} alt="Hubungan irradiation dan daya DC per pembangkit pada development" style={{ width: 1728, height: 518, objectFit: 'contain', background: 'white' }} />
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40, marginTop: 24 }}><Finding n="01" title="Hubungan cuaca berbeda">Korelasi irradiation–DC: 0,980 di Plant 1 dan 0,647 di Plant 2.</Finding><Finding n="02" title="Output nol perlu ditelusuri">1.161 baris siang bernilai nol di Plant 1, dibandingkan 5.642 di Plant 2.</Finding><Finding n="03" title="Skala belum setara">Median rasio DC/AC: 10,22 vs 1,02. Hindari konversi tanpa verifikasi.</Finding></div>
</Frame>;

const ScoreRow = ({ name, mae, sd, rmse, highlight = false }: { name: string; mae: string; sd: string; rmse: string; highlight?: boolean }) => <tr style={{ background: highlight ? '#E5ECEC' : 'transparent' }}><td style={{ padding: '19px 24px', borderBottom: `1px solid ${line}`, fontWeight: highlight ? 700 : 400 }}>{name}</td><td style={{ padding: '19px 24px', borderBottom: `1px solid ${line}`, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{mae}</td><td style={{ padding: '19px 24px', borderBottom: `1px solid ${line}`, textAlign: 'right' }}>{sd}</td><td style={{ padding: '19px 24px', borderBottom: `1px solid ${line}`, textAlign: 'right' }}>{rmse}</td></tr>;
const Candidates: Page = () => <Frame label="05 / Pembanding model" title="Dua ensemble memperoleh MAE CV terendah" source="default_cv_ranking.csv · plant_mean_baseline_cv_folds.csv">
  <div style={{ display: 'grid', gridTemplateColumns: '1170px 1fr', gap: 56 }}><table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 29 }}><thead><tr style={{ fontSize: 24, color: muted, textAlign: 'left' }}><th style={{ padding: 24 }}>Model default</th><th style={{ textAlign: 'right' }}>MAE ↓</th><th style={{ textAlign: 'right' }}>SD sampel</th><th style={{ textAlign: 'right', paddingRight: 24 }}>RMSE</th></tr></thead><tbody><ScoreRow name="Gradient Boosting" mae="294,003" sd="28,866" rmse="572,036" highlight /><ScoreRow name="Random Forest" mae="294,844" sd="35,636" rmse="602,332" highlight /><ScoreRow name="Regresi Linear" mae="1.559,473" sd="106,461" rmse="1.860,758" /><ScoreRow name="Ridge" mae="1.559,917" sd="106,731" rmse="1.861,009" /><ScoreRow name="Rata-rata gabungan" mae="3.349,278" sd="157,842" rmse="3.964,284" /></tbody></table><div style={{ paddingTop: 22 }}><Text size={32} color="#12352B">Dasar seleksi</Text><Text size={30}>MAE rata-rata pada lima fold yang identik. Lebih rendah lebih baik.</Text><Text size={28}>Linear aditif belum memiliki kemiringan cuaca terpisah untuk tiap plant.</Text></div></div>
  <div style={{ borderTop: `2px solid ${amber}`, marginTop: 32, paddingTop: 20, fontSize: 28, lineHeight: 1.4 }}>Pembanding tambahan rata-rata per plant: CV MAE 1.963,493. Analisis setelah test dilihat, tidak digunakan memilih model.</div>
</Frame>;

const Tune: Page = () => <Frame label="06 / Penyetelan dan seleksi" title="Random Forest terpilih melalui MAE CV" source="default_vs_tuned.csv · notebook bagian 9 · selection_lock.json">
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72 }}>
    <div style={{ borderTop: `4px solid ${blue}`, paddingTop: 20 }}><Text color="#12352B">Random Forest</Text><div style={{ fontSize: 64, fontWeight: 700, color: blue }}>294,844 → 290,620</div><Text size={28}>MAE membaik 1,43% · SD tuned 34,592</Text><Text size={28}>Terbaik: 100 pohon, depth 20, leaf 2, max_features 1,0.</Text><Text size={24}>Ruang: pohon [100, 200, 300]; depth [10, 20, tanpa batas]; leaf [1, 2, 4]; max_features [1,0; 0,5; sqrt].</Text></div>
    <div style={{ borderTop: `4px solid ${red}`, paddingTop: 20 }}><Text color="#12352B">Gradient Boosting</Text><div style={{ fontSize: 64, fontWeight: 700, color: red }}>294,003 → 354,049</div><Text size={28}>MAE memburuk 20,42% · SD tuned 27,957</Text><Text size={28}>Terbaik dalam pencarian: 300 pohon, depth 2, learning_rate 0,1, leaf 4, subsample 1,0.</Text><Text size={24}>Ruang: pohon [100, 200, 300]; depth [2, 3, 5]; learning_rate [0,03; 0,05; 0,1]; leaf [1, 4]; subsample [0,8; 1,0].</Text></div>
  </div>
  <div style={{ background: '#E7F0E8', padding: '26px 32px', marginTop: 32 }}><Text size={30} color="#12352B">RandomizedSearchCV · 4 konfigurasi/model × 5 fold · seed 42</Text><Text size={26}>Default tetap boleh menang. Selisih RF tuned dan GB default hanya 3,383 MAE; tidak ada klaim signifikansi.</Text></div>
  <Text size={24}>SD laporan memakai ddof=1. Fold berbobot sama dan riwayat training bertumpang tindih. SD bukan interval kepercayaan.</Text>
</Frame>;

const Test: Page = () => <Frame label="07 / Evaluasi test" title="Hasil gabungan menutupi perbedaan plant" source="final_test_metrics.csv · final_test_by_plant.csv · final_test_diagnostics.png">
  <TestMetrics />
  <div style={{ display: 'grid', gridTemplateColumns: '1030px 1fr', gap: 54, marginTop: 42 }}><div><div style={{ display: 'flex', gap: 30 }}><div style={{ width: 480, height: 419, overflow: 'hidden', position: 'relative', background: 'white' }}><img src={diagnostics} alt="Panel aktual versus prediksi Plant 1, skala asli 0 hingga sekitar 14.000" style={{ position: 'absolute', width: 1500, maxWidth: 'none', height: 'auto', left: 0, top: 0 }} /></div><div style={{ width: 480, height: 419, overflow: 'hidden', position: 'relative', background: 'white' }}><img src={diagnostics} alt="Panel aktual versus prediksi Plant 2, skala asli 0 hingga sekitar 1.400" style={{ position: 'absolute', width: 1500, maxWidth: 'none', height: 'auto', left: 0, top: -419 }} /></div></div><Text size={24}>Dua panel aktual–prediksi dari grafik diagnostik asli. Skala sumbu berbeda. Garis putus-putus menunjukkan prediksi ideal.</Text></div><div><Finding n="P1" title="R² 0,964396 · MAE 291,823">MAE / rata-rata development: 5,04%.</Finding><Finding n="P2" title="R² 0,390257 · MAE 104,683">MAE / rata-rata development: 23,08%.</Finding><Text size={26}>MAE turun 88,205% terhadap rata-rata per plant (MAE 1.661,945). Pembanding ini adalah analisis pelengkap setelah test.</Text></div></div>
</Frame>;

const Interpretation: Page = () => <Frame label="08 / Interpretasi" title="Identitas plant membawa informasi skala" source="permutation_importance.csv · permutation_importance.png · fixed test sample">
  <div style={{ display: 'grid', gridTemplateColumns: '1120px 1fr', gap: 60 }}><img src={importance} alt="Kenaikan MAE saat fitur dipermutasi, terbesar pada PLANT_ID dan irradiation" style={{ width: 1120, height: 555, objectFit: 'contain', background: 'white' }} /><div><Finding n="01" title="Skala berbeda antar plant">Permutasi PLANT_ID terpisah dari inverter dapat membuat identitas tidak konsisten.</Finding><Finding n="02" title="Fitur cuaca berbagi informasi">Irradiation dan kuadratnya berkorelasi. Importance tidak mengukur efek kausal.</Finding></div></div>
  <div style={{ borderTop: `2px solid ${line}`, marginTop: 30, paddingTop: 24 }}><Text size={30}>Korelasi residual lag satu: Plant 1 ≈ 0,596 dan Plant 2 ≈ 0,771.</Text><Text size={28}>Galat dapat bertahan dari satu interval ke interval berikutnya. Tinjauan memerlukan konteks temporal dan pemeriksaan lapangan.</Text></div>
</Frame>;

const Action: Page = () => <Frame label="09 / Rekomendasi" title="Pilot inspeksi dan audit kualitas sensor" source="evidence_action_matrix.csv · test_alert_workload.csv · coverage_summary.csv">
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72 }}><div style={{ borderTop: `4px solid ${blue}`, paddingTop: 24 }}><Text color="#12352B">01 · Pilot prioritas inspeksi Plant 1</Text><Text size={32}>Bukti: R² 0,964 dan 3 episode tinjauan selama tujuh hari test.</Text><Finding n="PIC" title="Operations Manager">Operator meninjau gap persisten sebelum inspeksi.  </Finding><Finding n="UKUR" title="Cakupan dan waktu tinjauan">Catat hasil inspeksi terkonfirmasi dan beban kerja.</Finding><Text size={28}>Risiko: alert belum tervalidasi. Mitigasi: shadow mode dan keputusan manusia.</Text></div><div style={{ borderTop: `4px solid ${amber}`, paddingTop: 24 }}><Text color="#12352B">02 · Audit sensor dan output Plant 2</Text><Text size={32}>Bukti: galat relatif 23,08% dan cakupan inverter terendah 72,15%.</Text><Finding n="PIC" title="Tim data dan operasi">Periksa celah waktu, output nol, satuan, dan rating alat.</Finding><Finding n="UKUR" title="Ketersediaan sensor dan galat">Pantau kualitas input dan stabilitas error per kondisi.</Finding><Text size={28}>Risiko: penyebab belum diketahui. Mitigasi: cocokkan sensor dengan log lapangan.</Text></div></div>
  <div style={{ marginTop: 24, borderTop: `2px solid ${amber}`, paddingTop: 18 }}><Text size={28} color="#12352B">Implikasi bisnis: dahulukan pilot terbatas di Plant 1, alokasikan kapasitas audit ke Plant 2.</Text><Text size={24}>Ukur menit tinjauan dan hasil inspeksi sebelum investasi produksi. Penurunan MAE 88,205% tidak sama dengan penghematan biaya 88,205%.</Text></div>
</Frame>;

// Cuplikan berurutan dari test_alert_predictions.csv, bukan contoh buatan.
const replayCases = {
  p1: { plant: 'Plant 1', inverter: '1BY6WEcLGh8j5v7', threshold: 1576.9961615195143, minimum: 2208.3609225845125, episodes: 3, rows: [{ time: '11:00', actual: 2155.375, predicted: 8707.52723199693 }, { time: '11:15', actual: 0, predicted: 8881.099978407128 }, { time: '11:30', actual: 0, predicted: 8811.445692359048 }] },
  p2: { plant: 'Plant 2', inverter: '4UPUqMRk7TRMgml', threshold: 917.4306655689729, minimum: 140.59358357772402, episodes: 10, rows: [{ time: '12:45', actual: 0, predicted: 930.46169588139 }, { time: '13:00', actual: 0, predicted: 937.8840221185548 }, { time: '13:15', actual: 0, predicted: 930.6233292742096 }] },
};
const fmt = (v: number) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(v);
const ReplayRow = ({ time, actual, predicted, qualifies }: { time: string; actual: number; predicted: number; qualifies: boolean }) => <tr><td style={{ padding: 16 }}>{time}</td><td style={{ padding: 16, textAlign: 'right' }}>{fmt(predicted)}</td><td style={{ padding: 16, textAlign: 'right' }}>{fmt(actual)}</td><td style={{ padding: 16, textAlign: 'right', color: qualifies ? red : blue }}>{fmt(predicted - actual)}</td></tr>;
const ModelReplay = () => {
  const [plant, setPlant] = useState<'p1' | 'p2'>('p1');
  const [ratio, setRatio] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(15);
  const c = replayCases[plant];
  const isModified = ratio !== null || minutes !== 15;

  const handleReset = () => {
    setRatio(null);
    setMinutes(15);
  };

  const values = c.rows.map(r => ({ ...r, actual: ratio === null ? r.actual : (r.predicted * ratio) / 100 }));
  const qualifies = (r: { actual: number; predicted: number }) => r.predicted >= c.minimum && r.predicted - r.actual > c.threshold;
  const episode = values.every(qualifies);

  const controls = (
    <div className="solar-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Choice active={plant === 'p1'} onClick={() => { setPlant('p1'); setRatio(null); }}>Plant 1</Choice>
        <Choice active={plant === 'p2'} onClick={() => { setPlant('p2'); setRatio(null); }}>Plant 2</Choice>
      </div>
      <button
        type="button"
        className="solar-control"
        onClick={e => {
          e.stopPropagation();
          handleReset();
        }}
        onKeyDown={e => {
          if ([' ', 'Enter'].includes(e.key)) {
            e.stopPropagation();
            handleReset();
          }
        }}
        aria-label="Kembalikan simulasi ke data observasi asli"
        style={{
          fontFamily: 'inherit',
          fontSize: 22,
          fontWeight: 700,
          padding: '12px 22px',
          border: `1px solid ${isModified ? amber : line}`,
          background: isModified ? '#FFF9EF' : '#FFFFFF',
          color: isModified ? amber : muted,
          cursor: isModified ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 180ms ease',
        }}
      >
        <span>↺</span>
        <span>Reset data asli</span>
        {isModified && (
          <span style={{ fontSize: 16, background: amber, color: '#FFFFFF', padding: '2px 8px', borderRadius: 4, marginLeft: 4 }}>
            Simulasi aktif
          </span>
        )}
      </button>
    </div>
  );

  return (
    <>
      <style>{motionStyles}</style>
      <div className="solar-screen">
        {controls}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 64 }}>
          <div key={plant} className="solar-detail">
            <Text size={26}>{c.plant} · 14 Juni 2020 · inverter {c.inverter}</Text>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 29, borderTop: `2px solid ${line}`, borderBottom: `2px solid ${line}` }}>
              <thead style={{ color: muted, fontSize: 24 }}>
                <tr>
                  <th>Waktu</th>
                  <th>Prediksi RF</th>
                  <th>Aktual {ratio === null ? '(asli)' : `(${ratio}%)`}</th>
                  <th>Gap</th>
                </tr>
              </thead>
              <tbody>
                <ReplayRow {...values[0]} qualifies={qualifies(values[0])} />
                <ReplayRow {...values[1]} qualifies={qualifies(values[1])} />
                <ReplayRow {...values[2]} qualifies={qualifies(values[2])} />
              </tbody>
            </table>
            <div aria-live="polite" style={{ marginTop: 24, padding: 22, background: episode ? '#F2E7DB' : '#E7F0E8', color: episode ? red : blue, fontSize: 32, fontWeight: 700 }}>
              {episode ? 'Prioritas tinjauan: 3 interval memenuhi aturan' : 'Belum memenuhi 3 interval berturut-turut'}
            </div>
            <Text size={24}>Gap harus &gt; {fmt(c.threshold)}; prediksi ≥ {fmt(c.minimum)}. Tiga observasi 15 menit membentang 30 menit.</Text>
          </div>
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 28, lineHeight: 1.4 }} htmlFor="solar-output">
              <span>Skenario aktual / prediksi:</span>
              <strong style={{ color: ratio === null ? blue : amber, fontSize: 30 }}>
                {ratio === null ? 'Data asli' : `${ratio}%`}
              </strong>
            </label>
            <input
              className="solar-controls"
              id="solar-output"
              aria-label="Persentase output aktual simulasi"
              type="range"
              min="0"
              max="110"
              step="1"
              value={ratio ?? (plant === 'p1' ? 25 : 0)}
              onChange={e => setRatio(Number(e.target.value))}
              style={{ width: '100%', margin: '18px 0 12px', accentColor: blue }}
            />
            <Text size={24}>
              {ratio === null
                ? 'Menampilkan data observasi asli dari test_alert_predictions.csv. Geser slider untuk menyimulasikan output.'
                : 'Geser untuk mengganti aktual pada ketiga interval. Cuaca dan prediksi RF tetap. Ini simulasi aturan, tanpa inferensi ulang model.'}
            </Text>
            <label htmlFor="solar-minutes" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 28, marginTop: 12 }}>
              <span>Asumsi tinjauan:</span>
              <strong style={{ color: minutes !== 15 ? amber : '#12352B', fontSize: 30 }}>{minutes} menit/episode</strong>
            </label>
            <input
              className="solar-controls"
              id="solar-minutes"
              aria-label="Menit tinjauan per episode"
              type="range"
              min="5"
              max="60"
              step="5"
              value={minutes}
              onChange={e => setMinutes(Number(e.target.value))}
              style={{ width: '100%', margin: '18px 0 12px', accentColor: amber }}
            />
            <div aria-live="polite" style={{ fontSize: 38, fontWeight: 700, color: blue }}>
              {c.episodes} episode × {minutes} menit = {c.episodes * minutes} menit
            </div>
            <Text size={24}>Ilustrasi kapasitas berdasarkan beban test 7 hari, bukan perkiraan biaya inspeksi atau ROI. Jumlah episode ini tetap, bukan dihitung ulang dari slider output.</Text>
          </div>
        </div>
      </div>
      <div className="solar-print" style={{ gridTemplateColumns: '1fr 1fr', gap: 64 }}>
        <div>
          <Text color="#12352B">Replay Plant 1 · 14 Juni 2020</Text>
          <Text size={30}>11:00 / 11:15 / 11:30<br />Prediksi: 8.707,5 / 8.881,1 / 8.811,4<br />Aktual: 2.155,4 / 0 / 0</Text>
          <Text size={28}>Ketiga gap melampaui ambang 1.577,0. Prediksi memenuhi batas minimum 2.208,4. Hasil: prioritas tinjauan.</Text>
        </div>
        <div>
          <Text color="#12352B">Ilustrasi kapasitas tinjauan</Text>
          <Text size={30}>Asumsi 15 menit/episode:<br />Plant 1: 3 × 15 = 45 menit<br />Plant 2: 10 × 15 = 150 menit</Text>
          <Text size={28}>Beban 7 hari test, belum termasuk inspeksi. Simulasi output mengubah aktual, sementara prediksi RF tetap.</Text>
        </div>
      </div>
      <div style={{ marginTop: 22, borderTop: `1px solid ${line}`, paddingTop: 18 }}>
        <Text size={24}>Batas: 34 hari, dua plant dikenal, horizon 0. Alert membutuhkan operator dan log inspeksi. Sensitivitas, alarm palsu, biaya, dan ROI belum terukur.</Text>
      </div>
    </>
  );
};
const Limits: Page = () => <Frame label="10 / Simulasi model dan kapasitas" title="Dari prediksi menjadi prioritas tinjauan" source="Replay test_alert_predictions.csv · ambang OOF terkunci · skenario berlabel"><ModelReplay /></Frame>;

const Close: Page = () => <Frame label="11 / Keputusan yang diminta" title="Persetujuan pilot Plant 1">
  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 80, marginTop: 28 }}>
    <div>
      <div style={{ fontSize: 72, lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 700 }}>
        Estimasi output.<br /><span style={{ color: amber }}>Tinjauan operator.</span><br />Bukti inspeksi.
      </div>
      <Text size={28}>Mulai dengan plant yang memiliki hasil lebih kuat dan kumpulkan bukti manfaat operasional.</Text>
    </div>
    <div style={{ borderTop: `4px solid ${amber}`, paddingTop: 14 }}>
      <Finding n="1" title="Tetapkan PIC dan akses data">Operations memimpin, tim data menjaga kualitas input.</Finding>
      <Finding n="2" title="Sepakati indikator sebelum pilot">Cakupan data, waktu tinjauan, dan hasil inspeksi terkonfirmasi.</Finding>
      <Finding n="3" title="Putuskan kelanjutan melalui review">Lanjutkan hanya bila manfaat dan beban kerja dapat dibuktikan.</Finding>
    </div>
  </div>
  <div style={{ marginTop: 24, padding: '18px 24px', background: '#E7F0E8', borderLeft: `5px solid ${blue}` }}>
    <div style={{ fontSize: 22, fontWeight: 700, color: blue, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6 }}>Closing Statement</div>
    <div style={{ fontSize: 25, lineHeight: 1.38, color: '#12352B', fontStyle: 'italic' }}>
      &ldquo;Model prediktif bukan pengganti keputusan manusia di lapangan, melainkan instrumen pembuktian berbasis data. Melalui pilot terukur di Plant 1, kita membuktikan efektivitas operasional sebelum melangkah ke skala penuh.&rdquo;
    </div>
  </div>
  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 21, color: muted, borderTop: `1px solid ${line}`, paddingTop: 12 }}>
    <div><strong>Diskusi &amp; Q&amp;A</strong> · Kesiapan data, kapasitas operator, dan kriteria evaluasi pilot</div>
    <div style={{ display: 'flex', gap: 28 }}>
      <span>🌐 <a href="https://solarguard-slide-presentation.vercel.app/" target="_blank" rel="noreferrer" style={{ color: blue, textDecoration: 'none', fontWeight: 700 }}>solarguard-slide-presentation.vercel.app</a></span>
      <span>📦 <a href="https://github.com/Universitas-Cakrawala/solarguard-predictive-maintenance" target="_blank" rel="noreferrer" style={{ color: blue, textDecoration: 'none', fontWeight: 700 }}>GitHub: solarguard-predictive-maintenance</a></span>
    </div>
  </div>
</Frame>;

// Manifest bukti: seluruh angka mengacu pada snapshot notebook 14 Oktober 2026.
// Grafik sumber asli dipertahankan, termasuk istilah teknis berbahasa Inggris pada sumbu.
export const meta: SlideMeta = { title: 'SolarGuard — Estimasi Output untuk Prioritas Inspeksi', createdAt: '2026-10-15T13:30:41.765Z', theme: 'solarguard' };
export default [Cover, Problem, Data, Validation, EDA, Candidates, Tune, Test, Interpretation, Action, Limits, Close] satisfies Page[];

export const notes: (string | undefined)[] = [
  `Titanio · 20 detik. Kami Kelompok 7. SolarGuard mengestimasi daya saat kondisi cuaca diketahui untuk membantu menentukan inverter yang perlu ditinjau. Hari ini kami meminta persetujuan pilot Plant 1 dengan operator sebagai pengambil keputusan. Sumber: SolarGuard.ipynb bagian 1–2; identitas anggota mengikuti PLAN_SLIDE.md.`,
  `Titanio · 50 detik. Gunakan tombol maju untuk memunculkan dua langkah penjelasan satu per satu. Output yang turun dapat mengikuti irradiation yang turun. Pertanyaan operasi adalah apakah daya aktual menyimpang dari ekspektasi pada kondisi saat itu. Model menyediakan estimasi, lalu aturan gap persisten menyusun daftar tinjauan. Kami belum mengukur penghematan atau efektivitas deteksi kerusakan. Keputusan yang diajukan adalah pilot pengumpulan bukti operasional. Sumber: notebook bagian 1 dan 12–13.`,
  `Titanio · 50 detik. Empat file terdiri dari pembangkitan dan sensor cuaca untuk masing-masing plant. Ada 136.476 baris pembangkitan, 44 inverter, dan 34 tanggal. Setelah kelayakan siang, target valid, dan cuaca tersedia, 77.098 baris dianalisis. Target DC_POWER pada t memakai sensor t. Satuan fisik belum didukung metadata, sehingga jangan menyebut kW. Kaggle: https://www.kaggle.com/datasets/anikannal/solar-power-generation-data, Ani Kannal v1, akses 14 Oktober 2026. Pemilik fasilitas asli dan hak distribusi masih perlu verifikasi. Sumber: DATA_SOURCE.md, dataset_dimensions.csv, cleaning_row_flow.csv.`,
  `Farisyah · 60 detik. Development mencakup 27 hari dan test tujuh hari terakhir. Lima fold mempunyai training 7, 11, 15, 19, 23 hari, masing-masing validasi empat hari. Klik tombol fold 1 lalu 5 untuk memperlihatkan jendela training yang bertambah. PDF menampilkan ringkasan seluruh fold. Semua plant dan inverter pada tanggal yang sama selalu dalam partisi yang sama. Pipeline preprocessing belajar hanya pada training. Join berdasarkan PLANT_ID dan DATE_TIME, validate many_to_one. Empat baris tanpa pasangan dicatat, bukan ditutup-tutupi. Model dan threshold awal dikunci sebelum test pertama di initial_selection_lock.json. Eksekusi sekarang reproduksi setelah test pernah dilihat. Sumber: cv_folds.csv, join_audit.csv, selection locks.`,
  `Farisyah · 60 detik. Ada tiga temuan development. Pertama, korelasi irradiation dan DC lebih kuat di Plant 1, 0,980, dibanding Plant 2, 0,647. Kedua, output siang nol lebih banyak di Plant 2: 5.642 dibanding 1.161. Ini indikasi untuk diperiksa, belum diagnosis kerusakan. Ketiga, rasio median DC/AC sekitar 10,22 dan 1,02. Kami mempertahankan unit sumber karena penyebab perbedaan belum terverifikasi. Plant 4135001 adalah Plant 1 dan 4136001 adalah Plant 2. Grafik memakai unit asli dan subset development. Sumber: eda_irradiation_correlations.csv, development_scale_audit.csv, eda_irradiation_power.png.`,
  `Sayyid · 65 detik. Semua kandidat awal memakai fold yang sama dan MAE primer. GB dan RF terbaik non-baseline sehingga keduanya disetel. Tabel menampilkan rerata MAE, simpangan baku sampel ddof=1, dan RMSE pendukung. Pembanding rata-rata per plant belajar dari training masing-masing fold; CV MAE 1.963,493. Pembanding tambahan tersebut dibuat setelah test pernah dilihat dan tidak mengubah ranking awal atau seleksi final. Model linear aditif belum memuat slope cuaca spesifik plant, jadi ini bukan bukti keunggulan algoritme secara umum. Sumber: default_cv_ranking.csv dan plant_mean_baseline_cv_folds.csv.`,
  `Sayyid · 65 detik. RandomizedSearchCV memakai empat konfigurasi per model pada lima fold identik dengan seed 42. RF terbaik mempunyai n_estimators=100, max_depth=20, min_samples_leaf=2, max_features=1.0. GB terbaik dalam sampel memakai n_estimators=300, max_depth=2, learning_rate=0.1, min_samples_leaf=4, subsample=1.0. GB tuned memburuk, sehingga default GB tetap kandidat. Final RF tuned 290,620 mengungguli GB default 294,003. Selisih kecil tidak kami klaim signifikan. Pencarian terbatas, termasuk semua sampel GB kebetulan 300 pohon dan depth 2. SD deskriptif bukan CI. Sumber: default_vs_tuned.csv, random_forest_search_results.csv, gradient_boosting_search_results.csv.`,
  `Sayyid · 65 detik. Test 11–17 Juni terdiri dari 16.588 baris. MAE 196,019, RMSE 502,776, dan R² gabungan 0,978851. Namun R² Plant 2 hanya 0,390257, sedangkan Plant 1 0,964396. MAE/rata-rata development 5,04% dan 23,08%. Grafik kiri menunjukkan Plant 1 dan grafik kanan Plant 2. Gunakan tombol Gabungan, Plant 1, dan Plant 2 untuk membandingkan MAE, RMSE, serta R²; kembalikan ke Gabungan sebelum beralih halaman. Galat ekstrem serta output nol perlu inspeksi. Penurunan MAE 88,205% terhadap mean per plant adalah perbandingan tambahan setelah test. Terhadap pooled mean sekitar 93,62%; jangan menukar pembanding. CV dan test berbeda waktu, jadi selisih keduanya bukan gain tuning. Sumber: final_test_metrics.csv, final_test_by_plant.csv, final_test_diagnostics.png.`,
  `Farisyah · 50 detik. Permutation importance menghitung kenaikan MAE bila fitur diacak, pada sampel test tetap setelah seleksi. PLANT_ID besar karena beda skala, dan mengacaknya terpisah dari inverter menghasilkan kombinasi tak konsisten. Irradiation dan kuadratnya berbagi informasi. Nilai ini bukan persentase explained variance atau efek kausal. Residual lag satu sekitar 0,596 dan 0,771, sehingga galat berurutan berkorelasi. Sumber: permutation_importance.csv dan test_residual_autocorrelation.csv.`,
  `Titanio · 65 detik. Rekomendasi pertama pilot Plant 1 karena hasil regresi lebih kuat, dengan Operations Manager dan operator sebagai pemilik tindakan. Ukur cakupan, waktu review, dan hasil inspeksi terkonfirmasi. Kedua audit input Plant 2 bersama tim data dan operasi. Cakupan inverter terendah 72,15% merupakan cakupan interval pembangkitan, bukan ketersediaan semua sensor. Periksa output nol, timestamp, satuan, dan rating alat tanpa menetapkan penyebab. Tidak ada klaim biaya murah atau ROI. Sumber: evidence_action_matrix.csv, coverage_summary.csv, test_alert_workload.csv.`,
  `Farisyah · 80 detik. Slide ini mereplay tiga prediksi Random Forest yang benar-benar tersimpan di test_alert_predictions.csv. Default Plant 1 pada 14 Juni 11:00, 11:15, 11:30, inverter 1BY6WEcLGh8j5v7. Ketiga gap melampaui threshold 1576,996 dan prediksi memenuhi minimum 2208,361, sehingga terjadi satu episode tinjauan. Plant 2 memakai inverter 4UPUqMRk7TRMgml pada 12:45–13:15, threshold 917,431 dan minimum 140,594. Pilih Plant 2 lalu geser aktual ke 100% prediksi: gap menjadi nol, sehingga tidak memicu tinjauan. Ini what-if output aktual, bukan inferensi model ulang atau bukti respons cuaca kausal. Reset mengembalikan observasi asli. Slider waktu mengubah asumsi menit review; pada 15 menit, 3 episode Plant 1 membutuhkan 45 menit dan 10 episode Plant 2 membutuhkan 150 menit, belum termasuk inspeksi. Jumlah episode kapasitas adalah beban test tetap dan tidak berubah mengikuti slider output. Ambang memakai OOF dan tetap terkunci; label kerusakan tidak tersedia. Data 34 hari dan horizon 0 membatasi generalisasi. Sumber: test_alert_predictions.csv, development_alert_thresholds.csv, test_alert_workload.csv.`,
  `Titanio · 35 detik. Kami meminta persetujuan pilot Plant 1, penetapan PIC serta akses sensor, dan indikator evaluasi sebelum pilot dimulai. Hasil regresi mendukung pengujian manfaat, sementara keputusan inspeksi tetap pada operator. Closing statement: Model prediktif bukan pengganti keputusan manusia di lapangan, melainkan instrumen pembuktian berbasis data. Melalui pilot terukur di Plant 1, kita membuktikan efektivitas operasional sebelum melangkah ke skala penuh. Tautan live demo dan repository GitHub tertera di bawah untuk pengujian panelis. Tutup tepat pada menit sebelas, dilanjutkan sesi Q&A 5 menit bersama Kelompok 3. Sumber: notebook bagian 12–13 dan PLAN_SLIDE.md.`,
];
