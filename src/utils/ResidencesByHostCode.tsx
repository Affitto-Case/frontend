import InputField from "@/components/common/inputField"
import TableActions from "@/components/residence/table"
import type { Residence } from "@/types"
import { useEffect, useState } from "react"


export function ResidenceByHostCode(){

    const[residences,setResidences] = useState <Residence[]>([])
    const[hostCode,setHostCode] = useState<string>("")

    const API_URL = import.meta.env.VITE_API_URL;
    useEffect(() => {
  if (!hostCode) {
    setResidences([]) 
    return
  }

  const loadResidences = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/residences/owner/host_code/${hostCode}`);
      if (!res.ok) {
        switch (res.status) {
          case 404:
            throw new Error('Risorsa non trovata');
          default:
            throw new Error('Errore nel recupero dei post');
        }
      }
      const residenceRes = await res.json();
      setResidences(residenceRes);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setResidences([]) 
      }
    }
  }

  loadResidences()
}, [hostCode])


    function changeValue(value:string){
        setHostCode(value);
    }


    return(
        <>
        <div className="container mx-auto px-6 py-8">

            <div className="flex flex-col justify-center items-center ">
                <InputField label="Host code" desc="Return all residences associated at host code" value={hostCode} onChange={changeValue}/>
            </div>

            <div> 
                <TableActions residences={residences} />
            </div>
        </div>
        </>
    )
}

export default ResidenceByHostCode