import React from 'react'

export default function Tabs({ active, setActive }) {

    return (
        <div className="border-b border-primary-black border-opacity-20 font-poppins">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-primary-black">
                <li className="mr-2 cursor-pointer" onClick={() => setActive("Faculty")}>
                    <a href="#" className={`inline-flex p-4 border-b-2 border-transparent ${active === "Faculty" ? "text-blue-800 border-b-2 border-blue-800" : ""} rounded-t-lg  group`}>
                        <svg aria-hidden="true" className={`w-5 h-5 mr-2 ${active === "Faculty" ? "text-blue-800" : ""} `} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>Faculty
                    </a>
                </li>
                <li className="mr-2 cursor-pointer" onClick={() => setActive("Courses")}>
                    <a href="#" className={`inline-flex p-4 ${active === "Courses" ? "text-blue-800 border-b-2 border-blue-800" : ""} rounded-t-lg active group`} aria-current="page">
                        <svg aria-hidden="true" className={`w-5 h-5 mr-2 ${active === "Courses" ? "text-blue-800 " : ""}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>Courses
                    </a>
                </li>
                <li className="mr-2 cursor-pointer" onClick={() => setActive("Assigned")} >
                    <a href="#" className={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg group ${active === "Assigned" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}>
                        <svg aria-hidden="true" className={`w-5 h-5 mr-2 ${active === "Assigned" ? "text-blue-800 " : ""} `} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>Assigned
                    </a>
                </li>
                <li className="mr-2 cursor-pointer" onClick={() => setActive("Exams")} >
                    <a href="#" className={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg group ${active === "Exams" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}>
                        <svg aria-hidden="true" className={`w-5 h-5 mr-2 ${active === "Exams" ? "text-blue-800 " : ""} `} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path></svg>Exams
                    </a>
                </li>
                <li className="mr-2 cursor-pointer" onClick={() => setActive("Students")}>
                    <a href="#" className={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg group ${active === "Students" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}>
                        <svg aria-hidden="true" className={`w-5 h-5 mr-2 ${active === "Students" ? "text-blue-800" : ""} `} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path></svg>Students
                    </a>
                </li>
                <li className="mr-2 cursor-pointer" onClick={() => setActive("Ip_Binding")}>
                    <a href="#" className={`inline-flex p-4 border-b-2 border-transparent rounded-t-lg group ${active === "Ip_Binding" ? "text-blue-800 border-b-2 border-blue-800" : ""}`}>
                        <svg className={`w-5 h-5 mr-2 ${active === "Ip_Binding" ? "text-blue-800" : ""} `} fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 20.234 20.234" space="preserve">
                            <g>
                                <path d="M6.776,4.72h1.549v6.827H6.776V4.72z M11.751,4.669c-0.942,0-1.61,0.061-2.087,0.143v6.735h1.53
                                        V9.106c0.143,0.02,0.324,0.031,0.527,0.031c0.911,0,1.691-0.224,2.218-0.721c0.405-0.386,0.628-0.952,0.628-1.621
                                        c0-0.668-0.295-1.234-0.729-1.579C13.382,4.851,12.702,4.669,11.751,4.669z M11.709,7.95c-0.222,0-0.385-0.01-0.516-0.041V5.895
                                        c0.111-0.03,0.324-0.061,0.639-0.061c0.769,0,1.205,0.375,1.205,1.002C13.037,7.535,12.53,7.95,11.709,7.95z M10.117,0
                                        C5.523,0,1.8,3.723,1.8,8.316s8.317,11.918,8.317,11.918s8.317-7.324,8.317-11.917S14.711,0,10.117,0z M10.138,13.373
                                        c-3.05,0-5.522-2.473-5.522-5.524c0-3.05,2.473-5.522,5.522-5.522c3.051,0,5.522,2.473,5.522,5.522
                                        C15.66,10.899,13.188,13.373,10.138,13.373z"/>
                            </g>
                        </svg>
                        IP Binding
                    </a>
                </li>
            </ul>
        </div>

    )
}


