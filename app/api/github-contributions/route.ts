import { NextRequest, NextResponse } from 'next/server';
import type { ContributionCalendar, ContributionWeek, ContributionDay } from '@/types/contributions';

const GITHUB_GRAPHQL_API = 'https://api.github.com/graphql';

const QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
            }
          }
        }
      }
    }
  }
`;

const YEARS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionYears
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const yearStr = searchParams.get('year');
  const isAllTime = yearStr === 'all';
  const year = isAllTime ? new Date().getFullYear() : (yearStr ? parseInt(yearStr, 10) : new Date().getFullYear());

  if (!isAllTime && isNaN(year)) {
    return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 });
  }

  const token = process.env.GITHUB_CONTRIBUTIONS_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!token || !username) {
    return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 });
  }

  if (isAllTime) {
    try {
      const yearsRes = await fetch(GITHUB_GRAPHQL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: YEARS_QUERY, variables: { username } }),
        next: { revalidate: 3600 },
      });

      if (!yearsRes.ok) return NextResponse.json({ error: 'Failed to fetch active years' }, { status: yearsRes.status });
      const yearsData = await yearsRes.json();
      
      const activeYears = yearsData?.data?.user?.contributionsCollection?.contributionYears;
      if (!Array.isArray(activeYears) || activeYears.length === 0) {
        return NextResponse.json({ error: 'No active years found' }, { status: 404 });
      }

      let dynamicQuery = `query { user(login: "${username}") { `;
      activeYears.forEach((y) => {
        dynamicQuery += `
          year${y}: contributionsCollection(from: "${y}-01-01T00:00:00Z", to: "${y}-12-31T23:59:59Z") {
            contributionCalendar {
              totalContributions
            }
          }
        `;
      });
      dynamicQuery += ` } }`;

      const totalRes = await fetch(GITHUB_GRAPHQL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: dynamicQuery }),
        next: { revalidate: 3600 },
      });

      if (!totalRes.ok) return NextResponse.json({ error: 'Failed to fetch total contributions' }, { status: totalRes.status });
      const totalData = await totalRes.json();

      let totalAllTime = 0;
      activeYears.forEach((y) => {
        totalAllTime += totalData?.data?.user?.[`year${y}`]?.contributionCalendar?.totalContributions || 0;
      });

      return NextResponse.json({
        totalContributions: totalAllTime,
        username,
        years: activeYears,
      });

    } catch (error) {
      console.error('GitHub all-time contributions fetch error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { username, from, to },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: 'GitHub API authentication failed or rate limited' }, { status: response.status });
      }
      return NextResponse.json({ error: 'Failed to fetch from GitHub API' }, { status: response.status });
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GitHub GraphQL errors:', data.errors);
      const isNotFound = data.errors.some((err: any) => err.type === 'NOT_FOUND');
      if (isNotFound) {
        return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'GitHub API GraphQL error' }, { status: 500 });
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    // Map GitHub's contributionCount to our count
    const mappedWeeks: ContributionWeek[] = calendar.weeks.map((week: any) => ({
      days: week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        weekday: day.weekday,
      })),
    }));

    const result: ContributionCalendar = {
      year,
      totalContributions: calendar.totalContributions,
      weeks: mappedWeeks,
      username,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('GitHub contributions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
