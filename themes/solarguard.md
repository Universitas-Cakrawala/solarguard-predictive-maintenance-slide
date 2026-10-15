---
name: SolarGuard Operations
description: Laporan operasi pembangkit surya dengan palet eco-green, grafik dominan, dan aksen amber matahari.
mode: light
---

# SolarGuard Operations

## Palette

| Role | Value | Notes |
|---|---|---|
| bg | `#F3F7F1` | Hijau kabut yang ringan untuk latar |
| text | `#12352B` | Forest gelap untuk struktur dan teks utama |
| accent | `#D68A12` | Amber matahari untuk sorotan energi |
| muted | `#4B665A` | Narasi sekunder |
| green | `#167A52` | Data utama dan aksi operasional |
| line | `#D5E3D9` | Pemisah hijau pucat |
| warning | `#B34A3C` | Risiko atau hasil memburuk |

## Typography

- Display dan body: `Arial, sans-serif`, lokal tanpa jaringan.
- Hero 164 px, judul halaman 72 px, isi 36 px, rincian 28–30 px, sumber 22–24 px.
- Judul 800, isi 400–500, jarak baris judul 1,12 dan isi 1,45.

## Layout

- Kanvas 1920 × 1080, margin horizontal 96 px, atas 72 px, footer bawah 40 px.
- Override eksplisit dari default skill: margin mengikuti PLAN_SLIDE.md.
- Komposisi editorial rata kiri. Grafik memperoleh bidang utama, tanpa kartu dekoratif.

## Fixed components

### Title

```tsx
const Title = ({ children }: { children: ReactNode }) => <h1 style={{ fontFamily: 'var(--osd-font-display)', fontSize: 72, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.025em', margin: 0 }}>{children}</h1>;
```

### Footer

```tsx
const Footer = ({ source = 'SolarGuard.ipynb · snapshot 14 Oktober 2026' }: { source?: string }) => {
  const { current, total } = useSlidePageNumber();
  return <footer style={{ position: 'absolute', left: 96, right: 96, bottom: 40, paddingTop: 18, borderTop: `1px solid ${line}`, display: 'flex', justifyContent: 'space-between', gap: 24, color: muted, fontSize: 22 }}><span>SolarGuard · Kelompok 7</span><span>{source}</span><span>{String(current).padStart(2, '0')} / {total}</span></footer>;
};
```

### Eyebrow

```tsx
const Eyebrow = ({ children }: { children: ReactNode }) => <div style={{ fontSize: 24, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--osd-accent)', marginBottom: 24, fontWeight: 700 }}>{children}</div>;
```

## Motion

Statis. Seluruh bukti terlihat langsung dan tetap lengkap pada PDF.

## Aesthetic

Editorial green energy untuk operasi pembangkit: garis pemisah hijau halus, bidang grafik
putih, angka yang memiliki konteks dan sumber. Gunakan hijau sebagai sinyal sistem sehat
dan amber sebagai energi matahari/hal yang perlu diperhatikan. Tanpa neon, gradasi, efek
kaca, ikon AI, bayangan besar, atau kumpulan kartu membulat. Setiap judul menyebut topik
atau temuan terukur.

## Example usage

```tsx
const Content: Page = () => <section style={{ width: '100%', height: '100%', background: 'var(--osd-bg)', color: 'var(--osd-text)', padding: '72px 96px', boxSizing: 'border-box', position: 'relative', fontFamily: 'var(--osd-font-body)' }}><Eyebrow>Hasil analisis</Eyebrow><Title>Galat relatif Plant 2 lebih tinggi</Title><Footer /></section>;
```
