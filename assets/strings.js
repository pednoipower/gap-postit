/* ============================================================================
   STRINGS — everything a participant reads on their phone, in Thai and
   English. Which they see is `language` in config.js: "th", "en" or "both"
   (Thai first, English after a slash). Facilitator pages stay in English.
   ========================================================================== */
(function () {
  "use strict";
  const S = {
    // join
    join_team:        { th: "คุณอยู่ทีมไหน",                       en: "Which team are you part of?" },
    join_role:        { th: "ตำแหน่งของคุณ",                       en: "And your role?" },
    join_setting:     { th: "คุณทำงานที่ไหนเป็นหลัก",              en: "Where do you mainly work?" },
    join_anon:        { th: "ไม่ระบุตัวตน — ไม่มีการบันทึกชื่อหรือเบอร์ เก็บเฉพาะทีม ตำแหน่ง และหน่วยงาน สิ่งที่คุณเขียนจะไม่ถูกโยงกลับมาหาคุณ", en: "Anonymous — no name or number is recorded, only team, role and setting. Nothing you write can be traced back to you." },
    join_pick:        { th: "เลือกให้ครบก่อน",                     en: "Choose all three to continue" },
    join_go:          { th: "พร้อมแล้ว — เข้าห้อง",                 en: "I'm in — let's go" },
    join_connecting:  { th: "กำลังเชื่อมต่อ…",                      en: "Connecting…" },
    join_joining:     { th: "กำลังเข้าห้อง…",                       en: "Joining…" },
    join_welcome:     { th: "ยินดีต้อนรับกลับ — กำลังพาไปที่กระดาน", en: "Welcome back — taking you to the board" },
    join_connected:   { th: "เชื่อมต่อแล้ว ห้อง",                   en: "Connected. Room" },
    join_fail:        { th: "เชื่อมต่อไม่ได้ ตรวจสอบ wifi แล้วดึงหน้าจอลงเพื่อโหลดใหม่", en: "Can't reach the workshop. Check your wifi, then pull down to refresh." },

    // waiting
    wait_title:       { th: "รอสักครู่…",                            en: "Waiting to start…" },
    wait_sub:         { th: "เปิดหน้านี้ค้างไว้ คำถามจะปรากฏที่นี่",  en: "Keep this page open. The question will appear here." },
    wait_lobby:       { th: "เข้าห้องแล้ว มองที่จอ — เดี๋ยวเริ่มกัน", en: "You're in. Look up at the screen — we'll start shortly." },
    wait_closed:      { th: "รอบนี้ปิดแล้ว มองที่จอ",                 en: "That round is closed. Look up at the screen." },
    wait_screen:      { th: "มองที่จอ",                              en: "Look up at the screen." },

    // WHY round
    why_title:        { th: "ทำไมถึงเป็นแบบนี้",                         en: "Why is this happening?" },
    why_lbl:          { th: "อะไรในระบบทำให้เป็นแบบนี้ที่โรงพยาบาลของคุณ", en: "What in the system makes this happen at your hospital?" },
    why_hint:         { th: "เช่น ไม่มีใครถูกมอบหมายให้ดูเรื่องนี้ พอทุกคนยุ่ง มันก็หายไป", en: "e.g. Nobody is assigned to it, so when everyone is busy it just disappears" },
    why_note:         { th: "พูดถึงระบบ ไม่ใช่ตัวบุคคล — ทั้งสองทีมกำลังตอบคำถามเดียวกัน", en: "Talk about the system, not people — both teams are answering the same question" },
    send_why:         { th: "ส่งสาเหตุ",                                  en: "Send" },

    // HOW round
    how_title:        { th: "แล้วเราจะทำอย่างไร",                        en: "How would we fix it?" },
    how_seed:         { th: "โครงการเสนอไว้ว่า",                          en: "The program proposes" },
    how_seed_note:    { th: "ต่อยอดจากนี้ หรือเสนอทางอื่นก็ได้",             en: "Build on it, or propose something else" },
    how_pick:         { th: "สิ่งที่คุณจะเสนอคือ",                        en: "What you're proposing is" },
    how_asset:        { th: "สิ่งที่มีอยู่แล้วที่นี่ — ใช้ให้มากขึ้น",         en: "Something that already exists here — use it more" },
    how_new:          { th: "สิ่งใหม่ที่ควรทำ",                            en: "Something new we should do" },
    how_what:         { th: "คืออะไร",                                    en: "What is it?" },
    how_why:          { th: "ทำไมมันจะได้ผลที่โรงพยาบาลของคุณ",             en: "Why would it work at your hospital?" },
    how_what_hint_a:  { th: "เช่น พยาบาล PC ที่รู้จักทีมไตอยู่แล้ว",          en: "e.g. The PC nurse who already knows the renal team" },
    how_why_hint_a:   { th: "เช่น เริ่มจากความไว้ใจที่มีอยู่ ไม่ต้องสร้างใหม่", en: "e.g. It starts from trust that already exists" },
    how_what_hint_n:  { th: "เช่น ให้พยาบาลไตเปิดเรื่องทางเลือกตั้งแต่ stage 4", en: "e.g. Have the renal nurse open the options conversation at stage 4" },
    how_why_hint_n:   { th: "เช่น ครอบครัวไว้ใจพยาบาลไตมากกว่าคนแปลกหน้า",     en: "e.g. Families trust the renal nurse more than a stranger" },
    send_how:         { th: "ส่งข้อเสนอ",                                   en: "Send" },
    how_pick_first:   { th: "เลือกด้านบนก่อน",                              en: "Pick one above first" },
    need_both:        { th: "กรอกทั้งสองช่อง",                              en: "Fill in both boxes" },
    overall_title:    { th: "ภาพรวม",                                       en: "Overall" },
    overall_sub:      { th: "สิ่งที่ควรทำ ที่ไม่ได้เกี่ยวกับช่องว่างใดช่องว่างหนึ่ง", en: "Something we should do that isn't about one gap" },

    // sending
    sending:          { th: "กำลังส่ง…",                               en: "Adding…" },
    at_limit:         { th: "ครบแล้วสำหรับข้อนี้ — ขอบคุณ",              en: "That's all for this one — thank you" },
    cooling:          { th: "สักครู่…",                                 en: "Just a moment…" },
    sent_ok:          { th: "ส่งแล้ว มองที่จอ",                         en: "Added. Look up at the screen." },
    sent_queued:      { th: "เก็บไว้ในเครื่องแล้ว จะส่งเองเมื่อสัญญาณกลับมา", en: "Saved on your phone — it'll send itself when the signal comes back" },
    sent_fail:        { th: "ส่งไม่สำเร็จ ลองอีกครั้ง",                  en: "That didn't go through. Try again." },
    lost:             { th: "สัญญาณหาย — กำลังลองใหม่ สิ่งที่เขียนไว้ไม่หาย", en: "Lost connection — still trying. Anything you write is kept safe." },
    mine_one:         { th: "คุณส่งแล้ว 1 ข้อ",                          en: "You've added 1 note" },
    mine_n:           { th: "คุณส่งแล้ว {n} ข้อ",                        en: "You've added {n} notes" },

    // step strip and between-round text
    step_gap:         { th: "ช่องว่าง",                                  en: "Gap" },
    step_why:         { th: "ทำไม",                                      en: "Why" },
    step_how:         { th: "ทำอย่างไร",                                  en: "How" },
    step_overall:     { th: "ภาพรวม",                                    en: "Overall" },
    gaps_intro:       { th: "ช่องว่างสี่เรื่องจาก pre-survey ของ 16 โรงพยาบาล — เราจะไปทีละเรื่อง: ทำไมถึงเป็นแบบนี้ แล้วจะแก้อย่างไร", en: "Four gaps from the pre-survey of 16 hospitals — one at a time: why it happens, then how to fix it" },
    reveal_why:       { th: "ดูที่จอ — สาเหตุจากทั้งสองทีม แล้วต่อด้วย: จะแก้อย่างไร", en: "Look at the screen — causes from both teams; next: how to fix it" },
    reveal_how:       { th: "ดูที่จอ — เดี๋ยวไปช่องว่างถัดไป",              en: "Look at the screen — next gap coming up" },
    wait_closing:     { th: "ขอบคุณ — สิ่งที่คุณเขียนคือชิ้นส่วนที่หายไป เราจะรวบรวมทั้งหมดและส่งสรุปกลับให้ทั้งสองทีม", en: "Thank you — what you wrote is the missing piece. We'll gather it all and send a summary back to both teams." },
    draft_kept:       { th: "ข้อความที่พิมพ์ค้างไว้ยังอยู่ — จะส่งได้เมื่อรอบเปิดอีกครั้ง", en: "What you were typing is kept — you can send it if the round reopens" },

    // projector
    pj_in_room:       { th: "คนในห้อง",                                  en: "in the room" },
    pj_who:           { th: "ใครอยู่ในห้องนี้",                            en: "Who's in the room" },
    pj_who_sub:       { th: "สองด้านของปัญหาเดียวกัน",                     en: "Two halves of the same problem" },
    pj_evidence:      { th: "ช่องว่างที่หลักฐานชี้ไว้",                     en: "The gaps the evidence points to" },
    pj_evidence_sub:  { th: "และสิ่งที่โครงการเสนอจะทำกับแต่ละช่องว่าง",     en: "And what the program proposes for each" },
    pj_proposal:      { th: "ข้อเสนอ",                                    en: "Proposal" },
    pj_evidence_lbl:  { th: "จาก pre-survey",                             en: "From the pre-survey" },
    pj_why_blind:     { th: "ทำไมถึงเป็นแบบนี้ที่ รพ. ของคุณ — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา", en: "Why does this happen at your hospital? Answer on your phone — revealed together when time is up" },
    pj_how_blind:     { th: "แล้วเราจะทำอย่างไร — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา", en: "How would we fix it? Answer on your phone — revealed together when time is up" },
    pj_why_revealed:  { th: "สาเหตุ จากทั้งสองทีม",                        en: "Causes, from both teams" },
    pj_how_revealed:  { th: "สาเหตุ และสิ่งที่เราจะทำ",                     en: "Causes, and what we would do" },
    pj_answers:       { th: "คำตอบ",                                      en: "answers" },
    pj_causes:        { th: "ทำไมถึงเป็นแบบนี้",                            en: "Why it happens" },
    pj_solutions:     { th: "เราจะทำอย่างไร",                              en: "What we would do" },
    pj_asset_mark:    { th: "มีอยู่แล้ว",                                  en: "exists" },
    pj_overall:       { th: "ภาพรวม",                                      en: "Overall" },
    pj_closing:       { th: "ไม่มีใครเห็นภาพทั้งหมดคนเดียว",                en: "Neither of us had the whole picture" },
    pj_stats:         { th: "{c} สาเหตุ · {a} สิ่งที่มีอยู่แล้ว · {i} สิ่งใหม่ · {g} ช่องว่างที่ทั้งสองทีมร่วมตอบ",
                        en: "{c} causes · {a} things that already exist · {i} new ideas · {g} gaps both teams answered" },
    pj_signup:        { th: "อยากเล่าให้ฟังเพิ่ม? สแกนเพื่อลงชื่อคุยต่อ",     en: "Willing to talk more? Scan to leave your contact" },
    pj_waiting_gaps:  { th: "รอโหลดช่องว่างจากแผงควบคุม…",                   en: "Waiting for the gaps to be loaded from the control panel…" },
    pj_concerns:      { th: "เรื่องที่หลุด",                               en: "concerns" },
    pj_from_nephro:   { th: "จากทีมโรคไต",                                 en: "from nephrology" },
    pj_from_pall:     { th: "จากทีมประคับประคอง",                          en: "from palliative care" },
    pj_word_cloud:    { th: "กลุ่มคำ",                                     en: "Word cloud" },
    pj_wall:          { th: "กระดานโน้ต",                                   en: "Post-it wall" },
    pj_fullscreen:    { th: "เต็มจอ",                                      en: "Full screen" }
  };

  function t(key, vars) {
    const e = S[key];
    if (!e) return key;
    const lang = ((window.CONFIG && window.CONFIG.language) || "both").toLowerCase();
    let out = lang === "th" ? e.th : lang === "en" ? e.en : e.th + " / " + e.en;
    if (vars) for (const k in vars) out = out.replace("{" + k + "}", vars[k]);
    return out;
  }
  /* Two-line version for headings: Thai on top, English underneath. */
  function t2(key) {
    const e = S[key];
    if (!e) return { top: key, under: "" };
    const lang = ((window.CONFIG && window.CONFIG.language) || "both").toLowerCase();
    if (lang === "th") return { top: e.th, under: "" };
    if (lang === "en") return { top: e.en, under: "" };
    return { top: e.th, under: e.en };
  }
  window.T = { t, t2, S };
})();
