import React from 'react';

// only for type inferencing, so no worries for its location being outside of 'src/'
import { BlogData } from '@@data/BlogData';
import { ContentData } from '@@data/ContentData';

const EnvDataContext = React.createContext<EnvData | undefined>(undefined);

const EnvDataProvider = ({
  children,
  data,
}) => {
  return (
    <EnvDataContext.Provider value={data}>
      {children}
    </EnvDataContext.Provider>
  );
};

const useEnvData = (): EnvData | undefined => React.useContext(EnvDataContext);
const useContentData = () => React.useContext(EnvDataContext)?.contentData;

export {
  EnvDataProvider,
  useContentData,
  useEnvData,
};

interface EnvData {
  blogData: BlogData;
  builtAt: number;
  contentData: ContentData;
  latestCommitHash: string;
  repositoryUrl: string;
}
