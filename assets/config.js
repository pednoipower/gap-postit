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
  // The four gaps below come from the pre-survey of the 16 pilot hospitals
  // (PreSurvey25.9.69.pdf, Sept 2026): `stat` is the survey number shown on
  // the piece, `proposal` is the survey's own development proposal for that
  // gap. See docs/2026-09-22-gaps-from-presurvey.md for the mapping.
  seedThemes: [
    {
      label:    "คัดกรองยังขึ้นกับตัวบุคคล",
      problem:  "การคัดกรองผู้ป่วยเข้าสู่ CKM ยังขึ้นกับแต่ละทีมและแต่ละคน ผู้ป่วยจึงเข้าถึงช้า หรือไม่ได้เข้าเลย",
      stat:     "มีระบบคัดกรองชัดเจนและใช้ประจำ 2 จาก 16 รพ.",
      proposal: "กำหนดเกณฑ์คัดกรอง กลุ่มเป้าหมาย ผู้รับผิดชอบ และแบบบันทึกผลคัดกรอง ที่ใช้เหมือนกันทุกจุด"
    },
    {
      label:    "ส่งปรึกษารายกรณี ไม่มี pathway ร่วม",
      problem:  "ช่องทาง consult มีเกือบทุกแห่ง แต่ยังส่งปรึกษาเป็นรายกรณี ไม่มี pathway และไม่ได้ทบทวนผู้ป่วยร่วมกันระหว่างสองทีม",
      stat:     "มี pathway ชัดเจน 5 จาก 16 รพ. · บูรณาการระดับ 3–4 เพียง 7 จาก 16",
      proposal: "written pathway จาก CKD clinic ถึงทีม PC พร้อมผู้ประสานงาน และ case review ร่วมเป็นประจำ"
    },
    {
      label:    "ACP มาช้า และทำเฉพาะ CKM",
      problem:  "ACP ส่วนใหญ่ทำเฉพาะผู้ป่วยที่เลือก CKM และเริ่มหลังอาการทรุด ผู้ป่วยที่เลือก HD, PD หรือ KT แทบไม่ได้คุย",
      stat:     "ทำ ACP ครบทุกทางเลือก 1 จาก 16 รพ. — ทั้งที่มีเอกสารลงนามแล้ว 13 จาก 16",
      proposal: "เริ่ม ACP ก่อนตัดสินใจ KRT กับผู้ป่วย ESKD ทุกทางเลือก ใช้เอกสารมาตรฐาน ลงนาม และทบทวนเมื่ออาการเปลี่ยน"
    },
    {
      label:    "ส่งต่อแต่โรค ไม่ส่งเป้าหมายการดูแล",
      problem:  "ข้อมูลที่ส่งต่อไป ER และชุมชนเน้นวินิจฉัยและการรักษา แต่มักไม่มีเป้าหมายการดูแล แผนระยะท้าย และผลประเมินอาการ",
      stat:     "ส่งเป้าหมายการดูแล 10 จาก 16 · แผนระยะท้าย 9 · ผลประเมินอาการ 6",
      proposal: "EMR alert และ minimum data set สำหรับส่งต่อ ที่มีอาการ เป้าหมายการดูแล แผนฉุกเฉิน และ feedback กลับมา"
    }
  ],

  /* An optional link (e.g. a Google Form) shown as a QR code on the closing
     slide, for people willing to be interviewed later. Kept completely
     separate from the notes, so nothing anyone wrote can be traced to them.
     Leave as "" to hide it. */
  signupUrl: ""
};