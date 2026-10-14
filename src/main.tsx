import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

type Resource = { title: string; url: string; kind: 'Meditation' | 'Chant' | 'Teaching' | 'Music' };
type CheckIn = { date: string; score: number; note: string };
type Gratitude = { createdAt: string; grateful: string; bothering: string; tomorrow: string };

const resources: Resource[] = [
  { title: 'Patriji meditation', url: 'https://www.youtube.com/watch?v=y6lFq2x6YbE&t=902s', kind: 'Meditation' },
  { title: 'Rama Strotram', url: 'https://www.youtube.com/watch?v=EYklDvwF7z8', kind: 'Chant' },
  { title: 'Namo Bhagavate Vasudevaya', url: 'https://www.youtube.com/watch?v=-ZOgFda3RZk', kind: 'Chant' },
  { title: 'Gita in Telugu', url: 'https://youtu.be/Mmxfv-3zC20?si=6Ik5jr23z3CWAhiA', kind: 'Teaching' },
  { title: 'High Cortisol: calm your system', url: 'https://www.youtube.com/watch?v=MFh-JOXoM4c&t=221s', kind: 'Teaching' },
  { title: 'Who am I?', url: 'https://www.youtube.com/watch?v=uceEWndPT1I', kind: 'Teaching' },
  { title: 'Chant Hindu slokas', url: 'https://youtu.be/OiWwlJstcvM?si=AzPWXRUMXyx9sOoX', kind: 'Chant' },
  { title: 'Classical music', url: 'https://youtu.be/Fnzn-3oXEUI?si=6lJGwpwGuJT_LtK2', kind: 'Music' },
  { title: 'Garikapati pravachanam', url: 'https://youtu.be/K1aZMoFvKBE?si=BdcKDvdWpQuJnbws', kind: 'Teaching' }
];

const tasks = ['Wake up and read a book', 'Get melatonin', 'Choose a calming resource', 'Write your gratitude list'];
const key = { tasks: 'gbts-tasks', scores: 'gbts-scores', gratitude: 'gbts-gratitude' };
const date = () => new Date().toISOString().slice(0, 10);
const read = <T,>(name: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(name) ?? '') as T; } catch { return fallback; }
};
const youtubeId = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
  } catch { return null; }
};

function App() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => read(key.tasks, {}));
  const [scores, setScores] = useState<CheckIn[]>(() => read(key.scores, []));
  const [gratitude, setGratitude] = useState<Gratitude[]>(() => read(key.gratitude, []));
  const [active, setActive] = useState<Resource | null>(null);
  const [morningOpen, setMorningOpen] = useState(() => !read<CheckIn[]>(key.scores, []).some(item => item.date === date()));
  const [score, setScore] = useState(4);
  const [note, setNote] = useState('');
  const [form, setForm] = useState({ grateful: '', bothering: '', tomorrow: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => localStorage.setItem(key.tasks, JSON.stringify(completed)), [completed]);
  useEffect(() => localStorage.setItem(key.scores, JSON.stringify(scores)), [scores]);
  useEffect(() => localStorage.setItem(key.gratitude, JSON.stringify(gratitude)), [gratitude]);

  const progress = useMemo(() => Math.round((Object.values(completed).filter(Boolean).length / tasks.length) * 100), [completed]);
  const play = (resource: Resource) => setActive(resource);
  const saveCheckIn = () => {
    setScores(previous => [{ date: date(), score, note }, ...previous.filter(item => item.date !== date())]);
    setMorningOpen(false);
  };
  const saveGratitude = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.grateful || !form.bothering || !form.tomorrow) return;
    setGratitude(previous => [{ createdAt: new Date().toISOString(), ...form }, ...previous]);
    setForm({ grateful: '', bothering: '', tomorrow: '' });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };
  const video = active ? youtubeId(active.url) : null;

  return <main>
    <header>
      <div><p className="eyebrow">YOUR EVENING SANCTUARY</p><h1>Go back to sleep.</h1></div>
      <button className="soft" onClick={() => setMorningOpen(true)}>Morning check-in</button>
    </header>

    <section className="hero">
      <div><p className="eyebrow">A GENTLER NIGHT</p><h2>Slow down. Rest well.<br />Begin again.</h2><p>Small rituals to settle your mind tonight and meet tomorrow with intention.</p></div>
      <div className="moon" aria-hidden="true">☾</div>
    </section>

    <section className="progress card">
      <div><p className="eyebrow">TODAY’S RHYTHM</p><h3>{progress}% complete</h3></div>
      <div className="bar"><span style={{ width: `${progress}%` }} /></div>
      <p>{Object.values(completed).filter(Boolean).length} of {tasks.length} rituals complete</p>
    </section>

    <section><div className="section-title"><div><p className="eyebrow">SIMPLE ACTIONS</p><h2>Your gentle plan</h2></div></div>
      <div className="tasks">{tasks.map(task => <button key={task} className={`task ${completed[task] ? 'done' : ''}`} onClick={() => setCompleted(items => ({ ...items, [task]: !items[task] }))}>
        <span className="check">{completed[task] ? '✓' : ''}</span><span>{task}</span><span className="toggle">{completed[task] ? 'Done' : 'Mark done'}</span>
      </button>)}</div>
    </section>

    <section><p className="eyebrow">LISTEN OR WATCH</p><h2>Choose what feels right</h2><p className="hint">Videos play here in a repeating loop. You can also open YouTube in a new tab.</p>
      <div className="resources">{resources.map(resource => <article className="resource" key={resource.title}>
        <span className="tag">{resource.kind}</span><h3>{resource.title}</h3>
        <div><button onClick={() => play(resource)}>Play in app</button><a href={resource.url} target="_blank" rel="noreferrer">Open ↗</a></div>
      </article>)}</div>
    </section>

    <section className="journal card"><div><p className="eyebrow">BEFORE BED</p><h2>Three quiet questions</h2><p>Your entries stay privately on this device with their date and time.</p></div>
      <form onSubmit={saveGratitude}>
        <label>What are you grateful for?<textarea required value={form.grateful} onChange={e => setForm({ ...form, grateful: e.target.value })} /></label>
        <label>What is bothering you that you want to write down?<textarea required value={form.bothering} onChange={e => setForm({ ...form, bothering: e.target.value })} /></label>
        <label>What challenge do you want to handle tomorrow?<textarea required value={form.tomorrow} onChange={e => setForm({ ...form, tomorrow: e.target.value })} /></label>
        <button className="primary">Save tonight’s reflection</button>{saved && <span className="saved">Saved with a timestamp.</span>}
      </form>
      {gratitude[0] && <p className="latest">Last reflection: {new Date(gratitude[0].createdAt).toLocaleString()}</p>}
    </section>

    {active && <div className="overlay" role="dialog" aria-modal="true" aria-label="Now playing"><div className="player"><button className="close" onClick={() => setActive(null)}>×</button><p className="eyebrow">NOW PLAYING · LOOP ON</p><h2>{active.title}</h2>
      {video ? <iframe src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&loop=1&playlist=${video}&rel=0`} title={active.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <a href={active.url}>Open this resource</a>}
    </div></div>}
    {morningOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="Morning check-in"><div className="modal"><button className="close" onClick={() => setMorningOpen(false)}>×</button><p className="eyebrow">GOOD MORNING</p><h2>How did last night go?</h2><p>Give your rest a score, just for you.</p><div className="score">{[1, 2, 3, 4, 5].map(value => <button className={score === value ? 'selected' : ''} onClick={() => setScore(value)} key={value}>{value}</button>)}</div>
      <label>A note, if you’d like<textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What helped? What would you change?" /></label><button className="primary" onClick={saveCheckIn}>Save check-in</button>
    </div></div>}
  </main>;
}

createRoot(document.getElementById('root')!).render(<App />);
