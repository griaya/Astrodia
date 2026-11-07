import { useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import solProfiles from '../data/sol.json';
import lunaProfiles from '../data/luna.json';
import ascProfiles from '../data/ascendente.json';
import combinations from '../data/combinaciones.json';
import { locations } from './data/lugaresArgentina';
import { calculateSigns } from './utils/astrology';
import { getCombinationInsights } from './utils/insights';
import { calculateSignsSwiss } from './utils/swissAstrology';

const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

const signOrder = ['ARIES', 'TAURO', 'GEMINIS', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'ESCORPIO', 'SAGITARIO', 'CAPRICORNIO', 'ACUARIO', 'PISCIS'];
const signNames = { ARIES: 'Aries', TAURO: 'Tauro', GEMINIS: 'Géminis', CANCER: 'Cáncer', LEO: 'Leo', VIRGO: 'Virgo', LIBRA: 'Libra', ESCORPIO: 'Escorpio', SAGITARIO: 'Sagitario', CAPRICORNIO: 'Capricornio', ACUARIO: 'Acuario', PISCIS: 'Piscis' };
const formatVisitorName = (value) => {
  const cleanName = value.trim().toLocaleLowerCase('es-AR');
  return cleanName ? `${cleanName.charAt(0).toLocaleUpperCase('es-AR')}${cleanName.slice(1)}` : '';
};
const resultById = new Map(combinations.map((item) => [item.id, item]));

function Header() {
  const location = useLocation();
  return <header id="top" className="site-header">
    <Link className="brand" to="/"><span className="brand-star">✦</span> Astrodia</Link>
    <nav aria-label="Navegación principal">
      <Link className={location.pathname === '/' ? 'active' : ''} to="/">Inicio</Link>
      <Link className={location.pathname.startsWith('/perfiles') ? 'active' : ''} to="/perfiles">Perfiles Astrales</Link>
      <Link className={location.pathname === '/acerca-de' ? 'active' : ''} to="/acerca-de">Acerca de</Link>
    </nav>
  </header>;
}

function Home() {
  return <main>
    <section className="hero">
      <img src={asset('/img/Astrodia_inicio.png')} alt="Ilustración principal de Astrodia" />
    </section>
    <section className="welcome">
      <h1>¡Te damos la bienvenida!</h1>
      <p>Descubrí tus secretos más profundos<br />... si te atrevés ...</p>
    </section>
    <section className="choice-grid page-width">
      <ChoiceCard icon={<span className="triple-icons" aria-hidden="true"><span>☼</span><span>☾</span><span>↑</span></span>} title="Ya conozco mis signos" text="Seleccioná tu signo solar, lunar y ascendente y obtené una interpretación breve de tu personalidad." to="/seleccionar" button="Elegir mis signos" />
      <ChoiceCard icon={<span className="calendar-icon" aria-hidden="true">▦</span>} title="No conozco mis signos" text="Completá tu fecha, hora y lugar de nacimiento y calcularemos tus tres signos." to="/calcular" button="Calcular mis signos" />
    </section>
  </main>;
}

function ChoiceCard({ icon, title, text, to, button }) {
  return <article className="choice-card"><div className="choice-icon">{icon}</div><h2>{title}</h2><p>{text}</p><Link className="button" to={to}>{button} <span>→</span></Link></article>;
}

function Footer() {
  return <footer className="site-footer"><BackToTop /><p>Todos los derechos reservados - © 2026 - Griselda Ayala</p></footer>;
}

function BackToTop() {
  return <a className="back-to-top" href="#top">↑ Volver arriba</a>;
}

const profileCards = [
  { key: 'sol', title: 'Sol', image: asset('/img/Sol.png'), intro: 'Tu motor, tu impulso y tu forma de brillar.', icon: '☼', details: ['Representa tu identidad y aquello que te da vitalidad.', 'Muestra cómo expresás tus talentos y tu creatividad.', 'Invita a reconocer tu valor sin depender de la aprobación ajena.'], profiles: solProfiles },
  { key: 'luna', title: 'Luna', image: asset('/img/LUNA.png'), intro: 'Tu refugio, tu sensibilidad y tu mundo íntimo.', icon: '☾', details: ['Habla de tu sensibilidad y de tus necesidades emocionales.', 'Muestra cómo buscás seguridad y contención en lo cotidiano.', 'Invita a escuchar lo que sentís y expresarlo con claridad.'], profiles: lunaProfiles },
  { key: 'ascendente', title: 'Ascendente', image: asset('/img/ascendente.png'), intro: 'Tu carta de presentación y la primera impresión que dejás.', icon: '↑', details: ['Describe la manera en que te acercás al mundo.', 'Muestra tu reacción inicial frente a las situaciones nuevas.', 'Invita a desarrollar una forma auténtica de vincularte.'], profiles: ascProfiles },
];

function Profiles() {
  const [selected, setSelected] = useState(null);
  return <main className="page-width page-section"><div className="section-heading"><p className="eyebrow">Conocé cada energía</p><h1>Perfiles astrales</h1><p>El Sol, la Luna y el Ascendente cuentan distintas partes de tu experiencia.</p></div>
    <div className="profile-grid">{profileCards.map((card) => <article className={`profile-card ${selected === card.key ? 'selected' : ''}`} key={card.key} onClick={() => setSelected(selected === card.key ? null : card.key)} tabIndex="0" onKeyDown={(event) => event.key === 'Enter' && setSelected(selected === card.key ? null : card.key)}>
      <h2>{card.title}</h2><img src={card.image} alt={card.title} loading="lazy" /><p>{card.intro}</p><span className="card-hint">{selected === card.key ? 'Ocultar información' : 'Ver información'}</span>{selected === card.key && <div className="profile-detail"><ul>{card.details.map((detail) => <li key={detail}><span className="detail-icon" aria-hidden="true">{card.icon}</span><span>{detail}</span></li>)}</ul></div>}
    </article>)}</div><BackToTop />
  </main>;
}

function About() {
  return <main className="page-width page-section narrow"><p className="eyebrow">Un espacio para explorar</p><h1>Sobre ASTRODIA</h1><div className="about-copy"><p><strong>ASTRODIA</strong> es un espacio creado para explorar el fascinante mundo de la astrología de una manera sencilla, cercana y entretenida.</p><p>Acá podés descubrir los signos del zodíaco, conocer qué representan el Sol, la Luna y el Ascendente, y explorar cómo se combinan para ofrecernos distintas miradas sobre nuestra forma de ser, sentir y relacionarnos.</p><p><strong>ASTRODIA</strong> es un sitio educativo y de entretenimiento. Su contenido tiene fines informativos y recreativos, y busca despertar tu curiosidad sin presentar las interpretaciones astrológicas como verdades científicas.</p></div><BackToTop /></main>;
}

function SignSelect({ label, value, onChange }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Seleccioná una opción</option>{signOrder.map((sign) => <option value={sign} key={sign}>{signNames[sign]}</option>)}</select></label>;
}

function ManualSelection() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', sol: '', luna: '', ascendente: '' });
  const complete = values.sol && values.luna && values.ascendente;
  return <main className="page-width page-section form-page"><Link className="back-link" to="/">← Nueva consulta</Link><p className="eyebrow">Elegí tus signos</p><h1>Contanos tu combinación</h1><p>Seleccioná una opción en cada lista para descubrir una interpretación integrada.</p><div className="form-card"><label className="field"><span>¿Cómo te llamás?</span><input type="text" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Tu nombre" maxLength="40" /></label><SignSelect label="Signo solar" value={values.sol} onChange={(value) => setValues({ ...values, sol: value })} /><SignSelect label="Signo lunar" value={values.luna} onChange={(value) => setValues({ ...values, luna: value })} /><SignSelect label="Ascendente" value={values.ascendente} onChange={(value) => setValues({ ...values, ascendente: value })} /><button className="button" disabled={!complete} onClick={() => navigate(`/resultado/${values.sol.toLowerCase()}-${values.luna.toLowerCase()}-${values.ascendente.toLowerCase()}${formatVisitorName(values.name) ? `?nombre=${encodeURIComponent(formatVisitorName(values.name))}` : ''}`)}>Ver mi combinación →</button></div></main>;
}

function CalculatePlaceholder() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', day: '', month: '', year: '', hour: '', minute: '', location: '' });
  const [error, setError] = useState('');
  const groupedLocations = useMemo(() => locations.reduce((groups, location) => { (groups[location.province] ??= []).push(location); return groups; }, {}), []);
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const years = Array.from({ length: 121 }, (_, index) => new Date().getFullYear() - index);
  const hours = Array.from({ length: 24 }, (_, index) => index);
  const minutes = Array.from({ length: 60 }, (_, index) => index);
  const locationKey = (location) => `${location.province}::${location.name}`;
  const submit = async (event) => {
    event.preventDefault();
    const place = locations.find((item) => locationKey(item) === values.location);
    if (!values.day || !values.month || !values.year || values.hour === '' || values.minute === '' || !place) { setError('Completá todos los campos para calcular tus signos.'); return; }
    const dateObject = new Date(Number(values.year), Number(values.month) - 1, Number(values.day));
    if (dateObject.getFullYear() !== Number(values.year) || dateObject.getMonth() !== Number(values.month) - 1 || dateObject.getDate() !== Number(values.day)) { setError('La fecha seleccionada no es válida. Revisá el día, el mes y el año.'); return; }
    try {
      const date = `${values.year}-${String(values.month).padStart(2, '0')}-${String(values.day).padStart(2, '0')}`;
      const time = `${String(values.hour).padStart(2, '0')}:${String(values.minute).padStart(2, '0')}`;
      const signs = await calculateSignsSwiss({ date, time, latitude: place.lat, longitude: place.lon, timeZone: place.timeZone ?? 'America/Argentina/Buenos_Aires' });
      const visitorName = formatVisitorName(values.name);
      const nameQuery = visitorName ? `?nombre=${encodeURIComponent(visitorName)}` : '';
      navigate(`/resultado/${signs.sol.toLowerCase()}-${signs.luna.toLowerCase()}-${signs.ascendente.toLowerCase()}${nameQuery}`);
    } catch { setError('No pudimos interpretar esos datos. Revisá la fecha y la hora.'); }
  };
  return <main className="page-width page-section form-page"><Link className="back-link" to="/">← Volver al inicio</Link><p className="eyebrow">Calculá tu combinación</p><h1>Datos de nacimiento</h1><p>Completá tu fecha, hora y lugar de nacimiento. El sistema contempla los cambios históricos de horario de Argentina.</p><form className="form-card" onSubmit={submit}><label className="field"><span>¿Cómo te llamás?</span><input type="text" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} placeholder="Tu nombre" maxLength="40" /></label><fieldset className="date-fields"><legend>Fecha de nacimiento</legend><label className="field"><span>Día</span><select value={values.day} onChange={(event) => setValues({ ...values, day: event.target.value })} required><option value="">Día</option>{days.map((day) => <option value={day} key={day}>{day}</option>)}</select></label><label className="field"><span>Mes</span><select value={values.month} onChange={(event) => setValues({ ...values, month: event.target.value })} required><option value="">Mes</option>{months.map((month, index) => <option value={index + 1} key={month}>{month}</option>)}</select></label><label className="field"><span>Año</span><select value={values.year} onChange={(event) => setValues({ ...values, year: event.target.value })} required><option value="">Año</option>{years.map((year) => <option value={year} key={year}>{year}</option>)}</select></label></fieldset><fieldset className="time-fields"><legend>Hora de nacimiento</legend><label className="field"><span>Hora</span><select value={values.hour} onChange={(event) => setValues({ ...values, hour: event.target.value })} required><option value="">Hora</option>{hours.map((hour) => <option value={hour} key={hour}>{String(hour).padStart(2, '0')}</option>)}</select></label><label className="field"><span>Minutos</span><select value={values.minute} onChange={(event) => setValues({ ...values, minute: event.target.value })} required><option value="">Minutos</option>{minutes.map((minute) => <option value={minute} key={minute}>{String(minute).padStart(2, '0')}</option>)}</select></label></fieldset><label className="field"><span>Lugar de nacimiento</span><select value={values.location} onChange={(event) => setValues({ ...values, location: event.target.value })} required><option value="">Elegí localidad</option>{Object.entries(groupedLocations).map(([province, provinceLocations]) => <optgroup label={province === 'CABA' ? 'CABA / Capital Federal' : province} key={province}>{provinceLocations.map((location) => <option value={locationKey(location)} key={locationKey(location)}>{location.name}</option>)}</optgroup>)}</select></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" type="submit">Calcular mis signos →</button></form></main>;
}

function Result() {
  const { id } = useParams();
  const query = new URLSearchParams(window.location.search);
  const name = query.get('nombre')?.trim();
  const result = resultById.get(id);
  const profileData = result ? { sol: solProfiles[result.sol], luna: lunaProfiles[result.luna], ascendente: ascProfiles[result.ascendente] } : null;
  if (!result) return <main className="page-width page-section"><h1>Combinación no encontrada</h1><Link className="button" to="/seleccionar">Volver a seleccionar</Link></main>;
  const cards = [{ key: 'sol', label: `Sol en ${signNames[result.sol]}`, image: asset(`/img/${result.sol === 'CANCER' ? 'CANCER' : result.sol}.png`), text: profileData.sol?.sections?.['Tu motor vital'] }, { key: 'luna', label: `Luna en ${signNames[result.luna]}`, image: asset(`/img/${result.luna === 'CANCER' ? 'CANCER' : result.luna}.png`), text: profileData.luna?.sections?.['Tu refugio íntimo'] }, { key: 'ascendente', label: `Ascendente en ${signNames[result.ascendente]}`, image: asset(`/img/${result.ascendente === 'CANCER' ? 'CANCER' : result.ascendente}.png`), text: profileData.ascendente?.sections?.['Tu carta de presentación'] }];
  return <main className="page-width page-section result-page"><Link className="back-link" to="/">← Nueva consulta</Link><div className="section-heading"><p className="eyebrow">Tu lectura personalizada</p><h1>Tu combinación astrológica</h1><p className="result-subtitle">Sol en {signNames[result.sol]} · Luna en {signNames[result.luna]} · Ascendente en {signNames[result.ascendente]}</p></div><div className="result-cards">{cards.map((card) => <article className="result-card" key={card.key}><img src={card.image} alt={card.label} /><h2>{card.label}</h2><p>{card.text}</p></article>)}</div><section className="combination"><h2>✦ &nbsp;La combinación de los tres</h2>{result.paragraphs.map((paragraph, index) => <p key={paragraph}>{index === 0 && name ? `${name}, ${paragraph.charAt(0).toLowerCase()}${paragraph.slice(1)}` : paragraph}</p>)}</section><section className="insight-grid">{[{ title: 'Tus fortalezas', items: getCombinationInsights(result).strengths }, { title: 'Tus miedos', items: getCombinationInsights(result).fears }, { title: 'Tu evolución interior', items: getCombinationInsights(result).evolution }].map((column) => <article className="insight-card" key={column.title}><h2>{column.title}</h2><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</section></main>;
}

export default function App() {
  return <div className="app-shell"><Header /><div className="main-content"><Routes><Route path="/" element={<Home />} /><Route path="/perfiles" element={<Profiles />} /><Route path="/acerca-de" element={<About />} /><Route path="/seleccionar" element={<ManualSelection />} /><Route path="/calcular" element={<CalculatePlaceholder />} /><Route path="/resultado/:id" element={<Result />} /></Routes></div><Footer /></div>;
}






