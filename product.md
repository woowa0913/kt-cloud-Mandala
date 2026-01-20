# Product Specification: kt cloud Mandala Chart

## 1. Project Overview
**Name**: kt cloud Mandala (신입사원 성장 마인드셋 만다라 차트)
**Purpose**: A web application for kt cloud new employees to set their growth goals for the year 2026 using the Mandala Chart technique. It features AI-assisted goal generation, cheering messages from colleagues, and high-quality image export.

## 2. Tech Stack
- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS
- **Data Persistence**: Firebase Firestore (Users, Mandalas, Messages)
- **AI**: Google Gemini API (`gemini-2.0-flash` with fallback) via `@google/generative-ai` SDK
- **Image Generation**: `html2canvas`
- **Icons**: `lucide-react`
- **Deployment**: Vercel

## 3. Core Features

### A. Dashboard (Entry Screen)
- **User Cards**: Display list of new employees with 3D flip animation.
  - *Front*: Name, Avatar (random color), Title (신입사원).
  - *Back*: 2026 Main Goal (displayed on hover).
- **User Management**:
  - Add new user (Modal).
  - Delete user (Requires Admin PIN: `0401`).
- **Branding**: "kt cloud" logo must be all lowercase.

### B. Mandala Chart (Main Workspace)
- **Structure**: 9x9 Grid (1 Center Block + 8 Surrounding Blocks).
- **Navigation**:
  - Top Left: Home button, User Name, "kt cloud" logo.
  - Top Right: Save options (Resolution, Toggle Cheering Messages), Save Button.
- **Editing**:
  - Center Cell (9,9): Main Goal (Synced with Dashboard).
  - Sub-Core Cells: 8 surrounding goals.
  - Leaf Cells: Action plans.
  - **AI Assistance**:
    - Clicking the Sparkle/Refresh icon on center cells triggers Gemini AI.
    - Generates 8 sub-goals or action plans based on context.
- **Title Section**:
  - Located at the top of the chart card.
  - Default Format: `"${User Name}님의 2026년 성장 계획"`
  - **Editable**: Users can modify the title text directly.
- **Footer**: Removed (previously "kt cloud New Employee Growth Mindset").

### C. Cheering Messages (Interaction)
- **Floating Bubbles**: Messages float gently over the background.
- **Input**: Users can add messages with a nickname.
- **Management**:
  - Drag and drop bubbles (Screen view only).
  - Delete messages (Requires Admin PIN: `0401`).
- **Visibility**: Toggleable for Image Export.

### D. Image Export (Save Feature)
- **Library**: `html2canvas`.
- **Resolutions**: Supports up to 2560x1440 (Default: 1920x1080).
- **Capture Logic**: Uses an off-screen container to render the high-resolution image.
- **Design Specifications for Export**:
  1.  **Background**: STRICTLY **White** (`#ffffff`). No clouds, no gradients, no grey tones.
  2.  **Chart Appearance**:
      - **Center Block**: White background (or extremely light grey `slate-50` border) to look clean on white.
      - **All Cells**: White background.
      - **Borders**: Thicker (`border-2`) and visible (`slate-200`) to define the grid clearly against the white background.
  3.  **Content**:
      - Includes the editable Title.
      - Includes the Mandala Grid.
      - Includes Cheering Messages (if toggled ON).
      - **Excludes**: The UI header, input fields, and bottom footer text.

## 4. Design & UX Details
- **Theme**: Sky/Cloud theme (Blue, White, Slate).
- **Animations**:
  - Floating clouds and sparkles in the background (Screen view only).
  - Hover effects on cells.
  - Gentle hover animation for cheering messages.
- **Typography**: `Noto Sans KR` (Main), `Fredoka` (Cute accents).

## 5. Security
- **Admin Actions**: Deleting users or messages requires a PIN.
- **PIN**: `0401`

---
*Last Updated: Based on user requests up to ensuring pure white background for exports.*
