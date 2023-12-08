import Creators from "./Creators";

function About() {
  return (
    <div className="p-5">
      <button className="red-button box" onClick={() => window.history.back()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-left"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
      </button>

      <h1 className="cool-font-link mt-5">SU DI NOI:</h1>
      <Creators />
      <br></br>
      <p className="cool-font-link">created with &#x2764;</p>
    </div>
  );
}

export default About;
