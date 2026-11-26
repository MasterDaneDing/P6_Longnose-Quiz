import { FeelingId, JobRoleId } from '../../data/quizSpecData';

export function MrLongnoseInterviewerSvg({ className = 'w-44 h-52' }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" className={className} fill="none" aria-label="Mr. Longnose holding a microphone">
      {/* Yellow comic sunburst */}
      <circle cx="90" cy="95" r="72" fill="#FEF08A" opacity="0.65" />
      {/* Legs */}
      <rect x="64" y="178" width="18" height="44" rx="4" fill="#1D4ED8" stroke="#18181B" strokeWidth="3" />
      <rect x="92" y="178" width="18" height="44" rx="4" fill="#1D4ED8" stroke="#18181B" strokeWidth="3" />
      <ellipse cx="71" cy="224" rx="12" ry="6" fill="#451A03" stroke="#18181B" strokeWidth="2.5" />
      <ellipse cx="103" cy="224" rx="12" ry="6" fill="#451A03" stroke="#18181B" strokeWidth="2.5" />

      {/* Torso - Blue Suit */}
      <path d="M52 108 C52 96 122 96 122 108 L118 182 L56 182 Z" fill="#2563EB" stroke="#18181B" strokeWidth="3" />
      {/* White shirt V */}
      <polygon points="75,102 99,102 87,154" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
      {/* Red Polka-dot tie */}
      <path d="M84 106 L90 106 L94 148 L87 156 L80 148 Z" fill="#DC2626" stroke="#18181B" strokeWidth="2" />
      <circle cx="87" cy="118" r="2" fill="#18181B" />
      <circle cx="85" cy="130" r="2" fill="#18181B" />
      <circle cx="89" cy="140" r="2" fill="#18181B" />

      {/* Left arm on hip */}
      <path d="M54 114 L34 144 L54 156" stroke="#2563EB" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M54 114 L34 144 L54 156" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Right arm holding retro silver microphone */}
      <path d="M116 116 L142 138 L146 114" stroke="#2563EB" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M116 116 L142 138 L146 114" stroke="#18181B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Hand */}
      <circle cx="146" cy="112" r="8" fill="#FDBA74" stroke="#18181B" strokeWidth="2.5" />
      {/* Silver Retro Mic */}
      <rect x="142" y="96" width="8" height="26" rx="2" fill="#94A3B8" stroke="#18181B" strokeWidth="2" />
      <rect x="136" y="72" width="20" height="26" rx="9" fill="#CBD5E1" stroke="#18181B" strokeWidth="2.5" />
      <line x1="138" y1="80" x2="154" y2="80" stroke="#18181B" strokeWidth="2" />
      <line x1="138" y1="86" x2="154" y2="86" stroke="#18181B" strokeWidth="2" />
      <line x1="138" y1="92" x2="154" y2="92" stroke="#18181B" strokeWidth="2" />

      {/* 80s Brown Mullet Hair */}
      <path d="M58 58 C50 76 52 94 60 100 L72 96 L70 55 Z" fill="#78350F" stroke="#18181B" strokeWidth="2.5" />
      {/* Head */}
      <ellipse cx="86" cy="66" rx="26" ry="30" fill="#FDBA74" stroke="#18181B" strokeWidth="3" />
      {/* Top Mullet Hair */}
      <path d="M58 58 C56 32 106 24 114 48 C100 42 74 44 64 60 Z" fill="#78350F" stroke="#18181B" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="80" cy="58" r="3.5" fill="#18181B" />
      <circle cx="98" cy="58" r="3.5" fill="#18181B" />
      <path d="M74 49 Q80 46 86 49" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M92 49 Q98 46 104 49" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Smile */}
      <path d="M78 78 Q90 88 102 77" stroke="#18181B" strokeWidth="3" strokeLinecap="round" fill="#FFFFFF" />
      {/* Comically Long Horizontal Nose! */}
      <path
        d="M92 63 L198 63 C206 63 206 75 198 75 L92 74 Z"
        fill="#FCA5A5"
        stroke="#18181B"
        strokeWidth="3"
      />
      <path d="M110 67 L186 67" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}

interface DraggableCharProps {
  role: JobRoleId;
  shocked?: boolean;
  className?: string;
}

export function DraggableJobCharacterSvg({ role, shocked = false, className = 'w-24 h-28' }: DraggableCharProps) {
  const palette: Record<JobRoleId, { outfit: string; accent: string; skin: string; hair: string }> = {
    lawyer: { outfit: '#475569', accent: '#1D4ED8', skin: '#FED7AA', hair: '#94A3B8' },
    doctor: { outfit: '#F8FAFC', accent: '#0D9488', skin: '#FDBA74', hair: '#451A03' },
    pilot: { outfit: '#1E293B', accent: '#F59E0B', skin: '#FED7AA', hair: '#78350F' },
    fashion_designer: { outfit: '#7C3AED', accent: '#F472B6', skin: '#FDE68A', hair: '#18181B' },
    actress: { outfit: '#E11D48', accent: '#FBBF24', skin: '#FED7AA', hair: '#D97706' },
    vet: { outfit: '#059669', accent: '#ECFEFF', skin: '#FDBA74', hair: '#78350F' },
    astronaut: { outfit: '#E2E8F0', accent: '#DC2626', skin: '#FED7AA', hair: '#451A03' },
  };
  const c = palette[role];

  return (
    <svg
      viewBox="0 0 120 135"
      className={`${className} ${shocked ? 'animate-comic-wobble' : 'animate-comic-idle'}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Shocked comic bursts when dragging */}
      {shocked && (
        <g>
          <path d="M12 22 L24 28 M8 36 L22 36 M106 20 L95 28 M112 36 L98 36" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          <text x="88" y="18" fill="#DC2626" fontSize="16" fontWeight="900">!</text>
        </g>
      )}

      {/* Left Leg */}
      <g className={shocked ? 'animate-flail-leg-l' : ''}>
        <rect x="42" y="90" width="12" height="32" rx="4" fill={role === 'actress' ? c.skin : '#1E293B'} stroke="#18181B" strokeWidth="2.5" />
        <ellipse cx="47" cy="124" rx="8" ry="4.5" fill="#18181B" />
      </g>

      {/* Right Leg */}
      <g className={shocked ? 'animate-flail-leg-r' : ''}>
        <rect x="64" y="90" width="12" height="32" rx="4" fill={role === 'actress' ? c.skin : '#1E293B'} stroke="#18181B" strokeWidth="2.5" />
        <ellipse cx="71" cy="124" rx="8" ry="4.5" fill="#18181B" />
      </g>

      {/* Left Arm */}
      <g className={shocked ? 'animate-flail-arm-l' : ''}>
        <path d="M38 56 L18 74" stroke={c.outfit} strokeWidth="10" strokeLinecap="round" />
        <path d="M38 56 L18 74" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="17" cy="76" r="5" fill={c.skin} stroke="#18181B" strokeWidth="2" />
        {role === 'lawyer' && (
          <rect x="6" y="78" width="20" height="14" rx="2" fill="#78350F" stroke="#18181B" strokeWidth="2" />
        )}
        {role === 'fashion_designer' && (
          <path d="M10 68 Q18 82 24 72" stroke="#FACC15" strokeWidth="3" fill="none" />
        )}
      </g>

      {/* Right Arm */}
      <g className={shocked ? 'animate-flail-arm-r' : ''}>
        <path d="M82 56 L102 74" stroke={c.outfit} strokeWidth="10" strokeLinecap="round" />
        <path d="M82 56 L102 74" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="103" cy="76" r="5" fill={c.skin} stroke="#18181B" strokeWidth="2" />
      </g>

      {/* Body / Outfit */}
      {role === 'actress' ? (
        <path d="M40 50 L80 50 L88 100 L32 100 Z" fill={c.outfit} stroke="#18181B" strokeWidth="2.5" />
      ) : (
        <rect x="38" y="50" width="44" height="44" rx="8" fill={c.outfit} stroke="#18181B" strokeWidth="2.5" />
      )}

      {/* Role details on torso */}
      {role === 'lawyer' && (
        <>
          <polygon points="54,50 66,50 60,72" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.5" />
          <line x1="60" y1="53" x2="60" y2="76" stroke={c.accent} strokeWidth="4" />
        </>
      )}
      {role === 'doctor' && (
        <>
          <path d="M48 52 C48 68 72 68 72 52" stroke="#0D9488" strokeWidth="3" fill="none" />
          <circle cx="60" cy="68" r="4" fill="#94A3B8" stroke="#18181B" strokeWidth="1.5" />
          <rect x="65" y="68" width="10" height="12" rx="1" fill="#E2E8F0" stroke="#18181B" strokeWidth="1.5" />
        </>
      )}
      {role === 'pilot' && (
        <>
          <path d="M46 60 L74 60" stroke="#F59E0B" strokeWidth="3" />
          <circle cx="60" cy="60" r="3.5" fill="#FBBF24" stroke="#18181B" strokeWidth="1.5" />
          <line x1="60" y1="50" x2="60" y2="94" stroke="#0F172A" strokeWidth="2" />
        </>
      )}
      {role === 'fashion_designer' && (
        <>
          <path d="M44 50 Q60 66 76 50" stroke="#F472B6" strokeWidth="5" fill="none" />
          <circle cx="52" cy="70" r="3" fill="#FBBF24" />
          <circle cx="68" cy="76" r="3" fill="#38BDF8" />
        </>
      )}
      {role === 'astronaut' && (
        <>
          <rect x="49" y="58" width="22" height="16" rx="2" fill="#CBD5E1" stroke="#18181B" strokeWidth="2" />
          <circle cx="55" cy="66" r="2.5" fill="#DC2626" />
          <circle cx="65" cy="66" r="2.5" fill="#2563EB" />
        </>
      )}
      {role === 'vet' && (
        /* Cute cat held by the vet! */
        <g transform={shocked ? 'translate(0, -4)' : ''}>
          <ellipse cx="64" cy="74" rx="14" ry="11" fill="#FB923C" stroke="#18181B" strokeWidth="2" />
          <circle cx="74" cy="64" r="9" fill="#FB923C" stroke="#18181B" strokeWidth="2" />
          <polygon points="67,58 70,49 74,56" fill="#FB923C" stroke="#18181B" strokeWidth="1.8" />
          <polygon points="75,56 79,49 82,58" fill="#FB923C" stroke="#18181B" strokeWidth="1.8" />
          <circle cx="71" cy="63" r="1.5" fill="#18181B" />
          <circle cx="77" cy="63" r="1.5" fill="#18181B" />
          <path d="M72 67 Q74 69 76 67" stroke="#18181B" strokeWidth="1.5" />
          <path d="M50 72 Q42 64 46 58" stroke="#FB923C" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}

      {/* Head */}
      <circle cx="60" cy="30" r="19" fill={c.skin} stroke="#18181B" strokeWidth="2.5" />

      {/* Hair / Hat */}
      {role === 'pilot' && (
        <>
          <path d="M39 24 C40 10 80 10 81 24 Z" fill="#1E293B" stroke="#18181B" strokeWidth="2" />
          <rect x="41" y="21" width="38" height="5" rx="2" fill="#F59E0B" stroke="#18181B" strokeWidth="1.5" />
        </>
      )}
      {role === 'astronaut' && (
        <circle cx="60" cy="30" r="24" fill="#93C5FD" fillOpacity="0.28" stroke="#18181B" strokeWidth="2.5" />
      )}
      {role === 'actress' && (
        <path d="M39 28 C38 8 82 8 81 28 C76 16 44 16 39 28 Z" fill={c.hair} stroke="#18181B" strokeWidth="2" />
      )}
      {role !== 'pilot' && role !== 'actress' && (
        <path d="M42 24 C44 10 76 10 78 24 C70 18 50 18 42 24 Z" fill={c.hair} stroke="#18181B" strokeWidth="2" />
      )}

      {/* Facial Expression: Normal vs Shocked when dragged */}
      {shocked ? (
        <>
          <circle cx="53" cy="29" r="4.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.8" />
          <circle cx="67" cy="29" r="4.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="1.8" />
          <circle cx="53" cy="29" r="1.5" fill="#18181B" />
          <circle cx="67" cy="29" r="1.5" fill="#18181B" />
          <ellipse cx="60" cy="40" rx="5" ry="6" fill="#991B1B" stroke="#18181B" strokeWidth="2" />
        </>
      ) : (
        <>
          <circle cx="53" cy="29" r="2.3" fill="#18181B" />
          <circle cx="67" cy="29" r="2.3" fill="#18181B" />
          <path d="M54 38 Q60 43 66 38" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function MrLongnoseFeelingFaceSvg({
  feeling,
  className = 'w-64 h-64',
}: {
  feeling: FeelingId;
  className?: string;
}) {
  const bgColors: Record<FeelingId, string> = {
    happy: '#FEF9C3',
    sad: '#DBEAFE',
    nervous: '#EDE9FE',
    afraid: '#FEE2E2',
    angry: '#FECACA',
    excited: '#FEF08A',
  };

  return (
    <svg viewBox="0 0 240 220" className={className} fill="none" aria-label={`Mr. Longnose looking ${feeling}`}>
      <rect x="6" y="6" width="228" height="208" rx="20" fill={bgColors[feeling]} stroke="#18181B" strokeWidth="3.5" />

      {/* Feeling comic FX */}
      {feeling === 'excited' && (
        <g stroke="#EA580C" strokeWidth="3" strokeLinecap="round">
          <line x1="28" y1="36" x2="46" y2="48" />
          <line x1="22" y1="60" x2="40" y2="64" />
          <line x1="194" y1="34" x2="176" y2="46" />
          <line x1="204" y1="58" x2="184" y2="62" />
        </g>
      )}
      {feeling === 'angry' && (
        <g>
          <path d="M180 28 L190 38 M190 28 L180 38" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 34 Q42 22 48 34" stroke="#DC2626" strokeWidth="3" fill="none" />
        </g>
      )}
      {feeling === 'afraid' && (
        <g stroke="#18181B" strokeWidth="2.5" strokeLinecap="round">
          <path d="M28 50 Q22 65 28 80" />
          <path d="M36 52 Q30 65 36 78" />
        </g>
      )}

      {/* Suit shoulders */}
      <path d="M40 214 C44 176 164 176 168 214" fill="#2563EB" stroke="#18181B" strokeWidth="3" />
      <polygon points="86,178 122,178 104,214" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
      <polygon points="100,180 108,180 112,214 96,214" fill="#DC2626" stroke="#18181B" strokeWidth="2" />
      <circle cx="104" cy="194" r="2.2" fill="#18181B" />

      {/* 80s Mullet back */}
      <path
        d={
          feeling === 'afraid'
            ? 'M48 80 C34 115 40 155 58 172 L76 162 L72 74 Z'
            : 'M52 84 C44 118 48 152 62 168 L78 160 L74 80 Z'
        }
        fill="#78350F"
        stroke="#18181B"
        strokeWidth="3"
      />

      {/* Face */}
      <ellipse cx="104" cy="108" rx="48" ry="56" fill="#FDBA74" stroke="#18181B" strokeWidth="3.5" />

      {/* Hair top */}
      <path
        d={
          feeling === 'afraid'
            ? 'M52 84 C46 38 140 24 152 68 C132 54 78 56 60 88 Z'
            : 'M56 84 C54 44 136 32 148 70 C128 58 80 60 62 88 Z'
        }
        fill="#78350F"
        stroke="#18181B"
        strokeWidth="3"
      />

      {/* Eyebrows & Eyes */}
      {feeling === 'happy' && (
        <>
          <path d="M78 78 Q88 70 98 78" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M112 78 Q122 70 132 78" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="88" cy="90" r="5" fill="#18181B" />
          <circle cx="122" cy="90" r="5" fill="#18181B" />
          <ellipse cx="74" cy="106" rx="7" ry="4" fill="#FB7185" opacity="0.5" />
        </>
      )}

      {feeling === 'excited' && (
        <>
          <path d="M76 74 Q88 64 100 74" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M110 74 Q122 64 134 74" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="88" cy="90" r="9" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          <circle cx="122" cy="90" r="9" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          <circle cx="89" cy="89" r="4.5" fill="#18181B" />
          <circle cx="123" cy="89" r="4.5" fill="#18181B" />
          <circle cx="91" cy="87" r="1.8" fill="#FFFFFF" />
          <circle cx="125" cy="87" r="1.8" fill="#FFFFFF" />
        </>
      )}

      {feeling === 'sad' && (
        <>
          <path d="M76 82 Q88 76 98 72" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M112 72 Q122 76 134 82" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="88" cy="92" rx="4.5" ry="6" fill="#18181B" />
          <ellipse cx="122" cy="92" rx="4.5" ry="6" fill="#18181B" />
          {/* Teardrop */}
          <path d="M80 102 C76 110 76 116 80 116 C84 116 84 110 80 102 Z" fill="#38BDF8" stroke="#18181B" strokeWidth="1.5" />
        </>
      )}

      {feeling === 'nervous' && (
        <>
          <path d="M76 80 Q88 73 98 78" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M112 78 Q122 73 134 80" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="88" cy="91" r="7.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.2" />
          <circle cx="122" cy="91" r="7.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.2" />
          <circle cx="90" cy="91" r="2.8" fill="#18181B" />
          <circle cx="124" cy="91" r="2.8" fill="#18181B" />
          {/* Sweat drop */}
          <path d="M64 76 C60 84 60 90 64 90 C68 90 68 84 64 76 Z" fill="#60A5FA" stroke="#18181B" strokeWidth="1.5" />
        </>
      )}

      {feeling === 'afraid' && (
        <>
          <path d="M74 72 Q86 64 98 72" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M112 72 Q124 64 136 72" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="88" cy="90" r="10.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          <circle cx="122" cy="90" r="10.5" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          <circle cx="88" cy="90" r="2.5" fill="#18181B" />
          <circle cx="122" cy="90" r="2.5" fill="#18181B" />
        </>
      )}

      {feeling === 'angry' && (
        <>
          <path d="M74 76 L100 88" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M136 76 L110 88" stroke="#18181B" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="88" cy="93" r="5" fill="#18181B" />
          <circle cx="122" cy="93" r="5" fill="#18181B" />
        </>
      )}

      {/* Mouth */}
      {feeling === 'happy' && (
        <path d="M84 128 Q106 148 128 126 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
      )}
      {feeling === 'excited' && (
        <path d="M84 126 Q106 156 128 126 Z" fill="#991B1B" stroke="#18181B" strokeWidth="3" />
      )}
      {feeling === 'sad' && (
        <path d="M86 142 Q106 124 126 142" stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
      )}
      {feeling === 'nervous' && (
        <path d="M84 134 Q92 128 100 134 Q108 140 116 134 Q124 128 130 134" stroke="#18181B" strokeWidth="3.2" strokeLinecap="round" />
      )}
      {feeling === 'afraid' && (
        <ellipse cx="106" cy="136" rx="14" ry="16" fill="#7F1D1D" stroke="#18181B" strokeWidth="3" />
      )}
      {feeling === 'angry' && (
        <rect x="86" y="128" width="40" height="14" rx="4" fill="#FFFFFF" stroke="#18181B" strokeWidth="3" />
      )}
      {feeling === 'angry' && (
        <line x1="86" y1="135" x2="126" y2="135" stroke="#18181B" strokeWidth="2" />
      )}

      {/* Signature Long Nose */}
      <path
        d="M110 98 L226 98 C234 98 234 114 226 114 L110 112 Z"
        fill="#FCA5A5"
        stroke="#18181B"
        strokeWidth="3.5"
      />
      <path d="M128 103 L214 103" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
    </svg>
  );
}
