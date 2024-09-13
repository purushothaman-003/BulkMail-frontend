import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handleMessage(evt) {
    setMessage(evt.target.value);
  }

  function handleFile(event) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalEmail = emailList.map((item) => item.A);
      setEmailList(totalEmail);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setStatus(true);
    axios
      .post("http://localhost:5000/sendemail", { message: message, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully");
          setStatus(false);
        } else {
          alert("Failed");
          setStatus(false);
        }
      })
      .catch((error) => {
        alert("An error occurred while sending emails");
        setStatus(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Bulk Mail Sender</h1>

        <div className="mb-4">
          <textarea
            onChange={handleMessage}
            value={message}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the email text..."
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Upload Excel File with Emails:</label>
          <input
            type="file"
            onChange={handleFile}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-gray-600 mb-6">Total Emails in the file: {emailList.length}</p>

        <button
          onClick={send}
          className={`w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-red-500 to-blue-700 hover:from-red-400 hover:to-blue-600 focus:ring-4 focus:ring-blue-300 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${status ? "opacity-50" : ""}`}
          disabled={status}
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>
    </div>
  );
}

export default App;


