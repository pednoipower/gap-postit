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
  supabaseUrl:     "https://YOUR-PROJECT-ref.supabase.co",
  supabaseAnonKey: "PASTE-YOUR-ANON-KEY-HERE",

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
  workshopTitle:    "The Missing Piece",
  workshopSubtitle: "Finding the gaps between nephrology and palliative care",

  // The web address participants type in, shown under the QR code.
  // Keep it SHORT — people will be squinting at it from the back row.
  joinUrl: "https://your-site.example.com",

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
    { id: "nephro",     label: "Nephrology",       short: "Nephro" },
    { id: "palliative", label: "Palliative Care",  short: "Pall"   }
  ],

  roles: [
    { id: "doctor",    label: "Doctor"           },
    { id: "nurse",     label: "Nurse"            },
    { id: "allied",    label: "Allied Health"    },
    { id: "other",     label: "Other"            }
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
      title: "Where do patients fall through the cracks?",
      subtitle: "Think of a real patient. What went wrong at the handover?",
      hint: "e.g. Nobody told the family dialysis could be stopped"
    },
    {
      id: "p2",
      title: "What do you wish the other team understood?",
      subtitle: "The thing you have explained a hundred times and it still doesn't land",
      hint: "e.g. Referral doesn't mean I'm giving up on the patient"
    },
    {
      id: "p3",
      title: "What stops you from asking for help?",
      subtitle: "Be honest — nothing here is attributed to you",
      hint: "e.g. I don't know who to call after 5pm"
    }
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
     Set to "th" for Thai, "en" for English, "both" for bilingual labels.
     ------------------------------------------------------------------------ */
  language: "en"
};
