import React from "react";
import {toast} from "react-hot-toast";
import axios from "axios";

import useCurrentUser from "@/hooks/useCurrentUser";
import usePost from "@/hooks/usePost";
import usePosts from "@/hooks/usePosts";
import useLoginModal from "@/hooks/useLoginModal";


const useLike = ({postId, userId}: { postId: string, userId?: string }) => {
    const {data: currentUser} = useCurrentUser()
    const {data: fetchedPost, mutate: mutateFetchedPost} = usePost(postId)
    const {mutate: mutateFetchedPosts} = usePosts(userId)

    const loginModal = useLoginModal()

    const hasLiked = React.useMemo(() => {
        const list = fetchedPost?.likeIds || []

        return list.includes(currentUser?.id)
    }, [currentUser, fetchedPost])

    const toggleLike = React.useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        try {
            let request

            if (hasLiked) {
                request = () => axios.delete('/api/like', {data: {postId}})
            } else {
                request = () => axios.post('/api/like', {postId})
            }

            await request()
            await mutateFetchedPost()
            await mutateFetchedPosts()

            toast.success('Success')

        } catch (error) {
            toast.error('Something went wrong')
        }
    }, [currentUser, hasLiked, mutateFetchedPost, mutateFetchedPosts, loginModal])

    return {
        hasLiked,
        toggleLike,
    }
}

export default useLike;