import {
  StaticWebAuthLogins,
  useClientPrincipal,
} from "@aaronpowell/react-static-web-apps-auth";
import React from "react";
import "./App.css";
import {
  GitHubIdentityContextProvider,
  useGitHubUser,
} from "./GitHubIdentityContext";

function Login() {
  return (
    <section>
      <h1>Login</h1>
      <StaticWebAuthLogins azureAD={false} twitter={false} />
    </section>
  );
}

function User() {
  const githubUser = useGitHubUser();

  if (!githubUser) {
    return null;
  }

  return (
    <div>
      <h1>{githubUser.name}</h1>
      <h2>
        Works at {githubUser.company} in {githubUser.location}
      </h2>
      <p>{githubUser.bio}</p>
      <ul>
        <li>
          <a href={githubUser.html_url}>Profile</a>
        </li>
        <li>
          <a href={`https://twitter.com/${githubUser.twitter_username}`}>
            Twitter
          </a>
        </li>
      </ul>
    </div>
  );
}

function App() {
  const details = useClientPrincipal();

  if (!details.loaded) {
    return (
      <section>
        <h1>Loading...</h1>
      </section>
    );
  }

  if (!details.clientPrincipal) {
    return <Login />;
  }

  return (
    <GitHubIdentityContextProvider>
      <User />
    </GitHubIdentityContextProvider>
  );
}

export default App;
