import { useEffect , useState} from "react"

export function PostList() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        getPost()
        .then((data) => setPosts(data))
    }
    , []);

    return <h1> {JSON.stringify(posts)}</h1>
}