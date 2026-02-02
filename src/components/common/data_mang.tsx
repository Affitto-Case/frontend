import ButtonManagment from "./buttonManag"



export function DataManagment(){

    return(
        <>
            <div className="flex flex-col justify-center items-center mt-5">
                <h1 className="text-xl font-bold  mb-4 flex items-center">DATA MANAGEMENT</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
                <ButtonManagment title={"Users"} color="blue"></ButtonManagment>
                <ButtonManagment title={"Hosts"} color="green"></ButtonManagment>
                <ButtonManagment title={"Residences"} color="yellow"></ButtonManagment>
                <ButtonManagment title={"Bookings"} color="purple"></ButtonManagment>
                <ButtonManagment title={"Feedbacks"} color="pink"></ButtonManagment>
                
            </div>
            </div>
        </>
    )
}

export default DataManagment