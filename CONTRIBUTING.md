# Contributing to Carbon AI

Thank you for your interest in contributing to Carbon AI! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Git

### Setup Development Environment

1. **Fork and Clone**
```bash
git clone https://github.com/technest078-cmyk/hack2skill.git
cd hack2skill
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Environment Variables**
Create `.env` files in both frontend and backend directories following `.env.example`

## 📝 Development Workflow

### Branch Naming Convention
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/modifications

Example: `feature/add-monthly-tracking`

### Commit Message Format
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Example:**
```
feat(calculator): add water usage tracking

Added new fields for shower and laundry water consumption
with emission calculations

Closes #123
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend Tests
```bash
cd backend
pytest
pytest --cov=.
```

### Code Quality
```bash
# Frontend linting
npm run lint
npm run lint:fix

# Frontend formatting
npm run format
npm run format:check

# Backend linting
pylint *.py
```

## 📋 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, readable code
   - Add tests for new features
   - Update documentation as needed
   - Follow existing code style

3. **Test Your Changes**
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Wait for review

## ✅ Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and passing
- [ ] Dependent changes merged
- [ ] Lint and format checks pass

## 🎯 Code Style Guidelines

### JavaScript/React
- Use functional components with hooks
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep components small and focused
- Use TypeScript-style JSDoc annotations

### Python
- Follow PEP 8 style guide
- Add type hints for all functions
- Write docstrings for all functions/classes
- Keep functions focused and short
- Use meaningful variable names

## 🐛 Reporting Bugs

**Before Submitting:**
- Check existing issues
- Verify it's reproducible
- Gather relevant information

**Bug Report Should Include:**
- Clear title and description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## 💡 Suggesting Features

**Feature Request Should Include:**
- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Alternative solutions considered
- Impact on existing features

## 📞 Getting Help

- Open an issue for questions
- Join discussions in GitHub Discussions
- Check existing documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make Carbon AI better for everyone. We appreciate your time and effort!
