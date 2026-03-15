import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user1 = searchParams.get("user1");
  const user2 = searchParams.get("user2");

  if (!user1 || !user2) {
    return NextResponse.json({ error: 'Both user1 and user2 usernames are required for comparison' }, { status: 400 });
  }
  const currentYear = new Date().getFullYear();
  const query = `
    query getComparisonProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        profile {
          realName
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        badges {
          id
          displayName
          icon
        }
        userCalendar(year: ${currentYear}) {
          activeYears
          streak
          totalActiveDays
        }
        tagProblemCounts {
          advanced {
            tagName
            problemsSolved
          }
          intermediate {
            tagName
            problemsSolved
          }
          fundamental {
            tagName
            problemsSolved
          }
        }
      }
      recentSubmissionList(username: $username, limit: 5) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
      recentAcSubmissionList(username: $username, limit: 5) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;

  try {
    const [res1, res2] = await Promise.all([
      axios.post('https://leetcode.com/graphql', { query, variables: { username: user1 } }),
      axios.post('https://leetcode.com/graphql', { query, variables: { username: user2 } })
    ]);
    
    const data1 = res1.data.data;
    const data2 = res2.data.data;
    if (!data1?.matchedUser || !data2?.matchedUser) {
      return NextResponse.json({ error: "One or both users not found on LeetCode" }, { status: 404 });
    }
    const formatUserData = (username: string, rawData: any) => {
      const user = rawData.matchedUser;
      
      return {
        username,
        realName: user.profile.realName,
        ranking: user.profile.ranking,
        badges: user.badges || null,
        activeYears: user.userCalendar.activeYears,
        streak: user.userCalendar.streak, 
        totalActiveDays: user.userCalendar.totalActiveDays,
        topicsSolved: user.tagProblemCounts, 
        recentSubmissions: rawData.recentSubmissionList, 
        recentAcSubmissions: rawData.recentAcSubmissionList,
        stats: {
          all: { solved: user.submitStats.acSubmissionNum[0].count, total: data1.allQuestionsCount[0].count },
          easy: { solved: user.submitStats.acSubmissionNum[1].count, total: data1.allQuestionsCount[1].count },
          medium: { solved: user.submitStats.acSubmissionNum[2].count, total: data1.allQuestionsCount[2].count },
          hard: { solved: user.submitStats.acSubmissionNum[3].count, total: data1.allQuestionsCount[3].count },
        }
      };
    };

    return NextResponse.json({
      user1: formatUserData(user1, data1),
      user2: formatUserData(user2, data2)
    });

  } catch (error) {
    console.error("Error fetching comparison data:", error);
    return NextResponse.json({ error: "Failed to fetch from LeetCode API" }, { status: 500 });
  }
}