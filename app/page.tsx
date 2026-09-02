'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, CalendarDays, ChevronRight, Church, Headphones, ListMusic, Music2, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const celebrations = [
  { date: '08.12.2026', weekday: 'Thứ Ba', title: 'Đức Mẹ Vô Nhiễm Nguyên Tội', rank: 'Lễ Trọng', color: 'Trắng', season: 'Mùa Vọng', readings: [['Bài đọc I', 'St 3, 9-15.20', 'Ta sẽ đặt mối thù giữa mi và người phụ nữ.'], ['Đáp ca', 'Tv 97', 'Hát lên mừng Chúa một bài ca mới.'], ['Bài đọc II', 'Ep 1, 3-6.11-12', 'Trong Đức Kitô, Người đã chọn ta trước cả khi tạo thành vũ trụ.'], ['Tin Mừng', 'Lc 1, 26-38', 'Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà.']], songs: [['Ca nhập lễ', 'Kính chào Bà đầy ơn phúc', 'Lm. Kim Long', 'Dâng lễ'], ['Dâng lễ', 'Mẹ tinh tuyền', 'Mi Trầm', 'Cộng đoàn'], ['Hiệp lễ', 'Linh hồn tôi ngợi khen Chúa', 'Phanxicô', 'Hợp xướng'], ['Kết lễ', 'Mẹ Maria đẹp tươi', 'Hải Linh', 'Cộng đoàn']] },
  { date: '13.12.2026', weekday: 'Chúa Nhật', title: 'Chúa Nhật III Mùa Vọng – Năm A', rank: 'Chúa Nhật', color: 'Hồng', season: 'Mùa Vọng', readings: [], songs: [] },
  { date: '25.12.2026', weekday: 'Thứ Sáu', title: 'Đại Lễ Chúa Giáng Sinh', rank: 'Lễ Trọng', color: 'Trắng', season: 'Giáng Sinh', readings: [], songs: [] },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'readings' | 'music'>('readings');
  const [records, setRecords] = useState(celebrations);

  useEffect(() => {
    fetch('/api/celebrations')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ records: databaseRecords }) => {
        if (!databaseRecords?.length) return;
        setRecords(databaseRecords.map((record: { celebrationDate: string; title: string; rank: string; color: string; season: string; readings: Array<{ kind: string; citation: string; excerpt: string }>; hymns: Array<{ liturgicalPart: string; title: string; composer: string | null; format: string | null }> }) => ({
          date: record.celebrationDate.split('-').reverse().join('.'), weekday: '', title: record.title, rank: record.rank,
          color: record.color, season: record.season,
          readings: record.readings.map((reading) => [reading.kind, reading.citation, reading.excerpt]),
          songs: record.hymns.map((hymn) => [hymn.liturgicalPart, hymn.title, hymn.composer ?? '', hymn.format ?? '']),
        })));
      })
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => records.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [query, records]);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-[color:var(--navy)]/10 bg-[color:var(--paper)]/95"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
        <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[color:var(--navy)] text-white shadow-sm"><Church className="size-5" /></span><div><p className="font-heading text-[17px] font-semibold leading-tight text-[color:var(--navy)]">Thánh Ca &amp; Lời Chúa</p><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[color:var(--gold)]">Thư viện phụng vụ</p></div></div>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[color:var(--navy)]/70 md:flex"><a className="text-[color:var(--navy)]" href="#lich">Lịch phụng vụ</a><a href="#baidoc">Bài đọc</a><a href="#thanhnhac">Thánh nhạc</a></nav>
        <Button variant="outline" className="h-9 border-[color:var(--navy)]/15 bg-white px-4 text-[color:var(--navy)]">Đóng góp dữ liệu</Button>
      </div></header>
      <section id="lich" className="border-b border-[color:var(--navy)]/10 bg-[color:var(--paper)]"><div className="mx-auto max-w-[1440px] px-5 py-8 lg:px-10 lg:py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[color:var(--gold)]"><Sparkles className="size-3.5" /> Năm phụng vụ 2026 · Năm A</p><h1 className="font-heading text-3xl font-semibold tracking-tight text-[color:var(--navy)] sm:text-4xl">Tra cứu Lịch Phụng Vụ</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink-muted)]">Bài đọc và thánh ca được sắp xếp theo từng Chúa Nhật, lễ trọng và mùa phụng vụ.</p></div><p className="flex items-center gap-2 text-sm font-medium text-[color:var(--navy)]/65"><CalendarDays className="size-4 text-[color:var(--gold)]" /> Cập nhật đến tháng 12.2026</p></div>
        <div className="grid gap-3 rounded-2xl border border-[color:var(--navy)]/10 bg-white p-3 shadow-[0_12px_40px_rgba(25,46,62,.06)] md:grid-cols-[minmax(240px,1fr)_180px_180px_140px]">
          <label className="relative"><span className="sr-only">Tìm theo tên lễ hoặc câu Kinh Thánh</span><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--ink-muted)]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên lễ, bài đọc, thánh ca…" className="h-11 border-0 bg-[color:var(--cream)] pl-10 shadow-none focus-visible:ring-[color:var(--gold)]/30" /></label>
          <NativeSelect className="w-full [&>select]:h-11 [&>select]:rounded-xl"><NativeSelectOption>Mùa phụng vụ</NativeSelectOption><NativeSelectOption>Mùa Vọng</NativeSelectOption><NativeSelectOption>Giáng Sinh</NativeSelectOption></NativeSelect>
          <NativeSelect className="w-full [&>select]:h-11 [&>select]:rounded-xl"><NativeSelectOption>Bậc lễ</NativeSelectOption><NativeSelectOption>Chúa Nhật</NativeSelectOption><NativeSelectOption>Lễ Trọng</NativeSelectOption></NativeSelect>
          <Button className="h-11 bg-[color:var(--navy)] text-white hover:bg-[color:var(--navy)]/90">Tra cứu <ChevronRight /></Button>
        </div>
      </div></section>
      <section className="mx-auto grid max-w-[1440px] gap-7 px-5 py-7 lg:grid-cols-[340px_minmax(0,1fr)] lg:px-10">
        <aside><div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-lg font-semibold text-[color:var(--navy)]">Ngày lễ sắp tới</h2><span className="text-xs text-[color:var(--ink-muted)]">{filtered.length} kết quả</span></div><div className="space-y-2">{filtered.map((item, index) => <button key={item.date} className={`w-full rounded-xl border p-4 text-left transition ${index === 0 ? 'border-[color:var(--gold)]/45 bg-white shadow-[0_8px_28px_rgba(25,46,62,.07)]' : 'border-transparent bg-transparent hover:bg-white'}`}><div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-[color:var(--gold)]">{item.date}</span><span className="rounded-full bg-[color:var(--cream)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--navy)]/65">{item.rank}</span></div><h3 className="font-heading text-[17px] font-semibold leading-snug text-[color:var(--navy)]">{item.title}</h3><p className="mt-2 text-xs text-[color:var(--ink-muted)]">{item.weekday} · {item.season} · Màu {item.color}</p></button>)}</div></aside>
        <article className="overflow-hidden rounded-2xl border border-[color:var(--navy)]/10 bg-white shadow-[0_18px_60px_rgba(25,46,62,.07)]">
          <div className="border-b border-[color:var(--navy)]/10 bg-[color:var(--navy)] px-6 py-7 text-white sm:px-8"><div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#e3bd72]"><span>08 tháng 12, 2026</span><span className="size-1 rounded-full bg-white/30" /><span>Lễ Trọng</span><span className="size-1 rounded-full bg-white/30" /><span>Màu trắng</span></div><h2 className="font-heading text-2xl font-semibold sm:text-3xl">Đức Mẹ Vô Nhiễm Nguyên Tội</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">“Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà.”</p></div>
          <div className="flex border-b border-[color:var(--navy)]/10 px-5 sm:px-8"><button onClick={() => setActiveTab('readings')} className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm font-semibold ${activeTab === 'readings' ? 'border-[color:var(--gold)] text-[color:var(--navy)]' : 'border-transparent text-[color:var(--ink-muted)]'}`}><BookOpenText className="size-4" /> Bài đọc trong Thánh lễ</button><button onClick={() => setActiveTab('music')} className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm font-semibold ${activeTab === 'music' ? 'border-[color:var(--gold)] text-[color:var(--navy)]' : 'border-transparent text-[color:var(--ink-muted)]'}`}><Music2 className="size-4" /> Gợi ý thánh ca</button></div>
          {activeTab === 'readings' ? <div id="baidoc" className="grid divide-y divide-[color:var(--navy)]/10 p-6 sm:p-8">{celebrations[0].readings.map(([label, cite, excerpt], index) => <div key={label} className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[120px_1fr]"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-[color:var(--gold)]">{label}</span><p className="mt-1 font-heading text-lg font-semibold text-[color:var(--navy)]">{cite}</p></div><div><p className="text-sm leading-6 text-[color:var(--ink-muted)]">{excerpt}</p>{index === 1 && <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--navy)]"><Headphones className="size-3.5 text-[color:var(--gold)]" /> Nghe đáp ca mẫu</span>}</div></div>)}</div> : <div id="thanhnhac" className="p-6 sm:p-8"><div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[color:var(--cream)] text-[color:var(--gold)]"><ListMusic className="size-5" /></span><div><h3 className="font-heading text-lg font-semibold text-[color:var(--navy)]">Danh sách thánh ca đề nghị</h3><p className="text-xs text-[color:var(--ink-muted)]">Phù hợp chủ đề và từng phần Thánh lễ</p></div></div><div className="divide-y divide-[color:var(--navy)]/10">{celebrations[0].songs.map(([part, title, author, format]) => <div key={title} className="grid gap-2 py-4 sm:grid-cols-[110px_1fr_120px] sm:items-center"><span className="text-xs font-bold uppercase tracking-wide text-[color:var(--gold)]">{part}</span><div><p className="font-semibold text-[color:var(--navy)]">{title}</p><p className="text-xs text-[color:var(--ink-muted)]">{author}</p></div><span className="w-fit rounded-full bg-[color:var(--cream)] px-2.5 py-1 text-[11px] text-[color:var(--navy)]/70">{format}</span></div>)}</div></div>}
        </article>
      </section>
    </main>
  );
}
