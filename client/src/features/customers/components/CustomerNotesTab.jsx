
const CustomerNotesTab = () => {
  const text =  "tggsfbzxcvgggggggggggg"
  return (
     <div className="main notesTab flex flex-col h-full ">
      <div className="notesHeader-container flex flex-col gap-3">
        <div className="notes-body box-border w-full h-full overflow-hidden rounded-lg border-[1px] border-solid border-[rgba(128,128,128,0.3)] p-1 ">
          <textarea
          className=" w-full resize-none border-none outline-none bg-transparent p-2"
            name="note"
            rows="5"
            cols="30"
            // value={text}
            placeholder="Notes ..."
            // onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="notes-controls flex items-center justify-end w-full gap-2">
          {/* <button className="cancel">cancel</button> */}
          <button
            className={`cursor-pointer text-[13px] font-bold py-[10px] px-[20px] rounded-2xl border-none 
              ${
              !(text.trim().length < 15) ? "readyToSave bg-black text-white" : "notReadyToSave text-[rgb(26, 26, 26)] bg-[#bbbbbb]"
            }
            `}
            // onClick={() => handleSaveCustomerNote()}
          >
            save
          </button>
        </div>
      </div>

      <div className="notes-history">
        <div className="title">Notes History</div>
        <div className="items">
          {[{id:1,noteContent:""}]?.length === 0 ? (
            <p className="emptyCartText">You don't have any notes</p>
          ) : (
            [{id:1,noteContent:""}]?.map((note) => (
              <div key={note.id} className="item">
                <div className="noteWrapper">
                  <div className="prevNote" contentEditable="false">
                    {note?.noteContent}
                  </div>
                </div>
                <span className="dateTime">{note?.noteDate}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerNotesTab