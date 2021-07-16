import { useClientPrincipal } from "@aaronpowell/react-static-web-apps-auth";
import React, { createContext, useContext } from "react";

type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  bio: string;
  twitter_username: string;
};

const GitHubIdentityContext = createContext<GitHubUser | null>(null);

const GitHubIdentityContextProvider = ({ children }: any) => {
  const swaUser = useClientPrincipal();
  const [githubUser, setGitHubUser] = React.useState<GitHubUser | null>(null);

  React.useEffect(() => {
    if (swaUser.loaded && swaUser.clientPrincipal) {
      fetch("/api/user-details")
        .then((res) => res.json())
        .then(setGitHubUser);
    }
  }, [swaUser]);

  return (
    <GitHubIdentityContext.Provider value={githubUser}>
      {children}
    </GitHubIdentityContext.Provider>
  );
};

const useGitHubUser = () => useContext(GitHubIdentityContext);

export { GitHubIdentityContextProvider, useGitHubUser };
