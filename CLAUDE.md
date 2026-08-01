# 대기관리기술사 학습앱 — 편집 가이드 (CLAUDE.md)

> 이 파일은 저장소 루트(`purismug/daegi`)에 두면 PC·모바일 어디서든 Claude가
> 앱 구조를 즉시 파악하고 안전하게 수정할 수 있게 해 줍니다. Claude Code는
> 이 파일을 자동으로 읽고, 모바일에서는 "CLAUDE.md 규칙대로 고쳐줘"라고 지시하면 됩니다.

## 1. 개요
- **저장소**: `github.com/purismug/daegi` (기본 브랜치 `main`)
- **배포**: GitHub Pages → https://purismug.github.io/daegi/
- **배포 방식**: `main`에 커밋(push)하면 자동 재빌드 (약 30초~1분)
- **형태**: 단일 HTML 파일 PWA (설치형 웹앱)

## 2. 파일 구조
| 파일 | 역할 | 수정 빈도 |
|---|---|---|
| `index.html` | **앱 전체** — CSS, JS 로직, 커리큘럼 데이터, 강의 콘텐츠가 전부 이 안에 있음 | 대부분의 수정 |
| `sw.js` | 서비스워커(오프라인 캐시). `CACHE` 버전 문자열 보유 | index.html 수정 시 **반드시 함께** |
| `manifest.webmanifest` | PWA 앱 이름·아이콘·색상 | 드물게 |
| `icon-*.png` | 앱 아이콘(192/512, maskable 포함) | 드물게 |

## 3. index.html 내부 데이터 구조
콘텐츠는 `<script>` 안의 두 전역 객체에 들어 있습니다.

### 3-1. `window.CURRICULUM` — 194일 학습 일정표
```js
window.CURRICULUM = {
  "start":"2026-08-01", "end":"2027-02-10", "total":194,
  "days":[
    {"day":1,"date":"2026-08-01","phase":1,"phaseName":"1단계 이론·확산·집진",
     "kind":"study","title":"대기의 연직구조와 조성","cat":"이론","pri":"B","dow":"토"},
    ...
  ]
};
```
- `kind`: `study`(학습) · `review`(복습) · `final`(마무리)
- `pri`: 우선순위 `A`(핵심) · `B`(보조)
- `cat`: 분류 태그(이론/기상/확산/방지/측정/정책/기후/악취/유해/자동차/미세/실내/평가/복습/마무리)

### 3-2. `window.LESSONS` — 날짜별 상세 강의 내용
```js
window.LESSONS = {
  "1": {
    "day":1, "date":"2026-08-01", "title":"대기의 연직구조와 조성",
    "keywords":[
      {"k":"대류권(Troposphere)","subs":["평균 기온감률 6.5℃/km", "..."]},
      ...
    ],
    "answer":"# 대기의 연직구조와 조성\n\n## Ⅰ. 개요\n...(마크다운 문자열)..."
  },
  "2": { ... }
};
```
- 키(`"1"`, `"2"`...)는 `CURRICULUM.days[].day` 번호와 일치
- `keywords[].k` = 키워드, `keywords[].subs[]` = 하위 암기 항목
- `answer` = 본문(마크다운). 앱이 자체 렌더러로 표·코드·인용문까지 표시

## 4. 자주 하는 수정 방법
- **특정 날짜 강의 내용 수정**: `LESSONS["N"].answer` 문자열 편집
- **키워드/암기카드 수정**: `LESSONS["N"].keywords` 배열 편집
- **일정 제목·우선순위 변경**: `CURRICULUM.days`에서 해당 `day` 객체 수정
- **새 강의 추가**: `LESSONS`에 `"N": {...}` 항목 추가 (해당 `day`가 CURRICULUM에 있어야 함)
- 마크다운 문자열 안에서는 줄바꿈을 `\n`, 따옴표를 `\"` 로 이스케이프할 것

## 5. ⚠️ 배포 필수 규칙 — 캐시 버전 올리기 (가장 중요)
`sw.js`는 **캐시 우선(cache-first)** 전략입니다. 즉 한 번 설치·접속한 기기는
`index.html`을 바꿔도 **캐시된 옛 화면을 계속 보여줍니다.** 새 내용이 보이게 하려면:

> **`index.html`을 수정할 때마다 `sw.js`의 `CACHE` 값을 반드시 한 단계 올린다.**
> 예: `var CACHE='daegi-v5';` → `var CACHE='daegi-v6';`

이렇게 커밋하면 서비스워커가 새로 설치되며 옛 캐시를 지우고 최신 화면을 표시합니다.
(이 한 줄을 빼먹으면 "고쳤는데 폰에서 안 바뀐다"의 원인이 됩니다.)

## 6. 수정 → 반영 체크리스트
1. `index.html`에서 내용 수정
2. `sw.js`의 `CACHE` 버전 +1 (`daegi-vN` → `daegi-v(N+1)`)
3. `main`에 커밋/푸시
4. 30초~1분 대기 (GitHub Pages 재빌드)
5. 브라우저: 새로고침 / 설치된 PWA: 앱 완전히 껐다 켜기
