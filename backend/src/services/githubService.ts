interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

interface GithubRepo {
  full_name: string;
  fork: boolean;
  has_wiki: boolean;
}

interface GithubLanguages {
  [lang: string]: number;
}

interface GithubPullRequest {
  merged_at: string | null;
}

interface ContributionDay {
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface ContributionStats {
  totalPullRequestReviewContributions: number;
  totalIssueContributions: number;
  contributionCalendar: ContributionCalendar;
}

export interface DemoCharacter {
  github_login: string;
  name: string | null;
  avatar_url: string;
  skills: {
    implementation: number;
    planning: number;
    speed: number;
    review: number;
    stamina: number;
    adaptability: number;
  };
  tech: {
    primary: string[];
    all: string[];
  };
  tendency: "implementation" | "planning" | "balanced";
  deck_score: number;
  generated_at: string;
}

const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
});

async function fetchUser(token: string): Promise<GithubUser> {
  const res = await fetch("https://api.github.com/user", { headers: ghHeaders(token) });
  if (!res.ok) {
    throw new Error("github_user_fetch_failed");
  }
  return (await res.json()) as GithubUser;
}

async function fetchAllRepos(token: string): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/user/repos?per_page=100&page=${page}&affiliation=owner`,
      { headers: ghHeaders(token) },
    );
    if (!res.ok) {
      throw new Error("github_repos_fetch_failed");
    }

    const data = (await res.json()) as GithubRepo[];
    if (data.length === 0) {
      break;
    }

    repos.push(...data);
    page += 1;
  }

  return repos;
}

async function fetchAllLanguages(token: string, repos: GithubRepo[]): Promise<GithubLanguages> {
  const nonForkRepos = repos.filter((repo) => !repo.fork);
  const languageMaps = await Promise.all(
    nonForkRepos.map(async (repo) => {
      const res = await fetch(`https://api.github.com/repos/${repo.full_name}/languages`, {
        headers: ghHeaders(token),
      });

      if (!res.ok) {
        return {};
      }

      return (await res.json()) as GithubLanguages;
    }),
  );

  const totals: GithubLanguages = {};
  for (const languageMap of languageMaps) {
    for (const [language, bytes] of Object.entries(languageMap)) {
      totals[language] = (totals[language] ?? 0) + bytes;
    }
  }

  return totals;
}

async function fetchPullRequests(token: string, login: string): Promise<GithubPullRequest[]> {
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);
  const sinceDate = since.toISOString().split("T")[0];

  const res = await fetch(
    `https://api.github.com/search/issues?q=author:${login}+type:pr+created:>=${sinceDate}&per_page=100`,
    { headers: ghHeaders(token) },
  );

  if (!res.ok) {
    throw new Error("github_prs_fetch_failed");
  }

  const data = (await res.json()) as { items: GithubPullRequest[] };
  return data.items;
}

async function fetchContributions(token: string, login: string): Promise<ContributionStats> {
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  const query = `
    query($login: String!, $from: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from) {
          totalPullRequestReviewContributions
          totalIssueContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...ghHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login, from: from.toISOString() },
    }),
  });

  if (!res.ok) {
    throw new Error("github_contributions_fetch_failed");
  }

  const data = (await res.json()) as {
    data?: { user?: { contributionsCollection?: ContributionStats } };
    errors?: Array<{ message: string }>;
  };

  const contributions = data.data?.user?.contributionsCollection;
  if (!contributions) {
    throw new Error(data.errors?.[0]?.message ?? "github_contributions_parse_failed");
  }

  return contributions;
}

function calcImplementation(totalContributions: number): number {
  return Math.round(totalContributions);
}

function calcPlanning(repos: GithubRepo[], techCount: number): number {
  const nonForkRepos = repos.filter((repo) => !repo.fork);
  const wikiCount = nonForkRepos.filter((repo) => repo.has_wiki).length;

  return Math.round(nonForkRepos.length * 12 + wikiCount * 18 + techCount * 6);
}

function calcSpeed(contributions: ContributionStats, prs: GithubPullRequest[]): number {
  const commitsPerMonth = (contributions.contributionCalendar.totalContributions / 365) * 30;
  const mergedPrs = prs.filter((pr) => pr.merged_at).length;

  return Math.round(commitsPerMonth * 10 + mergedPrs * 5);
}

function calcReview(contributions: ContributionStats, prs: GithubPullRequest[]): number {
  const mergedPrs = prs.filter((pr) => pr.merged_at).length;

  return Math.round(
    contributions.totalPullRequestReviewContributions * 18 +
      contributions.totalIssueContributions * 6 +
      mergedPrs * 2,
  );
}

function calcLongestStreak(calendar: ContributionCalendar): number {
  let longest = 0;
  let current = 0;

  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      if (day.contributionCount > 0) {
        current += 1;
        longest = Math.max(longest, current);
      } else {
        current = 0;
      }
    }
  }

  return longest;
}

function calcStamina(contributions: ContributionStats): number {
  const longestStreak = calcLongestStreak(contributions.contributionCalendar);
  const yearlyVolume = contributions.contributionCalendar.totalContributions;

  return Math.round(longestStreak * 12 + yearlyVolume * 0.15);
}

function calcAdaptability(repos: GithubRepo[], languages: GithubLanguages): number {
  const nonForkCount = repos.filter((repo) => !repo.fork).length;
  const languageCount = Object.keys(languages).length;
  const weightedBreadth = Object.values(languages).filter((bytes) => bytes >= 5000).length;

  return Math.round(languageCount * 18 + weightedBreadth * 12 + nonForkCount * 2);
}

function calcTendency(
  implementation: number,
  planning: number,
  speed: number,
): "implementation" | "planning" | "balanced" {
  const average = (implementation + planning + speed) / 3;

  if (implementation > average + 15 && speed > average + 15) {
    return "implementation";
  }

  if (planning > average + 15) {
    return "planning";
  }

  return "balanced";
}

function calcDeckScore(
  implementation: number,
  planning: number,
  speed: number,
  review: number,
  stamina: number,
  adaptability: number,
): number {
  return Math.round(
    implementation * 0.3 +
      speed * 0.23 +
      planning * 0.17 +
      review * 0.12 +
      stamina * 0.1 +
      adaptability * 0.08,
  );
}

export async function fetchGithubProfile(token: string): Promise<GithubUser> {
  return fetchUser(token);
}

export async function buildCharacterFromGithub(token: string): Promise<DemoCharacter> {
  const user = await fetchUser(token);
  const repos = await fetchAllRepos(token);
  const [languages, contributions, prs] = await Promise.all([
    fetchAllLanguages(token, repos),
    fetchContributions(token, user.login),
    fetchPullRequests(token, user.login),
  ]);

  const sortedLanguages = Object.entries(languages).sort(([, a], [, b]) => b - a);
  const implementation = calcImplementation(contributions.contributionCalendar.totalContributions);
  const planning = calcPlanning(repos, sortedLanguages.length);
  const speed = calcSpeed(contributions, prs);
  const review = calcReview(contributions, prs);
  const stamina = calcStamina(contributions);
  const adaptability = calcAdaptability(repos, languages);

  return {
    github_login: user.login,
    name: user.name,
    avatar_url: user.avatar_url,
    skills: {
      implementation,
      planning,
      speed,
      review,
      stamina,
      adaptability,
    },
    tech: {
      primary: sortedLanguages.slice(0, 2).map(([language]) => language),
      all: sortedLanguages.map(([language]) => language),
    },
    tendency: calcTendency(implementation, planning, speed),
    deck_score: calcDeckScore(
      implementation,
      planning,
      speed,
      review,
      stamina,
      adaptability,
    ),
    generated_at: new Date().toISOString(),
  };
}
