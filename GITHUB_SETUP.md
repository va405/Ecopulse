# GitHub Setup Guide

## 📤 Pushing to Your New GitHub Repository

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "+" → "New repository"
3. Enter repository name (e.g., `ecopulse-carbon-tracker`)
4. Choose **Public** or **Private**
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Remove Old Git History (Optional)

If you want a fresh start without old commits:

```bash
cd C:\Users\DELL\OneDrive\Desktop\eco

# Remove old git history
rmdir /s /q .git

# Initialize fresh repository
git init
git add .
git commit -m "Initial commit - EcoPulse Carbon Intelligence Platform"
```

### Step 3: Connect to Your New Repository

```bash
# Add your new GitHub remote
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

1. Go to your GitHub repository URL
2. Verify all files are uploaded
3. Check README.md displays correctly

## 🔐 Authentication Options

### Option A: HTTPS with Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy token
5. Use when pushing:
```bash
# GitHub will prompt for username and password
# Username: your-github-username
# Password: paste-your-token
```

### Option B: SSH Key

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
type %USERPROFILE%\.ssh\id_ed25519.pub

# Add to GitHub → Settings → SSH Keys
# Then use SSH URL:
git remote set-url origin git@github.com:<your-username>/<your-repo-name>.git
```

## 🌿 Creating New Branches (Optional)

```bash
# Create development branch
git checkout -b development
git push -u origin development

# Create feature branch
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

## 📝 .gitignore Configuration

Your `.gitignore` is already configured to exclude:
- `node_modules/`
- `.env` files
- Build outputs
- IDE settings
- Cache files

**Important:** Make sure not to commit:
- API keys
- Database credentials
- Personal access tokens

## ✅ Checklist

- [ ] Old references to previous repos removed
- [ ] New GitHub repository created
- [ ] Code pushed to new repository
- [ ] README displays correctly
- [ ] No sensitive data committed (.env files excluded)
- [ ] Repository visibility set correctly (Public/Private)

## 🚀 Next Steps

After pushing to GitHub:
1. See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
2. Configure deployment platform (Vercel/Netlify for frontend)
3. Deploy backend (Render/Railway/Fly.io)
4. Update CORS settings in backend with your frontend URL
