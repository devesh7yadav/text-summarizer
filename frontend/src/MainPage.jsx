import { useState } from "react";
import { LuCopy, LuCopyCheck } from "react-icons/lu";


function MainPage() {

    //Hooks
    const [formData, setFormData] = useState({
        text: "",
        type: "",
        length: ""
    });
    const [result, setResult] = useState("---");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    //Updates everything
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
            setIsLoading(true);
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
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            setResult(data.summary);
        }
    }

    //Resets everything
    const handleReset = () => {
        setFormData({
            text: "",
            type: "",
            length: ""
        });
        setResult("---");
    }

    //Copies to clipboard
    const handleCopy = async () => {
        await navigator.clipboard.writeText(result);
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 3000);
    }

    return (
      <div className="grid place-items-center px-6">
            
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 my-6">

            <div className="grid max-h-256">
                <form onSubmit={handleSubmit} onReset={handleReset} className="grid grid-cols-1 h-full border border-[#0E7488] p-6 gap-y-8 rounded-lg shadow-xl">

                    <textarea 
                        className="p-3 border border-[#0E7488] bg-[#d1dfdc] resize-none rounded-sm shadow-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#0E7488]"
                        id="text"
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        rows={10}
                        cols={60}
                        placeholder="Paste or Type: "
                    />

                    <div className="flex items-center">
                        <label className="w-12 text-sm md:text-base text-[#222222] mr-4">Type:</label>
                        <select 
                            name="type" 
                            id="type"
                            onChange={handleChange}
                            className="h-10 flex-1 border border-[#0E7488] text-sm md:text-base rounded-md shadow-md px-3 text-[#222222] bg-[#d1dfdc] focus:outline-none focus:ring-2 focus:ring-[#0E7488] hover:text-[#2B54A1]"
                        >
                            <option value="">Select</option>
                            <option value="Paragraphs">Paragraph</option>
                            <option value="Bullet Points">Bullet Points</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <label className="w-12 text-sm md:text-base text-[#222222] mr-4">Length:</label>
                        <select 
                            name="length" 
                            id="length"
                            onChange={handleChange}
                            className="h-10 flex-1 border border-[#0E7488] text-sm md:text-base rounded-md shadow-md px-3 text-[#222222] bg-[#d1dfdc] focus:outline-none focus:ring-2 focus:ring-[#0E7488] hover:text-[#2B54A1]"
                        >
                            <option value="">Select</option>
                            <option value="Short">Short</option>
                            <option value="Medium">Medium</option>
                            <option value="Long">Long</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-[2fr_3fr] gap-6 h-10">
                        <button type="reset" className="rounded-md shadow-xl text-sm md:text-base text-[#222222] bg-[#b6b2b2] hover:text-[#edf6f4] hover:font-bold">Clear</button>
                        <button type="submit" className="rounded-md shadow-xl text-sm md:text-base text-[#222222] bg-[#C9AA22] hover:text-[#edf6f4] hover:font-bold">Summarize</button>
                    </div>

                </form>
            </div>

            <div className="grid grid-rows-[12fr_1fr] h-full max-h-256 border border-[#0E7488] rounded-lg shadow-xl">

                <div className="output-box border-b border-b-[#0E7488] overflow-y-auto p-6 rounded-sm shadow-lg text-[#222222] whitespace-pre-wrap">
                    {isLoading ? "Loading..." : result}
                </div>

                <button onClick={handleCopy} className="flex items-center justify-center gap-2 w-full bg-[#d1dfdc] rounded-lg shadow-xl hover:text-[#2B54A1] hover:font-bold">
                    {isCopied ? (
                        <>
                            Copied! 
                            <LuCopyCheck color="green" />
                        </>
                        ) : (
                        <>
                            Copy 
                            <LuCopy />
                        </>
                    )}
                </button>

            </div>

        </div>  
      </div>
    )
}

export default MainPage;