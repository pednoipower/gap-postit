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
    join_anon:        { th: "ไม่มีการบันทึกชื่อ — เก็บเฉพาะทีม ตำแหน่ง และหน่วยงาน", en: "Nothing is linked to your name. We only record team, role and setting." },
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
    wait_closing:     { th: "ขอบคุณ — สิ่งที่คุณเขียนคือชิ้นส่วนที่หายไป", en: "Thank you — what you wrote is the missing piece." },

    // concerns
    when_lbl:         { th: "เกิดขึ้นบ่อยตอนไหน (ถ้าอยากระบุ)",      en: "When does this happen most? (optional)" },
    send_add:         { th: "ส่งขึ้นกระดาน",                         en: "Add to the board" },

    // react (facilitators / barriers)
    react_title:      { th: "ข้อเสนอสำหรับช่องว่างนี้",              en: "What the program proposes for this gap" },
    react_pick:       { th: "คุณอยากบอกเรื่องอะไร",                  en: "What do you want to tell us?" },
    react_fac:        { th: "สิ่งที่จะช่วยให้ทำได้",                  en: "Something here that would help" },
    react_bar:        { th: "สิ่งที่จะเป็นอุปสรรค",                   en: "Something that would get in the way" },
    fac_what:         { th: "สิ่งนั้นคืออะไร",                        en: "What is it?" },
    fac_how:          { th: "มันช่วยอย่างไร",                         en: "How would it help?" },
    bar_what:         { th: "สิ่งนั้นคืออะไร",                        en: "What is it?" },
    bar_why:          { th: "ทำไมถึงเป็นปัญหาที่นี่",                  en: "Why does it matter here?" },
    fac_what_hint:    { th: "เช่น หัวหน้าแผนกสนับสนุน",               en: "e.g. The head of department is behind it" },
    fac_how_hint:     { th: "เช่น หมอไตจะไม่รู้สึกว่าส่งต่อคือแอบทำลับหลังใคร", en: "e.g. Nephrologists won't feel referral is going behind anyone's back" },
    bar_what_hint:    { th: "เช่น ราวด์ชนกับคลินิกวันพุธ",             en: "e.g. The round clashes with Wednesday clinic" },
    bar_why_hint:     { th: "เช่น พยาบาลจะไม่มีทางมาได้จริง แล้วก็จะเลิกไปเอง", en: "e.g. The nurse could never actually attend, so it would quietly stop" },
    send_react:       { th: "ส่ง",                                    en: "Send" },
    react_pick_first: { th: "เลือกด้านบนก่อน",                        en: "Pick one above first" },
    need_both:        { th: "กรอกทั้งสองช่อง",                        en: "Fill in both boxes" },

    // own theory
    idea_title:       { th: "ไอเดียของคุณเอง",                        en: "Your own idea" },
    idea_sub:         { th: "หนึ่งสิ่งที่เราควรทำ — และทำไมมันจะได้ผลที่นี่", en: "One thing we should do — and why it would work here" },
    idea_gap:         { th: "สำหรับช่องว่างไหน",                       en: "For which gap?" },
    idea_if:          { th: "ถ้าเรา…",                                 en: "If we…" },
    idea_then:        { th: "แล้วจะเกิดอะไรขึ้น…",                     en: "then…" },
    idea_because:     { th: "เพราะคนจะ…",                              en: "because people would…" },
    idea_if_hint:     { th: "เช่น ให้พยาบาล palliative เข้าราวด์ไตทุกสัปดาห์", en: "e.g. have a palliative nurse join the renal round weekly" },
    idea_then_hint:   { th: "เช่น ส่งต่อเร็วขึ้นหลายเดือน",             en: "e.g. referrals happen months earlier" },
    idea_because_hint:{ th: "เช่น หมอไตจะเห็นเธอเป็นทีมเดียวกัน ไม่ใช่คนที่โทรหาเมื่อยอมแพ้", en: "e.g. nephrologists would see her as part of the team, not the person you call when you've given up" },
    send_idea:        { th: "ส่งไอเดีย",                               en: "Add this idea" },
    need_three:       { th: "กรอกทั้งสามช่อง",                          en: "Fill in all three boxes" },
    pick_gap_first:   { th: "เลือกช่องว่างก่อน",                        en: "Pick a gap first" },

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

    // projector
    pj_in_room:       { th: "คนในห้อง",                                  en: "in the room" },
    pj_who:           { th: "ใครอยู่ในห้องนี้",                            en: "Who's in the room" },
    pj_who_sub:       { th: "สองด้านของปัญหาเดียวกัน",                     en: "Two halves of the same problem" },
    pj_evidence:      { th: "ช่องว่างที่หลักฐานชี้ไว้",                     en: "The gaps the evidence points to" },
    pj_evidence_sub:  { th: "และสิ่งที่โครงการเสนอจะทำกับแต่ละช่องว่าง",     en: "And what the program proposes for each" },
    pj_proposal:      { th: "ข้อเสนอ",                                    en: "Proposal" },
    pj_blind_sub:     { th: "ตอบในมือถือ — จะเปิดเผยพร้อมกันเมื่อครบเวลา",  en: "Answer on your phone — revealed together when time is up" },
    pj_answers:       { th: "คำตอบ",                                      en: "answers" },
    pj_helps:         { th: "สิ่งที่จะช่วย",                               en: "What would help" },
    pj_needs:         { th: "สิ่งที่ต้องมี",                               en: "What we'd need" },
    pj_both_said:     { th: "ทั้งสองทีมพูดตรงกัน",                          en: "Both teams said" },
    pj_ideas:         { th: "ไอเดียของพวกเรา",                             en: "Our own ideas" },
    pj_ideas_sub:     { th: "ถ้าเรา… แล้วจะ… เพราะ…",                      en: "If we… then… because…" },
    pj_closing:       { th: "ไม่มีใครเห็นภาพทั้งหมดคนเดียว",                en: "Neither of us had the whole picture" },
    pj_stats:         { th: "{c} เรื่องที่หลุด · {f} สิ่งที่จะช่วย · {b} สิ่งที่ต้องมี · {i} ไอเดีย · {g} ช่องว่างที่ทั้งสองทีมร่วมตอบ",
                        en: "{c} concerns · {f} things that would help · {b} things we'd need · {i} ideas · {g} gaps both teams answered" },
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
