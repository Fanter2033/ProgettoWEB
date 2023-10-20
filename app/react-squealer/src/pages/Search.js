import React from "react";

//for sure gonna have an input
//TODO:IMPLEMENT
function Search() {
  return (
    <div id="" className="col-6 offset-3">
      <form className="d-flex mb-3" role="search">
        <input
          className="form-control ms-2 me-2 p-0"
          type="search"
          placeholder="   🔍"
          aria-label="Search"
        />
        <button className="custom-button" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

export default Search;
