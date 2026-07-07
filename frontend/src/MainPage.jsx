import { useState } from "react";
import { jsPDF } from "jspdf";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { PiExport } from "react-icons/pi";


function MainPage() {

    //Hooks
    const [formData, setFormData] = useState({
        text: "",
        type: "",
        length: ""
    });
    const [result, setResult] = useState("Your summary will appear here.");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [isExported, setIsExported] = useState(false);

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
            try {
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
                    return;
                }

                setResult(data.summary);

            } catch {
                setResult("Something went wrong, try again later")
            } finally {
                setIsLoading(false);
            }
        }
    }

    //Resets everything
    const handleReset = () => {
        setFormData({
            text: "",
            type: "",
            length: ""
        });
        setResult("Your summary will appear here.");
        setIsLoading(false);
    }

    //Copies to clipboard
    const handleCopy = async () => {
        await navigator.clipboard.writeText(result);
        setIsCopied(true);

        setTimeout(() => setIsCopied(false), 3000);
    }

    //Exports result to a pdf
    const handleExport = async () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        //Page Properties
        const margin = 25.4;
        const lineHeight = 8.4
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - margin * 2;

        doc.setFont("ariel", "normal");
        doc.setFontSize(12);

        //Splits it into lines
        const lines = doc.splitTextToSize(result, contentWidth);

        let y = margin;

        //Starts at the top, writes a line, moves down, reaches end of page, adds a new page, restarts at top
        for (let i = 0; i < lines.length; i++){
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }

            doc.text(lines[i], margin, y);
            y += lineHeight;
        }

        doc.save("Summary.pdf");

        setIsExported(true);
        setTimeout(() => setIsExported(false), 10000);
    }

    //Styles
    const dropdown = "h-10 flex-1 border border-[#0E7488] text-sm md:text-base rounded-md shadow-md px-3 text-[#222222] bg-[#d1dfdc] focus:outline-none focus:ring-2 focus:ring-[#0E7488] cursor-pointer hover:text-[#2B54A1]";

    return (
      <div className="grid place-items-center px-16">
            
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 my-6">

            <div className="grid max-h-136">
                <form onSubmit={handleSubmit} onReset={handleReset} className="grid grid-cols-1 h-full border border-[#0E7488] p-6 gap-y-8 rounded-xl shadow-xl">

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
                            className={dropdown}
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
                            className={dropdown}
                        >
                            <option value="">Select</option>
                            <option value="Short">Short</option>
                            <option value="Medium">Medium</option>
                            <option value="Long">Long</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-[2fr_3fr] gap-6 h-10">
                        <button type="reset" className="rounded-md shadow-xl text-sm md:text-base text-[#222222] bg-[#b6b2b2] cursor-pointer hover:text-[#edf6f4] hover:font-bold">Clear</button>
                        <button type="submit" className="rounded-md shadow-xl text-sm md:text-base text-[#222222] bg-[#C9AA22] cursor-pointer hover:text-[#edf6f4] hover:font-bold">Summarize</button>
                    </div>

                </form>
            </div>

            <div className="grid grid-rows-[12fr_1fr] h-full max-h-136 border border-[#0E7488] rounded-xl overflow-hidden shadow-xl">

                <div className="output-box border-b border-b-[#0E7488] overflow-y-auto p-6 rounded-sm shadow-lg text-[#222222] whitespace-pre-wrap">
                    {isLoading ? "Loading..." : result}
                </div>

                <div className="grid grid-cols-2">
                    <button onClick={handleCopy} className="flex items-center justify-center gap-2 w-full bg-[#d1dfdc] rounded-bl-xl shadow-xl cursor-pointer hover:text-[#2B54A1] hover:font-bold">
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

                    <button onClick={handleExport} className="flex items-center justify-center gap-2 w-full bg-[#d1dfdc] rounded-br-xl border-l shadow-xl cursor-pointer hover:text-[#2B54A1] hover:font-bold">
                        {isExported ? (
                            <>
                                Exported! 
                                <PiExport color="green"/>
                            </>
                            ) : (
                            <>
                                Export 
                                <PiExport />
                            </>
                        )}
                    </button>
                </div>

            </div>

        </div>  
      </div>
    )
}

export default MainPage;