# Firebase Setup Guide

본 프로젝트는 데이터를 영구적으로 저장하기 위해 **Firebase Cloud Firestore** (무료 Tier: Spark Plan)를 사용합니다.

## 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/)에 접속하여 로그인합니다.
2. `프로젝트 추가` 버튼을 클릭하여 새 프로젝트를 생성합니다 (예: `kt-cloud-mandala`).
3. Google Analytics는 사용 안 함으로 설정하거나 필요에 따라 설정합니다.

## 2. Web App 추가
1. 프로젝트 개요 페이지에서 웹 아이콘(`</>`)을 클릭하여 웹 앱을 추가합니다.
2. 앱 닉네임을 입력하고 `앱 등록`을 클릭합니다.
3. **SDK 설정 및 구성** 단계에서 `const firebaseConfig = { ... }` 부분을 확인합니다. 이 값들이 필요합니다.

## 3. Firestore Database 생성
1. 좌측 메뉴 빌드(Build) > **Firestore Database**를 클릭합니다.
2. `데이터베이스 만들기`를 클릭합니다.
3. **프로덕션 모드** 또는 **테스트 모드** 중 하나를 선택합니다. 
   - 개발 중에는 **테스트 모드**가 편하지만, 보안을 위해 규칙을 설정해야 합니다. 일단 **테스트 모드**로 시작하세요.
4. 위치(Location)를 선택합니다 (예: `asia-northeast3` - 서울).

## 4. 환경 변수 설정
프로젝트 루트의 `.env.local` 파일을 열고, 2번 단계에서 확인한 `firebaseConfig` 값을 입력합니다.

```env
VITE_GEMINI_API_KEY=기존_Gemini_API_키

# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

## 5. Firestore 보안 규칙 설정 (선택 사항, 권장)
데모 버전에서는 누구나 읽고 쓸 수 있도록 허용했지만, 실제 서비스 시에는 보안 규칙을 강화해야 합니다.
Firestore > 규칙(Rules) 탭에서 아래와 같이 설정하면 모든 사용자가 읽고/쓰기가 가능합니다 (개발용).

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 6. 실행
설정이 완료되면 서버를 재시작합니다.

```bash
npm run dev
```
