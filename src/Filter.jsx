import { useState } from "react";

const Filter = (props) => {
  const [displayPersons, setDisplayPersons] = useState(props.persons);
  return (
    <>
      <h2>Filter here - </h2>
      <input onChange={props.onChange} />
    </>
  );
};

export default Filter;
