import React, { useState, useEffect } from 'react';
import { Trophy, Sword, Activity, Save, PlusCircle, Settings, Trash2, X, Edit3, Ruler, Flame, Heart, Info, Skull, Shield, Droplet } from 'lucide-react';

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
    return saved !== null ? JSON.parse(saved) : 9.0; // Nivel 9 es el límite saludable general
  });
  
  const [perfil, setPerfil] = useState(() => {
    const saved = localStorage.getItem('fitrpg_perfil');
    return saved !== null ? JSON.parse(saved) : {
      altura: 175,
      edad: 30,
      genero: 'hombre',
      actividad: 1.2
    };
  });

  const [historial, setHistorial] = useState(() => {
    const saved = localStorage.getItem('fitrpg_historial');
    return saved !== null ? JSON.parse(saved) : [
      { fecha: '2023-10-01', peso: 90.0, grasaPct: 30, grasaKg: 27.0, cintura: 105, visceral: 15 },
      { fecha: '2023-11-01', peso: 88.5, grasaPct: 29, grasaKg: 25.6, cintura: 102, visceral: 14 },
      { fecha: '2023-12-01', peso: 86.2, grasaPct: 28, grasaKg: 24.1, cintura: 99, visceral: 13 },
      { fecha: '2024-01-15', peso: 85.0, grasaPct: 27.5, grasaKg: 23.3, cintura: 98, visceral: 12 },
    ];
  });

  // --- NUEVO SISTEMA DE JEFES (BOSSES) ---
  const [bosses, setBosses] = useState(() => {
    const saved = localStorage.getItem('fitrpg_bosses_v3');
    return saved !== null ? JSON.parse(saved) : [
      { id: 1, tipo: 'peso', valor: 5, nombre: "Gordantúa, el Devorador", premio: "Cena Cheat Meal", icono: "🍔" },
      { id: 2, tipo: 'cintura', valor: 5, nombre: "Cinturónicus, el Asfixiante", premio: "Cinturón Nuevo", icono: "👖" },
      { id: 3, tipo: 'visceral', valor: 3, nombre: "Duque Víscera, Señor Tóxico", premio: "Masaje Relajante", icono: "💆" },
      { id: 4, tipo: 'peso', valor: 10, nombre: "Barón Carbohidrato", premio: "Videojuego Nuevo", icono: "🎮" },
      { id: 5, tipo: 'cintura', valor: 10, nombre: "Don Llantita, el Inflexible", premio: "Camisa Ajustada", icono: "👕" },
      { id: 6, tipo: 'visceral', valor: 6, nombre: "Gólem de Colesterol", premio: "Zapatillas Deportivas", icono: "👟" },
      { id: 7, tipo: 'peso', valor: 15, nombre: "El Gran Sedentario", premio: "Día de Spa", icono: "🛀" },
      { id: 8, tipo: 'peso', valor: 20, nombre: "Lord Grasa, el Jefe Final", premio: "Viaje de Fin de Semana", icono: "✈️" },
    ];
  });

  // Estados del formulario temporales
  const [nuevoPeso, setNuevoPeso] = useState('');
  const [nuevoGrasaPct, setNuevoGrasaPct] = useState('');
  const [nuevoGrasaKg, setNuevoGrasaKg] = useState('');
  const [nuevaCintura, setNuevaCintura] = useState('');
  const [nuevoVisceral, setNuevoVisceral] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().split('T')[0]);
  
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [mostrarConfeti, setMostrarConfeti] = useState(false);

  // --- EFECTO DE GUARDADO AUTOMÁTICO ---
  useEffect(() => {
    localStorage.setItem('fitrpg_metaPeso', JSON.stringify(metaPeso));
    localStorage.setItem('fitrpg_metaGrasa', JSON.stringify(metaGrasa));
    localStorage.setItem('fitrpg_metaCintura', JSON.stringify(metaCintura));
    localStorage.setItem('fitrpg_metaVisceral', JSON.stringify(metaVisceral));
    localStorage.setItem('fitrpg_perfil', JSON.stringify(perfil));
    localStorage.setItem('fitrpg_historial', JSON.stringify(historial));
    localStorage.setItem('fitrpg_bosses_v3', JSON.stringify(bosses));
  }, [metaPeso, metaGrasa, metaCintura, metaVisceral, perfil, historial, bosses]);

  // --- CÁLCULOS AUTOMÁTICOS EN FORMULARIO ---
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

  // --- CÁLCULOS PRINCIPALES DEL HISTORIAL ---
  const historialOrdenado = [...historial].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const datosIniciales = historialOrdenado[0] || {};
  const ultimoRegistro = historialOrdenado[historialOrdenado.length - 1] || {};
  
  const pesoActual = ultimoRegistro.peso || 0;
  const grasaKgActual = ultimoRegistro.grasaKg || (ultimoRegistro.peso * (ultimoRegistro.grasaPct / 100)) || 0;
  const cinturaActual = ultimoRegistro.cintura || 0;
  const visceralActual = ultimoRegistro.visceral || 0;
  
  const pesoInicial = datosIniciales.peso || 0;
  const grasaKgInicial = datosIniciales.grasaKg || (datosIniciales.peso * (datosIniciales.grasaPct / 100)) || 0;
  const cinturaInicial = datosIniciales.cintura || 0;
  const visceralInicial = datosIniciales.visceral || 0;

  const kilosPerdidos = Math.max(0, pesoInicial - pesoActual);
  const grasaPerdidaKg = Math.max(0, grasaKgInicial - grasaKgActual);
  const cinturaPerdidaCm = Math.max(0, cinturaInicial - cinturaActual);
  const visceralPerdida = Math.max(0, visceralInicial - visceralActual);

  // --- LÓGICA DE JEFES ACTIVOS (BOSS RUSH) ---
  const getActiveBoss = (tipo, progresoActual) => {
    const sorted = bosses.filter(b => b.tipo === tipo).sort((a,b) => a.valor - b.valor);
    const currentBoss = sorted.find(b => b.valor > progresoActual);
    
    if (!currentBoss) return null; // Derrotó a todos los de este tipo

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

  // --- CÁLCULOS BIO-ESCÁNER ---
  const calcularMetabolismo = () => {
    const pActual = pesoActual || 0;
    const pAltura = perfil.altura || 0;
    const pEdad = perfil.edad || 0;

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

    const nuevoRegistro = {
      fecha: nuevaFecha,
      peso: parseFloat(nuevoPeso),
      grasaPct: nuevoGrasaPct ? parseFloat(nuevoGrasaPct) : (ultimoRegistro.grasaPct || 0),
      grasaKg: nuevoGrasaKg ? parseFloat(nuevoGrasaKg) : (parseFloat(nuevoPeso) * (parseFloat(nuevoGrasaPct || ultimoRegistro.grasaPct || 0) / 100)),
      cintura: nuevaCintura ? parseFloat(nuevaCintura) : (ultimoRegistro.cintura || 0),
      visceral: nuevoVisceral ? parseFloat(nuevoVisceral) : (ultimoRegistro.visceral || 0)
    };

    setHistorial([...historial, nuevoRegistro]);
    
    if (nuevoRegistro.peso < pesoActual || nuevoRegistro.cintura < cinturaActual || nuevoRegistro.visceral < visceralActual) {
      setMostrarConfeti(true);
      setTimeout(() => setMostrarConfeti(false), 3000);
    }

    setNuevoPeso('');
    setNuevoGrasaPct('');
    setNuevoGrasaKg('');
    setNuevaCintura('');
    setNuevoVisceral('');
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
    setBosses([...bosses, { id: nuevoId, tipo: 'peso', valor: 5, nombre: "Nuevo Engendro", premio: "Premio Sorpresa", icono: "🎁" }]);
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

  const generarPuntosGrafico = () => {
    if (historialOrdenado.length < 2) return "";
    const minVal = Math.min(...historialOrdenado.map(h => h.peso)) - 5;
    const maxVal = Math.max(...historialOrdenado.map(h => h.peso)) + 5;
    const width = 500;
    const height = 150;
    
    return historialOrdenado.map((d, i) => {
      const x = (i / (historialOrdenado.length - 1)) * width;
      const y = height - ((d.peso - minVal) / (maxVal - minVal)) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  // --- COMPONENTE DE BARRA IMC ---
  const IMCBar = ({ imc }) => {
    const minScale = 15;
    const maxScale = 40;
    const safeIMC = isNaN(imc) ? 0 : imc; 
    const percent = Math.min(100, Math.max(0, ((safeIMC - minScale) / (maxScale - minScale)) * 100));
    
    return (
      <div className="mt-4">
        <div className="flex justify-between text-[10px] text-gray-400 mb-1">
          <span>Bajo (&lt;18.5)</span>
          <span>Normal (18.5-25)</span>
          <span>Sobrepeso (25-30)</span>
          <span>Obesidad (&gt;30)</span>
        </div>
        <div className="relative h-6 w-full rounded-full overflow-hidden flex">
          <div className="h-full bg-blue-500 w-[14%]"></div>
          <div className="h-full bg-emerald-500 w-[26%]"></div>
          <div className="h-full bg-yellow-500 w-[20%]"></div>
          <div className="h-full bg-red-500 flex-1"></div>
          
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white border-x border-black shadow-[0_0_10px_rgba(0,0,0,0.8)] transition-all duration-1000"
            style={{ left: `${percent}%` }}
          ></div>
        </div>
        <div className="text-center mt-2 font-bold text-white">
          Tu IMC: {safeIMC.toFixed(1)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 md:p-8 relative">
      
      {mostrarConfeti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">⚔️ ¡GOLPE CRÍTICO! ⚔️</div>
        </div>
      )}

      {/* --- MODAL DE CONFIGURACIÓN --- */}
      {mostrarConfig && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-600 shadow-2xl">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="text-gray-400" /> Configuración de Aventura
              </h2>
              <button onClick={() => setMostrarConfig(false)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              
              {/* Sección 0: PERFIL BIOMÉTRICO */}
              <section className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                  <Heart size={18} /> Datos Biométricos (Para Bio-Escáner)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Género</label>
                    <select value={perfil.genero} onChange={(e) => actualizarPerfil('genero', e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none">
                      <option value="hombre">Hombre</option>
                      <option value="mujer">Mujer</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Edad (años)</label>
                    <input type="number" value={perfil.edad} onChange={(e) => actualizarPerfil('edad', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Altura (cm)</label>
                    <input type="number" value={perfil.altura} onChange={(e) => actualizarPerfil('altura', e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Nivel Actividad</label>
                    <select value={perfil.actividad} onChange={(e) => actualizarPerfil('actividad', parseFloat(e.target.value))} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:border-blue-500 outline-none">
                      <option value={1.2}>Sedentario (Poco ejercicio)</option>
                      <option value={1.375}>Ligero (1-3 días/sem)</option>
                      <option value={1.55}>Moderado (3-5 días/sem)</option>
                      <option value={1.725}>Intenso (6-7 días/sem)</option>
                      <option value={1.9}>Atleta Pro</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Sección 1: Editar Inicio */}
              <section>
                <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                  <Edit3 size={18} /> Origen del Héroe (Datos Iniciales)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-900/50 p-4 rounded-lg">
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
                </div>
              </section>

              {/* Sección 2: Editar JEFES */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-red-500 font-bold flex items-center gap-2">
                      <Skull size={18} /> Bestiario y Botín (Creador de Jefes)
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Define los enemigos que aparecerán según tu progreso.</p>
                  </div>
                  <button onClick={agregarBoss} className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1 transition">
                    <PlusCircle size={14} /> Agregar Jefe
                  </button>
                </div>
                
                <div className="space-y-3">
                  {bosses.map((boss) => (
                    <div key={boss.id} className="flex flex-col md:flex-row gap-2 items-center bg-gray-900/50 p-3 rounded border border-gray-700">
                      
                      <div className="w-full md:w-36">
                        <label className="text-[10px] text-gray-500 block">Tipo/Vida</label>
                        <select value={boss.tipo} onChange={(e) => actualizarBoss(boss.id, 'tipo', e.target.value)} className="w-full bg-gray-800 text-xs p-1 rounded border border-gray-600 text-white mb-1">
                          <option value="peso">⚖️ Peso (kg)</option>
                          <option value="cintura">📏 Cintura (cm)</option>
                          <option value="visceral">🫀 Visceral (Nivel)</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-500">A los</span>
                          <input type="number" value={boss.valor} onChange={(e) => actualizarBoss(boss.id, 'valor', e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-transparent border-b border-gray-600 font-bold text-center outline-none text-xs text-red-400"/>
                        </div>
                      </div>

                      <div className="flex-1 w-full border-l border-gray-700 pl-2">
                        <label className="text-[10px] text-gray-500 block">Nombre del Jefe</label>
                        <input type="text" value={boss.nombre} onChange={(e) => actualizarBoss(boss.id, 'nombre', e.target.value)} className="w-full bg-transparent border-b border-gray-600 font-bold text-white outline-none text-sm"/>
                      </div>

                      <div className="flex-1 w-full border-l border-gray-700 pl-2">
                         <label className="text-[10px] text-gray-500 block">Botín (Loot)</label>
                         <div className="flex gap-2">
                           <input type="text" value={boss.icono} onChange={(e) => actualizarBoss(boss.id, 'icono', e.target.value)} className="w-8 bg-transparent text-center border-b border-gray-600 outline-none text-sm"/>
                           <input type="text" value={boss.premio} onChange={(e) => actualizarBoss(boss.id, 'premio', e.target.value)} className="w-full bg-transparent border-b border-gray-600 outline-none text-sm text-yellow-400"/>
                         </div>
                      </div>

                      <button onClick={() => borrarBoss(boss.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded self-end md:self-center transition mt-2 md:mt-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-red-500 font-bold flex items-center gap-2 mb-1">Zona de Peligro</h3>
                  </div>
                  <button onClick={borrarPartida} className="bg-red-900/50 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition border border-red-700/50">
                    Borrar Partida
                  </button>
                </div>
              </section>

            </div>
            
            <div className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0 text-right">
              <button onClick={() => setMostrarConfig(false)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold transition">
                Guardar y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- UI PRINCIPAL --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* --- BARRA LATERAL --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sword size={24} />
                <h2 className="text-xl font-bold">Héroe</h2>
              </div>
              <button onClick={() => setMostrarConfig(true)} className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition">
                <Settings size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">🎯 Meta Peso (Kg)</label>
                <input type="number" value={metaPeso} onChange={(e) => setMetaPeso(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm focus:border-emerald-500 outline-none transition"/>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">🎯 Meta Grasa (%)</label>
                <input type="number" value={metaGrasa} onChange={(e) => setMetaGrasa(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm focus:border-yellow-500 outline-none transition"/>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">🎯 Meta Cintura (cm)</label>
                <input type="number" value={metaCintura} onChange={(e) => setMetaCintura(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm focus:border-purple-500 outline-none transition"/>
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">🎯 Meta Visceral</label>
                <input type="number" value={metaVisceral} onChange={(e) => setMetaVisceral(e.target.value === '' ? '' : parseFloat(e.target.value))} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm focus:border-orange-500 outline-none transition"/>
              </div>
            </div>

            <hr className="border-gray-700 my-4" />

            <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <PlusCircle size={16} /> Registro Semanal
            </h3>
            
            <div className="space-y-3">
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

              <div className="grid grid-cols-3 gap-2">
                 <div>
                  <label className="text-[10px] text-gray-500">% Grasa</label>
                  <input type="number" placeholder="25" value={nuevoGrasaPct} onChange={(e) => setNuevoGrasaPct(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"/>
                </div>
                <div>
                  <label className="text-[10px] text-yellow-500 font-bold">Grasa(kg)</label>
                  <input type="number" placeholder="kg" value={nuevoGrasaKg} onChange={(e) => setNuevoGrasaKg(e.target.value)} className="w-full bg-gray-900 border border-yellow-700/50 rounded p-2 text-sm text-white focus:border-yellow-500 outline-none"/>
                </div>
                <div>
                  <label className="text-[10px] text-orange-400 font-bold">Visceral</label>
                  <input type="number" placeholder="10" value={nuevoVisceral} onChange={(e) => setNuevoVisceral(e.target.value)} className="w-full bg-gray-900 border border-orange-700/50 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"/>
                </div>
              </div>
              
              <button onClick={registrarProgreso} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded font-bold transition flex items-center justify-center gap-2 shadow-lg">
                <Save size={18} /> Registrar
              </button>
            </div>
          </div>

          <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30">
            <h4 className="text-blue-400 text-sm font-bold mb-2 flex items-center gap-2"><Info size={14}/> Datos Base</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between"><span>Altura:</span> <span className="text-white">{perfil.altura} cm</span></div>
              <div className="flex justify-between"><span>Edad:</span> <span className="text-white">{perfil.edad} años</span></div>
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
            <span className="text-xs bg-gray-800 px-3 py-1 rounded-full border border-gray-700">v7.0 Pure Stats</span>
          </div>

          {/* --- SECCIÓN DE JEFES ACTIVOS --- */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-500">
              <Skull /> Cacería Activa (Jefes de Región)
            </h3>
            {/* Grid dinámico de 1 a 3 columnas dependiendo de los jefes vivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              
              {/* Boss de Peso */}
              {activePesoBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-red-900 shadow-[0_0_20px_rgba(220,38,38,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-red-400 mb-1 flex items-center gap-1"><Sword size={10}/> Jefe de Peso</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activePesoBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0">
                      <div className="text-xl leading-none">{activePesoBoss.icono}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-red-800 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${activePesoBoss.hpPct}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
                      HP: {activePesoBoss.hpRemaining.toFixed(1)} / {activePesoBoss.maxHp.toFixed(1)} kg
                    </div>
                  </div>
                </div>
              )}

              {/* Boss de Cintura */}
              {activeCinturaBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-purple-900 shadow-[0_0_20px_rgba(147,51,234,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-1"><Shield size={10}/> Jefe de Cintura</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeCinturaBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0">
                      <div className="text-xl leading-none">{activeCinturaBoss.icono}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-purple-800 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${activeCinturaBoss.hpPct}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
                      HP: {activeCinturaBoss.hpRemaining.toFixed(1)} / {activeCinturaBoss.maxHp.toFixed(1)} cm
                    </div>
                  </div>
                </div>
              )}

              {/* Boss Visceral (NUEVO) */}
              {activeVisceralBoss && (
                <div className="bg-gray-800 p-5 rounded-xl border border-orange-900 shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-orange-400 mb-1 flex items-center gap-1"><Droplet size={10}/> Jefe de Órganos</h4>
                      <h3 className="text-lg font-bold text-white leading-tight">{activeVisceralBoss.nombre}</h3>
                    </div>
                    <div className="text-right bg-gray-900/80 p-2 rounded border border-gray-700 ml-2 shrink-0">
                      <div className="text-xl leading-none">{activeVisceralBoss.icono}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-900 rounded-full h-6 overflow-hidden relative shadow-inner border border-gray-700 mt-4 z-10">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-700 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${activeVisceralBoss.hpPct}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-bold drop-shadow-md pointer-events-none">
                      HP: {activeVisceralBoss.hpRemaining.toFixed(1)} / {activeVisceralBoss.maxHp.toFixed(1)} nv
                    </div>
                  </div>
                </div>
              )}

              {(!activePesoBoss && !activeCinturaBoss && !activeVisceralBoss) && (
                <div className="col-span-full bg-emerald-900/20 p-5 rounded-xl border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                  <Trophy className="text-emerald-500 mb-2" size={32} />
                  <h3 className="text-emerald-400 font-bold text-lg">Reino Purificado</h3>
                  <p className="text-xs text-gray-400">Has derrotado a todos los jefes conocidos en esta región.</p>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas de Daño (Actualizadas con Visceral) */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="bg-gray-800 p-3 rounded-xl border-l-4 border-emerald-500 shadow-md">
              <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide">⚖️ Peso Bajado</div>
              <div className="text-xl font-bold text-white">{kilosPerdidos.toFixed(1)} <span className="text-xs font-normal text-gray-500">kg</span></div>
            </div>
            <div className="bg-gray-800 p-3 rounded-xl border-l-4 border-yellow-500 shadow-md">
              <div className="text-yellow-500 text-[10px] mb-1 font-bold uppercase tracking-wide">🔥 Grasa Pura</div>
              <div className="text-xl font-bold text-white">{grasaPerdidaKg.toFixed(1)} <span className="text-xs font-normal text-gray-500">kg</span></div>
            </div>
            <div className="bg-gray-800 p-3 rounded-xl border-l-4 border-purple-500 shadow-md">
              <div className="text-purple-400 text-[10px] mb-1 font-bold uppercase tracking-wide">📏 Cintura Menos</div>
              <div className="text-xl font-bold text-white">{cinturaPerdidaCm.toFixed(1)} <span className="text-xs font-normal text-gray-500">cm</span></div>
            </div>
            <div className="bg-gray-800 p-3 rounded-xl border-l-4 border-orange-500 shadow-md">
              <div className="text-orange-400 text-[10px] mb-1 font-bold uppercase tracking-wide">🫀 Visceral Menos</div>
              <div className="text-xl font-bold text-white">{visceralPerdida.toFixed(1)} <span className="text-xs font-normal text-gray-500">nv</span></div>
            </div>
            <div className="bg-gray-800 p-3 rounded-xl border-l-4 border-blue-500 shadow-md">
              <div className="text-gray-400 text-[10px] mb-1 uppercase tracking-wide">📊 % Grasa Actual</div>
              <div className="text-xl font-bold text-white">{ultimoRegistro.grasaPct || ((grasaKgActual/pesoActual)*100).toFixed(1)} <span className="text-xs font-normal text-gray-500">%</span></div>
            </div>
          </div>

          {/* --- BIO-ESCÁNER AVANZADO --- */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-400">
              <Activity /> Bio-Escáner & Análisis de Salud
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-400">Metabolismo Basal (TMB)</div>
                    <div className="text-sm text-gray-500">Calorías para vivir en reposo</div>
                  </div>
                  <div className="text-xl font-bold text-white">{bio.tmb.toFixed(0)} <span className="text-xs font-normal">kcal</span></div>
                </div>
                <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg border-l-4 border-orange-500">
                  <div>
                    <div className="text-xs text-gray-400">Gasto Diario Total (TDEE)</div>
                    <div className="text-sm text-gray-500">Calorías de mantenimiento real</div>
                  </div>
                  <div className="text-xl font-bold text-orange-400">{bio.tdee.toFixed(0)} <span className="text-xs font-normal text-white">kcal</span></div>
                </div>
                
                <div className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-900/50 mt-4">
                   <div className="text-xs text-emerald-400 font-bold mb-1">METAS PERFECTAS PARA TI:</div>
                   <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Peso Ideal</span>
                        <span className="text-white font-mono">{bio.pesoIdealMin.toFixed(1)} - {bio.pesoIdealMax.toFixed(1)} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Grasa Ideal</span>
                        <span className="text-white font-mono">{bio.grasaIdealMin}% - {bio.grasaIdealMax}%</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-gray-900/30 p-4 rounded-lg flex flex-col justify-center">
                 <div className="text-center mb-2">
                   <span className="text-gray-400 text-xs uppercase tracking-widest">Índice de Masa Corporal</span>
                 </div>
                 <IMCBar imc={bio.imc} />
                 <div className="mt-6 text-xs text-center text-gray-500">
                   {bio.imc < 18.5 && "Estás por debajo del peso recomendado. ¡A comer más saludable!"}
                   {bio.imc >= 18.5 && bio.imc < 25 && "¡Excelente! Estás en un rango de peso saludable."}
                   {bio.imc >= 25 && bio.imc < 30 && "Estás en sobrepeso. Un poco de ajuste y llegarás a la meta."}
                   {bio.imc >= 30 && "Estás en rango de obesidad. ¡Cada paso cuenta para mejorar tu salud!"}
                 </div>
              </div>
            </div>
          </div>

          {/* Gráfico */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">📈 Historial de Batalla (Peso)</h3>
            <div className="w-full h-48 bg-gray-900/50 rounded-lg p-4 relative overflow-hidden">
               {historialOrdenado.length > 1 ? (
                 <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#333" strokeDasharray="5,5" strokeWidth="1" />
                    <polyline 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3" 
                      points={generarPuntosGrafico()} 
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-lg"
                    />
                 </svg>
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-500">Necesitas más datos para el gráfico</div>
               )}
            </div>
          </div>

          {/* BESTIARIO Y BOTÍN */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Bestiario y Botines (Progreso Global)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bosses.sort((a,b) => a.valor - b.valor).map((boss) => {
                const progresoActual = boss.tipo === 'peso' ? kilosPerdidos : boss.tipo === 'cintura' ? cinturaPerdidaCm : visceralPerdida;
                const derrotado = progresoActual >= boss.valor;
                
                const colorBorde = boss.tipo === 'peso' ? 'border-red-500' : boss.tipo === 'cintura' ? 'border-purple-500' : 'border-orange-500';
                const unidad = boss.tipo === 'peso' ? 'kg' : boss.tipo === 'cintura' ? 'cm' : 'nv';
                const iconoTipo = boss.tipo === 'peso' ? <Sword size={14}/> : boss.tipo === 'cintura' ? <Shield size={14}/> : <Droplet size={14}/>;
                const shadowColor = boss.tipo === 'peso' ? 'red' : boss.tipo === 'cintura' ? 'purple' : 'orange';
                
                const bgStyle = derrotado ? `bg-gray-800 ${colorBorde} shadow-lg shadow-${shadowColor}-500/20` : 'bg-gray-900 border-gray-700 opacity-60 grayscale';

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
                      <div className="text-2xl mb-1">{derrotado ? boss.icono : '🔒'}</div>
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