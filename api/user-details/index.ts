import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import fetch, { Headers } from "node-fetch";
import {
  getUserInfo,
  isAuthenticated,
} from "@aaronpowell/static-web-apps-api-auth";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (!isAuthenticated(req)) {
    context.res = {
      status: 401,
    };
    return;
  }

  const userInfo = getUserInfo(req);

  const headers = new Headers();
  headers.append("accept", "application/json");
  headers.append("user-agent", "azure-functions");
  headers.append(
    "authorization",
    `Basic ${Buffer.from(`aaronpowell:${process.env.GitHubToken}`).toString(
      "base64"
    )}`
  );
  const res = await fetch(
    `https://api.github.com/users/${userInfo.userDetails}`,
    {
      headers,
    }
  );
  if (!res.ok) {
    const body = await res.text();
    context.res = {
      status: res.status,
      body,
    };
    return;
  }
  const {
    login,
    avatar_url,
    html_url,
    name,
    company,
    blog,
    location,
    bio,
    twitter_username,
  } = await res.json();

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      login,
      avatar_url,
      html_url,
      name,
      company,
      blog,
      location,
      bio,
      twitter_username,
    },
  };
};

export default httpTrigger;
