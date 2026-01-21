import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download, ArrowLeft, Send, Sparkles, Zap, Cloud, Home, RefreshCw, Settings, Check, X, Plus, Trash2, Lock } from 'lucide-react';
import { CloudBackground } from './components/CloudBackground';
import { FloatingComments } from './components/FloatingComments';
import { generateMandalaContent } from './services/geminiService';
import { MandalaData, BlockData, User, CheeringMessage, AppState } from './types';

// Random Colors for new users
const AVATAR_COLORS = [
  'bg-blue-400', 'bg-yellow-400', 'bg-indigo-400', 'bg-pink-400', 'bg-green-400',
  'bg-purple-400', 'bg-red-400', 'bg-cyan-400', 'bg-teal-400', 'bg-orange-400',
  'bg-lime-400', 'bg-emerald-400', 'bg-sky-500', 'bg-rose-400', 'bg-amber-400',
  'bg-fuchsia-400', 'bg-violet-400', 'bg-blue-500', 'bg-green-500', 'bg-slate-400',
  'bg-stone-400', 'bg-zinc-400', 'bg-neutral-400'
];

// Initial Mock Users
const INITIAL_USERS: User[] = [
  { id: '1', name: '고권아', avatarColor: 'bg-blue-400', mainGoal: '2026년 알차게 보내기' },
  { id: '2', name: '고정후', avatarColor: 'bg-yellow-400', mainGoal: '꾸준히 성장하는 한 해' },
  { id: '3', name: '권예인', avatarColor: 'bg-indigo-400', mainGoal: '건강하고 행복하게' },
  { id: '4', name: '김동영', avatarColor: 'bg-pink-400', mainGoal: '새로운 도전 시작하기' },
  { id: '5', name: '김보란', avatarColor: 'bg-green-400', mainGoal: '나만의 경쟁력 갖추기' },
  { id: '6', name: '김예지', avatarColor: 'bg-purple-400', mainGoal: '매일매일 발전하기' },
  { id: '7', name: '김해담', avatarColor: 'bg-red-400', mainGoal: '긍정적인 마인드 갖기' },
  { id: '8', name: '박건영', avatarColor: 'bg-cyan-400', mainGoal: '전문성 레벨업' },
  { id: '9', name: '박미지', avatarColor: 'bg-teal-400', mainGoal: '워라밸 챙기기' },
  { id: '10', name: '박상수', avatarColor: 'bg-orange-400', mainGoal: '재테크 성공하기' },
  { id: '11', name: '박종혁', avatarColor: 'bg-lime-400', mainGoal: '외국어 마스터하기' },
  { id: '12', name: '변경도', avatarColor: 'bg-emerald-400', mainGoal: '꾸준한 운동 습관' },
  { id: '13', name: '송승연', avatarColor: 'bg-sky-500', mainGoal: '많은 책 읽기' },
  { id: '14', name: '신민정', avatarColor: 'bg-rose-400', mainGoal: '자격증 취득하기' },
  { id: '15', name: '이소림', avatarColor: 'bg-amber-400', mainGoal: '취미 생활 즐기기' },
  { id: '16', name: '이우진', avatarColor: 'bg-fuchsia-400', mainGoal: '좋은 습관 만들기' },
  { id: '17', name: '임채진', avatarColor: 'bg-violet-400', mainGoal: '스트레스 관리 잘하기' },
  { id: '18', name: '차현지', avatarColor: 'bg-blue-500', mainGoal: '소중한 사람들과 시간 보내기' },
  { id: '19', name: '최기석', avatarColor: 'bg-green-500', mainGoal: '성공적인 프로젝트 완수' },
  { id: '20', name: '최진학', avatarColor: 'bg-slate-400', mainGoal: '리더십 키우기' },
  { id: '21', name: '한승연', avatarColor: 'bg-stone-400', mainGoal: '창의적인 아이디어 내기' },
  { id: '22', name: '현영서', avatarColor: 'bg-zinc-400', mainGoal: '효율적인 시간 관리' },
  { id: '23', name: '박상우', avatarColor: 'bg-neutral-400', mainGoal: '멘토링 적극 참여하기' },
  { id: '24', name: '박창윤', avatarColor: 'bg-blue-400', mainGoal: '네트워킹 넓히기' },
  { id: '25', name: '김성환', avatarColor: 'bg-yellow-400', mainGoal: '기술 블로그 운영하기' },
  { id: '26', name: '김진우', avatarColor: 'bg-indigo-400', mainGoal: '오픈소스 기여하기' },
  { id: '27', name: '박세영', avatarColor: 'bg-pink-400', mainGoal: '알고리즘 문제 풀기' },
  { id: '28', name: '고한솔', avatarColor: 'bg-green-400', mainGoal: '풀스택 개발 도전' },
];

const RESOLUTIONS = [
  { label: '1024x768', w: 1024, h: 768 },
  { label: '1280x720', w: 1280, h: 720 },
  { label: '1920x1080', w: 1920, h: 1080 },
  { label: '2560x1440', w: 2560, h: 1440 },
];

// 9x9 Initialization
const createInitialData = (): MandalaData => {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      text: '',
      isDraft: false,
      isAccepted: false
    }))
  );
};

// Helper to determine font size class based on text length
const getFontSizeClass = (text: string, isCenter: boolean) => {
  const len = text.length;
  if (isCenter) {
    if (len > 30) return 'text-xs leading-tight';
    if (len > 15) return 'text-sm leading-snug';
    return 'text-base md:text-lg leading-normal';
  } else {
    // Normal cells
    if (len > 25) return 'text-[9px] leading-tight';
    if (len > 12) return 'text-[10px] leading-snug';
    return 'text-[11px] md:text-xs leading-normal';
  }
};

// Sub-Component: A single 3x3 block
interface MandalaBlockProps {
  blockIdx: number;
  data: BlockData;
  loadingBlock: number | null;
  onUpdateCell: (blockIdx: number, cellIdx: number, text: string, isDraft: boolean, isAccepted: boolean) => void;
  onAiGenerate: (blockIdx: number) => void;
  isCaptureMode?: boolean;
}

const MandalaBlock: React.FC<MandalaBlockProps> = ({ blockIdx, data, loadingBlock, onUpdateCell, onAiGenerate, isCaptureMode = false }) => {
  const isCenterBlock = blockIdx === 4;
  const isLoading = loadingBlock === blockIdx;

  // In capture mode, we want a pure white background for all blocks, including the center one.
  const containerBgClass = isCaptureMode
    ? 'bg-white' // Always white in capture mode
    : (isCenterBlock ? 'bg-sky-100 shadow-inner' : 'bg-white/50');

  return (
    <div className={`
      grid grid-cols-3 gap-0.5 md:gap-1 p-1 md:p-1.5 rounded-lg transition-all duration-300
      ${containerBgClass}
    `}>
      {data.map((cell, cellIdx) => {
        const isCenterCell = cellIdx === 4;

        // Visual Styles
        let bgClass = "bg-white";
        if (isCenterBlock) {
          if (isCenterCell) {
            bgClass = "bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg"; // Absolute Core
          } else {
            // Center block outer cells
            // Capture mode: White background with slate-200 border for visibility on white
            bgClass = isCaptureMode
              ? "bg-white border-2 border-slate-200 text-slate-700"
              : "bg-sky-50 hover:bg-white";
          }
        } else {
          if (isCenterCell) {
            // Sub-Core
            bgClass = "bg-sky-100 font-semibold text-sky-800";
            if (isCaptureMode) bgClass += " border-2 border-sky-100";
          } else {
            // Logic for normal cells (draft vs empty vs filled)
            if (cell.isDraft) {
              // Draft
              // Capture mode: Thicker border (border-2) and lighter look
              bgClass = isCaptureMode
                ? "bg-white border-2 border-dashed border-slate-200 text-slate-600"
                : "bg-slate-50 border border-dashed border-slate-300 text-slate-500";
            } else {
              // Filled
              bgClass = "bg-white hover:bg-yellow-50";
              // Capture mode: Add solid border-2 to define cells clearly
              if (isCaptureMode) bgClass += " border-2 border-slate-200";
            }
          }
        }

        const fontSizeClass = getFontSizeClass(cell.text, isCenterCell && isCenterBlock);

        return (
          <div
            key={cellIdx}
            className={`
              relative aspect-square p-0.5 rounded transition-all duration-200 group overflow-hidden
              ${bgClass}
              ${isCenterCell && !isCenterBlock ? 'shadow-sm' : ''}
            `}
          >
            {isCenterCell && !isCaptureMode && (
              <div className="absolute top-0 right-0 p-0.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* AI Generate Button for Center Cells */}
                <button
                  onClick={() => onAiGenerate(blockIdx)}
                  disabled={isLoading || !cell.text}
                  className="bg-white/80 rounded-full p-1 text-sky-600 hover:text-sky-800 hover:bg-white shadow-sm cursor-pointer"
                  title={isCenterBlock ? "세부 목표 생성" : "실천 계획 생성"}
                >
                  {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                </button>
              </div>
            )}

            <div className="w-full h-full flex items-center justify-center">
              {isCaptureMode ? (
                // Render DIV for capture to handle word wrapping correctly and avoid textarea scrollbars
                <div
                  className={`
                      w-full h-full flex items-center justify-center text-center
                      ${isCenterCell ? 'font-bold' : 'font-medium'}
                      ${fontSizeClass}
                      whitespace-pre-wrap break-keep
                    `}
                  style={{ padding: '2px' }}
                >
                  {cell.text}
                </div>
              ) : (
                // Render Textarea for editing
                <textarea
                  value={cell.text}
                  onChange={(e) => onUpdateCell(blockIdx, cellIdx, e.target.value, false, true)}
                  className={`
                      w-full h-full text-center bg-transparent resize-none outline-none 
                      ${isCenterCell ? 'font-bold' : 'font-medium'}
                      ${fontSizeClass}
                      scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent
                    `}
                  placeholder={isCenterCell ? "목표" : "."}
                  style={{ paddingTop: cell.text.length > 20 ? '4px' : '25%' }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ... imports
// ... imports
import { firebaseService } from './services/firebaseService';

// ... (KEEP AVATAR_COLORS and INITIAL_USERS as fallbacks)

// ... (KEEP RESOLUTIONS, createInitialData, getFontSizeClass, MandalaBlock)

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [users, setUsers] = useState<User[]>([]); // Start empty, load from DB
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chartTitle, setChartTitle] = useState('');

  const [mandala, setMandala] = useState<MandalaData>(createInitialData());

  const [cheerMsg, setCheerMsg] = useState('');
  const [cheerAuthor, setCheerAuthor] = useState('');
  const [messages, setMessages] = useState<CheeringMessage[]>([]);
  const [loadingBlock, setLoadingBlock] = useState<number | null>(null);

  // Settings for Image Saving
  const [includeMessagesInSave, setIncludeMessagesInSave] = useState(true);
  const [saveResolution, setSaveResolution] = useState(RESOLUTIONS[2]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Auth & Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserGoal, setNewUserGoal] = useState('');

  const hiddenCaptureRef = useRef<HTMLDivElement>(null);
  // Ref to track if we should save mandala updates (avoid saving on initial load)
  const isMandalaLoaded = useRef(false);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // --- 1. Load Users on Mount ---
  useEffect(() => {
    const fetchUsers = async () => {
      if (firebaseService.isConnected()) {
        try {
          const dbUsers = await firebaseService.getUsers();
          if (dbUsers.length > 0) {
            // Force Seed Logic:
            // Even if we have some users, check if our official 28 members are loaded.
            // We check if "User ID 1" (고권아) exists as a proxy.
            const hasInitialUser = dbUsers.some(u => u.id === '1');

            if (!hasInitialUser || dbUsers.length < 5) {
              console.log("Seeding/Repairing initial users to Firebase...");
              try {
                // Add all initial users. setDoc in createUser handles merge/overwrite safely.
                const seedPromises = INITIAL_USERS.map(user => firebaseService.createUser(user));
                await Promise.all(seedPromises);

                // Re-fetch to ensure UI is in sync
                const reFetchedUsers = await firebaseService.getUsers();
                setUsers(reFetchedUsers);
              } catch (e) {
                console.error("Seeding repair failed:", e);
                setUsers(dbUsers.length > 0 ? dbUsers : INITIAL_USERS);
              }
            } else {
              setUsers(dbUsers);
            }

          } else {
            console.log("Seeding initial users to Firebase (Empty DB)...");
            try {
              const seedPromises = INITIAL_USERS.map(user => firebaseService.createUser(user));
              await Promise.all(seedPromises);
            } catch (e) { console.error("Seeding failed:", e); }
            setUsers(INITIAL_USERS);
          }
        } catch (error) {
          console.error("Failed to fetch users:", error);
          setUsers(INITIAL_USERS);
        }
      } else {
        setUsers(INITIAL_USERS);
      }
    };
    fetchUsers();
  }, []);

  // --- Auth Logic ---
  const requestAuth = (action: () => void) => {
    setPendingAction(() => action);
    setAuthPassword('');
    setShowAuthModal(true);
  };

  const verifyAuth = () => {
    if (authPassword === '0401') {
      if (pendingAction) pendingAction();
      setShowAuthModal(false);
      setPendingAction(null);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
      setAuthPassword('');
    }
  };

  // --- User Management ---
  const handleUserSelect = async (user: User) => {
    setCurrentUser(user);
    setChartTitle(`${user.name}님의 2026년 성장 계획`);

    // Load Data
    isMandalaLoaded.current = false; // Prevent auto-save while loading

    if (firebaseService.isConnected()) {
      try {
        // Load Mandala
        const savedMandala = await firebaseService.getMandala(user.id);
        if (savedMandala) {
          setMandala(savedMandala);
        } else {
          // Initialize New Data on Server if not found
          const newData = createInitialData();
          newData[4][4].text = user.mainGoal;
          newData[4][4].isAccepted = true;

          try {
            // Save immediately to initialize DB
            await firebaseService.saveMandala(user.id, newData);
          } catch (initErr) {
            console.error("Failed to initialize mandala on server:", initErr);
          }

          setMandala(newData);
        }

        // Load Messages
        const savedMessages = await firebaseService.getMessages(user.id);
        setMessages(savedMessages);

      } catch (e) {
        console.error("Failed to load user data:", e);
        // Fallback to empty/init
        const newData = createInitialData();
        newData[4][4].text = user.mainGoal;
        newData[4][4].isAccepted = true;
        setMandala(newData);
        setMessages([]);
      }
    } else {
      // Local (Non-connected) Fallback
      const newData = createInitialData();
      newData[4][4].text = user.mainGoal;
      newData[4][4].isAccepted = true;
      setMandala(newData);
      setMessages([]);
    }

    setAppState(AppState.MANDALA);
    // Allow saving after a short delay
    setTimeout(() => { isMandalaLoaded.current = true; }, 500);
  };

  const handleDeleteUser = (userId: string) => {
    requestAuth(async () => {
      if (firebaseService.isConnected()) {
        await firebaseService.deleteUser(userId);
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
    });
  };

  const handleAddUserInit = () => {
    requestAuth(() => {
      setShowAddUserModal(true);
      setNewUserName('');
      setNewUserGoal('');
    });
  };

  const handleCreateUser = async () => {
    if (!newUserName.trim() || !newUserGoal.trim()) {
      alert('이름과 목표를 모두 입력해주세요.');
      return;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      mainGoal: newUserGoal,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
    };

    if (firebaseService.isConnected()) {
      await firebaseService.createUser(newUser);
    }
    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
  };

  const handleBack = () => {
    setAppState(AppState.DASHBOARD);
    setCurrentUser(null);
    setMessages([]);
    setMandala(createInitialData());
  };

  // --- Mandala Logic ---
  // Debounced Save
  // --- Save Logic (Wallpaper Style) ---
  const handleSave = () => {
    setIsCapturing(true);
  };

  // Effect to perform the capture once the hidden element is rendered
  useEffect(() => {
    if (!isCapturing || !hiddenCaptureRef.current) return;

    const captureAndSave = async () => {
      try {
        // Double wait to ensure React has fully rendered the hidden div
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(hiddenCaptureRef.current, {
          backgroundColor: '#f8fafc', // slate-50 to match app theme and show white elements
          scale: 2, // Check for high DPI
          logging: false,
          useCORS: true, // For cross-origin images if any
        });

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${chartTitle || 'mandala-chart'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Capture failed:", err);
        alert("이미지 저장 중 오류가 발생했습니다.");
      } finally {
        setIsCapturing(false);
      }
    };

    captureAndSave();
  }, [isCapturing, chartTitle]);

  // Sub-Effect: Auto-save Mandala Data
  useEffect(() => {
    // Skip if no user, or not loaded
    if (!currentUser || !isMandalaLoaded.current) return;

    setIsSaving(true);
    const timer = setTimeout(async () => {
      try {
        if (firebaseService.isConnected()) {
          await firebaseService.saveMandala(currentUser.id, mandala);
        }
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // Debounce 1s

    return () => clearTimeout(timer);
  }, [mandala, currentUser]);


  const updateCell = (blockIdx: number, cellIdx: number, text: string, isDraft = false, isAccepted = false) => {
    const newMandala = [...mandala];
    const newBlock = [...newMandala[blockIdx]];
    newBlock[cellIdx] = { text, isDraft, isAccepted };
    newMandala[blockIdx] = newBlock;

    if (blockIdx === 4 && cellIdx !== 4) {
      const targetOuterBlockIdx = cellIdx;
      const targetOuterBlock = [...newMandala[targetOuterBlockIdx]];
      targetOuterBlock[4] = { text, isDraft, isAccepted };
      newMandala[targetOuterBlockIdx] = targetOuterBlock;
    }
    else if (blockIdx !== 4 && cellIdx === 4) {
      const targetCenterBlock = [...newMandala[4]];
      targetCenterBlock[blockIdx] = { text, isDraft, isAccepted };
      newMandala[4] = targetCenterBlock;
    }
    setMandala(newMandala);
  };

  const handleAiGenerate = async (blockIdx: number) => {
    let sourceGoal = "";
    let type: 'sub-goal' | 'action-plan' = 'action-plan';
    let contextGoal = mandala[4][4].text;

    if (blockIdx === 4) {
      sourceGoal = mandala[4][4].text;
      type = 'sub-goal';
    } else {
      sourceGoal = mandala[blockIdx][4].text;
      type = 'action-plan';
    }

    if (!sourceGoal) {
      alert("중심 목표를 먼저 입력해주세요!");
      return;
    }

    setLoadingBlock(blockIdx);

    try {
      const suggestions = await generateMandalaContent(sourceGoal, type, contextGoal);

      setMandala(currentMandala => {
        const newMandala = currentMandala.map(block => [...block]); // Deepish copy
        const targetBlock = newMandala[blockIdx];

        let suggestionPtr = 0;
        [0, 1, 2, 3, 5, 6, 7, 8].forEach(cellIdx => {
          if (suggestionPtr < suggestions.length && !targetBlock[cellIdx].isAccepted && !targetBlock[cellIdx].text) {
            targetBlock[cellIdx] = {
              text: suggestions[suggestionPtr],
              isDraft: true,
              isAccepted: false
            };
            suggestionPtr++;
          }
        });

        newMandala[blockIdx] = targetBlock;

        if (blockIdx === 4) {
          [0, 1, 2, 3, 5, 6, 7, 8].forEach(cellIdx => {
            const subGoalText = targetBlock[cellIdx].text;
            if (subGoalText) {
              const outerBlock = [...newMandala[cellIdx]];
              if (!outerBlock[4].text || outerBlock[4].isDraft) {
                outerBlock[4] = { text: subGoalText, isDraft: true, isAccepted: false };
                newMandala[cellIdx] = outerBlock;
              }
            }
          });
        }
        return newMandala;
      });

    } catch (e: any) {
      console.error(e);
      alert(`AI 생성 오류: ${e.message}\n(Vercel 환경 변수가 설정되었는지 확인해주세요)`);
    } finally {
      setLoadingBlock(null);
    }
  };

  // --- Cheering Messages ---
  const addCheerMessage = async () => {
    if (!cheerMsg.trim() || !cheerAuthor.trim()) return;
    if (!currentUser) return; // Should not happen in mandala mode

    let attempts = 0;
    let newLeft = 0;
    let newTop = 0;
    let isLeft = true;
    let isValidPosition = false;

    while (attempts < 20 && !isValidPosition) {
      isLeft = Math.random() > 0.5;
      if (isLeft) { newLeft = 1 + Math.random() * 7; }
      else { newLeft = 88 + Math.random() * 6; }
      newTop = 15 + Math.random() * 65;

      const collision = messages.some(msg => {
        const existingLeft = parseFloat(msg.style.left);
        const existingTop = parseFloat(msg.style.top);
        if (isNaN(existingLeft) || isNaN(existingTop)) return false;
        return Math.abs(existingLeft - newLeft) < 15 && Math.abs(existingTop - newTop) < 10;
      });

      if (!collision) isValidPosition = true;
      attempts++;
    }

    const newMessage: CheeringMessage = {
      id: Date.now().toString(),
      text: cheerMsg,
      author: cheerAuthor,
      style: {
        left: `${newLeft}%`,
        top: `${newTop}%`,
        animationDelay: '0s'
      }
    };

    if (firebaseService.isConnected()) {
      try {
        await firebaseService.addMessage(currentUser.id, newMessage);
      } catch (e) {
        console.warn("Firebase add msg failed:", e);
      }
    }
    setMessages(prev => [...prev, newMessage]);
    setCheerMsg('');
  };

  const handleUpdateMessagePosition = (id: string, left: string, top: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id
        ? { ...msg, style: { ...msg.style, left, top } }
        : msg
    ));
    // Note: We are not syncing drag updates strict-realtime to save bandwidth/API calls for now.
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm("정말 이 메시지를 삭제하시겠습니까?")) {
      if (firebaseService.isConnected()) {
        try {
          await firebaseService.deleteMessage(id);
        } catch (e) {
          console.error("Failed to delete message:", e);
          alert("메시지 삭제 중 오류가 발생했습니다.");
          return;
        }
      }
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  // --- Rendering ---

  // Dashboard
  if (appState === AppState.DASHBOARD) {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-slate-50">
        <CloudBackground />

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center animate-hover-gentle" style={{ animationDuration: '0.3s' }}>
              <div className="flex justify-center mb-4">
                <div className="bg-sky-100 p-3 rounded-full">
                  <Lock className="w-6 h-6 text-sky-600" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">관리자 확인</h3>
              <p className="text-sm text-slate-500 mb-4">비밀번호를 입력해주세요.</p>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && verifyAuth()}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-center mb-4 focus:ring-2 focus:ring-sky-400 outline-none"
                placeholder="PIN"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => setShowAuthModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">취소</button>
                <button onClick={verifyAuth} className="flex-1 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-bold">확인</button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
              <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">새로운 멤버 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">이름</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="예: 김신입"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">2026년 목표</label>
                  <input
                    type="text"
                    value={newUserGoal}
                    onChange={(e) => setNewUserGoal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                    placeholder="예: 최고의 개발자 되기"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowAddUserModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">취소</button>
                <button onClick={handleCreateUser} className="flex-1 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-bold">추가하기</button>
              </div>
            </div>
          </div>
        )}

        <div className="z-10 w-full max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/50 px-4 py-1 rounded-full backdrop-blur-sm">
            <Cloud className="w-5 h-5 text-sky-500" />
            <span className="font-bold text-slate-600 tracking-tight">kt cloud</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 mb-2 tracking-tight">
            Mandala Chart
          </h1>
          <p className="text-slate-500 mb-16 text-lg">성장 마인드셋: 2026년 목표를 향해 점프!</p>

          <div className="flex flex-wrap justify-center gap-8">
            {users.map(user => (
              <div
                key={user.id}
                className="group relative w-48 h-64 perspective-1000 cursor-pointer"
              >
                {/* Delete Button - Visible on Hover (Outside flip context to stay clickable) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.id);
                  }}
                  className="absolute -top-3 -right-3 z-20 bg-white text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100"
                  title="멤버 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div
                  className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180"
                  onClick={() => handleUserSelect(user)}
                >
                  {/* Front Face */}
                  <div className={`absolute w-full h-full backface-hidden rounded-3xl shadow-xl flex flex-col items-center justify-center bg-white border border-slate-100`}>
                    <div className={`w-24 h-24 ${user.avatarColor} rounded-full flex items-center justify-center text-4xl text-white shadow-inner mb-6`}>
                      {user.name[0]}
                    </div>
                    <span className="font-bold text-xl text-slate-700">{user.name}</span>
                    <span className="text-xs text-slate-400 mt-2">신입사원</span>
                  </div>

                  {/* Back Face (Goal) */}
                  <div className={`absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl shadow-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white p-6 flex flex-col items-center justify-center text-center`}>
                    <Zap className="w-8 h-8 text-yellow-300 mb-4 fill-yellow-300 animate-pulse" />
                    <div className="font-medium text-sky-100 text-sm mb-2">올해의 목표</div>
                    <div className="font-bold text-xl break-keep leading-snug">
                      "{user.mainGoal}"
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add User Card */}
            <div
              onClick={handleAddUserInit}
              className="w-48 h-64 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50 transition-all cursor-pointer group"
            >
              <div className="w-16 h-16 bg-slate-100 group-hover:bg-white rounded-full flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-bold text-lg">멤버 추가</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Mandala Chart View
  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden bg-slate-50">
      <CloudBackground />

      {/* Auth Modal for Delete Comment */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-sky-100 p-3 rounded-full">
                <Lock className="w-6 h-6 text-sky-600" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">관리자 확인</h3>
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyAuth()}
              className="w-full bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-center mb-4 focus:ring-2 focus:ring-sky-400 outline-none"
              placeholder="PIN"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setShowAuthModal(false)} className="flex-1 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">취소</button>
              <button onClick={verifyAuth} className="flex-1 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-bold">확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 
        CAPTURING CONTAINER (Hidden Off-screen) 
        - Used for generating high-quality wallpapers.
        - Style changes: removed backdrop-blur, used solid white (opacity 95%) to fix "graying" issue in html2canvas.
      */}
      {isCapturing && (
        <div
          ref={hiddenCaptureRef}
          style={{
            position: 'fixed',
            left: '-10000px',
            top: 0,
            width: `${saveResolution.w}px`,
            height: `${saveResolution.h}px`,
            overflow: 'hidden'
          }}
          className="bg-slate-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 z-0">
            <CloudBackground position="absolute" />
          </div>

          {/* Messages inside the capture container (Only if enabled) */}
          {includeMessagesInSave && (
            <FloatingComments messages={messages} mode="absolute" />
          )}

          {/* The Chart - Scaled to fit somewhat nicely if needed, or just centered */}
          <div className="relative z-20 flex flex-col items-center justify-center transform scale-100 p-12">
            {/* 
                   Fix for Issue 3: html2canvas capture quality.
                   - Replaced 'bg-white/70 backdrop-blur-md' with 'bg-white/95' to simulate the look without blur artifacts.
                   - Now completely solid 'bg-white' as requested.
                */}
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 w-[900px] flex flex-col items-center">
              {/* Capture Title */}
              <div className="mb-8 w-full text-center">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight font-cute">
                  {chartTitle}
                </h1>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full">
                {Array(9).fill(null).map((_, i) => (
                  <MandalaBlock
                    key={i}
                    blockIdx={i}
                    data={mandala[i]}
                    loadingBlock={loadingBlock}
                    onUpdateCell={() => { }} // Read-only during capture
                    onAiGenerate={() => { }} // Read-only
                    isCaptureMode={true} // Enable DIV rendering for text wrapping
                  />
                ))}
              </div>
              {/* Removed Footer */}
            </div>
          </div>
        </div>
      )}


      {/* Normal View Comments (Screen only) with Dragging Enabled */}
      <FloatingComments
        messages={messages}
        mode="fixed"
        onDelete={handleDeleteMessage}
        onUpdatePosition={handleUpdateMessagePosition}
      />

      <header className="relative z-20 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-3 bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-100 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors group" title="대시보드로">
              <Home className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
            </button>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-sky-600">kt cloud</span>
              <span className="text-lg font-bold text-slate-800 leading-none">{currentUser?.name}의 만다라 차트</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="hidden lg:flex items-center gap-2 mr-2 text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>중앙 목표 클릭 후 AI 버튼을 눌러보세요!</span>
          </div>

          {/* Save Status Indicator */}
          <div className="flex items-center text-xs font-medium text-slate-500 mr-2">
            {isSaving ? (
              <span className="flex items-center text-sky-600">
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                저장 중...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center text-emerald-600">
                <Check className="w-3 h-3 mr-1" />
                저장됨
              </span>
            ) : null}
          </div>

          {/* Save Options */}
          <div className="flex items-center gap-2 bg-white/80 p-1.5 rounded-lg border border-slate-200">
            {/* Include Messages Toggle */}
            <button
              onClick={() => setIncludeMessagesInSave(!includeMessagesInSave)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all w-32 justify-center ${includeMessagesInSave
                ? 'bg-sky-100 text-sky-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              title="이미지에 응원 메시지 포함"
            >
              {includeMessagesInSave ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>응원 메시지 ON</span>
                </>
              ) : (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>응원 메시지 OFF</span>
                </>
              )}
            </button>

            {/* Resolution Selector */}
            <div className="flex items-center px-2 border-l border-slate-200">
              <span className="text-xs text-slate-400 mr-2">해상도</span>
              <select
                value={saveResolution.label}
                onChange={(e) => {
                  const selected = RESOLUTIONS.find(r => r.label === e.target.value);
                  if (selected) setSaveResolution(selected);
                }}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer w-24"
              >
                {RESOLUTIONS.map(res => (
                  <option key={res.label} value={res.label}>{res.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isCapturing}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg shadow-md transition-all font-semibold text-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCapturing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            저장
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden z-20 p-4 flex flex-col items-center">

        <div className="flex-1 flex items-center justify-center w-full my-4">
          {/* Visible Chart Area (Screen) */}
          <div
            className="relative p-8 md:p-16 rounded-[3rem] bg-white/30 backdrop-blur-sm border border-white/40"
          >
            {/* Mandala Chart Card */}
            <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/60 relative w-full max-w-[900px] flex flex-col z-20">
              {/* Screen Title Input */}
              <div className="mb-4 md:mb-6 w-full text-center">
                <input
                  type="text"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                  className="w-full text-center text-2xl md:text-3xl font-bold text-slate-800 bg-transparent outline-none placeholder-slate-400 border-b-2 border-transparent hover:border-sky-200 focus:border-sky-400 transition-colors pb-2 font-cute"
                  placeholder="타이틀을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
                {Array(9).fill(null).map((_, i) => (
                  <MandalaBlock
                    key={i}
                    blockIdx={i}
                    data={mandala[i]}
                    loadingBlock={loadingBlock}
                    onUpdateCell={updateCell}
                    onAiGenerate={handleAiGenerate}
                  />
                ))}
              </div>
              {/* Removed Footer */}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full max-w-3xl mb-4 z-30">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-slate-100 flex gap-2 items-center">
            <input
              type="text"
              value={cheerMsg}
              onChange={(e) => setCheerMsg(e.target.value)}
              placeholder="동료에게 응원 한마디!"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all text-slate-700"
              onKeyDown={(e) => e.key === 'Enter' && addCheerMessage()}
            />
            <input
              type="text"
              value={cheerAuthor}
              onChange={(e) => setCheerAuthor(e.target.value)}
              placeholder="작성자"
              className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 transition-all text-slate-700 text-center"
              onKeyDown={(e) => e.key === 'Enter' && addCheerMessage()}
            />
            <button
              onClick={addCheerMessage}
              className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;