import React, { useState } from "react";

const Test = () => {
  const [state, setState] = useState(false);
  const ceva = "asd";
  const showSomething = (e, altcv) => {
    e.preventDefault();
    console.log("asd");
    console.log(altcv);
  };
  return (
    <div>
      {state && (
        <form onSubmit={(e) => showSomething(e, ceva)}>
          <input type="text" />
          <button type="submit">Submit</button>
        </form>
      )}
      {!state && <p>Altceva</p>}
      <button onClick={() => setState((prevState) => !prevState)}>State</button>
    </div>
  );
};

export default Test;
