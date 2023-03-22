import React from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useUser from "@/hooks/useUser";
import useLoginModal from "@/hooks/useLoginModal";
import {toast} from "react-hot-toast";
import axios from "axios";

const useFollow = (userId: string) => {
    const {data: currentUser, mutate: mutateCurrentUser} = useCurrentUser()
    const {mutate: mutateFetchedUser} = useUser(userId)

    const loginModal = useLoginModal()

    const isFollowing = React.useMemo(() => {
        const list = currentUser?.followingIds || []

        return list.includes(userId)
    }, [userId, currentUser])

    const toggleFollow = React.useCallback(async () => {
        if (!currentUser) {
            return loginModal.onOpen()
        }

        try {
            let request

            if (isFollowing) {
                request = () => axios.delete('/api/follow', {data: {userId}})
            } else {
                request = () => axios.post('/api/follow', {userId})
            }

            await request()

            mutateCurrentUser()
            mutateFetchedUser()

            toast.success('Success')
        } catch (error) {
            toast.error('Something went wrong')
        }
    }, [currentUser, isFollowing, userId, mutateCurrentUser, mutateFetchedUser, loginModal])
    return {isFollowing, toggleFollow}
}

export default useFollow;