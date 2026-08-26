/**
 * ============================================================================
 * THE SWAMP ARCHIVE - CENTRAL CONTENT & TRANSLATION STORE
 * ============================================================================
 * 
 * INSTRUCTIONS FOR NON-PROGRAMMERS / EDITORS:
 * ----------------------------------------------------------------------------
 * To edit copy, update images, or change video paths, simply modify the text
 * inside the quotes below for either 'en' (English) or 'ar' (Arabic).
 * 
 * - Do NOT change key names (e.g. heroTitle, stats, timeline).
 * - Image paths are relative to the project root (served at /images/…):
 *     hero.heroImage         → /images/referee-orange.jpg  (orange referee, main hero)
 *     hero.heroImageSecondary → /images/referee-gold.jpg   (gold referee, reveal asset)
 * - Video paths can be a direct MP4 link or sample web video.
 * ============================================================================
 */

export const CONTENT = {
  // BRAND & GLOBAL NAVIGATION
  siteName: {
    en: "THE SWAMP ARCHIVE",
    ar: "أرشيف المستنقع"
  },
  tagline: {
    en: "THE 2022 RELEGATION CASE FILES",
    ar: "ملفات قضية الهبوط التاريخية 2022"
  },

  // DISCLAIMER (MANDATORY IN BOTH LANGUAGES)
  disclaimer: {
    en: "Unofficial fan-made project, just for laughs.",
    ar: "مشروع للتسلية من صنع المعجبين وغير تابع لأي جهة رسمية."
  },

  // NAV MENU LINKS
  nav: {
    home: { en: "Home", ar: "الرئيسية" },
    archive: { en: "The Archive", ar: "السجلات الأرشيفية" },
    tales: { en: "Your Relegated Tales", ar: "سوالفكم الهابطة" },
    courtroom: { en: "The Courtroom", ar: "قاعة المحكمة" },
    arcade: { en: "Yelo Arcade", ar: "أركيد يلو" },
    about: { en: "About & Contact", ar: "عن الأرشيف والتواصل" }
  },

  // HERO SECTION (HOME PAGE)
  hero: {
    badge: {
      en: "DOSSIER #2022-YELO • CONFIDENTIAL & JUST FOR FUN",
      ar: "ملف رقم 2022-يلو • سري وللتسلية فقط"
    },
    title: {
      en: "THE FINAL WHISTLE",
      ar: "صفّارة النهاية"
    },
    subtitle: {
      en: "An editorial tribute to the most dramatic plot twist in Gulf football history. When titan status met yellow card reality.",
      ar: "وثائقي مضحك يخلّد الدراما الكروية الأكبر في تاريخ الكرة. عندما اصطدم الكبرياء الكروي بواقع دوري يلو."
    },
    primaryCta: {
      en: "ENTER THE ARCHIVE",
      ar: "تصفح الأرشيف الآن"
    },
    secondaryCta: {
      en: "WATCH FINAL REPLAY",
      ar: "شاهد إعادة اللحظة الأخيرة"
    },
    // -----------------------------------------------------------------------
    // MEDIA PATHS — edit these to swap images without touching the HTML/JS
    // -----------------------------------------------------------------------
    // PRIMARY HERO: the orange referee shown in the archive frame on Home page
    heroImage: "/images/referee-orange.jpg",
    // SECONDARY (REVEAL ASSET): gold referee, reserved for a future reveal
    // interaction. Not yet rendered in the layout — path stored here for
    // when the reveal effect is implemented in a later phase.
    heroImageSecondary: "/images/referee-gold.jpg",
    imageCaption: {
      en: "EXHIBIT A: Referee Whistle Moment (Matchday 30, June 2022)",
      ar: "مستند (أ): لحظة الصافرة الحاسمة (الجولة 30 - يونيو 2022)"
    },
    fileIdLabel: { en: "FILE ID: REF-2022-MATCH30", ar: "رقم الملف: REF-2022-MATCH30" },
    statusLabel: { en: "STATUS: CLASSIFIED", ar: "الحالة: سري" },
    evidenceStamp: { en: "EVIDENCE #2022", ar: "دليل #2022" }
  },

  // BREAKING NEWS TICKER (SATIRICAL HEADLINE MARQUEE)
  tickerSection: {
    items: [
      {
        en: "BREAKING: Local calculator sales spike 400% in final week of May 2022",
        ar: "عاجل: مبيعات الآلات الحاسبة ترتفع 400% في الأسبوع الأخير من مايو 2022"
      },
      {
        en: "SOURCES CONFIRM: Crossbar filed a formal noise complaint after 19 impacts",
        ar: "مصادر مؤكدة: العارضة تقدمت بشكوى رسمية بعد 19 ارتطاماً"
      },
      {
        en: "EXCLUSIVE: VAR room reportedly ordered extra coffee during Matchday 30",
        ar: "حصري: غرفة الفار طلبت قهوة إضافية خلال الجولة 30"
      },
      {
        en: "ARCHIVE UPDATE: 14,000+ meme edits now preserved for historical record",
        ar: "تحديث الأرشيف: أكثر من 14,000 مقطع مضحك محفوظ للتاريخ"
      },
      {
        en: "FAN COUNCIL RULES: 90th minute officially the longest minute in Gulf football",
        ar: "مجلس الجماهير يقرر: الدقيقة 90 هي أطول دقيقة في تاريخ الكرة الخليجية"
      }
    ]
  },

  // VIDEO SECTION
  videoSection: {
    title: {
      en: "WHEN THE MATCH ENDED, THE FORTRESS FELL",
      ar: "عندما انتهت المباراة، هُدمت القلعة"
    },
    subtitle: {
      en: "A clear video of the match's ending, with high-quality commentary audio.",
      ar: "فيديو واضح لإنهاء المباراة وصوت تعليق عالي الجودة."
    },
    videoUrl: "/videos/DLVideo.mp4",
    posterImage: "/images/referee-orange.jpg",
    loadingText: {
      en: "Loading archive tape from 2022 vault...",
      ar: "جاري تحميل الشريط الأرشيفي من خزينة 2022..."
    },
    videoBadge: {
      en: "END-OF-MATCH COMMENTARY FOOTAGE",
      ar: "لقطات لتعليق نهاية المباراة"
    }
  },

  // SATIRICAL STATISTICS CARDS
  statsSection: {
    badge: {
      en: "NUMERICAL AUDIT",
      ar: "التدقيق الرقمي"
    },
    title: {
      en: "ARCHIVAL METRICS & NUMBERS",
      ar: "أرقام وإحصائيات الأرشيف"
    },
    subtitle: {
      en: "Sports 'evidence' some people say is actually real. (Comedically speaking.)",
      ar: "أدلة رياضية يُقال عند البعض انها حقيقية. (كوميدياً)"
    },
    items: [
      {
        id: "stat-1",
        number: "4,820 min",
        label: {
          en: "Spent in VAR Dramatic Pauses",
          ar: "دقائق ضاعت في التفكير أمام شاشة الفـار"
        },
        detail: {
          en: "Equivalent to 53 full regular feature films of pure suspense.",
          ar: "تعدل 53 فيلماً سينمائياً من التشويق والأعصاب المتوترة."
        }
      },
      {
        id: "stat-2",
        number: "87.4%",
        label: {
          en: "Excuses Involving 'Unlucky Postwork'",
          ar: "أعذار تعزو الخسارة لـ 'سوء الحظ والعارضة'"
        },
        detail: {
          en: "Officially verified by post-match press conference auditors.",
          ar: "مثبتة رسمياً في المؤتمرات الصحفية بعد كل مباراة."
        }
      },
      {
        id: "stat-3",
        number: "1,204",
        label: {
          en: "Liters of Fan Tears Conserved",
          ar: "لترات من دموع الحسرة التي جرى توثيقها"
        },
        detail: {
          en: "Stored in digital vials inside the archives of sports history.",
          ar: "محفوظة في قارورات رقمية داخل سجلات التاريخ الكروي."
        }
      },
      {
        id: "stat-4",
        number: "#1",
        label: {
          en: "Currently the Top Trending Topic on TikTok",
          ar: "الترند الأول على تيك توك حالياً"
        },
        detail: {
          en: "Over 14,000 meme edits created with dramatic orchestral soundtracks.",
          ar: "أكثر من 14,000 مقطع بموسيقى درامية حزينة."
        }
      }
    ]
  },

  // VISUAL TIMELINE SECTION
  timelineSection: {
    badge: {
      en: "SEASON ARC",
      ar: "مسار الموسم"
    },
    title: {
      en: "CHRONOLOGY OF DOWNTURN",
      ar: "الجدول الزمني للانهيار الدرامي"
    },
    subtitle: {
      en: "From high expectations in autumn to Yelo League registration in summer.",
      ar: "من الطموحات العالية في الخريف إلى التسجيل الرسمي في يلو في الصيف."
    },
    events: [
      {
        date: "SEP 2021",
        title: {
          en: "The Golden Promises",
          ar: "الوعود الوردية وبداية الموسم"
        },
        desc: {
          en: "High optimism, expensive jersey reveals, and claims that 'this is our champion year'.",
          ar: "تفاؤل عارم، وإطلاق القمصان الجديدة، وتأكيدات بأن 'هذا الموسم موسم المنصات'."
        },
        tag: { en: "OPTIMISM", ar: "تفاؤل" }
      },
      {
        date: "JAN 2022",
        title: {
          en: "The VAR Conspiracy Theory",
          ar: "نظرية مؤامرة التقنية والفار"
        },
        desc: {
          en: "First mid-season panic. Red cards begin accumulating at unprecedented velocity.",
          ar: "بداية القلق وسلسلة التعادلات، مع تحميل تقنية الفار مسؤولية ضربات الجزاء."
        },
        tag: { en: "TURBULENCE", ar: "اضطراب" }
      },
      {
        date: "MAY 2022",
        title: {
          en: "Calculators Out Across the City",
          ar: "مرحلة الحاسبة وحساب الاحتمالات"
        },
        desc: {
          en: "Supporters mathematically calculate 48 permutations needed to avoid 14th place.",
          ar: "الجماهير تستخدم الآلات الحاسبة لحساب 48 سيناريو معقد للهروب من المركز 14."
        },
        tag: { en: "MATH MODE", ar: "حسابات معقدة" },
        satireTag: { en: "FICTIONAL ARCHIVE ENTRY", ar: "قيد أرشيفي خيالي" }
      },
      {
        date: "JUN 27, 2022",
        title: {
          en: "The Final Whistle & Arrival in Yelo",
          ar: "الصفارة الأخيرة والترسيم في يلو"
        },
        desc: {
          en: "0-0 draw on Matchday 30 seal fate. The archive is officially opened.",
          ar: "تعادل 0-0 في الجولة الأخيرة يحسم المصير. والأرشيف يفتح أبوابه رسمياً للتاريخ."
        },
        tag: { en: "FINALITY", ar: "النهاية" }
      }
    ]
  },

  // "YOUR RELEGATED TALES" PAGE — OPEN FAN STORY BOARD (BROWSER-LOCAL FOR NOW)
  talesPage: {
    title: { en: "YOUR RELEGATED TALES", ar: "سوالفكم الهابطة" },
    subtitle: {
      en: "Write your name and drop your funniest 2022 tale. (Write whatever you want — it doesn't have to be true.)",
      ar: "اكتب اسمك، وحط أطرف سالفة عندك من موسم 2022. (اكتب اللي يجيك في بالك حتى لو مو حقيقية.)"
    },
    addTaleTitle: { en: "ADD YOUR TALE", ar: "أضف سالفتك" },
    namePlaceholder: { en: "Your Name / Alias", ar: "اسمك / لقبك" },
    taleTextPlaceholder: { en: "Write your tale here...", ar: "اكتب سالفتك هنا..." },
    publishButton: { en: "PUBLISH TALE", ar: "انشر السالفة" },
    listTitle: { en: "PUBLISHED TALES", ar: "السوالف المنشورة" },
    emptyState: { en: "No tales yet — drop us one, doesn't even have to be about Al-Ahli.", ar: "مافيه سوالف للحين - اهبد لنا سالفة ترا مو لازم عن الأهلي." },
    byLabel: { en: "by", ar: "بواسطة" },
    votedNote: { en: "Thanks for voting.", ar: "شكراً على تصويتك." },
    editButton: { en: "EDIT", ar: "تعديل" },
    deleteButton: { en: "DELETE", ar: "حذف" },
    saveButton: { en: "SAVE", ar: "حفظ" },
    cancelButton: { en: "CANCEL", ar: "إلغاء" },
    deleteConfirm: { en: "Delete this tale? This cannot be undone.", ar: "تحذف هذي السالفة؟ ما تقدر ترجعها بعدين." }
  },

  // THE ARCHIVE PAGE CONTENT
  archivePage: {
    badge: {
      en: "EVIDENCE DATABASE",
      ar: "قاعدة بيانات الأدلة"
    },
    title: {
      en: "CONFIDENTIAL EVIDENCE VAULT",
      ar: "خزينة الأدلة والمستندات السرية"
    },
    subtitle: {
      en: "Browse inspectable records, match sheets, VAR screen captures, and ref audio logs.",
      ar: "تصفح الأدلة والمستندات المحفوظة، صور الفار، ومحاضر المباريات التاريخية."
    },
    filterAll: { en: "ALL EVIDENCE", ar: "جميع الأدلة" },
    filterVar: { en: "VAR DISPUTES", ar: "قرارات الفار" },
    filterAudio: { en: "AUDIO TAPES", ar: "تسجيلات الصوت" },
    filterTactics: { en: "TACTICAL ACCIDENTS", ar: "الكوارث التكتيكية" },
    evidenceUi: {
      audioLabel: { en: "AUDIO EVIDENCE PLAYBACK", ar: "تشغيل الدليل الصوتي" },
      revealButton: { en: "REVEAL THE DANGEROUS TACTIC", ar: "كشف التكتيك الخطير" },
      hideButton: { en: "HIDE THE TACTIC", ar: "إخفاء التكتيك" },
      revealSecretButton: { en: "REVEAL THE CLASSIFIED DETAIL", ar: "كشف المعلومة السرية" },
      hideSecretButton: { en: "HIDE THE DETAIL", ar: "إخفاء المعلومة" },
      dateArchivedLabel: { en: "DATE ARCHIVED", ar: "تاريخ الأرشفة" },
      statusLabel: { en: "STATUS: VERIFIED", ar: "الحالة: موثّق" }
    },
    items: [
      {
        id: "ev-1",
        category: "VAR DISPUTES",
        categoryAr: "قرارات الفار",
        title: { en: "Exhibit #01: The Referee's Final Verdict", ar: "مستند 01: الحكم الأخير من الحكم" },
        desc: {
          en: "Archived portrait of the whistle-blow that closed the season. One raised arm, one long blast, and an entire year of hope filed away forever.",
          ar: "صورة أرشيفية لصافرة النهاية التي أغلقت ملف الموسم. ذراع مرفوعة، صفارة واحدة طويلة، وموسم كامل من الأمل تم أرشفته إلى الأبد."
        },
        image: "/images/referee-orange.jpg",
        date: "June 2022",
        satireTag: { en: "FICTIONAL ARCHIVE ENTRY", ar: "قيد أرشيفي خيالي" },
        secretNote: {
          en: "Classified detail: the referee reportedly practiced this exact whistle-blow motion 40 times in a hotel mirror the night before, according to nobody who was actually there.",
          ar: "معلومة سرية: الحكم يُقال إنه تمرّن على حركة الصافرة هذي بالضبط 40 مرة أمام مرآة الفندق ليلة قبل المباراة، حسب رواية محد كان حاضر فعلاً."
        }
      },
      {
        id: "ev-2",
        category: "TACTICAL ACCIDENTS",
        categoryAr: "الكوارث التكتيكية",
        title: { en: "Exhibit #02: The 1-1-8 All-Out Emergency Setup", ar: "مستند 02: خطة 1-1-8 الهجومية اليائسة" },
        desc: {
          en: "Chalkboard whiteboard backup created in the 88th minute of matchday 29 when panic set in.",
          ar: "اللوحة التكتيكية التي رُسمت في الدقيقة 88 بعد فقدان الأمل في التكتيك العادي."
        },
        image: "/images/ev-2-tactic.jpg",
        date: "May 2022",
        satireTag: { en: "FICTIONAL ARCHIVE ENTRY", ar: "قيد أرشيفي خيالي" },
        secretTactic: {
          en: "Declassified breakdown: 1 goalkeeper who has given up, 1 defender pretending to understand the plan, and 8 players sprinting forward at once hoping the ball just goes in by peer pressure. Analysts call it 'organized panic.' The archive calls it Tuesday.",
          ar: "التحليل المسرّب: حارس مرمى فقد الأمل، مدافع واحد يتظاهر بفهم الخطة، و8 لاعبين يركضون للأمام دفعة واحدة على أمل أن تدخل الكرة بالإجماع. المحللون يسمونها 'فوضى منظمة'. والأرشيف يسميها يوم عادي في الموسم."
        }
      },
      {
        id: "ev-3",
        category: "AUDIO TAPES",
        categoryAr: "تسجيلات الصوت",
        title: { en: "Exhibit #03: Ref Whistle Decibel Audit", ar: "مستند 03: قياس صوت صافرة النهاية" },
        desc: {
          en: "Sound wave transcript registering 114 dB at the pitch boundary during match blow-off.",
          ar: "ترددات الموجة الصوتية للصافرة التي بلغت 114 ديسبل وأنهت حقبة كاملة."
        },
        image: "/images/ev-3-whistle.png",
        date: "June 2022",
        satireTag: { en: "FICTIONAL ARCHIVE ENTRY", ar: "قيد أرشيفي خيالي" },
        audio: "/audio/telegram_audio.mp3",
        audioCaption: {
          en: "Recovered field recording — peak level 114 dB at final whistle.",
          ar: "تسجيل ميداني تم استرجاعه — أعلى مستوى صوت 114 ديسبل عند صافرة النهاية."
        }
      }
    ]
  },

  // THE COURTROOM PAGE CONTENT
  courtroomPage: {
    badge: {
      en: "ARCHIVE TRIBUNAL",
      ar: "محكمة الأرشيف"
    },
    title: {
      en: "THE RELEGATION APPEAL HEARING",
      ar: "جلسة الاستئناف لمحكمة الأرشيف"
    },
    subtitle: {
      en: "Examine legal claims, review defense arguments, and cast your unofficial verdict.",
      ar: "استعرض حجج الدفاع، تفحص ملفات القضية، وصوت على الحكم غير الرسمي."
    },
    gavelImage: "/images/courtroom_gavel.jpg",
    recordingLabel: { en: "COURTROOM RECORDING", ar: "تسجيل قاعة المحكمة" },
    exhibitLabel: { en: "EXHIBIT #GAVEL-01", ar: "مستند #المطرقة-01" },
    confidentialStamp: { en: "CONFIDENTIAL", ar: "سري" },
    presidingText: {
      en: "Presiding: Official Fan Archival Tribunal. Exhibits below are submitted for comedic evaluation.",
      ar: "برئاسة: هيئة الأرشيف الجماهيري الرسمية. المستندات أدناه مقدّمة للتقييم الكوميدي."
    },
    cases: [
      {
        caseTitle: {
          en: "CASE NO. 2022-YELO-001: THE FANS vs. DRAMATIC REALITY",
          ar: "القضية رقم 2022-يلو-001: الجماهير ضد الواقع الدرامي"
        },
        claims: [
          {
            num: "CLAIM 01",
            title: { en: "The Pitch Was 3 Meters Too Wide", ar: "الملعب كان أعرض بـ 3 أمتار من المعتاد" },
            desc: {
              en: "Defense claims space physics were manipulated during away matches.",
              ar: "دفاع النادي يدعي أن أبعاد الملعب تتسع غريباً في المباريات الخارجية."
            }
          },
          {
            num: "CLAIM 02",
            title: { en: "The Goalposts Moved 5 Centimeters Left", ar: "القائم الأيسر تحرك 5 سنتيمترات نحو اليسار" },
            desc: {
              en: "Mathematical explanation for 19 shots striking the woodwork in 10 games.",
              ar: "التفسير التكتيكي لارتطام 19 تسديدة بالعارضة والقائمين خلال 10 مباريات."
            }
          }
        ],
        verdictSection: {
          title: { en: "CAST YOUR VERDICT ON THIS CASE", ar: "سجل حكمك على هذي القضية" },
          prompt: {
            en: "Honorary archive judge, what's your ruling on the pitch & goalpost claims?",
            ar: "بصفتك قاضياً شرفياً بالأرشيف، وش حكمك بخصوص دعاوى الملعب والقائم؟"
          },
          options: [
            { id: "c1v1", en: "GUILTY — the pitch conspiracy is real", ar: "مذنب — نظرية الملعب المتحرك صحيحة" },
            { id: "c1v2", en: "NOT GUILTY — just bad finishing", ar: "غير مذنب — بس تسديد ضعيف مو أكثر" },
            { id: "c1v3", en: "CASE DISMISSED — Yelo was brutal for Al-Ahli", ar: "القضية مرفوضة — يلو كان رهيب للأهلي" }
          ],
          voteButton: { en: "SUBMIT VERDICT", ar: "إرسال الحكم" },
          successMessage: {
            en: "Verdict logged! (87% of archive visitors think the pitch was just fine.)",
            ar: "سجلنا حكمك! (87% من زوار الأرشيف يشوفون أن الملعب كان طبيعي تماماً.)"
          }
        }
      },
      {
        caseTitle: {
          en: "CASE NO. 2022-YELO-002: THE FANS vs. THE STOPWATCH",
          ar: "القضية رقم 2022-يلو-002: الجماهير ضد ساعة التوقيت"
        },
        claims: [
          {
            num: "CLAIM 01",
            title: { en: "Stoppage Time Ran 11 Minutes Short", ar: "الوقت المحتسب نقص 11 دقيقة عن حقه" },
            desc: {
              en: "Fan council submits a full spreadsheet proving the added time was miscounted.",
              ar: "مجلس الجماهير يقدم جدول بيانات كامل يثبت أن الوقت المحتسب كان محسوباً غلط."
            }
          },
          {
            num: "CLAIM 02",
            title: { en: "The Clock Ran Faster After the 80th Minute", ar: "الساعة صارت تمشي أسرع بعد الدقيقة 80" },
            desc: {
              en: "Witnesses report a sudden and suspicious increase in stadium clock velocity.",
              ar: "شهود عيان يبلغون عن تسارع مفاجئ ومريب في سرعة ساعة الملعب."
            }
          }
        ],
        verdictSection: {
          title: { en: "CAST YOUR VERDICT ON THIS CASE", ar: "سجل حكمك على هذي القضية" },
          prompt: {
            en: "Honorary archive judge, what's your ruling on the stoppage-time claims?",
            ar: "بصفتك قاضياً شرفياً بالأرشيف، وش حكمك بخصوص دعاوى الوقت المحتسب؟"
          },
          options: [
            { id: "c2v1", en: "GUILTY — the clock was rigged", ar: "مذنب — الساعة كانت متلاعب فيها" },
            { id: "c2v2", en: "NOT GUILTY — the ref just miscounted", ar: "غير مذنب — الحكم غلط بالحساب مو أكثر" },
            { id: "c2v3", en: "CASE DISMISSED — Yelo was brutal for Al-Ahli", ar: "القضية مرفوضة — يلو كان رهيب للأهلي" }
          ],
          voteButton: { en: "SUBMIT VERDICT", ar: "إرسال الحكم" },
          successMessage: {
            en: "Verdict logged! (79% of archive visitors are still side-eyeing that stadium clock.)",
            ar: "سجلنا حكمك! (79% من زوار الأرشيف لسه يشكون بساعة الملعب.)"
          }
        }
      }
    ]
  },

  // YELO ARCADE PAGE CONTENT (PREVIEW & TEASER)
  arcadePage: {
    title: {
      en: "YELO RETRO ARCADE",
      ar: "صالة أركيد يلو"
    },
    subtitle: {
      en: "Interactive mini-games. Master the VAR line, blow the ref whistle, and dodge yellow cards.",
      ar: "ألعاب تفاعلية. تدرب على رسم خطوط الفار، واطلاق الصافرة، وتفادي البطاقات الصفراء."
    },
    teaserNotice: {
      en: "THE OFFICIAL RELEGATION GAMES ARCADE",
      ar: "آركيد ألعاب الهبوط الرسمي"
    },
    games: [
      {
        id: "g1",
        title: { en: "VAR LINE CALIBRATOR", ar: "معاير خطوط الفـار" },
        desc: {
          en: "Draw manual offside lines with a shaky joystick under 3 seconds of extreme stress.",
          ar: "ارسم خطوط التسلل اليدوية تحت ضغط عصبي خلال 3 ثوانٍ فقط."
        },
        badge: { en: "STATION 01", ar: "محطة 01" },
        playable: true
      },
      {
        id: "g2",
        title: { en: "ESCAPE FROM RELEGATION", ar: "الهروب من الهبوط" },
        desc: {
          en: "A pixel-art endless runner. Dodge yellow cards, footballs, and archive files while a referee silhouette chases you down.",
          ar: "لعبة ركض لا نهائية بأسلوب البكسل آرت. تفادَ البطاقات الصفراء والكرات وملفات الأرشيف بينما يلاحقك ظل الحكم."
        },
        badge: { en: "STATION 02", ar: "محطة 02" },
        playable: true
      },
      {
        id: "g3",
        title: { en: "THE COMEBACK PENALTY", ar: "ركلة العودة" },
        desc: {
          en: "A pixel-art penalty shootout. Pick your corner and see if the archive lets you score.",
          ar: "ركلات ترجيح بأسلوب البكسل آرت. اختر جهتك وشوف إذا كان الأرشيف بيسمح لك بالتسجيل."
        },
        badge: { en: "STATION 03", ar: "محطة 03" },
        playable: true
      },
      {
        id: "g4",
        title: { en: "DEMOLISH THE FORTRESS", ar: "اهدم القلعة" },
        desc: {
          en: "A full siege-mode mini-game against the opposing goal: break down the defense, dodge the crossbar's legal team, and bring the entire away stadium down brick by brick. Still under construction in the archive workshop.",
          ar: "لعبة حصار كاملة على مرمى الخصم: اخترق الدفاع، تفادَ فريق محاماة العارضة، واهدم الملعب الخصم حجر حجر. لسه تحت الإنشاء بورشة الأرشيف."
        },
        badge: { en: "STATION 04", ar: "محطة 04" },
        playable: false,
        tallCard: true
      }
    ],
    // STRINGS FOR THE PLAYABLE VAR LINE CALIBRATOR GAME
    gameUi: {
      playButton: { en: "PLAY NOW", ar: "العب الآن" },
      comingSoon: { en: "COMING SOON", ar: "قريباً" },
      closeLabel: { en: "Close game", ar: "إغلاق اللعبة" },
      instructions: {
        en: "Tap or click the exact line where you think the attacker is level with the last defender. You have 3 seconds. Good luck, honorary VAR official.",
        ar: "اضغط بالضبط على الخط الذي تعتقد أن المهاجم متساوٍ فيه مع آخر مدافع. أمامك 3 ثوانٍ فقط. حظاً موفقاً أيها الحكم الشرفي."
      },
      startButton: { en: "START CALIBRATION", ar: "ابدأ المعايرة" },
      round: { en: "ROUND", ar: "الجولة" },
      timeLeft: { en: "TIME LEFT", ar: "الوقت المتبقي" },
      score: { en: "ACCURACY SCORE", ar: "درجة الدقة" },
      onside: { en: "RULED ONSIDE", ar: "حكم بعدم التسلل" },
      offside: { en: "RULED OFFSIDE", ar: "حكم بالتسلل" },
      timeout: { en: "TIME EXPIRED — AUTO-CALIBRATED", ar: "انتهى الوقت — معايرة تلقائية" },
      nextRound: { en: "NEXT ROUND", ar: "الجولة التالية" },
      playAgain: { en: "RECALIBRATE (PLAY AGAIN)", ar: "أعد المعايرة (العب مجدداً)" },
      finalTitle: { en: "FINAL ARCHIVE RATING", ar: "التقييم النهائي للأرشيف" },
      ranks: {
        legend: { en: "VAR LEGEND — CERTIFIED BY THE ARCHIVE", ar: "أسطورة الفار — معتمد من الأرشيف" },
        solid: { en: "SOLID CALIBRATION — RESPECTABLE WORK", ar: "معايرة جيدة — عمل محترم" },
        shaky: { en: "SHAKY JOYSTICK HANDS — NEEDS PRACTICE", ar: "يد مرتجفة — يحتاج تدريباً" },
        chaos: { en: "PURE CHAOS — MATCHDAY 30 FLASHBACKS", ar: "فوضى عارمة — ذكريات الجولة 30" }
      },
      distanceLabel: { en: "OFF BY", ar: "الفرق" }
    },
    // STRINGS FOR THE PLAYABLE "ESCAPE FROM RELEGATION" ENDLESS RUNNER
    runnerUi: {
      instructions: {
        en: "Press SPACE or tap JUMP to leap over yellow cards, footballs, archive files, warning signs, and the dreaded YELO road sign. The referee never stops chasing — survive as long as you can.",
        ar: "اضغط مفتاح المسافة (Space) أو زر القفز لتتخطى البطاقات الصفراء والكرات وملفات الأرشيف ولوحات التحذير ولافتة يلو المرعبة. الحكم ما يتوقف عن ملاحقتك — اصمد أطول فترة ممكنة."
      },
      startButton: { en: "START THE ESCAPE", ar: "ابدأ الهروب" },
      jumpButton: { en: "JUMP", ar: "قفز" },
      scoreLabel: { en: "DISTANCE", ar: "المسافة" },
      bestLabel: { en: "BEST", ar: "الأفضل" },
      restartButton: { en: "RUN AGAIN", ar: "اركض من جديد" },
      newBestNote: { en: "NEW BEST DISTANCE!", ar: "رقم قياسي جديد!" },
      gameOverMessages: [
        { en: "The archive has caught you.", ar: "الأرشيف لحق عليك." },
        { en: "Relegation speedrun completed.", ar: "أنهيت سباق الهبوط بسرعة قياسية." }
      ]
    },
    // LEADERBOARD / "RELEGATED LIST" (BROWSER-LOCAL FOR NOW — SEE README NOTE ON SHARED SYNC)
    leaderboard: {
      title: { en: "ARCHIVE RANKINGS", ar: "تصنيف الأرشيف" },
      topTab: { en: "TOP PLAYERS", ar: "الأعلى" },
      relegatedTab: { en: "THE RELEGATED", ar: "الهابطين" },
      yourScoresLabel: { en: "YOUR BEST SCORES (THIS BROWSER)", ar: "أفضل نتائجك (على هذا المتصفح)" },
      joinPlaceholder: { en: "Enter a name to appear on the table", ar: "اكتب اسمك عشان تظهر بالجدول" },
      joinButton: { en: "ADD MY NAME TO THE TABLE", ar: "أضف اسمي إلى الجدول" },
      updateButton: { en: "UPDATE MY SCORES", ar: "حدّث نتائجي" },
      joinedNote: { en: "You're on the table as", ar: "أنت مسجل بالجدول باسم" },
      colName: { en: "NAME", ar: "الاسم" },
      colVar: { en: "VAR SCORE", ar: "درجة الفار" },
      colEscape: { en: "ESCAPE DISTANCE", ar: "مسافة الهروب" },
      colPenalty: { en: "PENALTY SCORE", ar: "نتيجة الركلات" },
      colRating: { en: "RATING", ar: "التقييم" },
      emptyState: { en: "No one has joined the table yet — be the first.", ar: "محد انضم للجدول للحين - خلك اول واحد." }
    },
    // STRINGS FOR THE PLAYABLE "THE COMEBACK PENALTY" SHOOTOUT GAME
    penaltyUi: {
      instructions: {
        en: "Choose left, center, or right and take your shot. The keeper picks a direction at the exact same moment — outguess them to score across 5 penalties.",
        ar: "اختر يسار أو وسط أو يمين وسدد ركلتك. الحارس يختار جهته بنفس اللحظة — تفوّق عليه عشان تسجل خلال 5 ركلات."
      },
      startButton: { en: "STEP UP TO THE SPOT", ar: "قف أمام الكرة" },
      leftButton: { en: "LEFT", ar: "يسار" },
      centerButton: { en: "CENTER", ar: "وسط" },
      rightButton: { en: "RIGHT", ar: "يمين" },
      roundLabel: { en: "ROUND", ar: "الجولة" },
      scoreLabel: { en: "SCORE", ar: "النتيجة" },
      bestLabel: { en: "BEST", ar: "الأفضل" },
      restartButton: { en: "NEW SHOOTOUT", ar: "ركلات جديدة" },
      finalTitle: { en: "SHOOTOUT COMPLETE", ar: "انتهت الركلات" },
      newBestNote: { en: "NEW BEST SCORE!", ar: "رقم قياسي جديد!" },
      resultMessages: {
        success: { en: "A comeback attempt has been recorded.", ar: "تم تسجيل محاولة العودة." },
        miss: { en: "The ball has entered the archive.", ar: "الكرة دخلت الأرشيف." }
      }
    }
  },

  // ABOUT / CONTACT PAGE CONTENT
  aboutPage: {
    badge: {
      en: "PROJECT PURPOSE",
      ar: "هدف المشروع"
    },
    title: {
      en: "ABOUT THE ARCHIVE & MANIFESTO",
      ar: "عن الأرشيف والبيان"
    },
    subtitle: {
      en: "Why we built this editorial homage to one of football's most unforgettable seasons.",
      ar: "لماذا قمنا ببناء هذا المنبر الأرشيفي الفاخر لواحد من أكثر المواسم إثارة في كرة القدم."
    },
    manifestoTitle: {
      en: "THE FAN MANIFESTO",
      ar: "بيان المعجبين"
    },
    manifestoText: {
      en: "Great football stories are not only made of gold medals and trophy lifts. True drama lies in the unbelievable plot twists, the 90th-minute heartbreaks, and the collective humor that unites fans across social media. The Swamp Archive is a high-fashion, tongue-in-cheek celebration of football passion.",
      ar: "قصص كرة القدم العظيمة لا تقتصر على الميداليات والكؤوس فقط، بل تكمن الدراما الحقيقية في المنعطفات غير المتوقعة، واللحظات الحابسة للأنفاس في الدقيقة 90، والروح المرحة التي تجمع الجماهير. أرشيف المستنقع هو تكريم بأسلوب فاخر ومرح للشغف الكروي."
    },
    contactTitle: {
      en: "SUBMIT YOUR 2022 MEMORIES & EVIDENCE",
      ar: "شاركنا ذكرياتك ومستنداتك من موسم 2022"
    },
    form: {
      targetEmail: "iGhaithALtamimi@gmail.com",
      namePlaceholder: { en: "Your Name / Alias", ar: "الاسم / اللقب الكروي" },
      emailPlaceholder: { en: "Your Email Address", ar: "البريد الإلكتروني" },
      categoryLabel: { en: "Evidence Category", ar: "تصنيف المشاركة" },
      categories: [
        { id: "c1", en: "VAR Screenshot / Meme", ar: "لقطة شاشة للفار / كوميك" },
        { id: "c2", en: "Personal Fan Story", ar: "قصة شخصية مشجع" },
        { id: "c3", en: "Funny Fan Theory", ar: "نظرية طريفة" }
      ],
      messagePlaceholder: { en: "Describe your evidence or story from June 2022...", ar: "اكتب وصفاً لذكرياتك أو مستندك الطريف من يونيو 2022..." },
      submitButton: { en: "SEND TO ARCHIVIST", ar: "إرسال إلى أمين الأرشيف" },
      successMsg: {
        en: "Thank you! Your submission has been sent to the archivist for review.",
        ar: "شكراً لك! تم إرسال مشاركتك إلى أمين الأرشيف للمراجعة."
      },
      sendingMsg: { en: "Sending...", ar: "جاري الإرسال..." },
      errorMsg: {
        en: "Something went wrong sending this. Please try again in a moment.",
        ar: "صار في مشكلة أثناء الإرسال. حاول مرة ثانية بعد لحظات."
      }
    },
    // SATIRICAL CREATOR PROFILE (BIO CARD)
    creatorProfile: {
      badge: {
        en: "CREATOR PROFILE",
        ar: "ملف الصانع"
      },
      title: {
        en: "THE ARCHIVIST BEHIND THE ARCHIVE",
        ar: "الأرشيفي وراء الأرشيف"
      },
      bioLines: [
        { en: "Created by Ghaith Al-Tamimi.", ar: "من إنشاء غيث التميمي." },
        {
          en: "A 16-year-old developer who enjoys programming, artificial intelligence, and games.",
          ar: "مطور عمره 16 سنة، يحب البرمجة والذكاء الاصطناعي والألعاب."
        },
        { en: "Also an unofficial Al-Ahli fan… allegedly.", ar: "ومشجع غير رسمي للنادي الأهلي… حسب الأرشيف." },
        { en: "Single, according to the archive records.", ar: "أعزب، وفقًا لسجلات الموقع." }
      ],
      tiktokHandle: "@lkgh",
      tiktokUrl: "https://www.tiktok.com/@lkgh",
      tiktokLabel: {
        en: "FOLLOW @lkgh ON TIKTOK",
        ar: "تابعني على تيك توك @lkgh"
      },
      contactEmail: "iGhaithALtamimi@gmail.com",
      contactEmailLabel: {
        en: "EMAIL THE ARCHIVIST",
        ar: "راسل أمين الأرشيف"
      }
    }
  },

  // FOOTER
  footer: {
    rights: {
      en: "© 2022-2026 THE SWAMP ARCHIVE. FAN-MADE RELEGATION PROJECT.",
      ar: "© 2022-2026 أرشيف المستنقع. مشروع هبوطي من صنع المعجبين."
    },
    quickLinksTitle: { en: "NAVIGATION", ar: "روابط السريعة" },
    socialsTitle: { en: "SHARE THE PAGE WITH THE RELEGATED", ar: "شارك الصفحة للهابطين" },
    shareButton: { en: "SHARE LINK", ar: "شارك الرابط" },
    creator: {
      en: "Created by Ghaith Al-Tamimi",
      ar: "من إنشاء غيث التميمي"
    },
    legalLinks: {
      privacy: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
      terms: { en: "Terms & Conditions", ar: "الشروط والأحكام" },
      ip: { en: "Intellectual Property", ar: "حقوق الملكية الفكرية" }
    }
  },

  // LEGAL PAGES (Privacy Policy / Terms & Conditions / Intellectual Property)
  legalPages: {
    privacy: {
      title: { en: "PRIVACY POLICY", ar: "سياسة الخصوصية" },
      updated: { en: "Last updated: August 2026", ar: "آخر تحديث: أغسطس 2026" },
      sections: [
        {
          heading: { en: "Overview", ar: "مقدمة" },
          body: {
            en: "The Swamp Archive is an unofficial fan-made entertainment project by a single developer (Ghaith Al-Tamimi) — not affiliated with any club, federation, or official body. This policy explains what data we collect and why.",
            ar: "أرشيف المستنقع هو موقع تسلية غير رسمي من صنع معجب واحد (غيث التميمي)، ومو تابع لأي نادي أو اتحاد أو جهة رسمية. هذي السياسة توضح لك أي بيانات نجمعها وليش."
          }
        },
        {
          heading: { en: "What We Collect", ar: "البيانات اللي نجمعها" },
          body: {
            en: "If you publish a tale or join the arcade leaderboard, we store the name and text/score you enter, along with an anonymous random identifier automatically generated in your browser (via Firebase) so we can tell that a tale or score is \"yours\" and let you edit or delete it — this identifier isn't linked to your real name, email, or anything that personally identifies you. If you use the contact form, whatever you type (name, email, message) is sent directly to the site owner's inbox and isn't stored on the site itself.",
            ar: "إذا نشرت سالفة أو انضممت للوحة المتصدرين، نخزن الاسم والنص أو النتيجة اللي كتبتها، مع معرّف عشوائي مجهول يتولد تلقائياً بمتصفحك (عن طريق خدمة Firebase) عشان بس نعرف إنه السالفة أو النتيجة \"لك\" فتقدر تعدلها أو تحذفها — هذا المعرّف مب مرتبط باسمك الحقيقي أو بريدك أو أي شي يعرّف عليك شخصياً. إذا استخدمت نموذج التواصل، البيانات اللي تكتبها (اسمك، بريدك، رسالتك) تنرسل مباشرة لبريد صاحب الموقع ولا تُخزن على الموقع نفسه."
          }
        },
        {
          heading: { en: "Your Content Is Public", ar: "محتواك يكون عام" },
          body: {
            en: "Anything you publish — name, tale, or score — is visible to every visitor. Don't include real personal details (phone number, address, etc.) in the name or tale you post.",
            ar: "أي اسم أو سالفة أو نتيجة تنشرها بالموقع تكون ظاهرة لجميع الزوار — لا تكتب معلومات شخصية حقيقية (رقم جوال، عنوان، إلخ) بالاسم أو السالفة اللي تنشرها."
          }
        },
        {
          heading: { en: "Where Data Is Stored", ar: "وين تُخزن البيانات" },
          body: {
            en: "Tales and leaderboard data are stored on Google's Firebase cloud service. The site itself is hosted on Vercel.",
            ar: "بيانات السوالف ولوحة المتصدرين تُخزن على خدمة Google Firebase السحابية. والموقع نفسه مستضاف عبر Vercel."
          }
        },
        {
          heading: { en: "What We Don't Do", ar: "اللي ما نسويه" },
          body: {
            en: "We don't sell your data, we don't run ads, and we don't track you with marketing tools. The site is purely for fun and has no real login/account system.",
            ar: "ما نبيع بياناتك، ما نستخدم إعلانات، وما نتابعك بأدوات تتبع تسويقية. الموقع أساساً للتسلية بدون تسجيل دخول أو حسابات حقيقية."
          }
        },
        {
          heading: { en: "Deleting Your Data", ar: "حذف بياناتك" },
          body: {
            en: "You can delete your own tale yourself from the same browser you posted it from (the \"Delete\" button). For anything else, or if you can't delete it yourself, email iGhaithALtamimi@gmail.com and we'll remove it manually.",
            ar: "تقدر تحذف سالفتك بنفسك من نفس المتصفح اللي نشرتها فيه (زر \"حذف\"). إذا تبي حذف أي بيانات ثانية أو ماقدرت تحذفها بنفسك، راسلنا على iGhaithALtamimi@gmail.com وبنحذفها يدوياً."
          }
        },
        {
          heading: { en: "Children", ar: "الأطفال" },
          body: {
            en: "This is a general-audience entertainment site and isn't specifically directed at children. If you're under 18, check with a parent or guardian before submitting any personal information anywhere on the site.",
            ar: "هذا موقع تسلية عام وما يستهدف تحديداً الأطفال. إذا عمرك أقل من 18 سنة، تكلم مع أهلك قبل ما تكتب أي معلومة شخصية بأي مكان بالموقع."
          }
        },
        {
          heading: { en: "Changes to This Policy", ar: "تحديثات على السياسة" },
          body: {
            en: "We may update this page from time to time. Any changes will be reflected here directly.",
            ar: "ممكن نحدث هذي الصفحة من وقت لوقت. أي تغييرات بتنعكس هنا مباشرة."
          }
        },
        {
          heading: { en: "Contact", ar: "تواصل معنا" },
          body: {
            en: "For any privacy questions, email iGhaithALtamimi@gmail.com",
            ar: "لأي استفسار يخص خصوصيتك، راسلنا على iGhaithALtamimi@gmail.com"
          }
        }
      ]
    },
    terms: {
      title: { en: "TERMS & CONDITIONS", ar: "الشروط والأحكام" },
      updated: { en: "Last updated: August 2026", ar: "آخر تحديث: أغسطس 2026" },
      sections: [
        {
          heading: { en: "Nature of the Site", ar: "طبيعة الموقع" },
          body: {
            en: "The Swamp Archive is an unofficial fan-made entertainment project, not affiliated with or endorsed by any football club, federation, league, or official body. All content (text, cases, verdicts, stats) exists purely for entertainment and light satire — none of it is factual or official information.",
            ar: "أرشيف المستنقع مشروع تسلية غير رسمي من صنع معجب، وغير تابع أو مرتبط بأي نادي كروي أو اتحاد أو دوري أو جهة رسمية. كل المحتوى (نصوص، قضايا، أحكام، إحصائيات) مخصص للتسلية والسخرية الخفيفة بس، ومو معلومات واقعية أو رسمية."
          }
        },
        {
          heading: { en: "User-Generated Content", ar: "المحتوى اللي ينشره الزوار" },
          body: {
            en: "You're fully responsible for any name, tale, or content you publish on the site (on the Tales page or the leaderboard). You may not post: abusive, discriminatory, or harassing content; defamation or false accusations against real people; other people's personal information; or anything otherwise unlawful. We reserve the right to remove any content without prior notice if it violates these terms.",
            ar: "أنت مسؤول بشكل كامل عن أي اسم أو سالفة أو محتوى تنشره بالموقع (بصفحة سوالفكم الهابطة أو لوحة المتصدرين). ممنوع نشر: محتوى مسيء أو عنصري أو تحرشي، تشهير أو اتهامات كاذبة عن أشخاص حقيقيين، معلومات شخصية لغيرك، أو أي محتوى مخالف للأنظمة. نحتفظ بحق حذف أي محتوى بدون إشعار مسبق إذا خالف هذي الشروط."
          }
        },
        {
          heading: { en: "No Warranty", ar: "بدون ضمانات" },
          body: {
            en: "The site is provided \"as is\" with no warranties of any kind. We don't guarantee uninterrupted uptime and aren't liable for errors, downtime, or data loss.",
            ar: "الموقع مقدم \"كما هو\" بدون أي ضمانات. ما نضمن إنه بيشتغل طول الوقت بدون انقطاع، وما نتحمل مسؤولية أي خطأ أو انقطاع أو فقدان بيانات."
          }
        },
        {
          heading: { en: "Acceptable Use", ar: "الاستخدام المسموح" },
          body: {
            en: "You may not attempt to hack the site, abuse its systems (the leaderboard, tales board) via bots or automated scripts, or otherwise try to harm other visitors' experience.",
            ar: "ممنوع محاولة اختراق الموقع، استغلال أنظمته (اللوحة، السوالف) بشكل آلي (بوتات) أو مسيء، أو أي محاولة للإضرار بتجربة باقي الزوار."
          }
        },
        {
          heading: { en: "Age", ar: "الفئة العمرية" },
          body: {
            en: "The site is intended for general entertainment. If you're under 18, make sure you have a parent's or guardian's permission before interacting with sections of the site that require entering your name or any content.",
            ar: "الموقع مخصص للتسلية العامة. إذا عمرك أقل من 18 سنة، تأكد من أخذ موافقة أهلك قبل ما تتفاعل مع أقسام الموقع اللي تتطلب كتابة اسمك أو أي محتوى."
          }
        },
        {
          heading: { en: "Changes", ar: "التعديلات" },
          body: {
            en: "We may modify these terms at any time; changes take effect as soon as they're posted on this page.",
            ar: "ممكن نعدل هذي الشروط في أي وقت، والتعديلات تسري فور نشرها بهذي الصفحة."
          }
        },
        {
          heading: { en: "Contact", ar: "تواصل" },
          body: {
            en: "For any questions about these terms, email iGhaithALtamimi@gmail.com",
            ar: "لأي استفسار عن الشروط، راسلنا على iGhaithALtamimi@gmail.com"
          }
        }
      ]
    },
    ip: {
      title: { en: "INTELLECTUAL PROPERTY", ar: "حقوق الملكية الفكرية" },
      updated: { en: "Last updated: August 2026", ar: "آخر تحديث: أغسطس 2026" },
      sections: [
        {
          heading: { en: "Original Content", ar: "المحتوى الأصلي" },
          body: {
            en: "All original text, design, and code on this site (except where noted otherwise) belong to the site's creator, Ghaith Al-Tamimi, and are protected by intellectual property rights.",
            ar: "كل النصوص والتصميم والكود الخاص بالموقع (عدا المذكور خلاف ذلك) ملك لصانع الموقع غيث التميمي، ومحمي بحقوق الملكية الفكرية."
          }
        },
        {
          heading: { en: "Trademarks", ar: "العلامات التجارية" },
          body: {
            en: "Any real club names, logos, or trademarks mentioned on this site belong to their respective rightful owners. They're used here solely for commentary and parody purposes, and their use does not imply any affiliation, endorsement, or sponsorship by those parties.",
            ar: "أي أسماء أندية أو شعارات أو علامات تجارية حقيقية مذكورة بالموقع ملك لأصحابها الشرعيين. استخدامها هنا لأغراض التعليق والسخرية والمحاكاة الساخرة فقط، وما يعني أي ارتباط أو تأييد أو دعم من تلك الجهات لهذا الموقع."
          }
        },
        {
          heading: { en: "Images & Media", ar: "الصور والوسائط" },
          body: {
            en: "Images, video, and audio used on the site are either original, licensed, or used under fair-use principles for commentary and parody. If you own the rights to any content here and would like it removed, contact us and we'll act on it promptly.",
            ar: "الصور والفيديوهات والملفات الصوتية المستخدمة إما أصلية، أو مرخصة، أو مستخدمة ضمن حدود \"الاستخدام العادل\" لأغراض التعليق والسخرية. إذا كنت تملك حقوق أي محتوى وتحب نشيله، راسلنا وبنتعامل معه فوراً."
          }
        },
        {
          heading: { en: "User-Submitted Content", ar: "المحتوى اللي ينشره المستخدمون" },
          body: {
            en: "You retain ownership of any tale or text you publish on the site, but by publishing it you grant the site a license to display and publish it on its pages for as long as it remains posted.",
            ar: "أنت تحتفظ بملكية أي سالفة أو نص تنشره بالموقع، لكن بنشرها أنت توافق تمنح الموقع حق عرضها ونشرها ضمن صفحاته طول ما هي منشورة."
          }
        },
        {
          heading: { en: "Takedown Requests", ar: "طلبات الإزالة" },
          body: {
            en: "For any intellectual property claim or question, email iGhaithALtamimi@gmail.com",
            ar: "لأي مطالبة أو استفسار يخص حقوق الملكية الفكرية، راسلنا على iGhaithALtamimi@gmail.com"
          }
        }
      ]
    }
  }
};
