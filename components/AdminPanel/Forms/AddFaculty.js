import Input from "@/components/Common/Form/Input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Loader/Spinner";

const AddFaculty = () => {
  const router = useRouter();
  const [adminEdit, setAdminEdit] = useState(router.query.adminEdit);
  const [selfEdit, setSelfEdit] = useState(router.query.selfEdit);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pa_number, setPaNumber] = useState("");
  const [level, setLevel] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState({});

  useEffect(() => {
    if (router.isReady) {
      setAdminEdit(router.query.adminEdit);
      setSelfEdit(router.query.selfEdit);

      if (router.query.adminEdit || router.query.selfEdit) {
        setLoading({
          message: "Loading Data...",
        });
        axios
          .post("/api/admin/faculty/get_faculty_by_id", {
            faculty_id: router.query.faculty_id,
          })
          .then((res) => {
            setName(res.data.name);
            setPhoneNumber(res.data.phone_number);
            setPaNumber(res.data.pa_number);
            setLevel(res.data.level);
            setEmail(res.data.email);
            setPosition(res.data.position);
            setRank(res.data.rank);
            setLoading({
              message: "",
            });
          })
          .catch((err) => {
            setLoading({
              error: "Error in loading faculty data.",
            });
            console.log("error in get_faculty_by_id", err);
          });
      }
    } else {
      console.log("router is not ready");
    }
  }, [router]);

  const levels = [
    {
      title: "Comdt",
      level: 4,
    },
    {
      title: "CI",
      level: 3,
    },
    {
      title: "SI MT",
      level: 2,
    },
    {
      title: "SI SW",
      level: 2,
    },
    {
      title: "SI AT",
      level: 2,
    },
    {
      title: "Instructor",
      level: 1,
    },
    {
      title: "G2 Officer",
      level: 0,
    },
  ];

  const ranks = [
    "Captain",
    "Major",
    "Lieutenant Colonel",
    "Colonel",
    "Brigadier",
    "Major General",
    "Lieutenant General",
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    // if pnumber is not a number give alert
    if (isNaN(pa_number)) {
      alert("PA Number should be a number.");
      return;
    }

    if (isNaN(phoneNumber)) {
      alert("Phone Number should be a number.");
      return;
    }

    // if password and confirm password do not match give alert
    if (password !== cPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    const formData = new FormData();
    formData.append("pa_number", pa_number);
    formData.append("name", name);
    formData.append("phone_number", phoneNumber);
    formData.append("level", level);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("position", position);
    formData.append("rank", rank);
    formData.append("profile_picture", profilePicture)

    if (adminEdit) {
      formData.append("faculty_id", router.query.faculty_id);
      editFaculty(formData);
    } else {
      addFaculty(formData);
    }
  };
  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  const addFaculty = async (faculty) => {
    try {
      const new_faculty = await axios.post(
        `/api/admin/faculty/add_faculty`,
        faculty,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (new_faculty.status === 200 && !new_faculty.data.emailExists) {
        router.push("/admin");
      }
    } catch (error) {
      alert(
        "Another faculty member with this email or PA number already exists."
      );
    }
  };

  const editFaculty = async (faculty) => {
    try {
      const edited_faculty = await axios.post(
        `/api/admin/faculty/edit_faculty`,
        faculty,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (edited_faculty.status === 200) {
        router.push("/admin");
      }
    } catch (error) {
      alert(
        "Another faculty member with this email or PA number already exists."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <Spinner loading={loading} />
      <div className="p-4 grid grid-cols-2 gap-x-8 px-10">
        <div className="mb-4">
          <Input
            text="Name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={selfEdit === "true"}
          />
        </div>
        <div className="mb-4 ">
          <Input
            text="PA Number"
            type="String"
            value={pa_number}
            onChange={(event) => setPaNumber(event.target.value)}
            required
            disabled={selfEdit === "true"}
          />
        </div>
        <div className="mb-4">
          <Input
            text="Phone Number"
            type="text"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            required
            disabled={selfEdit === "true"}
          />
        </div>
        <div className="mb-4">
          <Input
            text="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={selfEdit === "true"}
          />
        </div>

        <div className="mt-5">
          <label className="block mb-2 text-primary-black" htmlFor="rank_input">
            Rank
          </label>
          <select
            required
            className="block w-full text-sm text-gray-900 px-2 h-11 border border-primary-black border-opacity-[0.15] rounded-md cursor-pointer bg-white  focus:outline-none"
            aria-describedby="rank_input_help"
            id="rank_input"
            value={rank}
            disabled={selfEdit === "true"}
            onChange={(event) => {
              setRank(event.target.value);
            }}
          >
            <option value="">Select Rank</option>
            {ranks.map((rank) => (
              <option value={rank} key={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <label
            className="block mb-2 text-primary-black"
            htmlFor="level_input"
          >
            Level
          </label>
          <select
            required
            disabled={selfEdit === "true"}
            className="block w-full text-sm text-gray-900 px-2 h-11 border border-primary-black border-opacity-[0.15] rounded-md cursor-pointer bg-white  focus:outline-none"
            aria-describedby="level_input_help"
            id="level_input"
            value={position}
            onChange={(event) => {
              setPosition(event.target.value);
              setLevel(
                event.target.options[event.target.selectedIndex].getAttribute(
                  "level"
                )
              );
            }}
          >
            <option value="">Select Level</option>
            {levels.map((level) => (
              <option value={level.title} level={level.level} key={level.title}>
                {level.title}
              </option>
            ))}
          </select>
        </div>
        {!selfEdit && !adminEdit && (
          <>
            <div className="mb-4">
              <Input
                text="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                text="Confirm Password"
                type="password"
                value={cPassword}
                onChange={(event) => setCPassword(event.target.value)}
                required
              />
            </div>
          </>
        )}
        {/* <div className="font-poppins mt-4">
            <label
              className="block mb-2  text-primary-black"
              htmlFor="file_input"
            >
              Upload Profile Pic
            </label>
            <input
              className="block w-full text-sm text-gray-900 h-11 border border-primary-black border-opacity-[0.15] rounded-md cursor-pointer bg-white  focus:outline-none"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={handleFileChange}
            />
            <p
              className="mt-1 pl-1 text-sm text-black-100 "
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px).
            </p>
          </div> */}
      </div>
      <div className="flex justify-left ml-10 mt-10 ">
        {!selfEdit && (
          <button
            className="bg-blue-800 hover:bg-blue-700 text-lg mt-4 mr-4 font-poppins text-white font-semibold py-2 px-10 rounded focus:outline-none focus:shadow-outline "
            type="submit"
          >
            {adminEdit ? "Save" : "Add Faculty"}
          </button>
        )}

        {(selfEdit || adminEdit) && (
          <button
            className="bg-red-800 hover:bg-red-700 text-lg mt-4 font-poppins text-white font-semibold py-2 px-10 rounded focus:outline-none focus:shadow-outline "
            type="button"
            onClick={() => {
              router.push({
                pathname: "/change_password",
                query: {
                  faculty_id: router.query.faculty_id,
                  recovery: adminEdit,
                  name: router.query.name,
                },
              });
            }}
          >
            {adminEdit ? "Recover Password" : "Change Password"}
          </button>
        )}
      </div>
    </form>
  );
};

export default AddFaculty;