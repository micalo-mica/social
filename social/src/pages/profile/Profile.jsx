import "./profile.css"
import Topbar from "../../components/topbar/Topbar"
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState , useEffect} from "react"
import axios from "axios";
import { useParams } from "react-router";

export default function Profile() {
    const [user, setUser] = useState({})
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    // const {username} = useParams() or this way
    const username = useParams().username;

    useEffect(()=>{
        async function fetchUser() {
    try {
        const res = await axios.get(`/users?username=${username}`);
        console.log(res.data)
        setUser(res.data)
    } catch (error) {
        console.log(error);
        }
    }
        fetchUser()
    },[username]);

    return (
        <>
            <Topbar/>
            <div className="profile">
                <Sidebar/>
                <div className="profileRight">
                    <div className="ProfileRightTop">
                        <div className="profileCover">
                            <img src={user.coverPicture || PF+"person/noCover.png"} alt="" className="profileCoverImg" />
                            <img src={user.profilePicture || PF+"person/noAvatar.png"} alt="" className="profileUserImg" />
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{user.username}</h4>
                            <span className="profileInfoDesc">{user.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username}/>
                        <Rightbar user={user}/>
                    </div>
                </div>
            </div>
        </>
    )
}
