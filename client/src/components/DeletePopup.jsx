import { useDeleteEventMutation } from "../services/ApiSlice"
const DeletePopup = ({ onClose , EventId }) => {
    const [deleteEvent] = useDeleteEventMutation()
    return (
        <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg text-white w-[90%] max-w-md ">
            <h2 className="text-xl mb-4">Are you sure you want to delete this Event?</h2>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-[#A3A3A3] rounded hover:bg-[#737373]">
                    Cancel
                </button>
                <button className="px-4 py-2 bg-[#EF4444] rounded hover:bg-[#DC2626]"
                onClick={async()=> {
                    await deleteEvent({id:EventId})
                    onClose()
                }}>
                    Confirm
                </button>
            </div>
        </div>
    )
}
export default DeletePopup