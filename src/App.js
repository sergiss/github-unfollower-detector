import { useEffect, useState } from "react";
import Table from "./components/Table";
import UserForm from "./components/UserForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import TabPanel from "./components/TabPanel";
import Spinner from "./components/Spinner";

const GITHUB_URL = 'https://github.com';

const getData = async (login, query) => {
  let result = {};
  let data, i = 0;
  do {
    i++;
    const url = `https://api.github.com/users/${login}/${query}?per_page=100&page=${i}`;
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    data = await response.json();
    for(let j = 0; j < data.length; ++j) {
      let d = data[j];
      result[d.login] = {
        id: d.login,
        avatar_url: d.avatar_url
      }
    }
  } while(data.length > 0);
  return result;
}

function App() {

  const [ user, setUser] = useState(localStorage.getItem("user") || "");
  const [ query, setQuery ] = useState(true);
  const [ data, setData ] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const showMessage = (className, text) => {
    setMessage({
      ...message,
      className, text
    });

    setTimeout(()=> {
      setMessage(null);
    }, 5000);
  }

  const refreshCurrentData = async (login)=> {

    setLoading(true);

    try {

      // Request data from the server
      const following = await getData(login, "following");    
      const followers = await getData(login, "followers");

      // Save data from localStorage
      const unfriendly  = JSON.parse(localStorage.getItem(`${login}-unfriendly`)) || {};  
      let lastFollowers = JSON.parse(localStorage.getItem(`${login}-followers` )) || {};

      // Check unfriendly people
      let keys = Object.keys(lastFollowers);
      for(let i = 0; i < keys.length; ++i) {
          if(!followers[keys[i]]) {
            unfriendly[keys[i]] = lastFollowers[keys[i]];
            unfriendly[keys[i]].date = new Date();
          }
      }

      // Save data to localStorage
      localStorage.setItem(`${login}-followers` , JSON.stringify(followers ));
      localStorage.setItem(`${login}-unfriendly`, JSON.stringify(unfriendly));
      localStorage.setItem(`${login}-following` , JSON.stringify(following ));

      // Refresh
      setData({
        ...data,
        following,
        followers,
        unfriendly
      });

    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {

    if(query) {
      setQuery(false);
      if(user.trim() !== "") {
        refreshCurrentData(user).catch(e => {

          console.log(e);

          showMessage("message-error", e.message);

        });
        localStorage.setItem("user", user);
      }
    }
    
  }, [query]);

  const columns = [
    {
     id: 'id',
     label:'User',
     style: {
      width: "calc(100% - 60px)"
    },
     render: (data)=> data['id'],
    },
    {
      id: 'avatar_url',
      label:'Avatar',
      style: {
       width: "60px"
     },
      render: (data)=> <img src={data['avatar_url']} alt={data['id']} className="avatar"/>
    }
  ];

  let followers   = [];
  let following   = [];
  let notMutual   = [];
  let unfollowers = [];

  let friendSet = new Set();

  const friendInfo = {
    id: 'info',
     label:'Info',
     style: {
      width: "60px"
    },
     render: (data)=> friendSet.has(data['id']) ? "Friend" : ""
  }

  if(data) {

    let keys = Object.keys(data.following);
    for(let i = 0; i < keys.length; ++i) {
      if(!data.followers[keys[i]]) {
        // console.log(keys[i])
        notMutual.push(data.following[keys[i]]);
      } else {
        friendSet.add(keys[i]);
      }
    }

    followers   = Object.values(data.followers); 
    following   = Object.values(data.following);
    unfollowers = Object.values(data.unfriendly);

  }

  const handleSelection = (id)=> {
    const url = `${GITHUB_URL}\\${id}`;
    window.open(url, '_blank');
  }

  const elements = [
    {
      id:"following",
      label: `Following(${following.length})`,
      title: "List of users you are following",
      render: ()=> (<Table columns={[...columns, friendInfo]} rows={following} handleSelection={handleSelection}/>)
    },
    {
      id:"followers",
      label: `Followers(${followers.length})`,
      title: "List of users who are following you",
      render: ()=> (<Table columns={columns} rows={followers} handleSelection={handleSelection}/>)
    },
    {
      id:"notMutual",
      label: `Not Mutual(${notMutual.length})`,
      title: "List of users you follow, but they don't follow you",
      render: ()=> (<Table columns={columns} rows={notMutual} handleSelection={handleSelection}/>)
    },
    {
      id:"unfollowers",
      label: `Unfollowers(${unfollowers.length})`,
      title: "List of users who have unfollowed you :(",
      render: ()=> (<Table columns={columns} rows={unfollowers} handleSelection={handleSelection}/>)
    }
  ]

  return <div className="container">
    
    <h1 className="title">UNFOLLOWER DETECTOR</h1>

    {loading ? <Spinner/> : null}
    {message ? (
      <div className={`message ` + message.className}>
        <p>{message.text}</p>
      </div>
    ) : null }
    <UserForm user={user} setUser={setUser} setQuery={setQuery} />
    <TabPanel elements={elements}/>    
    <a href="https://github.com/sergiss/github-unfollower-detector" target="_blank"><i className="fa">&#xf09b;</i> Source Code </a>
  </div>;
}

export default App;