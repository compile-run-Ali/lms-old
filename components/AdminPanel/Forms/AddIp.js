import Input from "@/components/Common/Form/Input";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Loader/Spinner";


const AddIp = () => {
  const router = useRouter();
  const [adminEdit, setAdminEdit] = useState(router.query.adminEdit);
  const [selfEdit, setSelfEdit] = useState(router.query.selfEdit);
  const [ip_address, setIp] = useState("");
  const [role, setRole] = useState("");
  const [rank, setRank] = useState("");
  const [loading, setLoading] = useState({});

  const roles = [
    {
      title: "Student",
    },
    {
      title: "Faculty",
    },
    {
      title: "Admin",
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

    const formData = new FormData();
    formData.append("ip_address", ip_address);
    formData.append("rank", rank);
    formData.append("role", "Faculty");

    if (adminEdit) {
      editIp(formData);
    } else {
      try {
        const new_ip = await axios.post(
          `/api/admin/ip/add_ip`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        router.push("/admin");
        /* if (new_ip.status === 200 && !new_ip.data) {
          router.push("/admin");

        } */
      } catch (error) {
        console.log("error", error)
        alert(
          "Another faculty member with this Ip Address already exists."
        );
      }
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setAdminEdit(router.query.adminEdit);
      setSelfEdit(router.query.selfEdit);

      if (router.query.adminEdit || router.query.selfEdit) {
        setIp(router.query.ip_address);
        setRole(router.query.role);
        setRank(router.query.rank);

      }
    } else {
      console.log("router is not ready");
    }
  }, [router]);

  const editIp = async (ip) => {
    ip.append("prev_ip", router.query.ip_address)
    try {
      const edited_ip = await axios.post(
        `/api/admin/ip/edit_ip`,
        ip,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (edited_ip.status === 200) {
        router.push("/admin");
      }
    } catch (error) {
      alert(
        "Another faculty member with this Ip address already exists."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4">
      <Spinner loading={loading} />
      <div className="p-4 grid grid-cols-2 gap-x-8 px-10">

        {/* <div className="mt-5">
          <label
            className="block mb-2 text-primary-black"
            htmlFor="role_input"
          >
            Role
          </label>
          <select
            required
            disabled={selfEdit === "true"}
            className="block w-full text-sm text-gray-900 px-2 h-11 border border-primary-black border-opacity-[0.15] rounded-md cursor-pointer bg-white  focus:outline-none"
            aria-describedby="role_input_help"
            id="role_input"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);

            }}
          >
            <option value="">Select Role </option>
            {roles.map((role) => (
              <option value={role.title} role={role.role} key={role.title}>
                {role.title}
              </option>
            ))}
          </select>
        </div> */}

        <div className="mb-4">
          <Input
            text="IP Address"
            type="text"
            value={ip_address}
            onChange={(event) => setIp(event.target.value)}
            required
            disabled={selfEdit === "true"}
          />
        </div>

        {/* <div className="mt-5">
          <label
            className="block mb-2 text-primary-black"
            htmlFor="rank_input"
          >
            Rank (Optional)
          </label>
          <select
            disabled={selfEdit === "true"}
            className="block w-full text-sm text-gray-900 px-2 h-11 border border-primary-black border-opacity-[0.15] rounded-md cursor-pointer bg-white  focus:outline-none"
            aria-describedby="rank_input_help"
            id="rank_input"
            value={rank}
            onChange={(event) => {
              setRank(event.target.value);
            }}
          >
            <option value="">Select Rank</option>
            {ranks.map((rank) => (
              <option value={rank} rank={rank} key={rank}>
                {rank}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      <div className="flex justify-left ml-10 mt-10 ">
        {!selfEdit && (
          <button
            className="bg-blue-800 hover:bg-blue-700 text-lg mt-4 mr-4 font-poppins text-white font-semibold py-2 px-10 rounded focus:outline-none focus:shadow-outline "
            type="submit"
          >
            {adminEdit ? "Save" : "Add IP"}
          </button>
        )}
      </div>

    </form>
  );
};

export default AddIp;