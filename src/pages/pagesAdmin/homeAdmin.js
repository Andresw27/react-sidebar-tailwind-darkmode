import React from "react";
import Layout from "../../components/Layout";
import { FaUser } from "react-icons/fa";

function homeAdmin() {
  return (
    <Layout>
      <div className="my-3 mx-10">
        <p className="md:text-3xl text-2xl text-zinc-600 dark:text-white text-start md:text-left font-semibold">
          Bienvenido
        </p>

        <div className="  grid grid-cols-4 mt-4">
          <div className="col-span-2 p-4 flex flex-col gap-6 ">
            <div className=" grid grid-cols-2 gap-4">
              <div className=" flex gap-4 w-auto h-auto p-4 border rounded-md bg-emerald-100 bg-opacity-30 backdrop-blur-sm shadow-md">
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-emerald-100 shadow-lg">
                  <FaUser className="text-3xl" />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-4xl font-bold whitespace-nowrap">1</p>
                  <p className="text-2xl text-gray-500 whitespace-nowrap">
                    Usuarios
                  </p>
                </div>
              </div>
              <div className="relative flex gap-4 w-auto h-auto p-4 border rounded-md bg-emerald-100 bg-opacity-30 backdrop-blur-sm shadow-md">
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-emerald-100 shadow-lg">
                  <FaUser className="text-3xl" />
                </div>
                <div className="flex flex-col justify-center items-start">
                  <p className="text-4xl font-bold whitespace-nowrap">1</p>
                  <p className="text-2xl text-gray-500 whitespace-nowrap">
                    Total Pedidos
                  </p>
                </div>
              </div>
            </div>

            <div className="h-72">
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3">
                        Product name
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Color
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Category
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Apple MacBook Pro 17"
                      </th>
                      <td class="px-6 py-4">Silver</td>
                      <td class="px-6 py-4">Laptop</td>
                      <td class="px-6 py-4">$2999</td>
                    </tr>
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Microsoft Surface Pro
                      </th>
                      <td class="px-6 py-4">White</td>
                      <td class="px-6 py-4">Laptop PC</td>
                      <td class="px-6 py-4">$1999</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        Magic Mouse 2
                      </th>
                      <td class="px-6 py-4">Black</td>
                      <td class="px-6 py-4">Accessories</td>
                      <td class="px-6 py-4">$99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-black">dd</div>
        </div>
      </div>
    </Layout>
  );
}

export default homeAdmin;
