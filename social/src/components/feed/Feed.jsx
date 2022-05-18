import "./feed.css"
import Share from "../share/Share"
import Post from "../post/Post"
import { useEffect, useState } from "react"
const axios = require('axios');

export default function Feed({username}) {
    const [posts,setPosts] = useState([]);

    useEffect(()=>{
        async function fetchPosts() {
  try {
    const res = username 
    ? await axios.get("posts/profile/" + username)
    : await axios.get("posts/timeline/61b4b1e7921283e0a1b761c7");
    console.log(res.data)
    setPosts(res.data)
  } catch (error) {
    console.log(error);
  }
}

        fetchPosts()
    },[username]);

    return (
        <div className="feed">
            <div className="feedWrapper">
                <Share/>
                {posts.map(p =>(
                    <Post key={p._id} post={p}/>
                ))}
                
            </div>
        </div>
    )
}
