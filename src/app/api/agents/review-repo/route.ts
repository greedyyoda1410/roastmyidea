import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export const runtime = 'nodejs';
export const maxDuration = 180; // 3 minutes timeout

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    const githubMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!githubMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL. Only GitHub repositories are supported.' },
        { status: 400 }
      );
    }

    const [, owner, repoName] = githubMatch;
    const cleanRepoName = repoName.replace(/\.git$/, '');

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN, // Optional - works without for public repos
    });

    // Fetch repository data
    const [repoData, readme, languages, recentCommits, branches] = await Promise.all([
      octokit.repos.get({ owner, repo: cleanRepoName }),
      octokit.repos.getReadme({ owner, repo: cleanRepoName }).catch(() => null),
      octokit.repos.listLanguages({ owner, repo: cleanRepoName }),
      octokit.repos.listCommits({ owner, repo: cleanRepoName, per_page: 10 }).catch(() => ({ data: [] })),
      octokit.repos.listBranches({ owner, repo: cleanRepoName, per_page: 5 }).catch(() => ({ data: [] })),
    ]);

    // Get README content
    let readmeContent = '';
    if (readme?.data) {
      const content = Buffer.from(readme.data.content, 'base64').toString('utf-8');
      readmeContent = content.substring(0, 2000); // Limit to first 2000 chars
    }

    // Analyze repository structure
    const analysis = {
      name: repoData.data.name,
      description: repoData.data.description || 'No description provided',
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      watchers: repoData.data.watchers_count,
      openIssues: repoData.data.open_issues_count,
      readme: readmeContent,
      languages: languages.data,
      primaryLanguage: repoData.data.language || 'Unknown',
      hasWiki: repoData.data.has_wiki,
      hasPages: repoData.data.has_pages,
      branches: branches.data.map(b => b.name),
      recentCommits: recentCommits.data.slice(0, 5).map(commit => ({
        message: commit.commit.message,
        author: commit.commit.author?.name || 'Unknown',
        date: commit.commit.author?.date || '',
        hash: commit.sha.substring(0, 7),
      })),
      license: repoData.data.license?.name || 'No license',
      defaultBranch: repoData.data.default_branch,
      createdAt: repoData.data.created_at,
      updatedAt: repoData.data.updated_at,
      size: repoData.data.size,
    };

    // Generate summary for judges
    const summary = `
Repository: ${analysis.name}
Description: ${analysis.description}
Stars: ${analysis.stars} | Forks: ${analysis.forks}
Primary Language: ${analysis.primaryLanguage}
Languages: ${Object.keys(analysis.languages).join(', ')}
Recent Activity: ${analysis.recentCommits.length} commits
License: ${analysis.license}
README Preview: ${readmeContent.substring(0, 500)}...
`;

    return NextResponse.json({
      success: true,
      analysis,
      summary
    });

  } catch (error) {
    console.error('Error reviewing repository:', error);
    
    if ((error as Error & { status?: number })?.status === 404) {
      return NextResponse.json(
        { error: 'Repository not found or is private' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze repository', message: (error as Error).message },
      { status: 500 }
    );
  }
}
