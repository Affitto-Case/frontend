import ButtonManagment from "./buttonManag"



export function DataManagment(){

    const url="/crud/";
    return(
        <>
            <div className="flex flex-col justify-center items-center mt-5">
                <h1 className="text-xl font-bold  mb-4 flex items-center">DATA MANAGEMENT</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
                <ButtonManagment title={"Users"} color="blue" path={`${url}user`}></ButtonManagment>
                <ButtonManagment title={"Hosts"} color="green" path={`${url}host`}></ButtonManagment>
                <ButtonManagment title={"Residences"} color="yellow" path={`${url}residence`}></ButtonManagment>
                <ButtonManagment title={"Bookings"} color="purple" path={`${url}booking`}></ButtonManagment>
                <ButtonManagment title={"Feedbacks"} color="pink" path={`${url}feedback`}></ButtonManagment>
                
            </div>
            </div>
        </>
    )
}

export default DataManagment