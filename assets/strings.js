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
    why_site:         { th: "ในงานประจำวันของคุณ เรื่องนี้เป็นอย่างไร",        en: "In your own week, which is it?" },
    why_has:          { th: "ยังเจอแบบนี้อยู่",                             en: "I still run into this" },
    why_hasnot:       { th: "ไม่ค่อยเจอ — ที่นี่มีวิธีรับมืออยู่แล้ว",           en: "Rarely — we have a way of handling it" },
    // the fill-in-the-blank, in sentence order:
    //   [gap] เนื่องจาก ในสถานการณ์ ___ · [ใคร] มักจะ ___ · เพราะ ___
    why_lead:         { th: "เติมให้เป็นประโยคเดียว",                          en: "Complete the sentence" },
    works_lead:       { th: "เติมให้เป็นประโยคเดียว",                          en: "Complete the sentence" },
    open_cause:       { th: "เพราะเมื่อ",                                       en: "because when" },
    open_works:       { th: "ไม่ค่อยเจอในงานของเรา เพราะเมื่อ",                     en: "rarely comes up in our work, because when" },
    situ_lbl:         { th: "สถานการณ์ / เงื่อนไข",                              en: "Situation / condition" },
    situ_sub:         { th: "ลองระบุเงื่อนไขที่ทำให้ช่องว่างนี้เกิดขึ้น",            en: "Try to name the conditions under which this gap occurs" },
    situ_cue_time:    { th: "ช่วงเวลา: เกิดขึ้นเมื่อไร หรือในขั้นตอนไหน?",          en: "Time: when, or at which step?" },
    situ_cue_task:    { th: "งาน/กิจกรรม: ขณะทำหน้าที่หรือกิจกรรมอะไร?",            en: "Task: during which duty or activity?" },
    situ_cue_res:     { th: "ทรัพยากร: เมื่อคน เวลา งบประมาณ ข้อมูล หรืออุปกรณ์มีมากน้อยเพียงใด?", en: "Resources: how much staff, time, budget, information or equipment is there?" },
    situ_cue_who:     { th: "คนและกติกา: ใครอยู่ตรงนั้น และมีกติกาหรือตัวชี้วัดอะไรกำกับอยู่?", en: "People and rules: who is there, and what rule or indicator is already in force?" },
    situ_sub_works:   { th: "ลองระบุเงื่อนไขที่ทำให้เรื่องนี้ไม่เป็นปัญหาในงานของคุณ",   en: "Try to name the conditions that keep this from being a problem in your work" },
    who_lbl:          { th: "ใคร",                                            en: "Who" },
    does_lbl:         { th: "มักจะ… (การตอบสนอง)",                              en: "usually… (response)" },
    does_works_lbl:   { th: "จะ… (การตอบสนอง)",                                 en: "will… (response)" },
    because_lbl:      { th: "เนื่องจาก…",                                       en: "because…" },
    situ_hint:        { th: "เช่น วันพุธ คลินิกไต คนล้น 80 ราย มีหมอคนเดียว", en: "e.g. Wednesday renal clinic, 80 patients, one doctor" },
    situ_hint_works:  { th: "เช่น คลินิกไตวันอังคาร มีพยาบาล PC นั่งด้วยทุกสัปดาห์", en: "e.g. Tuesday renal clinic, the PC nurse sits in every week" },
    does_hint:        { th: "เช่น ไม่ได้ประเมินว่าเหมาะกับ CKM หรือไม่",            en: "e.g. doesn't assess whether CKM would suit" },
    does_works_hint:  { th: "เช่น ถาม surprise question และบันทึกทุกครั้ง",        en: "e.g. asks the surprise question and records it every time" },
    because_hint:     { th: "เหตุผล เช่น ไม่มีเกณฑ์ / ไม่มีช่องใน HIS / ไม่มีเวลา / กลัวครอบครัวเข้าใจว่า “ไม่รักษา” / คิดว่าเป็นหน้าที่อีกทีม", en: "the reason, e.g. no criteria / no box in the HIS / no time / afraid the family hears “no treatment” / thinks it's the other team's job" },
    because_works_hint:{ th: "เช่น มีช่องในแบบฟอร์ม และหัวหน้าดูทุกเดือน",         en: "e.g. there's a box on the form and the head checks monthly" },
    preview_lbl:      { th: "ประโยคของคุณ",                                    en: "Your sentence" },
    why_note:         { th: "พูดถึงระบบ ไม่ใช่ตัวบุคคล — ทั้งสองทีมกำลังตอบคำถามเดียวกัน", en: "Talk about the system, not people — both teams are answering the same question" },
    need_all:         { th: "เติมให้ครบทุกช่อง",                             en: "Fill in every blank" },
    pick_who_first:   { th: "เลือก “ใคร” ก่อน",                              en: "Pick who first" },
    why_pick_first:   { th: "เลือกด้านบนก่อน",                              en: "Pick one above first" },
    send_why:         { th: "ส่ง",                                        en: "Send" },

    // practice round
    practice_badge:   { th: "รอบซ้อม",                                       en: "Practice round" },
    practice_note:    { th: "รอบซ้อม — ประโยคเดียวกับของจริง ไม่เก็บเป็นข้อมูล", en: "Practice — the same sentence as the real rounds, and it is not kept as data" },
    situ_hint_p:      { th: "เช่น ประชุมบ่ายสาม วาระ 8 เรื่อง มีผู้บริหารอาวุโสนั่งอยู่ด้วย", en: "e.g. a 3pm meeting, eight items, a senior director in the room" },
    situ_hint_works_p:{ th: "เช่น ประชุมเช้าวันจันทร์ ที่ทุกคนต้องไปราวด์ต่อ 9 โมง",    en: "e.g. Monday morning, when everyone has to be on the ward at nine" },
    does_hint_p:      { th: "เช่น ปล่อยให้เลยเวลาโดยไม่ตัดบท",                       en: "e.g. lets it run past time without cutting in" },
    does_works_hint_p:{ th: "เช่น เตือนเมื่อเหลือ 2 นาที แล้วปิดวาระ",                en: "e.g. warns at two minutes left, then closes the item" },
    because_hint_p:   { th: "เช่น เกรงใจคนอาวุโสที่เตรียมมาพูด และไม่มีใครได้รับมอบหมายให้คุมเวลา", en: "e.g. too polite to stop a senior who prepared, and nobody was given the job of keeping time" },
    because_works_hint_p:{ th: "เช่น ตกลงกติกาเวลากันไว้ล่วงหน้า และหัวหน้าทำตามเอง",  en: "e.g. the rule was agreed beforehand and the boss keeps it" },
    practice_lead:    { th: "เรื่องที่ทุกคนในห้องนี้เคยเจอ ลองเติมให้เป็นประโยคเดียว", en: "Something everyone here has met. Complete the sentence." },

    // HOW round
    how_title:        { th: "แล้วเราจะทำอย่างไร",                        en: "How would we fix it?" },
    // how_seed / how_seed_note: the program's own proposal used to be shown
    // here as a seed. It is not shown to the room any more — anywhere — so
    // that the answers are the room's own. Kept only so an older cached page
    // does not break.
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

    // turn and talk, between the why reveal and the how round
    talk_title:       { th: "คุยกับคนจากอีกทีม",                             en: "Turn and talk" },
    wait_talk:        { th: "หันไปคุยกับคนข้าง ๆ ที่มาจากอีกทีม — ยังไม่ต้องพิมพ์", en: "Turn to someone from the other team — no typing yet" },
    step_talk:        { th: "คุยกัน",                                        en: "Talk" },

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
    pj_practice:      { th: "รอบซ้อม — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา",   en: "Practice round — answer on your phone, revealed together" },
    pj_practice_rev:  { th: "รอบซ้อม — หน้าตาของคำตอบทั้งห้องเป็นแบบนี้",         en: "Practice round — this is what the room's answers look like" },
    pj_talk:          { th: "หันไปคุยกับคนจากอีกทีม",                          en: "Turn to someone from the other team" },
    pj_talk_sub:      { th: "หนึ่งนาที ก่อนจะไปคิดวิธีแก้",                      en: "One minute, before we look for fixes" },
    pj_talk_cue1:     { th: "ที่ของคุณเป็นแบบเดียวกันไหม",                      en: "Is it the same where you work?" },
    pj_talk_cue2:     { th: "อีกทีมเห็นอะไรที่เราไม่เห็น",                       en: "What does the other team see that we don't?" },
    pj_talk_over:     { th: "หมดเวลา — มองที่จอ",                             en: "Time's up — look up" },
    pj_in_room:       { th: "คนในห้อง",                                  en: "in the room" },
    pj_who:           { th: "ใครอยู่ในห้องนี้",                            en: "Who's in the room" },
    pj_who_sub:       { th: "สองด้านของปัญหาเดียวกัน",                     en: "Two halves of the same problem" },
    pj_evidence:      { th: "ช่องว่างที่หลักฐานชี้ไว้",                     en: "The gaps the evidence points to" },
    pj_evidence_sub:  { th: "จากการสำรวจ 16 โรงพยาบาลก่อนวันนี้",           en: "From the pre-survey of 16 hospitals" },
    pj_proposal:      { th: "ข้อเสนอ",                                    en: "Proposal" },
    pj_evidence_lbl:  { th: "จาก pre-survey",                             en: "From the pre-survey" },
    pj_why_blind:     { th: "ทำไมถึงเป็นแบบนี้ในงานประจำวันของคุณ — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา", en: "Why does this happen in your own week? Answer on your phone — revealed together when time is up" },
    pj_how_blind:     { th: "แล้วเราจะทำอย่างไร — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา", en: "How would we fix it? Answer on your phone — revealed together when time is up" },
    pj_why_revealed:  { th: "สาเหตุ จากทั้งสองทีม",                        en: "Causes, from both teams" },
    pj_how_revealed:  { th: "สาเหตุ และสิ่งที่เราจะทำ",                     en: "Causes, and what we would do" },
    pj_answers:       { th: "คำตอบ",                                      en: "answers" },
    pj_causes:        { th: "ทำไมถึงเป็นแบบนี้",                            en: "Why it happens" },
    pj_works:         { th: "ที่ทำได้แล้ว — เพราะอะไร",                      en: "Where it works — and why" },
    pj_solutions:     { th: "เราจะทำอย่างไร",                              en: "What we would do" },
    pj_asset_mark:    { th: "มีอยู่แล้ว",                                  en: "exists" },
    pj_overall:       { th: "ภาพรวม",                                      en: "Overall" },
    pj_closing:       { th: "ไม่มีใครเห็นภาพทั้งหมดคนเดียว",                en: "Neither of us had the whole picture" },
    pj_stats:         { th: "{c} สาเหตุ · {w} ที่ทำได้แล้ว · {a} สิ่งที่มีอยู่แล้ว · {i} สิ่งใหม่ · {g} ช่องว่างที่ทั้งสองทีมร่วมตอบ",
                        en: "{c} causes · {w} where it works · {a} things that already exist · {i} new ideas · {g} gaps both teams answered" },
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
