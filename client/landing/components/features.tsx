'use client'

import { SITECONFIG_ROUTE } from "@/app/api/apiRoutes"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Features() {

  const [features, setFeatures] = useState([]);

  const [aim, setAim] = useState([]);


  useEffect(()=>{

    const GetMotoData = async ()=>{
      const response: any = await axios.get(SITECONFIG_ROUTE+"/App Moto/active/key");
     const name =response.data;
     setAim(name);
    }
    GetMotoData();

    const GetFeatureByName = async ()=>{
      const response: any = await axios.get(SITECONFIG_ROUTE+"/App feature/active/name");
     const name =response.data;
     console.log(name)
     setFeatures(name);
    }
    GetFeatureByName();
  },[])

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">

          {/* Section header */}

          {aim.map((data) => (
         <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
         <h2 className="h2 mb-4"> "{data.siteValue}"</h2>
         {/* <p className="text-xl text-gray-400">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> */}
       </div>
        ))}
          

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-16 items-start md:max-w-2xl lg:max-w-none" data-aos-id-blocks>

          {features.map((data) => (
            <div className="relative flex flex-col items-center" data-aos="fade-up" data-aos-anchor="[data-aos-id-blocks]">
              <svg className="w-16 h-16 mb-4" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <rect className="fill-current text-purple-600" width="64" height="64" rx="32" />
                <path className="stroke-current text-purple-100" d="M30 39.313l-4.18 2.197L27 34.628l-5-4.874 6.91-1.004L32 22.49l3.09 6.26L42 29.754l-3 2.924" strokeLinecap="square" strokeWidth="2" fill="none" fillRule="evenodd" />
                <path className="stroke-current text-purple-300" d="M43 42h-9M43 37h-9" strokeLinecap="square" strokeWidth="2" />
              </svg>
              <h4 className="h4 mb-2">{data.siteKey}</h4>
              <p className="text-lg text-gray-400 text-center">{data.siteValue}</p>
            </div>
          ))}

          </div>

        </div>
      </div>
    </section>
  )
}
