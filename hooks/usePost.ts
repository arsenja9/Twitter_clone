import useSWR from 'swr';

import fetcher from '@/libs/fetcher';

const usePost = (postID?: string) => {
    const url = postID ? `/api/posts/${postID}` : null
    const {data, error, isLoading, mutate} = useSWR(url, fetcher);

    return {
        data,
        error,
        isLoading,
        mutate
    }
};

export default usePost;