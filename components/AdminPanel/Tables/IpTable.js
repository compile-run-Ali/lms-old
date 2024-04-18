import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import axios from "axios";

const IpTable = ({ ip, setSelectedIp, setOpen }) => {
  const router = useRouter();
  const [ipData, setIpData] = useState([]);

  useEffect(() => {
    setIpData(ip);
  }, [ip]);

  const openModal = (index) => {
    setOpen(true);
    setSelectedIp(ipData[index].ip_address);
  };

  const handleEditIp = (index) => () => {
    // Implement this
    router.push({
      pathname: "/admin/add_ip",
      query: {
        ip_address: ipData[index].ip_address,
        rank: ipData[index].rank,
        role: ipData[index].role,
        adminEdit: true,
      },
    });
  };

  const handleDeleteIp = async (index) => {
    const deletedIp = await axios.post(
      "/api/admin/faculty/remove_ip",
      {
        ip_address: ip[index].ip_address,
      }
    );
    if (deletedIp.status === 200) {
      const newIp = [...ipData];
      newIp.splice(index, 1);
      setIpData(newIp);
    }
  };

  return (
    <table className="table-auto mt-10 rounded-md font-poppins w-full text-left shadow-md">
      <thead>
        <tr className="bg-blue-800 rounded-md text-white">
          <th className="px-4 py-2 border border-gray-500">Role</th>
          <th className="px-4 py-2 border border-gray-500">IP Address</th>
          {/* <th className="px-4 py-2 border border-gray-500">Rank</th> */}
          <th className="px-4 py-2 border border-gray-500 text-center w-20">Edit</th>
          <th className="px-4 py-2 border border-gray-500 text-center w-20">Delete</th>
        </tr>
      </thead>
      <tbody>
        {ipData.map(
          (ip_bind, index) => (
            <tr key={index} className="bg-white">
              <td className=" px-4 py-2 border border-gray-500">{ip_bind.role}</td>
              <td className=" px-4 py-2 border border-gray-500">{ip_bind.ip_address}</td>
              {/* <td className=" px-4 py-2 border border-gray-500">{ip_bind.rank}</td> */}
              <td className="px-4 py-2 border border-gray-500 text-center w-20">
                <button
                  onClick={handleEditIp(index)}
                  className="bg-white text-blue-900 p-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                >
                  <MdEdit />
                </button>
              </td>
              <td className="px-4 py-2 border border-gray-500 text-center w-20">
                <button
                  onClick={() => {
                    openModal(index);
                  }}
                  className="bg-white text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default IpTable;
