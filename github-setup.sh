#!/bin/bash

# GitHub Setup Script for RoastMyIdea.AI
# 
# This script helps you push the repository to GitHub

echo "🚀 GitHub Setup for RoastMyIdea.AI"
echo "=================================="
echo ""

# Check if git is configured
if ! git config user.name > /dev/null 2>&1; then
    echo "⚠️  Git user.name not configured"
    echo "Please run: git config --global user.name \"Your Name\""
    exit 1
fi

if ! git config user.email > /dev/null 2>&1; then
    echo "⚠️  Git user.email not configured"
    echo "Please run: git config --global user.email \"your.email@example.com\""
    exit 1
fi

echo "✅ Git is configured"
echo "   User: $(git config user.name)"
echo "   Email: $(git config user.email)"
echo ""

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Show current remotes
echo "📡 Current remotes:"
if git remote -v | grep origin; then
    echo ""
    echo "⚠️  Remote 'origin' already exists:"
    git remote -v | grep origin
    echo ""
    read -p "Do you want to update the remote? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✅ Removed existing remote"
    else
        echo "ℹ️  Keeping existing remote"
        echo ""
        echo "To push to GitHub, run:"
        echo "  git push -u origin main"
        exit 0
    fi
else
    echo "No remotes configured yet"
fi
echo ""

# Ask for GitHub repository URL
echo "📝 Enter your GitHub repository URL:"
echo "   Format: https://github.com/YOUR_USERNAME/roastmyidea.git"
echo "   (or press Enter to skip)"
echo ""
read -p "GitHub URL: " GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
    echo ""
    echo "ℹ️  Skipped GitHub remote setup"
    echo ""
    echo "To manually set up later:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/roastmyidea.git"
    echo "  git push -u origin main"
    exit 0
fi

# Add remote
git remote add origin "$GITHUB_URL"
echo "✅ Added remote: origin -> $GITHUB_URL"
echo ""

# Confirm before pushing
echo "📤 Ready to push to GitHub!"
echo ""
echo "This will push:"
echo "  - main branch"
echo "  - feature/multi-judge branch"
echo "  - feature/file-upload branch"
echo "  - feature/voice-synthesis branch"
echo "  - feature/themes branch"
echo ""
read -p "Continue with push? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Push cancelled"
    exit 0
fi

# Push main branch
echo "📤 Pushing main branch..."
git push -u origin main

# Push feature branches
echo "📤 Pushing feature branches..."
git push origin feature/multi-judge
git push origin feature/file-upload
git push origin feature/voice-synthesis
git push origin feature/themes

echo ""
echo "✅ All branches pushed to GitHub!"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run SQL from database-setup.sql in Supabase SQL Editor"
echo "  2. Start development: npm run dev"
echo "  3. Test the app at http://localhost:3000"
echo "  4. Deploy to Vercel: https://vercel.com/new"
echo ""
