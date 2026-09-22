# The four gaps, and where each comes from

Source: *ผลการประเมิน Pre-survey* — โครงการขยายผลนวัตกรรมระบบบูรณาการการดูแลแบบ
ประคับประคองสำหรับผู้ป่วยโรคไตเรื้อรังระยะสุดท้าย (16 hospitals, 24 respondents:
16 palliative care, 8 nephrology; site-level Met/Unmet uses the strict rule that
every respondent at a site must pass). File: `PreSurvey25.9.69.pdf`, kept out
of the public repository.

Each gap in `config.js → seedThemes` maps to one row below. The **proposal**
is the survey's own development proposal (slide "ข้อเสนอการพัฒนาระบบ"), not
something invented for the workshop. The **stat** is what the piece shows.

| # | Gap (label on the piece) | Survey evidence | Proposal (what the room reacts to) |
|---|---|---|---|
| G1 | คัดกรองยังขึ้นกับตัวบุคคล | Systematic CKM screening **2/16** sites. Of 24 respondents: 14 "some, depends on the team", 4 case-by-case, 1 unsure. Survey's own risk statement: patients enter CKM late and it depends on the individual carer. | Criteria, target group, owner, and a screening record form, used the same way everywhere. |
| G2 | ส่งปรึกษารายกรณี ไม่มี pathway ร่วม | Written pathway **5/16**; CKD–PC integration at level ≥3 **7/16**. Consult channel exists at 15/16 sites, joint clinic 5, case conference 1; 17/24 describe referral as case-by-case. Survey: the key gap is moving from case-by-case consult to a shared workflow and joint patient review. | Written pathway from CKD clinic to the PC team, with a coordinator and regular joint case review. |
| G3 | ACP มาช้า และทำเฉพาะ CKM | ACP for all ESKD options **1/16**, while signed ACP documents exist at 13/16. 17/24 do ACP only for CKM patients; timing is after choosing CKM (9) or after deterioration/admission (9), before the KRT decision only 5. ACP is done by palliative doctors/nurses at 13 sites, nephrologists 7, renal nurses 5. | Start ACP before the KRT decision, for every ESKD option, on a standard signed form, reviewed when the condition changes. |
| G4 | ส่งต่อแต่โรค ไม่ส่งเป้าหมายการดูแล | ER access to ACP 12/16 and a PCU referral system 12/16 exist, but what is transferred is disease-focused: diagnosis 15, comorbidity 15, KRT/CKM status 14, ACP document 14, medication 13 — versus goals of care 10, end-of-life plan 9, symptom assessment 6, CKM screening result 4. 24-hour access, referral criteria and a feedback loop are unconfirmed. | EMR alert and a minimum data set for transfer: symptoms, goals of care, emergency plan, and feedback back to the referrer. |

## What was left out, and why

- **Signed ACP documents (13/16), ER access (12/16), PCU referral (12/16)** are
  mostly Met. They appear inside G3 and G4 as the contrast ("the paperwork is
  ready; the process isn't"), not as gaps of their own.
- **Individual-level findings** (confidence in communicating CKM/ACP, symptom
  management — pruritus and restless legs lowest; wanted support — workflow
  design 20/24, patient materials 18/24, CKD management for PC teams 21/24)
  are training needs, not integration gaps between the two teams. They belong
  in the training design, not on the workshop's pieces. G2's proposal
  (workflow) is the one place they overlap.

## How the survey frames the meeting

The survey's own proposal for the meeting: each site confirms its results
together, then chooses **1–2 gaps as pilot targets**. The workshop's
what-would-help / what-would-get-in-the-way round is the material for that
choice; the export's crosstab by gap × team × role is where a site reads it.

## A note on site-level analysis

Ten of the sixteen hospitals had a single respondent, so the survey itself
says site-level results are preliminary. It is tempting to add "which
hospital" to the join screen so the workshop can confirm per site. It would
break the anonymity promise: with one nephrologist per hospital, hospital +
team + role identifies a person. Keep the workshop at team × role × setting,
and do site confirmation in the room by asking, not by tagging.
