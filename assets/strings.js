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
    join_role:        { th: "คุณทำหน้าที่อะไร",                       en: "And your role?" },
    join_setting:     { th: "คุณทำงานที่ไหนเป็นหลัก",              en: "Where do you mainly work?" },
    join_anon:        { th: "ไม่เก็บชื่อหรือเบอร์ และไม่มีใครย้อนรู้ได้ว่าข้อความไหนเป็นของคุณ เก็บเพียงทีม หน้าที่ และที่ทำงานหลัก", en: "Anonymous — no name or number is recorded, only team, role and setting. Nothing you write can be traced back to you." },
    join_pick:        { th: "เลือกให้ครบทั้ง 3 ข้อ",                     en: "Choose all three to continue" },
    join_go:          { th: "พร้อมแล้ว — เข้าห้อง",                 en: "I'm in — let's go" },
    join_connecting:  { th: "กำลังเชื่อมต่อ…",                      en: "Connecting…" },
    join_joining:     { th: "กำลังเข้าห้อง…",                       en: "Joining…" },
    join_welcome:     { th: "ยินดีต้อนรับกลับ — กำลังพาไปที่กระดาน", en: "Welcome back — taking you to the board" },
    join_connected:   { th: "เชื่อมต่อแล้ว · ห้อง",                   en: "Connected. Room" },
    join_fail:        { th: "เชื่อมต่อไม่ได้ ลองตรวจสอบ Wi-Fi แล้วดึงหน้าจอลงเพื่อโหลดใหม่", en: "Can't reach the workshop. Check your wifi, then pull down to refresh." },

    // waiting
    wait_title:       { th: "รอเริ่มสักครู่…",                            en: "Waiting to start…" },
    wait_sub:         { th: "เปิดหน้านี้ค้างไว้ คำถามจะขึ้นที่นี่",  en: "Keep this page open. The question will appear here." },
    wait_lobby:       { th: "เข้าห้องแล้ว มองที่จอ — เดี๋ยวเริ่มกัน", en: "You're in. Look up at the screen — we'll start shortly." },
    wait_closed:      { th: "รอบนี้ปิดแล้ว — มองที่จอ",                 en: "That round is closed. Look up at the screen." },
    wait_screen:      { th: "มองที่จอ",                              en: "Look up at the screen." },

    // WHY round
    why_title:        { th: "ทำไมเรื่องนี้ยังเกิดขึ้น",                         en: "Why is this happening?" },
    why_site:         { th: "ในงานของคุณช่วงนี้ เจอเรื่องนี้บ่อยแค่ไหน",        en: "In your own week, which is it?" },
    why_has:          { th: "ยังเจออยู่",                             en: "I still run into this" },
    why_hasnot:       { th: "ไม่ค่อยเจอ เพราะมีวิธีที่ใช้ได้อยู่แล้ว",           en: "Rarely — we have a way of handling it" },
    // the fill-in-the-blank, in sentence order:
    //   [gap] เนื่องจาก ในสถานการณ์ ___ · [ใคร] มักจะ ___ · เพราะ ___
    why_lead:         { th: "เติมให้ครบเป็นประโยคเดียว",                          en: "Complete the sentence" },
    works_lead:       { th: "เติมให้ครบเป็นประโยคเดียว",                          en: "Complete the sentence" },
    open_cause:       { th: "ยังเจอในงานของเรา",                                 en: "still shows up in our work" },
    open_works:       { th: "ไม่ค่อยเจอในงานของเรา",                              en: "rarely comes up in our work" },
    situ_lbl:         { th: "เมื่อ…",                        en: "when… (situation / condition)" },
    situ_sub:         { th: "เรื่องนี้มักเกิดตอนไหน — บอกให้เห็นภาพว่าเมื่อไร ที่ไหน และตอนนั้นเป็นอย่างไร",      en: "When is it like that? Name the conditions that bring it about" },
    situ_cue_time:    { th: "เกิดขึ้นช่วงไหน หรือขั้นตอนไหนของงาน",          en: "Time: when, or at which step?" },
    situ_cue_task:    { th: "ตอนนั้นกำลังทำงานอะไร",            en: "Task: during which duty or activity?" },
    situ_cue_res:     { th: "ตอนนั้นมีคน เวลา ข้อมูล และอุปกรณ์เพียงพอไหม", en: "Resources: how much staff, time, budget, information or equipment is there?" },
    situ_cue_who:     { th: "ตอนนั้นมีใครอยู่บ้าง และมีข้อตกลงหรือข้อกำหนดอะไรใช้อยู่", en: "People and rules: who is there, and what rule or indicator is already in force?" },
    situ_sub_works:   { th: "เรื่องนี้ไม่ค่อยเกิดตอนไหน — บอกให้เห็นภาพว่าเมื่อไร ที่ไหน และตอนนั้นเป็นอย่างไร",        en: "When is it like that? Name the conditions that make it work" },
    // the words that join the blanks into one sentence. They are used by the
    // phone's live preview, by the echo of your own notes and by the notes on
    // the projector, so all three always read the same.
    conn_does:        { th: "มักจะ",                                          en: "usually" },
    conn_when:        { th: "เมื่อ",                                          en: "when" },
    conn_because:     { th: "เพราะ",                                          en: "because" },

    who_lbl:          { th: "ใคร",                                            en: "Who" },
    does_lbl:         { th: "มักจะ…",                              en: "usually… (response)" },
    does_works_lbl:   { th: "มักจะ…",                                 en: "will… (response)" },
    because_lbl:      { th: "เพราะ…",                                       en: "because…" },
    situ_hint:        { th: "เช่น คลินิกไตวันพุธ ผู้ป่วย 80 ราย มีแพทย์คนเดียว", en: "e.g. Wednesday renal clinic, 80 patients, one doctor" },
    situ_hint_works:  { th: "เช่น คลินิกไตวันอังคาร มีพยาบาล PC มาร่วมทุกสัปดาห์", en: "e.g. Tuesday renal clinic, the PC nurse sits in every week" },
    does_hint:        { th: "เช่น ไม่ได้ประเมินว่าเหมาะกับ CKM หรือไม่",            en: "e.g. doesn't assess whether CKM would suit" },
    does_works_hint:  { th: "เช่น ถาม surprise question และบันทึกทุกครั้ง",        en: "e.g. asks the surprise question and records it every time" },
    because_hint:     { th: "เช่น ไม่มีเกณฑ์ร่วมกัน / ไม่มีช่องใน HIS / เวลาต่อรายน้อย / กลัวครอบครัวเข้าใจว่า “ไม่รักษา” / คิดว่าอีกทีมเป็นคนทำ", en: "the reason, e.g. no criteria / no box in the HIS / no time / afraid the family hears “no treatment” / thinks it's the other team's job" },
    because_works_hint:{ th: "เช่น มีช่องในแบบฟอร์ม และหัวหน้าติดตามทุกเดือน",         en: "e.g. there's a box on the form and the head checks monthly" },
    // a finished chain in the same grammar, kept on screen while they write
    worked_lbl:       { th: "ตัวอย่างเมื่อเติมครบ",                            en: "See one finished sentence" },
    worked_cause:     { th: "“โรงพยาบาลยังไม่มีระบบคัดกรองผู้ป่วยที่เหมาะกับ CKM — <b>ยังเจอในงานของเรา</b>: <b>แพทย์โรคไต มักจะ</b> ไม่ได้ประเมินว่าใครเหมาะกับ CKM <b>เมื่อ</b> คลินิกไตวันพุธมีผู้ป่วย 80 ราย และมีแพทย์คนเดียว <b>เพราะ</b> ไม่มีเกณฑ์ที่ตกลงกันไว้ และไม่มีช่องให้บันทึกใน HIS”",
                        en: "“The nephrologist usually doesn't assess who CKM would suit, when the Wednesday clinic has 80 patients and one doctor, because there are no agreed criteria and no box to record it in the HIS.”" },
    worked_works:     { th: "“โรงพยาบาลยังไม่มีระบบคัดกรองผู้ป่วยที่เหมาะกับ CKM — <b>ไม่ค่อยเจอในงานของเรา</b>: <b>พยาบาลไต มักจะ</b> ชวนคุยเรื่องทางเลือกตั้งแต่ stage 4 <b>เมื่อ</b> คลินิกไตวันอังคารมีพยาบาล PC มาร่วมทุกสัปดาห์ <b>เพราะ</b> มีช่องในแบบฟอร์ม และหัวหน้าติดตามทุกเดือน”",
                        en: "“The renal nurse opens the options conversation at stage 4, when the Tuesday clinic has the PC nurse sitting in, because there's a box on the form and the head checks monthly.”" },
    worked_cause_p:   { th: "“งานด่วนมักแจ้งวันนี้และให้เริ่มพรุ่งนี้ — <b>ยังเจอในงานของเรา</b>: <b>คนทำงานหน้างาน มักจะ</b> ทำไปก่อนทั้งที่ยังไม่แน่ใจว่าต้องทำอย่างไร <b>เมื่อ</b> มีข้อความส่งต่อกันหลายทอดตอนเย็น และให้เริ่มใช้เช้าวันถัดไป <b>เพราะ</b> ไม่มีคนสรุปว่างานเปลี่ยนตรงไหน ใครต้องทำ และถ้าสงสัยให้ถามใคร”",
                        en: "“The 3pm meeting with eight items and a senior director in the room: the chair lets it run over, because nobody wants to cut off a senior who prepared, and nobody was given the job of keeping time.”" },
    worked_works_p:   { th: "“งานด่วนมักแจ้งวันนี้และให้เริ่มพรุ่งนี้ — <b>ไม่ค่อยเจอในงานของเรา</b>: <b>ผู้ประสานงาน มักจะ</b> สรุปสิ่งที่ต้องทำ ผู้รับผิดชอบ และช่องทางถามกลับ <b>เมื่อ</b> มีเรื่องใหม่ที่ต้องเริ่มใช้ภายในวันถัดไป <b>เพราะ</b> ทีมตกลงไว้ชัดว่าใครรับเรื่อง ใครแปลงเป็นงาน และใครยืนยันก่อนเริ่มใช้”",
                        en: "“…rarely happens on Monday mornings when everyone is due on the ward at nine: the secretary warns at two minutes and closes the item, because the rule was agreed beforehand and the boss keeps it.”" },
    situ_nudge:       { th: "ช่วยเล่าให้เห็นภาพอีกนิดได้ไหม — เกิดเมื่อไร ที่ไหน และตอนนั้นมีใครอยู่บ้าง", en: "Could you make it a bit more concrete — when, where, who was there?" },

    preview_lbl:      { th: "ประโยคของคุณ",                                    en: "Your sentence" },
    why_note:         { th: "เล่าว่างานเกิดขึ้นอย่างไร ไม่ใช่ตัดสินว่าใครผิด — ทั้งสองทีมกำลังตอบเรื่องเดียวกัน", en: "Talk about the system, not people — both teams are answering the same question" },
    need_all:         { th: "เติมให้ครบทุกช่อง",                             en: "Fill in every blank" },
    pick_who_first:   { th: "เลือก “ใคร” ก่อน",                              en: "Start by tapping who" },
    why_pick_first:   { th: "เลือกคำตอบด้านบนก่อน",                              en: "Pick one above first" },
    send_why:         { th: "ส่ง",                                        en: "Send" },

    // practice round
    practice_badge:   { th: "รอบซ้อม",                                       en: "Practice round" },
    practice_note:    { th: "รอบซ้อม — ใช้ประโยคเดียวกับรอบจริง แต่ไม่นำคำตอบไปรวมกับรอบจริง", en: "Practice — the same sentence as the real rounds, and it is not kept as data" },
    situ_hint_p:      { th: "เช่น มีข้อความส่งต่อกันหลายทอดตอนเย็น และให้เริ่มใช้เช้าวันถัดไป", en: "e.g. a 3pm meeting, eight items, a senior director in the room" },
    situ_hint_works_p:{ th: "เช่น มีเรื่องใหม่ที่ต้องเริ่มใช้ภายในวันถัดไป และมีผู้ประสานงานรับเรื่องชัดเจน",    en: "e.g. Monday morning, when everyone has to be on the ward at nine" },
    does_hint_p:      { th: "เช่น ทำไปก่อนทั้งที่ยังไม่แน่ใจว่าต้องทำอย่างไร",                       en: "e.g. lets it run past time without cutting in" },
    does_works_hint_p:{ th: "เช่น สรุปสิ่งที่ต้องทำ ผู้รับผิดชอบ และช่องทางถามกลับ",                en: "e.g. warns at two minutes left, then closes the item" },
    because_hint_p:   { th: "เช่น ไม่มีคนสรุปว่างานเปลี่ยนตรงไหน ใครต้องทำ และถ้าสงสัยให้ถามใคร", en: "e.g. too polite to stop a senior who prepared, and nobody was given the job of keeping time" },
    because_works_hint_p:{ th: "เช่น ทีมตกลงไว้ชัดว่าใครรับเรื่อง ใครแปลงเป็นงาน และใครยืนยันก่อนเริ่มใช้",  en: "e.g. the rule was agreed beforehand and the boss keeps it" },
    practice_lead:    { th: "เรื่องคุ้น ๆ ในระบบสุขภาพไทย — ลองเติมให้ครบเป็นประโยคเดียว", en: "Something everyone here has met. Complete the sentence." },

    // HOW round
    how_title:        { th: "แล้วเราจะทำอะไร",                        en: "How would we fix it?" },
    // how_seed / how_seed_note: the program's own proposal used to be shown
    // here as a seed. It is not shown to the room any more — anywhere — so
    // that the answers are the room's own. Kept only so an older cached page
    // does not break.
    how_seed:         { th: "โครงการเสนอไว้ว่า",                          en: "The program proposes" },
    how_seed_note:    { th: "ต่อยอดจากข้อนี้ หรือเสนอวิธีอื่นก็ได้",             en: "Build on it, or propose something else" },
    how_pick:         { th: "สิ่งที่คุณเสนอเป็น",                        en: "What you're proposing is" },
    how_asset:        { th: "สิ่งที่มีอยู่แล้ว — นำมาใช้ให้มากขึ้น",         en: "Something that already exists here — use it more" },
    how_new:          { th: "สิ่งใหม่ที่ควรเริ่มทำ",                            en: "Something new we should do" },
    how_what:         { th: "คืออะไร",                                    en: "What is it?" },
    how_why:          { th: "ทำไมวิธีนี้จึงน่าจะใช้ได้ที่โรงพยาบาลของคุณ",             en: "Why would it work at your hospital?" },
    how_what_hint_a:  { th: "เช่น พยาบาล PC ที่รู้จักทีมไตอยู่แล้ว",          en: "e.g. The PC nurse who already knows the renal team" },
    how_why_hint_a:   { th: "เช่น เริ่มจากความไว้ใจกันที่มีอยู่แล้ว", en: "e.g. It starts from trust that already exists" },
    how_what_hint_n:  { th: "เช่น ให้พยาบาลไตเปิดเรื่องทางเลือกตั้งแต่ stage 4", en: "e.g. Have the renal nurse open the options conversation at stage 4" },
    how_why_hint_n:   { th: "เช่น ครอบครัวคุ้นเคยและไว้ใจพยาบาลไต",     en: "e.g. Families trust the renal nurse more than a stranger" },
    send_how:         { th: "ส่งข้อเสนอ",                                   en: "Send" },
    how_pick_first:   { th: "เลือกด้านบนก่อน",                              en: "Pick one above first" },
    need_both:        { th: "กรอกทั้งสองช่อง",                              en: "Fill in both boxes" },
    overall_title:    { th: "ภาพรวม",                                       en: "Overall" },
    overall_sub:      { th: "สิ่งที่ควรทำร่วมกัน ซึ่งไม่เจาะจงช่องว่างเรื่องใดเรื่องหนึ่ง", en: "Something we should do that isn't about one gap" },

    // sending
    sending:          { th: "กำลังส่ง…",                               en: "Adding…" },
    at_limit:         { th: "ข้อนี้ส่งครบแล้ว — ขอบคุณ",              en: "That's all for this one — thank you" },
    cooling:          { th: "สักครู่…",                                 en: "Just a moment…" },
    sent_ok:          { th: "ส่งแล้ว — มองที่จอ",                         en: "Added. Look up at the screen." },
    sent_queued:      { th: "เก็บไว้ในเครื่องแล้ว และจะส่งให้เมื่อสัญญาณกลับมา", en: "Saved on your phone — it'll send itself when the signal comes back" },
    sent_fail:        { th: "ยังส่งไม่ได้ — ลองอีกครั้ง",                  en: "That didn't go through. Try again." },
    lost:             { th: "สัญญาณขาด — กำลังลองใหม่ ข้อความที่พิมพ์ไว้ยังอยู่", en: "Lost connection — still trying. Anything you write is kept safe." },
    mine_one:         { th: "คุณส่งแล้ว 1 ข้อ",                          en: "You've added 1 note" },
    mine_n:           { th: "คุณส่งแล้ว {n} ข้อ",                        en: "You've added {n} notes" },

    // turn and talk, between the why reveal and the how round
    talk_title:       { th: "คุยกับคนจากอีกทีม",                             en: "Turn and talk" },
    wait_talk:        { th: "คุยกับคนข้าง ๆ ที่มาจากอีกทีม — ยังไม่ต้องพิมพ์", en: "Turn to someone from the other team — no typing yet" },
    step_talk:        { th: "คุยกัน",                                        en: "Talk" },

    // step strip and between-round text
    step_gap:         { th: "ช่องว่าง",                                  en: "Gap" },
    step_why:         { th: "ทำไม",                                      en: "Why" },
    step_how:         { th: "ทำอย่างไร",                                  en: "How" },
    step_overall:     { th: "ภาพรวม",                                    en: "Overall" },
    gaps_intro:       { th: "ช่องว่าง 4 เรื่องที่เราจะคุยกันวันนี้ — ทีละเรื่อง ว่าทำไมจึงเกิดขึ้น แล้วจะทำอะไร", en: "The four gaps we'll work through today — one at a time: why it happens, then what we'd do" },
    reveal_why:       { th: "มองที่จอ — ดูเหตุจากทั้งสองทีม แล้วค่อยคิดว่าจะทำอย่างไร", en: "Look at the screen — causes from both teams; next: how to fix it" },
    reveal_how:       { th: "มองที่จอ — ต่อไปเป็นช่องว่างเรื่องถัดไป",              en: "Look at the screen — next gap coming up" },
    wait_closing:     { th: "ขอบคุณ — เมื่อเอาสิ่งที่ทั้งสองทีมเห็นมาต่อกัน ภาพที่ขาดไปก็ชัดขึ้น เราจะรวบรวมและส่งกลับให้ทุกทีม", en: "Thank you — what you wrote is the missing piece. We'll gather it all and send a summary back to both teams." },
    draft_kept:       { th: "ข้อความที่พิมพ์ไว้ยังอยู่ และส่งได้หากเปิดรอบนี้อีกครั้ง", en: "What you were typing is kept — you can send it if the round reopens" },

    // projector
    pj_practice:      { th: "รอบซ้อม — ตอบในมือถือ แล้วเปิดพร้อมกันเมื่อหมดเวลา",   en: "Practice round — answer on your phone, revealed together" },
    pj_practice_rev:  { th: "รอบซ้อม — นี่คือคำตอบจากทั้งห้อง",         en: "Practice round — this is what the room's answers look like" },
    // pj_talk: no longer on the talk slide — the gap is its title and the
    // instruction sits in the middle. Kept for an older cached page.
    pj_talk:          { th: "หันไปคุยกับคนจากอีกทีม",                          en: "Turn to someone from the other team" },
    pj_talk_sub:      { th: "ลองชวนคนข้าง ๆ คุย",                      en: "Talk to the person next to you" },
    pj_talk_cue1:     { th: "ที่โรงพยาบาลของคุณเป็นแบบเดียวกันไหม",                      en: "Is it the same where you work?" },
    pj_talk_cue2:     { th: "อีกทีมเห็นอะไรที่ทีมเราไม่เห็น",                       en: "What does the other team see that we don't?" },
    pj_talk_over:     { th: "หมดเวลา — มองที่จอ",                             en: "Time's up — look up" },
    pj_in_room:       { th: "คนในห้อง",                                  en: "in the room" },
    pj_who:           { th: "ใครอยู่ในห้องนี้",                            en: "Who's in the room" },
    pj_who_sub:       { th: "สองมุมของเรื่องเดียวกัน",                     en: "Two halves of the same problem" },
    pj_evidence:      { th: "ช่องว่างสี่เรื่องที่เราจะคุยกันวันนี้",                  en: "The four gaps we'll work through today" },
    pj_evidence_sub:  { th: "ทีละเรื่อง — ทำไมจึงเกิดขึ้น แล้วจะทำอะไร",   en: "One at a time: why it happens, then what we'd do" },
    pj_proposal:      { th: "ข้อเสนอ",                                    en: "Proposal" },
    // pj_evidence_lbl: no longer shown anywhere. Kept so an older cached page
    // does not break.
    pj_evidence_lbl:  { th: "",                                            en: "" },
    pj_why_blind:     { th: "ทำไมเรื่องนี้ยังเกิดขึ้นในงานของคุณ — ตอบในมือถือ แล้วเปิดพร้อมกันเมื่อหมดเวลา", en: "Why does this happen in your own week? Answer on your phone — revealed together when time is up" },
    pj_how_blind:     { th: "แล้วเราจะทำอะไร — ตอบในมือถือ แล้วเปิดพร้อมกันเมื่อหมดเวลา", en: "How would we fix it? Answer on your phone — revealed together when time is up" },
    pj_why_revealed:  { th: "เหตุที่เรื่องนี้ยังเกิด — จากทั้งสองทีม",                        en: "Causes, from both teams" },
    pj_how_revealed:  { th: "เหตุที่เกิด และสิ่งที่เราจะทำ",                     en: "Causes, and what we would do" },
    pj_key_cause:     { th: "สีทอง = ยังเจอในงานของเรา",                     en: "gold = still happens here" },
    pj_key_works:     { th: "สีชมพู = ไม่ค่อยเจอในงานของเรา",                    en: "pink = rarely happens here" },
    pj_key_idea:      { th: "สีชมพู = สิ่งใหม่ที่ควรเริ่มทำ",                    en: "pink = something new" },
    pj_key_asset:     { th: "สีเขียว = สิ่งที่มีอยู่แล้วที่นี่",                    en: "green = already exists here" },
    pj_key_practice:  { th: "สีเทา = รอบซ้อม ไม่เก็บเป็นข้อมูล",                 en: "grey = practice round, not kept" },
    pj_key_fold:      { th: "มุมพับ = ทีมประคับประคอง",                        en: "folded corner = palliative care" },
    pj_reader_close:  { th: "คลิกที่ใดก็ได้เพื่อปิด",                            en: "click anywhere to close" },
    pj_none_yet:      { th: "ยังไม่มีคำตอบในช่องนี้",                          en: "nothing here yet" },
    pj_answers:       { th: "คำตอบ",                                      en: "answers" },
    pj_causes:        { th: "ทำไมถึงเป็นแบบนี้",                            en: "Why it happens" },
    pj_works:         { th: "ที่ไม่ค่อยเจอ — เพราะอะไร",                      en: "Where it works — and why" },
    pj_solutions:     { th: "สิ่งที่เราจะทำ",                              en: "What we would do" },
    pj_asset_mark:    { th: "มีอยู่แล้ว",                                  en: "exists" },
    pj_overall:       { th: "ภาพรวม",                                      en: "Overall" },
    pj_closing:       { th: "ไม่มีทีมไหนเห็นภาพทั้งหมดเพียงลำพัง",                en: "Neither of us had the whole picture" },
    pj_stats:         { th: "{c} เหตุที่ยังเกิด · {w} ที่ไม่ค่อยเจอ · {a} สิ่งที่มีอยู่แล้ว · {i} สิ่งใหม่ · {g} ช่องว่างที่ทั้งสองทีมร่วมตอบ",
                        en: "{c} causes · {w} where it works · {a} things that already exist · {i} new ideas · {g} gaps both teams answered" },
    pj_signup:        { th: "อยากเล่าเพิ่มไหม — สแกนเพื่อนัดคุยต่อ",     en: "Willing to talk more? Scan to leave your contact" },
    pj_waiting_gaps:  { th: "กำลังโหลดช่องว่างจากแผงควบคุม…",                   en: "Waiting for the gaps to be loaded from the control panel…" },
    pj_concerns:      { th: "เรื่องที่ยังติดขัด",                               en: "concerns" },
    pj_from_nephro:   { th: "จากทีมโรคไต",                                 en: "from nephrology" },
    pj_from_pall:     { th: "จากทีมประคับประคอง",                          en: "from palliative care" },
    pj_word_cloud:    { th: "คำที่พบมาก",                                     en: "Word cloud" },
    pj_wall:          { th: "กระดานคำตอบ",                                   en: "Post-it wall" },
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
