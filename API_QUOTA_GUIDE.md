# API 할당량 초과 문제 해결 가이드

## 문제 상황
Gemini API의 무료 티어 한도를 초과하여 `429 Too Many Requests` 오류가 발생합니다.

## 해결 방법

### 1. 즉시 해결 (코드 수정 완료)
프로젝트에 다음 기능들이 추가되었습니다:

- **캐싱**: 동일한 요청은 1시간 동안 캐시되어 API 호출을 줄입니다.
- **Mock 데이터 Fallback**: 할당량 초과 시 자동으로 임시 데이터를 제공합니다.
- **사용자 친화적 에러 메시지**: 할당량 초과 시 명확한 안내 메시지를 표시합니다.

### 2. API 할당량 확인 및 관리

#### Google AI Studio에서 확인
1. [Google AI Studio](https://aistudio.google.com/) 접속
2. 좌측 메뉴에서 `API keys` 클릭
3. 사용 중인 키 선택 후 `Usage` 탭에서 현재 사용량 확인

#### 무료 티어 한도 (2026년 1월 기준)
- **분당 요청**: 15 requests/minute
- **일일 요청**: 1,500 requests/day
- **월간 토큰**: 1M tokens/month

### 3. 할당량 늘리기

#### Option A: 대기 후 재시도
- 무료 티어는 시간이 지나면 자동으로 할당량이 리셋됩니다.
- 분당 한도: 1분 대기
- 일일 한도: 다음 날 00:00 UTC (한국 시간 09:00)

#### Option B: Google Cloud 결제 활성화
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 (또는 새로 생성)
3. `Billing` 메뉴에서 결제 계정 연결
4. Gemini API를 해당 프로젝트에 연결
5. 유료 티어로 전환 (Pay-as-you-go)

**유료 티어 한도**:
- 분당 요청: 1,000 requests/minute
- 일일 요청: 50,000 requests/day

### 4. 개발 중 API 호출 최소화 팁

#### 로컬 개발 시
- 한 번 생성된 결과는 캐시되므로, 같은 목표로 반복 테스트하세요.
- 필요 시 Mock 모드를 활용하세요.

#### 배포 환경
- 사용자가 AI 생성 버튼을 남용하지 않도록 UI/UX 개선을 고려하세요.
  - 예: "AI 생성은 분당 1회로 제한됩니다" 안내 메시지
  - 생성 버튼에 쿨다운 타이머 추가

### 5. 대안 솔루션

#### 서버리스 함수 사용 (권장)
Vercel Serverless Function을 통해 API 키를 서버에서 관리하고, Rate Limiting을 구현할 수 있습니다.

1. `/api/generate.ts` 파일 생성
2. 서버에서 Gemini API 호출
3. 클라이언트는 자체 API 엔드포인트만 호출

이렇게 하면:
- API 키가 클라이언트에 노출되지 않음
- 서버 레벨에서 Rate Limiting 구현 가능
- 사용자별 할당량 관리 가능

---

## 현재 상태
✅ 캐싱 및 Mock 데이터 Fallback 적용 완료  
⚠️ 할당량 초과 시 임시 데이터가 표시됩니다  
📌 장기적으로는 유료 티어 전환 또는 서버리스 함수 구현을 권장합니다
