import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState([]);

  const URL = "/api/persons";

  useEffect(() => {
    console.log("effect");
    axios.get(URL).then((response) => {
      // console.log("promise fulfilled");
      console.log(response.data);
      setDetails(response.data);
    });
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log(name);
    console.log(phone);
    const obj = { name: name, phoneNumber: phone };

    // const existingDetail = details.find((detail) => {
    //   return detail.name.trim() === name.trim();
    // });

    // console.log("-------------", existingDetail);
    // if (existingDetail) {
    //   window.confirm(`Do you want to replace ${name}?`) &&
    //     axios.put(`${URL}/${existingDetail.id}`, obj).then((response) => {
    //       console.log("Update called!");
    //       setDetails(
    //         details.map((detail) => {
    //           console.log(detail.id);
    //           return detail.name === name
    //             ? { ...response.data }
    //             : { ...detail };
    //         })
    //       );
    //       setName("");
    //       setPhone("");
    //     });
    //   setName("");
    //   setPhone("");
    // } else {
    try {
      axios.post(URL, obj).then((response) => {
        const newDetails = details.concat({
          name: response.data.name,
          phoneNumber: response.data.phoneNumber,
          id: response.data._id,
        });

        setDetails(newDetails);
        console.log(response.data);
        console.log(details)
        setName("");
        setPhone("");
      });
    } catch (e) {
      console.log(e);
    }
    // }
  };

  const nameChangeHandler = (e) => {
    setName(e.target.value);
  };

  const phoneChangeHandler = (e) => {
    setPhone(e.target.value);
  };

  const deleteHandler = (id) => {
    console.log("Delete clicked!");
    const canDelete = window.confirm("Do you want to delete the user details?");
    canDelete &&
      axios.delete(`${URL}/${id}`).then((response) => {
        console.log(response);
        setDetails(details.filter((obj) => obj.id !== id));
      });
  };

  return (
    <>
      <ul>
        {details.map((obj) => {
          return (
            <li key={obj._id}>
              <p>
                {obj.name} - {obj.phoneNumber}
                &nbsp;&nbsp;
                {
                  //<button onClick={() => deleteHandler(obj.id)}>Delete</button>
                }
              </p>
            </li>
          );
        })}
      </ul>

      <form onSubmit={submitHandler}>
        <label htmlFor="newName">Add name</label> &nbsp;
        <input
          name="newName"
          onChange={nameChangeHandler}
          type="text"
          required
          value={name}
          style={{ marginBottom: "8px" }}
        ></input>
        <br />
        <label htmlFor="newPhone">Add phone</label> &nbsp;
        <input
          name="newPhone"
          onChange={phoneChangeHandler}
          type="tel"
          required
          value={phone}
        ></input>
        <br />
        <br />
        <button>Submit</button>
      </form>
    </>
  );
};

export default App;
