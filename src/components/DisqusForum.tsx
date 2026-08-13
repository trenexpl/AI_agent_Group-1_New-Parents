import React, { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, Sparkles } from 'lucide-react';

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  date: string;
  text: string;
  likes: number;
  category: string;
}

export const DisqusForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'p1',
      author: 'Sarah Tan (Mom of 2)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      date: '2 hours ago',
      text: 'Has anyone tried the Robotics trial class at CodeKids? My 8-year-old loved building his first Lego EV3 robot!',
      likes: 8,
      category: 'Coding & Tech',
    },
    {
      id: 'p2',
      author: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      date: 'Yesterday',
      text: 'Super happy with the flexibility of using Happy Parents credits across different studios without buying 10-lesson packages!',
      likes: 15,
      category: 'Class Credits',
    },
    {
      id: 'p3',
      author: 'Melissa Wong',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      date: '2 days ago',
      text: 'Looking for recommended speech & drama academies in the East for a shy 5-year-old. Any parent reviews for StageCraft?',
      likes: 6,
      category: 'Recommendations',
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const post: ForumPost = {
      id: `p_${Date.now()}`,
      author: 'You (Happy Parent)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      date: 'Just now',
      text: newComment.trim(),
      likes: 0,
      category: 'General Discussion',
    };

    setPosts([post, ...posts]);
    setNewComment('');
  };

  const handleLike = (id: string) => {
    const isLiked = likedPosts[id];
    setLikedPosts((prev) => ({ ...prev, [id]: !isLiked }));
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p
      )
    );
  };

  return (
    <section id="disqus_thread" className="bg-white rounded-2xl p-5 sm:p-7 border border-[#c3c5d9]/30 shadow-xs space-y-5 mt-8">
      <div className="border-b border-[#c3c5d9]/20 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-[#191c1e] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#0042c8]" />
            Parent Community & Reviews Forum
          </h3>
          <p className="text-xs text-[#434656] mt-0.5">
            Connect with fellow parents, share class feedback, and discover top enrichment recommendations.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0042c8]/5 text-[#0042c8] rounded-full text-xs font-semibold self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Parent Community</span>
        </div>
      </div>

      {/* New Post Form */}
      <form onSubmit={handlePostComment} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Ask a question or share a recommendation with other parents..."
          className="flex-1 bg-[#f8f9fb] border border-[#c3c5d9]/40 rounded-full px-4 py-2.5 text-xs text-[#191c1e] focus:ring-2 focus:ring-[#0042c8] focus:bg-white outline-hidden transition-all"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="bg-[#0042c8] disabled:opacity-50 text-white rounded-full px-5 py-2.5 text-xs font-bold flex items-center gap-1.5 hover:bg-[#0036a3] active:scale-98 transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>

      {/* Posts Feed */}
      <div className="space-y-3 pt-1">
        {posts.map((post) => {
          const isLiked = likedPosts[post.id];
          return (
            <div
              key={post.id}
              className="bg-[#f8f9fb] hover:bg-[#f1f3f7] transition-colors rounded-2xl p-4 border border-[#c3c5d9]/25 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#191c1e]">{post.author}</span>
                      <span className="text-[10px] bg-[#0042c8]/10 text-[#0042c8] font-medium px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#747688] block">{post.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-[#0042c8] text-white border-[#0042c8]'
                      : 'bg-white text-[#434656] border-[#c3c5d9]/40 hover:border-[#0042c8] hover:text-[#0042c8]'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>
              </div>
              <p className="text-xs text-[#2b2d3b] leading-relaxed pl-10 font-normal">
                {post.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};


