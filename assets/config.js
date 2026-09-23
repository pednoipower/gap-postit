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
       label     2-4 words, shown on the pieces and the phones
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
      problem:  "ยังไม่มีระบบคัดกรองผู้ป่วยที่อาจเหมาะกับ CKM ที่ชัดเจนและใช้เป็นประจำ — ที่มีอยู่ขึ้นกับแพทย์หรือทีมแต่ละคน",
      stat:     "มีระบบชัดเจนใช้ประจำ 2 จาก 16 รพ. · “มีบ้าง ขึ้นกับแพทย์/ทีม” 14 จาก 24 ผู้ตอบ",
      proposal: "กำหนดเกณฑ์คัดกรอง กลุ่มเป้าหมาย ผู้รับผิดชอบ และแบบบันทึกผลคัดกรอง"
    },
    {
      // Form Q7 — Met = "มี pathway และ workflow การส่งต่อจาก CKD clinic ชัดเจน"
      label:    "CKD clinic ยังไม่มีระบบส่งต่อผู้ป่วยไปทีม PC",
      problem:  "ไม่มี pathway และ workflow ส่งต่อผู้ป่วย advanced CKD จาก CKD clinic ไปปรึกษา palliative care — ส่งปรึกษาเป็นรายกรณี",
      stat:     "มี pathway และ workflow ชัดเจน 5 จาก 16 รพ. · ส่งปรึกษาเป็นรายกรณี 17 จาก 24 ผู้ตอบ",
      proposal: "written pathway ส่งต่อจาก CKD clinic ถึงทีม PC พร้อมเกณฑ์ส่งต่อ ช่องทาง consult และผู้ประสานงาน"
    },
    {
      // Form Q8 + Q10 — Met = a defined joint working model and integration level ≥ 3
      label:    "ทีมไตและทีม PC ยังทำงานร่วมกันเฉพาะผู้ป่วยซับซ้อน",
      problem:  "สองทีมเชื่อมโยงกันเฉพาะผู้ป่วยรายที่ซับซ้อน ผ่านการส่งปรึกษา OPD/IPD — ยังไม่ทำงานร่วมกันสม่ำเสมอ และไม่มี workflow ร่วม",
      stat:     "บูรณาการระดับ 3–4 7 จาก 16 รพ. · ระดับ 1–2 13 จาก 24 ผู้ตอบ · joint clinic 5 รพ. case conference 1 รพ.",
      proposal: "รูปแบบทำงานร่วมที่กำหนดไว้ เช่น joint clinic หรือ case conference ประจำ และ case review ร่วมสองทีม"
    },
    {
      // Form Q13 + Q15 — Met = "ทำ ACP ในผู้ป่วย ESKD ไม่ว่าเลือกการรักษาแบบใด"
      label:    "การทำ ACP ยังจำกัดเฉพาะผู้ป่วยที่เลือก CKM และเริ่มเมื่ออาการทรุดแล้ว",
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

  /* An optional link (e.g. a Google Form) shown as a QR code on the closing
     slide, for people willing to be interviewed later. Kept completely
     separate from the notes, so nothing anyone wrote can be traced to them.
     Leave as "" to hide it. */
  signupUrl: ""
};