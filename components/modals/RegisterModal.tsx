import axios from "axios";
import {toast} from "react-hot-toast";
import React from "react";
import {signIn} from 'next-auth/react';

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";

import Input from "../Input";
import Modal from "../Modal";

const  RegisterModal = () => {
    const loginModal = useLoginModal()
    const registerModal = useRegisterModal()

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [name, setName] = React.useState('')
    const [username, setUsername] = React.useState('')

    const [isLoading, setIsLoading] = React.useState(false)

    const onToggle = React.useCallback(() => {
        if (isLoading) {
            return
        }
        registerModal.onClose();
        loginModal.onOpen();
    }, [isLoading, registerModal, loginModal])

    const onSubmit = React.useCallback(async () => {
        try {
            setIsLoading(true);

            await axios.post('/api/register', {
                email,
                password,
                username,
                name,
            });

            setIsLoading(false)

            toast.success('Account created.');

            await signIn('credentials', {
                email,
                password,
            });


            registerModal.onClose()
        } catch (error) {
            console.log(error)
            toast.error('Somethings went wrong')
        } finally {
            setIsLoading(false)
        }
    }, [registerModal, email, password, username, name])

    const bodyContent = (
        <div className={'flex flex-col gap-4'}>
            <Input
                placeholder={'email'}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
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
                placeholder={'password'}
                type={password}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
            />
        </div>
    )

    const footerContent = (
        <div className={'text-neutral-400 text-center mt-4'}>
            <p>Already have an account?
                <span onClick={onToggle}
                      className={'text-white cursor-pointer hover:underline'}
                > Sign in
                </span>
            </p>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title='Create an account'
            actionLabel='Register'
            onClose={registerModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
            footer={footerContent}
        />
    );
};

export default RegisterModal;