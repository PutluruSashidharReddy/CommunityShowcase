import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, Card, FormField } from '../components';
import axiosInstance from '../api/axiosInstance';

const RenderCards = ({ data, title, handleDeletePost, handleUpdatePost }) => {
  if (data?.length > 0) {
    return data.map((post) => (
      <Card
        key={post._id}
        {...post}
        handleDeletePost={handleDeletePost}
        handleUpdatePost={handleUpdatePost}
      />
    ));
  }
  return <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>;
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/post');
        setAllPosts(response.data.data.reverse());
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/post/${postId}`);
      setAllPosts(allPosts.filter((post) => post._id !== postId));
      if(searchedResults) {
        setSearchedResults(searchedResults.filter((post) => post._id !== postId));
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleUpdatePost = async (postId, updatedData) => {
    try {
      const response = await axiosInstance.put(`/post/${postId}`, updatedData);
      const updatedPost = response.data.data;
      setAllPosts(allPosts.map((post) => (post._id === postId ? updatedPost : post)));
      if(searchedResults) {
        setSearchedResults(searchedResults.map((post) => (post._id === postId ? updatedPost : post)));
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update post');
    }
  };
  
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts?.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.caption.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResults);
      }, 500)
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.section
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
    >
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">The Community Showcase</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">Browse through a collection of imaginative and visually stunning images shared by the Users</p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Search Posts"
          type="text"
          name="text"
          placeholder="Search community posts"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center"><Loader /></div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            
            {/* THE ONLY CHANGE IS HERE: Added 'items-start' to the className */}
            <motion.div
              className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 items-start"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No search results found"
                  handleDeletePost={handleDeletePost}
                  handleUpdatePost={handleUpdatePost}
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="No posts found"
                  handleDeletePost={handleDeletePost}
                  handleUpdatePost={handleUpdatePost}
                />
              )}
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default Home;