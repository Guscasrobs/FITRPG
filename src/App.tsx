import React, { useState, useEffect } from 'react';
import { Trophy, Sword, Activity, Save, PlusCircle, Settings, Trash2, X, Edit3, Ruler, Flame, Heart, Info, Skull, Shield, Droplet, Target, ChevronDown, ChevronUp, Star, AlertTriangle, BicepsFlexed } from 'lucide-react';

// --- ESTILOS MMORPG CUSTOM (INYECCIÓN CSS) ---
const WOW_STYLES = `
  .wow-bg {
    background-color: #0a0705;
    background-image: radial-gradient(circle at 50% 0%, #1f1610 0%, #0a0705 70%);
    color: #e5d5b6;
  }
  .wow-panel {
    background: linear-gradient(to bottom, #261b14, #160f0a);
    border: 2px solid #4a3320;
    border-radius: 4px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.9), 0 8px 16px rgba(0,0,0,0.8);
    position: relative;
  }
  .wow-panel::after {
    content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
    border: 1px solid #110c08; border-radius: 4px; pointer-events: none;
  }
  .wow-inset {
    background: #0d0906;
    border: 1px solid #332215;
    box-shadow: inset 0 4px 8px rgba(0,0,0,0.9);
  }
  .wow-header {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    background: linear-gradient(to bottom, #fde047, #b45309);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 2px 4px rgba(0,0,0,0.9);
    letter-spacing: 1px;
    font-weight: 900;
  }
  .wow-font {
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  }
  .wow-input {
    background: #080503;
    border: 1px solid #4a3320;
    color: #e5d5b6;
    box-shadow: inset 0 2px 6px rgba(0,0,0,1);
    font-family: monospace;
  }
  .wow-input:focus {
    border-color: #d97706; outline: none;
    box-shadow: inset 0 2px 4px rgba(0,0,0,1), 0 0 5px rgba(217,119,6,0.5);
  }
  .wow-button {
    background: linear-gradient(to bottom, #7f1d1d, #450a0a);
    border: 1px solid #f87171;
    box-shadow: 0 0 0 1px #220505, inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 6px rgba(0,0,0,0.8);
    color: #fef08a;
    font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    text-transform: uppercase;
    text-shadow: 0 1px 2px black;
    transition: all 0.1s;
  }
  .wow-button:hover { background: linear-gradient(to bottom, #991b1b, #570c0c); }
  .wow-button:active { transform: translateY(2px); box-shadow: 0 0 0 1px #220505, inset 0 2px 4px rgba(0,0,0,0.8); }
  
  .wow-button-gold {
    background: linear-gradient(to bottom, #b45309, #78350f);
    border: 1px solid #fde047;
  }
  .wow-button-gold:hover { background: linear-gradient(to bottom, #d97706, #92400e); }
  
  .wow-health-bar {
    background: linear-gradient(to bottom, #2b0b0b, #120404);
    border: 2px solid #1f1610;
    outline: 1px solid #4a3320;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
  }
  .wow-health-fill {
    background: linear-gradient(to bottom, #ef4444, #991b1b);
    box-shadow: inset 0 2px 2px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.5);
  }
  
  .wow-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
  .wow-scrollbar::-webkit-scrollbar-track { background: #0d0906; border-left: 1px solid #1f1610; }
  .wow-scrollbar::-webkit-scrollbar-thumb { background: #4a3320; border-radius: 2px; }
  .wow-scrollbar::-webkit-scrollbar-thumb:hover { background: #5c4033; }
`;

// --- CONSTANTES Y BASES DE DATOS ---
const LOOT_ICONS = ['🍔', '🍕', '🍺', '🎮', '👕', '👟', '🛀', '✈️', '📸', '📱', '⌚', '💻', '🎫', '🍿', '🎸', '📚', '🏆', '👑', '💎', '💰', '🎁', '🗡️', '🛡️', '🧪', '🔮', '🎉', '🏖️', '🏕️', '🚗', '🛍️', '💆'];

const CONSEJOS_SALUD = [
  "🛡️ Misión de Resistencia: Evita los carbohidratos refinados después del ocaso. Sustitúyelos por proteínas y vegetales para evitar picos de insulina.",
  "🏃‍♂️ Misión de Agilidad: Realiza una caminata rápida de 30 minutos al menos 3 veces esta semana. Tu metabolismo basal aumentará.",
  "🥩 Misión de Fuerza: Consume entre 1.6g y 2g de proteína por kilo. Esto blindará tu masa muscular mientras oxidas grasa.",
  "💧 Misión de Purificación: Bebe una poción de agua grande al despertar y antes de cada combate (comida).",
  "🛌 Misión de Recuperación: Apaga distracciones 1 hora antes de dormir. El cortisol bajo destruye la armadura del Jefe Grasa.",
  "⚔️ Misión Táctica: Lee los pergaminos (etiquetas). Si el azúcar es de los primeros ingredientes, ¡es una trampa tóxica!",
  "🥦 Misión de Fortificación: Añade vegetales fibrosos a tu comida principal hoy para mejorar tu aguante.",
  "🧘‍♂️ Misión de Claridad: El estrés acumula grasa visceral. Dedica 10 minutos de meditación en tu fortaleza.",
  "⚡ Misión de Ráfaga: Incorpora 15 minutos de entrenamiento de Alta Intensidad para crear una 'deuda de oxígeno'.",
  "🕰️ Misión de Disciplina: Practica un ayuno táctico de 12 horas. Entrena a tu cuerpo para consumir la grasa enemiga."
];

// --- GENERADOR DE NOMBRES DE JEFES ---
const VOCABULARIO_JEFES = {
  peso: {
    titulos: ['Lord', 'Barón', 'Rey', 'Gólem', 'Gigante', 'Monstruo', 'El Gran', 'Emperador'],
    nombres: ['Gordantúa', 'Carbohidrato', 'Grasa', 'Glotón', 'Sedentario', 'Behemoth', 'Coloso', 'Pancracio'],
    epitetos: ['el Devorador', 'el Pesado', 'el Inamovible', 'el Insaciable', 'el Colosal', 'el Expansivo']
  },
  cintura: {
    titulos: ['Don', 'Conde', 'Duque', 'Maestro', 'Señor', 'El Opresor'],
    nombres: ['Llantita', 'Cinturónicus', 'Pantalón', 'Botón', 'Talla L', 'Pliegue', 'Corsé', 'Pretina'],
    epitetos: ['el Asfixiante', 'el Inflexible', 'el Apretado', 'Rompe-costuras', 'el Estrecho', 'el Implacable']
  },
  visceral: {
    titulos: ['Duque', 'Espectro', 'Fantasma', 'Señor', 'Parásito', 'Mutante', 'Sombra'],
    nombres: ['Colesterol', 'Víscera', 'Triglicérido', 'Toxina', 'Órgano', 'Sodio', 'Lípido'],
    epitetos: ['el Oculto', 'el Tóxico', 'el Silencioso', 'el Profundo', 'el Invisible', 'el Interno']
  },
  musculo: {
    titulos: ['Señor', 'Caballero Oscuro', 'Esqueleto', 'Gólem', 'Príncipe'],
    nombres: ['Debilidad', 'Atrofia', 'Raquitismo', 'Fatiga', 'Cansancio', 'Huesos'],
    epitetos: ['el Frágil', 'el Quebradizo', 'el Sin Fuerza', 'el Desnutrido', 'el Endeble']
  }
};

const generarNombreJefe = (tipo) => {
  const voc = VOCABULARIO_JEFES[tipo] || VOCABULARIO_JEFES.peso;
  const titulo = voc.titulos[Math.floor(Math.random() * voc.titulos.length)];
  const nombre = voc.nombres[Math.floor(Math.random() * voc.nombres.length)];
  const epiteto = voc.epitetos[Math.floor(Math.random() * voc.epitetos.length)];
  
  const formato = Math.random();
  if (formato < 0.3) return `${titulo} ${nombre}`;
  if (formato < 0.6) return `${nombre}, ${epiteto}`;
  return `${titulo} ${nombre}, ${epiteto}`;
};

const calcularEdad = (fechaNacStr) => {
  if (!fechaNacStr) return 0;
  const hoy = new Date();
  const cumpleanos = new Date(fechaNacStr);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) edad--;
  return Math.max(0, edad);
};

const FitRPG = () => {
  // --- ESTADO INICIAL CON LOCALSTORAGE ---
  const [metaPeso, setMetaPeso] = useState(() => { const s = localStorage.getItem('fitrpg_metaPeso'); return s !== null ? JSON.parse(s) : 75.0; });
  const [metaGrasa, setMetaGrasa] = useState(() => { const s = localStorage.getItem('fitrpg_metaGrasa'); return s !== null ? JSON.parse(s) : 20.0; });
  const [metaCintura, setMetaCintura] = useState(() => { const s = localStorage.getItem('fitrpg_metaCintura'); return s !== null ? JSON.parse(s) : 85.0; });
  const [metaVisceral, setMetaVisceral] = useState(() => { const s = localStorage.getItem('fitrpg_metaVisceral'); return s !== null ? JSON.parse(s) : 9.0; });
  const [metaMusculo, setMetaMusculo] = useState(() => { const s = localStorage.getItem('fitrpg_metaMusculo'); return s !== null ? JSON.parse(s) : 40.0; });
  
  const [perfil, setPerfil] = useState(() => {
    const s = localStorage.getItem('fitrpg_perfil');
    if (s !== null) {
      const parsed = JSON.parse(s);
      if (parsed.edad && !parsed.fechaNacimiento) {
        parsed.fechaNacimiento = `${new Date().getFullYear() - parsed.edad}-01-01`;
        delete parsed.edad;
      }
      return parsed;
    }
    return { altura: 175, fechaNacimiento: '1990-01-01', genero: 'hombre', actividad: 1.2 };
  });

  const [historial, setHistorial] = useState(() => { const s = localStorage.getItem('fitrpg_historial'); return s !== null ? JSON.parse(s) : []; });
  const [bosses, setBosses] = useState(() => { const s = localStorage.getItem('fitrpg_bosses_v4'); return s !== null ? JSON.parse(s) : []; });

  // Estados UI Temporales
  const [nuevoPeso, setNuevoPeso] = useState('');
  const [nuevoGrasaPct, setNuevoGrasaPct] = useState('');
  const [nuevoGrasaKg, setNuevoGrasaKg] = useState('');
  const [nuevoMusculoPct, setNuevoMusculoPct] = useState('');
  const [nuevaCintura, setNuevaCintura] = useState('');
  const [nuevoVisceral, setNuevoVisceral] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().split('T')[0]);
  
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [registroAbierto, setRegistroAbierto] = useState(false); 
  const [historialAbierto, setHistorialAbierto] = useState(false);
  const [chartStat, setChartStat] = useState('peso'); 
  const [pickerOpenId, setPickerOpenId] = useState(null);

  // Sistema de Eventos
  const [jefesDerrotadosRecientes, setJefesDerrotadosRecientes] = useState([]);
  const [retrocesoInfo, setRetrocesoInfo] = useState(null);

  // --- ONBOARDING ---
  const [onboardingData, setOnboardingData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso: '', grasaPct: '', musculoPct: '', cintura: '', visceral: '',
    altura: 175, fechaNacimiento: '', genero: 'hombre', actividad: 1.2
  });
  const [onboardingError, setOnboardingError] = useState('');

  const comenzarAventura = () => {
    const { peso, grasaPct, musculoPct, cintura, visceral, altura, fechaNacimiento, genero, actividad, fecha } = onboardingData;

    if (!peso || !grasaPct || !musculoPct || !cintura || !visceral || !altura || !fechaNacimiento) {
      setOnboardingError("Faltan atributos. Llena todos los campos para forjar tu destino."); return;
    }

    const p = parseFloat(peso); const gPct = parseFloat(grasaPct); const mPct = parseFloat(musculoPct);
    const c = parseFloat(cintura); const v = parseFloat(visceral); const alt = parseFloat(altura);

    const mPeso = 22 * Math.pow(alt / 100, 2);
    const mGrasa = genero === 'hombre' ? 15 : 24;
    const mCintura = alt / 2;
    const mVisceral = 9;
    const metaMusc = mPct + 5.0; 

    setMetaPeso(parseFloat(mPeso.toFixed(1)));
    setMetaGrasa(mGrasa);
    setMetaCintura(parseFloat(mCintura.toFixed(1)));
    setMetaVisceral(mVisceral);
    setMetaMusculo(metaMusc);

    setPerfil({ altura: alt, fechaNacimiento, genero, actividad: parseFloat(actividad) });

    const nuevosBosses = [];
    let idCounter = 1;

    const kgToLose = p - parseFloat(mPeso.toFixed(1));
    if (kgToLose > 0) {
      let currentStep = 5;
      while (currentStep < kgToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'peso', valor: currentStep, nombre: generarNombreJefe('peso'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 5;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'peso', valor: parseFloat(kgToLose.toFixed(1)), nombre: "Lord Grasa (Jefe Final)", premio: "Gran Victoria", icono: "👑" });
    }

    const cmToLose = c - parseFloat(mCintura.toFixed(1));
    if (cmToLose > 0) {
      let currentStep = 5;
      while (currentStep < cmToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'cintura', valor: currentStep, nombre: generarNombreJefe('cintura'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 5;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'cintura', valor: parseFloat(cmToLose.toFixed(1)), nombre: "El Opresor (Jefe Final)", premio: "Victoria Épica", icono: "👑" });
    }

    const vToLose = v - mVisceral;
    if (vToLose > 0) {
      let currentStep = 3;
      while (currentStep < vToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'visceral', valor: currentStep, nombre: generarNombreJefe('visceral'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 3;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'visceral', valor: parseFloat(vToLose.toFixed(1)), nombre: "Núcleo Tóxico (Jefe Final)", premio: "Salud Interna", icono: "👑" });
    }

    const mToGain = metaMusc - mPct;
    if (mToGain > 0) {
      let currentStep = 2;
      while (currentStep < mToGain) {
        nuevosBosses.push({ id: idCounter++, tipo: 'musculo', valor: currentStep, nombre: generarNombreJefe('musculo'), premio: "Botín de Fuerza", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 2;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'musculo', valor: parseFloat(mToGain.toFixed(1)), nombre: "Titán de Fuerza (Jefe Final)", premio: "Cuerpo de Acero", icono: "💪" });
    }

    setBosses(nuevosBosses);
    setHistorial([{ fecha, peso: p, grasaPct: gPct, musculoPct: mPct, grasaKg: parseFloat((p * (gPct / 100)).toFixed(2)), cintura: c, visceral: v }]);
  };

  useEffect(() => {
    localStorage.setItem('fitrpg_metaPeso', JSON.stringify(metaPeso));
    localStorage.setItem('fitrpg_metaGrasa', JSON.stringify(metaGrasa));
    localStorage.setItem('fitrpg_metaCintura', JSON.stringify(metaCintura));
    localStorage.setItem('fitrpg_metaVisceral', JSON.stringify(metaVisceral));
    localStorage.setItem('fitrpg_metaMusculo', JSON.stringify(metaMusculo));
    localStorage.setItem('fitrpg_perfil', JSON.stringify(perfil));
    localStorage.setItem('fitrpg_historial', JSON.stringify(historial));
    localStorage.setItem('fitrpg_bosses_v4', JSON.stringify(bosses));
  }, [metaPeso, metaGrasa, metaCintura, metaVisceral, metaMusculo, perfil, historial, bosses]);

  useEffect(() => {
    if (nuevoPeso && nuevoGrasaPct) {
      const p = parseFloat(nuevoPeso); const g = parseFloat(nuevoGrasaPct);
      if (!isNaN(p) && !isNaN(g)) setNuevoGrasaKg((p * (g / 100)).toFixed(2));
    }
  }, [nuevoPeso, nuevoGrasaPct]);

  // --- PANTALLA DE CREACIÓN DE PERSONAJE (ONBOARDING) ---
  if (historial.length === 0) {
    return (
      <div className="min-h-screen wow-bg p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: WOW_STYLES}} />
        
        <div className="wow-panel p-6 md:p-10 max-w-3xl w-full relative z-10">
          <div className="text-center mb-8">
            <Sword size={56} className="mx-auto text-[#fcd34d] mb-4 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)]" />
            <h1 className="text-5xl wow-header mb-2">Forja tu Destino</h1>
            <p className="text-[#a68c69] wow-font italic">Adéntrate en FitRPG. Registra tus atributos base para configurar tus misiones y enemigos.</p>
          </div>

          {onboardingError && (
             <div className="bg-[#450a0a] border border-[#ef4444] text-[#fca5a5] p-3 rounded-sm text-center text-sm mb-6 wow-font">
              {onboardingError}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 wow-font">
            <div className="space-y-4 wow-inset p-6 rounded-sm">
              <h3 className="text-[#fcd34d] font-bold flex items-center gap-2 border-b border-[#4a3320] pb-2 text-lg"><Heart size={18} /> Raza y Clase (Biometría)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Género</label>
                  <select value={onboardingData.genero} onChange={(e) => setOnboardingData({...onboardingData, genero: e.target.value})} className="w-full wow-input p-2 text-sm">
                    <option value="hombre">Hombre</option><option value="mujer">Mujer</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Nacimiento</label>
                  <input type="date" value={onboardingData.fechaNacimiento} onChange={(e) => setOnboardingData({...onboardingData, fechaNacimiento: e.target.value})} className="w-full wow-input p-2 text-sm"/>
                </div>
                <div>
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Altura (cm)</label>
                  <input type="number" value={onboardingData.altura} onChange={(e) => setOnboardingData({...onboardingData, altura: e.target.value})} className="w-full wow-input p-2 text-sm"/>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Ruta de Entrenamiento</label>
                  <select value={onboardingData.actividad} onChange={(e) => setOnboardingData({...onboardingData, actividad: e.target.value})} className="w-full wow-input p-2 text-sm">
                    <option value="1.2">Sedentario (Aldeano)</option>
                    <option value="1.375">Ligero (Explorador)</option>
                    <option value="1.55">Moderado (Guerrero)</option>
                    <option value="1.725">Intenso (Gladiador)</option>
                    <option value="1.9">Atleta Pro (Héroe Épico)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 wow-inset p-6 rounded-sm">
              <h3 className="text-[#ef4444] font-bold flex items-center gap-2 border-b border-[#4a3320] pb-2 text-lg"><Skull size={18} /> Atributos de Inicio</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Fecha de Pacto</label>
                  <input type="date" value={onboardingData.fecha} onChange={(e) => setOnboardingData({...onboardingData, fecha: e.target.value})} className="w-full wow-input p-2 text-sm"/>
                </div>
                <div>
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Peso (kg)</label>
                  <input type="number" placeholder="Ej: 95.5" value={onboardingData.peso} onChange={(e) => setOnboardingData({...onboardingData, peso: e.target.value})} className="w-full wow-input p-2 text-sm"/>
                </div>
                <div>
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Cintura (cm)</label>
                  <input type="number" placeholder="Ej: 105" value={onboardingData.cintura} onChange={(e) => setOnboardingData({...onboardingData, cintura: e.target.value})} className="w-full wow-input p-2 text-sm"/>
                </div>
                <div>
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">% Grasa</label>
                  <input type="number" placeholder="Ej: 32" value={onboardingData.grasaPct} onChange={(e) => setOnboardingData({...onboardingData, grasaPct: e.target.value})} className="w-full wow-input p-2 text-sm text-[#fcd34d]"/>
                </div>
                <div>
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">% Músculo</label>
                  <input type="number" placeholder="Ej: 35" value={onboardingData.musculoPct} onChange={(e) => setOnboardingData({...onboardingData, musculoPct: e.target.value})} className="w-full wow-input p-2 text-sm text-[#60a5fa]"/>
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] text-[#a68c69] block mb-1 uppercase tracking-wider">Visceral (Nivel)</label>
                  <input type="number" placeholder="Ej: 15" value={onboardingData.visceral} onChange={(e) => setOnboardingData({...onboardingData, visceral: e.target.value})} className="w-full wow-input p-2 text-sm text-[#fb923c]"/>
                </div>
              </div>
            </div>
          </div>

          <button onClick={comenzarAventura} className="w-full mt-8 wow-button py-4 rounded-sm text-lg flex items-center justify-center gap-2">
            <Sword size={24} /> Entrar al Reino
          </button>
        </div>
      </div>
    );
  }

  // --- CÁLCULOS PRINCIPALES ---
  const historialOrdenado = [...historial].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const datosIniciales = historialOrdenado[0] || {};
  const ultimoRegistro = historialOrdenado[historialOrdenado.length - 1] || {};
  
  const pesoActual = ultimoRegistro.peso || 0;
  const grasaKgActual = ultimoRegistro.grasaKg || (ultimoRegistro.peso * (ultimoRegistro.grasaPct / 100)) || 0;
  const grasaPctActual = ultimoRegistro.grasaPct || 0;
  const musculoPctActual = ultimoRegistro.musculoPct || 0;
  const cinturaActual = ultimoRegistro.cintura || 0;
  const visceralActual = ultimoRegistro.visceral || 0;
  
  const pesoInicial = datosIniciales.peso || 0;
  const grasaKgInicial = datosIniciales.grasaKg || (datosIniciales.peso * (datosIniciales.grasaPct / 100)) || 0;
  const cinturaInicial = datosIniciales.cintura || 0;
  const visceralInicial = datosIniciales.visceral || 0;
  const musculoInicial = datosIniciales.musculoPct || 0;

  const kilosPerdidos = Math.max(0, pesoInicial - pesoActual);
  const grasaPerdidaKg = Math.max(0, grasaKgInicial - grasaKgActual);
  const cinturaPerdidaCm = Math.max(0, cinturaInicial - cinturaActual);
  const visceralPerdida = Math.max(0, visceralInicial - visceralActual);
  const musculoGanadoPct = Math.max(0, musculoPctActual - musculoInicial);

  const getActiveBoss = (tipo, progresoActual) => {
    const sorted = bosses.filter(b => b.tipo === tipo).sort((a,b) => a.valor - b.valor);
    const currentBoss = sorted.find(b => b.valor > progresoActual);
    if (!currentBoss) return null; 
    const currentIndex = sorted.indexOf(currentBoss);
    const previousValue = currentIndex > 0 ? sorted[currentIndex - 1].valor : 0;
    const maxHp = currentBoss.valor - previousValue;
    const damageDoneToBoss = progresoActual - previousValue;
    const hpRemaining = maxHp - damageDoneToBoss;
    const hpPct = Math.max(0, Math.min(100, (hpRemaining / maxHp) * 100));
    return { ...currentBoss, maxHp, hpRemaining, hpPct };
  };

  const activePesoBoss = getActiveBoss('peso', kilosPerdidos);
  const activeCinturaBoss = getActiveBoss('cintura', cinturaPerdidaCm);
  const activeVisceralBoss = getActiveBoss('visceral', visceralPerdida);
  const activeMusculoBoss = getActiveBoss('musculo', musculoGanadoPct);

  const edadCalculada = calcularEdad(perfil.fechaNacimiento);

  const calcularMetabolismo = () => {
    const pActual = pesoActual || 0; const pAltura = perfil.altura || 0; const pEdad = edadCalculada;
    let tmb = (10 * pActual) + (6.25 * pAltura) - (5 * pEdad);
    tmb = perfil.genero === 'hombre' ? tmb + 5 : tmb - 161;
    if (tmb < 0) tmb = 0;
    const tdee = tmb * perfil.actividad;
    const altM = pAltura / 100;
    let imc = 0; let pMin = 0; let pMax = 0;
    if (altM > 0) { imc = pActual / (altM * altM); pMin = 18.5 * (altM * altM); pMax = 24.9 * (altM * altM); }
    const gMin = perfil.genero === 'hombre' ? 10 : 18; const gMax = perfil.genero === 'hombre' ? 20 : 28;
    return { tmb, tdee, imc, pesoIdealMin: pMin, pesoIdealMax: pMax, grasaIdealMin: gMin, grasaIdealMax: gMax };
  };
  const bio = calcularMetabolismo();

  // --- FUNCIONES DE ACCIÓN ---
  const registrarProgreso = () => {
    if (!nuevoPeso) return;

    const p = parseFloat(nuevoPeso);
    const c = nuevaCintura ? parseFloat(nuevaCintura) : cinturaActual;
    const v = nuevoVisceral ? parseFloat(nuevoVisceral) : visceralActual;
    const m = nuevoMusculoPct ? parseFloat(nuevoMusculoPct) : musculoPctActual;

    const newKilosPerdidos = Math.max(0, pesoInicial - p);
    const newCinturaPerdida = Math.max(0, cinturaInicial - c);
    const newVisceralPerdida = Math.max(0, visceralInicial - v);
    const newMusculoGanado = Math.max(0, m - musculoInicial);

    const huboRetroceso = p > pesoActual || c > cinturaActual || v > visceralActual || m < musculoPctActual;
    let deltaRetroceso = "";
    if (p > pesoActual) deltaRetroceso += `+${(p - pesoActual).toFixed(1)}kg `;
    if (c > cinturaActual) deltaRetroceso += `+${(c - cinturaActual).toFixed(1)}cm `;
    if (v > visceralActual) deltaRetroceso += `+${(v - visceralActual).toFixed(1)}nv `;
    if (m < musculoPctActual) deltaRetroceso += `-${(musculoPctActual - m).toFixed(1)}% mús`;

    let bossesRecienDerrotados = [];
    bosses.forEach(b => {
      let pViejo = 0; let pNuevo = 0;
      if (b.tipo === 'peso') { pViejo = kilosPerdidos; pNuevo = newKilosPerdidos; }
      else if (b.tipo === 'cintura') { pViejo = cinturaPerdidaCm; pNuevo = newCinturaPerdida; }
      else if (b.tipo === 'visceral') { pViejo = visceralPerdida; pNuevo = newVisceralPerdida; }
      else if (b.tipo === 'musculo') { pViejo = musculoGanadoPct; pNuevo = newMusculoGanado; }
      if (pViejo < b.valor && pNuevo >= b.valor) bossesRecienDerrotados.push(b);
    });

    const nuevoRegistro = {
      fecha: nuevaFecha, peso: p,
      grasaPct: nuevoGrasaPct ? parseFloat(nuevoGrasaPct) : grasaPctActual, musculoPct: m,
      grasaKg: nuevoGrasaKg ? parseFloat(nuevoGrasaKg) : (p * (parseFloat(nuevoGrasaPct || grasaPctActual) / 100)),
      cintura: c, visceral: v
    };

    setHistorial([...historial, nuevoRegistro]);

    if (huboRetroceso && deltaRetroceso !== "") {
      setRetrocesoInfo({
        mensaje: `Las fuerzas oscuras avanzan (${deltaRetroceso.trim()}). Algunos enemigos han regenerado armadura.`,
        consejo: CONSEJOS_SALUD[Math.floor(Math.random() * CONSEJOS_SALUD.length)]
      });
    } else if (bossesRecienDerrotados.length > 0) {
      setJefesDerrotadosRecientes(bossesRecienDerrotados);
    }

    setNuevoPeso(''); setNuevoGrasaPct(''); setNuevoGrasaKg(''); setNuevoMusculoPct(''); setNuevaCintura(''); setNuevoVisceral('');
    setRegistroAbierto(false); 
  };

  const actualizarInicio = (campo, valor) => {
    const nuevosDatos = [...historialOrdenado];
    if (nuevosDatos.length > 0) { nuevosDatos[0] = { ...nuevosDatos[0], [campo]: valor }; setHistorial(nuevosDatos); }
  };
  const actualizarPerfil = (campo, valor) => setPerfil({ ...perfil, [campo]: valor });
  const agregarBoss = () => {
    const nuevoId = Math.max(...bosses.map(h => h.id), 0) + 1;
    setBosses([...bosses, { id: nuevoId, tipo: 'peso', valor: 5, nombre: generarNombreJefe('peso'), premio: "Premio Menor", icono: "🎁" }]);
  };
  const actualizarBoss = (id, campo, valor) => setBosses(bosses.map(b => b.id === id ? { ...b, [campo]: valor } : b));
  const borrarBoss = (id) => setBosses(bosses.filter(b => b.id !== id));
  
  const borrarPartida = () => {
    if (window.confirm("⚠️ ¿Estás seguro de abandonar la misión? Perderás todo el progreso.")) {
      localStorage.clear(); window.location.reload();
    }
  };

  const guardarYCerrarConfig = () => {
    const kgToLose = Math.max(0, pesoInicial - metaPeso); const cmToLose = Math.max(0, cinturaInicial - metaCintura);
    const vToLose = Math.max(0, visceralInicial - metaVisceral); const mToGain = Math.max(0, metaMusculo - musculoInicial);

    setBosses(prev => {
      let newBosses = [...prev];
      const updateFinalBoss = (tipo, newValor) => {
        const typeBosses = newBosses.filter(b => b.tipo === tipo).sort((a,b) => a.valor - b.valor);
        if (typeBosses.length > 0) {
          const finalBoss = typeBosses[typeBosses.length - 1];
          finalBoss.valor = parseFloat(newValor.toFixed(1));
        }
      };
      updateFinalBoss('peso', kgToLose); updateFinalBoss('cintura', cmToLose); updateFinalBoss('visceral', vToLose); updateFinalBoss('musculo', mToGain);
      return newBosses;
    });
    setMostrarConfig(false);
  };

  const generarPuntosGrafico = () => {
    if (historialOrdenado.length < 2) return [];
    const data = historialOrdenado.map(h => h[chartStat] || 0);
    const minData = Math.min(...data); const maxData = Math.max(...data);
    const padding = (maxData - minData) * 0.2 || 1;
    const minVal = minData - padding; const maxVal = maxData + padding;
    const width = 500; const height = 150;
    
    return historialOrdenado.map((d, i) => {
      const val = d[chartStat] || 0;
      const x = (i / (historialOrdenado.length - 1)) * width;
      const y = height - ((val - minVal) / (maxVal - minVal)) * height;
      return { x, y, val, fecha: d.fecha };
    });
  };

  const chartPoints = generarPuntosGrafico();
  const polylinePoints = chartPoints.map(p => `${p.x},${p.y}`).join(" ");

  const IMCBar = ({ imc }) => {
    const minScale = 15; const maxScale = 40; const safeIMC = isNaN(imc) ? 0 : imc; 
    const percent = Math.min(100, Math.max(0, ((safeIMC - minScale) / (maxScale - minScale)) * 100));
    return (
      <div className="mt-4 wow-font">
        <div className="flex justify-between text-[10px] text-[#a68c69] mb-1 uppercase">
          <span>Bajo</span><span>Normal</span><span>Alto</span><span>Obesidad</span>
        </div>
        <div className="relative h-4 w-full rounded-sm overflow-hidden flex border border-[#4a3320] box-shadow-inner bg-[#110c08]">
          <div className="h-full bg-blue-700/80 w-[14%]"></div>
          <div className="h-full bg-emerald-600/80 w-[26%] border-l border-[#110c08]"></div>
          <div className="h-full bg-yellow-600/80 w-[20%] border-l border-[#110c08]"></div>
          <div className="h-full bg-red-700/80 flex-1 border-l border-[#110c08]"></div>
          
          <div className="absolute top-0 bottom-0 w-2 bg-transparent border-x-[2px] border-[#fcd34d] shadow-[0_0_10px_rgba(0,0,0,1)] transition-all duration-1000 z-10 flex justify-center -translate-x-1" style={{ left: `${percent}%` }}>
             <div className="absolute -top-3 w-4 h-4 bg-[#fcd34d] border border-[#4a3320] rotate-45"></div>
          </div>
        </div>
      </div>
    );
  };

  // --- MODALS ---
  const BossDefeatedModal = () => {
    if (jefesDerrotadosRecientes.length === 0) return null;
    const boss = jefesDerrotadosRecientes[0];
    return (
      <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-4">
        <button onClick={() => setJefesDerrotadosRecientes(prev => prev.slice(1))} className="absolute top-6 right-6 text-[#a68c69] hover:text-[#fcd34d] p-2 transition-colors border border-[#4a3320] rounded-sm bg-[#1a120d]">
          <X size={24} />
        </button>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bossShake { 0% { transform: translate(1px, 1px) scale(1); filter: grayscale(0%); } 20% { transform: translate(-3px, 0px) rotate(5deg); } 80% { transform: translate(-1px, -1px) rotate(-5deg) scale(1.2); filter: grayscale(100%) brightness(200%); opacity: 1; } 100% { transform: translate(1px, -2px) scale(0); opacity: 0; } }
          @keyframes lootReveal { 0% { transform: scale(0) translateY(50px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
          .anim-boss-die { animation: bossShake 1.5s forwards ease-in-out; }
          .anim-loot-show { animation: lootReveal 1s forwards ease-out; animation-delay: 1.5s; opacity: 0; }
        `}} />
        <div className="text-center relative w-full max-w-md h-96 flex flex-col items-center justify-center wow-font">
          <h2 className="text-6xl wow-header mb-8 absolute top-0 w-full drop-shadow-[0_0_20px_#b45309]">¡VICTORIA!</h2>
          <div className="absolute inset-0 flex flex-col items-center justify-center anim-boss-die pointer-events-none">
             <div className="text-8xl mb-2 drop-shadow-2xl">👹</div>
             <h3 className="text-3xl font-bold text-[#ef4444] line-through decoration-[#fcd34d] decoration-4">{boss.nombre}</h3>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center anim-loot-show mt-10">
             <div className="text-[100px] filter drop-shadow-[0_0_40px_rgba(252,211,77,1)] mb-6">{boss.icono}</div>
             <div className="wow-panel p-4 text-center">
               <p className="text-[#fcd34d] text-xs font-bold uppercase tracking-widest mb-1">Has Despojado:</p>
               <h3 className="text-2xl font-bold text-[#fceeb5]">{boss.premio}</h3>
             </div>
          </div>
          <button onClick={() => setJefesDerrotadosRecientes(prev => prev.slice(1))} className="absolute -bottom-10 wow-button-gold py-3 px-8 text-lg animate-in fade-in duration-1000 delay-3000 opacity-0 fill-mode-forwards rounded-sm uppercase tracking-widest font-bold">
            Reclamar Botín
          </button>
        </div>
      </div>
    );
  };

  const RetrocesoModal = () => {
    if (!retrocesoInfo) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
        <button onClick={() => setRetrocesoInfo(null)} className="absolute top-6 right-6 text-[#a68c69] hover:text-[#fcd34d] border border-[#4a3320] bg-[#1a120d] p-2 rounded-sm transition-colors">
          <X size={24} />
        </button>
        <div className="wow-panel border-[#ef4444] p-6 md:p-8 max-w-lg w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.2)]">
          <AlertTriangle size={56} className="text-[#ef4444] mx-auto mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <h2 className="text-3xl wow-header text-transparent bg-clip-text bg-gradient-to-b from-[#f87171] to-[#991b1b] mb-2">¡EL ENEMIGO SE FORTALECE!</h2>
          <p className="text-[#e5d5b6] mb-6 font-semibold text-sm">{retrocesoInfo.mensaje}</p>
          
          <div className="wow-inset border border-[#3b82f6]/30 p-5 rounded-sm mb-8 text-left relative overflow-hidden">
             <div className="absolute -top-4 -right-4 opacity-5"><Info size={100}/></div>
             <h4 className="text-[#60a5fa] font-bold mb-3 flex items-center gap-2 relative z-10 uppercase tracking-wider text-xs border-b border-[#3b82f6]/30 pb-2"><Info size={16}/> Papiro de Sabiduría</h4>
             <p className="text-sm text-[#bfdbfe] italic relative z-10 leading-relaxed font-serif">"{retrocesoInfo.consejo}"</p>
          </div>

          <button onClick={() => setRetrocesoInfo(null)} className="w-full wow-button py-3 text-sm">
             Reagrupar y Seguir Luchando
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen wow-bg p-4 md:p-8 relative selection:bg-[#78350f]">
      <style dangerouslySetInnerHTML={{__html: WOW_STYLES}} />
      <BossDefeatedModal />
      <RetrocesoModal />

      {/* --- MODAL DE CONFIGURACIÓN --- */}
      {mostrarConfig && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="wow-panel w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl wow-scrollbar">
            <div className="p-5 border-b border-[#4a3320] flex justify-between items-center sticky top-0 bg-[#160f0a] z-50 shadow-md">
              <h2 className="text-2xl wow-header flex items-center gap-2">
                <Settings className="text-[#a68c69]" /> Ajustes de Misión
              </h2>
              <button onClick={guardarYCerrarConfig} className="text-[#a68c69] hover:text-[#fcd34d] border border-[#4a3320] p-1 bg-[#1a120d] rounded-sm transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8 wow-font">
              
              <section className="wow-inset p-5 rounded-sm">
                <h3 className="text-[#fcd34d] font-bold mb-4 flex items-center gap-2 border-b border-[#4a3320] pb-2 uppercase tracking-widest text-sm"><Heart size={16} /> Ficha de Personaje</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Género</label>
                    <select value={perfil.genero} onChange={(e) => actualizarPerfil('genero', e.target.value)} className="w-full wow-input p-2 text-sm"><option value="hombre">Hombre</option><option value="mujer">Mujer</option></select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">F. Nacimiento</label>
                    <input type="date" value={perfil.fechaNacimiento || ''} onChange={(e) => actualizarPerfil('fechaNacimiento', e.target.value)} className="w-full wow-input p-2 text-sm"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Altura (cm)</label>
                    <input type="number" value={perfil.altura} onChange={(e) => actualizarPerfil('altura', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full wow-input p-2 text-sm"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Clase (Actividad)</label>
                    <select value={perfil.actividad} onChange={(e) => actualizarPerfil('actividad', parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm">
                      <option value="1.2">Sedentario</option><option value="1.375">Ligero</option><option value="1.55">Moderado</option><option value="1.725">Intenso</option><option value="1.9">Atleta Pro</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="wow-inset p-5 rounded-sm">
                <h3 className="text-[#fcd34d] font-bold mb-4 flex items-center gap-2 border-b border-[#4a3320] pb-2 uppercase tracking-widest text-sm"><Target size={16} /> El Gran Destino (Metas)</h3>
                <p className="text-xs text-[#a68c69] mb-4 italic">Alterar el destino ajustará la vitalidad de los Jefes Finales.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Peso (kg)</label>
                    <input type="number" value={metaPeso} onChange={(e) => setMetaPeso(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#ef4444]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Grasa (%)</label>
                    <input type="number" value={metaGrasa} onChange={(e) => setMetaGrasa(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#fcd34d]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Cintura (cm)</label>
                    <input type="number" value={metaCintura} onChange={(e) => setMetaCintura(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#c084fc]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Visceral</label>
                    <input type="number" value={metaVisceral} onChange={(e) => setMetaVisceral(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#fb923c]"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Músculo (%)</label>
                    <input type="number" value={metaMusculo} onChange={(e) => setMetaMusculo(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#60a5fa]"/>
                  </div>
                </div>
              </section>

              <section className="wow-inset p-5 rounded-sm">
                <h3 className="text-[#a68c69] font-bold mb-4 flex items-center gap-2 border-b border-[#332215] pb-2 uppercase tracking-widest text-sm"><Edit3 size={16} /> Atributos Originales (Día 1)</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Fecha</label>
                    <input type="date" value={datosIniciales.fecha || ''} onChange={(e) => actualizarInicio('fecha', e.target.value)} className="w-full wow-input p-2 text-sm"/>
                  </div>
                  <div><label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Peso (kg)</label><input type="number" value={datosIniciales.peso || ''} onChange={(e) => actualizarInicio('peso', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm"/></div>
                  <div><label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Grasa (kg)</label><input type="number" value={datosIniciales.grasaKg || ''} onChange={(e) => actualizarInicio('grasaKg', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#fcd34d]"/></div>
                  <div><label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Cintura (cm)</label><input type="number" value={datosIniciales.cintura || ''} onChange={(e) => actualizarInicio('cintura', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#c084fc]"/></div>
                  <div><label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Visceral</label><input type="number" value={datosIniciales.visceral || ''} onChange={(e) => actualizarInicio('visceral', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#fb923c]"/></div>
                  <div><label className="text-[10px] text-[#a68c69] block mb-1 uppercase">Músculo (%)</label><input type="number" value={datosIniciales.musculoPct || ''} onChange={(e) => actualizarInicio('musculoPct', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full wow-input p-2 text-sm text-[#60a5fa]"/></div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-[#ef4444] font-bold flex items-center gap-2 text-lg uppercase tracking-widest"><Skull size={18} /> Bestiario y Botín</h3>
                    <p className="text-xs text-[#a68c69] mt-1">Genera u organiza los enemigos que custodian las regiones.</p>
                  </div>
                  <button onClick={agregarBoss} className="wow-button-gold py-1 px-3 text-xs flex items-center gap-1 rounded-sm"><PlusCircle size={14} /> Añadir Jefe</button>
                </div>
                
                <div className="space-y-2">
                  {bosses.map((boss) => (
                    <div key={boss.id} className="flex flex-col md:flex-row gap-2 items-center wow-inset p-2 rounded-sm">
                      <div className="w-full md:w-40 flex gap-2">
                        <select value={boss.tipo} onChange={(e) => { actualizarBoss(boss.id, 'tipo', e.target.value); actualizarBoss(boss.id, 'nombre', generarNombreJefe(e.target.value)); }} className="w-full wow-input p-1 text-[11px] h-8">
                          <option value="peso">⚖️ Peso (-)</option><option value="cintura">📏 Cintura (-)</option>
                          <option value="visceral">🫀 Visc (-)</option><option value="musculo">💪 Musc (+)</option>
                        </select>
                        <input type="number" value={boss.valor} onChange={(e) => actualizarBoss(boss.id, 'valor', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-16 wow-input p-1 text-center text-xs h-8 text-[#f87171]" title="Daño/Ganancia Requerida"/>
                      </div>

                      <div className="flex-1 w-full border-l border-[#332215] pl-2">
                        <div className="flex gap-1 items-center">
                          <button onClick={() => actualizarBoss(boss.id, 'nombre', generarNombreJefe(boss.tipo))} className="w-8 h-8 flex items-center justify-center bg-[#110c08] border border-[#4a3320] hover:border-[#fcd34d] text-[#a68c69] transition rounded-sm text-sm" title="Generar">🎲</button>
                          <input type="text" value={boss.nombre} onChange={(e) => actualizarBoss(boss.id, 'nombre', e.target.value)} className="w-full wow-input p-1 h-8 text-sm font-bold"/>
                        </div>
                      </div>

                      <div className="flex-1 w-full border-l border-[#332215] pl-2 relative">
                         <div className="flex gap-1 items-center">
                           <button onClick={() => setPickerOpenId(pickerOpenId === boss.id ? null : boss.id)} className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-[#110c08] border border-[#4a3320] hover:border-[#fcd34d] text-base transition rounded-sm z-20">
                             {boss.icono}
                           </button>
                           <input type="text" value={boss.premio} onChange={(e) => actualizarBoss(boss.id, 'premio', e.target.value)} className="w-full wow-input p-1 h-8 text-sm text-[#fcd34d]"/>
                           {pickerOpenId === boss.id && (
                             <div className="absolute top-10 left-0 wow-panel p-2 grid grid-cols-6 gap-1 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                               {LOOT_ICONS.map(icon => (
                                 <button key={icon} onClick={() => { actualizarBoss(boss.id, 'icono', icon); setPickerOpenId(null); }} className="text-xl hover:bg-[#332215] rounded p-1 transition border border-transparent hover:border-[#4a3320]">{icon}</button>
                               ))}
                             </div>
                           )}
                         </div>
                      </div>
                      <button onClick={() => borrarBoss(boss.id)} className="w-8 h-8 flex items-center justify-center text-[#f87171] bg-[#110c08] border border-[#4a3320] hover:bg-[#450a0a] hover:border-[#ef4444] rounded-sm transition"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="pt-4 border-t border-[#4a3320]">
                <div className="flex justify-between items-center bg-[#1a0f0f] border border-[#450a0a] p-4 rounded-sm">
                  <div>
                    <h3 className="text-[#ef4444] font-bold flex items-center gap-2 mb-1 uppercase tracking-widest text-sm">Zona de Peligro</h3>
                    <p className="text-[11px] text-[#a68c69]">Eliminar pergaminos. No hay vuelta atrás.</p>
                  </div>
                  <button onClick={borrarPartida} className="wow-button py-2 px-4 text-xs">Borrar Partida</button>
                </div>
              </section>
            </div>
            
            <div className="p-4 border-t border-[#4a3320] bg-[#160f0a] sticky bottom-0 text-right shadow-md">
              <button onClick={guardarYCerrarConfig} className="wow-button-gold py-2 px-8 text-sm text-[#fef08a] font-bold uppercase tracking-widest shadow-[0_4px_6px_rgba(0,0,0,0.8)]">Guardar y Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- UI PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- BARRA LATERAL --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="wow-panel p-5 md:p-6">
            <div className="flex justify-between items-start mb-6 border-b border-[#4a3320] pb-4">
              <div className="flex items-center gap-2 text-[#fcd34d]">
                <Sword size={28} className="drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"/>
                <h2 className="text-2xl wow-header">Héroe</h2>
              </div>
              <button onClick={() => setMostrarConfig(true)} className="text-[#a68c69] hover:text-[#fcd34d] p-1.5 border border-[#332215] hover:border-[#fcd34d] bg-[#110c08] rounded-sm transition">
                <Settings size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="wow-inset p-3 rounded-sm relative overflow-hidden">
                <div className="text-[10px] text-[#f87171] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">Meta Peso</div>
                <div className="text-xl font-bold text-[#fceeb5] font-serif">{metaPeso} <span className="text-[10px] text-[#a68c69] font-normal font-sans">kg</span></div>
              </div>
              <div className="wow-inset p-3 rounded-sm relative overflow-hidden">
                <div className="text-[10px] text-[#fcd34d] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">Meta Grasa</div>
                <div className="text-xl font-bold text-[#fceeb5] font-serif">{metaGrasa} <span className="text-[10px] text-[#a68c69] font-normal font-sans">%</span></div>
              </div>
              <div className="wow-inset p-3 rounded-sm relative overflow-hidden">
                <div className="text-[10px] text-[#c084fc] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">Meta Cintura</div>
                <div className="text-xl font-bold text-[#fceeb5] font-serif">{metaCintura} <span className="text-[10px] text-[#a68c69] font-normal font-sans">cm</span></div>
              </div>
              <div className="wow-inset p-3 rounded-sm relative overflow-hidden">
                <div className="text-[10px] text-[#fb923c] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">Meta Visceral</div>
                <div className="text-xl font-bold text-[#fceeb5] font-serif">{metaVisceral}</div>
              </div>
              <div className="wow-inset p-3 rounded-sm relative overflow-hidden col-span-2 border-t border-[#3b82f6]/30">
                <div className="text-[10px] text-[#60a5fa] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">Meta Músculo (+Fuerza)</div>
                <div className="text-xl font-bold text-[#fceeb5] font-serif">{metaMusculo} <span className="text-[10px] text-[#a68c69] font-normal font-sans">%</span></div>
              </div>
            </div>

            <div>
              <button onClick={() => setRegistroAbierto(!registroAbierto)} className="w-full flex items-center justify-between bg-[#110c08] hover:bg-[#1a120d] border border-[#4a3320] p-3 rounded-sm font-semibold text-sm transition text-[#e5d5b6] uppercase tracking-widest wow-font">
                <div className="flex items-center gap-2"><PlusCircle size={16} className="text-[#fcd34d]" /> Registro Diario</div>
                {registroAbierto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {registroAbierto && (
                <div className="space-y-3 mt-4 animate-in slide-in-from-top-2 fade-in wow-font p-3 border border-[#332215] bg-[#0d0906] rounded-sm shadow-inner">
                  <div>
                    <label className="text-[10px] text-[#a68c69] uppercase tracking-wider">Fecha</label>
                    <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} className="w-full wow-input p-2 text-sm"/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] text-[#f87171] uppercase tracking-wider">Peso (kg)</label><input type="number" placeholder="84.5" value={nuevoPeso} onChange={(e) => setNuevoPeso(e.target.value)} className="w-full wow-input p-2 text-sm"/></div>
                    <div><label className="text-[10px] text-[#c084fc] uppercase tracking-wider">Cintura (cm)</label><input type="number" placeholder="90" value={nuevaCintura} onChange={(e) => setNuevaCintura(e.target.value)} className="w-full wow-input p-2 text-sm"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] text-[#fcd34d] uppercase tracking-wider">% Grasa</label><input type="number" placeholder="25" value={nuevoGrasaPct} onChange={(e) => setNuevoGrasaPct(e.target.value)} className="w-full wow-input p-2 text-sm"/></div>
                    <div><label className="text-[10px] text-[#60a5fa] uppercase tracking-wider">% Músculo</label><input type="number" placeholder="38" value={nuevoMusculoPct} onChange={(e) => setNuevoMusculoPct(e.target.value)} className="w-full wow-input p-2 text-sm"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] text-[#fde047] uppercase tracking-wider">Grasa (kg)</label><input type="number" placeholder="Calculado" value={nuevoGrasaKg} onChange={(e) => setNuevoGrasaKg(e.target.value)} className="w-full wow-input p-2 text-sm text-[#fcd34d]"/></div>
                    <div><label className="text-[10px] text-[#fb923c] uppercase tracking-wider">Visceral</label><input type="number" placeholder="10" value={nuevoVisceral} onChange={(e) => setNuevoVisceral(e.target.value)} className="w-full wow-input p-2 text-sm"/></div>
                  </div>
                  
                  <button onClick={registrarProgreso} className="w-full mt-4 wow-button-gold text-[#fef08a] py-3 px-4 rounded-sm font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                    <Save size={16} /> Guardar Progreso
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="wow-inset border border-[#1e3a8a]/30 p-4 rounded-sm bg-[#081226]/50">
            <h4 className="text-[#60a5fa] text-[11px] font-bold mb-2 flex items-center gap-2 uppercase tracking-widest"><Info size={14}/> Stats Base</h4>
            <div className="text-xs text-[#bfdbfe] space-y-1 font-mono">
              <div className="flex justify-between"><span>Altura:</span> <span className="text-[#fceeb5]">{perfil.altura} cm</span></div>
              <div className="flex justify-between"><span>Edad:</span> <span className="text-[#fceeb5]">{edadCalculada} años</span></div>
              <div className="flex justify-between"><span>Mod:</span> <span className="text-[#fceeb5]">x{perfil.actividad}</span></div>
            </div>
          </div>
        </div>

        {/* --- DASHBOARD --- */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#4a3320]">
            <h1 className="text-4xl wow-header drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">FitRPG: Boss Rush</h1>
            <span className="text-[10px] bg-[#110c08] border border-[#4a3320] text-[#a68c69] px-2 py-1 rounded-sm font-mono uppercase">Reino Épico v11</span>
          </div>

          {/* --- ESTADÍSTICAS ACTUALES --- */}
          <div className="wow-panel p-5">
             <h3 className="text-xs font-bold mb-4 flex items-center gap-2 text-[#fcd34d] uppercase tracking-widest wow-font">
                <Star size={16} className="drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]"/> Condición Actual
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-0 border border-[#332215] bg-[#0d0906] rounded-sm divide-x divide-y md:divide-y-0 divide-[#332215]">
                <div className="flex flex-col items-center text-center p-3 hover:bg-[#1a120d] transition">
                   <Sword size={20} className="text-[#ef4444] mb-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"/>
                   <div className="text-[9px] text-[#a68c69] uppercase tracking-widest">Peso</div>
                   <div className="text-xl font-bold text-[#fceeb5] font-serif">{pesoActual} <span className="text-[10px] text-[#8c7b65] font-sans">kg</span></div>
                </div>
                <div className="flex flex-col items-center text-center p-3 hover:bg-[#1a120d] transition">
                   <Flame size={20} className="text-[#fcd34d] mb-1 drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]"/>
                   <div className="text-[9px] text-[#a68c69] uppercase tracking-widest">% Grasa</div>
                   <div className="text-xl font-bold text-[#fceeb5] font-serif">{grasaPctActual.toFixed(1)} <span className="text-[10px] text-[#8c7b65] font-sans">%</span></div>
                </div>
                <div className="flex flex-col items-center text-center p-3 hover:bg-[#1a120d] transition">
                   <BicepsFlexed size={20} className="text-[#60a5fa] mb-1 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]"/>
                   <div className="text-[9px] text-[#a68c69] uppercase tracking-widest">% Músculo</div>
                   <div className="text-xl font-bold text-[#fceeb5] font-serif">{musculoPctActual.toFixed(1)} <span className="text-[10px] text-[#8c7b65] font-sans">%</span></div>
                </div>
                <div className="flex flex-col items-center text-center p-3 hover:bg-[#1a120d] transition">
                   <Shield size={20} className="text-[#c084fc] mb-1 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]"/>
                   <div className="text-[9px] text-[#a68c69] uppercase tracking-widest">Cintura</div>
                   <div className="text-xl font-bold text-[#fceeb5] font-serif">{cinturaActual} <span className="text-[10px] text-[#8c7b65] font-sans">cm</span></div>
                </div>
                <div className="flex flex-col items-center text-center p-3 hover:bg-[#1a120d] transition">
                   <Droplet size={20} className="text-[#fb923c] mb-1 drop-shadow-[0_0_5px_rgba(251,146,60,0.8)]"/>
                   <div className="text-[9px] text-[#a68c69] uppercase tracking-widest">Visceral</div>
                   <div className="text-xl font-bold text-[#fceeb5] font-serif">{visceralActual} <span className="text-[10px] text-[#8c7b65] font-sans">nv</span></div>
                </div>
             </div>
          </div>

          {/* --- SECCIÓN DE JEFES ACTIVOS --- */}
          <div>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-[#ef4444] uppercase tracking-widest wow-font">
              <Skull size={18} className="drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"/> Cacería en Curso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {activePesoBoss && (
                <div className="wow-panel p-4 shadow-[0_0_20px_rgba(220,38,38,0.15)] flex flex-col justify-between border-[#7f1d1d]">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-[#fca5a5] mb-1 flex items-center gap-1"><Sword size={10}/> Boss de Peso</h4>
                      <h3 className="text-lg wow-font font-bold text-[#fef2f2] leading-tight">{activePesoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-[#110c08] border border-[#450a0a] p-1.5 rounded-sm ml-2 shrink-0"><div className="text-xl">{activePesoBoss.icono}</div></div>
                  </div>
                  <div className="w-full wow-health-bar rounded-sm h-5 overflow-hidden relative mt-3">
                    <div className="wow-health-fill h-full transition-all duration-1000 ease-out" style={{ width: `${activePesoBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#fceeb5] text-[10px] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,1)] pointer-events-none">HP: {activePesoBoss.hpRemaining.toFixed(1)} / {activePesoBoss.maxHp.toFixed(1)} kg</div>
                  </div>
                </div>
              )}

              {activeCinturaBoss && (
                <div className="wow-panel p-4 shadow-[0_0_20px_rgba(147,51,234,0.15)] flex flex-col justify-between border-[#4c1d95]">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-[#d8b4fe] mb-1 flex items-center gap-1"><Shield size={10}/> Boss de Cintura</h4>
                      <h3 className="text-lg wow-font font-bold text-[#faf5ff] leading-tight">{activeCinturaBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-[#110c08] border border-[#3b0764] p-1.5 rounded-sm ml-2 shrink-0"><div className="text-xl">{activeCinturaBoss.icono}</div></div>
                  </div>
                  <div className="w-full wow-health-bar rounded-sm h-5 overflow-hidden relative mt-3">
                    <div className="wow-health-fill h-full transition-all duration-1000 ease-out" style={{ width: `${activeCinturaBoss.hpPct}%`, background: 'linear-gradient(to bottom, #9333ea, #581c87)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#fceeb5] text-[10px] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,1)] pointer-events-none">HP: {activeCinturaBoss.hpRemaining.toFixed(1)} / {activeCinturaBoss.maxHp.toFixed(1)} cm</div>
                  </div>
                </div>
              )}

              {activeVisceralBoss && (
                <div className="wow-panel p-4 shadow-[0_0_20px_rgba(234,88,12,0.15)] flex flex-col justify-between border-[#7c2d12]">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-[#fdba74] mb-1 flex items-center gap-1"><Droplet size={10}/> Boss Visceral</h4>
                      <h3 className="text-lg wow-font font-bold text-[#fff7ed] leading-tight">{activeVisceralBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-[#110c08] border border-[#431407] p-1.5 rounded-sm ml-2 shrink-0"><div className="text-xl">{activeVisceralBoss.icono}</div></div>
                  </div>
                  <div className="w-full wow-health-bar rounded-sm h-5 overflow-hidden relative mt-3">
                    <div className="wow-health-fill h-full transition-all duration-1000 ease-out" style={{ width: `${activeVisceralBoss.hpPct}%`, background: 'linear-gradient(to bottom, #ea580c, #9a3412)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#fceeb5] text-[10px] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,1)] pointer-events-none">HP: {activeVisceralBoss.hpRemaining.toFixed(1)} / {activeVisceralBoss.maxHp.toFixed(1)} nv</div>
                  </div>
                </div>
              )}

              {activeMusculoBoss && (
                <div className="wow-panel p-4 shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col justify-between border-[#1e3a8a]">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[9px] uppercase tracking-widest text-[#93c5fd] mb-1 flex items-center gap-1"><BicepsFlexed size={10}/> Boss de Debilidad</h4>
                      <h3 className="text-lg wow-font font-bold text-[#eff6ff] leading-tight">{activeMusculoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-[#110c08] border border-[#172554] p-1.5 rounded-sm ml-2 shrink-0"><div className="text-xl">{activeMusculoBoss.icono}</div></div>
                  </div>
                  <div className="w-full wow-health-bar rounded-sm h-5 overflow-hidden relative mt-3">
                    <div className="wow-health-fill h-full transition-all duration-1000 ease-out" style={{ width: `${activeMusculoBoss.hpPct}%`, background: 'linear-gradient(to bottom, #3b82f6, #1e40af)' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[#fceeb5] text-[10px] font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,1)] pointer-events-none">HP: {activeMusculoBoss.hpRemaining.toFixed(1)} / {activeMusculoBoss.maxHp.toFixed(1)} %</div>
                  </div>
                </div>
              )}

              {(!activePesoBoss && !activeCinturaBoss && !activeVisceralBoss && !activeMusculoBoss) && (
                <div className="col-span-full wow-inset border-[#059669]/50 p-6 rounded-sm flex flex-col items-center justify-center text-center bg-[#022c22]/30">
                  <Trophy className="text-[#34d399] mb-2 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" size={40} />
                  <h3 className="text-[#6ee7b7] font-bold text-xl wow-header">Reino Purificado</h3>
                  <p className="text-xs text-[#a68c69] mt-2">Has masacrado a todas las bestias. Eres una leyenda viviente.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- HISTORIAL DE BATALLA PLEGABLE --- */}
          <div className="wow-panel overflow-hidden">
            <button onClick={() => setHistorialAbierto(!historialAbierto)} className="w-full flex items-center justify-between bg-[#1a120d] hover:bg-[#261b14] p-5 font-semibold text-lg transition text-[#fceeb5] border-b border-[#332215] wow-font uppercase tracking-widest text-sm">
              <div className="flex items-center gap-2"><Activity size={18} className="text-[#fcd34d]" /> Archivos Reales (Gráficos)</div>
              {historialAbierto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {historialAbierto && (
              <div className="p-5 animate-in slide-in-from-top-2 fade-in bg-[#0a0705]">
                
                {/* Selector de Gráfico */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <button onClick={() => setChartStat('peso')} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition border ${chartStat==='peso'?'bg-[#7f1d1d] text-[#fca5a5] border-[#ef4444]':'bg-[#110c08] text-[#a68c69] border-[#332215] hover:border-[#a68c69]'}`}>Peso (kg)</button>
                  <button onClick={() => setChartStat('grasaPct')} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition border ${chartStat==='grasaPct'?'bg-[#78350f] text-[#fde047] border-[#fcd34d]':'bg-[#110c08] text-[#a68c69] border-[#332215] hover:border-[#a68c69]'}`}>Grasa (%)</button>
                  <button onClick={() => setChartStat('musculoPct')} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition border ${chartStat==='musculoPct'?'bg-[#1e3a8a] text-[#bfdbfe] border-[#60a5fa]':'bg-[#110c08] text-[#a68c69] border-[#332215] hover:border-[#a68c69]'}`}>Músculo (%)</button>
                  <button onClick={() => setChartStat('cintura')} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition border ${chartStat==='cintura'?'bg-[#4c1d95] text-[#e9d5ff] border-[#c084fc]':'bg-[#110c08] text-[#a68c69] border-[#332215] hover:border-[#a68c69]'}`}>Cintura (cm)</button>
                  <button onClick={() => setChartStat('visceral')} className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition border ${chartStat==='visceral'?'bg-[#7c2d12] text-[#fed7aa] border-[#fb923c]':'bg-[#110c08] text-[#a68c69] border-[#332215] hover:border-[#a68c69]'}`}>Visceral</button>
                </div>

                <div className="w-full h-56 wow-inset rounded-sm p-6 relative overflow-hidden mb-6">
                   {historialOrdenado.length > 1 ? (
                     <div className="w-full h-full relative">
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                           <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#332215" strokeDasharray="4,4" strokeWidth="1" />
                           <line x1="0" y1="75" x2="500" y2="75" stroke="#4a3320" strokeDasharray="4,4" strokeWidth="1" />
                           <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#332215" strokeDasharray="4,4" strokeWidth="1" />
                           
                           {/* Color de línea dinámico */}
                           <polyline fill="none" stroke={chartStat==='peso'?'#ef4444':chartStat==='grasaPct'?'#fcd34d':chartStat==='musculoPct'?'#60a5fa':chartStat==='cintura'?'#c084fc':'#fb923c'} strokeWidth="3" points={polylinePoints} strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"/>
                           
                           {chartPoints.map((p, i) => (
                             <g key={i}>
                               <circle cx={p.x} cy={p.y} r="4" fill="#0d0906" stroke={chartStat==='peso'?'#ef4444':chartStat==='grasaPct'?'#fcd34d':chartStat==='musculoPct'?'#60a5fa':chartStat==='cintura'?'#c084fc':'#fb923c'} strokeWidth="2" />
                               {(i === 0 || i === chartPoints.length - 1 || chartPoints.length <= 5) && (
                                 <text x={p.x} y={p.y - 12} fill="#e5d5b6" fontSize="10" textAnchor="middle" fontWeight="bold" style={{textShadow: '0 1px 2px black'}}>
                                   {p.val}
                                 </text>
                               )}
                             </g>
                           ))}
                        </svg>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center h-full text-[#a68c69] italic font-serif">Las crónicas requieren más pergaminos (datos).</div>
                   )}
                </div>

                <div className="overflow-x-auto wow-scrollbar">
                  <table className="w-full text-left text-sm text-[#e5d5b6] whitespace-nowrap font-mono border border-[#332215]">
                    <thead className="text-[10px] uppercase bg-[#1a120d] text-[#b45309] border-b border-[#4a3320]">
                      <tr>
                        <th className="p-3">Fecha</th><th className="p-3">Peso</th><th className="p-3">Grasa %</th><th className="p-3">Músculo %</th><th className="p-3">Cintura</th><th className="p-3">Visceral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#332215]">
                      {historialOrdenado.slice().reverse().map((h, idx) => {
                        const prev = historialOrdenado.slice().reverse()[idx + 1];
                        const renderDelta = (valAct, valPrev, isMuscle = false) => {
                          if (!valPrev) return null;
                          const diff = valAct - valPrev;
                          if (diff === 0) return <span className="text-[#7d674c] text-[10px] ml-2">(-)</span>;
                          const color = isMuscle ? (diff > 0 ? 'text-[#34d399]' : 'text-[#ef4444]') : (diff > 0 ? 'text-[#ef4444]' : 'text-[#34d399]');
                          return <span className={`${color} text-[10px] ml-2`}>({diff > 0 ? '+' : ''}{diff.toFixed(1)})</span>;
                        };

                        return (
                          <tr key={idx} className="hover:bg-[#1a120d] transition bg-[#0d0906]">
                            <td className="p-3 text-[#a68c69]">{h.fecha}</td>
                            <td className="p-3 font-bold">{h.peso} {renderDelta(h.peso, prev?.peso)}</td>
                            <td className="p-3">{h.grasaPct}% {renderDelta(h.grasaPct, prev?.grasaPct)}</td>
                            <td className="p-3">{h.musculoPct || '-'}% {renderDelta(h.musculoPct, prev?.musculoPct, true)}</td>
                            <td className="p-3">{h.cintura}cm {renderDelta(h.cintura, prev?.cintura)}</td>
                            <td className="p-3">{h.visceral}nv {renderDelta(h.visceral, prev?.visceral)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* --- BIO-ESCÁNER AVANZADO --- */}
          <div className="wow-panel p-6 border-[#1e3a8a]/40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#172554]/40 to-transparent">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-[#60a5fa] uppercase tracking-widest wow-font">
              <Activity size={18}/> Tablillas del Boticario (Bio-Scan)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center wow-inset p-3 rounded-sm border-[#1e3a8a]/30">
                  <div><div className="text-[10px] text-[#93c5fd] uppercase tracking-widest">TMB (Poder Base)</div><div className="text-xs text-[#a68c69] italic">Vitalidad en reposo</div></div>
                  <div className="text-xl font-bold text-[#fceeb5] font-serif">{bio.tmb.toFixed(0)} <span className="text-[10px] font-sans text-[#a68c69]">kcal</span></div>
                </div>
                <div className="flex justify-between items-center wow-inset p-3 rounded-sm border-l-4 border-l-[#fb923c] border-[#7c2d12]/50">
                  <div><div className="text-[10px] text-[#fdba74] uppercase tracking-widest">TDEE (Consumo Diario)</div><div className="text-xs text-[#a68c69] italic">Gasto con actividad</div></div>
                  <div className="text-xl font-bold text-[#fb923c] font-serif">{bio.tdee.toFixed(0)} <span className="text-[10px] font-sans text-[#a68c69]">kcal</span></div>
                </div>
                <div className="wow-inset border-[#064e3b]/40 p-3 rounded-sm mt-4 bg-[#022c22]/20">
                   <div className="text-[10px] text-[#34d399] font-bold mb-2 uppercase tracking-widest text-center">Profecía de la Salud Ideal:</div>
                   <div className="grid grid-cols-2 gap-2 text-sm text-center">
                      <div className="border-r border-[#064e3b]/40">
                        <span className="text-[#a68c69] block text-[9px] uppercase">Peso Ideal</span>
                        <span className="text-[#fceeb5] font-mono">{bio.pesoIdealMin.toFixed(1)}-{bio.pesoIdealMax.toFixed(1)}kg</span>
                      </div>
                      <div>
                        <span className="text-[#a68c69] block text-[9px] uppercase">Grasa Ideal</span>
                        <span className="text-[#fceeb5] font-mono">{bio.grasaIdealMin}%-{bio.grasaIdealMax}%</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="wow-inset border-[#332215] p-5 rounded-sm flex flex-col justify-center">
                 <div className="text-center mb-3"><span className="text-[#fcd34d] text-[10px] uppercase tracking-widest font-bold">Índice de Constitución (IMC)</span></div>
                 <IMCBar imc={bio.imc} />
                 <div className="mt-6 text-xs text-center text-[#a68c69] font-serif italic">
                   {bio.imc < 18.5 && "Constitución Frágil. ¡Consume más raciones de carne y descansa, guerrero!"}
                   {bio.imc >= 18.5 && bio.imc < 25 && "Constitución Óptima. Tus estadísticas de aguante son dignas de un héroe."}
                   {bio.imc >= 25 && bio.imc < 30 && "Constitución Robusta (Sobrepeso). Llevas armadura pesada, aligera la carga."}
                   {bio.imc >= 30 && "Constitución Peligrosa (Obesidad). El enemigo interno acecha, necesitas disciplina estricta."}
                 </div>
              </div>
            </div>
          </div>

          {/* BESTIARIO Y BOTÍN */}
          <div>
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-[#fcd34d] uppercase tracking-widest wow-font">
              <Trophy size={18} className="drop-shadow-[0_0_5px_rgba(252,211,77,0.8)]"/> Sala de Trofeos (Bestiario)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {bosses.sort((a,b) => a.valor - b.valor).map((boss) => {
                let progresoActual = 0;
                if(boss.tipo === 'peso') progresoActual = kilosPerdidos;
                if(boss.tipo === 'cintura') progresoActual = cinturaPerdidaCm;
                if(boss.tipo === 'visceral') progresoActual = visceralPerdida;
                if(boss.tipo === 'musculo') progresoActual = musculoGanadoPct;

                const derrotado = progresoActual >= boss.valor;
                
                const colorBorde = boss.tipo === 'peso' ? 'border-[#7f1d1d]' : boss.tipo === 'cintura' ? 'border-[#4c1d95]' : boss.tipo === 'musculo' ? 'border-[#1e3a8a]' : 'border-[#7c2d12]';
                const unidad = boss.tipo === 'peso' ? 'kg' : boss.tipo === 'cintura' ? 'cm' : boss.tipo === 'musculo' ? '%' : 'nv';
                const iconoTipo = boss.tipo === 'peso' ? <Sword size={12}/> : boss.tipo === 'cintura' ? <Shield size={12}/> : boss.tipo === 'musculo' ? <BicepsFlexed size={12}/> : <Droplet size={12}/>;
                const typeText = boss.tipo === 'peso' ? 'text-[#fca5a5]' : boss.tipo === 'cintura' ? 'text-[#d8b4fe]' : boss.tipo === 'musculo' ? 'text-[#93c5fd]' : 'text-[#fdba74]';
                
                const bgStyle = derrotado ? `bg-[#1a120d] ${colorBorde}` : 'wow-inset opacity-50 grayscale';

                return (
                  <div key={boss.id} className={`p-3 rounded-sm border-2 text-center relative transition-all duration-500 ${bgStyle}`}>
                    <div className={`absolute top-1.5 right-1.5 ${derrotado ? typeText : 'text-[#4a3320]'}`}>{iconoTipo}</div>
                    
                    <div className="text-3xl mb-1 mt-2 filter drop-shadow-lg">{derrotado ? '💀' : '👹'}</div>
                    <div className={`text-[10px] font-bold truncate uppercase tracking-wider ${derrotado ? 'line-through text-[#a68c69]' : 'text-[#e5d5b6]'} wow-font`}>
                      {boss.nombre}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-[#332215]">
                      <div className="text-2xl mb-1 filter drop-shadow-[0_0_5px_rgba(252,211,77,0.5)]">{derrotado ? boss.icono : '🔒'}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-widest ${derrotado ? 'text-[#fcd34d]' : 'text-[#7d674c]'}`}>
                        {derrotado ? 'DESPOJADO' : 'CERRADO'}
                      </div>
                      <div className={`text-[10px] truncate ${derrotado ? 'text-[#fceeb5]' : 'text-[#a68c69]'}`}>{boss.premio}</div>
                      <div className="text-[9px] text-[#7d674c] mt-1 font-mono">Daño Req: {boss.valor}{unidad}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FitRPG;