import React, { useState, useEffect } from 'react';
import { Trophy, Sword, Activity, Save, PlusCircle, Settings, Trash2, X, Edit3, Ruler, Flame, Heart, Info, Skull, Shield, Droplet, Target, ChevronDown, ChevronUp, Star, AlertTriangle, BicepsFlexed } from 'lucide-react';

// --- CONSTANTES Y BASES DE DATOS ---
const LOOT_ICONS = ['🍔', '🍕', '🍺', '🎮', '👕', '👟', '🛀', '✈️', '📸', '📱', '⌚', '💻', '🎫', '🍿', '🎸', '📚', '🏆', '👑', '💎', '💰', '🎁', '🗡️', '🛡️', '🧪', '🔮', '🎉', '🏖️', '🏕️', '🚗', '🛍️', '💆'];

const CONSEJOS_SALUD = [
  "🛡️ Misión de Resistencia: Evita los carbohidratos refinados (pan blanco, galletas) después de las 6 PM. Sustitúyelos por proteínas y vegetales para evitar picos de insulina.",
  "🏃‍♂️ Misión de Agilidad: Sal a trotar o realizar una caminata rápida de 30 minutos al menos 3 veces esta semana. Tu metabolismo basal aumentará.",
  "🥩 Misión de Fuerza: Consume entre 1.6g y 2g de proteína por kilo de tu peso ideal diario. Esto blindará tu masa muscular mientras oxidas grasa.",
  "💧 Misión de Purificación: Bebe un vaso de agua grande justo al despertar y otro antes de cada comida. Reduce la ansiedad y mejora el rendimiento celular.",
  "🛌 Misión de Recuperación: Apaga pantallas 1 hora antes de dormir y asegura 7-8 horas de sueño ininterrumpido. El cortisol bajo destruye la armadura del Jefe Grasa.",
  "⚔️ Misión Táctica: Lee las etiquetas. Si el azúcar o jarabe de maíz está entre los primeros 3 ingredientes, ¡es una trampa tóxica! Evítalo.",
  "🥦 Misión de Fortificación: Añade una porción de vegetales fibrosos (brócoli, espinaca, espárragos) a tu comida principal hoy para mejorar tu saciedad y digestión.",
  "🧘‍♂️ Misión de Claridad: El estrés genera hormonas que almacenan grasa visceral. Dedica 10 minutos de esta semana a respirar profundamente o meditar.",
  "⚡ Misión de Ráfaga: Incorpora 15 minutos de entrenamiento HIIT (Alta Intensidad) dos veces esta semana para crear una 'deuda de oxígeno' que queme grasa extra.",
  "🕰️ Misión de Disciplina: Practica un ayuno ligero de 12 a 14 horas (ej. cena a las 8 PM y desayuna a las 10 AM). Esto entrena a tu cuerpo para usar grasa como combustible."
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

// --- FUNCIÓN AUXILIAR PARA CALCULAR LA EDAD ---
const calcularEdad = (fechaNacStr) => {
  if (!fechaNacStr) return 0;
  const hoy = new Date();
  const cumpleanos = new Date(fechaNacStr);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
  }
  return Math.max(0, edad);
};

const FitRPG = () => {
  // --- ESTADO INICIAL CON LOCALSTORAGE ---
  const [metaPeso, setMetaPeso] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaPeso');
    return saved !== null ? JSON.parse(saved) : 75.0;
  });

  const [metaGrasa, setMetaGrasa] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaGrasa');
    return saved !== null ? JSON.parse(saved) : 20.0;
  });

  const [metaCintura, setMetaCintura] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaCintura');
    return saved !== null ? JSON.parse(saved) : 85.0;
  });

  const [metaVisceral, setMetaVisceral] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaVisceral');
    return saved !== null ? JSON.parse(saved) : 9.0;
  });

  const [metaMusculo, setMetaMusculo] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaMusculo');
    return saved !== null ? JSON.parse(saved) : 40.0;
  });
  
  const [perfil, setPerfil] = useState(() => {
    const saved = localStorage.getItem('fitrpg_perfil');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (parsed.edad && !parsed.fechaNacimiento) {
        const currentYear = new Date().getFullYear();
        parsed.fechaNacimiento = `${currentYear - parsed.edad}-01-01`;
        delete parsed.edad;
      }
      return parsed;
    }
    return { altura: 175, fechaNacimiento: '1990-01-01', genero: 'hombre', actividad: 1.2 };
  });

  const [historial, setHistorial] = useState(() => {
    const saved = localStorage.getItem('fitrpg_historial');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [bosses, setBosses] = useState(() => {
    const saved = localStorage.getItem('fitrpg_bosses_v4');
    return saved !== null ? JSON.parse(saved) : [];
  });

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
  const [chartStat, setChartStat] = useState('peso'); // Selector de gráfica
  
  const [pickerOpenId, setPickerOpenId] = useState(null);

  // Sistema de Eventos (Victoria y Derrota)
  const [jefesDerrotadosRecientes, setJefesDerrotadosRecientes] = useState([]);
  const [retrocesoInfo, setRetrocesoInfo] = useState(null);

  // --- ESTADOS DE ONBOARDING (CREACIÓN DE HÉROE) ---
  const [onboardingData, setOnboardingData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso: '', grasaPct: '', musculoPct: '', cintura: '', visceral: '',
    altura: 175, fechaNacimiento: '', genero: 'hombre', actividad: 1.2
  });
  const [onboardingError, setOnboardingError] = useState('');

  const comenzarAventura = () => {
    const { peso, grasaPct, musculoPct, cintura, visceral, altura, fechaNacimiento, genero, actividad, fecha } = onboardingData;

    if (!peso || !grasaPct || !musculoPct || !cintura || !visceral || !altura || !fechaNacimiento) {
      setOnboardingError("¡Faltan atributos! Llena todos los campos para forjar tu destino.");
      return;
    }

    const p = parseFloat(peso);
    const gPct = parseFloat(grasaPct);
    const mPct = parseFloat(musculoPct);
    const c = parseFloat(cintura);
    const v = parseFloat(visceral);
    const alt = parseFloat(altura);

    const mPeso = 22 * Math.pow(alt / 100, 2);
    const mGrasa = genero === 'hombre' ? 15 : 24;
    const mCintura = alt / 2;
    const mVisceral = 9;
    const metaMusc = mPct + 5.0; // Meta por defecto: ganar 5% de masa muscular

    const metaPesoObj = parseFloat(mPeso.toFixed(1));
    const metaCinturaObj = parseFloat(mCintura.toFixed(1));

    setMetaPeso(metaPesoObj);
    setMetaGrasa(mGrasa);
    setMetaCintura(metaCinturaObj);
    setMetaVisceral(mVisceral);
    setMetaMusculo(metaMusc);

    setPerfil({
      altura: alt,
      fechaNacimiento: fechaNacimiento,
      genero: genero,
      actividad: parseFloat(actividad)
    });

    const nuevosBosses = [];
    let idCounter = 1;

    const kgToLose = p - metaPesoObj;
    if (kgToLose > 0) {
      let currentStep = 5;
      while (currentStep < kgToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'peso', valor: currentStep, nombre: generarNombreJefe('peso'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 5;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'peso', valor: parseFloat(kgToLose.toFixed(1)), nombre: "Lord Grasa (Jefe Final)", premio: "Gran Victoria de Peso", icono: "👑" });
    }

    const cmToLose = c - metaCinturaObj;
    if (cmToLose > 0) {
      let currentStep = 5;
      while (currentStep < cmToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'cintura', valor: currentStep, nombre: generarNombreJefe('cintura'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 5;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'cintura', valor: parseFloat(cmToLose.toFixed(1)), nombre: "El Opresor (Jefe Final)", premio: "Victoria de Cintura", icono: "👑" });
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

    // Jefes de Músculo (cada 2% ganado)
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
    const grasaKg = parseFloat((p * (gPct / 100)).toFixed(2));
    setHistorial([{ fecha: fecha, peso: p, grasaPct: gPct, musculoPct: mPct, grasaKg: grasaKg, cintura: c, visceral: v }]);
  };

  // --- EFECTO DE GUARDADO AUTOMÁTICO ---
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
      const p = parseFloat(nuevoPeso);
      const g = parseFloat(nuevoGrasaPct);
      if (!isNaN(p) && !isNaN(g)) {
        const kgs = (p * (g / 100)).toFixed(2);
        setNuevoGrasaKg(kgs);
      }
    }
  }, [nuevoPeso, nuevoGrasaPct]);

  // --- PANTALLA DE CREACIÓN DE PERSONAJE (ONBOARDING) ---
  if (historial.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 flex items-center justify-center relative">
        <div className="bg-gray-800 p-6 md:p-10 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-3xl w-full relative z-10">
          <div className="text-center mb-8">
            <Sword size={48} className="mx-auto text-emerald-400 mb-4" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Forja tu Destino</h1>
            <p className="text-gray-400 mt-2">Bienvenido a FitRPG. Ingresa tus atributos iniciales para calcular tus misiones, metas y enemigos.</p>
          </div>

          {onboardingError && (
             <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-center text-sm mb-6 font-bold">
              {onboardingError}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-emerald-400 font-bold flex items-center gap-2 border-b border-gray-700 pb-2"><Heart size={18} /> Tu Héroe (Biometría)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Género</label>
                  <select value={onboardingData.genero} onChange={(e) => setOnboardingData({...onboardingData, genero: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none">
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">F. Nacimiento</label>
                  <input type="date" value={onboardingData.fechaNacimiento} onChange={(e) => setOnboardingData({...onboardingData, fechaNacimiento: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Altura (cm)</label>
                  <input type="number" value={onboardingData.altura} onChange={(e) => setOnboardingData({...onboardingData, altura: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Nivel Actividad</label>
                  <select value={onboardingData.actividad} onChange={(e) => setOnboardingData({...onboardingData, actividad: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none">
                    <option value="1.2">Sedentario (Poco ejercicio)</option>
                    <option value="1.375">Ligero (1-3 días/sem)</option>
                    <option value="1.55">Moderado (3-5 días/sem)</option>
                    <option value="1.725">Intenso (6-7 días/sem)</option>
                    <option value="1.9">Atleta Pro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-red-400 font-bold flex items-center gap-2 border-b border-gray-700 pb-2"><Skull size={18} /> Punto de Partida (Maldición)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Fecha de Inicio</label>
                  <input type="date" value={onboardingData.fecha} onChange={(e) => setOnboardingData({...onboardingData, fecha: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Peso Inicial (kg)</label>
                  <input type="number" placeholder="Ej: 95.5" value={onboardingData.peso} onChange={(e) => setOnboardingData({...onboardingData, peso: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Cintura (cm)</label>
                  <input type="number" placeholder="Ej: 105" value={onboardingData.cintura} onChange={(e) => setOnboardingData({...onboardingData, cintura: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">% Grasa</label>
                  <input type="number" placeholder="Ej: 32" value={onboardingData.grasaPct} onChange={(e) => setOnboardingData({...onboardingData, grasaPct: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">% Músculo</label>
                  <input type="number" placeholder="Ej: 35" value={onboardingData.musculoPct} onChange={(e) => setOnboardingData({...onboardingData, musculoPct: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Visceral (Nv)</label>
                  <input type="number" placeholder="Ej: 15" value={onboardingData.visceral} onChange={(e) => setOnboardingData({...onboardingData, visceral: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"/>
                </div>
              </div>
            </div>
          </div>

          <button onClick={comenzarAventura} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02]">
            <Sword size={24} /> ¡Comenzar la Aventura!
          </button>
        </div>
      </div>
    );
  }

  // --- CÁLCULOS PRINCIPALES DEL HISTORIAL ---
  const historialOrdenado = [...historial].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const datosIniciales = historialOrdenado[0] || {};
  const ultimoRegistro = historialOrdenado[historialOrdenado.length - 1] || {};
  const registroAnterior = historialOrdenado.length > 1 ? historialOrdenado[historialOrdenado.length - 2] : datosIniciales;
  
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

  // --- LÓGICA DE JEFES ACTIVOS (BOSS RUSH) ---
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

  // --- CÁLCULOS BIO-ESCÁNER ---
  const edadCalculada = calcularEdad(perfil.fechaNacimiento);

  const calcularMetabolismo = () => {
    const pActual = pesoActual || 0;
    const pAltura = perfil.altura || 0;
    const pEdad = edadCalculada;

    let tmb = (10 * pActual) + (6.25 * pAltura) - (5 * pEdad);
    tmb = perfil.genero === 'hombre' ? tmb + 5 : tmb - 161;
    if (tmb < 0) tmb = 0;

    const tdee = tmb * perfil.actividad;
    const alturaMetros = pAltura / 100;
    let imc = 0;
    let pesoIdealMin = 0;
    let pesoIdealMax = 0;

    if (alturaMetros > 0) {
      imc = pActual / (alturaMetros * alturaMetros);
      pesoIdealMin = 18.5 * (alturaMetros * alturaMetros);
      pesoIdealMax = 24.9 * (alturaMetros * alturaMetros);
    }
    
    const grasaIdealMin = perfil.genero === 'hombre' ? 10 : 18;
    const grasaIdealMax = perfil.genero === 'hombre' ? 20 : 28;

    return { tmb, tdee, imc, pesoIdealMin, pesoIdealMax, grasaIdealMin, grasaIdealMax };
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

    // Detección de Retroceso
    const huboRetroceso = p > pesoActual || c > cinturaActual || v > visceralActual || m < musculoPctActual;
    let deltaRetroceso = "";
    if (p > pesoActual) deltaRetroceso += `+${(p - pesoActual).toFixed(1)}kg `;
    if (c > cinturaActual) deltaRetroceso += `+${(c - cinturaActual).toFixed(1)}cm `;
    if (v > visceralActual) deltaRetroceso += `+${(v - visceralActual).toFixed(1)}nv `;
    if (m < musculoPctActual) deltaRetroceso += `-${(musculoPctActual - m).toFixed(1)}% mús`;

    // Detección de Victoria
    let bossesRecienDerrotados = [];
    bosses.forEach(b => {
      let progresoViejo = 0;
      let progresoNuevo = 0;
      if (b.tipo === 'peso') { progresoViejo = kilosPerdidos; progresoNuevo = newKilosPerdidos; }
      else if (b.tipo === 'cintura') { progresoViejo = cinturaPerdidaCm; progresoNuevo = newCinturaPerdida; }
      else if (b.tipo === 'visceral') { progresoViejo = visceralPerdida; progresoNuevo = newVisceralPerdida; }
      else if (b.tipo === 'musculo') { progresoViejo = musculoGanadoPct; progresoNuevo = newMusculoGanado; }
      
      if (progresoViejo < b.valor && progresoNuevo >= b.valor) {
        bossesRecienDerrotados.push(b);
      }
    });

    const nuevoRegistro = {
      fecha: nuevaFecha,
      peso: p,
      grasaPct: nuevoGrasaPct ? parseFloat(nuevoGrasaPct) : grasaPctActual,
      musculoPct: m,
      grasaKg: nuevoGrasaKg ? parseFloat(nuevoGrasaKg) : (p * (parseFloat(nuevoGrasaPct || grasaPctActual) / 100)),
      cintura: c,
      visceral: v
    };

    setHistorial([...historial, nuevoRegistro]);

    if (huboRetroceso && deltaRetroceso !== "") {
      setRetrocesoInfo({
        mensaje: `Has perdido terreno en la batalla (${deltaRetroceso.trim()}). Algunos enemigos podrían haber recuperado vida.`,
        consejo: CONSEJOS_SALUD[Math.floor(Math.random() * CONSEJOS_SALUD.length)]
      });
    } else if (bossesRecienDerrotados.length > 0) {
      setJefesDerrotadosRecientes(bossesRecienDerrotados);
    }

    setNuevoPeso('');
    setNuevoGrasaPct('');
    setNuevoGrasaKg('');
    setNuevoMusculoPct('');
    setNuevaCintura('');
    setNuevoVisceral('');
    setRegistroAbierto(false); 
  };

  const actualizarInicio = (campo, valor) => {
    const nuevosDatos = [...historialOrdenado];
    if (nuevosDatos.length > 0) {
      nuevosDatos[0] = { ...nuevosDatos[0], [campo]: valor };
      setHistorial(nuevosDatos);
    }
  };

  const actualizarPerfil = (campo, valor) => setPerfil({ ...perfil, [campo]: valor });

  const agregarBoss = () => {
    const nuevoId = Math.max(...bosses.map(h => h.id), 0) + 1;
    setBosses([...bosses, { id: nuevoId, tipo: 'peso', valor: 5, nombre: generarNombreJefe('peso'), premio: "Premio Sorpresa", icono: "🎁" }]);
  };

  const actualizarBoss = (id, campo, valor) => {
    setBosses(bosses.map(b => b.id === id ? { ...b, [campo]: valor } : b));
  };

  const borrarBoss = (id) => setBosses(bosses.filter(b => b.id !== id));

  const borrarPartida = () => {
    if (window.confirm("⚠️ ¿Estás seguro de que deseas borrar toda tu aventura? Esto reiniciará la aplicación a los datos por defecto y no se puede deshacer.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- GUARDAR CONFIGURACIÓN Y AJUSTAR JEFES A NUEVAS METAS ---
  const guardarYCerrarConfig = () => {
    const kgToLose = Math.max(0, pesoInicial - metaPeso);
    const cmToLose = Math.max(0, cinturaInicial - metaCintura);
    const vToLose = Math.max(0, visceralInicial - metaVisceral);
    const mToGain = Math.max(0, metaMusculo - musculoInicial);

    setBosses(prev => {
      let newBosses = [...prev];
      
      const updateFinalBoss = (tipo, newValor) => {
        const typeBosses = newBosses.filter(b => b.tipo === tipo).sort((a,b) => a.valor - b.valor);
        if (typeBosses.length > 0) {
          const finalBoss = typeBosses[typeBosses.length - 1];
          const prevBoss = typeBosses.length > 1 ? typeBosses[typeBosses.length - 2] : null;
          if (!prevBoss || newValor > prevBoss.valor) {
            finalBoss.valor = parseFloat(newValor.toFixed(1));
          } else {
             finalBoss.valor = parseFloat(newValor.toFixed(1));
          }
        }
      };

      updateFinalBoss('peso', kgToLose);
      updateFinalBoss('cintura', cmToLose);
      updateFinalBoss('visceral', vToLose);
      updateFinalBoss('musculo', mToGain);

      return newBosses;
    });

    setMostrarConfig(false);
  };

  const generarPuntosGrafico = () => {
    if (historialOrdenado.length < 2) return [];
    
    const data = historialOrdenado.map(h => h[chartStat] || 0);
    const minData = Math.min(...data);
    const maxData = Math.max(...data);
    const padding = (maxData - minData) * 0.2 || 1;
    const minVal = minData - padding;
    const maxVal = maxData + padding;
    
    const width = 500;
    const height = 150;
    
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
    const minScale = 15;
    const maxScale = 40;
    const safeIMC = isNaN(imc) ? 0 : imc; 
    const percent = Math.min(100, Math.max(0, ((safeIMC - minScale) / (maxScale - minScale)) * 100));
    
    return (
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Bajo</span>
          <span>Normal</span>
          <span>Alto</span>
          <span>Obesidad</span>
        </div>
        <div className="relative h-6 w-full rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-500 w-[14%]"></div>
          <div className="h-full bg-emerald-500 w-[26%]"></div>
          <div className="h-full bg-yellow-500 w-[20%]"></div>
          <div className="h-full bg-red-500 flex-1"></div>
          
          <div 
            className="absolute top-0 bottom-0 w-2 bg-transparent border-x-[3px] border-white shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all duration-1000 z-10 flex justify-center -translate-x-1"
            style={{ left: `${percent}%` }}
          >
             <div className="absolute -top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[10px]">
                {safeIMC < 18.5 ? '❄️' : safeIMC < 25 ? '😊' : safeIMC < 30 ? '⚠️' : '🔥'}
             </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENTE DE ANIMACIÓN DE VICTORIA ---
  const BossDefeatedModal = () => {
    if (jefesDerrotadosRecientes.length === 0) return null;
    const boss = jefesDerrotadosRecientes[0];
    return (
      <div className="fixed inset-0 z-[110] bg-black/90 flex flex-col items-center justify-center p-4">
        <button onClick={() => setJefesDerrotadosRecientes(prev => prev.slice(1))} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full z-50 transition-colors">
          <X size={24} />
        </button>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bossShake {
            0% { transform: translate(1px, 1px) rotate(0deg) scale(1); filter: grayscale(0%); }
            20% { transform: translate(-3px, 0px) rotate(5deg); }
            40% { transform: translate(3px, 2px) rotate(-5deg); filter: grayscale(50%); }
            60% { transform: translate(-3px, 1px) rotate(5deg) scale(1.1); }
            80% { transform: translate(-1px, -1px) rotate(-5deg) scale(1.2); filter: grayscale(100%) brightness(200%); opacity: 1; }
            100% { transform: translate(1px, -2px) rotate(0deg) scale(0); opacity: 0; }
          }
          @keyframes lootReveal {
            0% { transform: scale(0) translateY(50px) rotate(-180deg); opacity: 0; }
            100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; }
          }
          .anim-boss-die { animation: bossShake 1.5s forwards ease-in-out; }
          .anim-loot-show { animation: lootReveal 1s forwards ease-out; animation-delay: 1.5s; opacity: 0; }
          .anim-fade-in-late { animation: fade-in 1s forwards; animation-delay: 2.5s; opacity: 0; }
        `}} />
        <div className="text-center relative w-full max-w-md h-96 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-8 absolute top-0 w-full animate-in fade-in zoom-in duration-500">
            ¡VICTORIA!
          </h2>
          <div className="absolute inset-0 flex flex-col items-center justify-center anim-boss-die pointer-events-none">
             <div className="text-8xl mb-2">👹</div>
             <h3 className="text-2xl font-bold text-red-500 line-through decoration-white decoration-4">{boss.nombre}</h3>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center anim-loot-show">
             <div className="text-[120px] filter drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] mb-4">{boss.icono}</div>
             <div className="bg-gray-900 border-2 border-yellow-500 p-4 rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.4)]">
               <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-1">Has Obtenido:</p>
               <h3 className="text-2xl font-bold text-white">{boss.premio}</h3>
             </div>
          </div>
          <button onClick={() => setJefesDerrotadosRecientes(prev => prev.slice(1))} className="absolute bottom-0 bg-yellow-600 hover:bg-yellow-500 text-black py-3 px-8 rounded-full font-black text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(202,138,4,0.6)] anim-fade-in-late">
            Reclamar Botín
          </button>
        </div>
      </div>
    );
  };

  // --- COMPONENTE DE ANIMACIÓN DE RETROCESO ---
  const RetrocesoModal = () => {
    if (!retrocesoInfo) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
        <button onClick={() => setRetrocesoInfo(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full z-50 transition-colors">
          <X size={24} />
        </button>
        <div className="bg-gray-900 border-2 border-red-600 p-6 md:p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-black text-red-500 mb-2">¡EL ENEMIGO SE FORTALECE!</h2>
          <p className="text-gray-300 mb-6 font-semibold">{retrocesoInfo.mensaje}</p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-xl mb-8 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-10"><Info size={80}/></div>
             <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2 relative z-10"><Info size={16}/> Consejo de los Ancestros</h4>
             <p className="text-sm text-blue-200 italic relative z-10">"{retrocesoInfo.consejo}"</p>
          </div>

          <button onClick={() => setRetrocesoInfo(null)} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg">
             Reagrupar y Seguir Luchando
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 relative">
      
      <BossDefeatedModal />
      <RetrocesoModal />

      {/* --- MODAL DE CONFIGURACIÓN --- */}
      {mostrarConfig && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-gray-400" /> Configuración de Aventura
              </h2>
              <button onClick={guardarYCerrarConfig} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              
              <section className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><Heart size={18} /> Datos Biométricos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Género</label>
                    <select value={perfil.genero} onChange={(e) => actualizarPerfil('genero', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none">
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Fecha de Nacimiento</label>
                    <input type="date" value={perfil.fechaNacimiento || ''} onChange={(e) => actualizarPerfil('fechaNacimiento', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Altura (cm)</label>
                    <input type="number" value={perfil.altura} onChange={(e) => actualizarPerfil('altura', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Nivel Actividad</label>
                    <select value={perfil.actividad} onChange={(e) => actualizarPerfil('actividad', parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none">
                      <option value="1.2">Sedentario (Poco ejercicio)</option>
                      <option value="1.375">Ligero (1-3 días/sem)</option>
                      <option value="1.55">Moderado (3-5 días/sem)</option>
                      <option value="1.725">Intenso (6-7 días/sem)</option>
                      <option value="1.9">Atleta Pro</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-emerald-900/10 p-4 rounded-lg border border-emerald-500/30">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><Target size={18} /> Destino (Metas del Héroe)</h3>
                <p className="text-xs text-gray-400 mb-4">Nota: Cambiar las metas ajustará automáticamente a los Jefes Finales para coincidir con tu nuevo objetivo.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Peso (kg)</label>
                    <input type="number" value={metaPeso} onChange={(e) => setMetaPeso(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Grasa (%)</label>
                    <input type="number" value={metaGrasa} onChange={(e) => setMetaGrasa(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Cintura (cm)</label>
                    <input type="number" value={metaCintura} onChange={(e) => setMetaCintura(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Visceral</label>
                    <input type="number" value={metaVisceral} onChange={(e) => setMetaVisceral(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Músculo (%)</label>
                    <input type="number" value={metaMusculo} onChange={(e) => setMetaMusculo(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2"><Edit3 size={18} /> Origen del Héroe (Datos Iniciales)</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-900/50 p-4 rounded-lg">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-gray-500 block mb-1">Fecha</label>
                    <input type="date" value={datosIniciales.fecha || ''} onChange={(e) => actualizarInicio('fecha', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Peso (kg)</label>
                    <input type="number" value={datosIniciales.peso || ''} onChange={(e) => actualizarInicio('peso', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Grasa (kg)</label>
                    <input type="number" value={datosIniciales.grasaKg || ''} onChange={(e) => actualizarInicio('grasaKg', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-yellow-500 font-semibold"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Cintura (cm)</label>
                    <input type="number" value={datosIniciales.cintura || ''} onChange={(e) => actualizarInicio('cintura', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-purple-400 font-semibold"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Visceral</label>
                    <input type="number" value={datosIniciales.visceral || ''} onChange={(e) => actualizarInicio('visceral', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-orange-400 font-semibold"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Músculo (%)</label>
                    <input type="number" value={datosIniciales.musculoPct || ''} onChange={(e) => actualizarInicio('musculoPct', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-blue-400 font-semibold"/>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-red-500 font-bold flex items-center gap-2"><Skull size={18} /> Bestiario y Botín (Creador de Jefes)</h3>
                    <p className="text-xs text-gray-400 mt-1">Define los enemigos que aparecerán según tu progreso.</p>
                  </div>
                  <button onClick={agregarBoss} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1 transition">
                    <PlusCircle size={14} /> Agregar Jefe
                  </button>
                </div>
                
                <div className="space-y-3">
                  {bosses.map((boss) => (
                    <div key={boss.id} className="flex flex-col md:flex-row gap-2 items-center bg-gray-900/50 p-3 rounded border border-gray-700">
                      <div className="w-full md:w-40">
                        <label className="text-[10px] text-gray-500 block">Tipo/Requisito</label>
                        <select value={boss.tipo} onChange={(e) => {
                            actualizarBoss(boss.id, 'tipo', e.target.value);
                            actualizarBoss(boss.id, 'nombre', generarNombreJefe(e.target.value));
                          }} 
                          className="w-full bg-gray-800 text-xs p-1 rounded border border-gray-600 text-white mb-1">
                          <option value="peso">⚖️ Peso (-kg)</option>
                          <option value="cintura">📏 Cintura (-cm)</option>
                          <option value="visceral">🫀 Visceral (-nv)</option>
                          <option value="musculo">💪 Músculo (+%)</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-500">A los</span>
                          <input type="number" value={boss.valor} onChange={(e) => actualizarBoss(boss.id, 'valor', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-transparent border-b border-gray-600 font-bold text-center outline-none text-xs text-red-400"/>
                        </div>
                      </div>

                      <div className="flex-1 w-full border-l border-gray-700 pl-2">
                        <label className="text-[10px] text-gray-500 block">Nombre del Jefe</label>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => actualizarBoss(boss.id, 'nombre', generarNombreJefe(boss.tipo))} className="text-gray-400 hover:text-emerald-400 transition transform hover:rotate-180 duration-300">🎲</button>
                          <input type="text" value={boss.nombre} onChange={(e) => actualizarBoss(boss.id, 'nombre', e.target.value)} className="w-full bg-transparent border-b border-gray-600 font-bold text-white outline-none text-sm"/>
                        </div>
                      </div>

                      <div className="flex-1 w-full border-l border-gray-700 pl-2">
                         <label className="text-[10px] text-gray-500 block">Botín (Loot)</label>
                         <div className="flex gap-2 items-center relative">
                           <button onClick={() => setPickerOpenId(pickerOpenId === boss.id ? null : boss.id)} className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm transition z-20">
                             {boss.icono}
                           </button>
                           <input type="text" value={boss.premio} onChange={(e) => actualizarBoss(boss.id, 'premio', e.target.value)} className="w-full bg-transparent border-b border-gray-600 outline-none text-sm text-yellow-400"/>
                           
                           {pickerOpenId === boss.id && (
                             <div className="absolute top-10 left-0 bg-gray-800 border border-gray-600 rounded-lg p-2 grid grid-cols-6 gap-1 z-30 shadow-2xl">
                               {LOOT_ICONS.map(icon => (
                                 <button key={icon} onClick={() => { actualizarBoss(boss.id, 'icono', icon); setPickerOpenId(null); }} className="text-lg hover:bg-gray-700 rounded p-1 transition">{icon}</button>
                               ))}
                             </div>
                           )}
                         </div>
                      </div>

                      <button onClick={() => borrarBoss(boss.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded self-end md:self-center transition mt-2 md:mt-0"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div><h3 className="text-red-500 font-bold flex items-center gap-2 mb-1">Zona de Peligro</h3></div>
                  <button onClick={borrarPartida} className="bg-red-900/50 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition border border-red-700/50">Borrar Partida</button>
                </div>
              </section>

            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0 text-right">
              <button onClick={guardarYCerrarConfig} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition">Guardar y Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- UI PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- BARRA LATERAL --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-5 md:p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sword size={24} />
                <h2 className="text-xl font-bold">Héroe</h2>
              </div>
              <button onClick={() => setMostrarConfig(true)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition">
                <Settings size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Peso</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaPeso} <span className="text-xs text-gray-500 font-normal">kg</span></div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Grasa</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaGrasa} <span className="text-xs text-gray-500 font-normal">%</span></div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Cintura</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaCintura} <span className="text-xs text-gray-500 font-normal">cm</span></div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Visceral</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaVisceral}</div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden col-span-2">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Músculo</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaMusculo} <span className="text-xs text-gray-500 font-normal">%</span></div>
              </div>
            </div>

            <hr className="border-gray-700 my-4" />

            <div>
              <button onClick={() => setRegistroAbierto(!registroAbierto)} className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-700 p-3 rounded-lg font-semibold text-sm transition text-white border border-gray-600">
                <div className="flex items-center gap-2"><PlusCircle size={16} className="text-emerald-400" /> Registro Semanal</div>
                {registroAbierto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {registroAbierto && (
                <div className="space-y-3 mt-4 animate-in slide-in-from-top-2 fade-in">
                  <div>
                    <label className="text-xs text-gray-500">Fecha</label>
                    <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white"/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500">Peso Actual (kg)</label>
                      <input type="number" placeholder="84.5" value={nuevoPeso} onChange={(e) => setNuevoPeso(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Cintura (cm)</label>
                      <input type="number" placeholder="90" value={nuevaCintura} onChange={(e) => setNuevaCintura(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500">% Grasa</label>
                      <input type="number" placeholder="25" value={nuevoGrasaPct} onChange={(e) => setNuevoGrasaPct(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">% Músculo</label>
                      <input type="number" placeholder="38" value={nuevoMusculoPct} onChange={(e) => setNuevoMusculoPct(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-yellow-500 font-bold">Grasa(kg)</label>
                      <input type="number" placeholder="kg" value={nuevoGrasaKg} onChange={(e) => setNuevoGrasaKg(e.target.value)} className="w-full bg-gray-900 border border-yellow-700/50 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-orange-400 font-bold">Visceral (nv)</label>
                      <input type="number" placeholder="10" value={nuevoVisceral} onChange={(e) => setNuevoVisceral(e.target.value)} className="w-full bg-gray-900 border border-orange-700/50 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"/>
                    </div>
                  </div>
                  
                  <button onClick={registrarProgreso} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg">
                    <Save size={18} /> Guardar Progreso
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
            <h4 className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2"><Info size={14}/> Datos Base</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between"><span>Altura:</span> <span className="text-white">{perfil.altura} cm</span></div>
              <div className="flex justify-between"><span>Edad:</span> <span className="text-white">{edadCalculada} años</span></div>
              <div className="flex justify-between"><span>Actividad:</span> <span className="text-white">x{perfil.actividad}</span></div>
            </div>
          </div>
        </div>

        {/* --- DASHBOARD --- */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-red-500">
              FitRPG: Boss Rush
            </h1>
            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-700">v11.0 Muscle & Charts</span>
          </div>

          {/* --- ESTADÍSTICAS ACTUALES (DESTACADAS) --- */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 shadow-xl">
             <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-300">
                <Star className="text-yellow-500" size={16}/> Estado Actual del Héroe
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center text-center">
                   <div className="p-3 mb-2 bg-red-900/30 rounded-full border border-red-500/30"><Sword size={24} className="text-red-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Peso</div>
                   <div className="text-2xl font-black text-white">{pesoActual} <span className="text-sm font-normal text-gray-500">kg</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-yellow-900/30 rounded-full border border-yellow-500/30"><Flame size={24} className="text-yellow-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">% Grasa</div>
                   <div className="text-2xl font-black text-white">{grasaPctActual.toFixed(1)} <span className="text-sm font-normal text-gray-500">%</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-blue-900/30 rounded-full border border-blue-500/30"><BicepsFlexed size={24} className="text-blue-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">% Músculo</div>
                   <div className="text-2xl font-black text-white">{musculoPctActual.toFixed(1)} <span className="text-sm font-normal text-gray-500">%</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-purple-900/30 rounded-full border border-purple-500/30"><Shield size={24} className="text-purple-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Cintura</div>
                   <div className="text-2xl font-black text-white">{cinturaActual} <span className="text-sm font-normal text-gray-500">cm</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-orange-900/30 rounded-full border border-orange-500/30"><Droplet size={24} className="text-orange-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Visceral</div>
                   <div className="text-2xl font-black text-white">{visceralActual} <span className="text-sm font-normal text-gray-500">nv</span></div>
                </div>
             </div>
          </div>

          {/* --- SECCIÓN DE JEFES ACTIVOS --- */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-500">
              <Skull /> Cacería Activa (Jefes de Región)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {activePesoBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-red-400 mb-1 flex items-center gap-1"><Sword size={10}/> Jefe de Peso</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activePesoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activePesoBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-red-600 to-red-800 h-full transition-all duration-1000 ease-out" style={{ width: `${activePesoBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activePesoBoss.hpRemaining.toFixed(1)} / {activePesoBoss.maxHp.toFixed(1)} kg</div>
                  </div>
                </div>
              )}

              {activeCinturaBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-purple-900 shadow-[0_0_20px_rgba(147,51,234,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-1"><Shield size={10}/> Jefe de Cintura</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeCinturaBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activeCinturaBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-full transition-all duration-1000 ease-out" style={{ width: `${activeCinturaBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activeCinturaBoss.hpRemaining.toFixed(1)} / {activeCinturaBoss.maxHp.toFixed(1)} cm</div>
                  </div>
                </div>
              )}

              {activeVisceralBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-orange-900 shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-orange-400 mb-1 flex items-center gap-1"><Droplet size={10}/> Jefe de Órganos</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeVisceralBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activeVisceralBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-700 h-full transition-all duration-1000 ease-out" style={{ width: `${activeVisceralBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activeVisceralBoss.hpRemaining.toFixed(1)} / {activeVisceralBoss.maxHp.toFixed(1)} nv</div>
                  </div>
                </div>
              )}

              {activeMusculoBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-blue-900 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-1"><BicepsFlexed size={10}/> Jefe de Debilidad</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeMusculoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activeMusculoBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-full transition-all duration-1000 ease-out" style={{ width: `${activeMusculoBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activeMusculoBoss.hpRemaining.toFixed(1)} / {activeMusculoBoss.maxHp.toFixed(1)} %</div>
                  </div>
                </div>
              )}

              {(!activePesoBoss && !activeCinturaBoss && !activeVisceralBoss && !activeMusculoBoss) && (
                <div className="col-span-full bg-emerald-900/20 p-5 rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                  <Trophy className="text-emerald-500 mb-2" size={32} />
                  <h3 className="text-emerald-400 font-bold text-lg">Reino Purificado</h3>
                  <p className="text-xs text-gray-400">Has derrotado a todos los jefes conocidos. Eres una leyenda.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- HISTORIAL DE BATALLA PLEGABLE Y DETALLADO --- */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button 
              onClick={() => setHistorialAbierto(!historialAbierto)} 
              className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-750 p-6 font-semibold text-lg transition text-white"
            >
              <div className="flex items-center gap-2"><Activity size={20} className="text-emerald-400" /> Historial de Batalla y Gráficos</div>
              {historialAbierto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {historialAbierto && (
              <div className="p-6 border-t border-gray-700 bg-gray-900/50 animate-in slide-in-from-top-2 fade-in">
                
                {/* Selector de Gráfico */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button onClick={() => setChartStat('peso')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='peso'?'bg-red-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Peso (kg)</button>
                  <button onClick={() => setChartStat('grasaPct')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='grasaPct'?'bg-yellow-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Grasa (%)</button>
                  <button onClick={() => setChartStat('musculoPct')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='musculoPct'?'bg-blue-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Músculo (%)</button>
                  <button onClick={() => setChartStat('cintura')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='cintura'?'bg-purple-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Cintura (cm)</button>
                  <button onClick={() => setChartStat('visceral')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='visceral'?'bg-orange-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Visceral</button>
                </div>

                <div className="w-full h-56 bg-gray-900/80 rounded-lg p-6 relative overflow-hidden mb-6 border border-gray-700">
                   {historialOrdenado.length > 1 ? (
                     <div className="w-full h-full relative">
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                           {/* Líneas guía de fondo */}
                           <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#333" strokeDasharray="2,2" strokeWidth="1" />
                           <line x1="0" y1="75" x2="500" y2="75" stroke="#444" strokeDasharray="4,4" strokeWidth="1" />
                           <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#333" strokeDasharray="2,2" strokeWidth="1" />
                           
                           {/* Línea de datos */}
                           <polyline fill="none" stroke="#10b981" strokeWidth="3" points={polylinePoints} strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg"/>
                           
                           {/* Puntos y Etiquetas */}
                           {chartPoints.map((p, i) => (
                             <g key={i}>
                               <circle cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="#111827" strokeWidth="2" className="cursor-pointer" />
                               {/* Solo mostramos valores en el primero, último o si hay pocos datos */}
                               {(i === 0 || i === chartPoints.length - 1 || chartPoints.length <= 5) && (
                                 <text x={p.x} y={p.y - 10} fill="#9ca3af" fontSize="10" textAnchor="middle" fontWeight="bold">
                                   {p.val}
                                 </text>
                               )}
                             </g>
                           ))}
                        </svg>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center h-full text-gray-500">Necesitas más de 1 registro para el gráfico</div>
                   )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead className="text-[10px] uppercase bg-gray-800 text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Peso (kg)</th>
                        <th className="p-3">% Grasa</th>
                        <th className="p-3">% Músculo</th>
                        <th className="p-3">Cintura (cm)</th>
                        <th className="p-3">Visceral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {historialOrdenado.slice().reverse().map((h, idx) => {
                        const prev = historialOrdenado.slice().reverse()[idx + 1];
                        
                        const renderDelta = (valAct, valPrev, isMuscle = false) => {
                          if (!valPrev) return null;
                          const diff = valAct - valPrev;
                          if (diff === 0) return <span className="text-gray-600 text-[10px] ml-2">(-)</span>;
                          
                          // Músculo: positivo es verde, negativo es rojo. Peso/Grasa: positivo es rojo, negativo es verde.
                          const goodColor = isMuscle ? 'text-emerald-400' : 'text-emerald-400';
                          const badColor = isMuscle ? 'text-red-400' : 'text-red-400';
                          const color = isMuscle ? (diff > 0 ? goodColor : badColor) : (diff > 0 ? badColor : goodColor);
                          const sign = diff > 0 ? '+' : '';

                          return <span className={`${color} text-[10px] ml-2`}>({sign}{diff.toFixed(1)})</span>;
                        };

                        return (
                          <tr key={idx} className="hover:bg-gray-800/50 transition">
                            <td className="p-3 font-mono">{h.fecha}</td>
                            <td className="p-3 font-bold text-white">{h.peso} {renderDelta(h.peso, prev?.peso)}</td>
                            <td className="p-3 text-yellow-400">{h.grasaPct}% {renderDelta(h.grasaPct, prev?.grasaPct)}</td>
                            <td className="p-3 text-blue-400">{h.musculoPct || '-'}% {renderDelta(h.musculoPct, prev?.musculoPct, true)}</td>
                            <td className="p-3 text-purple-400">{h.cintura}cm {renderDelta(h.cintura, prev?.cintura)}</td>
                            <td className="p-3 text-orange-400">{h.visceral}nv {renderDelta(h.visceral, prev?.visceral)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* BESTIARIO Y BOTÍN */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Bestiario y Botines (Progreso Global)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bosses.sort((a,b) => a.valor - b.valor).map((boss) => {
                let progresoActual = 0;
                if(boss.tipo === 'peso') progresoActual = kilosPerdidos;
                if(boss.tipo === 'cintura') progresoActual = cinturaPerdidaCm;
                if(boss.tipo === 'visceral') progresoActual = visceralPerdida;
                if(boss.tipo === 'musculo') progresoActual = musculoGanadoPct;

                const derrotado = progresoActual >= boss.valor;
                
                const colorBorde = boss.tipo === 'peso' ? 'border-red-500' : boss.tipo === 'cintura' ? 'border-purple-500' : boss.tipo === 'musculo' ? 'border-blue-500' : 'border-orange-500';
                const unidad = boss.tipo === 'peso' ? 'kg' : boss.tipo === 'cintura' ? 'cm' : boss.tipo === 'musculo' ? '%' : 'nv';
                const iconoTipo = boss.tipo === 'peso' ? <Sword size={14}/> : boss.tipo === 'cintura' ? <Shield size={14}/> : boss.tipo === 'musculo' ? <BicepsFlexed size={14}/> : <Droplet size={14}/>;
                const shadowColor = boss.tipo === 'peso' ? 'red' : boss.tipo === 'cintura' ? 'purple' : boss.tipo === 'musculo' ? 'blue' : 'orange';
                
                const bgStyle = derrotado ? `bg-gray-800 ${colorBorde} shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-${shadowColor}-500/20` : 'bg-gray-900 border-gray-700 opacity-60 grayscale';

                return (
                  <div key={boss.id} className={`relative p-4 rounded-xl text-center border-2 transition-all duration-300 ${bgStyle}`}>
                    <div className={`absolute top-2 right-2 ${derrotado ? 'text-gray-400' : 'text-gray-600'}`}>
                      {iconoTipo}
                    </div>
                    
                    <div className="text-3xl mb-2">{derrotado ? '💀' : '👹'}</div>
                    <div className={`text-[11px] font-bold truncate px-1 ${derrotado ? 'line-through text-gray-500' : 'text-white'}`}>
                      {boss.nombre}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-2xl mb-1 filter drop-shadow-md">{derrotado ? boss.icono : '🔒'}</div>
                      <div className={`text-[10px] font-bold ${derrotado ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {derrotado ? '¡LOOT OBTENIDO!' : 'Botín Bloqueado'}
                      </div>
                      <div className="text-xs text-gray-300 font-semibold truncate px-1">{boss.premio}</div>
                      <div className="text-[10px] text-gray-500 mt-1">Daño Req: {boss.valor}{unidad}</div>
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

export default FitRPG;import React, { useState, useEffect } from 'react';
import { Trophy, Sword, Activity, Save, PlusCircle, Settings, Trash2, X, Edit3, Ruler, Flame, Heart, Info, Skull, Shield, Droplet, Target, ChevronDown, ChevronUp, Star, AlertTriangle, BicepsFlexed } from 'lucide-react';

// --- CONSTANTES Y BASES DE DATOS ---
const LOOT_ICONS = ['🍔', '🍕', '🍺', '🎮', '👕', '👟', '🛀', '✈️', '📸', '📱', '⌚', '💻', '🎫', '🍿', '🎸', '📚', '🏆', '👑', '💎', '💰', '🎁', '🗡️', '🛡️', '🧪', '🔮', '🎉', '🏖️', '🏕️', '🚗', '🛍️', '💆'];

const CONSEJOS_SALUD = [
  "🛡️ Misión de Resistencia: Evita los carbohidratos refinados (pan blanco, galletas) después de las 6 PM. Sustitúyelos por proteínas y vegetales para evitar picos de insulina.",
  "🏃‍♂️ Misión de Agilidad: Sal a trotar o realizar una caminata rápida de 30 minutos al menos 3 veces esta semana. Tu metabolismo basal aumentará.",
  "🥩 Misión de Fuerza: Consume entre 1.6g y 2g de proteína por kilo de tu peso ideal diario. Esto blindará tu masa muscular mientras oxidas grasa.",
  "💧 Misión de Purificación: Bebe un vaso de agua grande justo al despertar y otro antes de cada comida. Reduce la ansiedad y mejora el rendimiento celular.",
  "🛌 Misión de Recuperación: Apaga pantallas 1 hora antes de dormir y asegura 7-8 horas de sueño ininterrumpido. El cortisol bajo destruye la armadura del Jefe Grasa.",
  "⚔️ Misión Táctica: Lee las etiquetas. Si el azúcar o jarabe de maíz está entre los primeros 3 ingredientes, ¡es una trampa tóxica! Evítalo.",
  "🥦 Misión de Fortificación: Añade una porción de vegetales fibrosos (brócoli, espinaca, espárragos) a tu comida principal hoy para mejorar tu saciedad y digestión.",
  "🧘‍♂️ Misión de Claridad: El estrés genera hormonas que almacenan grasa visceral. Dedica 10 minutos de esta semana a respirar profundamente o meditar.",
  "⚡ Misión de Ráfaga: Incorpora 15 minutos de entrenamiento HIIT (Alta Intensidad) dos veces esta semana para crear una 'deuda de oxígeno' que queme grasa extra.",
  "🕰️ Misión de Disciplina: Practica un ayuno ligero de 12 a 14 horas (ej. cena a las 8 PM y desayuna a las 10 AM). Esto entrena a tu cuerpo para usar grasa como combustible."
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

// --- FUNCIÓN AUXILIAR PARA CALCULAR LA EDAD ---
const calcularEdad = (fechaNacStr) => {
  if (!fechaNacStr) return 0;
  const hoy = new Date();
  const cumpleanos = new Date(fechaNacStr);
  let edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
  }
  return Math.max(0, edad);
};

const FitRPG = () => {
  // --- ESTADO INICIAL CON LOCALSTORAGE ---
  const [metaPeso, setMetaPeso] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaPeso');
    return saved !== null ? JSON.parse(saved) : 75.0;
  });

  const [metaGrasa, setMetaGrasa] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaGrasa');
    return saved !== null ? JSON.parse(saved) : 20.0;
  });

  const [metaCintura, setMetaCintura] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaCintura');
    return saved !== null ? JSON.parse(saved) : 85.0;
  });

  const [metaVisceral, setMetaVisceral] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaVisceral');
    return saved !== null ? JSON.parse(saved) : 9.0;
  });

  const [metaMusculo, setMetaMusculo] = useState(() => {
    const saved = localStorage.getItem('fitrpg_metaMusculo');
    return saved !== null ? JSON.parse(saved) : 40.0;
  });
  
  const [perfil, setPerfil] = useState(() => {
    const saved = localStorage.getItem('fitrpg_perfil');
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (parsed.edad && !parsed.fechaNacimiento) {
        const currentYear = new Date().getFullYear();
        parsed.fechaNacimiento = `${currentYear - parsed.edad}-01-01`;
        delete parsed.edad;
      }
      return parsed;
    }
    return { altura: 175, fechaNacimiento: '1990-01-01', genero: 'hombre', actividad: 1.2 };
  });

  const [historial, setHistorial] = useState(() => {
    const saved = localStorage.getItem('fitrpg_historial');
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [bosses, setBosses] = useState(() => {
    const saved = localStorage.getItem('fitrpg_bosses_v4');
    return saved !== null ? JSON.parse(saved) : [];
  });

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
  const [chartStat, setChartStat] = useState('peso'); // Selector de gráfica
  
  const [pickerOpenId, setPickerOpenId] = useState(null);

  // Sistema de Eventos (Victoria y Derrota)
  const [jefesDerrotadosRecientes, setJefesDerrotadosRecientes] = useState([]);
  const [retrocesoInfo, setRetrocesoInfo] = useState(null);

  // --- ESTADOS DE ONBOARDING (CREACIÓN DE HÉROE) ---
  const [onboardingData, setOnboardingData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    peso: '', grasaPct: '', musculoPct: '', cintura: '', visceral: '',
    altura: 175, fechaNacimiento: '', genero: 'hombre', actividad: 1.2
  });
  const [onboardingError, setOnboardingError] = useState('');

  const comenzarAventura = () => {
    const { peso, grasaPct, musculoPct, cintura, visceral, altura, fechaNacimiento, genero, actividad, fecha } = onboardingData;

    if (!peso || !grasaPct || !musculoPct || !cintura || !visceral || !altura || !fechaNacimiento) {
      setOnboardingError("¡Faltan atributos! Llena todos los campos para forjar tu destino.");
      return;
    }

    const p = parseFloat(peso);
    const gPct = parseFloat(grasaPct);
    const mPct = parseFloat(musculoPct);
    const c = parseFloat(cintura);
    const v = parseFloat(visceral);
    const alt = parseFloat(altura);

    const mPeso = 22 * Math.pow(alt / 100, 2);
    const mGrasa = genero === 'hombre' ? 15 : 24;
    const mCintura = alt / 2;
    const mVisceral = 9;
    const metaMusc = mPct + 5.0; // Meta por defecto: ganar 5% de masa muscular

    const metaPesoObj = parseFloat(mPeso.toFixed(1));
    const metaCinturaObj = parseFloat(mCintura.toFixed(1));

    setMetaPeso(metaPesoObj);
    setMetaGrasa(mGrasa);
    setMetaCintura(metaCinturaObj);
    setMetaVisceral(mVisceral);
    setMetaMusculo(metaMusc);

    setPerfil({
      altura: alt,
      fechaNacimiento: fechaNacimiento,
      genero: genero,
      actividad: parseFloat(actividad)
    });

    const nuevosBosses = [];
    let idCounter = 1;

    const kgToLose = p - metaPesoObj;
    if (kgToLose > 0) {
      let currentStep = 5;
      while (currentStep < kgToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'peso', valor: currentStep, nombre: generarNombreJefe('peso'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 5;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'peso', valor: parseFloat(kgToLose.toFixed(1)), nombre: "Lord Grasa (Jefe Final)", premio: "Gran Victoria de Peso", icono: "👑" });
    }

    const cmToLose = c - metaCinturaObj;
    if (cmToLose > 0) {
      let currentStep = 5;
      while (currentStep < cmToLose) {
        nuevosBosses.push({ id: idCounter++, tipo: 'cintura', valor: currentStep, nombre: generarNombreJefe('cintura'), premio: "Botín Menor", icono: LOOT_ICONS[Math.floor(Math.random()*LOOT_ICONS.length)] });
        currentStep += 5;
      }
      nuevosBosses.push({ id: idCounter++, tipo: 'cintura', valor: parseFloat(cmToLose.toFixed(1)), nombre: "El Opresor (Jefe Final)", premio: "Victoria de Cintura", icono: "👑" });
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

    // Jefes de Músculo (cada 2% ganado)
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
    const grasaKg = parseFloat((p * (gPct / 100)).toFixed(2));
    setHistorial([{ fecha: fecha, peso: p, grasaPct: gPct, musculoPct: mPct, grasaKg: grasaKg, cintura: c, visceral: v }]);
  };

  // --- EFECTO DE GUARDADO AUTOMÁTICO ---
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
      const p = parseFloat(nuevoPeso);
      const g = parseFloat(nuevoGrasaPct);
      if (!isNaN(p) && !isNaN(g)) {
        const kgs = (p * (g / 100)).toFixed(2);
        setNuevoGrasaKg(kgs);
      }
    }
  }, [nuevoPeso, nuevoGrasaPct]);

  // --- PANTALLA DE CREACIÓN DE PERSONAJE (ONBOARDING) ---
  if (historial.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 flex items-center justify-center relative">
        <div className="bg-gray-800 p-6 md:p-10 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-3xl w-full relative z-10">
          <div className="text-center mb-8">
            <Sword size={48} className="mx-auto text-emerald-400 mb-4" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Forja tu Destino</h1>
            <p className="text-gray-400 mt-2">Bienvenido a FitRPG. Ingresa tus atributos iniciales para calcular tus misiones, metas y enemigos.</p>
          </div>

          {onboardingError && (
             <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-center text-sm mb-6 font-bold">
              {onboardingError}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-emerald-400 font-bold flex items-center gap-2 border-b border-gray-700 pb-2"><Heart size={18} /> Tu Héroe (Biometría)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Género</label>
                  <select value={onboardingData.genero} onChange={(e) => setOnboardingData({...onboardingData, genero: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none">
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">F. Nacimiento</label>
                  <input type="date" value={onboardingData.fechaNacimiento} onChange={(e) => setOnboardingData({...onboardingData, fechaNacimiento: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Altura (cm)</label>
                  <input type="number" value={onboardingData.altura} onChange={(e) => setOnboardingData({...onboardingData, altura: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Nivel Actividad</label>
                  <select value={onboardingData.actividad} onChange={(e) => setOnboardingData({...onboardingData, actividad: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none">
                    <option value="1.2">Sedentario (Poco ejercicio)</option>
                    <option value="1.375">Ligero (1-3 días/sem)</option>
                    <option value="1.55">Moderado (3-5 días/sem)</option>
                    <option value="1.725">Intenso (6-7 días/sem)</option>
                    <option value="1.9">Atleta Pro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <h3 className="text-red-400 font-bold flex items-center gap-2 border-b border-gray-700 pb-2"><Skull size={18} /> Punto de Partida (Maldición)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Fecha de Inicio</label>
                  <input type="date" value={onboardingData.fecha} onChange={(e) => setOnboardingData({...onboardingData, fecha: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Peso Inicial (kg)</label>
                  <input type="number" placeholder="Ej: 95.5" value={onboardingData.peso} onChange={(e) => setOnboardingData({...onboardingData, peso: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Cintura (cm)</label>
                  <input type="number" placeholder="Ej: 105" value={onboardingData.cintura} onChange={(e) => setOnboardingData({...onboardingData, cintura: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">% Grasa</label>
                  <input type="number" placeholder="Ej: 32" value={onboardingData.grasaPct} onChange={(e) => setOnboardingData({...onboardingData, grasaPct: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-red-500 outline-none"/>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">% Músculo</label>
                  <input type="number" placeholder="Ej: 35" value={onboardingData.musculoPct} onChange={(e) => setOnboardingData({...onboardingData, musculoPct: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 block mb-1">Visceral (Nv)</label>
                  <input type="number" placeholder="Ej: 15" value={onboardingData.visceral} onChange={(e) => setOnboardingData({...onboardingData, visceral: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"/>
                </div>
              </div>
            </div>
          </div>

          <button onClick={comenzarAventura} className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02]">
            <Sword size={24} /> ¡Comenzar la Aventura!
          </button>
        </div>
      </div>
    );
  }

  // --- CÁLCULOS PRINCIPALES DEL HISTORIAL ---
  const historialOrdenado = [...historial].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const datosIniciales = historialOrdenado[0] || {};
  const ultimoRegistro = historialOrdenado[historialOrdenado.length - 1] || {};
  const registroAnterior = historialOrdenado.length > 1 ? historialOrdenado[historialOrdenado.length - 2] : datosIniciales;
  
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

  // --- LÓGICA DE JEFES ACTIVOS (BOSS RUSH) ---
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

  // --- CÁLCULOS BIO-ESCÁNER ---
  const edadCalculada = calcularEdad(perfil.fechaNacimiento);

  const calcularMetabolismo = () => {
    const pActual = pesoActual || 0;
    const pAltura = perfil.altura || 0;
    const pEdad = edadCalculada;

    let tmb = (10 * pActual) + (6.25 * pAltura) - (5 * pEdad);
    tmb = perfil.genero === 'hombre' ? tmb + 5 : tmb - 161;
    if (tmb < 0) tmb = 0;

    const tdee = tmb * perfil.actividad;
    const alturaMetros = pAltura / 100;
    let imc = 0;
    let pesoIdealMin = 0;
    let pesoIdealMax = 0;

    if (alturaMetros > 0) {
      imc = pActual / (alturaMetros * alturaMetros);
      pesoIdealMin = 18.5 * (alturaMetros * alturaMetros);
      pesoIdealMax = 24.9 * (alturaMetros * alturaMetros);
    }
    
    const grasaIdealMin = perfil.genero === 'hombre' ? 10 : 18;
    const grasaIdealMax = perfil.genero === 'hombre' ? 20 : 28;

    return { tmb, tdee, imc, pesoIdealMin, pesoIdealMax, grasaIdealMin, grasaIdealMax };
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

    // Detección de Retroceso
    const huboRetroceso = p > pesoActual || c > cinturaActual || v > visceralActual || m < musculoPctActual;
    let deltaRetroceso = "";
    if (p > pesoActual) deltaRetroceso += `+${(p - pesoActual).toFixed(1)}kg `;
    if (c > cinturaActual) deltaRetroceso += `+${(c - cinturaActual).toFixed(1)}cm `;
    if (v > visceralActual) deltaRetroceso += `+${(v - visceralActual).toFixed(1)}nv `;
    if (m < musculoPctActual) deltaRetroceso += `-${(musculoPctActual - m).toFixed(1)}% mús`;

    // Detección de Victoria
    let bossesRecienDerrotados = [];
    bosses.forEach(b => {
      let progresoViejo = 0;
      let progresoNuevo = 0;
      if (b.tipo === 'peso') { progresoViejo = kilosPerdidos; progresoNuevo = newKilosPerdidos; }
      else if (b.tipo === 'cintura') { progresoViejo = cinturaPerdidaCm; progresoNuevo = newCinturaPerdida; }
      else if (b.tipo === 'visceral') { progresoViejo = visceralPerdida; progresoNuevo = newVisceralPerdida; }
      else if (b.tipo === 'musculo') { progresoViejo = musculoGanadoPct; progresoNuevo = newMusculoGanado; }
      
      if (progresoViejo < b.valor && progresoNuevo >= b.valor) {
        bossesRecienDerrotados.push(b);
      }
    });

    const nuevoRegistro = {
      fecha: nuevaFecha,
      peso: p,
      grasaPct: nuevoGrasaPct ? parseFloat(nuevoGrasaPct) : grasaPctActual,
      musculoPct: m,
      grasaKg: nuevoGrasaKg ? parseFloat(nuevoGrasaKg) : (p * (parseFloat(nuevoGrasaPct || grasaPctActual) / 100)),
      cintura: c,
      visceral: v
    };

    setHistorial([...historial, nuevoRegistro]);

    if (huboRetroceso && deltaRetroceso !== "") {
      setRetrocesoInfo({
        mensaje: `Has perdido terreno en la batalla (${deltaRetroceso.trim()}). Algunos enemigos podrían haber recuperado vida.`,
        consejo: CONSEJOS_SALUD[Math.floor(Math.random() * CONSEJOS_SALUD.length)]
      });
    } else if (bossesRecienDerrotados.length > 0) {
      setJefesDerrotadosRecientes(bossesRecienDerrotados);
    }

    setNuevoPeso('');
    setNuevoGrasaPct('');
    setNuevoGrasaKg('');
    setNuevoMusculoPct('');
    setNuevaCintura('');
    setNuevoVisceral('');
    setRegistroAbierto(false); 
  };

  const actualizarInicio = (campo, valor) => {
    const nuevosDatos = [...historialOrdenado];
    if (nuevosDatos.length > 0) {
      nuevosDatos[0] = { ...nuevosDatos[0], [campo]: valor };
      setHistorial(nuevosDatos);
    }
  };

  const actualizarPerfil = (campo, valor) => setPerfil({ ...perfil, [campo]: valor });

  const agregarBoss = () => {
    const nuevoId = Math.max(...bosses.map(h => h.id), 0) + 1;
    setBosses([...bosses, { id: nuevoId, tipo: 'peso', valor: 5, nombre: generarNombreJefe('peso'), premio: "Premio Sorpresa", icono: "🎁" }]);
  };

  const actualizarBoss = (id, campo, valor) => {
    setBosses(bosses.map(b => b.id === id ? { ...b, [campo]: valor } : b));
  };

  const borrarBoss = (id) => setBosses(bosses.filter(b => b.id !== id));

  const borrarPartida = () => {
    if (window.confirm("⚠️ ¿Estás seguro de que deseas borrar toda tu aventura? Esto reiniciará la aplicación a los datos por defecto y no se puede deshacer.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // --- GUARDAR CONFIGURACIÓN Y AJUSTAR JEFES A NUEVAS METAS ---
  const guardarYCerrarConfig = () => {
    const kgToLose = Math.max(0, pesoInicial - metaPeso);
    const cmToLose = Math.max(0, cinturaInicial - metaCintura);
    const vToLose = Math.max(0, visceralInicial - metaVisceral);
    const mToGain = Math.max(0, metaMusculo - musculoInicial);

    setBosses(prev => {
      let newBosses = [...prev];
      
      const updateFinalBoss = (tipo, newValor) => {
        const typeBosses = newBosses.filter(b => b.tipo === tipo).sort((a,b) => a.valor - b.valor);
        if (typeBosses.length > 0) {
          const finalBoss = typeBosses[typeBosses.length - 1];
          const prevBoss = typeBosses.length > 1 ? typeBosses[typeBosses.length - 2] : null;
          if (!prevBoss || newValor > prevBoss.valor) {
            finalBoss.valor = parseFloat(newValor.toFixed(1));
          } else {
             finalBoss.valor = parseFloat(newValor.toFixed(1));
          }
        }
      };

      updateFinalBoss('peso', kgToLose);
      updateFinalBoss('cintura', cmToLose);
      updateFinalBoss('visceral', vToLose);
      updateFinalBoss('musculo', mToGain);

      return newBosses;
    });

    setMostrarConfig(false);
  };

  const generarPuntosGrafico = () => {
    if (historialOrdenado.length < 2) return [];
    
    const data = historialOrdenado.map(h => h[chartStat] || 0);
    const minData = Math.min(...data);
    const maxData = Math.max(...data);
    const padding = (maxData - minData) * 0.2 || 1;
    const minVal = minData - padding;
    const maxVal = maxData + padding;
    
    const width = 500;
    const height = 150;
    
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
    const minScale = 15;
    const maxScale = 40;
    const safeIMC = isNaN(imc) ? 0 : imc; 
    const percent = Math.min(100, Math.max(0, ((safeIMC - minScale) / (maxScale - minScale)) * 100));
    
    return (
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Bajo</span>
          <span>Normal</span>
          <span>Alto</span>
          <span>Obesidad</span>
        </div>
        <div className="relative h-6 w-full rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-500 w-[14%]"></div>
          <div className="h-full bg-emerald-500 w-[26%]"></div>
          <div className="h-full bg-yellow-500 w-[20%]"></div>
          <div className="h-full bg-red-500 flex-1"></div>
          
          <div 
            className="absolute top-0 bottom-0 w-2 bg-transparent border-x-[3px] border-white shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all duration-1000 z-10 flex justify-center -translate-x-1"
            style={{ left: `${percent}%` }}
          >
             <div className="absolute -top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-[10px]">
                {safeIMC < 18.5 ? '❄️' : safeIMC < 25 ? '😊' : safeIMC < 30 ? '⚠️' : '🔥'}
             </div>
          </div>
        </div>
      </div>
    );
  };

  // --- COMPONENTE DE ANIMACIÓN DE VICTORIA ---
  const BossDefeatedModal = () => {
    if (jefesDerrotadosRecientes.length === 0) return null;
    const boss = jefesDerrotadosRecientes[0];
    return (
      <div className="fixed inset-0 z-[110] bg-black/90 flex flex-col items-center justify-center p-4">
        <button onClick={() => setJefesDerrotadosRecientes(prev => prev.slice(1))} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full z-50 transition-colors">
          <X size={24} />
        </button>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bossShake {
            0% { transform: translate(1px, 1px) rotate(0deg) scale(1); filter: grayscale(0%); }
            20% { transform: translate(-3px, 0px) rotate(5deg); }
            40% { transform: translate(3px, 2px) rotate(-5deg); filter: grayscale(50%); }
            60% { transform: translate(-3px, 1px) rotate(5deg) scale(1.1); }
            80% { transform: translate(-1px, -1px) rotate(-5deg) scale(1.2); filter: grayscale(100%) brightness(200%); opacity: 1; }
            100% { transform: translate(1px, -2px) rotate(0deg) scale(0); opacity: 0; }
          }
          @keyframes lootReveal {
            0% { transform: scale(0) translateY(50px) rotate(-180deg); opacity: 0; }
            100% { transform: scale(1) translateY(0) rotate(0deg); opacity: 1; }
          }
          .anim-boss-die { animation: bossShake 1.5s forwards ease-in-out; }
          .anim-loot-show { animation: lootReveal 1s forwards ease-out; animation-delay: 1.5s; opacity: 0; }
          .anim-fade-in-late { animation: fade-in 1s forwards; animation-delay: 2.5s; opacity: 0; }
        `}} />
        <div className="text-center relative w-full max-w-md h-96 flex flex-col items-center justify-center">
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-8 absolute top-0 w-full animate-in fade-in zoom-in duration-500">
            ¡VICTORIA!
          </h2>
          <div className="absolute inset-0 flex flex-col items-center justify-center anim-boss-die pointer-events-none">
             <div className="text-8xl mb-2">👹</div>
             <h3 className="text-2xl font-bold text-red-500 line-through decoration-white decoration-4">{boss.nombre}</h3>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center anim-loot-show">
             <div className="text-[120px] filter drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] mb-4">{boss.icono}</div>
             <div className="bg-gray-900 border-2 border-yellow-500 p-4 rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.4)]">
               <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-1">Has Obtenido:</p>
               <h3 className="text-2xl font-bold text-white">{boss.premio}</h3>
             </div>
          </div>
          <button onClick={() => setJefesDerrotadosRecientes(prev => prev.slice(1))} className="absolute bottom-0 bg-yellow-600 hover:bg-yellow-500 text-black py-3 px-8 rounded-full font-black text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(202,138,4,0.6)] anim-fade-in-late">
            Reclamar Botín
          </button>
        </div>
      </div>
    );
  };

  // --- COMPONENTE DE ANIMACIÓN DE RETROCESO ---
  const RetrocesoModal = () => {
    if (!retrocesoInfo) return null;
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
        <button onClick={() => setRetrocesoInfo(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white bg-gray-800 p-2 rounded-full z-50 transition-colors">
          <X size={24} />
        </button>
        <div className="bg-gray-900 border-2 border-red-600 p-6 md:p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.4)]">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-black text-red-500 mb-2">¡EL ENEMIGO SE FORTALECE!</h2>
          <p className="text-gray-300 mb-6 font-semibold">{retrocesoInfo.mensaje}</p>
          
          <div className="bg-blue-900/30 border border-blue-500/50 p-4 rounded-xl mb-8 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 opacity-10"><Info size={80}/></div>
             <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2 relative z-10"><Info size={16}/> Consejo de los Ancestros</h4>
             <p className="text-sm text-blue-200 italic relative z-10">"{retrocesoInfo.consejo}"</p>
          </div>

          <button onClick={() => setRetrocesoInfo(null)} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg">
             Reagrupar y Seguir Luchando
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 relative">
      
      <BossDefeatedModal />
      <RetrocesoModal />

      {/* --- MODAL DE CONFIGURACIÓN --- */}
      {mostrarConfig && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-gray-400" /> Configuración de Aventura
              </h2>
              <button onClick={guardarYCerrarConfig} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              
              <section className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><Heart size={18} /> Datos Biométricos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Género</label>
                    <select value={perfil.genero} onChange={(e) => actualizarPerfil('genero', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none">
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Fecha de Nacimiento</label>
                    <input type="date" value={perfil.fechaNacimiento || ''} onChange={(e) => actualizarPerfil('fechaNacimiento', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Altura (cm)</label>
                    <input type="number" value={perfil.altura} onChange={(e) => actualizarPerfil('altura', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Nivel Actividad</label>
                    <select value={perfil.actividad} onChange={(e) => actualizarPerfil('actividad', parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none">
                      <option value="1.2">Sedentario (Poco ejercicio)</option>
                      <option value="1.375">Ligero (1-3 días/sem)</option>
                      <option value="1.55">Moderado (3-5 días/sem)</option>
                      <option value="1.725">Intenso (6-7 días/sem)</option>
                      <option value="1.9">Atleta Pro</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-emerald-900/10 p-4 rounded-lg border border-emerald-500/30">
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2"><Target size={18} /> Destino (Metas del Héroe)</h3>
                <p className="text-xs text-gray-400 mb-4">Nota: Cambiar las metas ajustará automáticamente a los Jefes Finales para coincidir con tu nuevo objetivo.</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Peso (kg)</label>
                    <input type="number" value={metaPeso} onChange={(e) => setMetaPeso(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Grasa (%)</label>
                    <input type="number" value={metaGrasa} onChange={(e) => setMetaGrasa(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Cintura (cm)</label>
                    <input type="number" value={metaCintura} onChange={(e) => setMetaCintura(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Visceral</label>
                    <input type="number" value={metaVisceral} onChange={(e) => setMetaVisceral(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Meta Músculo (%)</label>
                    <input type="number" value={metaMusculo} onChange={(e) => setMetaMusculo(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-gray-300 font-bold mb-4 flex items-center gap-2"><Edit3 size={18} /> Origen del Héroe (Datos Iniciales)</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-gray-900/50 p-4 rounded-lg">
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-gray-500 block mb-1">Fecha</label>
                    <input type="date" value={datosIniciales.fecha || ''} onChange={(e) => actualizarInicio('fecha', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Peso (kg)</label>
                    <input type="number" value={datosIniciales.peso || ''} onChange={(e) => actualizarInicio('peso', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Grasa (kg)</label>
                    <input type="number" value={datosIniciales.grasaKg || ''} onChange={(e) => actualizarInicio('grasaKg', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-yellow-500 font-semibold"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Cintura (cm)</label>
                    <input type="number" value={datosIniciales.cintura || ''} onChange={(e) => actualizarInicio('cintura', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-purple-400 font-semibold"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Visceral</label>
                    <input type="number" value={datosIniciales.visceral || ''} onChange={(e) => actualizarInicio('visceral', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-orange-400 font-semibold"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Músculo (%)</label>
                    <input type="number" value={datosIniciales.musculoPct || ''} onChange={(e) => actualizarInicio('musculoPct', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-blue-400 font-semibold"/>
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-red-500 font-bold flex items-center gap-2"><Skull size={18} /> Bestiario y Botín (Creador de Jefes)</h3>
                    <p className="text-xs text-gray-400 mt-1">Define los enemigos que aparecerán según tu progreso.</p>
                  </div>
                  <button onClick={agregarBoss} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1 transition">
                    <PlusCircle size={14} /> Agregar Jefe
                  </button>
                </div>
                
                <div className="space-y-3">
                  {bosses.map((boss) => (
                    <div key={boss.id} className="flex flex-col md:flex-row gap-2 items-center bg-gray-900/50 p-3 rounded border border-gray-700">
                      <div className="w-full md:w-40">
                        <label className="text-[10px] text-gray-500 block">Tipo/Requisito</label>
                        <select value={boss.tipo} onChange={(e) => {
                            actualizarBoss(boss.id, 'tipo', e.target.value);
                            actualizarBoss(boss.id, 'nombre', generarNombreJefe(e.target.value));
                          }} 
                          className="w-full bg-gray-800 text-xs p-1 rounded border border-gray-600 text-white mb-1">
                          <option value="peso">⚖️ Peso (-kg)</option>
                          <option value="cintura">📏 Cintura (-cm)</option>
                          <option value="visceral">🫀 Visceral (-nv)</option>
                          <option value="musculo">💪 Músculo (+%)</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-500">A los</span>
                          <input type="number" value={boss.valor} onChange={(e) => actualizarBoss(boss.id, 'valor', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-transparent border-b border-gray-600 font-bold text-center outline-none text-xs text-red-400"/>
                        </div>
                      </div>

                      <div className="flex-1 w-full border-l border-gray-700 pl-2">
                        <label className="text-[10px] text-gray-500 block">Nombre del Jefe</label>
                        <div className="flex gap-2 items-center">
                          <button onClick={() => actualizarBoss(boss.id, 'nombre', generarNombreJefe(boss.tipo))} className="text-gray-400 hover:text-emerald-400 transition transform hover:rotate-180 duration-300">🎲</button>
                          <input type="text" value={boss.nombre} onChange={(e) => actualizarBoss(boss.id, 'nombre', e.target.value)} className="w-full bg-transparent border-b border-gray-600 font-bold text-white outline-none text-sm"/>
                        </div>
                      </div>

                      <div className="flex-1 w-full border-l border-gray-700 pl-2">
                         <label className="text-[10px] text-gray-500 block">Botín (Loot)</label>
                         <div className="flex gap-2 items-center relative">
                           <button onClick={() => setPickerOpenId(pickerOpenId === boss.id ? null : boss.id)} className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-sm transition z-20">
                             {boss.icono}
                           </button>
                           <input type="text" value={boss.premio} onChange={(e) => actualizarBoss(boss.id, 'premio', e.target.value)} className="w-full bg-transparent border-b border-gray-600 outline-none text-sm text-yellow-400"/>
                           
                           {pickerOpenId === boss.id && (
                             <div className="absolute top-10 left-0 bg-gray-800 border border-gray-600 rounded-lg p-2 grid grid-cols-6 gap-1 z-30 shadow-2xl">
                               {LOOT_ICONS.map(icon => (
                                 <button key={icon} onClick={() => { actualizarBoss(boss.id, 'icono', icon); setPickerOpenId(null); }} className="text-lg hover:bg-gray-700 rounded p-1 transition">{icon}</button>
                               ))}
                             </div>
                           )}
                         </div>
                      </div>

                      <button onClick={() => borrarBoss(boss.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded self-end md:self-center transition mt-2 md:mt-0"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div><h3 className="text-red-500 font-bold flex items-center gap-2 mb-1">Zona de Peligro</h3></div>
                  <button onClick={borrarPartida} className="bg-red-900/50 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition border border-red-700/50">Borrar Partida</button>
                </div>
              </section>

            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0 text-right">
              <button onClick={guardarYCerrarConfig} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition">Guardar y Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* --- UI PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- BARRA LATERAL --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-5 md:p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sword size={24} />
                <h2 className="text-xl font-bold">Héroe</h2>
              </div>
              <button onClick={() => setMostrarConfig(true)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition">
                <Settings size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Peso</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaPeso} <span className="text-xs text-gray-500 font-normal">kg</span></div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Grasa</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaGrasa} <span className="text-xs text-gray-500 font-normal">%</span></div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Cintura</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaCintura} <span className="text-xs text-gray-500 font-normal">cm</span></div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Visceral</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaVisceral}</div>
              </div>
              <div className="bg-gray-900/80 border border-gray-700 p-3 rounded-lg relative overflow-hidden col-span-2">
                <div className="absolute -right-2 -top-2 text-gray-800 opacity-50"><Target size={40}/></div>
                <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1 z-10 relative">Meta Músculo</div>
                <div className="text-xl font-bold text-white z-10 relative">{metaMusculo} <span className="text-xs text-gray-500 font-normal">%</span></div>
              </div>
            </div>

            <hr className="border-gray-700 my-4" />

            <div>
              <button onClick={() => setRegistroAbierto(!registroAbierto)} className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-700 p-3 rounded-lg font-semibold text-sm transition text-white border border-gray-600">
                <div className="flex items-center gap-2"><PlusCircle size={16} className="text-emerald-400" /> Registro Semanal</div>
                {registroAbierto ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {registroAbierto && (
                <div className="space-y-3 mt-4 animate-in slide-in-from-top-2 fade-in">
                  <div>
                    <label className="text-xs text-gray-500">Fecha</label>
                    <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white"/>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500">Peso Actual (kg)</label>
                      <input type="number" placeholder="84.5" value={nuevoPeso} onChange={(e) => setNuevoPeso(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-emerald-500 outline-none"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">Cintura (cm)</label>
                      <input type="number" placeholder="90" value={nuevaCintura} onChange={(e) => setNuevaCintura(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-purple-500 outline-none"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500">% Grasa</label>
                      <input type="number" placeholder="25" value={nuevoGrasaPct} onChange={(e) => setNuevoGrasaPct(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500">% Músculo</label>
                      <input type="number" placeholder="38" value={nuevoMusculoPct} onChange={(e) => setNuevoMusculoPct(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-yellow-500 font-bold">Grasa(kg)</label>
                      <input type="number" placeholder="kg" value={nuevoGrasaKg} onChange={(e) => setNuevoGrasaKg(e.target.value)} className="w-full bg-gray-900 border border-yellow-700/50 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"/>
                    </div>
                    <div>
                      <label className="text-[10px] text-orange-400 font-bold">Visceral (nv)</label>
                      <input type="number" placeholder="10" value={nuevoVisceral} onChange={(e) => setNuevoVisceral(e.target.value)} className="w-full bg-gray-900 border border-orange-700/50 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"/>
                    </div>
                  </div>
                  
                  <button onClick={registrarProgreso} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg">
                    <Save size={18} /> Guardar Progreso
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
            <h4 className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2"><Info size={14}/> Datos Base</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between"><span>Altura:</span> <span className="text-white">{perfil.altura} cm</span></div>
              <div className="flex justify-between"><span>Edad:</span> <span className="text-white">{edadCalculada} años</span></div>
              <div className="flex justify-between"><span>Actividad:</span> <span className="text-white">x{perfil.actividad}</span></div>
            </div>
          </div>
        </div>

        {/* --- DASHBOARD --- */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-red-500">
              FitRPG: Boss Rush
            </h1>
            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-700">v11.0 Muscle & Charts</span>
          </div>

          {/* --- ESTADÍSTICAS ACTUALES (DESTACADAS) --- */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 rounded-xl border border-gray-700 shadow-xl">
             <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-300">
                <Star className="text-yellow-500" size={16}/> Estado Actual del Héroe
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center text-center">
                   <div className="p-3 mb-2 bg-red-900/30 rounded-full border border-red-500/30"><Sword size={24} className="text-red-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Peso</div>
                   <div className="text-2xl font-black text-white">{pesoActual} <span className="text-sm font-normal text-gray-500">kg</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-yellow-900/30 rounded-full border border-yellow-500/30"><Flame size={24} className="text-yellow-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">% Grasa</div>
                   <div className="text-2xl font-black text-white">{grasaPctActual.toFixed(1)} <span className="text-sm font-normal text-gray-500">%</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-blue-900/30 rounded-full border border-blue-500/30"><BicepsFlexed size={24} className="text-blue-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">% Músculo</div>
                   <div className="text-2xl font-black text-white">{musculoPctActual.toFixed(1)} <span className="text-sm font-normal text-gray-500">%</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-purple-900/30 rounded-full border border-purple-500/30"><Shield size={24} className="text-purple-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Cintura</div>
                   <div className="text-2xl font-black text-white">{cinturaActual} <span className="text-sm font-normal text-gray-500">cm</span></div>
                </div>
                <div className="flex flex-col items-center text-center border-l border-gray-700 pl-4">
                   <div className="p-3 mb-2 bg-orange-900/30 rounded-full border border-orange-500/30"><Droplet size={24} className="text-orange-400"/></div>
                   <div className="text-[10px] text-gray-400 uppercase tracking-widest">Visceral</div>
                   <div className="text-2xl font-black text-white">{visceralActual} <span className="text-sm font-normal text-gray-500">nv</span></div>
                </div>
             </div>
          </div>

          {/* --- SECCIÓN DE JEFES ACTIVOS --- */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-500">
              <Skull /> Cacería Activa (Jefes de Región)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {activePesoBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-red-400 mb-1 flex items-center gap-1"><Sword size={10}/> Jefe de Peso</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activePesoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activePesoBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-red-600 to-red-800 h-full transition-all duration-1000 ease-out" style={{ width: `${activePesoBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activePesoBoss.hpRemaining.toFixed(1)} / {activePesoBoss.maxHp.toFixed(1)} kg</div>
                  </div>
                </div>
              )}

              {activeCinturaBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-purple-900 shadow-[0_0_20px_rgba(147,51,234,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-1"><Shield size={10}/> Jefe de Cintura</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeCinturaBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activeCinturaBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-800 h-full transition-all duration-1000 ease-out" style={{ width: `${activeCinturaBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activeCinturaBoss.hpRemaining.toFixed(1)} / {activeCinturaBoss.maxHp.toFixed(1)} cm</div>
                  </div>
                </div>
              )}

              {activeVisceralBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-orange-900 shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-orange-400 mb-1 flex items-center gap-1"><Droplet size={10}/> Jefe de Órganos</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeVisceralBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activeVisceralBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-700 h-full transition-all duration-1000 ease-out" style={{ width: `${activeVisceralBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activeVisceralBoss.hpRemaining.toFixed(1)} / {activeVisceralBoss.maxHp.toFixed(1)} nv</div>
                  </div>
                </div>
              )}

              {activeMusculoBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-blue-900 shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-blue-400 mb-1 flex items-center gap-1"><BicepsFlexed size={10}/> Jefe de Debilidad</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeMusculoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0"><div className="text-xl leading-none">{activeMusculoBoss.icono}</div></div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-full transition-all duration-1000 ease-out" style={{ width: `${activeMusculoBoss.hpPct}%` }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">HP: {activeMusculoBoss.hpRemaining.toFixed(1)} / {activeMusculoBoss.maxHp.toFixed(1)} %</div>
                  </div>
                </div>
              )}

              {(!activePesoBoss && !activeCinturaBoss && !activeVisceralBoss && !activeMusculoBoss) && (
                <div className="col-span-full bg-emerald-900/20 p-5 rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                  <Trophy className="text-emerald-500 mb-2" size={32} />
                  <h3 className="text-emerald-400 font-bold text-lg">Reino Purificado</h3>
                  <p className="text-xs text-gray-400">Has derrotado a todos los jefes conocidos. Eres una leyenda.</p>
                </div>
              )}
            </div>
          </div>

          {/* --- HISTORIAL DE BATALLA PLEGABLE Y DETALLADO --- */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button 
              onClick={() => setHistorialAbierto(!historialAbierto)} 
              className="w-full flex items-center justify-between bg-gray-800 hover:bg-gray-750 p-6 font-semibold text-lg transition text-white"
            >
              <div className="flex items-center gap-2"><Activity size={20} className="text-emerald-400" /> Historial de Batalla y Gráficos</div>
              {historialAbierto ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {historialAbierto && (
              <div className="p-6 border-t border-gray-700 bg-gray-900/50 animate-in slide-in-from-top-2 fade-in">
                
                {/* Selector de Gráfico */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button onClick={() => setChartStat('peso')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='peso'?'bg-red-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Peso (kg)</button>
                  <button onClick={() => setChartStat('grasaPct')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='grasaPct'?'bg-yellow-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Grasa (%)</button>
                  <button onClick={() => setChartStat('musculoPct')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='musculoPct'?'bg-blue-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Músculo (%)</button>
                  <button onClick={() => setChartStat('cintura')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='cintura'?'bg-purple-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Cintura (cm)</button>
                  <button onClick={() => setChartStat('visceral')} className={`px-3 py-1 rounded text-xs font-bold transition ${chartStat==='visceral'?'bg-orange-600 text-white':'bg-gray-800 text-gray-400 border border-gray-600'}`}>Visceral</button>
                </div>

                <div className="w-full h-56 bg-gray-900/80 rounded-lg p-6 relative overflow-hidden mb-6 border border-gray-700">
                   {historialOrdenado.length > 1 ? (
                     <div className="w-full h-full relative">
                        <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                           {/* Líneas guía de fondo */}
                           <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="#333" strokeDasharray="2,2" strokeWidth="1" />
                           <line x1="0" y1="75" x2="500" y2="75" stroke="#444" strokeDasharray="4,4" strokeWidth="1" />
                           <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="#333" strokeDasharray="2,2" strokeWidth="1" />
                           
                           {/* Línea de datos */}
                           <polyline fill="none" stroke="#10b981" strokeWidth="3" points={polylinePoints} strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg"/>
                           
                           {/* Puntos y Etiquetas */}
                           {chartPoints.map((p, i) => (
                             <g key={i}>
                               <circle cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="#111827" strokeWidth="2" className="cursor-pointer" />
                               {/* Solo mostramos valores en el primero, último o si hay pocos datos */}
                               {(i === 0 || i === chartPoints.length - 1 || chartPoints.length <= 5) && (
                                 <text x={p.x} y={p.y - 10} fill="#9ca3af" fontSize="10" textAnchor="middle" fontWeight="bold">
                                   {p.val}
                                 </text>
                               )}
                             </g>
                           ))}
                        </svg>
                     </div>
                   ) : (
                     <div className="flex items-center justify-center h-full text-gray-500">Necesitas más de 1 registro para el gráfico</div>
                   )}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                    <thead className="text-[10px] uppercase bg-gray-800 text-gray-400 border-b border-gray-700">
                      <tr>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Peso (kg)</th>
                        <th className="p-3">% Grasa</th>
                        <th className="p-3">% Músculo</th>
                        <th className="p-3">Cintura (cm)</th>
                        <th className="p-3">Visceral</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {historialOrdenado.slice().reverse().map((h, idx) => {
                        const prev = historialOrdenado.slice().reverse()[idx + 1];
                        
                        const renderDelta = (valAct, valPrev, isMuscle = false) => {
                          if (!valPrev) return null;
                          const diff = valAct - valPrev;
                          if (diff === 0) return <span className="text-gray-600 text-[10px] ml-2">(-)</span>;
                          
                          // Músculo: positivo es verde, negativo es rojo. Peso/Grasa: positivo es rojo, negativo es verde.
                          const goodColor = isMuscle ? 'text-emerald-400' : 'text-emerald-400';
                          const badColor = isMuscle ? 'text-red-400' : 'text-red-400';
                          const color = isMuscle ? (diff > 0 ? goodColor : badColor) : (diff > 0 ? badColor : goodColor);
                          const sign = diff > 0 ? '+' : '';

                          return <span className={`${color} text-[10px] ml-2`}>({sign}{diff.toFixed(1)})</span>;
                        };

                        return (
                          <tr key={idx} className="hover:bg-gray-800/50 transition">
                            <td className="p-3 font-mono">{h.fecha}</td>
                            <td className="p-3 font-bold text-white">{h.peso} {renderDelta(h.peso, prev?.peso)}</td>
                            <td className="p-3 text-yellow-400">{h.grasaPct}% {renderDelta(h.grasaPct, prev?.grasaPct)}</td>
                            <td className="p-3 text-blue-400">{h.musculoPct || '-'}% {renderDelta(h.musculoPct, prev?.musculoPct, true)}</td>
                            <td className="p-3 text-purple-400">{h.cintura}cm {renderDelta(h.cintura, prev?.cintura)}</td>
                            <td className="p-3 text-orange-400">{h.visceral}nv {renderDelta(h.visceral, prev?.visceral)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* BESTIARIO Y BOTÍN */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Bestiario y Botines (Progreso Global)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bosses.sort((a,b) => a.valor - b.valor).map((boss) => {
                let progresoActual = 0;
                if(boss.tipo === 'peso') progresoActual = kilosPerdidos;
                if(boss.tipo === 'cintura') progresoActual = cinturaPerdidaCm;
                if(boss.tipo === 'visceral') progresoActual = visceralPerdida;
                if(boss.tipo === 'musculo') progresoActual = musculoGanadoPct;

                const derrotado = progresoActual >= boss.valor;
                
                const colorBorde = boss.tipo === 'peso' ? 'border-red-500' : boss.tipo === 'cintura' ? 'border-purple-500' : boss.tipo === 'musculo' ? 'border-blue-500' : 'border-orange-500';
                const unidad = boss.tipo === 'peso' ? 'kg' : boss.tipo === 'cintura' ? 'cm' : boss.tipo === 'musculo' ? '%' : 'nv';
                const iconoTipo = boss.tipo === 'peso' ? <Sword size={14}/> : boss.tipo === 'cintura' ? <Shield size={14}/> : boss.tipo === 'musculo' ? <BicepsFlexed size={14}/> : <Droplet size={14}/>;
                const shadowColor = boss.tipo === 'peso' ? 'red' : boss.tipo === 'cintura' ? 'purple' : boss.tipo === 'musculo' ? 'blue' : 'orange';
                
                const bgStyle = derrotado ? `bg-gray-800 ${colorBorde} shadow-[0_0_15px_rgba(0,0,0,0.5)] shadow-${shadowColor}-500/20` : 'bg-gray-900 border-gray-700 opacity-60 grayscale';

                return (
                  <div key={boss.id} className={`relative p-4 rounded-xl text-center border-2 transition-all duration-300 ${bgStyle}`}>
                    <div className={`absolute top-2 right-2 ${derrotado ? 'text-gray-400' : 'text-gray-600'}`}>
                      {iconoTipo}
                    </div>
                    
                    <div className="text-3xl mb-2">{derrotado ? '💀' : '👹'}</div>
                    <div className={`text-[11px] font-bold truncate px-1 ${derrotado ? 'line-through text-gray-500' : 'text-white'}`}>
                      {boss.nombre}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-2xl mb-1 filter drop-shadow-md">{derrotado ? boss.icono : '🔒'}</div>
                      <div className={`text-[10px] font-bold ${derrotado ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {derrotado ? '¡LOOT OBTENIDO!' : 'Botín Bloqueado'}
                      </div>
                      <div className="text-xs text-gray-300 font-semibold truncate px-1">{boss.premio}</div>
                      <div className="text-[10px] text-gray-500 mt-1">Daño Req: {boss.valor}{unidad}</div>
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