import React from 'react';
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import {signIn} from "next-auth/react";

import Input from "@/components/Input";
import Modal from "@/components/Modal";

const LoginModal = () => {
    const loginModal = useLoginModal()
    const registerModal = useRegisterModal()

    const [email, setEmail] = React.useState('')
    const [password, serPassword] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const onToggle = React.useCallback(() => {
        if (isLoading) {
            return
        }
        loginModal.onClose();
        registerModal.onOpen();
    }, [isLoading, registerModal, loginModal])


    const onSubmit = React.useCallback(async () => {
        try {
            setIsLoading(true)

            await signIn('credentials', {
                email,
                password
            })

                loginModal.onClose()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }, [loginModal, email, password])

    const bodyContent = (
        <div className={'flex flex-col gap-4'}>
            <Input
                placeholder={'email'}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
            />
            <Input
                placeholder={'password'}
                onChange={(e) => serPassword(e.target.value)}
                type={password}
                value={password}
                disabled={isLoading}
            />
        </div>
    )

    const footerContent = (
        <div className={'text-neutral-400 text-center mt-4'}>
            <p>First time using Twitter?
                <span
                    onClick={onToggle}
                    className={'text-white cursor-pointer hover:underline'}
                > Create an account
                </span>
            </p>
        </div>
    )

    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Sign in"
            onClose={loginModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
            footer={footerContent}/>
    );
};

export default LoginModal;