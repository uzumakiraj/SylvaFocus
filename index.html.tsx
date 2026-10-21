import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Home, Clock, Trees, CheckSquare, BarChart3, Settings, Play, Pause, Square,
  Volume2, VolumeX, Sun, Moon, Sparkles, Plus, Trash2, Edit3, Check, X,
  Award, Flame, Target, Calendar, ChevronRight, HelpCircle, Download, Upload,
  RotateCcw, Shield, Zap, BookOpen, Filter, Search, Maximize2, Minimize2,
  Minus, Terminal, Info, Compass, Eye, CloudRain, Wind, Bird, Layers, Lock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';

// ============================================================================
// CONSTANTS, TREE SPECIES, ACHIEVEMENTS & INITIAL SAMPLE DATA
// ============================================================================

const TREE_SPECIES = [
  {
    id: 'oak',
    name: 'Emerald Oak',
    minLevel: 1,
    rarity: 'Common',
    xpBonus: 1.0,
    description: 'Sturdy and dependable. Thrives during steady foundational study sessions.',
    colors: { trunk: '#5c4033', foliage1: '#15803d', foliage2: '#22c55e', foliage3: '#4ade80' }
  },
  {
    id: 'pine',
    name: 'Boreal Whisper Pine',
    minLevel: 1,
    rarity: 'Common',
    xpBonus: 1.05,
    description: 'Resilient evergreen that stands tall through late-night problem solving.',
    colors: { trunk: '#4a3525', foliage1: '#064e3b', foliage2: '#047857', foliage3: '#10b981' }
  },
  {
    id: 'cherry',
    name: 'Sakura Blossom',
    minLevel: 2,
    rarity: 'Uncommon',
    xpBonus: 1.1,
    description: 'Delicate pink petals that bloom when creativity and memorization align.',
    colors: { trunk: '#573a2e', foliage1: '#be185d', foliage2: '#ec4899', foliage3: '#fbcfe8' }
  },
  {
    id: 'golden',
    name: 'Gilded Ginkgo',
    minLevel: 3,
    rarity: 'Rare',
    xpBonus: 1.2,
    description: 'Radiant golden leaves symbolizing deep comprehension and clarity.',
    colors: { trunk: '#6b4423', foliage1: '#b45309', foliage2: '#f59e0b', foliage3: '#fde047' }
  },
  {
    id: 'ancient',
    name: 'Ancient Redwood',
    minLevel: 4,
    rarity: 'Epic',
    xpBonus: 1.35,
    description: 'A towering monument of discipline rooted in hundreds of focused minutes.',
    colors: { trunk: '#7c2d12', foliage1: '#14532d', foliage2: '#166534', foliage3: '#86efac' }
  },
  {
    id: 'magical',
    name: 'Celestial Spirit Tree',
    minLevel: 5,
    rarity: 'Mythic',
    xpBonus: 1.5,
    description: 'Bioluminescent flora infused with pure flow-state energy.',
    colors: { trunk: '#312e81', foliage1: '#0284c7', foliage2: '#38bdf8', foliage3: '#c084fc' }
  }
];

const SEASONS = [
  { id: 'spring', name: 'Lush Spring', minLevel: 1, ground: '#1e3f2b', border: '#2e5c40', particleColor: '#86efac', skyTint: 'from-emerald-950/50 via-teal-950/30 to-stone-950/70' },
  { id: 'summer', name: 'Sunlit Summer', minLevel: 1, ground: '#244728', border: '#3b6e3f', particleColor: '#fde047', skyTint: 'from-amber-900/30 via-emerald-950/40 to-stone-950/70' },
  { id: 'autumn', name: 'Amber Autumn', minLevel: 2, ground: '#452719', border: '#6e3d26', particleColor: '#fb923c', skyTint: 'from-orange-950/50 via-amber-950/30 to-stone-950/70' },
  { id: 'winter', name: 'Nordic Frost', minLevel: 3, ground: '#1e293b', border: '#475569', particleColor: '#e2e8f0', skyTint: 'from-sky-950/50 via-slate-900/40 to-slate-950/80' },
  { id: 'firefly', name: 'Firefly Sanctuary', minLevel: 4, ground: '#0f172a', border: '#1e293b', particleColor: '#a3e635', skyTint: 'from-indigo-950/70 via-emerald-950/50 to-black/80' }
];

const DEFAULT_SUBJECTS = [
  { id: 'sub-math', name: 'Mathematics', color: '#10b981' },
  { id: 'sub-phys', name: 'Physics', color: '#3b82f6' },
  { id: 'sub-cs', name: 'Computer Science', color: '#8b5cf6' },
  { id: 'sub-chem', name: 'Chemistry', color: '#f59e0b' },
  { id: 'sub-bio', name: 'Biology', color: '#ec4899' },
  { id: 'sub-eng', name: 'English Literature', color: '#06b6d4' }
];

const ACHIEVEMENTS_LIST = [
  { id: 'first_seed', title: 'First Sapling', desc: 'Complete your very first focus session.', icon: '🌱', check: (stats) => stats.completedCount >= 1 },
  { id: 'five_trees', title: 'Grove Keeper', desc: 'Grow 5 healthy trees in your virtual forest.', icon: '🌲', check: (stats) => stats.healthyTrees >= 5 },
  { id: 'streak_3', title: 'Rooted Habit', desc: 'Maintain a 3-day study streak.', icon: '🔥', check: (stats) => stats.streak >= 3 },
  { id: 'streak_7', title: 'Unshakeable Canopy', desc: 'Maintain a 7-day study streak.', icon: '👑', check: (stats) => stats.streak >= 7 },
  { id: 'hours_5', title: 'Deep Scholar', desc: 'Accumulate 300+ minutes (5 hours) of focused study.', icon: '📚', check: (stats) => stats.totalMinutes >= 300 },
  { id: 'hours_10', title: 'Master of Flow', desc: 'Accumulate 600+ minutes (10 hours) of focused study.', icon: '✨', check: (stats) => stats.totalMinutes >= 600 },
  { id: 'task_crusher', title: 'Task Finisher', desc: 'Complete 5 study tasks.', icon: '✅', check: (stats) => stats.completedTasks >= 5 },
  { id: 'collector', title: 'Botanical Curator', desc: 'Plant at least 4 distinct tree species.', icon: '🌸', check: (stats) => stats.uniqueSpecies >= 4 }
];

const ACCENT_COLORS = [
  { id: 'emerald', name: 'Fluent Emerald', primary: '#10b981', ring: 'ring-emerald-500', bg: 'bg-emerald-600', text: 'text-emerald-400' },
  { id: 'sage', name: 'Moss & Sage', primary: '#84cc16', ring: 'ring-lime-500', bg: 'bg-lime-600', text: 'text-lime-400' },
  { id: 'amber', name: 'Sunlit Amber', primary: '#f59e0b', ring: 'ring-amber-500', bg: 'bg-amber-600', text: 'text-amber-400' },
  { id: 'cyan', name: 'Glacial Stream', primary: '#06b6d4', ring: 'ring-cyan-500', bg: 'bg-cyan-600', text: 'text-cyan-400' }
];

// Helper to get YYYY-MM-DD in local time
const toDateKey = (dateInput) => {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate rich initial sample data so the user immediately sees a living forest & populated charts
const generateSampleData = () => {
  const now = new Date();
  const sessions = [];
  const sampleConfigs = [
    { daysAgo: 12, duration: 25, subject: 'Mathematics', task: 'Linear Algebra Eigenvalues', treeType: 'oak', hour: 10 },
    { daysAgo: 11, duration: 45, subject: 'Computer Science', task: 'Graph Traversal Algorithms', treeType: 'pine', hour: 14 },
    { daysAgo: 9, duration: 30, subject: 'Physics', task: 'Electromagnetic Induction Notes', treeType: 'oak', hour: 16 },
    { daysAgo: 7, duration: 50, subject: 'Chemistry', task: 'Organic Reaction Mechanisms', treeType: 'cherry', hour: 9 },
    { daysAgo: 6, duration: 25, subject: 'Biology', task: 'Cellular Respiration Diagrams', treeType: 'pine', hour: 11 },
    { daysAgo: 5, duration: 40, subject: 'Mathematics', task: 'Multivariable Calculus Problem Set', treeType: 'cherry', hour: 15 },
    { daysAgo: 4, duration: 35, subject: 'Computer Science', task: 'Dynamic Programming Practice', treeType: 'golden', hour: 19 },
    { daysAgo: 3, duration: 25, subject: 'English Literature', task: 'Modernist Poetry Essay Outline', treeType: 'oak', hour: 13 },
    { daysAgo: 2, duration: 50, subject: 'Physics', task: 'Quantum Wavefunction Exercises', treeType: 'golden', hour: 17 },
    { daysAgo: 2, duration: 25, subject: 'Mathematics', task: 'Differential Equations Review', treeType: 'pine', hour: 20 },
    { daysAgo: 1, duration: 45, subject: 'Computer Science', task: 'System Architecture Case Study', treeType: 'ancient', hour: 10 },
    { daysAgo: 1, duration: 30, subject: 'Chemistry', task: 'Chemical Equilibrium Lab Prep', treeType: 'cherry', hour: 16 },
    { daysAgo: 0, duration: 25, subject: 'Physics', task: 'Thermodynamics Chapter 4', treeType: 'oak', hour: 9 },
    { daysAgo: 0, duration: 35, subject: 'Computer Science', task: 'React Performance Optimization', treeType: 'golden', hour: 11 }
  ];

  sampleConfigs.forEach((cfg, idx) => {
    const d = new Date(now);
    d.setDate(d.getDate() - cfg.daysAgo);
    d.setHours(cfg.hour, 15, 0, 0);
    sessions.push({
      id: `sample-sess-${idx}`,
      timestamp: d.toISOString(),
      dateKey: toDateKey(d),
      durationMinutes: cfg.duration,
      subject: cfg.subject,
      taskTitle: cfg.task,
      treeType: cfg.treeType,
      status: 'completed',
      xpEarned: Math.round(cfg.duration * 10),
      isSample: true
    });
  });

  const todayStr = toDateKey(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const tasks = [
    {
      id: 'sample-task-1',
      title: 'Solve 15 Integration by Parts Problems',
      subject: 'Mathematics',
      chapter: 'Chapter 7: Techniques of Integration',
      priority: 'High',
      estimatedMinutes: 45,
      completed: false,
      deadline: todayStr,
      notes: 'Focus on trigonometric substitutions and tabular integration.',
      isSample: true
    },
    {
      id: 'sample-task-2',
      title: 'Implement Binary Heap & Priority Queue',
      subject: 'Computer Science',
      chapter: 'Module 4: Heaps & Trees',
      priority: 'Critical',
      estimatedMinutes: 50,
      completed: false,
      deadline: todayStr,
      notes: 'Ensure O(log n) insertion and extraction with unit tests.',
      isSample: true
    },
    {
      id: 'sample-task-3',
      title: 'Review Maxwell’s Equations Derivation',
      subject: 'Physics',
      chapter: 'Unit 5: Electrodynamics',
      priority: 'Medium',
      estimatedMinutes: 25,
      completed: true,
      deadline: todayStr,
      notes: 'Compare integral and differential forms.',
      isSample: true
    },
    {
      id: 'sample-task-4',
      title: 'Summarize Molecular Orbital Theory',
      subject: 'Chemistry',
      chapter: 'Chapter 9: Covalent Bonding',
      priority: 'Medium',
      estimatedMinutes: 30,
      completed: false,
      deadline: toDateKey(tomorrow),
      notes: 'Draw bonding and antibonding diagrams for O2 and N2.',
      isSample: true
    },
    {
      id: 'sample-task-5',
      title: 'Annotate Act III of Hamlet',
      subject: 'English Literature',
      chapter: 'Shakespearean Tragedy',
      priority: 'Low',
      estimatedMinutes: 25,
      completed: false,
      deadline: toDateKey(yesterday),
      notes: 'Pay attention to soliloquy imagery and motif of corruption.',
      isSample: true
    }
  ];

  return { sessions, tasks };
};

// ============================================================================
// INDEXEDDB + LOCALSTORAGE DUAL PERSISTENCE LAYER
// ============================================================================

const DB_NAME = 'SylvaFocusWin11DB';
const DB_STORE = 'appState';
const STORAGE_KEY = 'sylvafocus_win11_state_v1';

const savePersistentState = async (stateObj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateObj));
  } catch (e) {
    console.warn('localStorage save warning:', e);
  }
  try {
    if (!window.indexedDB) return;
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (ev) => {
      const db = ev.target.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = (ev) => {
      const db = ev.target.result;
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).put(stateObj, 'root');
    };
  } catch (e) {
    // Fallback is already in localStorage
  }
};

const loadPersistentState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved state:', e);
  }
  return null;
};

// ============================================================================
// PROCEDURAL WEB AUDIO API FOREST AMBIENCE SYNTHESIZER
// ============================================================================

class ForestAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.windNode = null;
    this.birdInterval = null;
    this.volume = 0.35;
    this.preset = 'wind_birds'; // 'wind_birds' | 'rain' | 'stream'
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  start(preset = this.preset, volume = this.volume) {
    this.stop();
    this.init();
    this.preset = preset;
    this.volume = volume;
    if (!this.ctx) return;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(Math.max(0.01, this.volume), this.ctx.currentTime + 1.2);
    this.masterGain.connect(this.ctx.destination);

    // Generate soft pink/brown noise buffer for breeze/rain/stream
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.025;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    if (preset === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.value = 950;
      filter.Q.value = 0.7;
    } else if (preset === 'stream') {
      filter.type = 'lowpass';
      filter.frequency.value = 620;
      filter.Q.value = 1.2;
    } else {
      // Gentle forest wind
      filter.type = 'lowpass';
      filter.frequency.value = 380;
      filter.Q.value = 0.9;
    }

    noise.connect(filter);
    filter.connect(this.masterGain);
    noise.start(0);
    this.windNode = noise;
    this.isPlaying = true;

    // Gentle synthesized bird chirps if wind_birds preset is active
    if (preset === 'wind_birds') {
      this.birdInterval = setInterval(() => {
        if (!this.isPlaying || !this.ctx || Math.random() > 0.55) return;
        this.triggerBirdChirp();
      }, 3600);
    }
  }

  triggerBirdChirp() {
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 1900 + Math.random() * 900;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.32, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, now + 0.22);

      chirpGain.gain.setValueAtTime(0.001, now);
      chirpGain.gain.linearRampToValueAtTime(0.05 * this.volume, now + 0.04);
      chirpGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.25);

      osc.connect(chirpGain);
      chirpGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {
      // Ignore audio scheduling errors
    }
  }

  playChime() {
    try {
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0.001, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + idx * 0.14 + 1.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 1.15);
      });
    } catch (e) {}
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0.001, vol), this.ctx.currentTime, 0.1);
    }
  }

  stop() {
    if (this.birdInterval) {
      clearInterval(this.birdInterval);
      this.birdInterval = null;
    }
    if (this.windNode) {
      try {
        this.windNode.stop();
        this.windNode.disconnect();
      } catch (e) {}
      this.windNode = null;
    }
    this.isPlaying = false;
  }
}

const audioEngine = new ForestAudioEngine();

// ============================================================================
// CUSTOM SVG BOTANICAL TREE RENDERER (SUPPORTS GROWTH STAGES & WITHERED STATE)
// ============================================================================

const BotanicalTreeSVG = ({
  speciesId = 'oak',
  stage = 5, // 1: Seed, 2: Sprout, 3: Sapling, 4: Young Tree, 5: Mature Tree
  withered = false,
  size = 120,
  animated = true
}) => {
  const species = TREE_SPECIES.find((s) => s.id === speciesId) || TREE_SPECIES[0];
  const c = withered
    ? { trunk: '#57534e', foliage1: '#78716c', foliage2: '#a8a29e', foliage3: '#d6d3d1' }
    : species.colors;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`overflow-visible select-none ${animated ? 'transition-all duration-700 ease-out' : ''}`}
    >
      <defs>
        <radialGradient id={`glow-${speciesId}-${withered}`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={c.foliage3} stopOpacity={withered ? '0.05' : '0.35'} />
          <stop offset="100%" stopColor={c.foliage1} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="60" cy="106" rx={stage * 6 + 8} ry="5" fill="rgba(0,0,0,0.35)" />

      {/* Stage 1: Seed */}
      {stage === 1 && (
        <g>
          <path d="M46 105 Q60 96 74 105 Z" fill="#5c4033" />
          <ellipse cx="60" cy="99" rx="7" ry="5" fill="#a16207" stroke="#fde047" strokeWidth="1" />
          <path d="M60 94 Q63 89 60 85" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* Stage 2: Sprout */}
      {stage === 2 && (
        <g>
          <path d="M60 105 L60 76" stroke={c.trunk} strokeWidth="4" strokeLinecap="round" />
          <path d="M60 86 Q45 78 48 68 Q58 72 60 86" fill={c.foliage2} />
          <path d="M60 80 Q75 72 72 62 Q62 66 60 80" fill={c.foliage3} />
        </g>
      )}

      {/* Stage 3: Sapling */}
      {stage === 3 && (
        <g>
          <path d="M60 106 L60 62" stroke={c.trunk} strokeWidth="6" strokeLinecap="round" />
          <path d="M60 84 L48 72" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
          <path d="M60 78 L72 66" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
          <circle cx="46" cy="68" r="12" fill={c.foliage1} />
          <circle cx="74" cy="64" r="12" fill={c.foliage2} />
          <circle cx="60" cy="54" r="16" fill={c.foliage3} />
        </g>
      )}

      {/* Stage 4 & 5: Young & Mature Trees by Species */}
      {stage >= 4 && (
        <g transform={stage === 4 ? 'translate(12, 18) scale(0.8)' : 'translate(0, 0) scale(1)'}>
          {/* Ambient aura for mature healthy trees */}
          {!withered && stage === 5 && (
            <circle cx="60" cy="52" r="46" fill={`url(#glow-${speciesId}-${withered})`} />
          )}

          {/* Trunk & Branches */}
          <path
            d="M54 106 L57 55 L63 55 L66 106 Z"
            fill={c.trunk}
          />
          <path d="M59 75 L40 58" stroke={c.trunk} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M61 70 L80 54" stroke={c.trunk} strokeWidth="4.5" strokeLinecap="round" />

          {withered ? (
            /* Withered bare branches */
            <g>
              <path d="M58 56 L45 38 M61 56 L75 36 M40 58 L30 48 M80 54 L90 45" stroke={c.trunk} strokeWidth="3" strokeLinecap="round" />
              <circle cx="44" cy="42" r="6" fill={c.foliage1} opacity="0.5" />
              <circle cx="76" cy="44" r="5" fill={c.foliage2} opacity="0.4" />
            </g>
          ) : speciesId === 'pine' ? (
            /* Conifer layered triangles */
            <g>
              <polygon points="60,14 28,54 92,54" fill={c.foliage1} />
              <polygon points="60,26 24,68 96,68" fill={c.foliage2} />
              <polygon points="60,40 20,82 100,82" fill={c.foliage3} opacity="0.92" />
            </g>
          ) : speciesId === 'ancient' ? (
            /* Giant tiered canopy */
            <g>
              <ellipse cx="60" cy="62" rx="38" ry="16" fill={c.foliage1} />
              <ellipse cx="44" cy="46" rx="26" ry="15" fill={c.foliage2} />
              <ellipse cx="76" cy="46" rx="26" ry="15" fill={c.foliage2} />
              <ellipse cx="60" cy="30" rx="30" ry="16" fill={c.foliage3} />
            </g>
          ) : (
            /* Lush rounded crown (Oak, Cherry, Golden, Magical) */
            <g>
              <circle cx="40" cy="56" r="22" fill={c.foliage1} />
              <circle cx="80" cy="56" r="22" fill={c.foliage1} />
              <circle cx="48" cy="38" r="23" fill={c.foliage2} />
              <circle cx="72" cy="38" r="23" fill={c.foliage2} />
              <circle cx="60" cy="32" r="24" fill={c.foliage3} />
              {/* Sparkles or blossoms for special species */}
              {(speciesId === 'cherry' || speciesId === 'magical' || speciesId === 'golden') && (
                <g>
                  <circle cx="45" cy="30" r="2.5" fill="#fff" opacity="0.85" />
                  <circle cx="72" cy="28" r="2" fill="#fff" opacity="0.85" />
                  <circle cx="60" cy="46" r="2.5" fill="#fff" opacity="0.85" />
                  <circle cx="36" cy="52" r="2" fill="#fff" opacity="0.75" />
                  <circle cx="83" cy="50" r="2.2" fill="#fff" opacity="0.75" />
                </g>
              )}
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // --------------------------------------------------------------------------
  // INITIALIZATION & PERSISTENT STATE
  // --------------------------------------------------------------------------
  const initialData = useMemo(() => {
    const saved = loadPersistentState();
    if (saved && saved.sessions && saved.settings) {
      return saved;
    }
    const sample = generateSampleData();
    return {
      sessions: sample.sessions,
      tasks: sample.tasks,
      subjects: DEFAULT_SUBJECTS,
      unlockedInitialOnboarding: false,
      settings: {
        theme: 'forest', // 'dark' | 'light' | 'forest'
        accent: 'emerald',
        focusMinutes: 25,
        shortBreakMinutes: 5,
        longBreakMinutes: 15,
        longBreakInterval: 4,
        dailyGoalMinutes: 120,
        strictFocusMode: false,
        soundEnabled: false,
        soundPreset: 'wind_birds',
        soundVolume: 0.35,
        reducedMotion: false,
        selectedSeason: 'spring',
        notificationsEnabled: false
      }
    };
  }, []);

  const [sessions, setSessions] = useState(initialData.sessions);
  const [tasks, setTasks] = useState(initialData.tasks);
  const [subjects, setSubjects] = useState(initialData.subjects || DEFAULT_SUBJECTS);
  const [settings, setSettings] = useState(initialData.settings);
  const [showOnboarding, setShowOnboarding] = useState(!initialData.unlockedInitialOnboarding);

  // Navigation & Windows UI states
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'focus' | 'forest' | 'tasks' | 'analytics' | 'settings'
  const [isMaximized, setIsMaximized] = useState(true);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Focus Timer State (Timestamp-driven for background accuracy)
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [timerStatus, setTimerStatus] = useState('idle'); // 'idle' | 'running' | 'paused'
  const [totalDurationSec, setTotalDurationSec] = useState(initialData.settings.focusMinutes * 60);
  const [remainingSec, setRemainingSec] = useState(initialData.settings.focusMinutes * 60);
  const [selectedSpecies, setSelectedSpecies] = useState('oak');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [completedPomodorosInCycle, setCompletedPomodorosInCycle] = useState(0);

  const timerTargetEndRef = useRef(null);
  const timerRemainingAtPauseRef = useRef(initialData.settings.focusMinutes * 60);

  // Forest View State
  const [selectedTreeSession, setSelectedTreeSession] = useState(null);
  const [forestZoom, setForestZoom] = useState(1);
  const [forestFilterSubject, setForestFilterSubject] = useState('ALL');
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);

  // Task Manager State
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'today' | 'pending' | 'completed' | 'overdue'
  const [taskSearch, setTaskSearch] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#10b981');

  // Analytics State
  const [analyticsRange, setAnalyticsRange] = useState('week'); // 'day' | 'week' | 'month'

  // Reset confirmation modal state
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // --------------------------------------------------------------------------
  // TOAST NOTIFICATION HELPER
  // --------------------------------------------------------------------------
  const pushToast = useCallback((title, message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev.slice(-3), { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  // Save state whenever core data changes
  useEffect(() => {
    savePersistentState({
      sessions,
      tasks,
      subjects,
      settings,
      unlockedInitialOnboarding: !showOnboarding
    });
  }, [sessions, tasks, subjects, settings, showOnboarding]);

  // Manage Web Audio soundscape based on timer / user toggle
  useEffect(() => {
    if (settings.soundEnabled) {
      audioEngine.start(settings.soundPreset, settings.soundVolume);
    } else {
      audioEngine.stop();
    }
    return () => {
      audioEngine.stop();
    };
  }, [settings.soundEnabled, settings.soundPreset]);

  useEffect(() => {
    audioEngine.setVolume(settings.soundVolume);
  }, [settings.soundVolume]);

  // --------------------------------------------------------------------------
  // GAMIFICATION, XP, STREAK & DASHBOARD METRICS (DERIVED FROM REAL SESSIONS)
  // --------------------------------------------------------------------------
  const stats = useMemo(() => {
    const todayKey = toDateKey(new Date());
    const completedSessions = sessions.filter((s) => s.status === 'completed');
    const witheredSessions = sessions.filter((s) => s.status === 'withered');

    const totalMinutes = completedSessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    const totalXP = completedSessions.reduce((acc, s) => acc + (Number(s.xpEarned) || s.durationMinutes * 10), 0);

    // Every 500 XP = 1 Level
    const level = Math.max(1, Math.floor(totalXP / 500) + 1);
    const currentLevelXP = totalXP % 500;
    const nextLevelXP = 500;
    const levelProgressPct = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));

    // Today's metrics
    const todaySessions = completedSessions.filter((s) => s.dateKey === todayKey);
    const todayMinutes = todaySessions.reduce((acc, s) => acc + (Number(s.durationMinutes) || 0), 0);
    const dailyGoalPct = Math.min(100, Math.round((todayMinutes / Math.max(1, settings.dailyGoalMinutes)) * 100));

    // Calculate current streak & best streak
    const activeDatesSet = new Set(completedSessions.map((s) => s.dateKey));
    let streak = 0;
    const cursor = new Date();
    // If today has no session yet, allow yesterday to continue the streak
    if (!activeDatesSet.has(toDateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while (activeDatesSet.has(toDateKey(cursor))) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Unique tree species planted
    const uniqueSpecies = new Set(completedSessions.map((s) => s.treeType)).size;
    const completedTasks = tasks.filter((t) => t.completed).length;

    // Weekly data (last 7 days)
    const last7Days = [];
    let weeklyMinutes = 0;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const mins = completedSessions
        .filter((s) => s.dateKey === key)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      weeklyMinutes += mins;
      last7Days.push({
        dateKey: key,
        day: dayLabel,
        minutes: mins,
        goal: settings.dailyGoalMinutes
      });
    }

    return {
      todayMinutes,
      todaySessionsCount: todaySessions.length,
      todayTrees: todaySessions.length,
      dailyGoalPct,
      streak,
      totalMinutes,
      totalHours: (totalMinutes / 60).toFixed(1),
      completedCount: completedSessions.length,
      healthyTrees: completedSessions.length,
      witheredTrees: witheredSessions.length,
      avgSessionMinutes: completedSessions.length
        ? Math.round(totalMinutes / completedSessions.length)
        : 0,
      totalXP,
      level,
      currentLevelXP,
      nextLevelXP,
      levelProgressPct,
      uniqueSpecies,
      completedTasks,
      weeklyMinutes,
      last7Days
    };
  }, [sessions, tasks, settings.dailyGoalMinutes]);

  // Unlocked achievements
  const unlockedAchievements = useMemo(() => {
    return ACHIEVEMENTS_LIST.filter((ach) => ach.check(stats));
  }, [stats]);

  // --------------------------------------------------------------------------
  // TIMESTAMP-ACCURATE POMODORO TIMER LOGIC
  // --------------------------------------------------------------------------
  const switchTimerMode = useCallback(
    (newMode) => {
      setTimerStatus('idle');
      setTimerMode(newMode);
      const mins =
        newMode === 'focus'
          ? settings.focusMinutes
          : newMode === 'shortBreak'
          ? settings.shortBreakMinutes
          : settings.longBreakMinutes;
      const secs = Math.max(10, Math.round(mins * 60));
      setTotalDurationSec(secs);
      setRemainingSec(secs);
      timerRemainingAtPauseRef.current = secs;
      timerTargetEndRef.current = null;
    },
    [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]
  );

  // Sync idle timer if user changes default durations in settings
  useEffect(() => {
    if (timerStatus === 'idle') {
      switchTimerMode(timerMode);
    }
  }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes, timerMode, timerStatus, switchTimerMode]);

  const handleTimerComplete = useCallback(() => {
    setTimerStatus('idle');
    timerTargetEndRef.current = null;
    audioEngine.playChime();

    if (timerMode === 'focus') {
      const durationMins = Math.max(1, Math.round(totalDurationSec / 60));
      const speciesObj = TREE_SPECIES.find((t) => t.id === selectedSpecies) || TREE_SPECIES[0];
      const earnedXP = Math.round(durationMins * 10 * speciesObj.xpBonus);
      const linkedTask = tasks.find((t) => t.id === selectedTaskId);

      const newSession = {
        id: `sess-${Date.now()}`,
        timestamp: new Date().toISOString(),
        dateKey: toDateKey(new Date()),
        durationMinutes: durationMins,
        subject: selectedSubject || 'General Study',
        taskTitle: linkedTask ? linkedTask.title : 'Focused Study Session',
        treeType: selectedSpecies,
        status: 'completed',
        xpEarned: earnedXP
      };

      setSessions((prev) => [...prev, newSession]);

      const nextCycleCount = completedPomodorosInCycle + 1;
      setCompletedPomodorosInCycle(nextCycleCount);

      pushToast(
        `🌳 ${speciesObj.name} Planted!`,
        `+${earnedXP} XP earned for ${durationMins}m of ${newSession.subject}.`,
        'success'
      );

      if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('SylvaFocus Session Complete!', {
          body: `Your ${speciesObj.name} is now thriving in your forest (+${earnedXP} XP).`
        });
      }

      // Automatically prepare break mode
      if (nextCycleCount % settings.longBreakInterval === 0) {
        switchTimerMode('longBreak');
      } else {
        switchTimerMode('shortBreak');
      }
    } else {
      pushToast('🍃 Break Finished', 'Ready to plant your next tree whenever you are.', 'info');
      switchTimerMode('focus');
    }
  }, [
    timerMode,
    totalDurationSec,
    selectedSpecies,
    selectedSubject,
    selectedTaskId,
    tasks,
    completedPomodorosInCycle,
    settings.longBreakInterval,
    settings.notificationsEnabled,
    pushToast,
    switchTimerMode
  ]);

  useEffect(() => {
    if (timerStatus !== 'running') return;

    const interval = setInterval(() => {
      if (!timerTargetEndRef.current) return;
      const now = Date.now();
      const diffSec = Math.max(0, Math.ceil((timerTargetEndRef.current - now) / 1000));
      setRemainingSec(diffSec);

      if (diffSec <= 0) {
        clearInterval(interval);
        handleTimerComplete();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [timerStatus, handleTimerComplete]);

  const startOrResumeTimer = () => {
    if (timerStatus === 'running') return;
    const baseRemaining = timerStatus === 'paused' ? remainingSec : totalDurationSec;
    timerTargetEndRef.current = Date.now() + baseRemaining * 1000;
    setTimerStatus('running');
  };

  const pauseTimer = () => {
    if (timerStatus !== 'running') return;
    if (settings.strictFocusMode && timerMode === 'focus') {
      pushToast('Strict Focus Active', 'Pausing is disabled in Strict Focus Mode. Stay with your sapling!', 'warning');
      return;
    }
    const diffSec = Math.max(0, Math.ceil((timerTargetEndRef.current - Date.now()) / 1000));
    setRemainingSec(diffSec);
    timerRemainingAtPauseRef.current = diffSec;
    timerTargetEndRef.current = null;
    setTimerStatus('paused');
  };

  const abandonOrEndSession = () => {
    if (timerStatus === 'idle') return;
    const elapsedSec = totalDurationSec - remainingSec;

    // If user is in a focus session and has invested > 30 seconds, record a withered sapling
    // (Under 30 seconds is treated as a grace period so accidental starts are never punished)
    if (timerMode === 'focus' && elapsedSec >= 30) {
      const linkedTask = tasks.find((t) => t.id === selectedTaskId);
      const witheredSession = {
        id: `sess-withered-${Date.now()}`,
        timestamp: new Date().toISOString(),
        dateKey: toDateKey(new Date()),
        durationMinutes: Math.max(1, Math.round(elapsedSec / 60)),
        subject: selectedSubject || 'General Study',
        taskTitle: linkedTask ? linkedTask.title : 'Incomplete Session',
        treeType: selectedSpecies,
        status: 'withered',
        xpEarned: 0
      };
      setSessions((prev) => [...prev, witheredSession]);
      pushToast('🍂 Sapling Withered', 'Session ended early. An incomplete sapling was placed in your forest.', 'warning');
    } else {
      pushToast('Timer Reset', 'Session reset within grace period.', 'info');
    }

    switchTimerMode(timerMode);
  };

  // Quick 10-second demo session for testing tree growth & XP rewards immediately
  const startQuickDemoSession = () => {
    setTimerMode('focus');
    setTotalDurationSec(10);
    setRemainingSec(10);
    timerTargetEndRef.current = Date.now() + 10 * 1000;
    setTimerStatus('running');
    pushToast('⚡ 10s Demo Focus Started', 'Watch your tree grow through all 5 botanical stages in 10 seconds!', 'info');
  };

  // Compute current botanical growth stage (1..5) based on progress
  const currentGrowthStage = useMemo(() => {
    if (timerStatus === 'idle') return 5; // Show full preview when idle
    const progress = 1 - remainingSec / Math.max(1, totalDurationSec);
    if (progress < 0.2) return 1;
    if (progress < 0.45) return 2;
    if (progress < 0.7) return 3;
    if (progress < 0.95) return 4;
    return 5;
  }, [timerStatus, remainingSec, totalDurationSec]);

  const timerProgressPct = useMemo(() => {
    if (totalDurationSec <= 0) return 0;
    return Math.min(100, Math.max(0, ((totalDurationSec - remainingSec) / totalDurationSec) * 100));
  }, [totalDurationSec, remainingSec]);

  const formatTimerMMSS = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Update browser document title when timer is running
  useEffect(() => {
    if (timerStatus === 'running') {
      document.title = `(${formatTimerMMSS(remainingSec)}) SylvaFocus — ${selectedSubject}`;
    } else {
      document.title = 'SylvaFocus — Windows 11 Forest Study Tracker';
    }
  }, [timerStatus, remainingSec, selectedSubject]);

  // --------------------------------------------------------------------------
  // KEYBOARD SHORTCUTS (Alt+1..6 Navigation, Space Timer, Ctrl+N Task)
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing inside an input or textarea
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const map = { '1': 'home', '2': 'focus', '3': 'forest', '4': 'tasks', '5': 'analytics', '6': 'settings' };
        if (map[e.key]) {
          e.preventDefault();
          setActiveTab(map[e.key]);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingTask(null);
        setIsTaskModalOpen(true);
        setActiveTab('tasks');
      } else if (!isTyping && e.code === 'Space' && activeTab === 'focus') {
        e.preventDefault();
        if (timerStatus === 'running') pauseTimer();
        else startOrResumeTimer();
      } else if (!isTyping && e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // --------------------------------------------------------------------------
  // TASK MANAGEMENT HANDLERS
  // --------------------------------------------------------------------------
  const handleSaveTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value.trim();
    if (!title) {
      pushToast('Validation Error', 'Please enter a task title.', 'warning');
      return;
    }

    const taskPayload = {
      id: editingTask ? editingTask.id : `task-${Date.now()}`,
      title,
      subject: form.subject.value,
      chapter: form.chapter.value.trim() || 'General Topic',
      priority: form.priority.value,
      estimatedMinutes: Math.max(5, Number(form.estimatedMinutes.value) || 25),
      deadline: form.deadline.value || toDateKey(new Date()),
      notes: form.notes.value.trim(),
      completed: editingTask ? editingTask.completed : false
    };

    if (editingTask) {
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? taskPayload : t)));
      pushToast('Task Updated', `"${taskPayload.title}" saved.`, 'success');
    } else {
      setTasks((prev) => [taskPayload, ...prev]);
      pushToast('Task Created', `"${taskPayload.title}" added to your study queue.`, 'success');
    }

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) pushToast('Task Completed!', `Great job finishing "${t.title}".`, 'success');
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    pushToast('Task Removed', 'Study task deleted.', 'info');
  };

  const startFocusFromTask = (task) => {
    setSelectedSubject(task.subject);
    setSelectedTaskId(task.id);
    const customSecs = Math.max(5, task.estimatedMinutes) * 60;
    setTimerMode('focus');
    setTimerStatus('idle');
    setTotalDurationSec(customSecs);
    setRemainingSec(customSecs);
    setActiveTab('focus');
    pushToast('Task Loaded in Focus Timer', `Ready to study "${task.title}" (${task.estimatedMinutes}m).`, 'info');
  };

  const addCustomSubject = (e) => {
    e.preventDefault();
    const trimmed = newSubjectName.trim();
    if (!trimmed) return;
    if (subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      pushToast('Duplicate Subject', 'That subject already exists.', 'warning');
      return;
    }
    setSubjects((prev) => [...prev, { id: `sub-${Date.now()}`, name: trimmed, color: newSubjectColor }]);
    setNewSubjectName('');
    pushToast('Subject Added', `${trimmed} is now available for tasks and sessions.`, 'success');
  };

  const clearSampleDataOnly = () => {
    setSessions((prev) => prev.filter((s) => !s.isSample));
    setTasks((prev) => prev.filter((t) => !t.isSample));
    pushToast('Sample Data Removed', 'All demo sessions and sample tasks have been cleared.', 'info');
  };

  const handleFullReset = () => {
    setSessions([]);
    setTasks([]);
    setSubjects(DEFAULT_SUBJECTS);
    setConfirmResetOpen(false);
    pushToast('Workspace Reset', 'All study history and tasks have been reset to a clean slate.', 'info');
  };

  // --------------------------------------------------------------------------
  // ANALYTICS AGGREGATIONS
  // --------------------------------------------------------------------------
  const analyticsData = useMemo(() => {
    const completed = sessions.filter((s) => s.status === 'completed');

    // 1. Subject distribution
    const bySubjectMap = {};
    completed.forEach((s) => {
      bySubjectMap[s.subject] = (bySubjectMap[s.subject] || 0) + s.durationMinutes;
    });
    const subjectChartData = Object.entries(bySubjectMap)
      .map(([name, minutes]) => {
        const subObj = subjects.find((sub) => sub.name === name);
        return {
          name,
          minutes,
          color: subObj ? subObj.color : '#10b981'
        };
      })
      .sort((a, b) => b.minutes - a.minutes);

    // 2. Time series based on selected range ('day' = 7d, 'week' = 14d, 'month' = 30d)
    const daysCount = analyticsRange === 'day' ? 7 : analyticsRange === 'week' ? 14 : 30;
    const timelineData = [];
    let daysGoalMet = 0;

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const mins = completed
        .filter((s) => s.dateKey === key)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      if (mins >= settings.dailyGoalMinutes) daysGoalMet++;
      timelineData.push({ label, minutes: mins, goal: settings.dailyGoalMinutes });
    }

    const goalCompletionRate = Math.round((daysGoalMet / daysCount) * 100);

    // 3. Most productive hours of the day
    const hourBuckets = [
      { slot: '6am-9am', min: 6, max: 8, minutes: 0 },
      { slot: '9am-12pm', min: 9, max: 11, minutes: 0 },
      { slot: '12pm-3pm', min: 12, max: 14, minutes: 0 },
      { slot: '3pm-6pm', min: 15, max: 17, minutes: 0 },
      { slot: '6pm-9pm', min: 18, max: 20, minutes: 0 },
      { slot: '9pm-12am', min: 21, max: 23, minutes: 0 }
    ];
    completed.forEach((s) => {
      const hr = new Date(s.timestamp).getHours();
      const bucket = hourBuckets.find((b) => hr >= b.min && hr <= b.max);
      if (bucket) bucket.minutes += s.durationMinutes;
    });

    const bestHourBucket = [...hourBuckets].sort((a, b) => b.minutes - a.minutes)[0];

    // 4. 8-Week (56-day) Contribution Heatmap
    const heatmapCells = [];
    for (let i = 55; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toDateKey(d);
      const mins = completed
        .filter((s) => s.dateKey === key)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      heatmapCells.push({
        dateKey: key,
        formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }),
        minutes: mins
      });
    }

    return {
      subjectChartData,
      timelineData,
      goalCompletionRate,
      hourBuckets,
      bestHourSlot: bestHourBucket && bestHourBucket.minutes > 0 ? bestHourBucket.slot : '9am-12pm',
      heatmapCells
    };
  }, [sessions, subjects, analyticsRange, settings.dailyGoalMinutes]);

  // --------------------------------------------------------------------------
  // THEME & FLUENT MICA STYLING HELPERS
  // --------------------------------------------------------------------------
  const isLight = settings.theme === 'light';
  const isImmersiveForest = settings.theme === 'forest';
  const currentAccent = ACCENT_COLORS.find((a) => a.id === settings.accent) || ACCENT_COLORS[0];
  const currentSeasonObj = SEASONS.find((s) => s.id === settings.selectedSeason) || SEASONS[0];

  const surfaceClass = isLight
    ? 'bg-white/80 backdrop-blur-xl border border-stone-200/90 text-stone-800 shadow-sm'
    : isImmersiveForest
    ? 'bg-emerald-950/65 backdrop-blur-xl border border-emerald-800/40 text-emerald-50 shadow-xl'
    : 'bg-zinc-900/75 backdrop-blur-xl border border-white/10 text-zinc-100 shadow-xl';

  const cardHoverClass = settings.reducedMotion
    ? ''
    : 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg';

  const subTextClass = isLight ? 'text-stone-500' : 'text-emerald-200/70';

  // Filtered tasks for Task Manager
  const filteredTasks = useMemo(() => {
    const todayKey = toDateKey(new Date());
    return tasks.filter((t) => {
      if (taskSearch && !t.title.toLowerCase().includes(taskSearch.toLowerCase()) && !t.subject.toLowerCase().includes(taskSearch.toLowerCase())) {
        return false;
      }
      if (taskFilter === 'today') return t.deadline === todayKey;
      if (taskFilter === 'pending') return !t.completed;
      if (taskFilter === 'completed') return t.completed;
      if (taskFilter === 'overdue') return !t.completed && t.deadline && t.deadline < todayKey;
      return true;
    });
  }, [tasks, taskFilter, taskSearch]);

  // Filtered sessions for Forest Terrarium
  const forestSessions = useMemo(() => {
    if (forestFilterSubject === 'ALL') return sessions;
    return sessions.filter((s) => s.subject === forestFilterSubject);
  }, [sessions, forestFilterSubject]);

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div
      className={`min-h-screen w-full relative overflow-hidden select-none flex flex-col ${
        isLight ? 'bg-stone-100 text-stone-900' : 'bg-[#08120e] text-zinc-100'
      }`}
      style={{ fontFamily: '"Segoe UI Variable Display", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* ====================================================================
          AMBIENT ANIMATED FOREST BACKGROUND WITH SUNLIGHT & FLOATING PARTICLES
          ==================================================================== */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Layered atmospheric gradient */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${
            isLight
              ? 'bg-gradient-to-br from-emerald-50 via-stone-100 to-amber-50/60'
              : isImmersiveForest
              ? `bg-gradient-to-b ${currentSeasonObj.skyTint}`
              : 'bg-gradient-to-b from-zinc-950 via-emerald-950/30 to-zinc-950'
          }`}
        />

        {/* Sunbeams / Crepuscular Rays */}
        <div
          className="absolute -top-24 left-1/4 w-[550px] h-[650px] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{
            background: isLight
              ? 'radial-gradient(circle, rgba(251,191,36,0.35), transparent 70%)'
              : 'radial-gradient(circle, rgba(52,211,153,0.22), transparent 70%)'
          }}
        />

        {/* Subtle SVG Distant Forest Silhouette Horizon */}
        <svg
          className="absolute bottom-0 left-0 w-full h-56 opacity-25"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill={isLight ? '#065f46' : '#022c22'}
            d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,229.3C672,245,768,235,864,202.7C960,171,1056,117,1152,117.3C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Floating Firefly / Pollen Particles */}
        {!settings.reducedMotion && (
          <div className="absolute inset-0">
            {[...Array(14)].map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full animate-pulse"
                style={{
                  width: `${(i % 3) + 3}px`,
                  height: `${(i % 3) + 3}px`,
                  left: `${(i * 7.3) % 96}%`,
                  top: `${(i * 13.7) % 88}%`,
                  backgroundColor: currentSeasonObj.particleColor,
                  opacity: isLight ? 0.35 : 0.45,
                  boxShadow: `0 0 10px ${currentSeasonObj.particleColor}`,
                  animationDuration: `${3 + (i % 4)}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ====================================================================
          WINDOWS 11 DESKTOP WINDOW CONTAINER
          ==================================================================== */}
      <div
        className={`relative z-10 flex flex-col flex-1 transition-all duration-300 ${
          isMaximized ? 'w-full h-screen' : 'max-w-7xl w-[95%] my-4 mx-auto rounded-2xl border border-white/15 shadow-2xl overflow-hidden h-[94vh]'
        }`}
      >
        {/* ------------------------------------------------------------------
            WINDOWS 11 NATIVE FLUENT TITLE BAR
            ------------------------------------------------------------------ */}
        <header
          className={`h-11 px-4 flex items-center justify-between border-b select-none shrink-0 ${
            isLight
              ? 'bg-stone-200/80 backdrop-blur-md border-stone-300 text-stone-800'
              : 'bg-zinc-950/80 backdrop-blur-md border-white/10 text-zinc-200'
          }`}
        >
          {/* Left: App Icon + Title + Active Status Pill */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-sm">
              <Trees className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-wide">SylvaFocus</span>
            <span className="text-[11px] opacity-60 hidden sm:inline">Windows 11 Fluent Edition</span>

            {timerStatus === 'running' && (
              <button
                onClick={() => setActiveTab('focus')}
                className="ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {formatTimerMMSS(remainingSec)} • {selectedSubject}
              </button>
            )}
          </div>

          {/* Center: Quick Level & Streak Pill */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-semibold">{stats.streak}d Streak</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Award className="w-3.5 h-3.5" />
              <span className="font-semibold">Lv. {stats.level}</span>
              <span className="opacity-75 text-[11px]">({stats.totalXP} XP)</span>
            </div>
          </div>

          {/* Right: Quick Controls + Windows 11 Caption Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Ambient Sound Quick Toggle */}
            <button
              onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
              title={settings.soundEnabled ? 'Mute Forest Soundscape' : 'Play Forest Soundscape'}
              className={`p-1.5 rounded-md transition ${
                settings.soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'hover:bg-white/10 opacity-75'
              }`}
            >
              {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Theme Cycle Button (Light -> Dark -> Immersive Forest) */}
            <button
              onClick={() => {
                const order = ['forest', 'dark', 'light'];
                const next = order[(order.indexOf(settings.theme) + 1) % order.length];
                setSettings((s) => ({ ...s, theme: next }));
              }}
              title={`Current Mode: ${settings.theme.toUpperCase()} (Click to switch)`}
              className="p-1.5 rounded-md hover:bg-white/10 transition flex items-center gap-1 text-[11px]"
            >
              {settings.theme === 'light' ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : settings.theme === 'forest' ? (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span className="capitalize hidden sm:inline">{settings.theme}</span>
            </button>

            {/* Keyboard Shortcuts Cheat Sheet */}
            <button
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard Shortcuts (?)"
              className="p-1.5 rounded-md hover:bg-white/10 transition opacity-80"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            <div className="h-3.5 w-[1px] bg-current opacity-20 mx-1" />

            {/* Windows 11 Minimize / Maximize / Close aesthetics */}
            <button
              onClick={() => setActiveTab('focus')}
              title="Mini Focus View"
              className="p-1.5 rounded hover:bg-white/10 opacity-70"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMaximized((m) => !m)}
              title={isMaximized ? 'Restore Window Size' : 'Maximize Window'}
              className="p-1.5 rounded hover:bg-white/10 opacity-70"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* ------------------------------------------------------------------
            MAIN BODY: COMPACT SIDEBAR + CONTENT VIEWPORT
            ------------------------------------------------------------------ */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Compact Windows 11 Navigation Rail */}
          <aside
            className={`w-20 lg:w-56 shrink-0 flex flex-col justify-between p-2.5 border-r ${
              isLight
                ? 'bg-stone-100/90 backdrop-blur-xl border-stone-200/90'
                : 'bg-zinc-950/60 backdrop-blur-xl border-white/10'
            }`}
          >
            <nav className="space-y-1">
              {[
                { id: 'home', label: 'Home', icon: Home, shortcut: 'Alt+1' },
                { id: 'focus', label: 'Focus Timer', icon: Clock, shortcut: 'Alt+2', badge: timerStatus === 'running' ? 'LIVE' : null },
                { id: 'forest', label: 'My Forest', icon: Trees, shortcut: 'Alt+3', badge: stats.healthyTrees },
                { id: 'tasks', label: 'Study Tasks', icon: CheckSquare, shortcut: 'Alt+4', badge: tasks.filter((t) => !t.completed).length },
                { id: 'analytics', label: 'Analytics', icon: BarChart3, shortcut: 'Alt+5' },
                { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'Alt+6' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={`${item.label} (${item.shortcut})`}
                    className={`w-full flex items-center justify-center lg:justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                      isActive
                        ? isLight
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isLight
                        ? 'text-stone-600 hover:bg-stone-200/75'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    {/* Active Windows 11 Left Pill Indicator */}
                    {isActive && (
                      <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-emerald-400" />
                    )}
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge !== null && (
                      <span
                        className={`hidden lg:inline-block text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                          item.badge === 'LIVE'
                            ? 'bg-emerald-500 text-zinc-950 animate-pulse'
                            : isActive
                            ? 'bg-black/20 text-current'
                            : 'bg-white/10 text-zinc-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Sidebar Card: Level & XP Bar + Quick Focus CTA */}
            <div className="space-y-2.5">
              <div className={`hidden lg:block p-3 rounded-xl ${surfaceClass}`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Forest Guardian
                  </span>
                  <span className="font-bold text-emerald-400">Lv. {stats.level}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
                    style={{ width: `${stats.levelProgressPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] opacity-70">
                  <span>{stats.currentLevelXP} / {stats.nextLevelXP} XP</span>
                  <span>{stats.healthyTrees} 🌲</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('focus')}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="hidden lg:inline">Start Focus Session</span>
              </button>
            </div>
          </aside>

          {/* ----------------------------------------------------------------
              MAIN SCROLLABLE CONTENT AREA
              ---------------------------------------------------------------- */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* ==============================================================
                TAB 1: HOME DASHBOARD
                ============================================================== */}
            {activeTab === 'home' && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Hero Banner */}
                <div className={`p-6 rounded-2xl relative overflow-hidden ${surfaceClass}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <Trees className="w-3.5 h-3.5" />
                        <span>{currentSeasonObj.name} Sanctuary • Level {stats.level}</span>
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Grow your knowledge, one tree at a time.
                      </h1>
                      <p className={`text-sm ${subTextClass}`}>
                        You have studied <strong className="text-emerald-400">{stats.todayMinutes} minutes</strong> today ({stats.dailyGoalPct}% of your {settings.dailyGoalMinutes}m daily goal) and planted <strong className="text-emerald-400">{stats.todayTrees} trees</strong>.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('focus')}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Start Focus Session
                      </button>
                      <button
                        onClick={() => setActiveTab('forest')}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition flex items-center gap-2 ${
                          isLight
                            ? 'bg-stone-100 hover:bg-stone-200 border-stone-300'
                            : 'bg-white/5 hover:bg-white/10 border-white/15'
                        }`}
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                        Explore Forest
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Today's Study Time */}
                  <div className={`p-4 rounded-2xl ${surfaceClass} ${cardHoverClass}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${subTextClass}`}>Today&apos;s Study Time</span>
                      <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stats.todayMinutes}m</div>
                    <div className="mt-2 w-full h-1.5 rounded-full bg-black/25 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${stats.dailyGoalPct}%` }}
                      />
                    </div>
                    <div className={`text-[11px] mt-1.5 ${subTextClass}`}>
                      {stats.dailyGoalPct}% of {settings.dailyGoalMinutes}m daily goal
                    </div>
                  </div>

                  {/* Card 2: Current Study Streak */}
                  <div className={`p-4 rounded-2xl ${surfaceClass} ${cardHoverClass}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${subTextClass}`}>Study Streak</span>
                      <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
                        <Flame className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">{stats.streak} Days</div>
                    <div className={`text-[11px] mt-3 ${subTextClass}`}>
                      {stats.weeklyMinutes}m logged over last 7 days
                    </div>
                  </div>

                  {/* Card 3: Focus Sessions & Trees Today */}
                  <div className={`p-4 rounded-2xl ${surfaceClass} ${cardHoverClass}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${subTextClass}`}>Trees Planted Today</span>
                      <div className="p-2 rounded-lg bg-teal-500/15 text-teal-400">
                        <Trees className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {stats.todayTrees} <span className="text-sm font-normal opacity-70">({stats.healthyTrees} total)</span>
                    </div>
                    <div className={`text-[11px] mt-3 ${subTextClass}`}>
                      {stats.completedCount} completed focus sessions
                    </div>
                  </div>

                  {/* Card 4: Level & XP */}
                  <div className={`p-4 rounded-2xl ${surfaceClass} ${cardHoverClass}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${subTextClass}`}>Level & Experience</span>
                      <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      Level {stats.level} <span className="text-xs font-normal text-emerald-400">({stats.totalXP} XP)</span>
                    </div>
                    <div className="mt-2 w-full h-1.5 rounded-full bg-black/25 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${stats.levelProgressPct}%` }}
                      />
                    </div>
                    <div className={`text-[11px] mt-1.5 ${subTextClass}`}>
                      {stats.nextLevelXP - stats.currentLevelXP} XP until Level {stats.level + 1}
                    </div>
                  </div>
                </div>

                {/* Middle Row: Interactive Live Forest Preview + Weekly Study Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Visual Forest Snapshot (7 cols) */}
                  <div className={`lg:col-span-7 p-5 rounded-2xl flex flex-col justify-between ${surfaceClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-base font-semibold flex items-center gap-2">
                          <Trees className="w-4 h-4 text-emerald-400" />
                          Your Living Study Forest
                        </h2>
                        <p className={`text-xs ${subTextClass}`}>
                          Every completed focus session plants a tree. Click any tree to inspect its study log.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('forest')}
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Full View <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Mini Terrarium Grid */}
                    <div
                      className="relative rounded-xl p-4 min-h-[220px] flex flex-wrap items-end justify-center gap-2 overflow-hidden border"
                      style={{
                        backgroundColor: currentSeasonObj.ground,
                        borderColor: currentSeasonObj.border
                      }}
                    >
                      {sessions.slice(-10).map((sess) => (
                        <button
                          key={sess.id}
                          onClick={() => {
                            setSelectedTreeSession(sess);
                            setActiveTab('forest');
                          }}
                          title={`${sess.subject}: ${sess.taskTitle} (${sess.durationMinutes}m)`}
                          className="group relative flex flex-col items-center transition-transform hover:scale-110 focus:outline-none"
                        >
                          <BotanicalTreeSVG
                            speciesId={sess.treeType}
                            stage={5}
                            withered={sess.status === 'withered'}
                            size={68}
                          />
                          <span className="opacity-0 group-hover:opacity-100 transition text-[10px] px-2 py-0.5 rounded bg-black/80 text-white whitespace-nowrap -mt-2 z-10">
                            {sess.subject} • {sess.durationMinutes}m
                          </span>
                        </button>
                      ))}
                      {sessions.length === 0 && (
                        <div className="text-center py-10 text-xs text-emerald-200/70">
                          Your forest glade is ready. Complete your first focus session to plant an Emerald Oak!
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs opacity-75">
                      <span>🌱 { unlockedAchievements.length } / { ACHIEVEMENTS_LIST.length } Achievements Unlocked</span>
                      <span>Total Study Hours: {stats.totalHours} hrs</span>
                    </div>
                  </div>

                  {/* Weekly Study Statistics Chart (5 cols) */}
                  <div className={`lg:col-span-5 p-5 rounded-2xl flex flex-col justify-between ${surfaceClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-base font-semibold">Weekly Study Progress</h2>
                        <p className={`text-xs ${subTextClass}`}>Last 7 days (minutes studied vs daily goal)</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('analytics')}
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Analytics <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="day" tick={{ fontSize: 11, fill: isLight ? '#57534e' : '#a7f3d0' }} />
                          <YAxis tick={{ fontSize: 11, fill: isLight ? '#57534e' : '#a7f3d0' }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#091510',
                              borderColor: '#10b981',
                              borderRadius: '10px',
                              fontSize: '12px',
                              color: '#ecfdf5'
                            }}
                          />
                          <Bar dataKey="minutes" name="Minutes Studied" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs opacity-75">
                      <span>Weekly Total: {stats.weeklyMinutes} mins</span>
                      <span>Avg Session: {stats.avgSessionMinutes} mins</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Priority Study Tasks + Unlocked Badges */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Priority Pending Tasks (7 cols) */}
                  <div className={`lg:col-span-7 p-5 rounded-2xl ${surfaceClass}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold">Up Next in Your Study Queue</h2>
                        <p className={`text-xs ${subTextClass}`}>Click the play icon on any task to launch a linked focus timer</p>
                      </div>
                      <button
                        onClick={() => {
                          setEditingTask(null);
                          setIsTaskModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-600/30 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Task
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {tasks
                        .filter((t) => !t.completed)
                        .slice(0, 4)
                        .map((task) => {
                          const subColor = subjects.find((s) => s.name === task.subject)?.color || '#10b981';
                          return (
                            <div
                              key={task.id}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                                isLight ? 'bg-stone-50 border-stone-200' : 'bg-black/25 border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <button
                                  onClick={() => toggleTaskCompletion(task.id)}
                                  className="w-5 h-5 rounded-md border border-emerald-500/50 flex items-center justify-center hover:bg-emerald-500/20 shrink-0"
                                >
                                  {task.completed && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                                </button>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium truncate">{task.title}</div>
                                  <div className="flex items-center gap-2 text-[11px] opacity-75">
                                    <span
                                      className="px-2 py-0.5 rounded-full font-medium"
                                      style={{ backgroundColor: `${subColor}25`, color: subColor }}
                                    >
                                      {task.subject}
                                    </span>
                                    <span>• {task.estimatedMinutes}m</span>
                                    <span>• {task.priority}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => startFocusFromTask(task)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 shrink-0 transition"
                              >
                                <Play className="w-3 h-3 fill-white" /> Focus
                              </button>
                            </div>
                          );
                        })}

                      {tasks.filter((t) => !t.completed).length === 0 && (
                        <div className="text-center py-6 text-xs opacity-70">
                          All study tasks completed! Add a new task to keep growing your forest.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Milestones & Badges (5 cols) */}
                  <div className={`lg:col-span-5 p-5 rounded-2xl ${surfaceClass}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold">Forest Achievements</h2>
                        <p className={`text-xs ${subTextClass}`}>Milestones earned from consistent focus</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        {unlockedAchievements.length} / {ACHIEVEMENTS_LIST.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {ACHIEVEMENTS_LIST.slice(0, 6).map((ach) => {
                        const unlocked = ach.check(stats);
                        return (
                          <div
                            key={ach.id}
                            className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${
                              unlocked
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-black/15 border-white/5 opacity-45'
                            }`}
                          >
                            <span className="text-xl">{ach.icon}</span>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate">{ach.title}</div>
                              <div className="text-[10px] opacity-75 line-clamp-2">{ach.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 2: FOREST FOCUS TIMER (POMODORO + BOTANICAL GROWTH)
                ============================================================== */}
            {activeTab === 'focus' && (
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Circular Progress + Live Botanical Tree + Timer Controls (7 cols) */}
                <div className={`lg:col-span-7 p-6 rounded-2xl flex flex-col items-center text-center ${surfaceClass}`}>
                  {/* Mode Selector Pills */}
                  <div className="inline-flex p-1 rounded-xl bg-black/25 border border-white/10 mb-6">
                    {[
                      { id: 'focus', label: `Focus (${settings.focusMinutes}m)` },
                      { id: 'shortBreak', label: `Short Break (${settings.shortBreakMinutes}m)` },
                      { id: 'longBreak', label: `Long Break (${settings.longBreakMinutes}m)` }
                    ].map((m) => (
                      <button
                        key={m.id}
                        disabled={timerStatus !== 'idle'}
                        onClick={() => switchTimerMode(m.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                          timerMode === m.id
                            ? 'bg-emerald-600 text-white shadow'
                            : 'opacity-70 hover:opacity-100 disabled:opacity-40'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Circular Progress Ring + Growing Tree SVG */}
                  <div className="relative w-72 h-72 flex items-center justify-center my-2">
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 260 260">
                      <circle
                        cx="130"
                        cy="130"
                        r="116"
                        fill="none"
                        stroke={isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}
                        strokeWidth="10"
                      />
                      <circle
                        cx="130"
                        cy="130"
                        r="116"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 116}
                        strokeDashoffset={2 * Math.PI * 116 * (1 - timerProgressPct / 100)}
                        className="transition-all duration-300"
                      />
                    </svg>

                    <div className="relative z-10 flex flex-col items-center">
                      <BotanicalTreeSVG
                        speciesId={selectedSpecies}
                        stage={currentGrowthStage}
                        withered={false}
                        size={125}
                      />
                      <div className="text-4xl font-bold tracking-tight font-mono mt-1">
                        {formatTimerMMSS(remainingSec)}
                      </div>
                      <div className="text-xs font-medium text-emerald-400 mt-1">
                        {timerStatus === 'idle'
                          ? 'Ready to Plant'
                          : timerStatus === 'paused'
                          ? 'Session Paused'
                          : `Stage ${currentGrowthStage}/5 • Growing ${
                              TREE_SPECIES.find((s) => s.id === selectedSpecies)?.name
                            }`}
                      </div>
                    </div>
                  </div>

                  {/* Active Subject & Task Banner */}
                  <div className="mt-3 mb-5 px-4 py-2 rounded-xl bg-black/20 border border-white/10 text-xs flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-semibold">{selectedSubject}</span>
                    <span className="opacity-50">•</span>
                    <span className="opacity-80">
                      {tasks.find((t) => t.id === selectedTaskId)?.title || 'General Deep Focus Session'}
                    </span>
                  </div>

                  {/* Primary Action Controls */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {timerStatus !== 'running' ? (
                      <button
                        onClick={startOrResumeTimer}
                        className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {timerStatus === 'paused' ? 'Resume Focus' : 'Plant Tree & Start'}
                      </button>
                    ) : (
                      <button
                        onClick={pauseTimer}
                        className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-sm flex items-center gap-2 transition"
                      >
                        <Pause className="w-4 h-4" />
                        Pause
                      </button>
                    )}

                    {timerStatus !== 'idle' && (
                      <button
                        onClick={abandonOrEndSession}
                        className="px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-medium text-sm flex items-center gap-2 transition"
                      >
                        <Square className="w-4 h-4" />
                        Give Up
                      </button>
                    )}

                    {timerStatus === 'idle' && (
                      <button
                        onClick={startQuickDemoSession}
                        title="Run a 10-second accelerated session to preview all 5 tree growth stages and XP rewards"
                        className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        10s Demo Grow
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Session Configuration, Species Selector & Ambient Soundscape (5 cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Species Picker */}
                  <div className={`p-5 rounded-2xl ${surfaceClass}`}>
                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                      <Trees className="w-4 h-4 text-emerald-400" />
                      Select Tree Species to Plant
                    </h3>
                    <p className={`text-xs mb-3 ${subTextClass}`}>
                      Higher-tier species unlock as you level up and grant bonus XP.
                    </p>

                    <div className="grid grid-cols-2 gap-2.5">
                      {TREE_SPECIES.map((sp) => {
                        const unlocked = stats.level >= sp.minLevel;
                        const isSelected = selectedSpecies === sp.id;
                        return (
                          <button
                            key={sp.id}
                            disabled={!unlocked || timerStatus !== 'idle'}
                            onClick={() => setSelectedSpecies(sp.id)}
                            className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                              isSelected
                                ? 'bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400'
                                : unlocked
                                ? 'bg-black/20 border-white/10 hover:bg-white/5'
                                : 'bg-black/10 border-white/5 opacity-45 cursor-not-allowed'
                            }`}
                          >
                            <div className="shrink-0">
                              <BotanicalTreeSVG speciesId={sp.id} stage={5} size={42} animated={false} />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate flex items-center gap-1">
                                {sp.name}
                                {!unlocked && <Lock className="w-3 h-3 text-amber-400 inline" />}
                              </div>
                              <div className="text-[10px] text-emerald-400">
                                {unlocked ? `${sp.xpBonus}x XP • ${sp.rarity}` : `Unlocks Lv. ${sp.minLevel}`}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject, Linked Task & Strict Mode */}
                  <div className={`p-5 rounded-2xl space-y-3.5 ${surfaceClass}`}>
                    <h3 className="text-sm font-semibold">Study Context & Focus Rules</h3>

                    <div>
                      <label className={`block text-xs mb-1 ${subTextClass}`}>Subject</label>
                      <select
                        disabled={timerStatus !== 'idle'}
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      >
                        {subjects.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs mb-1 ${subTextClass}`}>Link to Active Task (Optional)</label>
                      <select
                        disabled={timerStatus !== 'idle'}
                        value={selectedTaskId}
                        onChange={(e) => {
                          setSelectedTaskId(e.target.value);
                          const found = tasks.find((t) => t.id === e.target.value);
                          if (found) setSelectedSubject(found.subject);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      >
                        <option value="">— Free Study / Unlinked —</option>
                        {tasks
                          .filter((t) => !t.completed)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              [{t.subject}] {t.title} ({t.estimatedMinutes}m)
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <div className="text-xs font-semibold flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400" />
                          Strict Focus Mode
                        </div>
                        <div className={`text-[11px] ${subTextClass}`}>
                          Disables pausing once a focus tree begins growing
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, strictFocusMode: !s.strictFocusMode }))}
                        className={`w-11 h-6 rounded-full transition p-0.5 ${
                          settings.strictFocusMode ? 'bg-emerald-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            settings.strictFocusMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Web Audio Ambient Soundscape Mixer */}
                  <div className={`p-5 rounded-2xl space-y-3 ${surfaceClass}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        Forest Soundscape
                      </div>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          settings.soundEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-zinc-400'
                        }`}
                      >
                        {settings.soundEnabled ? 'Playing' : 'Muted'}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'wind_birds', label: 'Canopy & Birds', icon: Bird },
                        { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
                        { id: 'stream', label: 'Mountain Stream', icon: Wind }
                      ].map((p) => {
                        const Icon = p.icon;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setSettings((s) => ({ ...s, soundPreset: p.id, soundEnabled: true }))}
                            className={`p-2 rounded-xl border text-xs flex flex-col items-center gap-1 transition ${
                              settings.soundPreset === p.id && settings.soundEnabled
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-black/20 border-white/10 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[11px]">{p.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-[11px] opacity-70">Volume</span>
                      <input
                        type="range"
                        min="0.05"
                        max="0.9"
                        step="0.05"
                        value={settings.soundVolume}
                        onChange={(e) => setSettings((s) => ({ ...s, soundVolume: parseFloat(e.target.value) }))}
                        className="flex-1 accent-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 3: MY FOREST (2.5D INTERACTIVE TERRARIUM & ENCYCLOPEDIA)
                ============================================================== */}
            {activeTab === 'forest' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Controls Bar */}
                <div className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 ${surfaceClass}`}>
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Compass className="w-5 h-5 text-emerald-400" />
                      Personal Study Terrarium
                    </h2>
                    <p className={`text-xs ${subTextClass}`}>
                      {stats.healthyTrees} healthy trees • {stats.witheredTrees} withered saplings • {stats.totalHours} total study hours
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Season Switcher */}
                    <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl border border-white/10">
                      {SEASONS.map((season) => {
                        const unlocked = stats.level >= season.minLevel;
                        return (
                          <button
                            key={season.id}
                            disabled={!unlocked}
                            onClick={() => setSettings((s) => ({ ...s, selectedSeason: season.id }))}
                            title={unlocked ? season.name : `Unlocks at Level ${season.minLevel}`}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                              settings.selectedSeason === season.id
                                ? 'bg-emerald-600 text-white'
                                : unlocked
                                ? 'opacity-75 hover:opacity-100'
                                : 'opacity-35 cursor-not-allowed'
                            }`}
                          >
                            {season.name.split(' ')[1]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Subject Filter */}
                    <select
                      value={forestFilterSubject}
                      onChange={(e) => setForestFilterSubject(e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs border ${
                        isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                      }`}
                    >
                      <option value="ALL">All Subjects ({sessions.length})</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>

                    {/* Zoom Controls */}
                    <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl border border-white/10">
                      <button
                        onClick={() => setForestZoom((z) => Math.max(0.75, +(z - 0.15).toFixed(2)))}
                        className="px-2 py-1 text-xs hover:bg-white/10 rounded"
                      >
                        -
                      </button>
                      <span className="text-[11px] px-1.5">{Math.round(forestZoom * 100)}%</span>
                      <button
                        onClick={() => setForestZoom((z) => Math.min(1.35, +(z + 0.15).toFixed(2)))}
                        className="px-2 py-1 text-xs hover:bg-white/10 rounded"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => setShowEncyclopedia((v) => !v)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                    >
                      {showEncyclopedia ? 'Hide Species Guide' : 'Botanical Guide'}
                    </button>
                  </div>
                </div>

                {/* Optional Collapsible Botanical Encyclopedia */}
                {showEncyclopedia && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TREE_SPECIES.map((sp) => {
                      const unlocked = stats.level >= sp.minLevel;
                      const countPlanted = sessions.filter((s) => s.treeType === sp.id && s.status === 'completed').length;
                      return (
                        <div key={sp.id} className={`p-4 rounded-2xl flex items-center gap-4 ${surfaceClass}`}>
                          <BotanicalTreeSVG speciesId={sp.id} stage={5} size={72} animated={false} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{sp.name}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                {sp.rarity}
                              </span>
                            </div>
                            <p className={`text-xs mt-1 ${subTextClass}`}>{sp.description}</p>
                            <div className="text-[11px] mt-2 font-medium text-emerald-400">
                              {unlocked ? `Planted ${countPlanted} times • ${sp.xpBonus}x XP` : `Locked (Requires Level ${sp.minLevel})`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2.5D Isometric-Inspired Interactive Forest Terrarium Canvas */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div
                    className="lg:col-span-8 rounded-3xl p-6 md:p-8 relative overflow-hidden border-2 shadow-2xl min-h-[420px] flex flex-col justify-between"
                    style={{
                      backgroundColor: currentSeasonObj.ground,
                      borderColor: currentSeasonObj.border,
                      boxShadow: 'inset 0 -28px 60px rgba(0,0,0,0.45)'
                    }}
                  >
                    {/* Subtle isometric grid lines */}
                    <div
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        backgroundImage:
                          'linear-gradient(30deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(150deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
                        backgroundSize: '44px 44px'
                      }}
                    />

                    {/* Trees Grid */}
                    <div
                      className="relative z-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 items-end justify-items-center my-auto transition-transform duration-300"
                      style={{ transform: `scale(${forestZoom})` }}
                    >
                      {forestSessions.map((sess) => {
                        const isSelected = selectedTreeSession?.id === sess.id;
                        return (
                          <button
                            key={sess.id}
                            onClick={() => setSelectedTreeSession(sess)}
                            className={`group relative flex flex-col items-center p-2 rounded-2xl transition-all ${
                              isSelected
                                ? 'bg-white/15 ring-2 ring-emerald-400 scale-105'
                                : 'hover:bg-white/10 hover:scale-105'
                            }`}
                          >
                            <BotanicalTreeSVG
                              speciesId={sess.treeType}
                              stage={5}
                              withered={sess.status === 'withered'}
                              size={86}
                            />
                            <span className="text-[10px] font-medium text-emerald-100/90 bg-black/50 px-2 py-0.5 rounded-full -mt-1">
                              {sess.durationMinutes}m
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {forestSessions.length === 0 && (
                      <div className="relative z-10 text-center my-auto py-12 text-emerald-100/75 text-sm">
                        No trees match this filter yet. Start a focus session to grow your canopy!
                      </div>
                    )}

                    {/* Terrarium Ground Base Edge */}
                    <div className="relative z-10 mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-emerald-100/75">
                      <span>Season: {currentSeasonObj.name}</span>
                      <span>Click any tree to inspect session metadata</span>
                    </div>
                  </div>

                  {/* Right Inspector Panel (4 cols) */}
                  <div className={`lg:col-span-4 p-5 rounded-2xl flex flex-col justify-between ${surfaceClass}`}>
                    {selectedTreeSession ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                            Tree Inspector
                          </span>
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                              selectedTreeSession.status === 'withered'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {selectedTreeSession.status === 'withered' ? 'Withered Sapling' : 'Healthy Tree'}
                          </span>
                        </div>

                        <div className="flex flex-col items-center py-4 rounded-2xl bg-black/20 border border-white/10">
                          <BotanicalTreeSVG
                            speciesId={selectedTreeSession.treeType}
                            stage={5}
                            withered={selectedTreeSession.status === 'withered'}
                            size={110}
                          />
                          <h3 className="text-base font-bold mt-2">
                            {TREE_SPECIES.find((s) => s.id === selectedTreeSession.treeType)?.name || 'Forest Tree'}
                          </h3>
                          <p className={`text-xs ${subTextClass}`}>{selectedTreeSession.dateKey}</p>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-white/10">
                            <span className={subTextClass}>Subject</span>
                            <span className="font-semibold">{selectedTreeSession.subject}</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-white/10">
                            <span className={subTextClass}>Task</span>
                            <span className="font-semibold text-right max-w-[180px] truncate">
                              {selectedTreeSession.taskTitle}
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-white/10">
                            <span className={subTextClass}>Focus Duration</span>
                            <span className="font-semibold">{selectedTreeSession.durationMinutes} minutes</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className={subTextClass}>Experience Awarded</span>
                            <span className="font-semibold text-emerald-400">+{selectedTreeSession.xpEarned} XP</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="my-auto text-center py-12 space-y-2">
                        <Trees className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
                        <div className="text-sm font-semibold">Select a Tree in Your Forest</div>
                        <p className={`text-xs ${subTextClass}`}>
                          Click any tree on the terrarium canvas to view the exact study session, task, date, and XP that planted it.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveTab('focus')}
                      className="mt-6 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                    >
                      Plant Another Tree
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 4: SUBJECT & TASK MANAGEMENT
                ============================================================== */}
            {activeTab === 'tasks' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Header & Filter Bar */}
                <div className={`p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${surfaceClass}`}>
                  <div>
                    <h2 className="text-lg font-bold">Study Tasks & Curriculum</h2>
                    <p className={`text-xs ${subTextClass}`}>
                      Organize chapters, deadlines, and launch Pomodoro sessions directly from any task
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 opacity-50" />
                      <input
                        type="text"
                        placeholder="Search tasks or subjects..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className={`pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      />
                    </div>

                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setIsTaskModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Plus className="w-4 h-4" /> New Study Task
                    </button>
                  </div>
                </div>

                {/* Filter Tabs + Subject Manager */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Tasks List (8 cols) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All Tasks' },
                        { id: 'today', label: "Today's Tasks" },
                        { id: 'pending', label: 'Pending' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'overdue', label: 'Overdue' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setTaskFilter(f.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                            taskFilter === f.id
                              ? 'bg-emerald-600 text-white'
                              : isLight
                              ? 'bg-white border border-stone-200 text-stone-700'
                              : 'bg-white/5 border border-white/10 text-zinc-300'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {filteredTasks.map((task) => {
                        const subColor = subjects.find((s) => s.name === task.subject)?.color || '#10b981';
                        const todayKey = toDateKey(new Date());
                        const isOverdue = !task.completed && task.deadline && task.deadline < todayKey;

                        return (
                          <div
                            key={task.id}
                            className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${surfaceClass}`}
                          >
                            <div className="flex items-start gap-3.5 min-w-0">
                              <button
                                onClick={() => toggleTaskCompletion(task.id)}
                                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                                  task.completed
                                    ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
                                    : 'border-emerald-500/50 hover:bg-emerald-500/20'
                                }`}
                              >
                                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>

                              <div className="min-w-0 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className={`text-sm font-semibold ${
                                      task.completed ? 'line-through opacity-50' : ''
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                  <span
                                    className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                                    style={{ backgroundColor: `${subColor}25`, color: subColor }}
                                  >
                                    {task.subject}
                                  </span>
                                  <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                      task.priority === 'Critical'
                                        ? 'bg-rose-500/20 text-rose-300'
                                        : task.priority === 'High'
                                        ? 'bg-amber-500/20 text-amber-300'
                                        : 'bg-white/10 opacity-75'
                                    }`}
                                  >
                                    {task.priority}
                                  </span>
                                </div>

                                <div className={`text-xs ${subTextClass}`}>
                                  {task.chapter} • Est. {task.estimatedMinutes}m • Due {task.deadline}
                                  {isOverdue && (
                                    <span className="ml-2 text-rose-400 font-semibold">(Overdue)</span>
                                  )}
                                </div>

                                {task.notes && (
                                  <p className="text-xs opacity-75 pt-1">{task.notes}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {!task.completed && (
                                <button
                                  onClick={() => startFocusFromTask(task)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                                >
                                  <Play className="w-3 h-3 fill-white" /> Focus
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                                className="p-2 rounded-xl hover:bg-white/10 transition"
                                title="Edit Task"
                              >
                                <Edit3 className="w-4 h-4 opacity-75" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="p-2 rounded-xl hover:bg-rose-500/20 text-rose-400 transition"
                                title="Delete Task"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {filteredTasks.length === 0 && (
                        <div className={`p-10 rounded-2xl text-center space-y-2 ${surfaceClass}`}>
                          <CheckSquare className="w-8 h-8 text-emerald-400 mx-auto opacity-60" />
                          <div className="text-sm font-semibold">No matching study tasks</div>
                          <p className={`text-xs ${subTextClass}`}>
                            Create a new task or switch filters to view your curriculum.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Subject Tags Manager (4 cols) */}
                  <div className={`lg:col-span-4 p-5 rounded-2xl h-fit space-y-4 ${surfaceClass}`}>
                    <div>
                      <h3 className="text-sm font-semibold">Subjects & Color Tags</h3>
                      <p className={`text-xs ${subTextClass}`}>
                        Add custom subjects for your courses
                      </p>
                    </div>

                    <div className="space-y-2">
                      {subjects.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: sub.color }}
                            />
                            <span className="font-medium">{sub.name}</span>
                          </div>
                          <span className="opacity-60">
                            {sessions.filter((s) => s.subject === sub.name && s.status === 'completed').reduce((a, b) => a + b.durationMinutes, 0)}m
                          </span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={addCustomSubject} className="space-y-2.5 pt-2 border-t border-white/10">
                      <label className="block text-xs font-medium">Add New Subject</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={newSubjectColor}
                          onChange={(e) => setNewSubjectColor(e.target.value)}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                        <input
                          type="text"
                          placeholder="e.g. World History"
                          value={newSubjectName}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          className={`flex-1 px-3 py-1.5 rounded-xl text-xs border focus:outline-none ${
                            isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
                      >
                        + Add Subject
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 5: STUDY ANALYTICS & CONTRIBUTION HEATMAP
                ============================================================== */}
            {activeTab === 'analytics' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Analytics Header & Range Switcher */}
                <div className={`p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 ${surfaceClass}`}>
                  <div>
                    <h2 className="text-lg font-bold">Study Productivity Analytics</h2>
                    <p className={`text-xs ${subTextClass}`}>
                      Generated from your actual completed study sessions
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/25 p-1 rounded-xl border border-white/10">
                    {[
                      { id: 'day', label: '7 Days' },
                      { id: 'week', label: '14 Days' },
                      { id: 'month', label: '30 Days' }
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setAnalyticsRange(r.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          analyticsRange === r.id ? 'bg-emerald-600 text-white' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Stat Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-2xl ${surfaceClass}`}>
                    <div className={`text-xs ${subTextClass}`}>Total Focused Time</div>
                    <div className="text-2xl font-bold mt-1">{stats.totalMinutes} mins</div>
                    <div className="text-[11px] text-emerald-400 mt-1">{stats.totalHours} hours total</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${surfaceClass}`}>
                    <div className={`text-xs ${subTextClass}`}>Average Session</div>
                    <div className="text-2xl font-bold mt-1">{stats.avgSessionMinutes} mins</div>
                    <div className="text-[11px] text-emerald-400 mt-1">{stats.completedCount} sessions completed</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${surfaceClass}`}>
                    <div className={`text-xs ${subTextClass}`}>Goal Completion Rate</div>
                    <div className="text-2xl font-bold mt-1">{analyticsData.goalCompletionRate}%</div>
                    <div className="text-[11px] text-emerald-400 mt-1">Target: {settings.dailyGoalMinutes}m / day</div>
                  </div>
                  <div className={`p-4 rounded-2xl ${surfaceClass}`}>
                    <div className={`text-xs ${subTextClass}`}>Peak Focus Window</div>
                    <div className="text-2xl font-bold mt-1">{analyticsData.bestHourSlot}</div>
                    <div className="text-[11px] text-emerald-400 mt-1">Most productive hours</div>
                  </div>
                </div>

                {/* Charts Row: Timeline Area Chart + Subject Breakdown Pie/Bar */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className={`lg:col-span-7 p-5 rounded-2xl ${surfaceClass}`}>
                    <h3 className="text-sm font-semibold mb-1">Daily Study Minutes Trend</h3>
                    <p className={`text-xs mb-4 ${subTextClass}`}>Focus duration across selected time horizon</p>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="label" tick={{ fontSize: 10, fill: isLight ? '#57534e' : '#a7f3d0' }} />
                          <YAxis tick={{ fontSize: 10, fill: isLight ? '#57534e' : '#a7f3d0' }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#091510',
                              borderColor: '#10b981',
                              borderRadius: '10px',
                              fontSize: '12px'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="minutes"
                            name="Study Minutes"
                            stroke="#10b981"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#emeraldArea)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className={`lg:col-span-5 p-5 rounded-2xl ${surfaceClass}`}>
                    <h3 className="text-sm font-semibold mb-1">Study Time by Subject</h3>
                    <p className={`text-xs mb-4 ${subTextClass}`}>Distribution across academic disciplines</p>
                    <div className="h-64 w-full">
                      {analyticsData.subjectChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analyticsData.subjectChartData}
                              dataKey="minutes"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              innerRadius={48}
                              outerRadius={80}
                              paddingAngle={4}
                            >
                              {analyticsData.subjectChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#091510',
                                borderColor: '#10b981',
                                borderRadius: '10px',
                                fontSize: '12px'
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs opacity-60">
                          Complete a session to see subject distribution
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Row: 8-Week Consistency Contribution Heatmap + Productive Hours */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className={`lg:col-span-7 p-5 rounded-2xl ${surfaceClass}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold">Study Consistency Heatmap (Last 8 Weeks)</h3>
                        <p className={`text-xs ${subTextClass}`}>Hover any square to inspect daily minutes studied</p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] opacity-75">
                        <span>Less</span>
                        <span className="w-3 h-3 rounded-sm bg-white/10 inline-block" />
                        <span className="w-3 h-3 rounded-sm bg-emerald-800 inline-block" />
                        <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block" />
                        <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
                        <span>More</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-14 sm:grid-cols-14 gap-1.5 pt-2" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                      {analyticsData.heatmapCells.map((cell) => {
                        const intensity =
                          cell.minutes === 0
                            ? 'bg-white/10'
                            : cell.minutes < 30
                            ? 'bg-emerald-800/80'
                            : cell.minutes < 60
                            ? 'bg-emerald-600'
                            : 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
                        return (
                          <div
                            key={cell.dateKey}
                            title={`${cell.formatted}: ${cell.minutes} mins studied`}
                            className={`aspect-square rounded-md ${intensity} transition hover:scale-125`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className={`lg:col-span-5 p-5 rounded-2xl ${surfaceClass}`}>
                    <h3 className="text-sm font-semibold mb-1">Most Productive Time of Day</h3>
                    <p className={`text-xs mb-3 ${subTextClass}`}>Minutes accumulated by hour block</p>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.hourBuckets} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <XAxis dataKey="slot" tick={{ fontSize: 10, fill: isLight ? '#57534e' : '#a7f3d0' }} />
                          <YAxis tick={{ fontSize: 10, fill: isLight ? '#57534e' : '#a7f3d0' }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#091510',
                              borderColor: '#10b981',
                              borderRadius: '10px',
                              fontSize: '12px'
                            }}
                          />
                          <Bar dataKey="minutes" fill="#34d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==============================================================
                TAB 6: WINDOWS 11 SETTINGS, DATA EXPORT & PACKAGING CONFIG
                ============================================================== */}
            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className={`p-5 rounded-2xl ${surfaceClass}`}>
                  <h2 className="text-lg font-bold">Windows 11 Preferences & App Configuration</h2>
                  <p className={`text-xs ${subTextClass}`}>
                    Customize timer intervals, Fluent appearance, accessibility, local persistence, and Windows desktop packaging
                  </p>
                </div>

                {/* Timer Durations & Daily Goal */}
                <div className={`p-5 rounded-2xl space-y-4 ${surfaceClass}`}>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Pomodoro Durations & Daily Study Goal
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className={`block text-xs mb-1 ${subTextClass}`}>Focus Session (mins)</label>
                      <input
                        type="number"
                        min="1"
                        max="180"
                        value={settings.focusMinutes}
                        onChange={(e) => setSettings((s) => ({ ...s, focusMinutes: Math.max(1, Number(e.target.value) || 25) }))}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${subTextClass}`}>Short Break (mins)</label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={settings.shortBreakMinutes}
                        onChange={(e) => setSettings((s) => ({ ...s, shortBreakMinutes: Math.max(1, Number(e.target.value) || 5) }))}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${subTextClass}`}>Long Break (mins)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={settings.longBreakMinutes}
                        onChange={(e) => setSettings((s) => ({ ...s, longBreakMinutes: Math.max(1, Number(e.target.value) || 15) }))}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs mb-1 ${subTextClass}`}>Daily Study Goal (mins)</label>
                      <input
                        type="number"
                        min="15"
                        max="720"
                        value={settings.dailyGoalMinutes}
                        onChange={(e) => setSettings((s) => ({ ...s, dailyGoalMinutes: Math.max(15, Number(e.target.value) || 120) }))}
                        className={`w-full px-3 py-2 rounded-xl text-xs border ${
                          isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance, Accessibility & Notifications */}
                <div className={`p-5 rounded-2xl space-y-4 ${surfaceClass}`}>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    Fluent Theme & Accessibility
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'forest', label: 'Immersive Forest Mica', desc: 'Deep emerald translucent surfaces' },
                      { id: 'dark', label: 'Windows 11 Dark', desc: 'Charcoal mica with subtle contrast' },
                      { id: 'light', label: 'Warm Daylight', desc: 'Soft beige & sage daylight palette' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSettings((s) => ({ ...s, theme: t.id }))}
                        className={`p-3 rounded-xl border text-left transition ${
                          settings.theme === t.id
                            ? 'bg-emerald-500/20 border-emerald-400'
                            : 'bg-black/15 border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <div className="text-xs font-semibold">{t.label}</div>
                        <div className={`text-[11px] ${subTextClass}`}>{t.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <div className="text-xs font-semibold">Reduced Motion Accessibility</div>
                      <div className={`text-[11px] ${subTextClass}`}>
                        Minimizes floating particles and hover animations
                      </div>
                    </div>
                    <button
                      onClick={() => setSettings((s) => ({ ...s, reducedMotion: !s.reducedMotion }))}
                      className={`w-11 h-6 rounded-full transition p-0.5 ${
                        settings.reducedMotion ? 'bg-emerald-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <div className="text-xs font-semibold">Windows Desktop Notifications</div>
                      <div className={`text-[11px] ${subTextClass}`}>
                        Show system toast notifications when focus sessions finish
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if ('Notification' in window && Notification.permission !== 'granted') {
                          Notification.requestPermission();
                        }
                        setSettings((s) => ({ ...s, notificationsEnabled: !s.notificationsEnabled }));
                      }}
                      className={`w-11 h-6 rounded-full transition p-0.5 ${
                        settings.notificationsEnabled ? 'bg-emerald-600' : 'bg-zinc-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Data Backup, Sample Data & Reset */}
                <div className={`p-5 rounded-2xl space-y-4 ${surfaceClass}`}>
                  <h3 className="text-sm font-semibold">Local Data Storage (IndexedDB + JSON Backup)</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify({ sessions, tasks, subjects, settings }, null, 2)], {
                          type: 'application/json'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `sylvafocus-backup-${toDateKey(new Date())}.json`;
                        a.click();
                        pushToast('Backup Exported', 'Your study history JSON file has been downloaded.', 'success');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Backup JSON
                    </button>

                    <button
                      onClick={clearSampleDataOnly}
                      className="px-4 py-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Remove Sample Data Only
                    </button>

                    <button
                      onClick={() => setConfirmResetOpen(true)}
                      className="px-4 py-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Reset All Data
                    </button>
                  </div>
                </div>

                {/* Windows Desktop Packaging Guide (Electron / Tauri Config) */}
                <div className={`p-5 rounded-2xl space-y-3 ${surfaceClass}`}>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Windows 10 / 11 Desktop Packaging (Electron & Tauri Ready)
                  </h3>
                  <p className={`text-xs ${subTextClass}`}>
                    SylvaFocus is architected with offline IndexedDB persistence, custom frameless window controls, and zero external runtime dependencies so you can package it into a native `.exe` / `.msi` installer:
                  </p>
                  <pre className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono overflow-x-auto text-emerald-300">
{`// Tauri v2 (tauri.conf.json snippet for Windows 11 Mica Window)
{
  "productName": "SylvaFocus",
  "identifier": "com.sylvafocus.studytracker",
  "app": {
    "windows": [{
      "title": "SylvaFocus — Forest Study Tracker",
      "width": 1280,
      "height": 820,
      "decorations": true,
      "transparent": true
    }]
  },
  "bundle": { "active": true, "targets": ["msi", "nsis"] }
}`}
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ====================================================================
          MODAL 1: CREATE / EDIT STUDY TASK
          ==================================================================== */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 space-y-4 ${surfaceClass}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingTask ? 'Edit Study Task' : 'Create New Study Task'}
              </h3>
              <button
                onClick={() => {
                  setIsTaskModalOpen(false);
                  setEditingTask(null);
                }}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 font-medium">Task Title *</label>
                <input
                  name="title"
                  defaultValue={editingTask?.title || ''}
                  placeholder="e.g. Complete Chapter 5 Practice Problems"
                  required
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-medium">Subject</label>
                  <select
                    name="subject"
                    defaultValue={editingTask?.subject || subjects[0]?.name}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                    }`}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Chapter / Topic</label>
                  <input
                    name="chapter"
                    defaultValue={editingTask?.chapter || ''}
                    placeholder="e.g. Unit 3: Kinematics"
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 font-medium">Priority</label>
                  <select
                    name="priority"
                    defaultValue={editingTask?.priority || 'Medium'}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                    }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Est. Duration (m)</label>
                  <input
                    type="number"
                    name="estimatedMinutes"
                    min="5"
                    max="240"
                    defaultValue={editingTask?.estimatedMinutes || 25}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    defaultValue={editingTask?.deadline || toDateKey(new Date())}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Study Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingTask?.notes || ''}
                  placeholder="Key formulas, page numbers, or objectives..."
                  className={`w-full px-3 py-2 rounded-xl border ${
                    isLight ? 'bg-white border-stone-300' : 'bg-zinc-900 border-white/15'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTaskModalOpen(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: KEYBOARD SHORTCUTS CHEAT-SHEET
          ==================================================================== */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 space-y-4 ${surfaceClass}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Windows Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcutsModal(false)} className="p-1 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {[
                ['Alt + 1 .. 6', 'Switch between Home, Focus, Forest, Tasks, Analytics, Settings'],
                ['Spacebar', 'Start / Pause active focus timer (in Focus view)'],
                ['Ctrl + N', 'Open New Study Task modal'],
                ['?', 'Toggle Keyboard Shortcuts Cheat-Sheet']
              ].map(([k, desc]) => (
                <div key={k} className="flex items-center justify-between py-2 border-b border-white/10">
                  <kbd className="px-2 py-1 rounded bg-black/40 border border-white/15 font-mono text-emerald-300">
                    {k}
                  </kbd>
                  <span className="text-right opacity-80 max-w-[220px]">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: CONFIRM FULL DATA RESET
          ==================================================================== */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 space-y-4 ${surfaceClass}`}>
            <h3 className="text-base font-bold text-rose-400">Reset All Study Data?</h3>
            <p className={`text-xs ${subTextClass}`}>
              This will permanently clear all planted trees, focus sessions, and tasks from local storage. Consider exporting a JSON backup first.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleFullReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: FIRST-RUN ONBOARDING WELCOME
          ==================================================================== */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-5 ${surfaceClass}`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg">
                <Trees className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Welcome to SylvaFocus for Windows 11</h2>
                <p className={`text-xs ${subTextClass}`}>Peaceful botanical focus meets desktop study analytics</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs leading-relaxed opacity-90">
              <p>
                • <strong>Grow a Living Forest:</strong> Every Pomodoro session plants a seed that grows through 5 botanical stages into a permanent tree in your 2.5D forest terrarium.
              </p>
              <p>
                • <strong>Sample Data Preloaded:</strong> We have populated realistic sample sessions and tasks so you can immediately explore the forest, heatmaps, and analytics. You can clear sample data with one click in <em>Settings</em>.
              </p>
              <p>
                • <strong>Built-In Forest Soundscapes:</strong> Toggle gentle synthesized forest breeze, birdsong, rain, or mountain streams right from the Windows title bar.
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  clearSampleDataOnly();
                  setShowOnboarding(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium"
              >
                Start with Empty Forest
              </button>
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg"
              >
                Explore with Sample Forest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          WINDOWS 11 FLUENT TOAST NOTIFICATIONS STACK
          ==================================================================== */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto p-3.5 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-emerald-500/40 text-zinc-100 shadow-2xl flex items-start gap-3 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold">{t.title}</div>
              <div className="text-[11px] opacity-80 mt-0.5">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}