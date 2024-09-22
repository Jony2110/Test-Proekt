function Home() {
  return (
    <div className="p-6 flex-1 bg-gray-50">
      <h2>Task</h2>
      <div className="flex gap-3">
        <div>
          <div
            className="border-2 rounded-md text-center cursor-pointer"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            <h1>sdnjkfgjsdf s</h1>
            <p>Lorem ipsum <br /> dolor sit amet.</p>
            <img src="../../public/img/File.svg" alt="" />
          </div>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Hello!</h3>
              <p className="py-4">
                Press ESC key or click the button below to close
              </p>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default Home;
