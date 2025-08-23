#!/usr/bin/env python3
"""
AI Code Reviewer using Groq API
Analyzes pull request changes and posts review comments
"""

import os
import sys
import json
import requests
from groq import Groq

def get_pr_info():
    """Get PR information from GitHub context"""
    github_event_path = os.environ.get('GITHUB_EVENT_PATH')
    if not github_event_path:
        print("Not running in GitHub Actions context")
        return None
    
    with open(github_event_path, 'r') as f:
        event = json.load(f)
    
    return {
        'number': event['pull_request']['number'],
        'repo_owner': event['repository']['owner']['login'],
        'repo_name': event['repository']['name'],
        'pr_title': event['pull_request']['title'],
        'pr_body': event['pull_request']['body'] or '',
    }

def get_pr_diff(repo_owner, repo_name, pr_number, github_token):
    """Get the diff of the pull request"""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/pulls/{pr_number}"
    headers = {
        'Authorization': f'token {github_token}',
        'Accept': 'application/vnd.github.v3.diff'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.text
    else:
        print(f"Failed to get PR diff: {response.status_code}")
        return None

def analyze_code_with_groq(diff_content, pr_title, pr_body, groq_client):
    """Analyze code changes using Groq"""
    
    prompt = f"""
You are an expert code reviewer. Please review this pull request and provide constructive feedback.

PR Title: {pr_title}
PR Description: {pr_body}

Code Changes:
{diff_content}

Please provide:
1. Overall assessment of the changes
2. Any potential issues or improvements
3. Security concerns if any
4. Code quality suggestions
5. Performance considerations

Keep your review constructive and helpful. Focus on significant issues rather than minor style preferences.
"""

    try:
        completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an experienced software engineer providing code review feedback. Be constructive, specific, and helpful."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama3-70b-8192",  # Using Llama 3 70B model
            temperature=0.1,
            max_tokens=1000
        )
        
        return completion.choices[0].message.content
    
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return None

def post_review_comment(repo_owner, repo_name, pr_number, review_content, github_token):
    """Post the AI review as a comment on the PR"""
    
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{pr_number}/comments"
    headers = {
        'Authorization': f'token {github_token}',
        'Content-Type': 'application/json'
    }
    
    comment_body = f"""## 🤖 AI Code Review

{review_content}

---
*This review was generated automatically using Groq AI. Please use your judgment and consider this as additional input to human code review.*
"""
    
    data = {
        'body': comment_body
    }
    
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 201:
        print("AI review posted successfully!")
        return True
    else:
        print(f"Failed to post review: {response.status_code} - {response.text}")
        return False

def main():
    # Get environment variables
    github_token = os.environ.get('GITHUB_TOKEN')
    groq_api_key = os.environ.get('GROQ_API_KEY')
    
    if not github_token:
        print("GITHUB_TOKEN not found")
        sys.exit(1)
    
    if not groq_api_key:
        print("GROQ_API_KEY not found")
        sys.exit(1)
    
    # Initialize Groq client
    groq_client = Groq(api_key=groq_api_key)
    
    # Get PR information
    pr_info = get_pr_info()
    if not pr_info:
        print("Could not get PR information")
        sys.exit(1)
    
    print(f"📋 Reviewing PR #{pr_info['number']}: {pr_info['pr_title']}")
    
    # Get PR diff
    diff_content = get_pr_diff(
        pr_info['repo_owner'], 
        pr_info['repo_name'], 
        pr_info['number'], 
        github_token
    )
    
    if not diff_content:
        print("Could not get PR diff")
        sys.exit(1)
    
    # Limit diff size to avoid token limits
    if len(diff_content) > 8000:  # Rough character limit
        diff_content = diff_content[:8000] + "\n\n... (diff truncated due to size)"
    
    print("🔍 Analyzing code changes with Groq AI...")
    
    # Analyze with Groq
    review_content = analyze_code_with_groq(
        diff_content, 
        pr_info['pr_title'], 
        pr_info['pr_body'], 
        groq_client
    )
    
    if not review_content:
        print("Failed to get AI review")
        sys.exit(1)
    
    # Post review comment
    success = post_review_comment(
        pr_info['repo_owner'], 
        pr_info['repo_name'], 
        pr_info['number'], 
        review_content, 
        github_token
    )
    
    if success:
        print("AI code review completed successfully!")
    else:
        sys.exit(1)

if __name__ == "__main__":
    main() 