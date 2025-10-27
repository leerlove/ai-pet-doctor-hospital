# Vercel 배포 가이드

**프로젝트**: AI펫닥터 수의과 예약 관리 시스템
**배포 플랫폼**: Vercel
**프로덕션 URL**: https://ai-pet-doctor-hospital.vercel.app

---

## 🚀 배포 방법

### 현재 상태 (2025-10-27)

⚠️ **GitHub 자동 배포가 설정되지 않음**
- GitHub에 푸시해도 자동으로 배포되지 않습니다
- 수동으로 배포 명령을 실행해야 합니다

---

## 📋 방법 1: 수동 배포 (현재)

### 프로덕션 배포
```bash
# 방법 A: npm script 사용 (권장)
pnpm deploy

# 방법 B: Vercel CLI 직접 사용
vercel --prod --yes
```

### 프리뷰 배포 (테스트용)
```bash
# 방법 A: npm script 사용
pnpm deploy:preview

# 방법 B: Vercel CLI 직접 사용
vercel
```

### 전체 워크플로우
```bash
# 1. 코드 변경
# 2. 커밋 및 푸시
git add .
git commit -m "커밋 메시지"
git push

# 3. 수동 배포
pnpm deploy

# 또는 한 줄로:
git add . && git commit -m "메시지" && git push && pnpm deploy
```

---

## ⚡ 방법 2: GitHub 자동 배포 설정 (권장)

GitHub에 푸시만 하면 자동으로 Vercel에 배포되도록 설정

### Step 1: Vercel 대시보드 접속

1. https://vercel.com 접속 및 로그인
2. **Projects** → `ai-pet-doctor-hospital` 클릭

### Step 2: Git 연동 페이지로 이동

1. 상단 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Git** 선택

### Step 3: GitHub 리포지토리 연결

#### 만약 "No Git Repository Connected" 표시된 경우:

1. **"Connect Git Repository"** 버튼 클릭
2. **GitHub** 선택
3. 리포지토리 검색: `leerlove/ai-pet-doctor-hospital`
4. 리포지토리 선택

#### GitHub App 권한 승인 (필요시):

- "Install Vercel for GitHub" 또는 "Authorize Vercel" 팝업이 뜨면 승인
- 개인 계정 또는 조직 선택
- `ai-pet-doctor-hospital` 리포지토리 접근 권한 부여

### Step 4: Production Branch 설정

1. **Production Branch** 를 `main` 으로 설정
2. **"Connect"** 버튼 클릭

### Step 5: 자동 배포 옵션 확인

Settings → Git에서 다음 설정이 활성화되어 있는지 확인:

- ✅ **Automatically deploy from Git**: Enabled
- ✅ **Production Branch**: `main`
- ✅ **Preview Branches**: All branches (선택사항)

### Step 6: 테스트

```bash
# 1. 간단한 변경사항 추가
echo "# Test" >> README.md

# 2. 커밋 및 푸시
git add .
git commit -m "test: Verify auto-deployment"
git push

# 3. Vercel 대시보드 확인
# https://vercel.com/inervetdevs-projects/ai-pet-doctor-hospital
# → Deployments 탭에서 새 배포가 자동으로 시작되는지 확인
```

**예상 결과**:
- GitHub 푸시 후 5-10초 내에 Vercel에서 배포 시작
- 약 30초 후 배포 완료
- 프로덕션 URL 자동 업데이트

---

## 🔍 배포 상태 확인

### CLI로 확인
```bash
# 최근 배포 목록
vercel list

# 최신 배포 상세 정보
vercel inspect https://ai-pet-doctor-hospital.vercel.app

# 빌드 로그 확인
vercel logs https://ai-pet-doctor-hospital.vercel.app
```

### 대시보드에서 확인
```
https://vercel.com/inervetdevs-projects/ai-pet-doctor-hospital

→ Deployments 탭
→ 각 배포의 상태, 시간, 커밋 정보 확인
```

---

## 📊 배포 타입

### 1. Production Deployment
- **브랜치**: `main`
- **URL**: https://ai-pet-doctor-hospital.vercel.app
- **트리거**: `main` 브랜치에 푸시 (자동 배포 설정 시)
- **수동 배포**: `vercel --prod`

### 2. Preview Deployment
- **브랜치**: `main` 이외의 브랜치
- **URL**: `https://ai-pet-doctor-hospital-[branch]-[hash].vercel.app`
- **트리거**: 모든 브랜치에 푸시 (자동 배포 설정 시)
- **수동 배포**: `vercel`

---

## 🛠️ 환경변수 관리

### Vercel 대시보드에서 설정

1. **Settings** → **Environment Variables**
2. 각 환경변수 추가:

```
이름: VITE_SUPABASE_URL
값: https://geihrbunznmwppxjhoqj.supabase.co
환경: Production, Preview, Development

이름: VITE_SUPABASE_ANON_KEY
값: eyJhbG...
환경: Production, Preview, Development
```

### CLI로 환경변수 추가

```bash
vercel env add VITE_SUPABASE_URL production
# 값 입력: https://geihrbunznmwppxjhoqj.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# 값 입력: eyJhbG...
```

### 환경변수 확인

```bash
vercel env ls
```

---

## 🔄 배포 롤백

### 대시보드에서 롤백

1. **Deployments** 탭
2. 이전 배포 선택
3. 우측 상단 **"⋯"** 메뉴 → **"Promote to Production"**

### CLI로 롤백

```bash
# 1. 이전 배포 목록 확인
vercel list

# 2. 특정 배포로 롤백
vercel promote https://ai-pet-doctor-hospital-[hash].vercel.app
```

---

## ⚙️ Vercel 설정 파일

### vercel.json
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### .vercelignore
```
# Dependencies
node_modules
.pnpm-store

# Environment
.env
.env.local
.env.*.local

# Development
.git
.vscode
*.log

# Testing
coverage
.nyc_output

# Temporary files
*.temp
*.tmp
.DS_Store
```

---

## 🐛 트러블슈팅

### 배포가 실패하는 경우

#### 1. 빌드 에러
```bash
# 로컬에서 빌드 테스트
pnpm build

# 타입 체크
pnpm typecheck
```

#### 2. 환경변수 누락
```bash
# .env.local 파일 확인
cat .env.local

# Vercel 환경변수 확인
vercel env ls
```

#### 3. 배포 로그 확인
```bash
vercel logs https://ai-pet-doctor-hospital.vercel.app
```

### GitHub 자동 배포가 작동하지 않는 경우

#### 체크리스트:
- [ ] Vercel에서 GitHub 리포지토리가 연결되어 있는가?
- [ ] Production Branch가 `main`으로 설정되어 있는가?
- [ ] GitHub App 권한이 승인되어 있는가?
- [ ] Vercel Git Integration이 활성화되어 있는가?

#### 해결 방법:
1. Settings → Git → **"Disconnect Git Repository"**
2. 다시 **"Connect Git Repository"** 클릭
3. GitHub 재연결 및 권한 재승인

---

## 📚 관련 문서

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [Supabase 환경변수](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

---

## 🎯 배포 체크리스트

### 배포 전
- [ ] `pnpm build` 로컬 빌드 성공
- [ ] `pnpm typecheck` 타입 체크 통과
- [ ] `.env.local` 환경변수 확인
- [ ] Git 변경사항 모두 커밋
- [ ] Git 푸시 완료

### 배포 후
- [ ] Vercel 배포 상태 확인 (● Ready)
- [ ] 프로덕션 URL 접속 테스트
- [ ] 주요 기능 동작 확인
  - [ ] 로그인/로그아웃
  - [ ] 예약 생성
  - [ ] 관리자 대시보드
- [ ] 브라우저 콘솔 에러 없는지 확인

---

## 🚀 빠른 참조

### 자주 사용하는 명령어

```bash
# 개발 서버 시작
pnpm dev

# 프로덕션 빌드 테스트
pnpm build && pnpm preview

# 타입 체크
pnpm typecheck

# 프로덕션 배포
pnpm deploy

# 배포 상태 확인
vercel list

# 배포 로그 확인
vercel logs https://ai-pet-doctor-hospital.vercel.app
```

---

**최종 업데이트**: 2025-10-27
**배포 플랫폼**: Vercel
**프로덕션 URL**: https://ai-pet-doctor-hospital.vercel.app
**GitHub**: https://github.com/leerlove/ai-pet-doctor-hospital
