import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | OCS BBS Dashboard`;
    return () => {
      document.title = 'OCS BBS Dashboard';
    };
  }, [title]);
};

export default usePageTitle;