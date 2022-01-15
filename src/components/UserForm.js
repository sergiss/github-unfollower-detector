import React from "react";
import { useState } from "react";

function UserForm({user, setUser, setQuery}) {

  const [error, setError] = useState(false);

  const handleUser = () => {
    if (user.trim() === "") {
      setError(true);
      return;
    }
    setError(false);
    setQuery(true);
  };

  return (
    <div className="form">
      <div>
        <input
          type="text"
          name="name"
          value={user}
          placeholder="Username"
          onChange={(e) => {
              setUser(e.target.value)
          }}
        />
        <input type="button" value="Refresh" onClick={() => handleUser()} />
      </div>
      {error ? <div style={{color:'red'}}>
         Field User is required!
      </div> : null}
    </div>
  );
}

export default UserForm;
