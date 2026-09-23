# Thai language review — “The Missing Piece” (ชิ้นส่วนที่หายไป)

You are a Thai-language editor with a clinical background. You are rewriting
the Thai in a live workshop tool. Everything below is what real participants
read on a phone or see on a projector. Nothing here is documentation: every
line is read once, quickly, by a tired person in a room.

Return your answer in the two blocks described under **WHAT TO RETURN**. Do
not explain your reasoning outside the final table.

---

## THE SITUATION THE WORDS LIVE IN

- **Who reads this:** about 150 Thai clinicians — nephrology teams and
  palliative care teams from 16 pilot hospitals. Doctors, nurses and allied
  health, from big central hospitals down to community hospitals. Seniority
  ranges from residents to department heads.
- **Where:** a 45-minute session. The projector is at the front; everyone
  answers on their own phone, standing or sitting in a crowded room. Many are
  typing Thai on a phone for the first time that day, in a hurry, with the
  facilitator waiting.
- **What they are doing:** for each of four gaps in how the two teams work
  together, they write one sentence about why it happens where they work, then
  one about what they would do. Answers are anonymous and are shown on the
  projector afterwards, in front of colleagues.
- **The tone that is wanted:** a respected colleague running a good meeting.
  Warm, plain, confident, brief. Not a government form, not a training module,
  not marketing, not chatty.
- **The tone that must be avoided:** anything that sounds like blame, like a
  test, or like an academic instrument. People must not feel they are being
  audited, and must not feel they are filling in a research questionnaire.

## HARD CONSTRAINTS

1. **No research vocabulary, in any language.** The tool is built on a
   specific social-science method, but participants must never meet its
   vocabulary. Do not use — and do not invent Thai equivalents for — words
   meaning *context / mechanism / outcome / theory / hypothesis / variable /
   framework / barrier–facilitator / data collection / respondent /
   intervention*. If a line currently smells of research, rewrite it as
   something a colleague would say out loud.
2. **Thai only.** English is allowed only for clinical terms already used
   daily in these wards: CKM, ACP, CKD, ESKD, HD, PD, KT, PC, HIS, pathway,
   consult, joint clinic, case conference, stage 4–5, surprise question.
   Do not introduce new English words.
3. **Keep every key exactly as it is.** You are replacing values, never keys,
   never adding or removing keys.
4. **Keep the placeholders and the mark-up.** `{n}` must survive. `<b>…</b>`
   inside the worked-example strings must survive and must still wrap the
   connecting words of the sentence.
5. **Length.** Phone labels: at most one short line. Hints (`*_hint`):
   short enough to sit inside an input box on a 375px screen without
   wrapping more than twice. Projector lines: readable at 10 metres, so the
   shorter the better.
6. **Do not change the four gap statements, their survey numbers or the
   programme proposals** (listed under FIXED CONTENT). They come from the
   hospitals' own survey and are already agreed.
7. If you think a line is wrong in substance rather than in language, do not
   silently fix it — rewrite the language and flag it in the final table.

---

## TASK 1 — REPLACE THE PRACTICE CASE

The session opens with a four-minute warm-up round on something harmless, run
through exactly the same machinery as the real rounds: the same sentence, the
same blind collection, the same reveal. Its job is to teach the sentence, to
break the ice, and to prove every phone in the room can reach the board.

**The current case is a meeting that overruns. It is not working. Replace it.**

A replacement must satisfy all of these:

- **Everyone in the room has lived it**, whatever their hospital, discipline
  or seniority.
- **Nobody in the room is blamed by it.** Ideally everyone is slightly
  complicit, which is what makes it funny rather than pointed.
- **It is not about a clinical decision**, so nobody feels examined, and no
  discipline looks worse than the other.
- **Its causes are about how work is organised** — who was given a job, what
  was agreed, what gets recorded, who is in the room, what the timetable is.
  A case whose causes are a broken machine, a building, or the weather is
  useless: it teaches the wrong kind of answer, which is why the previous
  attempt (a hospital lift that never comes) was rejected.
- **It has an honest opposite.** Some wards genuinely do not have this
  problem, and the people from those wards must be able to say why.
- **It fits the sentence below without strain.**

Propose **three candidates**, one line each, then pick one and give:

- `label` — the case as a short statement, the way the four real gaps are
  written (see FIXED CONTENT for their style). One line.
- `problem` — one short line marking it as the warm-up.
- `actors` — six short chips for the *ใคร* tap, mirroring the shape of the
  clinical list: someone senior, someone doing the task, the people on the
  receiving end, someone who organises, the system/management, and อื่น ๆ.
- **A worked chain** for both directions — the `worked_cause_p` and
  `worked_works_p` strings — using the four blanks.
- **Four example hints** — `situ_hint_p`, `situ_hint_works_p`, `does_hint_p`,
  `does_works_hint_p`, `because_hint_p`, `because_works_hint_p` — each a
  concrete phrase, not a category. “ไม่มีเวลา” is a category; “บ่ายสามที่มี
  วาระแปดเรื่อง” is a situation.

## TASK 2 — REWRITE THE THAI EVERYWHERE

Go through every string below. Rewrite anything that is stiff, ambiguous,
over-long, or that reads as research language. Leave a string exactly as it is
if it is already right — an unchanged line is a valid answer and is better
than a change for its own sake.

Watch for these specifically:

- **The sentence the whole session is built on.** Participants complete:

  > **[ช่องว่าง] — ยังเจอในงานของเรา: [ใคร] มักจะ [ทำอะไร] เมื่อ [สถานการณ์] เนื่องจาก [เหตุผล]**

  and, for those who rarely meet it:

  > **[ช่องว่าง] — ไม่ค่อยเจอในงานของเรา: [ใคร] จะ [ทำอะไร] เมื่อ [สถานการณ์] เนื่องจาก [เหตุผล]**

  The four blanks are asked in that order: ใคร is a tap, then what they do,
  then when it is like that, then why. The connecting words (`open_cause`,
  `open_works`, `does_lbl`, `does_works_lbl`, `situ_lbl`, `because_lbl`) must
  make one grammatical Thai sentence when the blanks are filled, and must also
  read naturally on the projector afterwards. **This is the single most
  important thing to get right.** If a different set of connecting words makes
  a more natural Thai sentence while keeping the same four slots in the same
  order, propose it.

- **`situ_sub` and the four cues (`situ_cue_*`)** decide what people write in
  the hardest blank. They must invite a concrete, picturable situation — when,
  where, who was there, what was already in force — without asking anyone to
  classify anything.

- **`situ_nudge`** appears when someone answers that blank with a category
  (“คนไม่พอ”). It must feel like a colleague leaning over, never like
  validation failure.

- **The two choices in the WHY round** (`why_site`, `why_has`, `why_hasnot`)
  ask about the person's own working week, not about what their hospital has
  on paper. Someone who does not know whether a written pathway exists must
  still be able to answer honestly.

- **`join_anon`** is the anonymity promise. It must be believable and
  unhedged; people decide how honest to be based on this one line.

- **`wait_closing`** is the last thing anyone reads. It should land.

---

## FIXED CONTENT — do not rewrite, given so the register matches

**Workshop title:** ชิ้นส่วนที่หายไป · **subtitle:** ตามหาช่องว่างระหว่างทีมโรคไตและทีมประคับประคอง


**The four gaps (participants see these exact words):**


- **G1** โรงพยาบาลยังไม่มีระบบคัดกรองผู้ป่วยที่เหมาะกับ CKM
  - the survey number shown under it: มีระบบชัดเจนใช้ประจำ 2 จาก 16 รพ. · “มีบ้าง ขึ้นกับแพทย์/ทีม” 14 จาก 24 ผู้ตอบ

- **G2** CKD clinic ยังไม่มีระบบส่งต่อผู้ป่วยไปทีม PC
  - the survey number shown under it: มี pathway และ workflow ชัดเจน 5 จาก 16 รพ. · ส่งปรึกษาเป็นรายกรณี 17 จาก 24 ผู้ตอบ

- **G3** ทีมไตและทีม PC ยังทำงานร่วมกันเฉพาะผู้ป่วยซับซ้อน
  - the survey number shown under it: บูรณาการระดับ 3–4 7 จาก 16 รพ. · ระดับ 1–2 13 จาก 24 ผู้ตอบ · joint clinic 5 รพ. case conference 1 รพ.

- **G4** การทำ ACP ยังจำกัดเฉพาะผู้ป่วยที่เลือก CKM และเริ่มเมื่ออาการทรุดแล้ว
  - the survey number shown under it: ทำ ACP ทุกทางเลือก 1 จาก 16 รพ. · เฉพาะ CKM 17 จาก 24 ผู้ตอบ · เริ่มก่อนตัดสินใจ KRT 5 จาก 24


**Who is in the room (tap lists on the join screen):**

- teams: ทีมโรคไต · ทีมประคับประคอง
- roles: แพทย์ · พยาบาล · สหวิชาชีพ · อื่น ๆ
- settings: หน่วยไตเทียม · หอผู้ป่วยใน · ผู้ป่วยนอก · ชุมชน–เยี่ยมบ้าน · อื่น ๆ

**The ใคร chips in the real rounds:** แพทย์โรคไต · พยาบาลไต · แพทย์ประคับประคอง · พยาบาลประคับประคอง · ผู้ป่วย/ครอบครัว · ระบบ/ผู้บริหาร รพ. · อื่น ๆ


**The practice case as it stands now (this is what you are replacing):**

- label: การประชุมมักจบช้ากว่าเวลาที่นัดไว้
- problem: รอบซ้อม — เรื่องที่ทุกคนในห้องนี้เคยเจอ
- actors: ประธาน/หัวหน้า · คนนำเสนอ · ผู้เข้าร่วมประชุม · เลขา/ผู้จัดประชุม · ระบบ/ผู้บริหาร รพ. · อื่น ๆ


---

## THE STRINGS


Each row is `key` · the Thai as it stands · what it is in English (for your understanding only — it is never shown to participants).


### Join screen (phone, before the session)

| key | Thai now | what it is |
|---|---|---|
| `join_team` | คุณอยู่ทีมไหน | Which team are you part of? |
| `join_role` | ตำแหน่งของคุณ | And your role? |
| `join_setting` | คุณทำงานที่ไหนเป็นหลัก | Where do you mainly work? |
| `join_anon` | ไม่ระบุตัวตน — ไม่มีการบันทึกชื่อหรือเบอร์ เก็บเฉพาะทีม ตำแหน่ง และหน่วยงาน สิ่งที่คุณเขียนจะไม่ถูกโยงกลับมาหาคุณ | Anonymous — no name or number is recorded, only team, role and setting. Nothing you write can be traced back to you. |
| `join_pick` | เลือกให้ครบก่อน | Choose all three to continue |
| `join_go` | พร้อมแล้ว — เข้าห้อง | I'm in — let's go |
| `join_connecting` | กำลังเชื่อมต่อ… | Connecting… |
| `join_joining` | กำลังเข้าห้อง… | Joining… |
| `join_welcome` | ยินดีต้อนรับกลับ — กำลังพาไปที่กระดาน | Welcome back — taking you to the board |
| `join_connected` | เชื่อมต่อแล้ว ห้อง | Connected. Room |
| `join_fail` | เชื่อมต่อไม่ได้ ตรวจสอบ wifi แล้วดึงหน้าจอลงเพื่อโหลดใหม่ | Can't reach the workshop. Check your wifi, then pull down to refresh. |
| `wait_lobby` | เข้าห้องแล้ว มองที่จอ — เดี๋ยวเริ่มกัน | You're in. Look up at the screen — we'll start shortly. |

### Waiting / between rounds (phone)

| key | Thai now | what it is |
|---|---|---|
| `wait_title` | รอสักครู่… | Waiting to start… |
| `wait_sub` | เปิดหน้านี้ค้างไว้ คำถามจะปรากฏที่นี่ | Keep this page open. The question will appear here. |
| `wait_closed` | รอบนี้ปิดแล้ว มองที่จอ | That round is closed. Look up at the screen. |
| `wait_screen` | มองที่จอ | Look up at the screen. |
| `wait_talk` | หันไปคุยกับคนข้าง ๆ ที่มาจากอีกทีม — ยังไม่ต้องพิมพ์ | Turn to someone from the other team — no typing yet |
| `gaps_intro` | ช่องว่างสี่เรื่องจาก pre-survey ของ 16 โรงพยาบาล — เราจะไปทีละเรื่อง: ทำไมถึงเป็นแบบนี้ แล้วจะแก้อย่างไร | Four gaps from the pre-survey of 16 hospitals — one at a time: why it happens, then how to fix it |
| `reveal_why` | ดูที่จอ — สาเหตุจากทั้งสองทีม แล้วต่อด้วย: จะแก้อย่างไร | Look at the screen — causes from both teams; next: how to fix it |
| `reveal_how` | ดูที่จอ — เดี๋ยวไปช่องว่างถัดไป | Look at the screen — next gap coming up |
| `wait_closing` | ขอบคุณ — สิ่งที่คุณเขียนคือชิ้นส่วนที่หายไป เราจะรวบรวมทั้งหมดและส่งสรุปกลับให้ทั้งสองทีม | Thank you — what you wrote is the missing piece. We'll gather it all and send a summary back to both teams. |
| `draft_kept` | ข้อความที่พิมพ์ค้างไว้ยังอยู่ — จะส่งได้เมื่อรอบเปิดอีกครั้ง | What you were typing is kept — you can send it if the round reopens |

### Practice round (phone)

| key | Thai now | what it is |
|---|---|---|
| `practice_badge` | รอบซ้อม | Practice round |
| `practice_note` | รอบซ้อม — ประโยคเดียวกับของจริง ไม่เก็บเป็นข้อมูล | Practice — the same sentence as the real rounds, and it is not kept as data |
| `situ_hint_p` | เช่น ประชุมบ่ายสาม วาระ 8 เรื่อง มีผู้บริหารอาวุโสนั่งอยู่ด้วย | e.g. a 3pm meeting, eight items, a senior director in the room |
| `situ_hint_works_p` | เช่น ประชุมเช้าวันจันทร์ ที่ทุกคนต้องไปราวด์ต่อ 9 โมง | e.g. Monday morning, when everyone has to be on the ward at nine |
| `does_hint_p` | เช่น ปล่อยให้เลยเวลาโดยไม่ตัดบท | e.g. lets it run past time without cutting in |
| `does_works_hint_p` | เช่น เตือนเมื่อเหลือ 2 นาที แล้วปิดวาระ | e.g. warns at two minutes left, then closes the item |
| `because_hint_p` | เช่น เกรงใจคนอาวุโสที่เตรียมมาพูด และไม่มีใครได้รับมอบหมายให้คุมเวลา | e.g. too polite to stop a senior who prepared, and nobody was given the job of keeping time |
| `because_works_hint_p` | เช่น ตกลงกติกาเวลากันไว้ล่วงหน้า และหัวหน้าทำตามเอง | e.g. the rule was agreed beforehand and the boss keeps it |
| `practice_lead` | เรื่องที่ทุกคนในห้องนี้เคยเจอ ลองเติมให้เป็นประโยคเดียว | Something everyone here has met. Complete the sentence. |

### WHY round (phone) — the sentence and its blanks

| key | Thai now | what it is |
|---|---|---|
| `why_title` | ทำไมถึงเป็นแบบนี้ | Why is this happening? |
| `why_site` | ในงานประจำวันของคุณ เรื่องนี้เป็นอย่างไร | In your own week, which is it? |
| `why_has` | ยังเจอแบบนี้อยู่ | I still run into this |
| `why_hasnot` | ไม่ค่อยเจอ — ที่นี่มีวิธีรับมืออยู่แล้ว | Rarely — we have a way of handling it |
| `why_lead` | เติมให้เป็นประโยคเดียว | Complete the sentence |
| `works_lead` | เติมให้เป็นประโยคเดียว | Complete the sentence |
| `open_cause` | ยังเจอในงานของเรา | still shows up in our work |
| `open_works` | ไม่ค่อยเจอในงานของเรา | rarely comes up in our work |
| `situ_lbl` | เมื่อ… (สถานการณ์ / เงื่อนไข) | when… (situation / condition) |
| `situ_sub` | เป็นแบบนั้นตอนไหน — ลองระบุเงื่อนไขที่ทำให้เกิดขึ้น | When is it like that? Name the conditions that bring it about |
| `situ_cue_time` | ช่วงเวลา: เกิดขึ้นเมื่อไร หรือในขั้นตอนไหน? | Time: when, or at which step? |
| `situ_cue_task` | งาน/กิจกรรม: ขณะทำหน้าที่หรือกิจกรรมอะไร? | Task: during which duty or activity? |
| `situ_cue_res` | ทรัพยากร: เมื่อคน เวลา งบประมาณ ข้อมูล หรืออุปกรณ์มีมากน้อยเพียงใด? | Resources: how much staff, time, budget, information or equipment is there? |
| `situ_cue_who` | คนและกติกา: ใครอยู่ตรงนั้น และมีกติกาหรือตัวชี้วัดอะไรกำกับอยู่? | People and rules: who is there, and what rule or indicator is already in force? |
| `situ_sub_works` | เป็นแบบนั้นตอนไหน — ลองระบุเงื่อนไขที่ทำให้ทำได้ | When is it like that? Name the conditions that make it work |
| `who_lbl` | ใคร | Who |
| `does_lbl` | มักจะ… (การตอบสนอง) | usually… (response) |
| `does_works_lbl` | จะ… (การตอบสนอง) | will… (response) |
| `because_lbl` | เนื่องจาก… | because… |
| `situ_hint` | เช่น วันพุธ คลินิกไต คนล้น 80 ราย มีหมอคนเดียว | e.g. Wednesday renal clinic, 80 patients, one doctor |
| `situ_hint_works` | เช่น คลินิกไตวันอังคาร มีพยาบาล PC นั่งด้วยทุกสัปดาห์ | e.g. Tuesday renal clinic, the PC nurse sits in every week |
| `does_hint` | เช่น ไม่ได้ประเมินว่าเหมาะกับ CKM หรือไม่ | e.g. doesn't assess whether CKM would suit |
| `does_works_hint` | เช่น ถาม surprise question และบันทึกทุกครั้ง | e.g. asks the surprise question and records it every time |
| `because_hint` | เหตุผล เช่น ไม่มีเกณฑ์ / ไม่มีช่องใน HIS / ไม่มีเวลา / กลัวครอบครัวเข้าใจว่า “ไม่รักษา” / คิดว่าเป็นหน้าที่อีกทีม | the reason, e.g. no criteria / no box in the HIS / no time / afraid the family hears “no treatment” / thinks it's the other team's job |
| `because_works_hint` | เช่น มีช่องในแบบฟอร์ม และหัวหน้าดูทุกเดือน | e.g. there's a box on the form and the head checks monthly |
| `worked_lbl` | ดูตัวอย่างหนึ่งประโยค | See one finished sentence |
| `worked_cause` | “โรงพยาบาลยังไม่มีระบบคัดกรองผู้ป่วยที่เหมาะกับ CKM — <b>ยังเจอในงานของเรา</b>: <b>แพทย์โรคไต มักจะ</b> ไม่ได้ประเมินว่าใครเหมาะกับ CKM <b>เมื่อ</b> วันพุธ คลินิกไตมีผู้ป่วย 80 ราย และมีแพทย์คนเดียว <b>เนื่องจาก</b> ไม่มีเกณฑ์ที่ตกลงกันไว้ และไม่มีช่องให้บันทึกใน HIS” | “The nephrologist usually doesn't assess who CKM would suit, when the Wednesday clinic has 80 patients and one doctor, because there are no agreed criteria and no box to record it in the HIS.” |
| `worked_works` | “… — <b>ไม่ค่อยเจอในงานของเรา</b>: <b>พยาบาลไต จะ</b> ชวนคุยเรื่องทางเลือกตั้งแต่ stage 4 <b>เมื่อ</b> คลินิกไตวันอังคารมีพยาบาล PC นั่งด้วยทุกสัปดาห์ <b>เนื่องจาก</b> มีช่องในแบบฟอร์ม และหัวหน้าดูทุกเดือน” | “The renal nurse opens the options conversation at stage 4, when the Tuesday clinic has the PC nurse sitting in, because there's a box on the form and the head checks monthly.” |
| `worked_cause_p` | “การประชุมมักจบช้ากว่าเวลาที่นัดไว้ — <b>ยังเจอในงานของเรา</b>: <b>ประธาน มักจะ</b> ปล่อยให้เลยเวลาโดยไม่ตัดบท <b>เมื่อ</b> ประชุมบ่ายสาม มีวาระ 8 เรื่อง และมีผู้บริหารอาวุโสนั่งอยู่ด้วย <b>เนื่องจาก</b> เกรงใจคนอาวุโสที่เตรียมมาพูด และไม่มีใครได้รับมอบหมายให้คุมเวลา” | “The 3pm meeting with eight items and a senior director in the room: the chair lets it run over, because nobody wants to cut off a senior who prepared, and nobody was given the job of keeping time.” |
| `worked_works_p` | “… — <b>ไม่ค่อยเจอในงานของเรา</b>: <b>เลขา/ผู้จัดประชุม จะ</b> เตือนเมื่อเหลือ 2 นาที แล้วปิดวาระ <b>เมื่อ</b> เป็นประชุมเช้าวันจันทร์ ที่ทุกคนต้องไปราวด์ต่อ 9 โมง <b>เนื่องจาก</b> ตกลงกติกาเวลากันไว้ล่วงหน้า และหัวหน้าทำตามเอง” | “…rarely happens on Monday mornings when everyone is due on the ward at nine: the secretary warns at two minutes and closes the item, because the rule was agreed beforehand and the boss keeps it.” |
| `situ_nudge` | ระบุให้เห็นภาพขึ้นอีกนิดได้ไหม — เมื่อไร ที่ไหน ตอนนั้นมีใครอยู่บ้าง | Could you make it a bit more concrete — when, where, who was there? |
| `preview_lbl` | ประโยคของคุณ | Your sentence |
| `why_note` | พูดถึงระบบ ไม่ใช่ตัวบุคคล — ทั้งสองทีมกำลังตอบคำถามเดียวกัน | Talk about the system, not people — both teams are answering the same question |
| `need_all` | เติมให้ครบทุกช่อง | Fill in every blank |
| `pick_who_first` | เลือก “ใคร” ก่อน | Start by tapping who |
| `why_pick_first` | เลือกด้านบนก่อน | Pick one above first |
| `send_why` | ส่ง | Send |

### Turn and talk (phone)

| key | Thai now | what it is |
|---|---|---|
| `talk_title` | คุยกับคนจากอีกทีม | Turn and talk |
| `step_talk` | คุยกัน | Talk |

### HOW round (phone)

| key | Thai now | what it is |
|---|---|---|
| `how_title` | แล้วเราจะทำอย่างไร | How would we fix it? |
| `how_seed` | โครงการเสนอไว้ว่า | The program proposes |
| `how_seed_note` | ต่อยอดจากนี้ หรือเสนอทางอื่นก็ได้ | Build on it, or propose something else |
| `how_pick` | สิ่งที่คุณจะเสนอคือ | What you're proposing is |
| `how_asset` | สิ่งที่มีอยู่แล้วที่นี่ — ใช้ให้มากขึ้น | Something that already exists here — use it more |
| `how_new` | สิ่งใหม่ที่ควรทำ | Something new we should do |
| `how_what` | คืออะไร | What is it? |
| `how_why` | ทำไมมันจะได้ผลที่โรงพยาบาลของคุณ | Why would it work at your hospital? |
| `how_what_hint_a` | เช่น พยาบาล PC ที่รู้จักทีมไตอยู่แล้ว | e.g. The PC nurse who already knows the renal team |
| `how_why_hint_a` | เช่น เริ่มจากความไว้ใจที่มีอยู่ ไม่ต้องสร้างใหม่ | e.g. It starts from trust that already exists |
| `how_what_hint_n` | เช่น ให้พยาบาลไตเปิดเรื่องทางเลือกตั้งแต่ stage 4 | e.g. Have the renal nurse open the options conversation at stage 4 |
| `how_why_hint_n` | เช่น ครอบครัวไว้ใจพยาบาลไตมากกว่าคนแปลกหน้า | e.g. Families trust the renal nurse more than a stranger |
| `send_how` | ส่งข้อเสนอ | Send |
| `how_pick_first` | เลือกด้านบนก่อน | Pick one above first |
| `need_both` | กรอกทั้งสองช่อง | Fill in both boxes |
| `overall_title` | ภาพรวม | Overall |
| `overall_sub` | สิ่งที่ควรทำ ที่ไม่ได้เกี่ยวกับช่องว่างใดช่องว่างหนึ่ง | Something we should do that isn't about one gap |

### Sending and errors (phone)

| key | Thai now | what it is |
|---|---|---|
| `sending` | กำลังส่ง… | Adding… |
| `at_limit` | ครบแล้วสำหรับข้อนี้ — ขอบคุณ | That's all for this one — thank you |
| `cooling` | สักครู่… | Just a moment… |
| `sent_ok` | ส่งแล้ว มองที่จอ | Added. Look up at the screen. |
| `sent_queued` | เก็บไว้ในเครื่องแล้ว จะส่งเองเมื่อสัญญาณกลับมา | Saved on your phone — it'll send itself when the signal comes back |
| `sent_fail` | ส่งไม่สำเร็จ ลองอีกครั้ง | That didn't go through. Try again. |
| `lost` | สัญญาณหาย — กำลังลองใหม่ สิ่งที่เขียนไว้ไม่หาย | Lost connection — still trying. Anything you write is kept safe. |
| `mine_one` | คุณส่งแล้ว 1 ข้อ | You've added 1 note |
| `mine_n` | คุณส่งแล้ว {n} ข้อ | You've added {n} notes |

### Step strip (phone)

| key | Thai now | what it is |
|---|---|---|
| `step_gap` | ช่องว่าง | Gap |
| `step_why` | ทำไม | Why |
| `step_how` | ทำอย่างไร | How |
| `step_overall` | ภาพรวม | Overall |

### Projector (read from the back of a large room)

| key | Thai now | what it is |
|---|---|---|
| `pj_practice` | รอบซ้อม — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา | Practice round — answer on your phone, revealed together |
| `pj_practice_rev` | รอบซ้อม — หน้าตาของคำตอบทั้งห้องเป็นแบบนี้ | Practice round — this is what the room's answers look like |
| `pj_talk` | หันไปคุยกับคนจากอีกทีม | Turn to someone from the other team |
| `pj_talk_sub` | หนึ่งนาที ก่อนจะไปคิดวิธีแก้ | One minute, before we look for fixes |
| `pj_talk_cue1` | ที่ของคุณเป็นแบบเดียวกันไหม | Is it the same where you work? |
| `pj_talk_cue2` | อีกทีมเห็นอะไรที่เราไม่เห็น | What does the other team see that we don't? |
| `pj_talk_over` | หมดเวลา — มองที่จอ | Time's up — look up |
| `pj_in_room` | คนในห้อง | in the room |
| `pj_who` | ใครอยู่ในห้องนี้ | Who's in the room |
| `pj_who_sub` | สองด้านของปัญหาเดียวกัน | Two halves of the same problem |
| `pj_evidence` | ช่องว่างที่หลักฐานชี้ไว้ | The gaps the evidence points to |
| `pj_evidence_sub` | จากการสำรวจ 16 โรงพยาบาลก่อนวันนี้ | From the pre-survey of 16 hospitals |
| `pj_proposal` | ข้อเสนอ | Proposal |
| `pj_evidence_lbl` | จาก pre-survey | From the pre-survey |
| `pj_why_blind` | ทำไมถึงเป็นแบบนี้ในงานประจำวันของคุณ — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา | Why does this happen in your own week? Answer on your phone — revealed together when time is up |
| `pj_how_blind` | แล้วเราจะทำอย่างไร — ตอบในมือถือ เปิดเผยพร้อมกันเมื่อครบเวลา | How would we fix it? Answer on your phone — revealed together when time is up |
| `pj_why_revealed` | สาเหตุ จากทั้งสองทีม | Causes, from both teams |
| `pj_how_revealed` | สาเหตุ และสิ่งที่เราจะทำ | Causes, and what we would do |
| `pj_answers` | คำตอบ | answers |
| `pj_causes` | ทำไมถึงเป็นแบบนี้ | Why it happens |
| `pj_works` | ที่ทำได้แล้ว — เพราะอะไร | Where it works — and why |
| `pj_solutions` | เราจะทำอย่างไร | What we would do |
| `pj_asset_mark` | มีอยู่แล้ว | exists |
| `pj_overall` | ภาพรวม | Overall |
| `pj_closing` | ไม่มีใครเห็นภาพทั้งหมดคนเดียว | Neither of us had the whole picture |
| `pj_stats` | {c} สาเหตุ · {w} ที่ทำได้แล้ว · {a} สิ่งที่มีอยู่แล้ว · {i} สิ่งใหม่ · {g} ช่องว่างที่ทั้งสองทีมร่วมตอบ | {c} causes · {w} where it works · {a} things that already exist · {i} new ideas · {g} gaps both teams answered |
| `pj_signup` | อยากเล่าให้ฟังเพิ่ม? สแกนเพื่อลงชื่อคุยต่อ | Willing to talk more? Scan to leave your contact |
| `pj_waiting_gaps` | รอโหลดช่องว่างจากแผงควบคุม… | Waiting for the gaps to be loaded from the control panel… |
| `pj_concerns` | เรื่องที่หลุด | concerns |
| `pj_from_nephro` | จากทีมโรคไต | from nephrology |
| `pj_from_pall` | จากทีมประคับประคอง | from palliative care |
| `pj_word_cloud` | กลุ่มคำ | Word cloud |
| `pj_wall` | กระดานโน้ต | Post-it wall |
| `pj_fullscreen` | เต็มจอ | Full screen |

---

## WHAT TO RETURN

**Block 1 — the practice case.** Three candidate cases, one line each; then
your choice, with `label`, `problem`, the six `actors` (id + Thai label —
reuse the existing ids `p_chair`, `p_speaker`, `p_member`, `p_sec`,
`p_system`, `p_other` if they still fit, otherwise give new ids in the same
style), and every practice string listed in Task 1.

**Block 2 — the strings.** A JSON object, keys exactly as given, values the
new Thai. Include **only** the keys you changed. Escape double quotes; keep
`{n}` and `<b>…</b>` intact.

```json
{
  "why_site": "…",
  "situ_sub": "…"
}
```

**Block 3 — a short table** of the changes that matter, with one line each on
why. Do not list trivial edits. At the end, list anything you think is wrong
in substance rather than in language, and anything you were unsure about.

