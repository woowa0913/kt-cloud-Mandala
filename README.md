# kt cloud Mandala Chart (만다라 차트)

신입사원의 성장 마인드셋을 위한 **만다라 차트 웹 애플리케이션**입니다.  
AI를 활용한 목표 생성, 응원 메시지 기능, Firebase 연동, 그리고 고화질 이미지 저장을 지원합니다.

---

## 🚀 Key Features

### 1. **Interactive Dashboard**
- 신입사원 카드 목록을 3D 플립 애니메이션으로 제공
- 새로운 멤버 추가 / 삭제 관리 (관리자 PIN 보호)

### 2. **Digital Mandala Chart**
- **AI 자동 생성**: Google Gemini API (`gemini-2.0-flash`)를 활용하여 목표에 맞는 세부 실천 계획 자동 추천
- **9x9 그리드**: 중심 목표부터 세부 실행 계획까지 체계적인 시각화
- **실시간 데이터 저장**: Firebase Firestore와 연동되어 데이터 영구 저장

### 3. **Engagement & Sharing**
- **Floating Comments**: 동료들의 응원 메시지를 실시간으로 띄우고 위치를 자유롭게 이동 가능
- **High-Quality Export**: `html2canvas`를 사용하여 작성된 만다라 차트를 고해상도 이미지(1920x1080 등)로 저장

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/generative-ai` SDK)
- **Database**: Firebase Firestore
- **Build & Deployment**: Vite, Vercel

---

## ⚙️ Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Firebase Project
- Google AI Studio API Key

### Installation

1. 저장소 클론
   ```bash
   git clone https://github.com/woowa0913/kt-cloud-Mandala.git
   cd kt-cloud-mandala
   ```

2. 의존성 설치
   ```bash
   npm install
   ```

3. 환경 변수 설정
   `.env.local` 파일을 생성하고 아래 키를 입력하세요.
   ```env
   # Google Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. 실행
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment (Vercel)

이 프로젝트는 Vercel 배포에 최적화되어 있습니다.

1. Vercel에 GitHub 저장소 연결
2. **Environment Variables** 설정 (위의 `.env.local` 내용과 동일하게 입력)
3. Deploy!

> **Note**: Firebase Firestore 보안 규칙을 프로덕션 환경에 맞게 설정했는지 확인하세요.

---

## 🔒 Security

- 민감한 기능(사용자 삭제, 메시지 삭제)은 간단한 PIN 인증(`0401`)으로 보호됩니다.
- 클라이언트 사이드 키 노출에 유의하세요. (Vercel 배포 시 환경 변수 설정 필수)
