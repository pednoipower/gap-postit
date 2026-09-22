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

  // The room code. 4 letters, no vowels (so it can never spell anything rude,
  // and so O/0 and I/1 confusion is impossible).
  roomCode: "PZKT",

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
     6. THE PROMPT QUESTIONS (Phase 1 — voicing concerns)
     --------------------------------------------------------------------------
     Each one becomes its own slide. `hint` is the grey placeholder text inside
     the participant's typing box.
     ------------------------------------------------------------------------ */
  prompts: [
    {
      id: "p1",
      title: "นึกถึงผู้ป่วยจริงหนึ่งราย — เขาหลุดจากรอยต่อระหว่างสองทีมเราตรงไหน?",
      subtitle: "ไม่ต้องระบุชื่อ เขียนสิ่งที่เกิดขึ้นจริง",
      hint: "เช่น ไม่มีใครบอกครอบครัวว่าหยุดฟอกไตได้"
    }
  ],

  /* Situations a participant can tap to say WHEN the gap happens most.
     Optional on the phone; leave the list empty to hide it. */
  situations: [
    { id: "start",     label: "เริ่มฟอกไต" },
    { id: "deterior",  label: "อาการทรุดลง" },
    { id: "afterhrs",  label: "นอกเวลาราชการ" },
    { id: "discharge", label: "จำหน่าย–ส่งต่อ" },
    { id: "family",    label: "คุยกับครอบครัว" },
    { id: "other",     label: "อื่น ๆ" }
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

  /* --------------------------------------------------------------------------
     8. COLOURS
     --------------------------------------------------------------------------
     Colour = discipline. Shape = concern vs solution (handled automatically).
     Give each discipline a colour that survives a bad projector: strong,
     saturated, clearly different from each other.
     ------------------------------------------------------------------------ */
  colors: {
    nephro:     { base: "#1F9AB8", ink: "#052A33", glow: "#5FD3EC" },
    palliative: { base: "#E08034", ink: "#3A1B06", glow: "#FFB273" },
    // used if someone joins with a discipline not listed above
    fallback:   { base: "#8C8FA3", ink: "#1B1C24", glow: "#C3C6D8" }
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
                 what the room reacts to: "what here would help this work, and
                 how?" / "what would get in the way, and why?"
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
      label:    "คัดกรอง CKM ไม่เป็นระบบ",
      problem:  "ยังไม่มีระบบคัดกรองผู้ป่วยที่อาจเหมาะกับ CKM ที่ชัดเจนและใช้เป็นประจำ — ที่มีอยู่ขึ้นกับแพทย์หรือทีมแต่ละคน",
      stat:     "มีระบบชัดเจนใช้ประจำ 2 จาก 16 รพ. · “มีบ้าง ขึ้นกับแพทย์/ทีม” 14 จาก 24 ผู้ตอบ",
      proposal: "กำหนดเกณฑ์คัดกรอง กลุ่มเป้าหมาย ผู้รับผิดชอบ และแบบบันทึกผลคัดกรอง"
    },
    {
      // Form Q7 — Met = "มี pathway และ workflow การส่งต่อจาก CKD clinic ชัดเจน"
      label:    "ไม่มี pathway จาก CKD clinic ไป PC",
      problem:  "ไม่มี pathway และ workflow ส่งต่อผู้ป่วย advanced CKD จาก CKD clinic ไปปรึกษา palliative care — ส่งปรึกษาเป็นรายกรณี",
      stat:     "มี pathway และ workflow ชัดเจน 5 จาก 16 รพ. · ส่งปรึกษาเป็นรายกรณี 17 จาก 24 ผู้ตอบ",
      proposal: "written pathway ส่งต่อจาก CKD clinic ถึงทีม PC พร้อมเกณฑ์ส่งต่อ ช่องทาง consult และผู้ประสานงาน"
    },
    {
      // Form Q8 + Q10 — Met = a defined joint working model and integration level ≥ 3
      label:    "ทำงานร่วมกันเฉพาะรายซับซ้อน",
      problem:  "สองทีมเชื่อมโยงกันเฉพาะผู้ป่วยรายที่ซับซ้อน ผ่านการส่งปรึกษา OPD/IPD — ยังไม่ทำงานร่วมกันสม่ำเสมอ และไม่มี workflow ร่วม",
      stat:     "บูรณาการระดับ 3–4 7 จาก 16 รพ. · ระดับ 1–2 13 จาก 24 ผู้ตอบ · joint clinic 5 รพ. case conference 1 รพ.",
      proposal: "รูปแบบทำงานร่วมที่กำหนดไว้ เช่น joint clinic หรือ case conference ประจำ และ case review ร่วมสองทีม"
    },
    {
      // Form Q13 + Q15 — Met = "ทำ ACP ในผู้ป่วย ESKD ไม่ว่าเลือกการรักษาแบบใด"
      label:    "ACP เฉพาะผู้ที่เลือก CKM และเริ่มช้า",
      problem:  "ACP ทำเฉพาะผู้ป่วย ESKD ที่เลือก CKM และมักเริ่มหลังเลือก CKM หรือหลังอาการมากขึ้น — ผู้ที่เลือก HD, PD หรือ KT ไม่ได้ทำ",
      stat:     "ทำ ACP ทุกทางเลือก 1 จาก 16 รพ. · เฉพาะ CKM 17 จาก 24 ผู้ตอบ · เริ่มก่อนตัดสินใจ KRT 5 จาก 24",
      proposal: "ทำ ACP ในผู้ป่วย ESKD ทุกทางเลือก เริ่มตั้งแต่ CKD stage 4–5 ก่อนตัดสินใจบำบัดทดแทนไต ใช้เอกสารมาตรฐาน ลงนาม และทบทวนเมื่ออาการเปลี่ยน"
    }
  ],

  /* An optional link (e.g. a Google Form) shown as a QR code on the closing
     slide, for people willing to be interviewed later. Kept completely
     separate from the notes, so nothing anyone wrote can be traced to them.
     Leave as "" to hide it. */
  signupUrl: ""
};