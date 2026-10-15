import type { ReactNode } from 'react';
import { type Page, type DesignSystem, useSlidePageNumber } from '@open-slide/core';
export const design: DesignSystem = { palette: { bg: '#F3F7F1', text: '#12352B', accent: '#D68A12' }, fonts: { display: 'Arial, sans-serif', body: 'Arial, sans-serif' }, typeScale: { hero: 164, body: 36 }, radius: 0 };
const muted = '#4B665A';
const line = '#D5E3D9';
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 72, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.025em', margin: 0 }}>{children}</h1>;
const Footer = ({ source = 'SolarGuard.ipynb · snapshot 14 Oktober 2026' }: { source?: string }) => {
  const { current, total } = useSlidePageNumber();
  return <footer style={{ position: 'absolute', left: 96, right: 96, bottom: 40, paddingTop: 18, borderTop: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', gap: 24, color: muted, fontSize: 22 }}><span>SolarGuard · Kelompok 7</span><span>{source}</span><span>{String(current).padStart(2, '0')} / {total}</span></footer>;
};
const Eyebrow = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--osd-accent)', marginBottom: 24, fontWeight: 700 }}>{children}</div>;
const Cover: Page = () => <section style={{ width: '100%', height: '100%', background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '72px 96px', boxSizing: 'border-box', position: 'relative', fontFamily: 'var(--osd-font-body)' }}><Eyebrow>SolarGuard Operations</Eyebrow><h1 style={{ fontSize: 164, margin: '120px 0 32px', letterSpacing: '-0.06em' }}>SolarGuard.</h1><p style={{ fontSize: 48 }}>Estimasi output untuk prioritas inspeksi</p><Footer source="Pratinjau tema" /></section>;
const Content: Page = () => <section style={{ width: '100%', height: '100%', background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '72px 96px', boxSizing: 'border-box', position: 'relative', fontFamily: 'var(--osd-font-body)' }}><Eyebrow>Hasil analisis</Eyebrow><Title>Galat relatif Plant 2 lebih tinggi</Title><div style={{ borderTop: '4px solid #D68A12', marginTop: 120, paddingTop: 32 }}><div style={{ fontSize: 110, color: '#167A52' }}>23,08%</div><p style={{ fontSize: 36 }}>MAE terhadap rata-rata development Plant 2</p><p style={{ fontSize: 28, color: muted }}>Setiap angka menyebut pembanding, subset, dan sumber.</p></div><Footer source="Pratinjau tema · final_test_by_plant.csv" /></section>;
export default [Cover, Content] satisfies Page[];
