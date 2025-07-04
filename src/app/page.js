'use client'

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Home() {
  return (
    <>
      <div className="bg-gray-300 h-[100vh] flex flex-col items-center justify-center">
        <div className="">
          <p className="text-center text-4xl">This is Game.</p>
          <div className="pt-4 pl-1">Lobby Online : {}</div>
        </div>
        <div className="flex justify-center py-20 ">
          <Link href="./game">
            <button
              className=" p bg-sky-500 hover:bg-sky-600 hover:text-white p-5 px-10 rounded-4xl"
            >
              <b>Play</b>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
