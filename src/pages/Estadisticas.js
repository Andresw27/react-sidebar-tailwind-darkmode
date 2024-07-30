import React from "react";
import Layout from "../components/Layout";
import { BiBriefcaseAlt } from "react-icons/bi";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaMotorcycle } from "react-icons/fa";
function Estadisticas() {
  return (
    <Layout>
      <div>
        <div className="my-3 mx-4 flex gap-4">
          <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
            Estadisticas
          </p>

          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              id="datepicker-autohide"
              datepicker
              datepicker-autohide
              type="text"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Select date"
            />
          </div>
        </div>

        <div className="">
          <div className=" md:px-10 grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-emerald-100 bg-opacity-30 backdrop-blur-sm shadow-md">
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-emerald-100 shadow-lg">
                <BiBriefcaseAlt className="text-3xl" />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-4xl font-bold whitespace-nowrap">47</p>
                <p className="text-2xl text-gray-500 whitespace-nowrap">
                  Ordenes
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-amber-100 bg-opacity-30 backdrop-blur-sm shadow-md">
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-amber-100 shadow-lg">
                <MdOutlinePendingActions className="text-3xl" />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-4xl font-bold whitespace-nowrap">7</p>
                <p className="text-2xl text-gray-500 whitespace-nowrap">
                  Total Pendientes
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-blue-100 bg-opacity-30 backdrop-blur-sm shadow-md">
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 shadow-lg">
                <FaMotorcycle className="text-3xl" />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-4xl font-bold whitespace-nowrap">40</p>
                <p className="text-2xl text-gray-500 whitespace-nowrap">
                  Total Entregados
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-10">
          <div className=" md:px-10 grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-emerald-100 bg-opacity-30 backdrop-blur-sm shadow-md">
              {/* <div className="flex justify-center items-center w-16 h-16 rounded-full bg-emerald-100 shadow-lg">
              <BiBriefcaseAlt className="text-3xl" />
            </div>
            <div className="flex flex-col justify-center items-start">
              <p className="text-4xl font-bold whitespace-nowrap">47</p>
              <p className="text-2xl text-gray-500 whitespace-nowrap">
                Ordenes
              </p>
            </div> */}
{/* 
              <Bar
                data={{
                  labels: ["a", "b", "c"],
                  datasets: [
                    { label: "Pedidos", data: [200, 400, 5600] },
                    { label: "Pedidos", data: [200, 400, 5600] },
                  ],
                }}
              /> */}
            </div>

            <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-amber-100 bg-opacity-30 backdrop-blur-sm shadow-md">
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-amber-100 shadow-lg">
                <MdOutlinePendingActions className="text-3xl" />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-4xl font-bold whitespace-nowrap">7</p>
                <p className="text-2xl text-gray-500 whitespace-nowrap">
                  Total Pendientes
                </p>
              </div>
            </div>

            <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-blue-100 bg-opacity-30 backdrop-blur-sm shadow-md">
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 shadow-lg">
                <FaMotorcycle className="text-3xl" />
              </div>
              <div className="flex flex-col justify-center items-start">
                <p className="text-4xl font-bold whitespace-nowrap">40</p>
                <p className="text-2xl text-gray-500 whitespace-nowrap">
                  Total Entregados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Estadisticas;
