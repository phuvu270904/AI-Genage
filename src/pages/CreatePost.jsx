import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';


const CreatePost = () => {
    const apiUrl = import.meta.env.VITE_APP_API_URL;
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: ''
    });
    const [generatingImg, setGeneratingImg] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            navigate('/login');
        }
    }, []);

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratingImg(true);
                const response = await fetch(
                    `${apiUrl}/api/v1/generate`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({inputs: form.prompt}),
                    }
                );
                const result = await response.json();

                setForm({ ...form, photo: result.photo });
                
            } catch (error) {
                console.log(error);
            } finally {
                setGeneratingImg(false);
            }
        } else {
            alert('Please enter a prompt');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.name && form.prompt && form.photo) {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/api/v1/posts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(form)
                });
                const data = await res.json();
                if (data.success) {
                    navigate('/');
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert('Please fill in all fields');
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({ ...form, prompt: randomPrompt });
    }

    return (
        <section className='max-w-7xl mx-auto'>
            <div className='flex flex-col items-center'>
                <h1 className='font-extrabold text-[#222328] text-[50px]'>Create a Post</h1>
                <p className='mt-2 text-[#666e75] text-[25px] max-w[500px]'>Create imaginative and visually stunning images through AI and share them with the community</p>
            </div>

            <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="Your name"
                        type="text"
                        name="name"
                        placeholder="Phu Vu"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="A plush toy robot sitting against a yellow wall"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
                        {form.photo ? (
                            <img 
                                src={form.photo} 
                                alt={form.prompt}
                                className='w-full h-full object-contain'
                            />
                        ): (
                            <img 
                                src={preview} 
                                alt='preview'
                                className='w-9/12 h-9/12 object-contain opacity-40'
                            />
                        )}

                        {generatingImg && (
                            <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className='text-white bg-green-700 font-medium rounded-md txt-sm w-full sm:w-auto px-5 py-2.5 text-center'
                    >
                        {generatingImg ? "Generating Image..." : "Generate Image"}
                    </button>
                </div>

                <div className="mt-10">
                    <p className='mt-2 text-[#666e75] text-[14px]'>Once you have created the image you want, you can share it with others in the community</p>
                    <button
                        type='submit'
                        className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                    >
                        {loading ? "Sharing..." : "Share with the community"}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default CreatePost