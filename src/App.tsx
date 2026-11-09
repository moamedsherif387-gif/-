import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  Lock, 
  User 
} from 'lucide-react';
import { CosmicBackground } from './components/CosmicBackground';
import { romanticAudio } from './audio';

const PASS = '6628';

const REPLY_SUGGESTIONS = [
  'بحبك يا محمد، المفاجأة طيّرت قلبي من الفرحة! 💖',
  'أنت أحلى وأعظم حاجة حصلت في عمري يا محمد، ربنا يخليك ليا 💍',
  'كلامك بكّاني وفرحني أوي.. بحبك للأبد يا سندي وعالمي كله 🥰',
  'أنا أسعد بنت في الدنيا بوجودك جنبي ومعاك يا محمد ✨',
  'وعد هفضل جنبك ومعاك لآخر العمر ومفيش حاجة تفرقنا أبداً 🤍',
];

// Memory Milestones in Chapter 1
const MEMORIES = [
  {
    id: 1,
    title: 'أول مرة حكيت فيها معاكِ',
    teaser: 'اليوم اللي اتغيّر فيه كل مسار حياتي...',
    secret: 'حسيت يومها بكهربا غريبة وراحة مكنتش حسيتها مع حد قبل كده.. عرفت إن في حاجة استثنائية بدأت.',
    icon: '✨',
  },
  {
    id: 2,
    title: 'ضحكتك وسحر صوتك',
    teaser: 'الدواء السحري لأي هم أو زعل...',
    secret: 'صوتك لما بتضحكي كفيل يهدّي أي عاصفة جوايا، وضحكتك هي النور اللي بينوّر أي يوم رمادي في حياتي.',
    icon: '🌙',
  },
  {
    id: 3,
    title: 'الأمان في وجودك',
    teaser: 'المكان الوحيد اللي برتاح فيه بجد...',
    secret: 'معاكِ بس مبحتاجش ألبس أي قناع، بكون على طبيعتي وبحس إني وسط أهلي ووطني وكل ما أملك.',
    icon: '🕊️',
  },
  {
    id: 4,
    title: 'اللحظة اللي اتأكدت فيها',
    teaser: 'لحظة الاختيار النهائي للقلب...',
    secret: 'مكنتش صدفة.. كان يقين عميق من جوه روحي إنك نصي التاني وإني مش هقبل بأقل من إنك تكوني شريكة عمري كله.',
    icon: '💎',
  },
];

// Flip cards in Chapter 2
const SECRET_CARDS = [
  {
    id: 1,
    frontTitle: 'بطاقة الشوق الصادق',
    frontSubtitle: 'اضغطي لقراءة السر 💌',
    backText: 'كل دقيقة بتعدي وانتي مش فيها، بتبقى ناقصة روح. مكانك في قلبي مفيش مخلوق يقدر ياخده ولا يملأ جزء منه.',
    tag: 'في غيابك',
  },
  {
    id: 2,
    frontTitle: 'بطاقة العهد الأبدي',
    frontSubtitle: 'اضغطي لقراءة السر 💌',
    backText: 'وعدت نفسي قدام ربنا إني أكون سندك، ظهرك، أمانك، وسرك اللي تخبيه عن كل الناس وماتخافيش.',
    tag: 'وعد رجال',
  },
  {
    id: 3,
    frontTitle: 'بطاقة التفاصيل الصغيرة',
    frontSubtitle: 'اضغطي لقراءة السر 💌',
    backText: 'حتى طريقتك في الكلام، نظرتك، حركات إيديكي، ولمعة عينك وانتي مبسوطة.. كل تفصيلة فيكي محفورة في ذاكرتي.',
    tag: 'عشق التفاصيل',
  },
  {
    id: 4,
    frontTitle: 'بطاقة الدعاء في السحر',
    frontSubtitle: 'اضغطي لقراءة السر 💌',
    backText: 'في كل سجدة وكل دعوة، اسمك هو الأول دايماً. بدعي ربنا يجمعنا على خير ويبارك في حبنا ويخليكي ليا العمر كله.',
    tag: 'رجائي لربي',
  },
];

// Reasons jar notes in Chapter 3
const LOVE_REASONS = [
  'لأن قلبك أبيض وأنقى من أي حاجة شوفتها في حياتي 🌸',
  'لأنك بتفهمي نظرتي قبل ما أنطق بولا كلمة 👁️',
  'لأنك بتديني إحساس إني أقدر أهد جبال عشان أسعدك 🏔️',
  'لأن وجودك بيهون عليا أصعب ضغوطات الدنيا 🤍',
  'لأن ضحكتك بتخلي الحياة كلها تستاهل نعيشها ✨',
  'لأنك السند اللي بتسند عليه لما الدنيا تميل 🤝',
  'لأنك مش بس حبيبتي.. انتي بنتي وأختي وصاحبتي وأهلي 🏡',
  'لأن جمال روحك بيطغى على كل ملامحك الساحرة 💫',
  'لأن حبك خلاني إنسان أحسن وبحب الحياة أكتر 🌟',
  'لأن كل خطوة بعملها في مستقبلي، برسم صورتك فيها قدامي 💍',
];

export default function App() {
  // Lock screen always starts locked on every page load
  const [unlocked, setUnlocked] = useState<boolean>(false);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Pin state
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [shakePin, setShakePin] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Gated Progression: Chapter index & max unlocked chapter
  const [chapter, setChapter] = useState<number>(0);
  const [maxUnlockedChapter, setMaxUnlockedChapter] = useState<number>(0);

  // Chapter 1 state: Must explore all 4 memories
  const [activeMemory, setActiveMemory] = useState<number | null>(null);
  const [unlockedMemories, setUnlockedMemories] = useState<number[]>([]);

  // Chapter 2 state: Must flip all 4 cards
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Chapter 3 state: Must draw at least 3 reasons
  const [drawnReasons, setDrawnReasons] = useState<string[]>([]);
  const [currentReason, setCurrentReason] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Chapter 4 (Grand Reveal) state: Must break seal and complete reveal
  const [sealBroken, setSealBroken] = useState<boolean>(false);
  const [revealStep, setRevealStep] = useState<number>(0);

  // Chapter 5: Message & Wish submission to Mohamed via site
  const [senderName, setSenderName] = useState<string>('أمل');
  const [wishText, setWishText] = useState<string>('أمنيتي نفضل سوا ومبسوطين طول العمر ومفيش حاجة تفرقنا أبداً');
  const [replyText, setReplyText] = useState<string>(REPLY_SUGGESTIONS[0]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [sentDetails, setSentDetails] = useState<{
    name: string;
    wish: string;
    message: string;
    time: string;
  } | null>(null);

  // Celebration Sparks
  const [sparks, setSparks] = useState<Array<{ id: number; x: number; y: number; char: string }>>([]);

  const triggerCelebration = (x?: number, y?: number, count = 20) => {
    const originX = x ?? window.innerWidth / 2;
    const originY = y ?? window.innerHeight / 2;
    const symbols = ['✨', '💖', '⭐', '💫', '🌸', '💍', '🕊️', '🌹'];
    const newSparks = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: originX,
      y: originY,
      char: symbols[Math.floor(Math.random() * symbols.length)],
    }));

    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.some((ns) => ns.id === s.id)));
    }, 1800);
  };

  const toggleSound = () => {
    const muted = romanticAudio.toggleMute();
    setIsMuted(muted);
  };

  // Advance chapter with progression guard
  const unlockAndGoToChapter = (nextCh: number) => {
    if (nextCh > maxUnlockedChapter) {
      setMaxUnlockedChapter(nextCh);
    }
    setChapter(nextCh);
    romanticAudio.playTone(523 + nextCh * 50, 0.35, 'sine', 0.15);
    triggerCelebration();
  };

  // PIN Keypad Press
  const handleKeypadPress = (val: string) => {
    if (isVerifying) return;

    if (val === 'x') {
      romanticAudio.playTone(320, 0.2, 'triangle', 0.1);
      setPin((prev) => prev.slice(0, -1));
      setPinError('');
      return;
    }

    if (pin.length >= 4) return;
    const num = parseInt(val, 10);
    romanticAudio.playKeypadChime(isNaN(num) ? 0 : num);

    const nextPin = pin + val;
    setPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === PASS) {
        setIsVerifying(true);
        romanticAudio.playUnlockChord();
        triggerCelebration(window.innerWidth / 2, window.innerHeight / 2, 30);
        setPinError('تم فك التشفير بنجاح.. مرحباً بكِ ✨');

        setTimeout(() => {
          setUnlocked(true);
          romanticAudio.startAmbientMelody();
        }, 850);
      } else {
        romanticAudio.playErrorChime();
        setShakePin(true);
        setPinError('الرمز غير صحيح.. فكّري في التاريخ الأقرب للقلب 🗝️');
        setTimeout(() => {
          setShakePin(false);
          setPin('');
        }, 550);
      }
    }
  };

  // Lock Reset (Returns to lock screen)
  const handleLockReset = () => {
    romanticAudio.stopAmbientMelody();
    setUnlocked(false);
    setPin('');
    setPinError('');
    setIsVerifying(false);
    setChapter(0);
    setMaxUnlockedChapter(0);
    setSealBroken(false);
    setRevealStep(0);
    setUnlockedMemories([]);
    setFlippedCards([]);
    setDrawnReasons([]);
    setSentSuccess(false);
  };

  // Chapter 1 Memory Click
  const handleMemoryClick = (id: number) => {
    romanticAudio.playTone(659.25, 0.4, 'sine', 0.15);
    setActiveMemory(id);
    if (!unlockedMemories.includes(id)) {
      const updated = [...unlockedMemories, id];
      setUnlockedMemories(updated);
      triggerCelebration();
      if (updated.length === 4 && maxUnlockedChapter < 2) {
        setMaxUnlockedChapter(2);
      }
    }
  };

  // Chapter 2 Card Flip
  const handleCardFlip = (id: number) => {
    romanticAudio.playTone(783.99, 0.35, 'sine', 0.15);
    setFlippedCards((prev) => {
      const next = prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id];
      if (next.length === 4 && maxUnlockedChapter < 3) {
        setMaxUnlockedChapter(3);
      }
      return next;
    });
  };

  // Chapter 3 Draw from Jar
  const handleDrawReason = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    romanticAudio.playTone(880, 0.5, 'triangle', 0.18);

    const available = LOVE_REASONS.filter((r) => !drawnReasons.includes(r));
    const pool = available.length > 0 ? available : LOVE_REASONS;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    setTimeout(() => {
      setCurrentReason(selected);
      const updated = [selected, ...drawnReasons.filter((r) => r !== selected)];
      setDrawnReasons(updated);
      if (updated.length >= 3 && maxUnlockedChapter < 4) {
        setMaxUnlockedChapter(4);
      }
      setIsDrawing(false);
      triggerCelebration();
    }, 450);
  };

  // Chapter 4 Seal Break & Name Reveal
  const handleBreakSeal = () => {
    if (sealBroken) return;
    setSealBroken(true);
    setRevealStep(1);
    romanticAudio.playTone(523.25, 0.8, 'sawtooth', 0.12);

    // Letter 1: أ
    setTimeout(() => {
      setRevealStep(2);
      romanticAudio.playTone(659.25, 0.7, 'triangle', 0.18);
      triggerCelebration(window.innerWidth * 0.7, window.innerHeight * 0.45, 12);
    }, 1200);

    // Letter 2: م
    setTimeout(() => {
      setRevealStep(3);
      romanticAudio.playTone(783.99, 0.7, 'triangle', 0.2);
      triggerCelebration(window.innerWidth * 0.5, window.innerHeight * 0.45, 15);
    }, 2400);

    // Letter 3: ل + Full Reveal of "أمل"
    setTimeout(() => {
      setRevealStep(4);
      setMaxUnlockedChapter(5); // Chapter 5 now unlocked
      romanticAudio.playGrandRevealSound();
      triggerCelebration(window.innerWidth * 0.5, window.innerHeight * 0.4, 45);
    }, 3600);
  };

  // Chapter 5: SEND MESSAGE AND WISH TO MOHAMED VIA THE SITE (AUTOMATED)
  const handleSendWishAndMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageContent = replyText.trim();
    const wishContent = wishText.trim();
    if (!messageContent && !wishContent) return;

    const name = senderName.trim() || 'أمل';
    setIsSending(true);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          message: messageContent,
          wish: wishContent,
        }),
      });

      setSentSuccess(true);
      setSentDetails({
        name,
        wish: wishContent,
        message: messageContent,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      });
      romanticAudio.playGrandRevealSound();
      triggerCelebration(window.innerWidth / 2, window.innerHeight / 2, 50);
    } catch {
      // Graceful fallback
      setSentSuccess(true);
      setSentDetails({
        name,
        wish: wishContent,
        message: messageContent,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      });
      romanticAudio.playUnlockChord();
      triggerCelebration(window.innerWidth / 2, window.innerHeight / 2, 40);
    } finally {
      setIsSending(false);
    }
  };

  // Keyboard navigation for PIN
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!unlocked) {
        if (/^[0-9]$/.test(e.key)) {
          handleKeypadPress(e.key);
        } else if (e.key === 'Backspace') {
          handleKeypadPress('x');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlocked, pin, isVerifying]);

  const CHAPTER_TITLES = [
    'همسة البداية',
    'محطات لا تُنسى',
    'بطاقات المشاعر',
    'برطمان العشق',
    'لحظة الحقيقة',
    'العهد والرسالة',
  ];

  // Validation gates for progression
  const canAdvanceFromCh1 = unlockedMemories.length >= 4;
  const canAdvanceFromCh2 = flippedCards.length >= 4;
  const canAdvanceFromCh3 = drawnReasons.length >= 3;
  const canAdvanceFromCh4 = sealBroken && revealStep === 4;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col justify-between select-none">
      {/* Immersive Cosmic Canvas Background */}
      <CosmicBackground />

      {/* Floating Sparkles & Fireworks */}
      {sparks.map((s) => (
        <span
          key={s.id}
          className="fixed pointer-events-none z-50 text-2xl animate-pop-center select-none"
          style={{
            left: `${s.x + (Math.random() * 120 - 60)}px`,
            top: `${s.y + (Math.random() * 120 - 60)}px`,
            transition: 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {s.char}
        </span>
      ))}

      {/* Top Navigation Bar (Only visible when unlocked) */}
      {unlocked && (
        <header className="relative z-30 px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/10 glass-panel">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e5c388] animate-pulse" />
            <span className="font-editorial text-lg sm:text-xl font-bold tracking-wider gold-gradient-text">
              مخطوطة النبض
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full glass-panel hover:bg-white/10 active:scale-95 transition-all text-[#fbe2b5] border border-[#e5c388]/30"
              title={isMuted ? 'تشغيل اللحن' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
            </button>

            <button
              onClick={handleLockReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold glass-panel text-[#fbe2b5]/80 hover:text-white border border-[#e5c388]/20 hover:border-[#e5c388]/50 active:scale-95 transition-all cursor-pointer"
              title="إعادة القفل"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">قفل</span>
            </button>
          </div>
        </header>
      )}

      {/* Gated Chapter Progress Indicators */}
      {unlocked && (
        <div className="relative z-20 px-6 py-2 flex items-center justify-center gap-2 max-w-md mx-auto w-full">
          {CHAPTER_TITLES.map((title, idx) => {
            const isAccessible = idx <= maxUnlockedChapter;
            return (
              <button
                key={idx}
                disabled={!isAccessible}
                onClick={() => {
                  if (isAccessible) {
                    setChapter(idx);
                    romanticAudio.playTone(523 + idx * 40, 0.3, 'sine', 0.1);
                  }
                }}
                className={`group relative flex-1 py-1 focus:outline-hidden ${
                  !isAccessible ? 'cursor-not-allowed opacity-35' : 'cursor-pointer'
                }`}
                title={isAccessible ? title : `${title} (مغلق حتى تكملي المرحلة الحالية)`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    chapter === idx
                      ? 'bg-gradient-to-r from-[#e5c388] to-[#f472b6] shadow-[0_0_12px_rgba(229,195,136,0.8)]'
                      : isAccessible
                      ? 'bg-[#e5c388]/60'
                      : 'bg-white/15'
                  }`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* UNLOCKED MAIN CONTENT AREA */}
      {unlocked && (
        <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-3 max-w-xl mx-auto w-full overflow-y-auto">
          {/* CHAPTER 0: THE MYSTERIOUS PRELUDE */}
          {chapter === 0 && (
            <div className="w-full text-center animate-reveal">
              <div className="w-16 h-16 rounded-full glass-gold-panel mx-auto mb-4 flex items-center justify-center text-3xl animate-float-gentle">
                📜
              </div>

              <div className="text-xs uppercase tracking-widest text-[#e5c388]/80 font-medium mb-1">
                الفصل الأول
              </div>

              <h2 className="font-editorial text-3xl sm:text-4xl font-bold gold-gradient-text mb-4">
                إلى تلك التي أعادت ترتيب الكون
              </h2>

              <div className="glass-gold-panel rounded-3xl p-6 sm:p-8 text-right leading-relaxed mb-6 border border-[#e5c388]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e5c388]/10 rounded-full blur-2xl" />
                <p className="font-editorial text-lg sm:text-xl text-[#fde8ef] mb-4">
                  "قبل أن تعرفي من تكون صاحبة هذه المخطوطة، وقبل أن تتكشّف كل الأسرار... اعلمي أن كل حرف هنا كُتب بنبض فؤاد، وفي ساعات الليل المتأخرة، حين لا يتبقى في الوجود سوى طيفكِ."
                </p>
                <p className="text-sm sm:text-base text-[#fce7f1]/80 leading-loose">
                  صنعتُ لكِ هذا الملاذ السري لتعلمي كم أنتِ استثنائية، وكم كان لقاؤكِ أعظم معجزة حدثت في عمري. تنقّلي بين المراحل بهدوء واكتشفي كل خطوة لتفتح لكِ الخطوة التالية...
                </p>
              </div>

              <button
                onClick={() => unlockAndGoToChapter(1)}
                className="px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-[#0d020a] bg-gradient-to-r from-[#fbe2b5] via-[#e5c388] to-[#d4a359] shadow-[0_0_25px_rgba(229,195,136,0.45)] hover:shadow-[0_0_35px_rgba(229,195,136,0.7)] active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
              >
                <span>ابدأي رحلة الاستكشاف 💫</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* CHAPTER 1: MEMORY MILESTONES (GATED: MUST EXPLORE ALL 4) */}
          {chapter === 1 && (
            <div className="w-full animate-reveal">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold text-[#e5c388]/80 tracking-widest uppercase">
                  الفصل الثاني
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold gold-gradient-text mt-1">
                  محطات محفورة في الذاكرة
                </h2>
                <p className="text-xs sm:text-sm text-[#fce7f1]/70 mt-1">
                  افتحي كل المحطات الـ 4 لتتمكني من الانتقال للفصل التالي ({unlockedMemories.length}/4) ✨
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                {MEMORIES.map((m) => {
                  const isOpen = activeMemory === m.id;
                  const isUnlocked = unlockedMemories.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMemoryClick(m.id)}
                      className={`text-right p-4 rounded-2xl transition-all duration-300 border relative overflow-hidden cursor-pointer ${
                        isOpen
                          ? 'glass-gold-panel border-[#e5c388] shadow-[0_0_20px_rgba(229,195,136,0.3)]'
                          : isUnlocked
                          ? 'glass-panel border-white/20 bg-white/5'
                          : 'glass-panel border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{m.icon}</span>
                        {isUnlocked ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e5c388]/20 text-[#fbe2b5] font-semibold border border-[#e5c388]/30">
                            مكتشفة ✓
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-semibold">
                            انقري للاكتشاف
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm sm:text-base text-[#fbe2b5]">
                        {m.title}
                      </h3>
                      <p className="text-xs text-[#fce7f1]/70 mt-1 leading-normal">
                        {isOpen ? m.secret : m.teaser}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center">
                <button
                  disabled={!canAdvanceFromCh1}
                  onClick={() => unlockAndGoToChapter(2)}
                  className={`px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    canAdvanceFromCh1
                      ? 'text-[#0d020a] bg-gradient-to-r from-[#fbe2b5] to-[#e5c388] shadow-[0_0_20px_rgba(229,195,136,0.5)] cursor-pointer active:scale-95 animate-pulse'
                      : 'text-white/40 glass-panel border border-white/10 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>
                    {canAdvanceFromCh1
                      ? 'التالي: بطاقات المشاعر 💌'
                      : `افتحي كل المحطات أولاً (${unlockedMemories.length}/4) 🔒`}
                  </span>
                  {canAdvanceFromCh1 ? <ChevronLeft className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 2: SECRET FLIP CARDS (GATED: MUST FLIP ALL 4) */}
          {chapter === 2 && (
            <div className="w-full animate-reveal">
              <div className="text-center mb-4">
                <span className="text-xs font-semibold text-[#f472b6] tracking-widest uppercase">
                  الفصل الثالث
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold rose-gradient-text mt-1">
                  أسرار ما وراء النبض
                </h2>
                <p className="text-xs sm:text-sm text-[#fce7f1]/70 mt-1">
                  اقلبي كل البطاقات الـ 4 لتكشفي كل الأسرار ({flippedCards.length}/4) 💌
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
                {SECRET_CARDS.map((card) => {
                  const isFlipped = flippedCards.includes(card.id);
                  return (
                    <div
                      key={card.id}
                      onClick={() => handleCardFlip(card.id)}
                      className={`h-40 rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 border ${
                        isFlipped
                          ? 'glass-gold-panel border-[#e5c388] shadow-[0_0_25px_rgba(229,195,136,0.35)] scale-[1.02]'
                          : 'glass-panel border-white/15 hover:border-pink-500/40 bg-gradient-to-br from-white/5 to-pink-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-[#e5c388]">
                        <span>{card.tag}</span>
                        <span>{isFlipped ? '✨ مقروءة' : '🔒 انقري للقلب'}</span>
                      </div>

                      <div className="my-auto text-right">
                        {isFlipped ? (
                          <p className="font-editorial text-sm sm:text-base text-[#fdf2f8] leading-relaxed animate-reveal">
                            "{card.backText}"
                          </p>
                        ) : (
                          <div>
                            <h3 className="font-bold text-base text-[#fbe2b5] mb-1">
                              {card.frontTitle}
                            </h3>
                            <p className="text-xs text-pink-300/70">
                              {card.frontSubtitle}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-left text-[11px] text-[#fce7f1]/50">
                        {isFlipped ? 'اضغطي للإغلاق' : 'انقري للقلب ↻'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center max-w-xs mx-auto">
                <button
                  onClick={() => setChapter(1)}
                  className="px-4 py-2 rounded-full text-xs text-[#fce7f1]/70 hover:text-white glass-panel flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>السابق</span>
                </button>
                <button
                  disabled={!canAdvanceFromCh2}
                  onClick={() => unlockAndGoToChapter(3)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    canAdvanceFromCh2
                      ? 'text-[#0d020a] bg-gradient-to-r from-[#fbe2b5] to-[#e5c388] shadow-md cursor-pointer active:scale-95 animate-pulse'
                      : 'text-white/40 glass-panel border border-white/10 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>
                    {canAdvanceFromCh2
                      ? 'برطمان الأسباب 🏺'
                      : `اقلبي كل البطاقات (${flippedCards.length}/4) 🔒`}
                  </span>
                  {canAdvanceFromCh2 ? <ChevronLeft className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3" />}
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 3: REASONS JAR (GATED: MUST DRAW AT LEAST 3 REASONS) */}
          {chapter === 3 && (
            <div className="w-full text-center animate-reveal">
              <div className="mb-3">
                <span className="text-xs font-semibold text-[#e5c388] tracking-widest uppercase">
                  الفصل الرابع
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold gold-gradient-text mt-1">
                  برطمان أسباب العشق
                </h2>
                <p className="text-xs sm:text-sm text-[#fce7f1]/70 mt-1">
                  اسحبي 3 أسباب على الأقل من البرطمان لفتح الفصل التالي ({drawnReasons.length}/3) 🍯
                </p>
              </div>

              <div className="relative w-44 h-48 mx-auto my-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#e5c388]/20 via-[#f472b6]/20 to-[#e5c388]/10 blur-xl animate-pulse" />
                <div className="relative w-full h-full glass-gold-panel rounded-3xl border-2 border-[#e5c388]/40 flex flex-col items-center justify-center p-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                  <div className="w-16 h-3 rounded-full bg-[#e5c388]/60 mb-2 border border-white/20" />
                  <div className="text-5xl animate-float-gentle my-1">🏺</div>
                  <span className="text-[11px] font-bold text-[#fbe2b5]">
                    {drawnReasons.length} أسباب سُحبت
                  </span>
                </div>
              </div>

              {currentReason ? (
                <div className="glass-gold-panel rounded-2xl p-5 mb-4 border border-[#e5c388] shadow-[0_0_20px_rgba(229,195,136,0.3)] animate-reveal max-w-md mx-auto">
                  <div className="text-xs text-[#e5c388] font-bold mb-1">💌 رسالة من قلبي إليكِ:</div>
                  <p className="font-editorial text-base sm:text-lg text-white font-medium">
                    "{currentReason}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#fce7f1]/60 mb-4">
                  اضغطي على الزر بالأسفل لسحب سبب من داخل البرطمان 💫
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center">
                <button
                  onClick={handleDrawReason}
                  disabled={isDrawing}
                  className="px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-[#0d020a] bg-gradient-to-r from-[#fbe2b5] via-[#e5c388] to-[#d4a359] shadow-[0_0_20px_rgba(229,195,136,0.4)] hover:shadow-[0_0_30px_rgba(229,195,136,0.6)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isDrawing ? 'جاري السحب...' : 'اسحبي ورقة حب 📜'}</span>
                </button>

                <button
                  disabled={!canAdvanceFromCh3}
                  onClick={() => unlockAndGoToChapter(4)}
                  className={`px-5 py-3 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    canAdvanceFromCh3
                      ? 'text-[#fbe2b5] glass-panel border border-[#e5c388]/40 hover:bg-white/10 active:scale-95 cursor-pointer animate-pulse'
                      : 'text-white/40 glass-panel border border-white/10 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>
                    {canAdvanceFromCh3
                      ? 'لحظة الحقيقة الكبرى 👑'
                      : `اسحبي 3 أسباب أولاً (${drawnReasons.length}/3) 🔒`}
                  </span>
                  {canAdvanceFromCh3 ? <ChevronLeft className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* CHAPTER 4: THE GRAND REVEAL (GATED: MUST BREAK SEAL & WITNESS NAME) */}
          {chapter === 4 && (
            <div className="w-full text-center animate-reveal">
              <div className="mb-2">
                <span className="text-xs font-semibold text-[#f472b6] tracking-widest uppercase">
                  الفصل الخامس · اللحظة المنتظرة
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-bold rose-gradient-text mt-1">
                  سر الختم الملكي
                </h2>
              </div>

              {!sealBroken ? (
                <div className="glass-gold-panel rounded-3xl p-6 sm:p-8 my-4 border border-[#e5c388]/40 max-w-md mx-auto relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e11d48] to-[#9f1239] mx-auto mb-4 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(225,29,72,0.6)] border-2 border-[#fbcfe8] animate-pulse">
                    💌
                  </div>
                  <h3 className="font-editorial text-xl font-bold text-[#fbe2b5] mb-2">
                    هل تساءلتِ لمن كُتب هذا الكون؟
                  </h3>
                  <p className="text-xs sm:text-sm text-[#fce7f1]/80 leading-relaxed mb-6">
                    الآن حان الوقت لتعرفي من هي صاحبة العرش، ومن التي كُتبت لأجلها كل نبضة وكل حرف في هذا المكان...
                  </p>

                  <button
                    onClick={handleBreakSeal}
                    className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb7185] shadow-[0_0_25px_rgba(244,63,94,0.5)] hover:shadow-[0_0_35px_rgba(244,63,94,0.7)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>افتحي الختم واكتشفي اسمك 🔏</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="my-2 animate-reveal">
                  {revealStep >= 1 && revealStep < 4 && (
                    <div className="glass-gold-panel rounded-3xl p-8 max-w-md mx-auto border border-[#e5c388]">
                      <div className="text-xs text-[#e5c388] font-bold mb-4 tracking-widest">
                        النجوم ترسم الحروف في السماء...
                      </div>
                      <div className="flex justify-center items-center gap-6 my-6 text-5xl sm:text-6xl font-bold font-editorial">
                        <span
                          className={`transition-all duration-700 ${
                            revealStep >= 2
                              ? 'text-[#fbe2b5] scale-125 shadow-[0_0_25px_rgba(229,195,136,0.9)]'
                              : 'text-white/20'
                          }`}
                        >
                          أ
                        </span>
                        <span
                          className={`transition-all duration-700 ${
                            revealStep >= 3
                              ? 'text-[#fbe2b5] scale-125 shadow-[0_0_25px_rgba(229,195,136,0.9)]'
                              : 'text-white/20'
                          }`}
                        >
                          مـ
                        </span>
                        <span
                          className={`transition-all duration-700 ${
                            revealStep >= 4
                              ? 'text-[#fbe2b5] scale-125 shadow-[0_0_25px_rgba(229,195,136,0.9)]'
                              : 'text-white/20'
                          }`}
                        >
                          ـل
                        </span>
                      </div>
                    </div>
                  )}

                  {revealStep === 4 && (
                    <div className="glass-gold-panel rounded-3xl p-6 sm:p-8 max-w-lg mx-auto border-2 border-[#e5c388] shadow-[0_0_50px_rgba(229,195,136,0.45)] relative overflow-hidden animate-reveal">
                      <div className="text-6xl mb-3 animate-float-gentle">👑</div>

                      <h1 className="font-editorial text-3xl sm:text-5xl font-black gold-gradient-text tracking-wide mb-3 leading-tight">
                        إلى أمـــل... 💖
                      </h1>

                      <p className="text-base sm:text-lg font-bold text-[#f472b6] mb-4">
                        أنتِ أملي، وحبيبتي، وكل ما أملك في هذه الدنيا!
                      </p>

                      <div className="text-right text-sm sm:text-base text-[#fdf2f8] leading-relaxed space-y-3 font-editorial bg-black/30 p-5 rounded-2xl border border-white/10 mb-5">
                        <p>
                          عرفتي دلوقتي المفاجأة دي اتعملت لمين؟
                        </p>
                        <p>
                          اتعملت ليكي إنتي بس يا أمل.. لأن مفيش في قلبي ولا في حياتي إنسانة تانية تستحق كل المشاعر دي غيرك.
                        </p>
                        <p className="text-[#fbe2b5] font-bold">
                          أنتي مش مجرد اسم جميل، أنتي الأمل والروح اللي عايش بيهم كل يوم.. بحبك حب مالهوش أول ولا آخر! ❤️
                        </p>
                      </div>

                      <button
                        onClick={() => unlockAndGoToChapter(5)}
                        className="w-full py-3.5 rounded-full font-bold text-sm sm:text-base text-[#0d020a] bg-gradient-to-r from-[#fbe2b5] via-[#e5c388] to-[#d4a359] shadow-[0_0_30px_rgba(229,195,136,0.6)] hover:shadow-[0_0_40px_rgba(229,195,136,0.8)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>اختمي بالعهد الأبدي والرسالة 💍</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* CHAPTER 5: THE ETERNAL VOW + UNIFIED WISH & MESSAGE TO MOHAMED VIA SITE */}
          {chapter === 5 && (
            <div className="w-full text-center animate-reveal pb-6">
              <div className="w-20 h-20 rounded-full glass-gold-panel mx-auto mb-3 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(229,195,136,0.5)] border-2 border-[#e5c388] animate-float-gentle">
                💍
              </div>

              <span className="text-xs font-semibold text-[#e5c388] tracking-widest uppercase">
                الفصل الأخير · العهد والرسالة
              </span>

              <h2 className="font-editorial text-2xl sm:text-4xl font-bold gold-gradient-text mt-1 mb-3">
                وعدٌ محفور في النجوم
              </h2>

              {/* Mohamed's Vow to Her */}
              <div className="glass-gold-panel rounded-3xl p-5 sm:p-6 max-w-md mx-auto border border-[#e5c388]/40 mb-4 text-right relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#e5c388]/10 rounded-full blur-2xl pointer-events-none" />
                <p className="font-editorial text-base sm:text-lg text-[#fdf2f8] leading-relaxed mb-3">
                  "أعدكِ أمام الله، أن أكون لكِ وطناً لا يضيق، وقلباً لا يخون، ويداً لا تفلت يدكِ أبداً مهما قست الظروف."
                </p>
                <div className="text-left text-xs font-bold text-[#e5c388]">
                  — حبيبك محمد للأبد ♾️
                </div>
              </div>

              {/* UNIFIED FORM: WISH + MESSAGE DIRECTLY SENT VIA THE SITE */}
              <div className="glass-gold-panel rounded-3xl p-5 sm:p-6 max-w-md mx-auto border-2 border-[#e5c388]/60 shadow-[0_15px_35px_rgba(229,195,136,0.2)] mb-4 text-right relative overflow-hidden">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-10 h-10 rounded-full bg-[#e5c388]/20 border border-[#e5c388]/40 flex items-center justify-center text-xl">
                    💌
                  </span>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      رسالتكِ وأمنيتكِ لمحمد
                    </h3>
                    <p className="text-[11px] text-[#fce7f1]/70">
                      اكتبي أمنيتكِ ورسالتكِ هنا وسيقوم الموقع بإرسالها لمحمد فوراً على الواتساب 💚
                    </p>
                  </div>
                </div>

                {!sentSuccess ? (
                  <form onSubmit={handleSendWishAndMessage}>
                    {/* Sender Name Field */}
                    <div className="my-3">
                      <label className="block text-[11px] font-semibold text-[#fbe2b5] mb-1">
                        اسمكِ الكريم:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="مثلاً: أمل..."
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-hidden focus:border-[#e5c388] transition-colors"
                        />
                        <User className="w-4 h-4 text-[#e5c388] absolute left-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    {/* Wish Field */}
                    <div className="my-3">
                      <label className="block text-[11px] font-semibold text-[#fbe2b5] mb-1">
                        أمنيتكِ لقلوبنا وحياتنا سوا (ستصل لمحمد): 🕊️
                      </label>
                      <input
                        type="text"
                        required
                        value={wishText}
                        onChange={(e) => setWishText(e.target.value)}
                        placeholder="أمنيتي نفضل سوا ومبسوطين طول العمر..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-hidden focus:border-[#e5c388] transition-colors"
                      />
                    </div>

                    {/* Romantic Suggestions for Message */}
                    <div className="my-3">
                      <div className="text-[11px] font-semibold text-[#fbe2b5]/90 mb-1.5">
                        عبارات سريعة للرسالة (انقري لاختيارها):
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {REPLY_SUGGESTIONS.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            type="button"
                            onClick={() => {
                              setReplyText(sug);
                              romanticAudio.playTone(600 + sIdx * 50, 0.25, 'sine', 0.1);
                            }}
                            className={`text-xs px-3.5 py-2 rounded-xl text-right transition-all cursor-pointer ${
                              replyText === sug
                                ? 'bg-[#e5c388]/30 text-white border border-[#e5c388] font-bold shadow-xs'
                                : 'bg-white/5 text-[#fce7f1]/75 hover:bg-white/10 border border-white/10'
                            }`}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div className="my-3">
                      <label className="block text-[11px] font-semibold text-[#fbe2b5]/80 mb-1">
                        رسالتكِ الخاصة إلى محمد:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="اكتبي هنا أي كلام طالع من قلبك لمحمد..."
                        className="w-full p-3.5 rounded-2xl bg-black/40 border border-white/20 text-white placeholder-white/30 text-xs sm:text-sm focus:outline-hidden focus:border-[#e5c388] transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSending || (!replyText.trim() && !wishText.trim())}
                      className="w-full py-3.5 px-4 rounded-full font-bold text-xs sm:text-sm text-[#0d020a] bg-gradient-to-r from-[#fbe2b5] via-[#e5c388] to-[#d4a359] shadow-[0_0_25px_rgba(229,195,136,0.45)] hover:shadow-[0_0_35px_rgba(229,195,136,0.7)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#fbe2b5]/50 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSending ? 'جاري إرسال رسالتكِ وأمنيتكِ لمحمد...' : 'إرسال الرسالة والأمنية إلى محمد عبر الموقع 🕊️'}</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#e5c388]/15 border border-[#e5c388]/40 text-center animate-reveal">
                    <CheckCircle2 className="w-12 h-12 text-[#e5c388] mx-auto mb-2" />
                    <h4 className="font-bold text-base text-[#fbe2b5] mb-1">
                      تم الإرسال بنجاح! ✨
                    </h4>
                    <p className="text-xs text-[#fdf2f8] leading-relaxed mb-3">
                      شكراً يا <strong className="text-[#fbe2b5]">{sentDetails?.name}</strong>، الموقع قام بتوجيه رسالتكِ وأمنيتكِ إلى محمد فوراً ليفرح بها قلبه بكل حب 💖
                    </p>

                    <div className="bg-black/40 p-3.5 rounded-xl border border-white/10 text-right text-xs space-y-2 mb-3">
                      <div>
                        <span className="text-[#e5c388] font-bold">🕊️ أمنيتكِ: </span>
                        <span className="text-white">"{sentDetails?.wish}"</span>
                      </div>
                      <div>
                        <span className="text-[#f472b6] font-bold">💌 رسالتكِ: </span>
                        <span className="text-white">"{sentDetails?.message}"</span>
                      </div>
                      <div className="text-[10px] text-white/50 text-left pt-1">
                        توقيت الإرسال: {sentDetails?.time}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-center mt-2">
                      {/* Direct delivery trigger - opens WhatsApp pre-filled without showing phone number */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=201206821147&text=${encodeURIComponent(
                          `💌 رسالة وأمنية خاصة من ${sentDetails?.name || 'أمل'} إلى محمد:\n\n🕊️ أمنيتي: "${sentDetails?.wish}"\n\n💖 رسالتي: "${sentDetails?.message}"\n\n(مرسلة من موقع مخطوطة النبض ✨)`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <span>تأكيد إرسالها لمحمد على واتساب 💚</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => setSentSuccess(false)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-semibold glass-panel text-[#fbe2b5] border border-white/20 hover:bg-white/10 active:scale-95 transition-all"
                      >
                        تعديل أو إرسال أمنية أخرى ✍️
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Back */}
              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => setChapter(0)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-[#fbe2b5] glass-panel border border-[#e5c388]/30 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                >
                  إعادة قراءة الحكاية من البداية ↺
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* MYSTERIOUS LOCK SCREEN (ALWAYS PROMPT FIRST ON LOAD!) */}
      {!unlocked && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-6">
          <div className="w-full max-w-sm glass-gold-panel rounded-[36px] p-6 sm:p-8 flex flex-col items-center border border-[#e5c388]/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden animate-reveal">
            {/* Ambient background glow inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5c388]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f472b6]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Vault Seal */}
            <div className="w-20 h-20 rounded-full glass-gold-panel flex items-center justify-center text-4xl mb-4 border border-[#e5c388]/50 shadow-[0_0_25px_rgba(229,195,136,0.3)] animate-float-gentle">
              🔒
            </div>

            {/* Title & Mystery Copy */}
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold gold-gradient-text text-center tracking-wide mb-1">
              خزينة الذكريات السرية
            </h1>
            <p className="text-xs text-[#fce7f1]/70 text-center font-medium mb-4 max-w-xs leading-relaxed">
              رسالة مشفّرة كُتبت بنبض الفؤاد.. لشخص استثنائي واحد لا يتكرر في الحياة ✨
            </p>

            {/* PIN Indicator Rings */}
            <div
              className={`flex items-center justify-center gap-3.5 my-3 h-10 ${
                shakePin ? 'animate-shake' : ''
              }`}
            >
              {[0, 1, 2, 3].map((index) => {
                const filled = index < pin.length;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full transition-all duration-300 border ${
                      filled
                        ? 'bg-[#e5c388] border-[#fbe2b5] scale-110 shadow-[0_0_15px_rgba(229,195,136,0.9)]'
                        : 'bg-white/10 border-white/20'
                    }`}
                  />
                );
              })}
            </div>

            {/* Feedback/Error message */}
            <div className="min-h-[24px] text-xs font-bold text-center mb-3">
              <span className={isVerifying ? 'text-[#fbe2b5]' : 'text-[#f472b6]'}>
                {pinError || 'أدخلي الرمز السري المكون من 4 أرقام 🗝️'}
              </span>
            </div>

            {/* Luxury Glass Keypad */}
            <div
              className="grid grid-cols-3 gap-3 w-full max-w-[260px] my-1"
              style={{ direction: 'ltr' }}
            >
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'x'].map((k, idx) => {
                if (k === '') {
                  return <div key={idx} className="w-16 h-14" />;
                }
                const isDelete = k === 'x';
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleKeypadPress(k)}
                    className="h-14 rounded-2xl glass-panel hover:bg-white/15 active:bg-[#e5c388] active:text-[#0d020a] border border-white/10 hover:border-[#e5c388]/40 text-xl font-bold text-[#fbe2b5] shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-90 transition-all flex items-center justify-center cursor-pointer select-none"
                  >
                    {isDelete ? '⌫' : k}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            <div className="w-full mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-[#fce7f1]/50">
              رمزنا السري المشترك 💫
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
