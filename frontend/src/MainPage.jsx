import { useState } from "react";

function MainPage() {

    //Hooks
    const [formData, setFormData] = useState({
        text: "",
        type: "",
        length: ""
    });
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData(e.target.value);
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
        setFormData("");
        setResult("");
    }

    return (
      <div className="grid grid-cols-1">

        <h1>Text Summarizer</h1>
        <h3>Paste your text and wait for the AI to summarize it</h3>
        
        <div className="border">
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div>
                    <textarea 
                        id="input"
                        value={formData.text}
                        onChange={handleChange}
                        rows={10}
                        cols={50}
                        placeholder="Paste text here: "
                    />
                </div>

                <select 
                    name="type" 
                    id="type"
                >
                    <option value="">Select Type</option>
                    <option value="Paragraphs">Paragraph</option>
                    <option value="Bullet Points">Bullet Points</option>
                </select>

                <select 
                    name="length" 
                    id="length"
                >
                    <option value="">Select Length</option>
                    <option value="Short">Short</option>
                    <option value="Medium">Medium</option>
                    <option value="Long">Long</option>
                </select>

            
                <div>
                    <button type="reset">Clear</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>


        <div className="border">
            {result}
        </div>

      </div>  
    )
}

export default MainPage;