import { request } from "http";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const quert = `
    query getuserProfile($username: String!) {
      allQuestionsCount {
        difficulty
        count
      }
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
        profile {
          ranking
        }
        userCalendar(year: 2025) {
          activeYears
          streak
          totalActiveDays
          dccBadges {
            timestamp
            badge {
              name
              icon
            }
          }
          submissionCalendar
        }
      }
      recentSubmissionList(username: $username, limit: 15) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;



  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: quert,
      variables: { username: username }
    });
    const data = response.data
    if (data.errors || !data.data.matchedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      message: "Successfully fetched from LeetCode",
      stats: data.data.matchedUser.submitStats.acSubmissionNum,
      totalQuestions: data.data.allQuestionsCount,
      recentSubmissions: data.data.recentSubmissionList,
      Calendar: data.data.matchedUser.userCalendar,
      ranking: data.data.matchedUser.profile?.ranking || 0
    })
  } catch (error) {
    console.error("Error fetching from LeetCode:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}