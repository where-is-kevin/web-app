import React, { useState, useRef, ChangeEvent } from 'react';
import { Avatar } from 'flowbite-react';
import axiosInstance from "@/utils/axiosInstance";

function PicturePicker() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);

            axiosInstance.post('/api/v2/user/picture/create', {
                image: await toBase64(file)
            })
        } else {
            console.log('image removed')
            // @todo delete image from profile
        }
    };

    const userImage = () => {

        return selectedImage ? <img className={'rounded-full aspect-square object-cover'} src={selectedImage} width={120} alt={'User avatar'}/>
            :
            <div className={'rounded-full relative overflow-hidden bg-gray-100 dark:bg-gray-600'}>
                <svg className="absolute-bottom-1 h-auto w-auto text-gray-400" width={'100'} height={'100'}
                     fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"></path>
                </svg>
            </div>
    }

    const openFileChooser = () => {
        fileInputRef.current?.click();
    };


    return (
        <div onClick={openFileChooser} style={{ cursor: 'pointer', display: 'inline-block' }}>
            <Avatar
                img={userImage}
                rounded
                size="xl"
                alt="User profile picture"
                // theme={{
                //     root: {
                //         base: 'p-3'
                //     }
                // }}
            >
            </Avatar>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
        </div>
    );
}

export default PicturePicker;
