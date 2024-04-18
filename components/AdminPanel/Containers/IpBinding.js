import handle from "@/pages/api/paper/[index]";
import { useRouter } from "next/router";
import React, { useState } from "react";

import DeleteModal from "../Modals/DeleteModal";
import axios from "axios";
import IpTable from "../Tables/IpTable";

export default function   Ip_Binding({ ip, setIp }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedIp, setSelectedIp] = useState("");

  const addIp = () => {
    router.push("/admin/add_ip");
  };
  const handleDelete = async () => {    
    try {
      const deletedIp = await axios.post("/api/admin/ip/remove_ip", {
        ip_address: selectedIp,
      });
      
      if (deletedIp.status === 200) {
        const newIp = ip.filter(
          (ip) => ip.ip_address !== selectedIp
        );
        setIp(newIp);
        setOpen(false);
      }
      
      router.reload();
    } catch (error) {
      alert("Error in deleting Ip");
      console.log("An error occurred:", error);
    }
  };
  
  return (
    <div>
      <DeleteModal
        setIsOpen={setOpen}
        isOpen={open}
        handleDelete={handleDelete}
      />
      <div className="mt-10 flex justify-end">
        <button
          onClick={addIp}
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add IP
        </button>
      </div>
      <IpTable
        setOpen={setOpen}
        ip={ip}
        setSelectedIp={setSelectedIp}
      />
    </div>
  );
}
