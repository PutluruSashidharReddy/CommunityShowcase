import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField, Loader } from '../components';
import axiosInstance from '../api/axiosInstance';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    caption: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.caption && form.photo) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('caption', form.caption);
        formData.append('photo', form.photo);

        await axiosInstance.post('/post', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        navigate('/');
      } catch (err) {
        const message = err?.response?.data?.message || 'Failed to create post';
        setError(message);
        alert(message);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a caption and upload an image');
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'photo') {
      setForm({ ...form, photo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Share with the Community</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">Upload and share your images with the community</p>
      </div>

      <form className="mt-16 max-w-3x1" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            LabelName="Your Name"
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            LabelName="Caption"
            type="text"
            name="caption"
            placeholder="Enter the Caption for your image"
            value={form.caption}
            handleChange={handleChange}
          />
          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-900">
              Upload Image
            </label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="mt-10">
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            disabled={loading}
          >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
        {loading && <div className="flex justify-center items-center mt-4"><Loader /></div>}
      </form>
    </section>
  );
};

export default CreatePost;
