
import './App.css'

function App() {
  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom">
        <a href="/" className="d-flex align-items-center text-dark text-decoration-none">
          <span className="fs-4">Your Project Name</span>
        </a>
      </header>

      <div className="p-5 mb-4 bg-light rounded-3">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Bootstrap with Vite + React</h1>
          <p className="col-md-8 fs-4">
            Your Bootstrap integration is working!
          </p>
          <button className="btn btn-primary btn-lg" type="button">
            Example button
          </button>
        </div>
      </div>

      <div className="row align-items-md-stretch">
        <div className="col-md-6">
          <div className="h-100 p-5 text-white bg-dark rounded-3">
            <h2>Change the background</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <button className="btn btn-outline-light" type="button">
              Example button
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="h-100 p-5 bg-light border rounded-3">
            <h2>Add borders</h2>
            <p>You can also use Bootstrap's utility classes for quick styling.</p>
            <button className="btn btn-outline-secondary" type="button">
              Example button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;