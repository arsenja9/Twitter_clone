import React from 'react';
import useCurrentUser from "@/hooks/useCurrentUser";
import useUser from "@/hooks/useUser";
import useEditModal from "@/hooks/useEditModal";
import {toast} from "react-hot-toast";
import axios from "axios";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import ImageUpload from "@/components/ImageUpload";

const EditModal = () => {
    const {data: currentUser} = useCurrentUser()
    const {mutate: mutateFetchedUser} = useUser(currentUser?.id)
    const editModal = useEditModal()

    const [profileImage, setProfileImage] = React.useState('')
    const [coverImage, setCoverImage] = React.useState('')
    const [name, setName] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [bio, setBio] = React.useState('')

    React.useEffect(() => {
        setProfileImage(currentUser?.profileImage)
        setCoverImage(currentUser?.coverImage)
        setName(currentUser?.name)
        setUsername(currentUser?.username)
        setBio(currentUser?.bio)
    }, [currentUser?.profileImage, currentUser?.coverImage, currentUser?.name, currentUser?.username, currentUser?.bio])

    const [isLoading, setIsLoading] = React.useState(false)

    const onSubmit = React.useCallback(async () => {
        try {
            setIsLoading(true)

            await axios.patch('/api/edit', {
                name,
                username,
                bio,
                profileImage,
                coverImage
            })
            await mutateFetchedUser()

            toast.success('Update')

            editModal.onClose()
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }, [
        name,
        username,
        bio,
        profileImage,
        coverImage,
        editModal,
        mutateFetchedUser])

    const bodyContent = (
        <div className={'flex flex-col gap-4'}>
            <ImageUpload
                value={profileImage}
                disabled={isLoading}
                onChange={(image) => setProfileImage(image)}
                label='Upload profile image'
            />
            <ImageUpload
                value={coverImage}
                disabled={isLoading}
                onChange={(image) => setCoverImage(image)}
                label='Upload cover image'
            />
            <Input
                placeholder={'Name'}
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
            />
            <Input
                placeholder={'Username'}
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                disabled={isLoading}
            />
            <Input
                placeholder={'Bio'}
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                disabled={isLoading}
            />
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={editModal.isOpen}
            title='Edit your profile'
            actionLabel='Save'
            onClose={editModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}/>
    );
};

export default EditModal;