import React, { useState } from "react";

const page = () => {
  const [usrName, setUsrName] = useState("");
  const [usrEmail, setUsrEmail] = useState("");
  const [usrPswd, setUsrPswd] = useState("");
  const [isUserEditing, setIsUserEditing] = useState(false);
  return (
    <div>
      <div>
        <h2>User Details</h2>
        <input type="text" placeholder="Email" value={usrEmail} disabled />
        <input
          type="text"
          placeholder="Name"
          value={usrName}
          onChange={(e) => setUsrName(e.target.value)}
        />

        <input
          type="Password"
          placeholder="Password"
          value={usrPswd}
          onChange={(e) => setUsrPswd(e.target.value)}
        />
      </div>
    </div>
  );
};

export default page;
