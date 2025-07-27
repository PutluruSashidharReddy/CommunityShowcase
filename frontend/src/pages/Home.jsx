import React, { useState, useEffect } from 'react';
import { Loader, Card, FormField } from '../components';
import axiosInstance from '../api/axiosInstance';

// The RenderCards component is now responsible for passing the handler functions to each Card
const RenderCards = ({ data, title, handleDeletePost, handleUpdatePost }) => {
  if (data?.length > 0) {
    return data.map((post) => (
      <Card
        key={post._id}
        {...post}
        handleDeletePost={handleDeletePost} // Pass delete handler
        handleUpdatePost={handleUpdatePost} // Pass update handler
      />
    ));
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch all posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/post');
        // Reverse the array to show the newest posts first
        setAllPosts(response.data.data.reverse());
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // --- NEW: HANDLER FOR DELETING A POST ---
  const handleDeletePost = async (postId) => {
    // Confirm with the user before deleting
    const confirmed = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmed) return;

    try {
      // Make the API call to the backend
      await axiosInstance.delete(`/post/${postId}`);

      // Update the local state to remove the post, so the UI updates instantly
      setAllPosts(allPosts.filter((post) => post._id !== postId));
      
      // Also update the searched results if they are being displayed
      if(searchedResults) {
        setSearchedResults(searchedResults.filter((post) => post._id !== postId));
      }

      alert('Post deleted successfully!');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete post');
    }
  };

  // --- NEW: HANDLER FOR UPDATING A POST ---
  const handleUpdatePost = async (postId, updatedData) => {
    try {
      // Make the API call to update the post
      const response = await axiosInstance.put(`/post/${postId}`, updatedData);
      const updatedPost = response.data.data;

      // Update the post in the local state to reflect the changes immediately
      const newAllPosts = allPosts.map((post) => (post._id === postId ? updatedPost : post));
      setAllPosts(newAllPosts);

      // Also update the post in the searched results
       if(searchedResults) {
        const newSearchedResults = searchedResults.map((post) => (post._id === postId ? updatedPost : post));
        setSearchedResults(newSearchedResults);
      }

      alert('Post updated successfully!');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update post');
    }
  };

  // Handler for search functionality
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

  return (
    <section className="max-w-7xl mx-auto">
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
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No search results found"
                  handleDeletePost={handleDeletePost} // Pass handlers to search results
                  handleUpdatePost={handleUpdatePost}
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title="No posts found"
                  handleDeletePost={handleDeletePost} // Pass handlers to all posts
                  handleUpdatePost={handleUpdatePost}
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;