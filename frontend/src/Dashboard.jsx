import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:9090/user", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">Skill Share Platform</a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <form action="http://localhost:9090/logout" method="post" className="d-inline">
                  <button type="submit" className="btn btn-link nav-link">Logout</button>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card">
              <img src={user.picture} className="card-img-top" alt="Profile" />
              <div className="card-body text-center">
                <h5 className="card-title">{user.name}</h5>
                <p className="card-text text-muted">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <h2>Welcome to Your Dashboard</h2>
            <p>Start sharing your skills and connecting with others!</p>
            <div className="mt-4">
              <h4>Quick Actions</h4>
              <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action">Update Profile</a>
                <a href="#" className="list-group-item list-group-item-action">Add Skills</a>
                <a href="#" className="list-group-item list-group-item-action">Browse Skills</a>
                <a href="#" className="list-group-item list-group-item-action">Find Connections</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}