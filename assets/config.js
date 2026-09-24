/* ============================================================================
   THE MISSING PIECE — workshop configuration
   ----------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT.
   Everything below is plain English. Change the text between the quote marks.
   ========================================================================== */

window.CONFIG = {

  /* --------------------------------------------------------------------------
     1. WHICH BACKEND TO USE
     --------------------------------------------------------------------------
     "supabase" = normal mode. Works over the internet, anyone can join.
     "local"    = fallback mode. You run a small server on your laptop and
                  everyone joins over the venue wifi. No internet needed.
     "auto"     = try supabase, and if it is unreachable, fall back to local.
                  Recommended on workshop day.
     ------------------------------------------------------------------------ */
  backend: "auto",

  /* --------------------------------------------------------------------------
     2. SUPABASE KEYS
     --------------------------------------------------------------------------
     Get these from your Supabase project:
       Project Settings  ->  Data API  ->  Project URL
       Project Settings  ->  API Keys  ->  anon / public key
     The anon key is SAFE to put here. It is designed to be public. The database
     rules in supabase/schema.sql are what actually protect your data.
     ------------------------------------------------------------------------ */
  supabaseUrl:     "https://duoolujtrbrfegpmeeat.supabase.co",
  supabaseAnonKey: "sb_publishable_E_zhmdDIV288ngVJYIVRqg_D5bZpPak",

  /* --------------------------------------------------------------------------
     3. FALLBACK SERVER ADDRESS
     --------------------------------------------------------------------------
     Leave as "" and the page will assume the server is wherever the page came
     from. Only change this if you are hosting the pages somewhere else.
     ------------------------------------------------------------------------ */
  localServerUrl: "",

  /* --------------------------------------------------------------------------
     4. THE WORKSHOP ITSELF
     ------------------------------------------------------------------------ */
  workshopTitle:    "ชิ้นส่วนที่หายไป",
  workshopSubtitle: "ตามหาช่องว่างระหว่างทีมโรคไตและทีมประคับประคอง",

  // The web address participants type in, shown under the QR code.
  // Keep it SHORT — people will be squinting at it from the back row.
  joinUrl: "https://pednoipower.github.io/gap-postit/",

  // The room code. It is shown on the projector beside the join link and is
  // stored with every note; nobody has to type it, because the QR code and
  // the link carry it. Upper case here and upper case in the database — the
  // lookup matches exactly.
  roomCode: "CANDO",

  /* --------------------------------------------------------------------------
     5. WHO IS IN THE ROOM
     --------------------------------------------------------------------------
     `id` is stored in the database, `label` is what participants see.
     Add or remove entries freely.
     ------------------------------------------------------------------------ */
  disciplines: [
    { id: "nephro",     label: "ทีมโรคไต",          short: "ไต" },
    { id: "palliative", label: "ทีมประคับประคอง",   short: "ประคับประคอง" }
  ],

  roles: [
    { id: "doctor",    label: "แพทย์"            },
    { id: "nurse",     label: "พยาบาล"           },
    { id: "allied",    label: "สหวิชาชีพ"         },
    { id: "other",     label: "อื่น ๆ"            }
  ],

  /* --------------------------------------------------------------------------
     6. (The 45-minute format has no free question round: the gaps in section
        11 drive the whole session. `prompts` is kept empty for the health
        check and older exports.)
     ------------------------------------------------------------------------ */
  prompts: [],

  /* The WHO tap in the "why" round. Who is the actor in the chain of events
     that produces the gap (or that makes it work). Short — it prints on a
     post-it. */
  actors: [
    { id: "nephro_doc",   label: "แพทย์โรคไต" },
    { id: "nephro_nurse", label: "พยาบาลไต" },
    { id: "pc_doc",       label: "แพทย์ประคับประคอง" },
    { id: "pc_nurse",     label: "พยาบาลประคับประคอง" },
    { id: "patient",      label: "ผู้ป่วย/ครอบครัว" },
    { id: "system",       label: "ระบบ/ผู้บริหาร รพ." },
    { id: "other",        label: "อื่น ๆ" }
  ],

  /* Where the participant mainly works. Asked once at join, so every note
     can be read by setting as well as by team and role. Keep every option
     big enough (10+ people) that nobody is identifiable from it. */
  settings: [
    { id: "dialysis", label: "หน่วยไตเทียม" },
    { id: "ward",     label: "หอผู้ป่วยใน" },
    { id: "opd",      label: "ผู้ป่วยนอก" },
    { id: "community",label: "ชุมชน–เยี่ยมบ้าน" },
    { id: "other",    label: "อื่น ๆ" }
  ],

  /* --------------------------------------------------------------------------
     7. RULES OF THE ROOM
     ------------------------------------------------------------------------ */
  maxCharacters:         200,   // longest a single post-it can be
  submitCooldownSeconds: 3,     // stops one person flooding the board
  maxPerPersonPerPrompt: 5,     // how many notes one person can add per question
  talkSeconds:          120,    // the countdown on the "turn and talk" slide
  sessionMinutes:        45,    // the session clock on the control panel

  /* --------------------------------------------------------------------------
     8. COLOURS
     --------------------------------------------------------------------------
     Colour = discipline. Shape = concern vs solution (handled automatically).
     Give each discipline a colour that survives a bad projector: strong,
     saturated, clearly different from each other.
     ------------------------------------------------------------------------ */
  /* THE COLOUR OF EACH GAP, in order. `onDark` is the projector — pale
     enough to carry on canopy green; `onLight` is the phone and the control
     panel, dark enough to read on Mist (all at least 4.5:1). Both are the
     same hue, so a gap keeps its identity across the two screens. */
  gapAccents: [
    // four that stay apart from each other AND from the white of the gap
    // sentence they sit inside
    { onDark: "#a9cdb9", onLight: "#225a43" },
    { onDark: "#e6cb74", onLight: "#8a6d12" },
    { onDark: "#76ad90", onLight: "#1b4a3b" },
    { onDark: "#f4b6cd", onLight: "#6f1c40" },
    { onDark: "#c9a227", onLight: "#2e6e52" },
    { onDark: "#a9cdb9", onLight: "#225a43" }
  ],

  /* WHAT A NOTE'S COLOUR MEANS. Each round puts exactly two colours on the
     wall, and each matches the words above its column:
       why round   gold = ยังเจอในงานของเรา · pink = ไม่ค่อยเจอ
       how round   green = มีอยู่แล้วที่นี่   · pink = สิ่งใหม่ที่ควรเริ่มทำ
     So gold is the gap as people meet it, green is what is already in place,
     and pink is the way out — which is the one Nuvo reserves for what
     matters. Which TEAM wrote a note is carried by the shape of the paper
     instead: the palliative team's notes have a folded corner. */
  kindColors: {
    cause:    { base: "#c9a227", ink: "#3a2f06" },   // ยังเจอในงานของเรา
    works:    { base: "#d6457f", ink: "#4a132b" },   // ไม่ค่อยเจอ — ทำได้อยู่แล้ว
    asset:    { base: "#2e6e52", ink: "#0f2a23" },   // มีอยู่แล้วที่นี่
    idea:     { base: "#d6457f", ink: "#4a132b" },   // สิ่งใหม่ที่ควรเริ่มทำ
    // the overall round asks what to do with what we already do
    ov_promote: { base: "#2e6e52", ink: "#0f2a23" },
    ov_improve: { base: "#c9a227", ink: "#3a2f06" },
    ov_stop:    { base: "#c0392b", ink: "#3d1310" },
    // the warm-up round keeps out of the real palette: grey paper says
    // "this one does not count" without anybody having to explain it
    practice: { base: "#8c9792", ink: "#141a18" },
    fallback: { base: "#8c9792", ink: "#141a18" }
  },

  /* Team colours. Used where a TEAM is named — the join screen, the who
     slide, the counts — not on the notes themselves. */
  colors: {
    // Chula Nuvo: Canopy Green and Blossom Pink. They differ in lightness as
    // well as hue, so the two teams stay apart for colour-blind readers and
    // on a weak projector bulb.
    nephro:     { base: "#2e6e52", ink: "#0f2a23", glow: "#76ad90" },
    palliative: { base: "#d6457f", ink: "#4a132b", glow: "#f4b6cd" },
    // used if someone joins with a discipline not listed above
    fallback:   { base: "#8c9792", ink: "#141a18", glow: "#d5dbd7" }
  },

  /* --------------------------------------------------------------------------
     9. LANGUAGE
     --------------------------------------------------------------------------
     What participants and the projector see. "th" for Thai, "en" for English,
     "both" for Thai with English after a slash. The control panel, grouping
     board and health check are always in English — they are yours, not the
     room's.
     ------------------------------------------------------------------------ */
  language: "th",

  /* --------------------------------------------------------------------------
     10. WHAT LANGUAGE THE AI SHOULD WRITE THE PROBLEM STATEMENTS IN
     --------------------------------------------------------------------------
     Plain English name of the language, e.g. "Thai" or "English". This goes
     straight into the prompt you copy to the AI. Labels like C-001 and G1 stay
     as they are whatever you put here.
     ------------------------------------------------------------------------ */
  aiOutputLanguage: "Thai",

  /* --------------------------------------------------------------------------
     11. THE GAPS, AND WHAT THE PROGRAM PROPOSES TO DO ABOUT EACH
     --------------------------------------------------------------------------
     In the 45-minute format the gaps are decided BEFORE the day, from the
     evidence, and loaded into the room with one button on the control panel.
     Each gap has:
       label     the gap as one sentence, shown on the cards and the phones
       highlight one phrase, or a list of them, inside that label: the words
                 the room should catch first. They are picked out in the gap's
                 own colour wherever the label is shown. Each must appear in
                 `label` exactly; leave it out for no highlight.
       problem   one sentence naming what is missing
       proposal  the ONE concrete thing the program might do about it. This is
                 NOT shown to the room — not on the screen and not on the
                 phones — because naming it first steers what people write.
                 It is kept for the analysis: the export puts it beside what
                 the room came up with on its own.
     Order matters: it is the order the gaps are worked through on the day.

     maxGroups is only used by the after-the-day AI grouping step.
     ------------------------------------------------------------------------ */
  maxGroups: 6,
  // `stat` is no longer shown on any screen — not on the projector and not on
  // the phone. It stays here and in the export so you can quote a number out
  // loud when it helps, and so the analysis keeps the evidence each gap came
  // from. See docs/2026-09-22-gaps-from-presurvey.md.
  //
  // The four gaps below are the four site-level indicators with the most
  // Unmet results in the pre-survey of the 16 pilot hospitals (Sept 2026),
  // one indicator each, not merged. Each maps to one question on the survey
  // form; `problem` is worded on the survey's own criterion and its most
  // common answer, `stat` is the survey number, `proposal` is the survey's
  // own development proposal. See docs/2026-09-22-gaps-from-presurvey.md.
  seedThemes: [
    {
      // Form Q6 — Met = "มีระบบชัดเจนและใช้เป็นประจำ"
      label:    "โรงพยาบาลยังไม่มีระบบคัดกรองผู้ป่วยที่เหมาะกับ CKM",
      highlight: ["ยังไม่มี", "ระบบคัดกรอง"],
      problem:  "ยังไม่มีระบบคัดกรองผู้ป่วยที่อาจเหมาะกับ CKM ที่ชัดเจนและใช้เป็นประจำ — ที่มีอยู่ขึ้นกับแพทย์หรือทีมแต่ละคน",
      stat:     "มีระบบชัดเจนใช้ประจำ 2 จาก 16 รพ. · “มีบ้าง ขึ้นกับแพทย์/ทีม” 14 จาก 24 ผู้ตอบ",
      proposal: "กำหนดเกณฑ์คัดกรอง กลุ่มเป้าหมาย ผู้รับผิดชอบ และแบบบันทึกผลคัดกรอง"
    },
    {
      // Form Q7 — Met = "มี pathway และ workflow การส่งต่อจาก CKD clinic ชัดเจน"
      label:    "CKD clinic ยังไม่มีระบบส่งต่อผู้ป่วยไปทีม PC",
      highlight: ["ยังไม่มี", "ระบบส่งต่อ"],
      problem:  "ไม่มี pathway และ workflow ส่งต่อผู้ป่วย advanced CKD จาก CKD clinic ไปปรึกษา palliative care — ส่งปรึกษาเป็นรายกรณี",
      stat:     "มี pathway และ workflow ชัดเจน 5 จาก 16 รพ. · ส่งปรึกษาเป็นรายกรณี 17 จาก 24 ผู้ตอบ",
      proposal: "written pathway ส่งต่อจาก CKD clinic ถึงทีม PC พร้อมเกณฑ์ส่งต่อ ช่องทาง consult และผู้ประสานงาน"
    },
    {
      // Form Q8 + Q10 — Met = a defined joint working model and integration level ≥ 3
      label:    "ทีมไตและทีม PC ยังทำงานร่วมกันเฉพาะผู้ป่วยซับซ้อน",
      highlight: ["เฉพาะผู้ป่วยซับซ้อน"],
      problem:  "สองทีมเชื่อมโยงกันเฉพาะผู้ป่วยรายที่ซับซ้อน ผ่านการส่งปรึกษา OPD/IPD — ยังไม่ทำงานร่วมกันสม่ำเสมอ และไม่มี workflow ร่วม",
      stat:     "บูรณาการระดับ 3–4 7 จาก 16 รพ. · ระดับ 1–2 13 จาก 24 ผู้ตอบ · joint clinic 5 รพ. case conference 1 รพ.",
      proposal: "รูปแบบทำงานร่วมที่กำหนดไว้ เช่น joint clinic หรือ case conference ประจำ และ case review ร่วมสองทีม"
    },
    {
      // Form Q13 + Q15 — Met = "ทำ ACP ในผู้ป่วย ESKD ไม่ว่าเลือกการรักษาแบบใด"
      label:    "การทำ ACP ยังจำกัดเฉพาะผู้ป่วยที่เลือก CKM และเริ่มเมื่ออาการทรุดแล้ว",
      highlight: ["การทำ ACP ยังจำกัด"],
      problem:  "ACP ทำเฉพาะผู้ป่วย ESKD ที่เลือก CKM และมักเริ่มหลังเลือก CKM หรือหลังอาการมากขึ้น — ผู้ที่เลือก HD, PD หรือ KT ไม่ได้ทำ",
      stat:     "ทำ ACP ทุกทางเลือก 1 จาก 16 รพ. · เฉพาะ CKM 17 จาก 24 ผู้ตอบ · เริ่มก่อนตัดสินใจ KRT 5 จาก 24",
      proposal: "ทำ ACP ในผู้ป่วย ESKD ทุกทางเลือก เริ่มตั้งแต่ CKD stage 4–5 ก่อนตัดสินใจบำบัดทดแทนไต ใช้เอกสารมาตรฐาน ลงนาม และทบทวนเมื่ออาการเปลี่ยน"
    }
  ],

  /* --------------------------------------------------------------------------
     12. THE PRACTICE ROUND
     --------------------------------------------------------------------------
     One warm-up gap, run once before the real ones. It does three jobs at
     once: it teaches the sentence, it breaks the ice, and it proves every
     phone in the room can reach the board before anything matters.

     Choose it carefully. The point is to rehearse the KIND of chain the real
     rounds need — a routine that people keep enacting for reasons that make
     sense to them: an unwritten rule, a deference, a job nobody was given, a
     form with no box for it. A warm-up whose causes are a building or a
     broken machine teaches the wrong chain, however funny it is.

     Urgent work announced today to start tomorrow qualifies: everybody in
     Thai healthcare has lived it, no profession is singled out, and what it
     surfaces is how work is organised — how instructions travel, who turns
     them into tasks, whether responsibility is named, and whether there is a
     trusted way to ask. The reasons people give are the same shape as the
     reasons behind the four real gaps. It also has an honest opposite: some
     teams do absorb a same-day change cleanly, and they can say why.

     Its notes are stored (that is the point — you can see them arrive) but
     they are left out of every export, of the closing counts and of the AI
     prompt. Set `practice: null` to skip the round entirely.

     `actors` replaces the clinical WHO list for this round only.
     ------------------------------------------------------------------------ */
  practice: {
    id:      "G0",
    label:   "งานด่วนมักแจ้งวันนี้และให้เริ่มพรุ่งนี้",
    problem: "รอบซ้อม — เรื่องคุ้น ๆ ในระบบสุขภาพไทย",
    /* The WHO list has the same shape as the clinical one — someone senior,
       whoever passes the work on, the people who have to do it, a
       coordinator, the system — so the warm-up rehearses the real list as
       well as the real sentence. */
    actors: [
      { id: "p_chair",   label: "ผู้บริหาร/หัวหน้า" },
      { id: "p_speaker", label: "คนส่งเรื่อง" },
      { id: "p_member",  label: "คนทำงานหน้างาน" },
      { id: "p_sec",     label: "ผู้ประสานงาน" },
      { id: "p_system",  label: "ระบบ/ผู้บริหาร รพ." },
      { id: "p_other",   label: "อื่น ๆ" }
    ]
  },

  /* --------------------------------------------------------------------------
     13. THE FORM OF LAST RESORT
     --------------------------------------------------------------------------
     A Google Form (or any link) that collects the same answers, for the day
     the backend cannot be reached at all. Put the link here and it appears
     by itself: a button on the phones when they cannot connect, and a QR on
     the projector beside the message that the room should use it.

     It is a fallback, not a backend. A form can take answers but cannot hand
     them back quickly enough to drive the wall, so while it is in use there
     is no live count, no blind round and no reveal — you read a few out from
     your own screen instead. docs/manual.md says how to build the form so its
     columns line up with the export, and remember to switch OFF "collect
     email addresses" or the anonymity promise stops being true.

     Leave as "" and nothing is shown.
     ------------------------------------------------------------------------ */
  fallbackFormUrl: "",

  /* An optional link (e.g. a Google Form) shown as a QR code on the closing
     slide, for people willing to be interviewed later. Kept completely
     separate from the notes, so nothing anyone wrote can be traced to them.
     Leave as "" to hide it. */
  signupUrl: ""
};