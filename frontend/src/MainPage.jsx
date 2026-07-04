import { useState } from "react";

function MainPage() {

    //Hooks
    const [formData, setFormData] = useState({
        text: "",
        type: "",
        length: ""
    });
    const [result, setResult] = useState("---");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    //Handles the submit and sends to backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Checks for a empty field
        if (formData.text === "" || formData.type === "" || formData.length === ""){
            setResult("Please fill all fields.")
        } else{
            const response = await fetch("http://localhost:5001/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: formData.text,
                    type: formData.type,
                    length: formData.length
                })
            });

            const data = await response.json();

            if(!response.ok) {
                setResult(data.message);
                return;
            }

            setResult(data.summary);
        }
    }

    //Resets the textboxes
    const handleReset = () => {
        setFormData({
            text: "",
            type: "",
            length: ""
        });
        setResult("---");
    }

    return (
      <div className="grid place-items-center px-6">
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 my-6">

            <div className="grid max-h-128">
                <form onSubmit={handleSubmit} onReset={handleReset} className="grid grid-cols-1 border border-[#0E7488] p-6 gap-y-6 rounded-md shadow-lg">

                    <textarea 
                        className="p-3 border border-[#0E7488] resize-none rounded-sm shadow-sm text-[#222222]"
                        id="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        rows={10}
                        cols={60}
                        placeholder="Paste or Type: "
                    />

                    <select 
                        name="type" 
                        id="type"
                        onChange={handleChange}
                        className="border border-[#0E7488] rounded-sm shadow-sm px-3 text-[#222222] bg-[#BFD9D4]"
                    >
                        <option value="">Select Result Type</option>
                        <option value="Paragraphs">Paragraph</option>
                        <option value="Bullet Points">Bullet Points</option>
                    </select>

                    <select 
                        name="length" 
                        id="length"
                        onChange={handleChange}
                        className="border border-[#0E7488] rounded-sm shadow-sm px-3 text-[#222222] bg-[#BFD9D4]"
                    >
                        <option value="">Select Result Length</option>
                        <option value="Short">Short</option>
                        <option value="Medium">Medium</option>
                        <option value="Long">Long</option>
                    </select>

                    <div className="grid grid-cols-[2fr_3fr] gap-6">
                        <button type="reset" className="rounded-sm shadow-sm text-[#222222] bg-[#9f9d9d]">Clear</button>
                        <button type="submit" className="rounded-sm shadow-sm text-[#222222] bg-[#C9AA22]">Summarize</button>
                    </div>

                </form>
            </div>

            <div className="border border-[#0E7488] h-128 p-6 rounded-lg shadow-md text-[#222222] whitespace-pre-wrap">
                {result}
            </div>

        </div>  
      </div>
    )
}

export default MainPage;