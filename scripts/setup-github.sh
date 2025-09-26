#!/bin/bash

# Script to help set up GitHub repository for Perplexity Chat Clone

echo "🚀 Setting up GitHub repository for Perplexity Chat Clone"
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Check if remote origin exists
if git remote get-url origin >/dev/null 2>&1; then
    echo "✅ Remote origin already exists:"
    git remote get-url origin
    echo ""
else
    echo "📝 To create a new GitHub repository:"
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository named 'perplexity-chat-clone'"
    echo "3. Don't initialize with README (we already have one)"
    echo "4. Copy the repository URL"
    echo ""
    echo "Then run:"
    echo "git remote add origin <your-repo-url>"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
fi

# Show current status
echo "📊 Current repository status:"
git status --short
echo ""

# Show recent commits
echo "📝 Recent commits:"
git log --oneline -5
echo ""

echo "🎉 Your Perplexity Chat Clone is ready for GitHub!"
echo ""
echo "Next steps:"
echo "1. Create a GitHub repository"
echo "2. Add the remote origin"
echo "3. Push your code"
echo "4. Deploy to Vercel or Netlify for a live demo"
