'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, CalendarDays, ChevronLeft, ChevronRight, Church, Headphones, ListMusic, Music2, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const celebrations = [
  { date: '08.12.2026', weekday: 'Thứ Ba', title: 'Đức Mẹ Vô Nhiễm Nguyên Tội', rank: 'Lễ Trọng', color: 'Trắng', season: 'Mùa Vọng', readings: [['Bài đọc I', 'St 3, 9-15.20', 'Ta sẽ đặt mối thù giữa mi và người phụ nữ.'], ['Đáp ca', 'Tv 97', 'Hát lên mừng Chúa một bài ca mới.'], ['Bài đọc II', 'Ep 1, 3-6.11-12', 'Trong Đức Kitô, Người đã chọn ta trước cả khi tạo thành vũ trụ.'], ['Tin Mừng', 'Lc 1, 26-38', 'Mừng vui lên, hỡi Đấng đầy ân sủng, Đức Chúa ở cùng bà.']], songs: [['Ca nhập lễ', 'Kính chào Bà đầy ơn phúc', 'Lm. Kim Long', 'Dâng lễ'], ['Dâng lễ', 'Mẹ tinh tuyền', 'Mi Trầm', 'Cộng đoàn'], ['Hiệp lễ', 'Linh hồn tôi ngợi khen Chúa', 'Phanxicô', 'Hợp xướng'], ['Kết lễ', 'Mẹ Maria đẹp tươi', 'Hải Linh', 'Cộng đoàn']] },
  { date: '13.12.2026', weekday: 'Chúa Nhật', title: 'Chúa Nhật III Mùa Vọng – Năm A', rank: 'Chúa Nhật', color: 'Hồng', season: 'Mùa Vọng', readings: [], songs: [] },
  { date: '25.12.2026', weekday: 'Thứ Sáu', title: 'Đại Lễ Chúa Giáng Sinh', rank: 'Lễ Trọng', color: 'Trắng', season: 'Giáng Sinh', readings: [], songs: [] },
];

const pad = (value: number) => String(value).padStart(2, '0');
const dateKey = (date: Date) => `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
const parseDateKey = (value: string) => {
  const [day, month, year] = value.split('.').map(Number);
  return new Date(year, month - 1, day);
};
const monthLabel = new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' });

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'readings' | 'music'>('readings');
  const [records, setRecords] = useState(celebrations);
  const [selectedDate, setSelectedDate] = useState(celebrations[0].date);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const date = parseDateKey(celebrations[0].date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  useEffect(() => {
    fetch('/api/celebrations')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ records: databaseRecords }) => {
        if (!databaseRecords?.length) return;
        const nextRecords = databaseRecords.map((record: { celebrationDate: string; title: string; rank: string; color: string; season: string; readings: Array<{ kind: string; citation: string; excerpt: string }>; hymns: Array<{ liturgicalPart: string; title: string; composer: string | null; format: string | null }> }) => ({
          date: record.celebrationDate.split('-').reverse().join('.'), weekday: '', title: record.title, rank: record.rank,
          color: record.color, season: record.season,
          readings: record.readings.map((reading) => [reading.kind, reading.citation, reading.excerpt]),
          songs: record.hymns.map((hymn) => [hymn.liturgicalPart, hymn.title, hymn.composer ?? '', hymn.format ?? '']),
        }));
        setRecords(nextRecords);
        setSelectedDate(nextRecords[0]?.date ?? celebrations[0].date);
        if (nextRecords[0]) {
          const firstDate = parseDateKey(nextRecords[0].date);
          setCalendarMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
        }
      })
      .catch(() => undefined);
  }, []);

  const filtered = useMemo(() => records.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [query, records]);
  const selected = records.find((item) => item.date === selectedDate) ?? filtered[0] ?? records[0];
  const monthCells = useMemo(() => {
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    return Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, index) => {
      const day = index - offset + 1;
      return day < 1 || day > daysInMonth ? null : new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day);
    });
  }, [calendarMonth]);
  const monthRecordDates = useMemo(() => new Set(records.map((record) => record.date)), [records]);
  const weekRecords = useMemo(() => {
    const start = parseDateKey(selectedDate);
    const monday = new Date(start);
    monday.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return records.filter((record) => {
      const date = parseDateKey(record.date);
      return date >= monday && date <= sunday;
    }).slice(0, 7);
  }, [records, selectedDate]);
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
        <aside>
          <div className="mb-5 rounded-2xl border border-[color:var(--navy)]/10 bg-white p-4 shadow-[0_8px_28px_rgba(25,46,62,.05)]">
            <div className="mb-3 flex items-center justify-between"><button aria-label="Tháng trước" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-8 place-items-center rounded-full text-[color:var(--navy)]/60 hover:bg-[color:var(--cream)]"><ChevronLeft className="size-4" /></button><h2 className="font-heading text-base font-semibold capitalize text-[color:var(--navy)]">{monthLabel.format(calendarMonth)}</h2><button aria-label="Tháng sau" onClick={() => setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-8 place-items-center rounded-full text-[color:var(--navy)]/60 hover:bg-[color:var(--cream)]"><ChevronRight className="size-4" /></button></div>
            <div className="grid grid-cols-7 text-center text-[10px] font-bold uppercase tracking-wide text-[color:var(--ink-muted)]"><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span></div>
            <div className="mt-2 grid grid-cols-7 gap-1">{monthCells.map((date, index) => date ? <button key={date.toISOString()} onClick={() => { setSelectedDate(dateKey(date)); setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1)); }} className={`relative grid aspect-square place-items-center rounded-lg text-xs transition ${dateKey(date) === selected.date ? 'bg-[color:var(--navy)] font-bold text-white' : 'text-[color:var(--navy)] hover:bg-[color:var(--cream)]'}`}>{date.getDate()}{monthRecordDates.has(dateKey(date)) && dateKey(date) !== selected.date && <span className="absolute bottom-1 size-1 rounded-full bg-[color:var(--gold)]" />}</button> : <span key={`empty-${index}`} />)}</div>
          </div>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-lg font-semibold text-[color:var(--navy)]">Lịch trong tuần</h2><span className="text-xs text-[color:var(--ink-muted)]">đến Chúa Nhật</span></div>
          <div className="mb-6 space-y-2">{weekRecords.length ? weekRecords.map((item) => <button key={`week-${item.date}`} onClick={() => setSelectedDate(item.date)} className={`w-full rounded-xl border p-3 text-left transition ${item.date === selected.date ? 'border-[color:var(--gold)]/45 bg-white shadow-[0_8px_28px_rgba(25,46,62,.07)]' : 'border-transparent bg-transparent hover:bg-white'}`}><div className="flex items-center gap-3"><span className="w-16 shrink-0 text-xs font-bold text-[color:var(--gold)]">{item.date}</span><span className="line-clamp-2 font-heading text-sm font-semibold text-[color:var(--navy)]">{item.title}</span></div></button>) : <p className="rounded-xl bg-white p-4 text-sm text-[color:var(--ink-muted)]">Chưa có ngày lễ trong tuần này.</p>}</div>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-lg font-semibold text-[color:var(--navy)]">Ngày lễ sắp tới</h2><span className="text-xs text-[color:var(--ink-muted)]">{filtered.length} kết quả</span></div><div className="space-y-2">{filtered.map((item) => <button key={item.date} onClick={() => setSelectedDate(item.date)} className={`w-full rounded-xl border p-4 text-left transition ${item.date === selected.date ? 'border-[color:var(--gold)]/45 bg-white shadow-[0_8px_28px_rgba(25,46,62,.07)]' : 'border-transparent bg-transparent hover:bg-white'}`}><div className="mb-2 flex items-center justify-between"><span className="text-xs font-bold text-[color:var(--gold)]">{item.date}</span><span className="rounded-full bg-[color:var(--cream)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--navy)]/65">{item.rank}</span></div><h3 className="font-heading text-[17px] font-semibold leading-snug text-[color:var(--navy)]">{item.title}</h3><p className="mt-2 text-xs text-[color:var(--ink-muted)]">{item.weekday} · {item.season} · Màu {item.color}</p></button>)}</div>
        </aside>
        <article className="overflow-hidden rounded-2xl border border-[color:var(--navy)]/10 bg-white shadow-[0_18px_60px_rgba(25,46,62,.07)]">
          <div className="border-b border-[color:var(--navy)]/10 bg-[color:var(--navy)] px-6 py-7 text-white sm:px-8"><div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[.15em] text-[#e3bd72]"><span>{selected.date}</span><span className="size-1 rounded-full bg-white/30" /><span>{selected.rank}</span><span className="size-1 rounded-full bg-white/30" /><span>Màu {selected.color.toLowerCase()}</span></div><h2 className="font-heading text-2xl font-semibold sm:text-3xl">{selected.title}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">{selected.season}</p></div>
          <div className="flex border-b border-[color:var(--navy)]/10 px-5 sm:px-8"><button onClick={() => setActiveTab('readings')} className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm font-semibold ${activeTab === 'readings' ? 'border-[color:var(--gold)] text-[color:var(--navy)]' : 'border-transparent text-[color:var(--ink-muted)]'}`}><BookOpenText className="size-4" /> Bài đọc trong Thánh lễ</button><button onClick={() => setActiveTab('music')} className={`flex items-center gap-2 border-b-2 px-3 py-4 text-sm font-semibold ${activeTab === 'music' ? 'border-[color:var(--gold)] text-[color:var(--navy)]' : 'border-transparent text-[color:var(--ink-muted)]'}`}><Music2 className="size-4" /> Gợi ý thánh ca</button></div>
          {activeTab === 'readings' ? <div id="baidoc" className="grid divide-y divide-[color:var(--navy)]/10 p-6 sm:p-8">{selected.readings.length ? selected.readings.map(([label, cite, excerpt], index) => <div key={`${label}-${cite}`} className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[120px_1fr]"><div><span className="text-[10px] font-bold uppercase tracking-[.16em] text-[color:var(--gold)]">{label}</span><p className="mt-1 font-heading text-lg font-semibold text-[color:var(--navy)]">{cite}</p></div><div><p className="text-sm leading-6 text-[color:var(--ink-muted)]">{excerpt}</p>{index === 1 && <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[color:var(--navy)]"><Headphones className="size-3.5 text-[color:var(--gold)]" /> Nghe đáp ca mẫu</span>}</div></div>) : <p className="text-sm text-[color:var(--ink-muted)]">Chưa có trích dẫn cho ngày này.</p>}</div> : <div id="thanhnhac" className="p-6 sm:p-8"><div className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[color:var(--cream)] text-[color:var(--gold)]"><ListMusic className="size-5" /></span><div><h3 className="font-heading text-lg font-semibold text-[color:var(--navy)]">Danh sách thánh ca đề nghị</h3><p className="text-xs text-[color:var(--ink-muted)]">Phù hợp chủ đề và từng phần Thánh lễ</p></div></div><div className="divide-y divide-[color:var(--navy)]/10">{selected.songs.length ? selected.songs.map(([part, title, author, format]) => <div key={`${part}-${title}`} className="grid gap-2 py-4 sm:grid-cols-[110px_1fr_120px] sm:items-center"><span className="text-xs font-bold uppercase tracking-wide text-[color:var(--gold)]">{part}</span><div><p className="font-semibold text-[color:var(--navy)]">{title}</p><p className="text-xs text-[color:var(--ink-muted)]">{author}</p></div><span className="w-fit rounded-full bg-[color:var(--cream)] px-2.5 py-1 text-[11px] text-[color:var(--navy)]/70">{format}</span></div>) : <p className="text-sm text-[color:var(--ink-muted)]">Chưa có gợi ý thánh ca cho ngày này.</p>}</div></div>}
        </article>
      </section>
    </main>
  );
}

