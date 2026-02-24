---
title: 구글 14년의 교훈
parent: 기타
nav_order: 30
description: Google 14년차 엔지니어 Addy Osmani가 공유하는 팀 협업, 의사결정, 신뢰에 대한 14가지 실전 교훈 요약
---

# 14 More Lessons from 14 Years at Google
{:.no_toc}

Addy Osmani가 Google 14년 경력에서 얻은 교훈 후속편. 기술보다 **사람과 협업**에 초점을 맞춘 14가지 레슨.

### Link

- [14 More Lessons from 14 Years at Google - Addy Osmani](https://addyo.substack.com/p/14-more-lessons-from-14-years-at)

## 목차
{:.no_toc}

1. TOC
{:toc}

---

## 핵심 요약

Osmani는 이전에 21가지 교훈을 공유한 바 있는데, 가장 반향이 컸던 조언은 기술이 아닌 **사람과 협업**에 관한 것이었다고 한다. 이 후속편은 팀 역학에 집중한다: **의사결정이 실제로 어떻게 이뤄지는지, 어디서 협업이 무너지는지, 성과를 내는 팀과 제자리에서 맴도는 팀의 차이**가 핵심이다.

### 14가지 교훈 한 줄 요약

| # | 교훈 | 핵심 |
|---|------|------|
| 1 | 최고의 엔지니어는 **올바른 문제**를 고른다 | 빠른 게 아니라 선별적인 것 |
| 2 | 어떤 **결정**을 요청하는지 말할 수 없으면 회의할 준비가 안 된 것 | 회의 시작 2분 안에 ask 명시 |
| 3 | "우리 해야 해"는 계획이 아니다. **"화요일에 내가 할 것"**이 계획이다 | 이름+날짜 = 모멘텀 |
| 4 | 느린 코드는 증상, **느린 의사결정**은 항상 문제 | 권한이 명확하면 결정은 빠르다 |
| 5 | 안정성은 **제품 기능**이다 | Error budget으로 트레이드오프 명시 |
| 6 | 커뮤니케이션으로 **팀 간 나쁜 인터페이스**를 극복할 수 없다 | 회의 추가가 아닌 경계 설계 |
| 7 | 최고의 에스컬레이션에는 **제안**이 포함된다 | "도와주세요" → "A와 B 중 B 추천" |
| 8 | 히어로 문화를 피하라. **영웅이 필요 없는 시스템**을 만들어라 | 평범한 화요일을 위해 설계 |
| 9 | Observability를 **기능의 일부**로 만들어라 | 텔레메트리 없는 기능은 숨겨진 부채 |
| 10 | 작은 PR은 **친절**이다 | 작은 변경 = 빠른 리뷰 + 독립 롤백 |
| 11 | 팀을 추가하면 노드가 아닌 **엣지**가 늘어난다 | 인원 증가 ≠ 산출 증가 |
| 12 | 마이그레이션은 **절대 단순한 마이그레이션이 아니다** | 기술보다 인적 작업이 크다 |
| 13 | AI가 초안을 싸게 만들었다. **안목(Taste)**이 비싸졌다 | 무엇을 빼고 남길지가 차별화 |
| 14 | 신뢰는 팀의 **지연시간 최적화**다 | 약속 이행이 의사결정 속도를 높인다 |

---

## 원문 전체

> **14 More Lessons from 14 Years at Google**
> *By Addy Osmani, February 12, 2026*
>
> Osmani previously shared 21 lessons from his Google tenure, but discovered the most resonant advice concerned people and collaboration rather than technical skills. This follow-up focuses on team dynamics: "how decisions actually get made, where coordination breaks down, what separates the groups that ship from the ones that spin."
>
> **1. The Best Engineers Pick the Right Problems to Solve**
>
> Every affirmative commitment represents a negative one elsewhere. Talented engineers frequently experience burnout by accepting everything—bugs, features, favors. Their calendars become filled with others' priorities while their own work stalls.
>
> Protecting bandwidth from "nice to have" items parallels protecting systems from outages. High-impact engineers aren't necessarily faster; they're more selective about deserving projects. "The opportunity cost of working on the wrong thing is working on the wrong thing."
>
> **2. If You Can't Say What Decision You're Asking For, You're Not Ready for the Meeting**
>
> Many meetings fail because participants discuss problems without identifying what they need: approval, selection, unblocking, or information.
>
> Start meetings by stating the ask explicitly. When receiving meeting requests, ask within two minutes what decision is required. This directness often brings relief—people frequently haven't clarified their own needs.
>
> **3. "We Should" Is Not a Plan. "On Tuesday, I Will" Is a Plan**
>
> Motion differs from progress through specificity. Teams accumulate intentions like "improve onboarding" or "reduce latency" that gather dust for months.
>
> Convert vague goals into concrete actions with names and dates. Specific commitments generate momentum; vague intentions create anxiety.
>
> **4. Slow Code Is Sometimes a Symptom. Slow Decisions Are Always a Problem**
>
> When projects drag, blame typically falls on velocity or code quality. However, slow decisions represent the actual bottleneck.
>
> The fastest teams decide within hours, not weeks, because authority is clear, context is shared, and errors don't derail careers.
>
> **5. Reliability Is a Product Feature. Treat It Like One**
>
> Users notice reliability's absence but not its presence, creating dangerous under-resourcing compared to visible features.
>
> Error budgets make tradeoffs explicit. Services with 99.9% uptime have 0.1% downtime to allocate between reliability and innovation. Maintain this framework for honest risk conversations.
>
> **6. You Can't "Communication" Your Way Out of a Bad Interface Between Teams**
>
> Team interaction modes exist for reasons: collaboration (close work), service (clear APIs and SLAs), or facilitation (capability building).
>
> Unclear boundaries create pain. Adding meetings won't resolve undefined ownership or messy contracts. Define interfaces deliberately to reduce necessary coordination overhead.
>
> **7. The Best Escalation Comes With a Proposal**
>
> Identifying problems is half the work. Providing options with tradeoffs and recommendations demonstrates thinking and earns trust.
>
> "I need help" differs fundamentally from "Choose between A and B; I recommend B because..." The latter transforms problem-raisers into problem-solvers.
>
> **8. Avoid Hero Culture. Build Systems That Don't Require Heroes**
>
> Recurring heroic interventions signal systemic failure rather than achievement. When heroes depart, undocumented knowledge walks out with them.
>
> Design the normal path for average Tuesdays, not exceptional crises. Heroism should be unnecessary.
>
> **9. Make Observability Part of the Feature**
>
> Features without telemetry represent hidden liabilities. Shipping without understanding production behavior means shipping uncertainty.
>
> Logs, traces, dashboards, and alerts enable learning. Observability constitutes part of "done," not supplementary ops work.
>
> **10. Small PRs Are Kindness. Especially If the PR Is AI Generated**
>
> Large pull requests sit in review queues while reviewers find time. Smaller changes move faster and permit independent rollback.
>
> Small PRs force incremental thinking and accelerated feedback cycles.
>
> **11. When You Add a Team, You Add Edges, Not Just Nodes**
>
> Coordination costs exceed headcount growth. New people add communication overhead with everyone requiring coordination.
>
> Doubling team size without output gains means new edges consumed new capacity. Clear ownership and autonomous teams with minimal dependencies provide leverage.
>
> **12. The Migration Is Never Just a Migration**
>
> Every migration negotiates between current systems, desired systems, and people unaware of either.
>
> Migrations estimated at one quarter stretch to years because human work (adoption, edge cases, coexistence) outnumbers technical work. Successful migrations require sponsor engagement, true ownership, and credible deprecation dates.
>
> **13. AI Makes Drafts Cheap. Taste Becomes Expensive**
>
> Code generation tools collapse production barriers. AI produces ten versions where one previously took hours.
>
> Distinguishing among options—what to build, delete, simplify, or withhold—becomes the differentiator. "Taste — the ability to distinguish between options and pick the right one — becomes the scarce resource."
>
> **14. Trust Is a Latency Optimization for Teams**
>
> Trust represents the highest-leverage team asset. Credibility, not heroics, enables decisions in hours rather than weeks.
>
> Every promise fulfilled, every honest mistake admission, every facilitated colleague interaction deposits into accounts yielding dividends for years.
>
> ---
>
> The through-line suggests that engineering work involves "making it easier for normal people to do extraordinary things on a normal day." These lessons, shared from 14 years at Google, may "save you a scar or two."
